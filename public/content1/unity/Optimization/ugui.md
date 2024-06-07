# UGUI 性能优化总结

官方文档：https://learn.unity.com/tutorial/optimizing-unity-ui

## 基础概念

### Canvas

Canvas 是一个 Native 层实现的 Unity 组件，被 Unity 渲染系统用于在游戏世界空间中渲染分层几何体（layered geometry）。
Canvas 负责把它们包含的 Mesh 合批，生成合适的渲染命令发送给 Unity 图形系统。以上行为都是在 Native C++代码中完成，我们称之为 Rebatch 或者 Batch Build，当一个 Canvas 中包含的几何体需要 Rebacth 时，这个 Canvas 就会被标记为 Dirty 状态。
Canvas 组件可以嵌套在另一个 Canvas 组件下，我们称为子 Canvas，子 Canvas 可以把它的子物体与父 Canvas 分离，使得当子 Canvas 被标记为 Dirty 时，并不会强制让父 Canvas 也强制 Rebuild，反之亦然。但在某些特殊情况下，使用子 Canvas 进行分离的方法可能会失效，例如当对父 Canvas 的更改导致子 Canvas 的大小发生变化时。
可以在 Profiler 中通过查看标志性函数 Canvas.BuildBatch 的耗时，来了解 Rebatch 的性能消耗。

### Canvas Renderer

几何体（layered geometry）数据是通过 Canvas Renderer 组件被提交到 Canvas 中。

### VertexHelper

顶点辅助类，用于保存 UI 的顶点、颜色、法线、uv、三角形索引等信息。

### Graphic

Graphic 是 UGUI 的 C#库提供的一个基类。它是为 Canvas 提供可绘制几何图形的所有 UGUI 的 C#类的基类。大多数 Unity 内置的继承 Graphic 的类都是通过继承一个叫 MaskableGraphic 的子类来实现，这使得他们可以通过 IMaskable 接口来被隐藏。Drawable 类的子类主要是 Image 和 Text，且 UGUI 已提供了同名组件。

### Layout

Layout 控制着 RectTransform 的大小和位置，通常用于创建复杂的布局，这些布局需要对其内容进行相对大小调整或相对位置调整。Layout 仅依赖于 RectTransforms，并且仅影响其关联 RectTransforms 的属性。这些 Layout 类不依赖于 Graphic 类，可以独立于 UGUI 的 Graphic 类之外使用。

### CanvasUpdateRegistry

这个单例类维护了 m_LayoutRebuildQueue 和 m_GraphicRebuildQueue 两个重建队列，在构造函数中监听了 Canvas 的 willRenderCanvases 事件，这个事件会在渲染前进行每帧调用。在回调函数 PerformUpdate() 函数中，遍历两个重建队列进行 UI 重建，并执行 ClipperRegistry 的 Cull 方法。

### Rebuild

Rebuild 是指 Layout 和 Graphic 组件的网格被重新计算，这个过程在 CanvasUpdateRegistry 中执行。
可以在 Profiler 中通过查看标志性函数 Canvas.SendWillRenderCanvas 的耗时，来了解 Mesh 重建的性能消耗。

### ICanvasElement

重建队列中维护的元素都继承自 ICanvasElement 接口。UI 重建的时候会调用它的 Rebuild 方法，继承它的类都会对这个函数进行重写，Unity 中几乎所有的 UI 组件都继承自这个接口。

## UI Batching

Batching 是指 Canvas 通过合并 UI 元素的网格，生成合适的渲染命令发送给 Unity 图形渲染流水线。Batch 的结果被缓存复用，直到这个 Canvas 被标为 dirty，当 Canvas 中某一个构成的网格改变的时候就会被标记为 dirty。

从 CPU 把数据发送到显卡相对较慢，合批是为了一次性发送尽可能多的数据。

batch build、batching、rebatch 等都是同一个概念。

计算批次需要按深度对网格进行排序，并检查它们是否有重叠、以及材质和纹理贴图是否相同等。

首先进行深度排序：按照 Hierarchy 窗口从上往下的顺序

- 不渲染的 UI 元素 Depth 为 -1（setactive 为 false，canvasgroup.alpha 为 0，disable），UI 下没有和其他 UI 相交时，该 UI 的 Depth 为 0。（相交指网格有重叠）
- 当前 UI 下面有一个 UI 与其相交，若两者贴图和材质相同时，它们 Depth 相同，否则上面的 UI 的 Depth 是下面 UI 的 Depth+1。
- 当前 UI 下面与多个 UI 相交，则取多个 UI 中 Depth 最高的元素（Max）与当前 UI 比较，若两者贴图和材质相同，则它们 Depth 相同，否则 Depth = Max + 1。
  排序完成后对 Depth，材质，贴图都相同的 UI 进行合批。（C++实现，未开放源码）

