# Unity Shader 的基本语法结构

## 基础

[普通 Unity 项目内提供的 Shader 类型](./unityshader.md)

如果没有 Unity，对某个模型设置渲染的伪代码

```C#
void Initialization()
{
   // 从硬盘上加载顶点着色器/片元着色器的代码
  string vertexShaderCode = LoadShaderFromFile(VertexSahder.shader);
  string fragmentShaderCode = LoadShaderFromFile(FragmentShader.shader);

  // 把顶点着色器/片元着色器加载到GPU中
  LoadVertexShaderFromString(vertexShaderCode);
  LoadFragmentShaderFromString(fragmentShaderCode);

  // 设置名为[vertexPosition]的属性的输入，即模型顶点坐标
  SetVertexShaderProperty([vertexPosition], vertices);
  // 设置名为[MainTex]的属性的输入，someTexture是某张已加载的纹理
  SetVertexShaderProperty([MainTex], someTexture);
  // 设置名为[MVP]的属性的输入，MVP是之前由开发者计算好的变换矩阵
  SetVertexShaderProperty([MVP], MVP);

  // 关闭混合
  Disable(Blend);
  // 设置深度测试
  Enable(ZTest);
  SetZTestFunction(LessOrEqual);

  // 其他设置
  ...

}

// 每一帧进行渲染
void OnRendering(){
  // 调用渲染命令
  DrawCall();
  // 当涉及多种渲染设置时，我们可能还需要在这里改变各种渲染设置
  ...
}

// VertexShader.shader：
in float3 vertexPosition;
in sampler2D MainTex;
in Materix4x4 MVP;

out float4 position;

void main()
{
  // 使用MVP对模型顶点左边进行变换
  position=MVP*vertexPosition;
}

// FragmentShader.shader：
in float4 position;
out float4 finalColor;

void main()
{
  finalColor = float4(1.0, 1.0, 1.0, 1.0);
}
```

## 语法基础 ShaderLab

```C#
Sahder [ShaderName]
{
  Properties {
    // 属性
  }
  SubShader
  {
    // 
  }
  SubShader
  {

  }
  Fallback [VertexLit]
}
```

```C#
Pass
{
    CGPROGRAM

    #include "UnityCG.cginc"
    // 函数声明，告诉Unity哪个函数包含顶点着色器代码，哪个包含片元着色器
    // #pragma vertex [name]
    #pragma vertex vert
    #pragma fragment frag

    uniform float4 _Color;

    struct a2v
    {
        float4 vertex : POSITION;
        float3 normal : NORMAL;
        float4 texcoord : TEXCOORD0;
    };

    struct v2f
    {
        float4 pos : SV_POSITION;
        fixed3 color : COLOR0;
    };

    // 顶点着色器
    //POSITION 语义，不可省略。把模型顶点坐标填充到参数v中
    //SV_POSITION 告诉Unity顶点着色器的输出是裁剪空间中的顶点坐标
    v2f vert(a2v v)
    {
        v2f o;
        o.pos = UnityObjectToClipPos(v.vertex);
        o.color = v.normal * 0.5 + fixed3(.5, .5, .5);
        return o;
    }

    //片元着色器
    //SV_TARGET 也是HLSL的系统语义，告诉渲染器把用户输出的颜色存储到一个渲染目标中
    //这里输出到默认的帧缓存中
    fixed4 frag(v2f i) : SV_TARGET
    {
        fixed3 c = i.color;
        // c *= _Color.rgb;
        //返回颜色
        return fixed4(c, 1.0);
    }

    ENDCG
}
```

## 语义

语义（semantics）就是一个赋给 Shader 输入输出的字符串，这个字符串表达了这个参数的含义，语义可以让 Shader 知道从哪里读取数据，并把数据输出到哪里

- 语义分为有意义语义和无意义语义
- 接收系统数据的语义有特殊含义，而用户输入无特殊含义

SV 系统数值（system-value）语义

- SV_POSITION 表示光栅化的变换后的顶点坐标（即齐次裁剪空间中的坐标）
- SV_TARGET 表示告诉渲染器把结果存储到渲染目标

## 模型数据从哪里来

- 每帧调用 Draw Call 时，Mesh Render 组件会把它负责渲染的模型数据发送给 Unity Shader。
- 定义结构体逐顶点获取模型数据

```C#
// application to vertex shader
struct a2v {
  // 用模型空间的顶点坐标填充
  float4 vertex : POSITION;
  // 用模型空间的法线方向填充
  float3 normal : NORMAL;
  // 用模型的第一套纹理坐标填充
  float4 texcoord : TEXCOORD0;
}
```

## 顶点着色器和片元着色器之间如何通信

- 定义结构体接受返回信息
- 顶点着色器计算后返回结构体
- 片元着色器接收顶点着色器的输出做插值后得到的结果

```C#
struct v2f
{
  float4 pos : SV_POSITION;
  fiexd3 color : COLOR0;
}

v2f vert(v2f v) : SV_POSITION
{
  v2f o;
  o.pos = UnityObjectToClipPos(v.vertex);
  o.color = ...
  return o;
}

fixed4 frag(v2f i) : SV_TARGET
{
  return fiexd4(i.color, 1.0);
}
```

### 顶点着色器和片元着色器的差别

- 顶点着色器逐顶点，片元着色器逐片元
- 顶点着色器获取顶点信息
- 片元着色器获取顶点插值结果信息

### 内置包含文件

包含文件（include file），类似于 C++的头文件，在 Unity 中，他们的文件后缀是.cginc；在编写的时候可以使用 #include 指令把这些文件包含进来
