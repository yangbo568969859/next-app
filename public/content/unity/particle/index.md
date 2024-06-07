# 粒子系统

Unity在创作粒子系统时提供了两种解决方案，一种是内置粒子系统（Particle System），一般粒子系统都是指该系统，另一种是VisualEffect Graph粒子系统，可以理解为更高级的粒子系统，创作出的视觉特效更绚丽

区别

| 区别 | Particle System(内置粒子系统) | Visual Effect Graph(VFX Graph) |
| ---  |  -------        | ------------- |
| 基于XX运行 | CPU | GPU |
| 粒子数量 | 数千 | 数百万 |
| 渲染管线 | 支持全部管线 | 不支持内置渲染管线 |
| 物理系统 | 可与Unity物理系统交互 | 特定元素交互 |
| 创作使用 | 模块化，修改预定义的模块参数 | 节点可视化，节点连线，修改节点参数 |

## 说明（下面介绍都是内置粒子系统）

用于模拟一些流动的，没有形状的物质；如：液体，烟雾，火焰，爆炸，魔法效果等

## 模块

- 一个主模块 Main Module （基础参数）
- 22个子模块（扩展参数） 默认启用了 Emission/Shape/Renderer 三个模块

### 模块概述

| 模块名 | 说明 |
| -----  | --  |
| Main | 控制粒子初始状态，全局状态 |
| Emission | 发射速率，时间，波次 |
| Shape | 体积形状 |
| Velocity over Lifetime | 控制粒子在其生命周期内的速度 |
| Limit Velocity over Lifetime | 在其生命周期内限制粒子的速度 |
| Inherit Velocity | 控制粒子的速度如何随时间的推移而受到其父对象移动的影响 |
| Force over Lifetime | 通过此模块中指定的力来对粒子产生影响 |
| Color over Lifetime | 指定粒子的颜色和透明度在其生命周期中如何变化 |
| Color by Speed | 设置粒子的颜色根据粒子速度变化（每秒的距离单位） |
| Size over Lifetime | 控制粒子在其生命周期内的大小 |
| Size by Speed | 设置粒子的大小根据粒子速度变化（每秒的距离单位） |
| Rotation over Lifetime | 控制粒子在其生命周期内的旋转 |
| Rotation by Speed | 设置粒子的旋转根据粒子速度变化（每秒的距离单位） |
| External Forces | 修改力场对系统发射的粒子的影响 |
| Noise | 为粒子添加噪点 |
| Collision | 控制粒子如何与场景中其它游戏对象发生碰撞 |
| Triggers | 控制粒子的触发 |
| Sub Emitters | 在某粒子生命周期的阶段创建子粒子发射器 |
| Texture Sheet Animation | 控制贴图动画帧参数 |
| Lights | 控制粒子的实时光照 |
| Trails | 控制粒子的轨迹（拖尾） |
| Custom Data | Editor中定义要附加到粒子的自定义数据格式 |
| Renderer | 设置粒子的图像或网格如何被其它粒子变换，着色和绘制 |

### 主模块

- Start Color 颜色(可设置两个值，表示两个值之间取值)
- Start Speed 速度
- Start Size 大小
- Duration 周期 粒子系统工作时长
- Lopping 循环
- Prewarm 预热 是否先内部预热一个周期
- Start Lifetime 粒子的生命时长(存在时间)，默认5s
- Simulation Space 模拟空间
  - Local 本地空间（以粒子发生器为中心 火焰的尾巴）
  - World 世界空间（使用世界坐标系 泡泡枪）
- Max Particles 一个粒子系统最多多少个粒子（默认1000）

### 子模块

#### Emission 发射的频率

- 匀速发射
  - Rate over Time 时间匀速 以1s时间，发射N个粒子
  - Rate over Distance 距离匀速 每前进1m，发射N个粒子，针对运动的物体
- 爆发式发射
  - Bursts
    - Time 爆发发生的时间
    - Count 爆出多少个粒子
    - Cycles/Interval 爆炸次数、间隔
    - Probability 爆炸可能的概率，0表示不会爆炸

#### Shape 粒子发生器的形状

该模块用于定义粒子的发射体积形状，以及发射方向

