### 文件说明
- StreamingAssets 流媒体资源
  - 注意： 位于 StreamingAssets 文件夹中的 .dll 和脚本文件不参与脚本编译

### 调试
1. 控制台调试
- Debug.Log();
- print();
- Debug.LogError();
2. 定义共有变量，程序运行后在检测面板查看数据

### 声明形式
[Serializable] // 用于序列化
[SerializeField] // 序列化字段，在编辑器中显示私有变量
[HideInInspector] // 编译器中隐藏public字段
[Range(0, 100)] // 设置范围
[RequireComponent(typeof(XXX))] // 顶部声明，多个组件绑定在一起
[Header("Window Settings")] 变量前加标识符
[ExecuteInEditMode] 在EditMode下也可以执行脚本
```C#
[SerializeField, Range(0.0f, 100.0f), Tooltip("鼠标悬浮显示的内容说明.")]
private float FollowSpeed = 5.0f;
```

### 预处理器指令
预处理器指令指导编译器在实际编译开始之前对信息进行预处理。

所有的预处理器指令都是以 # 开始，不以分号（;）结束

<table><tbody>
  <tr>
    <th>预处理器指令</th><th>描述</th>
  </tr>
  <tr>
    <td>#define</td>
    <td>用于定义一系列成为符号的字符</td>
  </tr>
  <tr>
    <td>#undef</td>
    <td>用于取消定义符号</td>
  </tr>
  <tr>
    <td>#if</td>
    <td>用于测试符号是否为真</td>
  </tr>
  <tr>
    <td>#else</td>
    <td>用于创建复合条件指令，与#if一起使用</td>
  </tr>
  <tr>
    <td>#elif</td>
    <td>用于创建复合条件指令</td>
  </tr>
  <tr>
    <td>#endif</td>
    <td>指定一个条件指令的结束</td>
  </tr>
  <tr>
    <td>#line</td>
    <td>可以让你修改编译器的行数以及输出错误和警告的文件名</td>
  </tr>
  <tr>
    <td>#error</td>
    <td>允许从代码的指定位置生成一个错误</td>
  </tr>
  <tr>
    <td>#warning</td>
    <td>允许从代码的指定位置成成一级警告</td>
  </tr>
  <tr>
    <td>#region</td>
    <td>在使用Visual Studio Code Editor的大纲特性时，制定一个可展开或折叠的代码块</td>
  </tr>
  <tr>
    <td>#endregion</td>
    <td>标识着region块的结束</td>
  </tr>
</table>

### 注释
- 单行注释 // (Ctrl + k) (Ctrl + /) 
- 多行注释 /** */
- 注释说明
```C#
/// <summary>
/// 方法说明
/// </summary>
/// <param name="eventId">参数1</param>
/// <param name="data">参数2</param>
```

#### 提供当前类的对象引用
```c#
public static PlayerStatusInfo Instance{ get; private set; }
```

### 热更新方案
- 商用热更新 [xlua](https://github.com/Tencent/xLua)
- 开源热更新 [Tolua](https://github.com/topameng/tolua)和[ILRuntime](https://github.com/Ourpalm/ILRuntime)
