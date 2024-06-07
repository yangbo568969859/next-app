# UGUI

Unity 图形用户界面 Unity Graphical User Interface 界面显示系统

- 布局系统 (Rect Transform) (Layout Group)
- 事件机制 鼠标指针类、拖拽类、点选类、输入类
- 执行效能

## UGUI组件

### 基础控件

#### Canvas画布

- 简介：画布，绘制UI元素的载体，所有UI元素必须在Canvas之下，UI元素的绘制顺序依赖于层次面板中的顺序
- Render Mode 渲染方式
  - Screen Space-Overlay 覆盖模式：
    - UI元素将绘制在其他元素之前，且绘制过程独立于场景元素和摄像机设置，画布尺寸由屏幕大小和分辨率决定
    - Pixel Perfect 完美像素：若勾选，则会锐化屏幕显示效果
    - Sort Order 渲染顺序：在多个Canvas中，值越大越渲染到最上层
    - 应用：
  - Screen Space-Camera 摄像机模式：
    - 提供UICamera，canvas对象被控制在一个与摄像机固定的平面上，且绘制效果受摄像机参数的影响
    - Render Camera 渲染摄像机
    - Plane Distance 平面与摄像机的距离
    - 应用：3d物体遮盖UI、特效显示在UI前面
  - World Space 世界空间模式：画布渲染于世界空间，与场景中的其他3D物体性质相同

#### Image

- 图片转sprite Inspector面板 ```Texture Type```属性选择 ```Sprite (2D and UI)```
- Image Type
  - Simple 简单
  - Sliced 切割
  - Tiled 平铺
  - Filled 填充

#### Text

- 富文本语法
  - ```<b>粗体</b>```
  - ```<i>斜体</i>```
  - ```<size=13>字号</size>```
  - ```<color=red>颜色</color>```
  - 图文混排

#### Button

- Interactable 是否可交互
- Transition
  - None
  - Color Tint 可配置各种交互下按钮颜色
  - Sprite Swap 可配置多张图片
  - Animation 可提供自定义按钮动画

#### Toggle

- Is On 属性 判断复选框有没有选中

#### Slider

- Interactable 是否可交互
- Min Value
- Max Value
- Value

#### Scrollbar 滚动条

#### Rect Transform

派生自Transform，在UGUI控件上替代原有的变换组件，表示一个可容纳UI元素的矩形

- 属性
  - Pos 控件轴心点相对于自身锚点的位置
  - Anchor 锚点：UI元素的4个顶点与锚点的间距保持不变，锚点总是相对于父级，不能超越父物体范围； 表示点 PosX PosY Width Height；表示拉伸 Left Right Top Bottom
  - Pivot 轴心点：移动、旋转与缩放都围绕轴心点发生变化，0,0为左下顶点，1,1为右上顶点

```C#
// 当锚点不分开时，数值可以理解为UI宽高
// 物体大小 - 锚点间距
// size = rtf.sizeDelta

// RectTransformUtility
```

#### 事件数据

- BaseEventData 事件数据类的父类，其中包括EventSystem、InputModule和当前选中GameObject的引用
- AxisEventData 滚轮事件数据，只记录滚动的方向数据
- PointerEventData 点位事件数据，包括当前位置，滑动距离，点击时间以及不同状态下GameObject的引用

#### 事件输入

输入检测模块规定了对事件的处理逻辑和细节，比如处理鼠标点击时间、拖拽和移动等

其中TouchInputModule主要是面向触摸平台和移动设备的输入检测模块

standaloneInputModule主要是面向标准鼠标键盘的

#### 事件检测

#### 事件调度

事件逻辑处理模块的主要逻辑都集中在EventSystem类中

EventInterfaces类、EventTrigger类、EventTriggerType类定义了事件回调函数，ExecuteEvents类编写了所有执行事件的回调接口

EventSystem主要逻辑基本上都在处理由射线碰撞检测后引起的各类事件。比如，判断事件是否成立，若成立，则发起事件回调，若不成立，则继续轮询检查，等待事件的发生

EventSystem类是事件处理模块中唯一继承MonoBehavior类并在Update帧循环中做轮询的

#### UI模块

### 优化原理

- 在界面中默认一张图片一个Draw Calls
- 同一张图片多次显示仍然为一个Draw Calls

#### UGUI层级关系

1. Unity3d中的渲染顺序如下：
  不同的Camera的Depth
  相同Camera下的不同SortingLayer
  相同SortingLayer下的不同Z轴/Order in Layer

2. 改变控件之间的层级关系
  同一canvas下：
  改变控件transform的SiblingIndex,
  transform.GetSiblingIndex();
  transform.SetSiblingIndex(int index); //index值越大，越后渲染，层级越大，越显示在前面
  不同Canvas下： 设置Canvas下的Sort Order //Sort Order值越大，越后渲染，层级越大，越显示在前面

3. Transform.SetSiblingIndex() 设置规则

- SiblingIndex 从0开始依次向后增加1
- 设置 SiblingIndex 时，如果设置的索引>当前索引，原有索引上的元素至当前元素之下的元素一律向上移动(索引-1),就是把下面的通通上移使得目标索引位置空出，然后放入自己
- 设置 SiblingIndex 时，如果设置的索引<当前索引，原有索引上的元素至当前元素之上的元素一律向下移动(索引+1),就是把上面的通通下移使得目标索引位置空出，然后放入自己
- 设置 SiblingIndex 时，大于ChildCount-1 等于 ChildCount-1，小于0 无效
- 新加元素，索引一律为 ChildCount-1， 也就是最后一个

#### 动态改变 UI 层级渲染

- SetAsFirstSibling  是设置为最先渲染的，即会被后渲染的挡住
- SetAsLastSibling   是设置为最后渲染的，即会挡住比他先渲染的
- SetSiblingIndex(index) 设置层级，从0开始到childcount -1
  - 当n为0时，其效果与SetAsFirstSibling();相同
  - 但是当层级小于0时，其效果与SetAsLastSibling()一致
  - 当层级为大于等于transform.parent.childCount - 1时，其效果与SetAsLastSibling一致