- Shape 形状
  - 有Sphere(球体)、Hemisphere(半球)、Cone(锥体)、Donut(圆环体)、Box(正方体)这些预设体积发射器
  - Mesh\Mesh Renderer\Skinned Mesh Renderer、Sprite\Sprite Renderer这些依据网格或精灵图来作为发射器的预设选项
  - Circle(圆圈)、Edge(边)、Rectangle(矩形)这些2D发射器
- Texture 在发射粒子形状表面贴上图片纹理，相当于套层壳，没有设置值，则不会有下面几个属性
  - Clip Channel 裁剪通道RGBA
  - Clip Threshold 裁剪阈值 0-1 9代表全通过
  - Color affects Particles 粒子受到纹理颜色影响而改变颜色
  - Alpha affects Particles 粒子收到纹理透明度的影响而改变透明度
  - Bilinear Filtering 双线过滤，对像素比较少的纹理进行优化
- Positon Rotation Scale 类似于Transform的功能
- Align To Direction 根据初始行进方向定向粒子，也就是粒子固定朝着初始方向行进
- Randomize Direction 将粒子方向随机朝向某处，设置0无效，1粒子方向完全随机
- Spherize Direction 将粒子方向朝球面方向混合，从他们的变换中心向外行进，设置为0时，此设置不起作用。设置1时，粒子方向从中心向外
- Randomize Position 距离原有发射点的位置进行随机化 0无效，1完全生效

#### Renderer 粒子的显示

该模块决定了粒子的图像或网格如何被其它粒子变换，着色和过度绘制

- Render Mode
  - Billboard 由粒子系统控制的小纸片，总是面向摄像机
  - Stretched Billboard 拉伸
  - Horizontal Billboard 水平公告牌
  - Vertical Billboard 垂直公告牌
  - Mesh 网格
  - None
- Material 选择图片或mesh的材质
- Sort Mode
  - By Distance 按照粒子距活动摄像机的距离
  - Oldest in Front 生命周期最长的先被渲染
  - Youngest in Front 生命周期最短的先被渲染
- Sorting Fugde 粒子系统与粒子系统之间的渲染次序，值越小，优先级越高
- Min Particle Size 单个粒子的最小粒度，占据视口多少，Mesh渲染模式不可用
- Max Particle Size 单个粒子的最大粒度，占据视口多少，Mesh渲染模式不可用
- Render Alignment 渲染对齐方向
  - View 面向摄像机
  - World 与世界轴对齐
  - Local 与挂载游戏对象的transform组件对齐
  - Facing 面向由活动摄像机的游戏对象的transform组件定义的直接位置
  - Velocity 与其速度矢量方向相同
- Flip 使一些粒子水平/垂直翻转，值越大，翻转次数越多
- Allow Roll 控制面向摄像机的粒子是否可以围绕摄像机Z轴旋转
- Pivot 修改旋转粒子的中心轴心店，此值时粒子大小的乘数
- Visualize Pivot 在Scene窗口中预览每个粒子的pivot
- Masking 设置粒子与Sprite遮罩交互时的行为方式
  - No Masking 默认选项，不与场景中任何Sprite遮罩交互
  - Visible Inside Masking 粒子在Sprite遮罩内部可见
  - Visible Outside Masking 粒子在Sprite遮罩外部可见

#### Custom Data 模块

Custom Data 允许在Editor中定义要附加到粒子的自定义数据格式

自定义数据有两种格式（该模块和Renderer模块的Custom Vertex Streams作用差不多）

- Vector
- Color

#### Velocity Over Lifetime

控制粒子在其生命周期内的速度

- Linear XYZ 粒子在XYZ轴的线性速度
- Space 指定线性速度参照的坐标空间  Local|World (仅对Linear生效)
- Orbital XYZ 粒子绕某个轴旋转的轨道速度
- Offset XYZ 粒子所绕旋转轴的偏移量
- Radial 粒子原理/朝向中心位置的径向速度
- Speed Modifier 对上述参数乘以一个量值

说明：对于上述参数的合理应用可以做到很炫的效果，比如漩涡，轮回圈，螺纹，螺旋攻击等，主要是修改Linear用以指定方向，修改Orbital用于使粒子围绕某轴旋转。主模块的初始速度设置为0，这样更加方便参数计算修改

#### Limit Velocity Over Lifetime

控制粒子速度在其生命周期内如何降低

