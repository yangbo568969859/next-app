# Playable

Unity提供了Playable API，允许开发者进行自定义的，来重新写一套动作控制的系统

## 使用Playable替代Animator的优缺点

### 优点

- 可以控制动画加载的策略，可按需加载以及异步加载
- 可以更加灵活的控制PlayableGraph的数据流，可插入自定义的AnimationJon来做一些特殊的动作机制和动作表现
- 加载自定义的配置数据，能让动作系统更方便和其他游戏系统结合
- 自由度更高的override机制，Animator本身有Override Animator概念，但是利用Playable能够让一些动作进行更加方便的组合和覆盖
- 支持动态动画混合
- 允许创建播放单个动画，而并不会产生创建和管理AnimatorController资源所涉及的开销，可更加灵活的控制PlayableGraph的数据流，可以插入自定义的AnimationJob
- 允许用户动态创建混合图，并直接逐帧控制混合权重
- 可以运行时动态创建，根据条件添加可播放节点

### 缺点

- 没有直接使用Animator（Mecanim）来的直观
- 混合模式没有现成的，需要自己实现
- 需要程序员们开发更多的配套工具
- 需要一定的学习成本

## 层次化的动作Tag系统

这么做的好处 可以从不同的力度把动作进行归类； 新加动作的时候会更加的方便。例如新加一个walk_02，用多重Tag要把它添加到Walk和Movement里。但是层次化的话，只需要添加到Walk里即可，会被自动添加到Movement里，提高了编辑效率

- Movement
  - Jump
    - jump_01
  - Run
    - run_01
    - run_01
  - Walk
    - walk_01
- Battle
  - BattleRun
    - battle_run_01
  - Attact
    - attack_01
    - attack_02
  - Skill
    - skill_01
  
## 运行时周边环境检测

- 地面坡度检测，检测到地面坡度的话就可以用它来做上下坡动作融合
- 自动跨越小障碍，在人物前方使用多条射线来判断是否有小的障碍，来进行跨越动作
- 飞檐走壁以及贴墙动作，同样利用射线来判断人物前方是否有墙，然后通过墙的法线来判断该墙是否允许做飞檐走壁动作
- 跳跃目标点连通性检测

要实现上面这些检测，就需要利用物理引擎提供的一些接口，例如：

- RayCast：打出射线判断Colliders
- SphereCast：与RayCast不同的是，SphereCast是往射线方向打出一个球体，然后判断Colliders
- OverlapSphere 获取所有接触到球或在球内的Colliders
- OverlapCapsule 获取所有接触到胶囊体或在胶囊体内的Colliders

性能优化问题

- 控制好检测频率
- autoSyncTransforms的开关，这个开关用来控制当Transform发生改变时是否在物理引擎里是否进行同步。如果勾选，那么当Transform发生改变时，其自身和children的Rigidbody和Collider组件都会同步更新，可能会造成一个性能的峰值。若设为false，则只会在FixedUpdate期间的物理模拟步骤前进行同步。一般我们设为false，在需要的时候手动调用Physics.SyncTransforms方法来触发
- 用好Profiler来看下我们的物理检测是否是当前的瓶颈

## 题外话

[Motion Matching](https://zhuanlan.zhihu.com/p/50141261)

## Motion Matching

Motion Matching 继承了Motion Fields 的“实时搜索动画数据库找到最合适的祯或片段来实时合成新的动画”的思路， 将 Motion Fields 的算法简化并实用化并且成功的用于游戏的角色操作系统中, 此系统大多用于寻路（走，跑，跳 等）, 且已经达到了在及时反馈的前提下，不牺牲动画质量的最好的过度混合效果

### Motion Matching 实现

我们知道了Motion Matching 继承了Motion Fields 的 实时搜索动画数据库找到最合适的祯或片段来实时合成新的动画 的思路，其最关键的部分就是如何找到与当前动画最匹配的动画数据
那就是：通过对比当前动画与动画数据库中的动画数据的 轨迹，Pose，速度
