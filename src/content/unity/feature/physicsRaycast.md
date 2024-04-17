# PhysicRaycast

## Physic.Raycast 重载方法介绍

- Physic.Raycast(Vector3 origin, Vector3 direction, RaycastHit hitinfo, float distance, int LayerMask);
  - origin 射线在世界坐标中的初始点，或者叫发射点位置
  - direction 射线的具体防线（以此去存储射线的方向信息）
  - hitinfo RaycastHit结构体类型，储存了射线击中 碰撞器模型 后，产生的碰撞信息
    - RaycastHit.point  // 表示射线与碰撞体焦点的位置坐标
    - RaycastHit.Normal // 表示射线射入平面的法向量
    - RaycastHit.collider // 表示射线射到碰撞器
  - distance  // 决定射线最大距离（武器的射击范围）
  - LayerMask // 仅在指定层检测

```C#
Ray myRay = new Ray(Vector3 origin, Vector3 direction); // Ray 类型可以存储两个Vector3类型的变量
Physic.Raycast(myRay, RaycastHit hitinfo, float distance, int LayerMask);

Debug.DrawLine(transform.position, hitinfo.point, Color.red);
```
