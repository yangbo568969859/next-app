# Three3D

## 3D引擎基本知识

### 场景（scene）

一个容器，容纳着除渲染器以外的三维世界里的一切。场景的元素采用右手笛卡尔坐标系，x轴正向向右，y轴正方向向上，z轴有屏幕从里向外

### 摄像机 （camera）

人的眼睛，在一个空间里可以看任意方向，通过参数调节可视角度和可视距离

一般使用符合物理世界近大远小真实情况的透视相机PerspectiveCamera
特殊情况：远近大小是一样的，需要用到正交相机OrthographicCamera

```ts
PerspectiveCamera(
  fov: number,    // 视场角
  aspect: number, // 视场宽高比
  near: number,   // 能看多斤
  far: number     // 能看多远
)
```

### 渲染器 （renderer）

将camera在scene里看到的内容渲染/绘制到画布上

### 几何体 （gmometry）

3D世界的物体都是点组成面，面组成几何体

- 球体 sphere
- 立方体 cube
- 圆锥体 cone
- 圆柱体 cylinder
- ...
面是由点构成的，面又可以组成各式各样的几何体。以球体举例，球体面上的点越多，球就越圆。但点越多，运算量也会越大

另外我们一般说的3D模型就是一个或多个几何体，只是有的3D模型文件里除了包含几何体还可以包含一些额外的信息，比如贴图，材质等等，需要在读取模型文件时解析出来

### 灯光 （light）

3D引擎在没有手动创建光的情况下会有个默认的环境光，常见的灯管有以下几种类型：

- AmbientLight 环境光，没有方向全局打亮，不会产生明暗
- DirectionLight 平行光
- PointLight 点光源，等价于灯泡发出的光线
- SpotLight 聚光灯

### 贴图 （texture）

3d模型几何体面上的表面可以添加内容，比如画个人物，就是贴图

### 材质（material）

材质主要体现在3d建模展现出来的模型质感，就比如画画，素描和油画的质感

- MeshBasicMaterial (基础材质，不受光照影响)
- MeshStandardMaterial （PBR标准材质）
- MeshPhongMaterial （高光材质，适用于陶瓷，烤漆类材质）
- MeshToonMaterial （卡通材质，俗称三渲二）
- MeshStandardMaterial （PBR标准材质模拟金属反射）
