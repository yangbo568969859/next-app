# Aniamtion&Animator相关

## Aniamtion

### 创建动画片段

- 为物体添加Animation组件
- 在动画视图中创建片段

## 旧版动画API

- bool isPlay = animation.isPlaying;
- bool isPlay = animation.isPlaying("动画名);
- animation.Play("动画名");
- animation.PlayQueued("动画名");
- animation.CrossFade("动画名");
- animation["动画名"].speed = -1;
- animation["动画名"].wrapMode = WrapMode.Pingpong;
- animation["动画名"].length;
- animation["动画名"].time;

## 新版动画

// 当前片段的播放进度[0,1] 0为起点 1为终点
// 判断动画是否播放完
if ((animatorInfo.normalizedTime > 0.99f) && (animatorInfo.IsName("动画片段名")))

## Animator

- Controller
- Avatar 人形动画（如果没有使用Avatar，animator组件会严格按照动画片段里记录的path执行动画）
- Apply Root Motion（动画的位移应用到游戏对象上，就需要勾选）
- Update Mode（动画刷新模式，重新计算每个骨骼节点的位置、转向和缩放的数值）
  - normal 指和帧率同步（Update方法同步刷新）
  - Animate Physic 指与物理引擎同步（Fixed Update同步刷新）
  - Unscale Time （和normal一样，Update方法同步刷新，与normal不同的是会忽略当前的时间标尺time scale，所谓时间标识就是整个游戏的运行速度比例）
- Culling Mode（剔除模式）
  - Always Aniamte（不剔除）
  - Cull Update Transforms（如果该游戏对象并没有被摄像机看到，animator还是会计算当前的动画状态，和Always Animate没有区别，但是会剔除诸如IK之类的）
  - Cull Complately （完全停止动画，等被看到时重新播放动画）
