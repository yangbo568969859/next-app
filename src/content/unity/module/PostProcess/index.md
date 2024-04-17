# PostProcess 后处理

## URP下支持的后处理效果分类

- 色彩校正与增强
  - Channel Mixer
  - Color Adjustment
  - Color Curves
  - Lift,Gamma,and Gain
  - Shadows/Midtones/Highlights
  - Tonemapping
  - White Balance
  - Split Toning
- 画面效果增强
  - Bloom
  - Chromatic Aberration
  - Depth of Field
  - Film Grain
  - Motion Blur
- 镜头效果
  - Lens Disortion
  - Panini Projection
  - Vignette
  - lend Flare

## URP下支持的后处理效果列表

| 效果列表 |  描述  | 移动端性能开销 | 常用性 | 优化方式 |
| ---     | ---- | ------        | ---   | ----    |
| Bloom | 泛光/镜头污垢 | 中高 | 高 | 降采样，降低迭代次数，替换2遍模糊pass算法 |
| Channel Mixer | 通道混合器 | 非常低 | 低 | 几乎无 |
| Chromatic Aberration | 散色像差 | 中低（需要三遍采样） | 低 | 几乎无 |
| Color Adjustment  | 颜色调整 | 中 | 高 | ColorGradingMode(HDR or LDR) |
| Color Curves | 颜色曲线 | 低 | 低 | 几乎无 |
| Depth Of Field | 景深 | 非常高 | 中低 | 切换Gaussian与Boken的景深模式 |
| Film Grain | 胶片颗粒 | 中（需要采样多张贴Lookup图） | 低 | 几乎无 |
| Lens Disortion | 镜头失真 | 中低 | 低 | 几乎无 |
| Lift,Gamma,and Gain | 提升，伽马和增益 | 非常低 | 低 | 几乎无 |
| Motion Blur | 运动模糊 | 高（需要MotionVector） | 中低 | Motion Blur质量分级，Intensity强度，Clamp摄像机旋转产生的速度可以具有最大长度 |
| Panini Projection | Panini投影 | 中 | 低 | 几乎无 |
| Shadows,Midtones,Highlights | 阴影，中间调与高光 | 中低 | 低 | 几乎无 |
| Split Toning | 拆分着色 | 非常低 | 低 | 几乎无 |
| Tonemapping | 色调映射 | 中 | 中 | 几乎无 |
| Vignette | 渐晕 | 中 | 低 | Intensity与smoothess |
| White Balance | 白平衡 | 中低 | 低 | 几乎无 |
| Lens Flare | 镜头光晕 | 中高  | 中  | Occlusion设置与光晕数量 |