- Separate Axes 按照XYZ轴来分别设置限速值
- Speed 粒子在其生命周期内的最大速度限制，若超过该值，则通过Dampen对速度降低
- Space 参照Local/World，启用Separate Axes时，此选项生效
- Dampen 当粒子速度超过速度限制时，会通过Dampen以一定的比例衰减速度直到达到Speed设定的值
- Darg 对粒子速度施加线性阻力（模拟空气阻力），作用于全局的，不受上面参数影响
- Multiply by Size 开启后，较大的粒子会更大程度的受到阻力系数的影响
- Multiply by Velocity 启用后，较快的粒子会更大程度的受到阻力系数的影响

说明：该模块本质上和Velocity Over Lifetime是相对的，一个控制速度，一个限制速度，很少有在一起使用的场景。该模块主要使用场景是爆炸（初始速度很高，然后逐渐减弱到一个均值下落速度），子弹，炮弹等

#### Force Over Lifetime

力对粒子在生命周期的影响

- XYZ 按照XYZ轴施加力到每个粒子上
- Space 参照坐标系
- Randomize 使用Two Constants或Two Curves模式时，该属性生效，此属性会导致在每个帧上定义的范围内选择新的作用力方向，因此会产生更动荡，更不稳定的运动

#### Color Over Lifetime

用于设置在其生命周期内颜色变化

点击颜色部分会弹出颜色编辑窗口，这里可以编辑Color和Alpha

#### Color by Speed

让粒子颜色随速度变化而变化

- Color 颜色渐变
- Speed Range 将颜色渐变映射到速度范围的上限和下限 0代表白色，1代表绿色

#### Size Over Lifetime

- Separeate Axes 是否在每个轴向独立控制
- Size 通过一条曲线来定义粒子在其生命周期内的大小

#### Size by Speed

- Separeate Axes 是否在每个轴向独立控制
- Size 通过一条曲线来定义粒子在其生命周期内的大小
- Speed Range 速度范围的上限和下限

#### Rotation Over Lifetime

- Separeate Axes 是否在每个轴向独立控制
- Angular Velocity 旋转角速度

#### Rotation by Speed

- Separeate Axes 是否在每个轴向独立控制
- Angular Velocity 旋转角速度，根据速度区间设置
- Speed Range 速度范围的上限和下限，只有在Angular Velocity选择了曲线或双曲线时该参数才能使用，因为角速度是要动态的该模块才有意义

#### Noise 噪点

- Separate Axes 分离轴，在每个轴上独立控制（如果不想让粒子不局限于原地打转，而是朝着某方向跌跌撞撞，建议打开此设置，并把其中某个轴设置的比其他轴大一点）
- Strength 强度，控制粒子的波动强度（关于强度和频率，如果想做类似于吹泡泡的运动轨迹，可以将其强度拉高，频率降低，产生更加柔和的，飘飘的感觉，同时配合主模块Simulation Speed属性，将整体速度降低）
- Frequency 频率，控制粒子改变行进方向的频率以及方向变化的突然程度
- Scroll Speed 噪点图的滚动速度 （关于Scroll Speed 值越大，噪声图滚动幅度越大，我们可以在组件右侧看到预览图，这个属性是为了给粒子增加更多的不可预测性，动态的去不断更改粒子的运动轨迹，使其每次都不一直）
- Damping 阻尼，若启用，则强度与频率成正比
- Octaves 通过重叠噪点图来产生最终噪声 （关于重叠噪声图，通过增加噪点层，可以更加丰富粒子移动的细节效果，模拟出更加细微的随机效果）
- Octave Multiplier 每个附加的噪点层，按此比例降低强度（默认0.5）
- Octave Scale 每个附加的噪点层，按此乘数调整频率（默认2）
- Quality 低质量可显著降低性能成本，但也失去了丰富度 （默认High(3D)）
- Remap 将最终噪声值重新映射到不同的范围
- Position Amount 控制噪点对粒子位置影响程度的乘数
- Rotation Amount 控制噪点对粒子旋转影响程度的乘数
- Size Amount 控制噪点对粒子大小影响程度的乘数

#### Collision

控制粒子如何与场景中的游戏对象发生碰撞

该模式分为两种类型，分别时Planes和World，通过这两种类型设置粒子是否与地面碰撞还是与世界中的所有物体碰撞

Planes 通过获取游戏对象的Transform来沿着XZ轴生成一个无限大的平面，Y轴为其平面法向（Planes比World模式极端量少，但Planes仅能对平面产生一个碰撞，适用于简易房间，地板等场景，Planes是可以叠加的，并不是只能设置一块）

