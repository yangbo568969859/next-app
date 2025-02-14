# Unity中的渲染优化技术

## 影响性能的因素

- CPU
  - 过多的Draw Call
  - 复杂的脚本或物理模拟
- GPU
  - 顶点处理
    - 过多的顶点
    - 过多的逐顶点计算
  - 片元处理
    - 过多的片元（既可能是由于分辨率造成的，也可能是overdraw造成的）
    - 过多的逐片元计算
- 带宽
  - 使用了尺寸很大且未压缩的纹理
  - 分辨率过高的帧缓冲

### CPU和GPU优化

- CPU优化
  - 使用批处理技术减少draw call数目
- GPU优化
  - 减少需要处理的顶点数目
    - 优化几何体
    - 使用模型的LOD（Level of Detail）技术
    - 使用遮挡剔除（Occlusion Culling）技术
  - 减少需要处理的片元数目
    - 控制绘制顺序
    - 警惕透明物体
    - 减少实时光照
  - 减少计算复杂度
    - 使用Shader的LOD技术
    - 代码方面的优化
- 节省内存带宽
  - 减少纹理大小
  - 利用分辨率缩放

### Stats窗口

| 信息名称 | 描述 |
| ---- | --- |
| 每帧的事件和FPS | 在Graphics的右侧显示，给出了处理和渲染一帧所需的时间，以及FPS数目 |
| Batches | 一帧中需要进行的批处理数目 |
| Saved by batching | 合并的批处理数目，这个数目表示了批处理为我们节省了多少draw call |
| Tris Verts | 三角面片和顶点数目 |
| Screen | 屏幕大小以及它占用的内存大小 |
| SetPass | 渲染使用的Pass的数目，每个Pass都需要Unity的runtime来绑定一个新的shader，这可能造成CPU瓶颈 |
| Visible Skinned Meshes | 渲染的蒙皮网格数目 |
| Animations | 播放的动画数目 |

#### 减少draw call 数目

- 动态批处理
  - 优点是一切都是unity自动完成的，不需要我们自己做任何操作，而且物体是可以移动的
  - 缺点是限制很多，可能一不小心就会破坏这种机制，导致unity无法动态批处理一些使用了相同材质的物体
- 静态批处理
  - 优点是自由度很高，限制很少
  - 缺点是可能会占用更多的内存，而且经过静态批处理后的所有物体都不可以再移动了（即便在脚本中尝试改变物体的位置也是无效的）

##### 动态批处理

[限制](../Optimization/index.md#Bacthing的使用限制)

##### 静态批处理

#### 减少需要处理的顶点数目

- 优化几何体
- 模型的LOD技术
  - 当一个物体离摄像机很远时，模型上的很多细节是无法被察觉到的，因此，LOD允许当对象逐渐原理摄像机时，减少模型上的面片数量，从而提高性能
  - Unity中，可以使用LOD Group 组件来为一个物体构建一个LOD。我们需要为同一个对象准备多个包含不同细节程度的模型，然后把他们赋给LOD Group组件中的不同等级，Unity就会自动判断当前位置上需要使用哪个等级的模型
- 遮挡剔除技术
  - 用来消除那些在其他物件后面看不到的物件，这意味着资源不会浪费在那些看不到的顶点上，提高性能
  - 视锥体剔除只会剔除掉那些不在摄像机的视野范围内的对象，而不会判断视野中是否有物体被其他物体遮挡
  - 遮挡剔除会使用一个虚拟的摄像机遍历场景，从而构建一个潜在可见的对象集合的层级结构

#### 减少需要处理的片元数目

过多的片元造成GPU瓶颈，这部分优化重点在于减少overdraw；简单来说，overdraw指的就是同一个像素被绘制了多次

- 控制绘制顺序
  - 由于深度测试的存在，如果我们可以保证物体都是从前往后绘制的，那么就可以很大程度减少overdraw，这是因为，在后面绘制的物体由于无法通过深度测试，因此，就不会再进行后面的渲染处理
- 时刻警惕透明物体
- 减少实时光照和阴影

#### 节省带宽

- 减少纹理大小
  - 纹理图集可以帮助我们减少draw call数目
  - 使用多级渐远纹理技术(mipmapping)和纹理压缩
- 利用分辨率缩放
  - 过高的屏幕分辨率也是造成新跟那个下降的原因之一
  - 在Unity中设置屏幕分辨率可以直接调用 Screen.SetResulution，实际使用可能会遇到一些情况

#### 减少计算复杂度

- Shader的LOD技术
  - Shader的LOD技术可以控制使用的Shader等级，原理是：只有Shader的LOD值小于某个设定的值，这个Shader才会被使用，而使用了那些超过设定值的Shader的物体将不会被渲染
- 代码优化方面
  - 通常，游戏需要计算的对象、顶点和像素的数目排序是 对象`<顶点<`像素数，我们应该尽可能地把计算放在每个对象或逐顶点上
  - 尽可能使用低精度地浮点数进行运算
    - 最高精度地float/highp适用于存储诸如顶点坐标等变量
    - half/mediump 适用于一些标量、纹理坐标等
    - fixed/lowp 适用于绝大多数颜色变量和归一化后的方向矢量，在进行一些对精度要求不高地计算时，我们应尽量使用这种精度地变量
  - 尽可能不要使用全屏地屏幕后处理效果。如果美术风格实在是需要类似Bloom，扰动等特效，我们应尽量使用fixed/lowp进行低精度运算。那些高精度地运算可以使用查找表(LUT)或者转移到顶点着色器中处理，除此之外，尽可能把特效合并地一个shader中
  - 尽可能不要使用分支或循环语句
  - 尽可能避免使用类似sin、tan、pow、low等较复杂地数学运算
  - 尽可能不要使用discard操作，这会影响硬件地某些优化
