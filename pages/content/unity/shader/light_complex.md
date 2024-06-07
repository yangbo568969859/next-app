# 更复杂的光照

## Unity渲染路径

在Unity中，渲染路径(Rendering Path)决定光照是如何应用到Unity Shader中的。因此，如果要和光源打交道，我们需要为每个Pass指定他使用的渲染路径

支持的渲染路径

- Forward Rendering Path
- Deferred Rendering Path

### LightMode标签支持的渲染路径设置

| 标签名 | 描述 |
| --- | ---- |
| Always | 不管使用哪种渲染路径，该Pass总是会被渲染，但不会计算任何光照 |
| ForwardBase | 用于前向渲染，该pass会计算环境光，最重要的平行光，逐顶点/SH光源和Lightmaps |
| ForwardAdd | 用于前向渲染，该Pass会计算额外的逐像素光源，每个Pass对应一个光源 |
| Deferred | 延迟渲染，该Pass会渲染G缓冲(G-Buffer) |
| ShadowCaster | 把物体的深度信息渲染到阴影映射纹理(shadowmap)或一张深度纹理中 |
| PrepassBase | 遗留的延迟渲染，该Pass会渲染法线和高光反射的指数部分 |
| PrepassFinal | 遗留的延迟渲染，该Pass通过合并纹理、光照、自发光来渲染得到最后的颜色 |
| Vertex VertexLMRGBM VertexLM | 遗留的顶点照明渲染 |

### 前向渲染

原理：每进行一次完整的前向渲染，我们需要渲染该对象的渲染图元，并计算两个缓冲区的信息，一个是颜色缓冲区，一个是深度缓冲区。我们利用深度缓冲来决定一个图元是否可见，如果可见就更新颜色缓冲区中的颜色值

```C#
Pass
{
    for (each primitive in this model)
    {
        for(each fragment covered by this primitive)
        {
            if (failed in depth test)
                // 如果没有通过深度测试，说明该片元是不可见的
                discard;
            else
            {
                // 如果可见 就进行光照计算
                float4 color = Shading(materalInfo, pos, normal, lightDir, viewDir);
                // 更新帧缓冲
                writeFrameBuffer(fragment, color);
            }
        }
    }
}
```

在Unity中，前向渲染路径有3中处理光照的反射光：逐顶点处理、逐像素处理、球谐函数(Spherical Harmonics, SH)处理。而决定一个光源使用哪种处理模式取决于它的类型和渲染模式

在前向渲染中，当我们渲染一个物体时，Unity会根据场景中各个光源设置以及这些光源对物体的影响程度对这些光源进行一个重要度排序，一定数目的光源会按照逐像素的方式处理，然后最多有4个光源按照逐顶点方式处理，剩下光源可以按SH方式处理；判断规则如下：

- 场景中最亮的平行光总是按照逐像素处理
- 渲染模式被设置为Not Important的光源，会按照逐顶点或SH处理
- 渲染模式被设置为Important的光源，会按照逐像素处理
- 如果根据以上规则得到的逐像素光源数量小于Qualit Setting中的逐像素光源数量(Pixel Light Count)，会有更多的光源以逐像素方式进行渲染

Base Pass 可实现的光照效果： 光照纹理、环境光、自发光、阴影(平行光的阴影)
Additional Pass 默认情况下不支持阴影，但是可以通过#pragma multi_compile_fwdadd_fullshadow 编译指令来开启阴影

前向渲染可以使用的内置光照变量

| 名称 | 类型 | 描述 |
| -- | --- | ---- |
| _LightColor0 | float4 | 该Pass处理的逐像素光源颜色 |
| _WorldSpaceLightPos0 | float4 | _WorldSpaceLightPos0.xyz是该Pass处理的逐像素光源的位置，如果光源是平行光，那么_WorldSpaceLightPos0.w是0，其它光源类型的w是1 |
| _LightMatrix0 | float4x4 | 从世界空间到光源空间的变换矩阵，可以用于采样cookie和光度衰减(attenuation)纹理 |
| unity_4LightPosX0, unity_4LightPosY0, unity_4LightPosZ0 | float4 | 仅用于Base Pass 前4个非重要的点光源在世界空间的位置 |
| unity_4LightAtten0 | float4 | 仅用于Base Pass 存储了前4个非重要的点光源的衰减因子 |
| unity_LightColor | half4[4] | 仅用于Base Pass 存储了前4个非重要的点光源的颜色 |

前向渲染可以使用的内置光照函数

| 名称 | 描述 |
| -- | --- |
| float3 WorldSpaceLightDir(float4 v) | 输入一个模型空间中的顶点位置，返回世界空间中从该点到光源的光照方向。内部实现使用UnityWorldSpaceLightDir函数，没有被归一化 |
| float3 UnityWorldSpaceLightDir(float4 v) | 输入一个世界空间中的顶点位置，返回世界空间中从该点到光源的光照方向，没有被归一化 |
| float3 ObjSpaceLightDir(float4 v) | 输入一个模型空间中的顶点位置，返回模型空间中从该点到光源的光照方向 没有被归一化 |
| float3 Shade4PointLights(...) | 计算4个点光源的光照，它的参数是已经打包进矢量的光照数据 |

### 延迟渲染

前向渲染的问题是：当场景中包含大量实时光源时，前向渲染的性能会极速下降，多个光源影响的区域互相重叠，那么为了得到最终的光照效果，需要为该区域的每个物体执行多个Pass来计算不同光源对该物体的光照结果，然后在颜色缓冲中把这些结果混合起来得到最终光照

