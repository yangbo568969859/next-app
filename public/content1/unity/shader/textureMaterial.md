# 纹理材质

## 大纲

### 基础纹理要点

- 纹理映射（texture mapping）： 使用一张图片来控制模型的外观。将一张图粘在模型表面，主纹素（texel）地控制模型颜色
- 纹理坐标映射（texture-mapping coordinates）：又被称作UV坐标，使用二维变量(u,v)来表示，u是横轴坐标，v是纵轴坐标。一般会将纹理坐标归一化
- 纹理采样 通过输入的顶点坐标，在纹理中采样得到结果，输入坐标可能不在[0, 1]范围内
- 平铺模式(Wrap Mode) 纹理的平铺模式决定了引擎在遇到不在[0, 1]范围内的纹理坐标时如何进行纹理采样
  - Repeat 当UV超过[0,1]范围后，整数部分就会被舍弃，而直接采用小数部分。这样的结果是纹理会不断重复
  - Clamp 会将UV限制在[0,1]之间，大于1取1，小于0取0
- 过滤模式(Filter Mode)
  - Point 最邻近(nearest neighbor)滤波，实现像素风
  - Bilinear 线性滤波。线性插值，看起来会模糊
  - Trilinear 与Bilinear唯一的区别是Trilinear会混合多级渐远纹理
- 多级渐远纹理(mipmapping)

### 单张纹理

#### 创建纹理

- 在属性中声明材质

```C#
Properties
{
  _MainTex ("Main Tex", 2D) = "white" {}
}
```

- 声明变量
  - sampler2D为材质类型
  - 需要多声明一个带有后缀_ST的float4的变量。在Unity中，使用纹理名ST声明某个纹理的属性。其中ST是scale和transform的缩写。可以得到纹理的缩放和偏移值
  - _MianTex_ST.xy 存储缩放值
  - _MianTex_ST.zw 存储偏移值
- 使用TRANSFORM_TEX(tex, name)宏计算纹理缩放

```C#
// 宏效果等同于
// o.uv = v.texcoord.xy * _MianTex.xy + _MianTex.zw;
o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
```

- 计算漫反射 进行纹理采样得到颜色，并和物体颜色混合，得到漫反射颜色

```C#
fixed3 albedo = tex2D(_MainTex, i.uv).rgb * _Color.rgb;
fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
```

### 凹凸映射

#### 原理

使用高度纹理来计算法线，计算后得到不同的颜色，使得纹理看起来有凹凸质感。

- 高度纹理(hight map) 来进行表面位移(displacement)，然后得到一个修改后的法线值，也被称为高度映射(height mapping)
- 法线纹理(normal map) 直接存储表面法线，又被称为法线映射(normal mapping)

#### 高度纹理

高度图中存储的是强度值(identity),颜色越浅说明该位置表面越往外凸起

- 直观
- 计算复杂，需要由像素的灰度值计算而得

#### 法线纹理

法线纹理存储的是表面法线方向。

- 法线得分量范围在[-1,1]，而像素分量范围在[0,1],因此需要做一个映射： pixel = (normal + 1) / 2
- 采样后需要对结果进行一次反映射，得到原来得法线方向 normal = pixel * 2 - 1

切线空间存储方式

- 法线为Z轴
- 切线为X轴
- 副切线(bitangent, b)为y轴

副切线：由法线和切线叉积得到

模型空间存储法线

- 直接使用模型空间得法线信息
- 统一坐标系，边缘插值结果平滑
- 绝对法线信息，只能对应一个模型

优点

- 实现简单，更加直观。我们甚至都不需要模型原始的法线和切线等信息，也就是说，计算更少。生成它非常简单，而二u过要生成切线空间下的法线纹理，由于模型的切线一般是和UV方向相同，因此想要得到效果比较好的法线映射就要求纹理映射也是连续的
- 在纹理坐标的缝合处和尖锐的变焦部分，可见的图边较少，即可以提供平滑的边界，这是因为模型空间下的法线纹理存储的是同一坐标系下的法线信息，因此在边界处通过插值得到的法线可以平滑变换。而切线空间下的法线纹理中的法线信息是依靠纹理坐标的方向得到的结果，可能会在边缘处或尖锐的部分造成更多可见的缝合迹象

