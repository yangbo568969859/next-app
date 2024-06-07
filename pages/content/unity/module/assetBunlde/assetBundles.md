# AssetBundle

## 资产、对象和序列化

### 内部资产和对象

- Assets
  - Asset 是磁盘上的文件，存储在Unity项目的Assets文件夹中。纹理，3D模型，音频是常见的资源类型。某些资源包含Unity原生格式的数据，例如材质。其他资源需要处理为原生格式，例如 FBX 文件
- UnityEngine.Objects
  - 是一组共同描述资源的特定实例的序列化数据
  - 这可以是Unity引擎使用的任何类型的资源，例如网格，精灵，音频或动画。
  - 所有对象都是UnityEngine.Object基类的子类
- 虽然大多数对象类型都是内置的，但有两种特殊类型
  - ScriptableObject 为开发人员提供了一个方便的系统来定义自己的数据类型。这些类型可以由Unity本机序列化和反序列化，并在Unity编辑器的Inspector窗口进行操作
  - MonoBehavior提供了链接到MonoScript的包装器。MonoScript是一种内部数据类型，Unity使用它来保存对特定程序集和命名空间内的特定脚本类的引用。MonoScript不包含任何实际可执行的代码

### 对象间引用

所有UnityEngine.Object 都可以引用其它 UnityEngine.Object，这些其它对象可能驻留在同一资产文件中，或者可以从其它资产文件导入。例如：材质对象通常具有一个或多个对纹理对象的引用。这些纹理对象通常是从一个或多个纹理资源文件导入的

序列化后，这些引用由两个独立的数据组成：文件GUID和本地ID，文件GUID标识存储目标资源的资产文件。本地唯一的本地ID标识资产文件中的每个对象，因为资产文件可能包含多个对象

文件GUID存储在.meta文件中，这些meta文件是在Unity首次导入资产时生成的，并存储在与资产相同的目录中

### 为什么要归档 GUID 和本地 ID

### Composite Assets and importers

### 序列化和实例

### MonoScripts

### 资源生命周期

### 加载大层次结构

## 资源文件夹

## AssetBundle 基础知识

## AssetBundle 使用模式