延迟渲染主要包含两个Pass，第一个Pass中，我们不需要进行任何光照计算，而是仅仅计算哪些片元是可见的，这主要是通过深度缓冲技术来实现，当法线一个片元是可见的，我们就把相关信息存储到G缓冲区；第二个Pass中，我们利用G缓冲区的片元信息，例如表面法线、视角方向、漫反射系数等进行真正的光照计算

```C#
// 伪代码
Pass 1
{
    for (each primitive in this model)
    {
        for(each fragment covered by this primitive)
        {
            if (failed in depth test)
              discard;
            else
            {
              // 如果该片元可见，写入到GBuffer中
              writeGBuffer(materialInfo, pos, normal, lighrDir, viewDir);
            }
        }
    }
}
Pass 2
{
  for (each pixel in this screen)
  {
    if (the pixed is valid)
    {
      // 如果该像素有效，读取对应GBuffer中的信息
      readGBuffer(pixel, materialInfo, pos, normal, lightDir, viewDir);

      // 根据读取到的信息计算光照颜色
      float4 color = Shading(materialInfo, pos, normal, lightDir, viewDir);

      // 更新帧缓冲
      writeFrameBuffer(pixel, color);
    }
  }
}
```

延迟渲染路径适合在场景中光源数量很多，使用前向渲染卡顿的情况

延迟渲染的缺点

- 不支持真正的抗锯齿(anti-aliasing)功能
- 不能处理半透明物体
- 对显卡有要求

当使用延迟渲染时，Unity要求我们提供两个Pass

- 第一个Pass用于渲染G缓冲，这个Pass中，我们会把物体的漫反射颜色、高光反射颜色、平滑度、法线、自发光和深度等信息渲染到屏幕空间的G缓冲区中，对于每个物体，该Pass仅会执行一次
- 第二个Pass用于计算真正的光照模型。这个Pass会使用上一个Pass中渲染的数据来计算最终的光照颜色，再存储到帧缓冲中

### 选择哪种渲染路径

### Unity光源类型

- 平行光 directional
- 点光源 point
- 聚光灯 spot
- 面光源 area（仅在烘焙时才可发挥作用）

最常使用的光源属性有光源的 位置、方向、颜色、强度以及衰减

### Unity的光照衰减

Unity使用一张纹理作为查找表来在片元着色器中计算逐像素光照的衰减，这样的好处是： 计算衰减不依赖数学公式的复杂性，我们只要使用一个参数值去纹理中次啊杨即可；但是也有一些弊端

- 需要预处理得到采样纹理，而且纹理的大小会影响衰减的精度
- 不直观，同时也不方便，因此一旦把数据存储到查找表中，我们无法使用其它数学公式来计算衰减

#### 用于光照衰减的纹理

unity内部使用一张_LightTexture0 的纹理来计算光源缩减，如果我们对该光源使用了cookie，那么衰减查找纹理是_LightTextureB0； (0,0)点表明与光源位置重合的点的衰减值 (1,1)点表明了光源空间中所关心的距离最远的点的衰减
为了对_LightTexture0 纹理采样得到给定点到该光源的衰减值，我们首先需要得到该点在光源空间中的位置，这是通过_LightMatrix0 变换矩阵得到的

```C#
// 只需要把_LightMatrix0和世界空间中的顶点坐标相乘即可得到光源空间中的相对位置
float3 lightcoord = mul(_LightMatrix0, float4(i.worldPosition, 1)).xyz;
// 可以使用这个坐标的模的平方对衰减纹理进行采样，得到衰减值
fixed atten = tex2D(_LightTexture0, dot(lightCoord, lightCoord).rr).UNITY_ATTEN_CHANNEL;
```

```C#
// 使用数学公式计算衰减
float distance = length(_WorldSpaceLightPos0.xyz - i.worldPosition.xyz);
atten = 1.0 / distance;
```

### Unity 的阴影

Unity 采用了 屏幕空间的阴影映射技术(Screenspace Shadow Map)

- 如果我们想要一个物体接收来自其它物体的阴影, 就必须在Shader中对阴影映射纹理进行采样,把采样结果和最后的光照结果相乘来产生阴影效果
- 如果我们想要一个物体向其它物体投射阴影,就必须把该物体加入到光源的阴影映射纹理的计算中,从而让其它物体在对阴影映射纹理采样时可以得到该物体的相关信息;在Unity中,这个过程是通过物体执行LightMode为ShadowCaster的Pass来实现的,如果使用了屏幕空间的投影映射技术,Unity还会使用这个Pass产生一张摄像机的深度纹理

SHADOW_COORDS, TRANSFER_SHADOW, SHADOW_ATTENATION 是阴影计算的三剑客,这些内置宏帮我们在必要时计算光源的阴影

- SHADOW_COORDS 实际上声明了一个名为_ShadowCoord 的阴影纹理坐标变量
- TRANSFER_SHADOW 的实现根据平台差异而有所不同 如果当前平台可以使用 屏幕空间的阴影映射技术 , 会调用内置的 ComputeScreenPos 函数来计算_ShadowCoord; 不支持就会使用传统的阴影映射技术, TRANSFER_SHADOW会把顶点坐标从屏幕空间变换到光源空间后存储在_ShadowCoord
- SHADOW_ATTENATION 负责使用_ShadowCoord对相关的纹理进行采样,得到阴影信息
