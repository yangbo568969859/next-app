# 图形和渲染

## 贴图

### 数据格式

- 压缩 让包体更小，但加载更慢
- 非压缩 加载更快，包体较大

### 文件格式

- Tga 32位 有8位Alpha通道
- Png 压缩格式，有透明色
- Jpg 压缩格式，无半透
- DXT 有不同的压缩格式

### 压缩格式

- DXTC
- ETC
- ASTC

### 纹理映射

### Mipmap

- 如果场景有纵深，mipMap可让远处贴图看着不花（这是由多个贴图像素投影到同一个屏幕像素上造成的）
- 可以提高渲染性能

### 优化

- 可使用24位色（无半透）的就不要使用32位
- 可使用压缩格式（3D物体）的就不要使用非压缩格式
- 颜色简单的可使用索引色

## 灯光

### 动态光照

针对运动的物体或者光源，实时变化的光照

### 静态光照

LightMap
预先烘焙好的，运行时不会再变得光照

### 光源类型

- 点光(PointLight) 灯泡效果
- 方向光(DirectionLight) 太阳光效果
- 聚光灯(SpotLight) 舞台上聚光灯效果
- 全局光/环境光(AmbientLight) 照亮整个场景，无方向（或者说来自四面八方）
- 区域光
- 体积光

### 自发光

### 光线追踪

反射

### 光影

可增加画面光影真实感 作用：环境光遮蔽(Ambient Occlusion) 全局光照(Global Illumination)

### 优化

尽量减少同时激活的动态光源的数量以提高渲染性能

## 材质

### 作用

是用来影响物体表现的，比如光照在物体上的表现

### 类型

#### Diffuse

光源和物体面片的直接光照计算

#### Normal Map

表现物体表面的反光

#### Specular

- 高光颜色可以表现在某个方向反射的入射光线多少，高光反映在您的眼睛与反射的入射光线的防线对齐的时候是最亮的，所以高光是根据视图进行变化的
- 法线也会影响高光，因为他会影响反射的光源方向。高光强度在您的眼睛和反射的入射光线或光泽程度，非常高的高光强度可以表现如镜面一般的程度，而低强度可以表现比较粗糙的表面

#### Bump Map

表现物体表面的凹凸感