切线空间存储法线：

- 使用切线空间法线信息。
- 每个顶点都有独立坐标系。
- 切线空间法线，不受模型影响。

优点

- 自由度很高，模型空间下的法线纹理记录的是绝对法线信息，仅可用于创建它时的那个模型，而应用到别的模型上效果就完全错误了。而切线空间下的法线纹理记录的是相对法线信息，这意味着，即使把纹理应用到一个完全不同的网格上，也可以得到一个合理的结果
- 可进行UV动画，比如，我们可以移动一个纹理的UV坐标来实现一个凹凸的效果，这种UV动画在水或者火山熔岩这种类型的物体上会经常用到
- 可以重用法线纹理。比如一块砖，我们仅使用一张法线纹理就可以得到多有6个面
- 可压缩，由于切线空间下的法线纹理中的法线Z方向总是正方向，因此我们可以仅存储XY方向，推导出Z方向

### 在切线空间下计算切线空间法线纹理

- 纹理法线贴图 _BumpMap
  - 用 "bump" 作为他的默认值。 bump 是Unity内置法线纹理
  - _BumpScale用来控制凹凸程度，当它为0时，意味着法线纹理不会对光照产生任何影响
- 声明变量
  - 可以采用和纹理贴图一样的缩放，不需要单独设置

```C#
sampler2D _MainTex;
float4 _MainTex_ST;
sampler2D _BumpMap;
float _MainTexScale;
```

- 结构体
  - tangent 存储切线

```C#
struct a2v
{
    float4 vertex : POSITION;
    float3 normal : NORMAL;
    float4 tangent : TANGENT;
    float4 texcoord : TEXCOORD0;
};
```

- 计算副切线，获取变换矩阵
  - 叉乘得到副切线
  - 切线空间基向量构成正交矩阵，因此法线变换矩阵就是切线空间的变换矩阵
  - 也可以使用TANGENT_SPACE_ROTATION宏来获取到切线空间的旋转矩阵。

```C#
// 叉乘得到副切线
float binormal = cross(normalize(v.normal), normalize(v.tangent.xyz)) * v.tangent.w;
// 切线空间基向量构成正交矩阵，因此法线变换矩阵就是切线空间的变换矩阵
float3x3 rotation = float3x3(v.tangent.xyz, binormal, v.normal);
// 也可以使用TANGENT_SPACE_ROTATION宏来获取到切线空间的旋转矩阵
TANGET_SPACE_ROTATION // 等同于上述两步
// 将需要计算的变量变换到切线空间
o.LightDir = mul(rotation, ObjSpaceLightDir(v.vertex)).xyz;
o.viewDir = mul(rotation, ObjSpaceViewDir(v.vertex)).xyz;
```

- 解映射，计算光照模型

```C#
// 解映射
tangentNormal.xy = (packedNormal.xy * 2 - 1) * _BumpScale;
tangentNormal.z = sqrt(1.0 - saturate(dot(tangentNormal.xy, tangentNormal.xy)));
// tangentNormal = UnpackNormal(packedNormal); //等同于上两步

// 计算切线空间的顶点法线
tangentNormal.xy *= _MainTexScale;
tangentNormal.z = sqrt(1.0 - saturate(dot(tangentNormal.xy, tangentNormal.xy)));
```

### 在世界空间下计算

- 定义结构体
  - 由于一个插值寄存器只能存储float4大小的变量，对于矩阵这样的变量可以进行拆分
  - 实际上法线变换矩阵只需要存三阶即可，但为了充分利用插值寄存器的空间，多出来的一维可以用来存储顶点的世界坐标

```C#
struct v2f
{
    float4 pos : SV_POSITION;
    float4 uv : TEXCOORD0;
    float4 TtoW0 : TEXCOORD1;
    float4 TtoW1 : TEXCOORD2;
    float4 TtoW2 : TEXCOORD3;
};
```

