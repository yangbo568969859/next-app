# Canvas相关

## Canvas Re-batch过程
- 根据UI元素深度关系进行排序
- 检查UI元素的覆盖关系
- 检查UI元素材质并进行合批

## Re-build过程

- 在WillRenderCanvases事件调用PerformUpdate::CanvasUpdateRegistry接口
  - 通过ICanvasElementRebuild方法重新构建Dirty的Layout组件
  - 通过ClippinaReaistry.Cullf方法，任何已注册的裁剪组件Clipping CompnentsSuch as Masks)的对象进行剪剔除操作
  - 任何Dirty的 Graphics Compnents都会被要求重新生成图形元素
- Layout Rebuild
  - UI元素位置、大小、颜色发生变化
  - 优先计算靠近Root节点，并根据层级深度排序
- Graphic Rebuild
  - 顶点数据被标记成Dirty
  - 材质或贴图数据被标记成Dirty
### UGUI渲染细节

UGUI中渲染是在Transparent半透明渲染队列中完成的，半透明队列的绘制顺序是从后往前画，由于UI元素做Alpha blend 我们在做UI时很难保障每一个像素不被重画，UI的Overdraw太高。这会造成片元着色器利用率过高，造成GPU负担

UI SpriteAtlas图集利用率不高的情况下，大量完全透明的像素被采样也会导致像素被重绘

### CANVAS 使用准则

1.将所有可能打断合批的层移到最下边的图层，尽量避免UI元素出现重鲁区域
2.可以拆分使用多个同级或嵌套的Canvas来减少Canvas的Rebatch复杂度
3.拆分动态和静态对象放到不同Canvas下。
4.不使用Layout组件
5.Canvas的RenderMode尽量Overlay模式，减少Camera调用的开销