- Visualization 控制平面的可视化时网格还是平面
- Scale Plane 控制平面的可视化大小，注意：实际碰撞平面是无限大的，该选项仅供开发者在Scene窗口中使用
- Dampen 粒子碰撞后损失的速度比例
- Bounce 粒子碰撞后从表面反弹的速度比例
- Lifetime Loss 粒子碰撞后损失的总生命周期比例
- Min Kill Speed 碰撞后运动速度低于此速度的粒子将从系统中移除
- Max Kill Speed 碰撞后运动速度高于此速度的粒子将从系统中移除
- Radius Scale 允许调整粒子碰撞球体的半径，使其更贴近粒子图形的可使边缘
- Send Collision Messages 如果启用此属性，可从脚本中通过OnParticleCollision函数检测粒子碰撞
- Visualize Bounds 在 Scene 视图中将每个粒子的碰撞边界渲染为线框形状

World

- Mode 碰撞模式 3D/2D
- Dampen
- Bounce
- Lifetime Loss
- Min Kill Speed
- Max Kill Speed
- Radius Scale
- Collision Quality 碰撞质量
  - Collision Quality
    - High 碰撞始终使用物理系统来检测碰撞结果。此设置最耗费资源也是最准确的选项
    - Medium 对之前的碰撞进行缓存，之后如果有重复则调用此部分缓存，没有再查询物理系统，此设置仅适用于从不移动的静态碰撞体
    - Low 对之前的碰撞进行缓存，之后如果有重复则调用此部分缓存，没有再查询物理系统，比Midium查询物理系统次数更低，此设置仅适用于从不移动的静态碰撞体
  - Collides width 选择粒子与之碰撞的层
  - Max Collision Shapes 粒子碰撞可包括的碰撞形状（Mesh）的个数，且地形优先；默认256，也就是说粒子可与256个不同的mesh碰撞，再多一个就不生效了
  - Enabled Dynamic Collider 粒子是否相响应与刚体碰撞体的碰撞
- Collider Force 粒子碰撞后，对刚体碰撞体施加作用力
  - Multiply By Collision Angle 向碰撞体施力时，根据粒子与碰撞体之间的碰撞角度来缩放力的强度。
  - Multiply By Collision Speed 向碰撞体施力时，根据粒子的速度来缩放力的强度。快速移动的粒子会比较慢的粒子产生更大的力
  - Multiply By Collision Size 向碰撞体施力时，根据粒子的大小来缩放力的强度。较大的粒子会比较小的粒子产生更大的力
- Send Collision Messages
- Visualize Bounds

#### Triggers

控制粒子与场景中碰撞体的触发(需要指定Colloders列表参数，该属性用于确定粒子将与哪些碰撞体发生触发事件)

- Inside 粒子在碰撞体的边界内
  - Callback 允许在OnParticleTrigger回调函数中访问粒子
  - Kill 销毁粒子；无法使用回调
  - Ignore 忽略粒子；无法使用回调