### 常见的打断合批的原因

- 同一深度 UI 元素使用了不同的材质或贴图，比如不同的图集或者字体。
- 使用了 Unity 的默认图片或默认字体，本质上和上面一条相同。
- 原本能够被合批的 UI 在 Hierarchy 层级相邻，即使 Z 轴不同，也能被合批。但是原本可以合批的 UI 的 Hierarchy 层级之间或下方插入了其他 UI，此时如果有 UI 的 Z 坐标不为 0 可能会打断合批。
- UI 使用了 Mask，其本身和子节点不参与外部合批。同深度、同材质、同贴图的 Mask 之间可以合批，不同 Mask 下的子节点也可以合批，被遮罩的子节点和未被遮罩的子节点不能合批。
- UI 使用了 RectMask2D，其子节点不参与外部合批。UI 本身参与外部合批，不同 RectMask2D 下的子物体不能合批。

### 调试工具

- 通过 Frame Debug 查看每个 DrawCall 的绘制：

注意：UGUI 的 drawcall 根据 Canvas 渲染模式的不同，所在的位置也有所不同：
Screen Space - Overlay 模式时，将会出现在 Canvas.RenderOverlays 分组。
Screen Space - Camera 模式时，将会出现在所选相机的 Camera.Render 分组，作为一个 Render.TransparentGeometry 子组。
World Space 渲染模式时，将会作为一个 Render.TransparentGeometry 子组，出现在每个可以观察到该 Canvas 的相机下。

- 通过 Profiler 的 UI Details 栏目查看所有 Canvas 的合批情况、打断合批的原因以及每个批次绘制了哪些内容：

### 合批优化策略

- UI 设计的时候应尽量保持 UI 使用相同的材质并处于同一深度（使用图集、注意 UI 的遮挡关系）；
- 不要使用默认图片和默认字体；
- 特殊情况可以使用艺术字代替文本参数合批（bmfont）；
- UI 的 Z 轴统一设置为 0；
- 如果需要使用遮罩，仅需要使用一个的时候用 RectMask2D（Mask 多两个 DrawCall），需要使用多个的时候使用 Mask（不同 Mask 的子节点参与合批）；

## UI Rebuild

Rebuild 分为 Layout Rebuild 和 Graphic Rebuild。

- Layout Rebuild
  要重新计算一个或者多个 Layout 组件所包含的 UI 组件的适当位置（以及可能的大小），有必要对 Layout 应用层次进行排序。在 GameObject 的 hierarchy 中靠近 root 的 Layout 可能会影响改变嵌套在它里面的其他 Layout 的位置和大小，所以必须首先计算。 为此，UGUI 根据层次结构中的深度对 dirty 的 Layout 组件列表进行排序。层次结构中较高的 Layout（即拥有较少的父 transform）将被移到列表的前面。然后，排序好的 Layout 组件的列表将被 rebuild，在这个步骤 Layout 组件控制的 UI 元素的位置和大小将被实际改变。关于独立的 UI 元素如何受 Layout 组件影响的详细细节，请参阅 Unity Manual 的 UI Auto Layout 章节。 [ 这就是为什么 unity 的布局组件一旦形成嵌套,套内组件将失效的原因 , unity 也暂时未开放布局执行层级顺序的接口 , 仅在 UGUI 代码中可见但未公开 ]
- Graphic Rebuild
  当 Graphic 组件被 rebuild 的时候，UGUI 将控制传递给 ICanvasElement 接口的 Rebuild 方法。Graphic 执行了这一步，并在 rebuild 过程中的 PreRender 阶段运行了两个不同的 rebuild 步骤：1.如果顶点数据已经被标为 Dirty（例如组件的 RectTransform 已经改变大小），则重建网格。2.如果材质数据已经被标为 Dirty（例如组件的 material 或者 texture 已经被改变），则关联的 Canvas Renderer 的材质将被更新。Graphic 的 Rebuild 不会按照 Graphic 组件的特殊顺序进行，也不会进行任何的排序操作。
  Rebuild 通常会触发 Batching。

### 源码分析

#### Rebuild 的执行过程

Canvas 每帧执行

CanvasUpdateRegistry 在构造函数中监听并注册回调函数 PerformUpdate。
下面是源码：

