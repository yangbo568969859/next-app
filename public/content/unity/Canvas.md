## Canvas 组件API

### Canvas
- Render Mode
  - Screen Space - Overlay 场景顶部渲染
  - Screen Space - Camera 场景摄像机前
  - World Space 世界坐标

### CanvasScaler
控制画布缩放的
- UI Scale Mode（UI缩放模式）
  - Constant Pixel Size （固定尺寸像素）
  - Reference Resolution（参照分辨率，一般设置为1920*1080，UI整体将根据16:9方式私营缩放）
  - Constant Physical Size（固定物理像素）
- referenceResolution
- screenMatchMode
- matchWidthOrHeight


### Graphic Raycaster
该组件作为UGUI开启射线投射必不可少的组件，没有特殊要求保持初始值即可


## Event System
事件获取和分发必不可少的组件

- Standalone Input Module 标准输入模块
- Touch Input Module 触摸输入模块
