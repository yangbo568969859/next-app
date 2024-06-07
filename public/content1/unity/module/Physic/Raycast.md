# Raycast 射线检测

## 常用API

- Physics.Raycast  从点原点沿方向向场景中的所有碰撞体投射长度为 maxDistance 的射线。
- Physics.RaycastAll  将光线投射穿过场景并返回所有命中。 请注意，结果的顺序未定义。
- Physics.RaycastNonAlloc  通过场景投射光线并将命中存储到缓冲区中。
- Physics.CheckSphere  如果有任何碰撞器与世界坐标中的位置和半径定义的球体重叠，则返回 true
- Physics.SphereCast  沿着射线投射球体并返回有关所击中物体的详细信息。
- Physics.OverlapSphere  计算并存储接触球体或球体内部的碰撞器。

## 应用

### 地面检测

### 斜坡检测