```C#
private void PerformUpdate()
        {
            UISystemProfilerApi.BeginSample(UISystemProfilerApi.SampleType.Layout);
            //清理队列中值为null或者被销毁的元素
            CleanInvalidItems();

            m_PerformingLayoutUpdate = true;
             //根据父节点多少排序(层级)
            m_LayoutRebuildQueue.Sort(s_SortLayoutFunction);

            for (int i = 0; i <= (int)CanvasUpdate.PostLayout; i++)
            {
                UnityEngine.Profiling.Profiler.BeginSample(m_CanvasUpdateProfilerStrings[i]);

                for (int j = 0; j < m_LayoutRebuildQueue.Count; j++)
                {
                    var rebuild = m_LayoutRebuildQueue[j];
                    try
                    {
                        //布局重建
                        if (ObjectValidForUpdate(rebuild))
                            rebuild.Rebuild((CanvasUpdate)i);
                    }
                    catch (Exception e)
                    {
                        Debug.LogException(e, rebuild.transform);
                    }
                }
                UnityEngine.Profiling.Profiler.EndSample();
            }

            //通知布局重建完成
            for (int i = 0; i < m_LayoutRebuildQueue.Count; ++i)
                m_LayoutRebuildQueue[i].LayoutComplete();

            m_LayoutRebuildQueue.Clear();
            m_PerformingLayoutUpdate = false;

            UISystemProfilerApi.EndSample(UISystemProfilerApi.SampleType.Layout);
            UISystemProfilerApi.BeginSample(UISystemProfilerApi.SampleType.Render);

            // now layout is complete do culling...
            UnityEngine.Profiling.Profiler.BeginSample(m_CullingUpdateProfilerString);

            //执行裁剪(cull)操作
            ClipperRegistry.instance.Cull();
            UnityEngine.Profiling.Profiler.EndSample();

            m_PerformingGraphicUpdate = true;

            for (var i = (int)CanvasUpdate.PreRender; i < (int)CanvasUpdate.MaxUpdateValue; i++)
            {
                UnityEngine.Profiling.Profiler.BeginSample(m_CanvasUpdateProfilerStrings[i]);
                for (var k = 0; k < m_GraphicRebuildQueue.Count; k++)
                {
                    try
                    {
                        var element = m_GraphicRebuildQueue[k];
                         //图形重建
                        if (ObjectValidForUpdate(element))
                            element.Rebuild((CanvasUpdate)i);
                    }
                    catch (Exception e)
                    {
                        Debug.LogException(e, m_GraphicRebuildQueue[k].transform);
                    }
                }
                UnityEngine.Profiling.Profiler.EndSample();
            }

            //通知图形重建完成
            for (int i = 0; i < m_GraphicRebuildQueue.Count; ++i)
                m_GraphicRebuildQueue[i].GraphicUpdateComplete();

            m_GraphicRebuildQueue.Clear();
            m_PerformingGraphicUpdate = false;
            UISystemProfilerApi.EndSample(UISystemProfilerApi.SampleType.Render);
        }
```

#### UI 是怎么加入重建队列的

查看源码发现，主要通过以下两个函数将待重建的 ICanvasElement 加入重建队列中：

一般通过脏标记来实现，以 Graphic 为例：
通过 SetLayoutDirty() 触发 LayoutRebuilder.MarkLayoutForRebuild(rectTransform) 将 UI 加入 m_LayoutRebuildQueue 重建队列中。
通过 SetVerticesDirty()、SetMaterialDirty()、以及 OnCullingChanged() 的调用将 UI 加入 m_GraphicRebuildQueue 重建队列中。
通过查看源码中哪些地方调用了这几个函数，就能知道什么情况下会触发 UI 的 Rebuild 了。
常见触发 Rebuild 的操作：
RectTransform 的 Width，Height，Anchor，Pivot 改变。
Text 的内容及颜色变化、设置是否支持富文本、更改对齐方式、设置字体大小等。
Image 组件颜色变化、更换 Sprite。
Slider 组件每次滑动时。
ScrollBar 组件每次滑动时。
SetActive、Enable 为 true 时。
Mask 勾选/取消勾选 Show Mask Graphic。
Material 改变。等等...
注意：改变 Position，Rotation，Scale 不会引起 UI 重建。
反射查看 Rebuild 队列：
可以在运行时查看哪些元素引起 UI 重建。

