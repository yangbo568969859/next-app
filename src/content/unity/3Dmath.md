### Vector3

- 模长 float dis = vertor.magnitude;
  - 模的平方 vertor.sqrMagnitude;
  - transform.position.magnitude
- 方向 （归一化，标准）
  - transform.position / transform.position.magnitude
- 向量的计算
  - 等于各个分向量相减 [x1, y1, z1] - [x2, y2, z2] = [x1 - x2, y1 - y2, z1 - z2]  注意要移动到原点
  - Vector3 result = transform1.position - transform2.position // result.normalized 获取方向，避免两个物体间距对速度不影响
  - 等于各个分向量相加 [x1, y1, z1] + [x2, y2, z2] = [x1 + x2, y1 + y2, z1 + z2]  两向量对角线
- 向量和标量的乘除
  - 乘法：该向量的各个分向量相乘 k[x, y, z] = [kx, xy, kz]
  - 除法：该向量的各个分向量相除
  - 几何意义： 缩放向量长度
- API
  - Vector3.up
  - Vector3.right 等价于 Vector3(0, 1, 0)
  - Vector3.forward 等价于 Vector3(0, 0, 1)

### 点乘

- Dot 点乘又称点积或内积
- 公式 各个分向量乘机和 [x1, y1, z1]·[x2, y2, z2] = x1x2 + y1y2 + z1z2
- 几何意义 a·b = |a|·|b|cos<a,b> 两个向量的单位向量相乘后再乘以二者夹角的余弦值
- API float dot = Vector3.Dot(va, vb); // float dot = Vector3.Dot(t1.position.normalized, t2.position.normalized); angle = Mathf.Acos(dot) * Mathf.Rad2Deg; // 计算夹角
- 计算后的夹角只能试0-180度之间的，区分不出正反
- yingyong

### 叉乘

- Cross 叉乘又称叉积或外积
- 公式  [x1, y1, z1] x [x2, y2, z2] = [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2]
- 几何意义：结果为两个向量所组成面的垂直向量，模长为两向量模长乘积在乘夹角的正弦值
- API Vector vector = Vector.Cross(a, b)
- 区分出正反 if (vector.y < 0) angle = 360 - angle
- 应用 创建垂直于平面的向量 判断两条向量的相对位置

### 角的度量方式

- 角度Degree
- 弧度Radian
- 两条射线从圆心向周围射出，形成一个夹角与夹角正对的一段弧。当弧长等于圆周长的360分之一时，夹角为1度。弧长等于圆的半径时，夹角为1弧度
- PI=180度 1弧度=180度/PI 1角度=PI/180度
- 角度 >= 弧度：弧度 = 角度*PI/180   API： 弧度=角度数*Mathf.Deg2Rad
- 弧度 >= 角度：角度 = 弧度*180/PI   API： 角度=弧度数*Mathf.Rad2Deg

### 三角函数

- 建立了直角三角形中角与边长比值的关系
- 可用于根据一边一角，计算另一边长  角的对边a，角的临边b，角的斜边c
- sin x = a / c;  API: Mathf.Sin(float radian)
- cos x = b / c;  API: Mathf.Cos(float radian)
- tan x = a / b;  API: Mathf.Tan(float radian)

### 反三角函数

- 反正弦、反余弦、反正切等函数总成
- 可用于根据两边，计算角度  角的对边a，角的临边b，角的斜边c
- arcsin a / c = x;  API: Mathf.Asin(float radian)
- arccos b / c = x;  API: Mathf.Acos(float radian)
- arctan a / b = x;  API: Mathf.Atan(float radian)

### 欧拉角

- 什么是欧拉角
  - 使用三个角度来保存方位
  - X与Z沿自身坐标系旋转，Y沿世界坐标系旋转
  - API Vector3 eulerAngle = this.transform.enlerAngles; xyz表示各个轴向上的旋转角度
- 优点
  - 仅使用三个数字表达方位，占用空间小
  - 沿坐标轴旋转的单位为角度
  - 任意三个数字都是合法的，不存在不合法的欧拉角
- 缺点
  - 方位的表达方式不唯一 对于一个欧拉角，存在多个欧拉角的描述，无法判断多个欧拉角代表的角方位是否相同 例如 --0,5,0和0,365,0 --250,0,0和290,180,180
  - 为了保证任意方位都只有独一无二的表示，unity引擎限制了角度范围，即沿x轴旋转限制在-90到90之间，沿y与z轴旋转限制在0-360之间
  - 万向节死锁
    - 物体沿X轴旋转正负90度，自身坐标系Z轴与世界坐标系Y轴将重合，此时再沿Y或Z轴旋转时，将失去一个自由度
    - 在万向节死锁的情况下，规定沿Z轴完成绕竖直轴的全部旋转，此时Y轴旋转为0

### 四元数

- Quaternion 在3D图形学中代表旋转，由一个三维向量(X,Y,Z)和一个标量(W)组成
- 旋转轴为V，旋转弧度为0，如果使用四元数表示，则四个分量为：
x = sin(0/2)*V.x
y = sin(0/2)*V.y
z = sin(0/2)*V.z
w = cos(0/2)
- X,Y,Z,W 取值范围 -1到1
- API Quaternion qt = this.transform.rotation
- 优点
  - 避免万向节死锁
    - this.transform.rotation *= Quaternion.Euler(0, 1, 0);
    - 等价于 this.transform.Rotate(Vector3 eulerAngles)
- 缺点
  - 难于使用，不建议单独修改某个数值
  - 存在不合法的四元数

### 坐标系

- Unity坐标系
  - World Space 世界坐标系，整个场景的固定坐标；作用：在游戏场景中表示每个游戏对象的位置和方向
  - Local Space 物体坐标系，每个物体都有独立的坐标系，原点为模型轴心点，随物体移动或旋转改变； 作用：表示物体间相对位置和方向
  - Screen Space 屏幕坐标系，以像素为单位，原点在屏幕的左下，Z为物体到相机的距离； 作用：表示物体在屏幕中的位置
  - Viewport Space 视口（摄像机）坐标系，原点在左下(0, 0)，Z为到相机的距离，右上角为(1, 1)； 作用：表示物体在摄像机中的位置
- 坐标系转换
  - Local Space -> World Space
    - transform.forward 在世界坐标系中表示物体正前方
    - transform.right 在世界坐标系中表示物体正右方
    - transform.up 在世界坐标系中表示物体正上方
    - transform.TransfromPoint 转换点，受变换组件位置、旋转和缩放影响
    - transform.TransfromDirection 转换方向，受变换组件旋转影响
    - transform.TransfromVector 转换向量，受变换组件旋转和缩放影响
  - World Space -> Local Space
    - transform.InverseTransformPoint 转换点，受变换组件位置，旋转和缩放影响
    - transform.InverseTransformDirection 转换方向，受变换组件旋转影响
    - transform.InverseTransformVector 转换向量，受变换组件旋转和缩放影响
  - World Space <-> Screen Space
    - Camera.main.WorldToScreenPoint 将点从世界坐标系转换到屏幕坐标系
    - Camera.main.ScreenToWorldPoint 将点从屏幕坐标系转换到世界坐标系
  - World Space <-> ViewPort Space
    - Camera.main.WorldToViewportPoint 将点从世界坐标系转换到视口坐标系
    - Camera.main.ViewportToWorldPoint 将点从视口坐标系转换到世界坐标系
