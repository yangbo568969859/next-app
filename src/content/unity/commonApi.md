### Component
### Transform
- 变量
  - position 相对于世界
  - localPosition 相对于父物体
  - localScale 相对于父物体缩放比例
  - lossyScale 物体与模型缩放比例（自身缩放比例 * 父物体缩放比例）（只读）
- 方法
  - Translate this.transform.Translate(0, 0, 1) // 向自身坐标系z轴移动1米
  - Translate this.transform.Translate(0, 0, 1, Space.World) // 向世界坐标系z轴移动1
  - Rotate Translate(0, 10, 0, Space.World) // 向世界坐标系y轴移动10度
  - RotateAround(point, axias, angle)  RotateAround(Vector3.zero, Vector3.forward, 1) // 
  - 获取根物体 root
  - 获取父物体 parent
  - 设置父物体 SetParent(tf, false) // 第二个参数是否是世界坐标
  - Find("子物体名称") // 根据名称找子物体
  - Find("子物体名称/子物体名称") // 找子物体下的子物体（不建议使用路径）
  - GetChild(index) // 根据索引找子物体
  - TransformPoint(localx, localy, localz); // 将点从自身坐标系转为世界坐标系
### GameObject
- 变量
  - activeInHierarchy // 场景中物体激活状态
  - activeSelf // 自身激活状态
  - SetActive // 设置激活状态
  - AddComponent // Light light = lightGame.AddComponent<Light>();
- 方法
  - Find // 在场景中根据名称查找物体（不建议使用，性能损耗）
  - FindGameObjectsWithTag // 获取所有使用该标签的物体
  - FindWithTag // 获取使用该标签的物体（单个）
### Object
- Destory // 销毁
- DestoryImmediate // 立即销毁，慎用
- DontDestoryOnLoad // 跨场景不销毁
- FindObjectOfType // 根据类型找第一个激活的对象 Object.FindObjectsOfType<MeshRenderer>();
- FindObjectsOfType

### Time 静态变量
- time 获取s
- delteTime 以秒计算，完成最后一帧的时间 // this.transfrom.Rotate(0, 1 * Time.deltaTime, 0); 恒定旋转 速度不受机器和渲染影响
- timeScale Time.timeScale = 0|1 0-暂停 1-继续 对update不受影响，影响FixedUpdate
- unscaleDelteTime 游戏暂停，不受影响

### update 指定语句指定间隔执行一次
- 通过Time.time和定义的时间变量比对
- Time.deltaTime // totalTime += Time.deltaTime; totalTime > 1
- InvokeRepeating("Timer", 4, 1); // 被执行方法名，第一次执行时间（s），每次执行间隔（s） CancelInvoke() 取消
  - 每隔固定时间重复执行

### 预制件
- 一种资源类型，可以多次在场景进行实例
- 优点：对预制件的修改，可以同步到所有实例，提高开发效率
- 如果单独修改实例的属性值，则该值不再随预制件变化
- Select键：通过预制件实例选择对应预制件
- Revert：放弃实例属性值，还原预制件属性值
- Overrides： Apply 将某一实例的修改应用到所有实例


### Input
- 输入功能的类，可以读取输入管理器中设置的按键，以及访问移动设备的多点触控或加速感应数据
- 建议在Update中检测用户输入
#### 获取鼠标输入
- 当指定的鼠标按钮被按下时返回true（一直按住）  // bool result = Input.GetMouseButton(0)
- 在用户按下指定鼠标按键的第一帧返回true // bool result = Input.GetMouseButtonDown(0)
- 在用户释放鼠标按键第一帧返回true // bool result = Input.GetMouseBUttonUp(0)
- 按钮值设定 0-左键 1-右键 2-中键
#### 获取键盘输入
- 当通过名称指定的按键被用户按住时返回true（一直按住）  Input.GetKey(KeyCode.A)
- Input.GetKeyDown(KeyCode.A)
- Input.GetKeyUp(KeyCode.A)
- 两个键同时按 Input.GetKey(KeyCode.A) && Input.GetKeyDown(KeyCode.B)

### InputManger
- 输入管理器 Edit-Project Settings-Input
- 使用脚本通过虚拟轴名称获取自定义键的输入
- 玩家可以在游戏启动时根据个人喜好对虚拟轴进行修改
#### 获取虚拟轴
- bool Input.GetButton("虚拟轴名")
- bool Input.GetButtonDown("虚拟轴名")
- bool Input.GetButtonUp("虚拟轴名")
- float Input.GetAxis("虚拟轴名")  数值会过度
- float Input.GetAxisRaw("虚拟轴名")  数值不过度，直接从0 到 1或-1


### Vector3
- 变量
- 静态函数
  - Normalize() 将vect设置为0,0,1;
  - OrthoNormalize(ref basisA, ref basisB, ref basisC)  使向量规范化并且彼此相互垂直
  - Project 投影一个向量到另一个向量
  - ProjectOnPlane() 投影一个向量到另一个面向量
  - Reflect(inDirection: Vector3, inNormal: Vector3) 反射

### Quaternion 四元数
- 欧拉角 -> 四元数  Quaternion.Euler(欧拉角)
- 四元数 -> 欧拉角  Quaternion qt = this.transform.rotation; Vector3 euler = qt.eulerAngles;
- 轴/角旋转 Quaternion.AngleAxis(50, Vector3.up); 沿y轴旋转50度