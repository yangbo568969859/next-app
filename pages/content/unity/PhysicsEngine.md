## 物理引擎
- 带有刚体组件的游戏物体 Add Component - physics - Rigidbody
- 刚体组件可使游戏对象受物理引擎控制，在受外力时产生真实世界中的运动
- 模拟真实世界中物体物理特性的引擎
### 刚体 RigidBody
- 简介
  - 能表现物体的质量、碰撞
- 属性
  - 质量 Mass 物体的质量
  - 阻力 Drag  当受力移动时物体受到的空气阻力。0表示没有空气阻力，极大时可使物体停止运动。砖头通常0.001，羽毛10
  - 角阻力 Angular Drag 当受扭力旋转时物体收到的空气阻力。0表示没有空气阻力，极大时可以使物体停止旋转
  - 使用重力 Use Gravity：若激活，则物体受重力影响
  - 是否是运动学 Is Kinematic：若激活，该物体不再受物理引擎控制，而只能通过变换组件来操作
  - 插值 Interpolate 用于缓解刚体运动时的抖动
    - 无None -- 不应用插值
    - 内插值 -- 基于上一帧的变换来平滑本帧变换
    - 外插值 -- 基于下一帧的预估变换来平滑本帧变换
  - 碰撞检测模式 Collision Detection
### 碰撞器 Collider
- 简介
  - 产生物体阻挡，碰撞效果
- 分类
- 属性
- 物理材质
  - 用于调整碰撞对象的摩擦力和反弹效果
  - 属性
    - 动态摩擦力 Dynamic Friction
    - 静态摩擦力 Static Friction
    - 弹力(弹性系数) Bounciness
    - 摩擦力，弹力建议0--1之间
    - 摩擦力合并模式 Friction Combine Mode
    - 合并反弹 Bounce Combine
    - 两个碰撞对象摩擦力/弹力合并方式 平均值Average 最小 Min 最大 Max 相乘Multiply
- 碰撞条件
  - 两者都具有碰撞器组件
  - 运动的物体具有刚体组件
- 碰撞三阶段
  - 当进入碰撞时执行 void OnCollisionEnter(Collision collOther)
  - 当碰撞体与刚体接触时每帧执行 void OnCollisionStay(Collision collOther)
  - 当停止碰撞时执行 void OnCollisionExit(Collision collOther)
- 碰撞检测模式
  - Discrete 性能好，物体速度较快时可能会穿过另一碰撞体
  - Continuous 连续的碰撞检测，保证物体不会穿过其他碰撞体，性能低
  - Continuous dynamic 针对静态网格碰撞器（不带刚体），用于快速移动的物体
- 算法 AABB(Axis-Aligned Bounding Box)
  - 简单的说是通过物体的矩形（立方体）外框作为碰撞检测判断的过滤方法，这个AABB框没有碰撞，就先不检查物体的细节碰撞
### 触发器 Trigger
- 简介
  - 带有碰撞器组件，且 Is Trigger 属性被勾选的物体
  - 现象：无碰撞效果
- 触发条件
  - 两者具有碰撞组件
  - 其中之一具有刚体组件
  - 其中之一勾选 Is Trigger
- 触发三阶段
  - 当Collider(碰撞体)进入触发器时执行 void OnTriggerEnter(Collider cldOther)
  - 当碰撞体与触发器接触时每帧执行 void OnTriggerStay(Collider cldOther)
  - 当停止时执行 void OnTriggerExit(Collider cldOther)

### 射线 Ray cast
- 设计游戏中的射击目标检测
- 鼠标、光标在3D场景中的点击拾取



#### 问题
- 物体移动速度过快，碰撞检测失效，解决方案：开始时射线检测
```C#
private Vector3 targetPos;
private void Start () {
  RaycastHit hit;
  // Physics.Raycast(起点坐标,方向,受击物体信息,距离,检测的层)
  if (Physics.Raycast(this.transform.position, this.transform.forward, out hit, 100, mask)) {
    targetPos = hit.point;
  } else {
    targetPos = this.transform.position + this.transform.forward * 100
  }
}
private void Update () {
  this.transform.position = Vector3.MoveTowards(this.transform.position, targetPos, Time.deltaTime * 10);
  if ((this.transform.position - targetPos).sqrMagnitude < 0.1f) {
    print("接触目标点");
    Destory(this.gameObject);
  }
}
```