```C#
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;
using UnityEngine.UI;

public class LogRebuildInfo : MonoBehaviour
{
    IList<ICanvasElement> m_LayoutRebuildQueue;
    IList<ICanvasElement> m_GraphicRebuildQueue;

    private void Awake()
    {
        System.Type type = typeof(CanvasUpdateRegistry);
        FieldInfo field = type.GetField("m_LayoutRebuildQueue", BindingFlags.NonPublic | BindingFlags.Instance);
        m_LayoutRebuildQueue = (IList<ICanvasElement>)field.GetValue(CanvasUpdateRegistry.instance);
        field = type.GetField("m_GraphicRebuildQueue", BindingFlags.NonPublic | BindingFlags.Instance);
        m_GraphicRebuildQueue = (IList<ICanvasElement>)field.GetValue(CanvasUpdateRegistry.instance);
    }

    private void Update()
    {
        for (int j = 0; j < m_LayoutRebuildQueue.Count; j++)
        {
            var element = m_LayoutRebuildQueue[j];
            if (ObjectValidForUpdate(element))
            {
                Debug.LogErrorFormat("{0} 引起 {1} 网格布局重建", element.transform.name, element.transform.GetComponentInParent<Canvas>().name);
            }
        }

        for (int j = 0; j < m_GraphicRebuildQueue.Count; j++)
        {
            var element = m_GraphicRebuildQueue[j];
            if (ObjectValidForUpdate(element))
            {
                Debug.LogErrorFormat("{0} 引起 {1} 网格图形重建", element.transform.name, element.transform.GetComponentInParent<Canvas>().name);
            }
        }
    }

    private bool ObjectValidForUpdate(ICanvasElement element)
    {
        var valid = element != null;

        var isUnityObject = element is Object;
        if (isUnityObject)
            valid = (element as Object) != null; //Here we make use of the overloaded UnityEngine.Object == null, that checks if the native object is alive.

        return valid;
    }
}
```

3）Rebuild 具体做了些什么
以 Graphic 为例。
图形重建过程：

```C#
public virtual void Rebuild(CanvasUpdate update)
        {
            if (canvasRenderer == null || canvasRenderer.cull)
                return;

            switch (update)
            {
                case CanvasUpdate.PreRender:
                    if (m_VertsDirty)
                    {
                        UpdateGeometry();
                        m_VertsDirty = false;
                    }
                    if (m_MaterialDirty)
                    {
                        UpdateMaterial();
                        m_MaterialDirty = false;
                    }
                    break;
            }
        }
```

UpdateGeometry()
Graphic 中有个静态对象 s_VertexHelper 保存每次生成的 Mesh 信息(包括顶点，三角形索引，UV，顶点色等数据)，使用完后会立即清理掉等待下个 Graphic 对象使用。

我们可以看到，s_VertexHelper 中的数据通过 OnPopulateMesh 函数，进行填充，它是一个虚函数会在各自的类中实现，我们可以在自己的 UI 类中，重写 OnPopulateMesh 方法，实现自定义的 UI。
s_VertexHelper 数据填充之后，调用 FillMesh() 方法生成真正的 Mesh，然后调用 canvasRenderer.SetMesh() 方法来提交。SetMesh() 方法最终在 C++中实现，这也是 UGUI 的效率比 NGUI 高一些的原因，因为 NGUI 的 Mesh 合并是在 C#中完成的，而 UGUI 的 Mesh 合并是在 C++中底层完成的。
UpdateMaterial()
UpdateMaterial() 方法会通过 canvasRenderer 来更新 Material 与 Texture。

布局重建过程：
LayoutRebuilder 的 Rebuild() 方法：

PerformLayoutCalculation() 方法会递归计算 UI 元素的宽高（先计算子元素，然后计算自身元素）
ILayoutElement.CalculateLayoutInputXXXXXX() 在具体的实现类中计算该 UI 的大小。
PerformLayoutControl() 方法会递归设置 UI 元素的宽高（先设置自身元素，然后设置子元素）
ILayoutController.SetLayoutXXXXX() 在具体的实现类中设置该 UI 的大小。
UI 重建优化策略
动静分离：细分 Canvas，把相对静态的、不会变动的 UI 放在一个 Canvas 里，而相对变化比较频繁的 UI 就放在另一个 Canvas 里。注意：新增 Canvas 会打断合批，增加 DrawCall。
隐藏界面时，可用 CanvasGroup.Alpha=0，或者从 Camera 渲染层级里移除等方法隐藏，代替 SetActive。
对于血条、角色头顶名称、小地图标记等频繁更新位置的 UI，可尽量减低更新频率，如隔帧更新，并设定更新阈值，当位移大于一定数值时再赋值（重复赋相同的值，也会 SetDirty 触发重建）。
注意合理设计 UI 的层级，由于布局重建需要对 UI 进行排序，层级太深影响排序消耗。
4.OverDraw
Overdraw 是指一帧当中，同一个像素被重复绘制的次数。Fill Rate(填充率)是指显卡每帧每秒能够渲染的像素数。在每帧绘制中，如果一个像素被反复绘制的次数越多，那么它占用的资源也必然更多。Overdraw 与 Fill Rate 成正比，目前在移动设备上，FillRate 的压力主要来自半透明物体。因为多数情况下，半透明物体需要开启 Alpha Blend 且关闭 ZTest 和 ZWrite，同时如果我们绘制像 alpha=0 这种实际上不会产生效果的颜色上去，也同样有 Blend 操作，这是一种极大的浪费。
不幸的是，Canvas 绘制的所有几何体都在透明队列中绘制。也就是说，Unity UI 生成的几何体将始终使用 Alpha 混合从前向后绘制。从多边形栅格化后的每个像素都将被采样，即使它完全由其他不透明多边形覆盖。在移动设备上，这种高水平的透支可以快速超过 GPU 的填充率容量。
在场景【scene】下拉列表中选择 overdraw 就能看见，越亮的地方就是 overdraw 最多的部分。