- 修改顶点着色器，计算切线空间到世界空间的变换矩阵

```C#
float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;
fixed3 worldNormal = UnityObjectToWorldNormal(v.normal);
fixed3 worldTangent = UnityObjectToWorldDir(v.tangent.xyz);
fixed3 worldBinormal = cross(worldNormal, worldTangent) * v.tangent.w;

//存储切线空间到世界空间的变换矩阵，以及顶点在世界坐标的表示。
o.TtoW0 = float4(worldTangent.x, worldBinormal.x, worldNormal.x, worldPos.x);
o.TtoW1 = float4(worldTangent.y, worldBinormal.y, worldNormal.y, worldPos.y);
o.TtoW2 = float4(worldTangent.z, worldBinormal.z, worldNormal.z, worldPos.z);
```

- 修改片元着色器

```C#
float3 worldPos = float3(i.TtoW0.w, i.TtoW1.w, i.TtoW2.w);

fixed3 lightDir = normalize(UnityWorldSpaceLightDir(worldPos));
fixed3 viewDir = normalize(UnityWorldSpaceViewDir(worldPos));

fixed3 bump = UnpackNormal(tex2D(_BumpMap, i.uv.zw));
bump.xy *= _BumpScale;
bump.z = sqrt(1.0 - saturate(dot(bump.xy, bump.xy)));

bump = normalize(half3(dot(i.TtoW0.xyz, bump), dot(i.TtoW1.xyz, bump), dot(i.TtoW2.xyz, bump)));
```

### 渐变纹理

有时需要更要灵活地控制光照结果，因此可以使用渐变纹理来控制漫反射光照的结果

Valve公司首先使用了一种基于冷到暖色调的着色技术（cool-towarm tones）

这种方式可以自由地控制物体地漫反射光照，不同地渐变纹理有不同地特性

#### 实现

- 声明渐变纹理
- 纹理采样
- 注意点

### 遮罩纹理

遮罩纹理能保护某些区域，使他们免于修改

- 为了得到不同强度地反光，可以使用遮罩纹理来控制光照
- 也可以通过遮罩纹理来表现需要混合多张纹理地材质，如草地、石子、裸露土地地纹理

使用纹理的一般流程使：

- 通过采样得到遮罩纹理的纹素值
- 使用其中某个或者几个通道的值（如texel.r）来与某种表面属性进行相乘
- 当通道值为0的时候，混合后得到0，就不能进行计算，从而保护区域

遮罩纹理可以让美术人员更加精准地控制模型表面地各种性质

#### 实践

- 添加遮罩纹理和遮罩系数
- 片元着色器
  - 对遮罩纹理的r通道进行采样，并进行缩放
  - 将高光反射的结果乘以得到的遮罩纹理系数，如果该像素计算得到的系数为0，那么就不会反光

### 其他遮罩纹理

## 高级纹理

### 立方体纹理

立方体纹理(Cubemap)是环境映射(Environment Mapping)的一种实现方法, 环境映射可以模拟周围环境,而是用了环境映射的物体可以看起来像渡了层金属一样反射出轴为的环境

- 天空盒子
- 创建用于环境映射的立方体纹理
- 反射
- 折射
- 菲涅尔效应
  - F(Schlick)(v, n) = F0 + (1 - F0) (1- v*n)^5
  - F(Empricial)(v, n) = max(0, min(1, bias + scale*(1- v*n)^power))

## 获取深度和法线纹理

深度纹理实际上就是一张渲染纹理，只不过里面存储的像素值不是颜色值，而是一个高精度的深度值。由于被存储在一张纹理中，深度纹理里的深度值范围是[0, 1],而且通常是非线性分布的
总体来说，这些深度值来自于顶点变换后得到的归一化的设备坐标(Normalized Device Coordinates)

### 获取深度纹理

camera.depthTextureMode = DepthTextureMode.Depth;
