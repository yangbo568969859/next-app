# Shader 中的 LOD

## LOD

- LOD (Level of Detail) 根据LOD来设置使用不同版本的shander
- 着色器中每个SubShader对应一个LOD值，只有第一个小于等于LOD值得SubShader才会被执行
- 每个shader中最多只有一个SubShader被使用
- 通过 Shader.maximumLOD 来设置最大得LOD值
- 设置全局的LOD值，Shader.globalMaximumLOD
- unity中着色器LOD等级有：
  - VertexLit kind of shaders 100
  - Decal, Reflective VertexLit 150
  - Diffuse 200
  - Bumped, Specular 300
  - BumpedSpecular 400
  - Paralax 500
  - Paralax Specular 600

## 渲染队列

### 渲染队列可选标签

1. Background 背景，对应的值为1000
2. Geometry(default) 几何体对应的值为2000，这个队列是默认的渲染队列，大多数不透明的物体
3. AlphaTest Alpha测试。对应值为2450，alpha测试的几何体使用这种队列，它是独立于Geometry的队列，它可以再所有固体对象绘制后更有效的渲染采用alpha测试的对象
4. Transparent 透明 值为3000 这个渲染队列再Geometry被渲染，采用从后向前的次序；任何有alpha混合的对象都在这个队列里面渲染
5. Overlay 覆盖对应的值为4000，这个渲染队列是最后渲染的物体

### Unity渲染模式

普通物体从前向后渲染，Alpha从后向前渲染

渲染队列的数值决定Unity在渲染场景物体时的先后顺序，关闭深度测试的情况下