- Outside 粒子在碰撞体的边界外
- Enter 粒子进入碰撞体的边界
- Exit  粒子退出碰撞体的边界
- Collider Query Mode
- Radius Scale 允许调整粒子碰撞球体的半径，使其更贴近粒子图形的可使边缘 默认1
- Visualize Bounds 在 Scene 视图中将每个粒子的碰撞边界渲染为线框形状

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestParticleTriggers : MonoBehaviour
{
    ParticleSystem ps;
    List<ParticleSystem.Particle> enters = new List<ParticleSystem.Particle>();
    List<ParticleSystem.Particle> exits = new List<ParticleSystem.Particle>();
    void Start()
    {
        ps = GetComponent<ParticleSystem>();
    }

    private void OnParticleTrigger() {
        int numEnter = ps.GetTriggerParticles(ParticleSystemTriggerEventType.Enter, enters);
        int numExit = ps.GetTriggerParticles(ParticleSystemTriggerEventType.Exit, exits);

        for(int i=0;i<numEnter;i++){
            ParticleSystem.Particle p = enters[i];
            p.startColor = new Color32(255, 0, 0, 255);
            enters[i] = p;
        }

        for(int i=0;i<numExit;i++){
            ParticleSystem.Particle p = exits[i];
            p.startColor = new Color32(0, 255, 0, 255);
            exits[i] = p;
        }
        ps.SetTriggerParticles(ParticleSystemTriggerEventType.Enter, enters);
        ps.SetTriggerParticles(ParticleSystemTriggerEventType.Exit, exits);
    }
}
```

#### Inherit Velocity

控制粒子的速度如何随时间推移而受到其父对象的影响

- Mode 指定如何将发射器速度应用于粒子
  - Current 发射器的当前速度将应用于每一帧上的所有粒子。例如：如果发射器减速，所有粒子也将减速
  - Initial 每个粒子出生时将施加一次发射器的速度。粒子出生后对发射器速度的任何改变都不会影响该粒子
- Multiplier 粒子应该继承速度的比例

#### Sub Emitters

在粒子生命周期阶段创建附加粒子发射器

- 触发时机
  - Birth 粒子被创建时触发
  - Collision 粒子于对象发生碰撞时触发
  - Death 粒子销毁时触发
  - Trigger 粒子与触发碰撞体相互作用时触发
  - Manual 仅在通过脚本请求时触发 (ParticleSystem.TriggerSubEmitter)
- 可被继承的属性
  - Nothing 不继承任何属性
  - Everything 继承下面几个
  - Color 颜色
  - Size 大小
  - Rotation 旋转
  - Lifetime 生命周期
  - Duration 持续时间

#### Texture Sheet Animation

将一组纹理视为动画进行控制播放

- Mode
  - Grid 将粒子材质分割成多张图片控制播放，比如下面示例的纹理图，通过Tiles属性控制XY轴方向分别切割几份
    - Tiles 纹理如何被切割
    - Animation 指定动画帧如何被播放
  - Sprites 将渐变效果的纹理图转为精灵图并分割成多份，然后添加到当前模块，粒子系统便会根据这些精灵图来控制播放动画效果
- Time Mode 选择粒子系统对动画中的帧采样的方式
  - LifeTime 在生命周期内使用动画曲线对帧进行采样
    - Frame Over Time 横轴是粒子生命周期，纵轴是精灵图索引（随生命周期依次播放）
  - Speed 基于粒子速度的采样帧，速度范围指定帧选择的最小和最大速度范围
    - Speed Range 通过动画将定义范围内的速度重新映射为0-1值
  - FPS 根据指定的每秒帧数值对帧进行采样
    - FPS 指定每秒帧数
- Start Frame 从第几帧开始
- Cycles 帧动画序列在粒子生命周期内重复的次数
- Affectd UV Channels 指定哪些UV通道将被动画化

实现火焰思路

- 火焰本身的光源是使用了Light模块，Ratio设置为0.5即可，随着火焰粒子的消亡和新生，实现忽明忽暗的效果
- 火焰粒子增加 Color Over Lifetime模块，在粒子生命周期开始和结束部分增加了透明，做到渐隐渐显效果
- 火焰粒子增加Noise模块，不需要位置做变动，在生命周期内变动一下大小和轻微的旋转即可
- 主模块和发射器以及Shape模块设置，初始速度设置为0，初始大小来一个随机，粒子生命周期设置5-10即可，Rate Over Time设置2，每秒发射两个粒子即可，发射粒子方向朝着天空即可

#### Light

将实时光照添加到粒子上；Lights模块主要用于为粒子效果快速添加实时光照，注意，粒子本身使用了自发光材质，但粒子对环境的照亮，则是Lights模块添加的实时光效果

- Light 获取一个光照Prefab来描述单个粒子的光照
- Ratio 粒子是否接收光照的比率 0-1之间
- Random Distribution true则按Ratio值随机分配光照（0.5代表一般的概率），false则按Ratio值定期分配光照（0.5代表隔一个粒子才被分配光照）
- Use Particle Color 光照颜色（Color）是否受到粒子本身颜色的影响
- Size Affects Range 光照范围（Range）是否受到粒子本身大小的影响
- Alpha Affects Intensity 光照强度（Intensity）是否受到粒子本身Alpha的影响
- Range Multiplier 使用曲线在粒子的生命周期内将一个自定义乘数应用于光照范围，光照范围随着时间变化
- Intensity Multiplier 使用曲线在粒子的生命周期内将一个自定义乘数应用于光照强度，光照范围随着时间变化
- Maxinmm Lights 最大光照限制，放置创建过多光源卡死

#### Trails

将尾迹效果添加到粒子上

- Mode 粒子生成轨迹的模式：Particle，Ribbon
  - Particle 根据粒子自身路径渲染尾迹
  - Ribbon 将所有粒子相连接
- Ribbon相关参数
  - Ribbon Count 选择几条线段来连接所有粒子（默认一条线）
  - Split Sub Emitter Ribbons 子发射器上使用时，父粒子将连接所有相关的子粒子
  - Attach Ribbons to Transform 当粒子系统使用世界坐标空间时，勾选此选项，线段会自动连接到世界原点
- Particle相关参数
  - Ratio 被渲染尾迹粒子的概率，介于0-1间
  - Lifetime 粒子尾迹的生命周期
  - Minimum Vertex Distance 添加两个顶点之间的最小距离（值越小，尾迹顶点越多，越丝滑）
  - World Space true则尾迹顶点忽略粒子系统的任何移动，fasle则尾迹顶点随粒子移动
  - Die With Particles 尾迹是否随着粒子死亡而消失，若不是则剩余尾迹会根据自身剩余生命周期自然消失
- Texture Mode 纹理模式（设置尾迹材质纹理如何映射到尾迹上）
  - Stretch 沿线的整个长度映射纹理一次
  - Tile 基于线长度沿线重复纹理
  - DistributePerSegment 沿线的整个长度纹理映射一次（假设所有顶点均匀分布）
  - RepeatPerSegment 沿线重复纹理（按每个线细分线段一次的比率重复）
- Size Affects Width 尾迹宽度是否受到粒子大小影响
- Size Affects Lifetime 尾迹生命周期是否受粒子大小影响
- Inherit Particle Color 尾迹颜色是否受到粒子影响
- Color over Lifetime 控制尾迹颜色随着生命周期变化而变化
- Width over Trail 控制尾迹宽度想读与其长度的曲线
- Color over Trail 控制尾迹颜色相对于其长度的颜色条
- Generate Lighting Data 如果启用此属性，Unity在构建线几何体时包含法线和切线。这样，线几何体就可以采用场景光照材质
- Shadow Bias 阴影偏差

#### External Forces

控制粒子系统力场Force Field对粒子的影响

- Multiplier 施加到该粒子系统上的力的成熟，1全施加，0不施加
- Influence Filter 选择通过何种方式控制力场对粒子的影响
  - Layer Mask 通过层的方式选择力场对哪一层生效
  - List 通过力场List来确定，哪些力场对当前粒子系统生效
  - Layer Mask And List

#### Particle System Force Filed (AddComponent搜索该模块并增加)

粒子系统力场，对粒子施加各种类型的力

- Shape
  - Shape 控制力场区域的形状：圆，半圆，圆柱，盒
  - Start Range 设置力场形状内部从何处开始
  - End Range 设置力场形状外部从何处结束
  - Direction XYZ 设置线性力以应用于x轴，y轴，z轴的粒子，值越大，力越大
- Gravity 力场吸引力
  - Strength 设置引力中心点对粒子的吸引力，值越大，强度越大
  - Focus 设置引力中心点，值为0则是形状中心处，值为1则为形状边缘
- Rotation 力场的涡流
  - Speed 设置粒子围绕涡流的速度，值越大，速度越快
  - Attraction 设置粒子被拖入涡流的强度，值为1则是最大吸引力，值为0则是不应用任何吸引力
  - Randomness 设置形状的随即周以推动粒子四处移动。值为1表示最大随机性，值为0则不应用随机性
- Drag 力场拖拽
  - Strength 设置拖拽效果的强度，以减慢粒子的速度。值越大，强度越大
  - Multiply by Size 是否根据粒子的大小调整拖拽的强度
  - Multiply by Velocity 是否根据粒子的速度调整拖拽的强度
- Vector Field 矢量场 是预先计算好的力场，Unity中无法直接制作，需要用到插件或其他软件制作
  - Volumn Texture 选择矢量场
  - Speed 设置乘数的速度以应用于通过矢量场的粒子
  - Attraction 设置Unity将粒子拖动到矢量场运动的强度

## 参考文章

[详解Unity中的粒子系统Particle System](https://blog.csdn.net/weixin_43147385/article/details/127146742?spm=1001.2014.3001.5502)
