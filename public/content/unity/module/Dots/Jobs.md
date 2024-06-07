# Jobs

- 包含C# Jobs System和C++ Jobs System
- 利用多核计算平台来简单安全的编写与执行多线程代码
- 既可以与ECS结合使用也可以单独使用
- 不需要关心平台CPU核心资源情况

注意： JobSystem的调度，每次并不是一个Job一个Job来调度，会根据具体任务的复杂度来调度n个；工作线程的个数与用户硬件核心个数相关

## Jobs Systems

- No Jobs Systems
  - 只访问数据的拷贝
  - 或者可以转换一段Buffer的所有权给这个Job(Native Container)
- 使用和Unity引擎内C++ JobSystem系统的代码
  - 引擎与游戏线程之间没有上下文切换的开销

### Native Container

- 非托管内存
- 有DisposeSentinel来避免内存泄漏错误
- 有AutomicSafetyHandle来追踪所有权和权限
- 需要手动Dispise释放
- 没有引用返回

### Allocation Types

- Persistent 长生命周期内存
- TempJob 只在Job中存在的短生命周期，4帧以上会收到警告
- Temp 一个函数返回前的短生命周期
