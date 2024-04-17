# 动画问题

## Unity中的动画系统有什么通用优化方案

- 动画导入
  - 使用Optimal压缩格式
  - 去除动画文件的scale信息（对于一般的人形动画需求，不会有模型骨骼scale变化的情况，因此可以把动画信息的scale部分去掉，节约资源）
  - 缩减transform的float精度信息（默认存储每一帧transform信息的是10位精度的float格式数据，建议通过导入器的OnPostprocessModel函数，缩减此数据为3位精度float，效果基本一样）

```C#
void OnPostprocessModel(GameObject g) {
  List<AnimationClip> animationClipList = new List<AnimationClip>(AnimationUtility.GetAnimationClips(g));
 if (animationClipList.Count == 0) {
  AnimationClip[] objectList = UnityEngine.Object.FindObjectsOfType (typeof(AnimationClip)) as AnimationClip[];
  animationClipList.AddRange(objectList);
 }
 
 foreach (AnimationClip theAnimation in animationClipList)
 {
  try 
  {
   //去除scale曲线
   foreach (EditorCurveBinding theCurveBinding in AnimationUtility.GetCurveBindings(theAnimation))
   {
    string name = theCurveBinding.propertyName.ToLower();
    if (name.Contains("scale"))
    {
     AnimationUtility.SetEditorCurve(theAnimation, theCurveBinding, null);
    }
   } 
   
   //浮点数精度压缩到f3
   AnimationClipCurveData[] curves = null;
   curves = AnimationUtility.GetAllCurves(theAnimation);
   Keyframe key;
   Keyframe[] keyFrames;
   for (int ii = 0; ii < curves.Length; ++ii)
   {
    AnimationClipCurveData curveDate = curves[ii];
    if (curveDate.curve == null || curveDate.curve.keys == null)
    {
     continue;
    }
    keyFrames = curveDate.curve.keys;
    for (int i = 0; i < keyFrames.Length; i++)
    {
     key = keyFrames[i];
     key.value = float.Parse(key.value.ToString("f3"));
     key.inTangent = float.Parse(key.inTangent.ToString("f3"));
     key.outTangent = float.Parse(key.outTangent.ToString("f3"));
     keyFrames[i] = key;
    }
    curveDate.curve.keys = keyFrames;
    theAnimation.SetCurve(curveDate.path, curveDate.type, curveDate.propertyName, curveDate.curve);
   }
  }
  catch (System.Exception e)
  {
   Debug.LogError(string.Format("CompressAnimationClip Failed !!! animationPath : {0} error: {1}", assetPath, e));
  }
 }
}
```

- 缩放曲线
  - 动画化缩放曲线比动画化移动和旋转曲线的成本更高，为了改善性能，避免使用缩放动画
- 动画层
  - 动画层可以将多个动画状态混合在一起，从而减少动画状态的数量。此外，动画层还可以帮助开发者实现更复杂的动画逻辑
- 人形动画类型与通用动画类型
  - 导入人形动画Humanoid时，如果不需要IK目标或手指动画，请使用Avatar Mask将他们移除
  - 使用通用动画Generic，使用跟运动比不使用跟运动成本更高，如果动画没有使用跟运动，请确保未指定跟骨骼
- 场景级别优化
  - 使用哈希而不是字符串来查询Animator
  - 实现一个小的AI层来控制Animator，可以让他为OnStateChange，OnTransitionBegin和其他事件提供简单回调
- 运行时优化
  - 始终通过将Animator的Culling Mode设置为 Based on Renderers来优化动画
  - 禁用skinedmeshedRenderer的Update When Offscreen属性
  - 这样即可在角色不可见时让Unity不必更新动画

## 动画系统知识点

### Optimize Game Objects

- 在Avatar和Animator组件中删除导入游戏对象的变换层级结构，而使用unity动画内部结构骨骼，消减骨骼transform带来的性能开销。可以提高觉得动画性能
- 有些情况下会造成角色动画错误，这个选项可以尝试开启但是要看表现效果而定
- 如果角色是可以换装的，在导入时不要开启此选项，但在换装后在运行时在代码中通过调用AnimtionUtility.OptimizeTransformHierachy接口仍然可以达到此选项效果

### Anim.Compression

unity动画无论不压缩，重不重采样都会和ddc软件在表现上有所差异

| 操作  | 描述 |
| --- | ---- |
| Off | 不压缩，质量最高，内存消耗最大 |
| Keyframe Reduction | 减少冗余关键帧，减小动画文件大小和内存大小 |
| Optimal | 仅适用于Generic和Humanoid动画类型，Unity自动决定如何进行压缩（紧缩式和流式数据压缩） |

### Animation Custom Properties

导入用户自定义属性，一般对应DCC工具中的extraUserProperties字段中定义的数据

### 动画曲线数据信息

| 数据项  | 信息 |
| --- | ---- |
| Curves Pos | 位置曲线 |
| Quaternion | 四元数曲线 Resample Curves开启会有 |
| Euler | 欧拉曲线 |
| Scale | 缩放曲线 |
| Muscles | 肌肉曲线 Humanoid类型下会有 |
| Generic | 一般属性的动画曲线，如颜色，材质等 |
| PPtr | 精灵动画曲线，一般2D系统下会有 |
| Curves Total | 曲线总数，数量越大性能越差 |
| Constant | 优化为常数的曲线，error设置越大常数曲线越多，常数曲线一般不参与采样，越大说明优化程度越大 |
| Dense | 使用了密集数据存储 （线性插值后的离散值） |
| Stream | 使用了流式数据存储（插值的时间和切线数据） |