### OverDraw 优化策略

- 减少 UI 重叠层级，隐藏处于底下被完全覆盖的 UI 面板。
- 对于需要暂时隐藏的 UI，不要直接把 Color 属性的 Alpha 值改为 0，UGUI 中这样设置后仍然会渲染，应该用 CanvasGroup 组件把 Alpha 值置零。
- 需要响应 Raycast 事件时，不要使用空 Image，可以自定义组件继承自 MaskableGraphic，重写 OnPopulateMesh 把网格清空，这样可以响应 Raycast 而又不需要绘制 Mesh。
- 打开全屏界面，关闭场景摄像机。对于一些非全屏但覆盖率较高的界面，在对场景动态表现要求不高的情况下，可以记录下打开 UI 时的画面，作为 UI 背景，然后关掉场景摄像机。
- 裁掉无用区域，镂空，对于 Sliced 类型的 Image 可以看情况取消 Fill Center。
- 保持 UI 上的粒子特效简单，尽量不要发生重叠。

## 其他优化

- 所有可点击组件例如 Image、Text 在创建时默认开启 RaycastTarget。当进行点击操作时，会对所有开启 RaycastTarget 的组件进行遍历检测和排序。实际上大部分的组件是不需要响应点击事件的，对于这些组件我们应该取消 RaycastTarget 属性，最好的方式是监听组件创建，在创建时直接赋值为 false，对于需要响应事件的组件再手动开启。
- Text 尽量不要使用 outline 或者 shadow 组件，会使顶点数量成倍增加。字体效果考虑 Shader 实现，或者直接让美术同学把阴影和描边做到字体里。

## 总结

常见 UI 性能问题：
DrawCall 过高，合并和提交批次花费大量 CPU 时间（Rebatch）。
UI 重建花费大量 CPU 时间（Rebuild）。
填充率过高，导致 GPU 渲染压力过大（overdraw）。
生成顶点花费大量 CPU 时间（通常来自文本）。
上面针对这些问题提出了一些通用的优化策略。但正如官方文档所说：
The core tension when optimizing any Unity UI is the balancing of draw calls with batching costs. While some common-sense techniques can be used to reduce one or the other, complex UIs must make trade-offs.
UI 优化的核心是 DrawCalls 和 Batching 开销的平衡。可以使用一些常识性技术来减少其中之一，但复杂的 UI 必须在两者间进行权衡。
举例：

修改 Graphic 的 Color 属性，其原理是修改顶点色，因此会引起网格的 Rebuild。而直接修改顶点色的好处是可以保证其材质不变，因此不会产生额外的 DrawCall。
在 UI 的默认 Shader 中存在一个 Tint Color 的变量，正常情况下，该值为常数(1,1,1)，且并不会被修改。如果是用脚本访问 Material，并修改其 Tint Color 属性时，对 UI 元素产生的网格信息并没有影响，因此就不会引起网格的 Rebuild。但这样做因为修改了材质，所以会增加一个 DrawCall。
这时候就得权衡一下是要更少的 DrawCall，还是要减少 UI 的重建更合适。

## 参考文章：

[https://edu.uwa4d.com/lesson-detail/126/482/0?isPreview=false](uwa drawcall rebatch rebuild particle 等)
[https://www.jianshu.com/p/5a39cfa74232](UI Rebuild 过程详解)
[https://blog.csdn.net/gaojinjingg/article/details/103565840?spm=1001.2101.3001.6650.3](Unity UGUI 优化与原理)
[https://www.drflower.top/posts/aad79bf1/](UGUI性能优化总结)
[https://zhuanlan.zhihu.com/p/350778355](OverDraw详解)
