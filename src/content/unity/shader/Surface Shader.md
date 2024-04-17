# Surface Shader

## 表面着色器

表面着色器实际上就是在顶点/片元着色器之上又添加了一层抽象； 表面着色器最终会被编译为一个复杂的顶点着色程序

### 编译指令

编译指令最重要的作用是指明该表面着色器使用的表面函数和光照函数，并设置一些可选参数

```C#
#pragma surface surfaceFunction lightModel [optionalparams]
```

表面着色器包含 4 个函数

- 顶点变换函数
- 表面着色函数
- 光照模型
- 最终颜色修改函数

### 定义入口函数

#### pragma surface 入口函数名称 光照模型 [Options]

- surface 后面跟表面着色器的入口函数 surf(Input IN, inout SurfaceOutput o);
- 光照模型
  - 内置的 lambert（漫反射光照） BlinnPhong（高光光照）
  - 基于物理的光照模型函数 Standard StandardSpecular
  - 自定义光照： 名字为 Name
    - half4 Lighting<Name>(SurfaceOutput s, half3 lightDir, half aten); // 用于不依赖视角的光照模型，漫反射
    - half4 Lighting<Name>(SurfaceOutput s, half3 lightDir, half3 viewDir, half aten); // 用于不依赖视角的光照模型，高光反射
    - half4 Lighting<Name>(SurfaceOutput s, half4 light);

- 可选参数 vertex:VertexFunction 顶点修改函数
  - void<Name>(inout appdata_full v) 只需要改顶点着色器中的输入顶点数据
  - half4<Name>(inout appdata_full v, out Input o) 修改输入顶点数据，以及为表面着色器传递数据

- 可选参数 finalcolor:ColorFunction 最终颜色修改函数
  - void<Name>(Input IN, SurfaceOutput o, inout fixed4 color)

- 其他可选参数
   1: alpha:Alpha 混合模式，用户半透明着色器;
   2: alphatest:varirableName Alpha 测试模式，用户透明镂空着色器
   3: exclude_path:prepass 使用指定的渲染路径
   3: exclude_path:deferred 使用指定的渲染路径 缩小自动生成的代码量
   4: addshadow: 添加阴影投射器和集合通道;
   5: dualforward:将双重光照贴图用于正向渲染路径中;
   6: fullforwardshadows 在正想渲染路径中支持的所有的阴影类型
   7: decal:add 附加印花着色器:
   8: decal:blend 附加半透明印花着色器:9: softvegetation 使用表面着色器，仅在 Soft Vegetation 开启时被渲染;10:noambient 不使用任何光照
   11: novertexlights 在正向渲染中不适用球面调和光照或逐点光照 12: nolightmap 在这个着色器上禁用光照贴图:
   13: nodirlightmap 在这个着色器上禁用方向光照贴图
   14: noforwardadd 禁用正向渲染添加通道:
   15: approxview: 对于有需要的着色器，逐顶点而不是逐像素计算规范化视线方向
   16: halfasview: 将半方向传递到光照函数中。
   17: nometa 取消对提取元数据Pass的生成

#### 两个结构体

表面函数的输入结构体Input，以及存储了表面属性的结构体SurfaceOutput (SurfaceOutputStandard\SurfaceOutputStandardSpecular)

Input 必须包含着色器所需要的纹理坐标 uv + 纹理名字；如果使用第二张纹理 uv2 + 纹理名字

Input 结构体包含了许多表面属性的数据来源，他会作为表面函数的输入结构体

1. float3 viewDir 视角方向，可用于计算边缘光照等
2. float4 COLOR 包含了插值后的逐顶点颜色
3. float4 screenPos 屏幕空间中的坐标
4. float3 worldPos 世界坐标位置
5. float3 worldRefl 世界空间中的反射方向，前提是没有修改表面法线o.Normal
6. float3 worldNormal 世界空间的法线方向，前提是没有修改表面法线o.Normal
7. float3 worldRefl; INTERNAL_DATA 世界坐标反射向量，但必须表面着色写入 o.Normal 参数
8. float3 worldNormal; INTERNAL_DATA 世界坐标法线向量，但必须表面着色写入 o.Normal 参数

一个例外的情况是，我们自定义了顶点修改函数，并需要像表面函数中传入一些自定义的数据，例如，自定义的雾效，我们可能需要在顶点修改函数中根据顶点在视角空间下的位置信息计算雾效混合系数，这样我们就可以在Input结构体中定义一个名为half fog的变量，把计算结果存储在该变量后进行输出

#### SurfaceOutput 结构体

如果使用了非基于物理的光照模型，我们通常会使用SurfaceOutput结构体；而如果使用了基于物理的光照模型Standard或StandardSpecular，我们会分别使用SurfaceOutputStandard或SurfaceOutputStandardSpecular

SurfaceOutput

1. half3 Albedo 漫反射 对光源的反射率，通常由纹理采样和颜色属性的成绩计算而得
2. half3 Normal 法线
3. half3 Emission 自发光
4. half Specular 高光反射中的指数部分的系数，影响高光反射的计算 float spec = pow(nh, s.Specular*128.0)*s.Gloss;
5. half Gloss 光泽系数 高光反射中的强度系数
6. half Alpha 透明度系数

SurfaceOutputStandard

1. half3 Albedo 漫反射
2. half3 Normal 法线
3. half3 Emission 自发光
4. half Occlusion 遮挡剔除系数
5. half Alpha 透明度系数
6. half Smoothness 0-粗糙 1-光滑
7. half Metallic 0-非金属 1-金属

SurfaceOutputStandardSpecular

1. fixed3 Albedo
2. fixed3 Specular
3. fixed3 Normal
4. half3 Emission
5. half Smoothness
6. half Occlusion // 遮挡（默认 1）
7. fixed Alpha

### Unity背后做了什么

#### Pass的自动生成过程

- 直接将表面着色器中CGPROGRAM和ENDCG之间代码复制过来，包括我们对Input结构体、表面函数、光照函数等变量和函数的定义。这些函数和变量会在之后的处理过程中被当成正常的结构体和函数进行调用
- 分析上述代码，并生成顶点着色器的输出 v2f_surf结构体
