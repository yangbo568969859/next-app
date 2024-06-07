# 透明效果

## 渲染顺序很重要

对于透明度混合技术，需要关闭深度写入，此时需要我们小心处理透明物体的渲染顺序。如果不关闭深度写入，一个半透明表面背后的表面本来是可以透过它被我们看到，但是由于深度测试时判断结果是该半透明表面距离摄像机更近，导致后面的表面被剔除，我们就无法透过半透明表面看到后面的物体了

渲染引擎一般都会先对物体进行排序，再渲染。常用的方法：

- 先渲染所有不透明物体，并开启他们的深度测试和深度写入
- 把半透明物体按照他们距离摄像机的远近进行排序，然后按照从后往前的顺序渲染这些半透明物体，并开启他们的深度测试，但关闭深度写入

## Unity Shader的渲染顺序

unity为了解决渲染顺序问题提供了渲染队列(render queue); 我们可以使用SubShader的Queue标签来决定模型归于哪个渲染队列

| 名称 | 队列索引号 | 说明 |
| -- | --- | ---- |
| Background | 1000 | 这个渲染队列会在任何其它队列之前被渲染，我们通常使用该队列来渲染那些需要绘制再背景上的物体 |
| Geometry | 2000 | 默认渲染队列，大多数物体用这个队列，不透明物体用这个队列 |
| AlphaTest | 2450 | 需要透明度测试的物体用这个队列 |
| Transparent | 3000 | 这个队列中的所有物体会在所有Geometry和AlphaTest物体渲染后，再按照从后往前的顺序进行渲染 |
| Overlay | 4000 | 该队列用于实现一些叠加效果。任何需要再最后渲染的物体都应该使用该队列 |

## 透明度测试

只要一个片元的透明度不满足条件（通常是小于某个阈值），那么它对应的片元就会被舍弃。被舍弃的片元将不会再进行任务处理，也不会对颜色缓冲产生任何影响；否则，就会按照普通的不透明物体的处理方式；

通常我们会在片元着色器中使用clip函数来进行透明度测试

函数： void clip(float4 x); void clip(float3 x); void clip(float2 x); void clip(float1 x); void clip(float x);
参数： 裁剪时使用的标量或矢量条件
描述： 如果给定参数的任何一个分量是负数，就会舍弃当前像素的输出颜色

```C#
void clip(float4 x)
{
  if (any(x < 0))
    discard;
}
```

## 透明度混合

这种方法可以得到真正的半透明效果，他会使用当前片元的透明度作为混合因子，与已经存储在颜色缓冲中的颜色值进行混合，得到新的颜色。但是，透明度混合需要关闭深度写入，这使得我们要非常小心物体的渲染顺序

ShaderLab的Blend命令

| 语义 | 描述 |
| -- | --- |
| Blend Off | 关闭混合 |
| Blend SrcFactor DstFactor | 开启混合，并设置混合因子。源颜色（该片元产生的颜色）会乘以SrcFactor，而目标颜色（已经存在于颜色缓存的颜色）会乘以DstFactor，然后把两者相加后再存入颜色中 |
| Blend SrcFactor DstFactor, SrcFactorA DstFactorA | 和上面几乎一样，知识使用不同的因子来混合透明通道 |
| BlendOp BlendOperation | 并非是把源颜色和目标颜色简单相加后混合，而是使用BlendOperation对他们进行其它操作 |

```C#
DstColor(new) = SrcAlpha * SrcColor + (1 - SrcAlpha) * DstColor(old);
```

模型本身有复杂的遮挡关系或是包含了复杂的非凸网格的时候，就会有各种各样因为排序错误而产生的错误透明效果，这些都是由于我们关闭了深度写入功能导致的，因为这样我们就无法对模型进行像素级别的深度排序，我们可以想办法重新利用深度写入，让模型可以像半透明物体一样进行淡入淡出

### 开启深度写入的半透明效果

使用两个Pass来渲染模型：第一个Pass开启深度写入，但不输出颜色，它的目的仅仅是为了把该模型的深度值写入深度缓冲中
第二个Pass进行正常的透明度混合，由于上一个Pass已经得到了逐像素的正确深度信息，该Pass就可以按照像素级别的深度排序结果进行透明渲染
但是这种方法的缺点在于： 多使用一个Pass会对性能造成影响

```C#
Pass
{
  ZWrite On
  ColorMask 0 // ColorMask用于设置颜色通道的写掩码（write mask）
  // 语义如下
  // ColorMask RGB | A | 0 | 其它任何RGBA的组合
  // ColorMask设为0时，意味着该Pass不写入任何颜色通道，即不会输出任何颜色。这正是我们需要的--该Pass只需要写入深度缓存即可
}
```

## SahderLab的混合命令

当片元着色器产生一个颜色的时候，可以选择与颜色缓存中的颜色进行混合。这样一来，混合就和两个操作数有关： 源颜色(source color)和目标颜色(destination color)。
源颜色 用S来表示 指的是由片元着色器产生的颜色值，目标颜色 用D表示 指的是从颜色缓冲中读取到的颜色值。对他们混合后得到的输出颜色，用O表示，它会重新写入到颜色缓冲中

### 混合因子

| 参数 | 描述 |
| -- | --- |
| One | 因子为1 |
| Zero | 因子为0 |
| SrcColor | 因子为源颜色值 |
| SrcAlpha | 因子为源颜色透明度值 |
| DstColor | 因子为目标颜色值 |
| DstAlpha | 因子为目标颜色透明度值 |
| OneMinusSrcColor | 因子为(1-源颜色) |
| OneMinusSrcAlpha | 因子为(1-源颜色透明度值) |
| OneMinusDstColor | 因子为(1-目标颜色) |
| OneMinusDstAlpha | 因子为(1-目标颜色透明度值) |

### 混合操作

| 操作 | 描述 |
| -- | --- |
| Add | 将混合后的源颜色和目的颜色相加。默认的混合操作。使用的混合等式是： O(rgb) = SrcFactor *S(rgb) + DstFactor* D(rgb) |
| Sub | 将混合后的源颜色和目的颜色相加  使用的混合等式是： O(rgb) = SrcFactor *S(rgb) - DstFactor* D(rgb)  |
| RevSub | 用混合后的目的颜色减去混合后的源颜色 |
| Min | 使用源颜色和目的颜色中较小的值，是逐分量比较的 |
| Max |  |

### 常见混合类型

```C#
// 正常(Normal) 透明度混合
Blend SrcAlpha OnMinusSrcAlpha

// 柔和相加(Soft Additive)
Blend OneMinusDstColor One

// 正片叠底(Multiply)
Blend DstColor Zero

// 两倍相乘
Blend DstColor SrcColor

// 变暗
BlendOp Min
Blend One One

// 变亮
BlendOp Max
Blend One One

// 滤色
Blend OneMinusDstColor One

// 线性减淡(Linear Dodge)
Blend One One
```
