# C#基础语法

## 目录

### 常用数据结构

- :Array ArrayList
  - Array 分配在连续内存，不能随意扩展，插入数据很慢
  - Array 性能高，索引查找快，数据再多没有影响
  - ArrayList 可变长，不限制类型，所以可能不安全，放了不同类型，可能用错
  - ArrayList 一切元素都是object，值类型会装箱
- :List LinkedList
  - List也是数组，泛型，变长的，没有装箱和拆箱类型安全
  - LinkedList 添加删除效率高，查询慢，不支持索引因为不在一块内存，要从头找起
- :Queue/Stack
  - Queue 队列先进先出
  - Stack 栈后进先出
- :Hashtable/Dictionary
  - Hashtable
    - hashtable数据不能太多
    - 快速的增删改查，空间换时间
    - 线程安全的集合
  - Dictionary
    - 泛型的Hashtable
    - 支持索引访问

### 装箱和拆箱

- 装箱 将值类型转换为引用类型
- 拆箱 将引用类型转换为值类型
- 看两种类型是否发生了装箱或拆箱，要看两种类型之间是否存在继承关系

```C#
int n = 10;
object  = n; // 装箱
int nn = (int)o; // 拆箱
```

### ToString()

- ToString("0.00"); 对数字进行格式化，

```C#
double value = 1.1455;
string svalue = value.ToString("0.00");
value = Convert.ToDouble();
```

### Array类属性

- IsFixedSize 获取一个值，表示数组是否带有固定的大小
- IsReadOnly 获取一个值，指数组是否只读
- Length 获取一个32位整数
- LongLength 获取一个64位整数，表示所有维度的数组中的元素个数
- Rank 获取数组维度

### Array类方法

- Clear
- Copy(Array, Array, Int32)
- CopyTo(Array, Int32)
- GetLength
- GetLongLength
- GetLowerBound
- GetType
- GetUpperBound
- GetValue(Int32)
- IndexOf(Array, Object)
- Reverse(Array)
- Sort(Array)
- ToString

### Property 属性

保护字段，对字段的赋值和取值进行限制

### Struct（结构体）

可以存储各种数据类型的相关数据，struct关键字用于创建结构体，结构体是值类型数据结构

- 结构体可带有方法、字段、索引、属性、运算符方法和事件
- 结构体可定义构造函数
- 与类不同，结构不能集成其他的结构或类
- 结构不能作为其他结构或类的基础结构
- 结构可实现一个或多个接口
- 结构成员不能指定为abstract、virtual或protected
- 当使用New操作符创建一个结构对象时，会调用适当的构造函数来创建结构。与类不同，结构可以不适用New操作符即可被实例化
- 如果不使用New操作符，只有在所有的字段都被初始化之后，字段才能赋值，对象才被使用

#### 结构体和类比较

- 类是引用类型，结构体是值类型
- 类可以继承，结构体不支持继承
- 结构不能声明默认的构造函数
- 结构体中声明的阻断不能赋予初始值，类可以

### 构造函数

帮助初始化对象，给对象的每个属性一次赋值；是一个特殊的方法（无返回值，并且不能定义为void）；可以重载

创建对象的时候执行构造函数

```C#
public class Student {
  public Student(string name, int age) {
    this.Name = name;
    this.Age = age;
  }
  private string _name;
  public string Name {
    get { return _name; }
    set { return _name = value; }
  }
  private int _age;
  public int Age {
    get { return _age; }
    set { return _age = value; }
  }
}
```

#### new

- 内存中开辟一块空间
- 在开辟的空间中创建对象
- 调用对象的构造函数进行初始化对象

#### this

- 代表当前类的对象
- 在类中显示的调用当前类的构造函数

```C#
public class Student {
  public Student(string name, int age) {
    this.Name = name;
    this.Age = age;
  }
  public Student(string name):this(name, 0) {}
  private string _name;
  public string Name {
    get { return _name; }
    set { return _name = value; }
  }
  private int _age;
  public int Age {
    get { return _age; }
    set { return _age = value; }
  }
}
```

### 析构函数

类的 析构函数 是类的一个特殊的成员函数，当类的对象超出范围时执行

析构函数的名称是在类的名称前加上一个波浪形(~)作为前缀，它不返回值，也不代表任何参数

析构函数用于结束程序（比如关闭文件，释放内存等）之前释放资源。析构函数不能继承或重载

```C#
// 程序结束的时候才会执行，主要用来释放资源
public class Student {
  ~Student() {}
}
```

### 迭代器模式

- 实现方式
  - 必须实现Ienumerable
  - 只要内部有IEnumerator GetEnumerator() 就可以使用foreach

```C#

```

### Yield

- yield必须出现在Ienumerable
- yield是迭代器的状态机，可以做到延迟查询，按需加载

```C#
public Ienumerable<int> Power() {
  for (int i = 0; i < 20; i++) {
    yield return this.Get(i);
    if (i == 3) {
      yield break;
    }
  }
}
```

### dynamic

- dynamic可以隐式转换成任何类型
- 无视编译器检查，运行的时候才确定类型的

### 访问修饰符

- public：所有对象都可以访问；
- private：对象内部可以访问；
- protected：只有该类对象及其子类对象可以访问；
- internal：同一个程序集的对象可以访问；
- protected internal：访问限于当前程序集或派生自包含类的类型。（并 的关系）

- public和internal能修饰类

### 类调用关键字

- Base 表示调用基类方法，或者被重写的方法
- New 表示重写同名方法，隐藏父类方法
- Override 表示重载父类方法

### ref 和 out

- ref 使用ref关键字声明引用参数，该种类型的参数传递变量地址给方法，实参和形参会相互影响

```C#
using System;
namespace CalculatorApplication {
  class NumberManipulator {
    public void swap(ref inx x, ref int y) {
      int temp;

      temp = x;
      x = y;
      y = temp;
    }
    static void Main(string[] args) {
      NumberManipulator n = new NumberManipulator();
      int a = 100;
      int b = 200;
      Console.WriteLine("在交换之前，a 的值： {0}", a);
      Console.WriteLine("在交换之前，b 的值： {0}", b);

      /* 调用函数来交换值 */
      n.swap(ref a, ref b);

      Console.WriteLine("在交换之后，a 的值： {0}", a);
      Console.WriteLine("在交换之后，b 的值： {0}", b);

      Console.ReadLine();
    }
  }
}
输出
在交换之前，a 的值：100
在交换之前，b 的值：200
在交换之后，a 的值：200
在交换之后，b 的值：100
```

- out 使用out关键字声明引用参数，输出参数会把方法输出的数据赋给自己

```C#
using System;
namespace CalculatorApplication {
  class NumberManipulator{
    public void getValue(out int x) {
      int temp = 5;
      x = temp;
    }
    static void Main(string[] args) {
      NumberManipulator n = new NumberManipulator();
      int a = 100;
      Console.WriteLine("在方法调用之前，a 的值： {0}", a);
      /* 调用函数来获取值 */
      n.getValue(out a);
      Console.WriteLine("在方法调用之后，a 的值： {0}", a);
      Console.ReadLine();
    }
  }
}
输出
在方法调用之前，a 的值： 100
在方法调用之后，a 的值： 5
```

- ref 和 out区别
  - 是否需要初始化。ref型传递变量前，变量必须初始化，否则编译器报错；out型则不需要初始化
  - ref型传递变量，数值可以传入方法中；out型无法将数据传入方法中。换言之，ref型有进有出，out型只出不进
  - out型数据在方法中必须要复制，否则编译器报错。即out必须要出，ref不必须
  - 重载时的区别，重载方法时若两个方法的区别仅限于一个参数类型为ref另一个放发中为out，编译器会报错
- params 可变参数（必须是形参列表最后一个）

```C#
public void getSummary(string name, params int[] scores) {

}
```

### 静态和非静态区别

- 在非静态类中，既可以有实例成员，也可以有静态成员
- 静态成员必须使用类名去调用，实例成员使用对象名调用
- 静态函数中，只能访问静态成员，不允许访问实例成员
- 静态类中只允许有静态成员，静态类不允许被实例化

- 工具类考虑静态类，静态类资源共享

### 方法重载

方法的名称相同，参数不同

```C#
public static void M(int n1, int n2) {
  int result = n1 + n2;
}
public static double M(double n1, double n2) {
  return n1 + n2;
}
public static double M(double n1, double n2, double n3) {
  return n1 + n2 + n3;
}
```

### int? 语法

- int? 表示一个int类型，且该int类型可空，如果不加?的话，那么int类型的默认值为0，不能赋null值

```C#
int aa = null; // 会报错，因为int不是null
```

- 当给一个变量定义成int? 类型的时候，我们在赋予初值的时候，可以赋null，也可以赋0
- int?? 用于判断赋值，先判断当前变量是否为null，如果是就可以赋一个新值，否则跳过

```C#
class Program {
  static void Main(string[] args) {
    int ? aa = null;
    int b = a ?? 0;
    Console.WriteLine(b);
  }
}
```

### 继承

已有的类被称为基类，这个新的类被称为派生类

```
class <派生类>:<基类>
{
  ...
}
```

- 继承的语法： class子类类名：class父类名称
- 继承的特点： 子类拥有所有父类中的所有字段、属性和方法（private除外）
- 一个类可以有多个子类，但是父类只有一个(C#无多重继承)
- 一个类在继承另一个类的同时，还可以被其他类继承
- 在C#中，所有的类都直接或间接的继承自Object类
- 子类没有继承父类构造函数；但是子类会默认调用父类无参数的构造函数，创建父类对象，让子类可以使用父类中的成员
- : base 执行父类有参数构造函数

```C#
public class Student : Person
{
    public Student(string name, int age) : base(name, age)
    {
        
    }
}
```

基类访问（访问隐藏的基类成员）

```C#
Console.WriteLine("{0}", base.Field1);
```

### 里氏转换

- 子类可以赋值给父类

```C#
Student s = new Student();
Person p = s;
```

- 如果父类中装的是子类对象，那么可以将这个父类强制转换为子类对象

```C#
Person p = new Student();
Student ss = (Student)p;
```

- is 如果能转化成功 返回true
- as 表示类型转换，如果能够转换则返回对应的对象

```C#
if (p is Teacher) {

}
```

### 序列化和反序列化

数据传输

- 序列化：将对象转换为二进制

```C#
BinaryFormatter bf = new BinaryFormatter();
bf.Serialize(fsWrite, p);
```

- 反序列化：将二进制转为对象

```C#
using(
  FileStream fsRead = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Read)
) {
  BinaryFormatter bf = new BinaryFormatter();
  bf.Deserialize(fsRead);
  p = (Person)bf.Deserialize(fsRead);
  Console.WriteLine(p.Name);
}
```

### 访问器（Accessors）

属性（Property）的访问器（accessor）包含有助于获取（读取或计算）或设置（写入）属性的可执行性语句。

访问器（accessor）声明可包含一个get访问器、一个set访问器

```C#
public string code {
  get {
    return code;
  }
  set {
    code = value;
  }
}
```

### 索引器（Indexer）

索引器（Indexer）允许一个对象可以像数组一样使用下标的方式来访问

当你为类定义一个索引器时，该类的行为就会像一个虚拟数组（virtual array）一样，可以使用数组访问运算符[]来访问该类成员

```C#
element-type this[int index] {
  get { 
    // 返回 index 指定的值 
  }
  set { 
    // 设置 index 指定的值 
  }
}
```

#### 索引器（Indexer）用途

索引器的行为的声明在某种程度上类似于属性（property）。就像属性（property），你可以使用set，get访问器来定义索引器。但是，属性返回或设置一个特定的数据成员，而索引器返回或设置对象实例的一个特定值。换句话说，它把实例数据分为更小的部分，并索引每个部分，获取或设置每个部分。

定义一个属性（property）包括提供属性名称。索引器定义的时候不带有名称，但带有 this 关键字，它指向对象实例

### 委托（Delegate）

C# 中的委托（Delegate）类似于 C 或 C++ 中函数的指针。委托（Delegate） 是存有对某个方法的引用的一种引用类型变量。引用可在运行时被改变。

委托（Delegate）特别用于实现事件和回调方法。所有的委托（Delegate）都派生自 System.Delegate 类。

#### 声明委托

```C#
public delegate int MyDelegate (string s);
/// 语法 delegate <return type> <delegate-name> <parameter list>
```

#### 实例化委托

一旦声明了委托类型，委托对象必须使用new 关键字创建，且与一个特定的方法有关，当创建委托时，传递到new语句的参数就像方法调用一样书写，但是不带有参数

```C#
public delegate void printString(string s);
printString ps1 = new printString(WriteToScreen);
printString ps2 = new printString(WriteToFile);
```

### 事件（Event）

事件基本上说是一个用户操作，比如按键、点击、鼠标移动等等，或者是一些提示信息，比如系统生成的通知。应用程序需要在事件发生时响应事件

声明事件（Event） 在类的内部声明事件，首先必须声明该事件的委托类型。例如：

```C#
public delegate void BoilerLogHandler(string status);
// 然后，声明事件本身，使用 event 关键字：

// 基于上面的委托定义事件
public event BoilerLogHandler BoilerEventLog;
```

#### 对象可以用父类声明，却用子类实例化

- 这个实例是子类的，但是因为你声明时用父类声明的，所以你用正常的办法访问不到子类自己的成员，只能访问到从父类继承来的成员
- 在子类中用override重写父类中用virtual声明的虚方法时，实例化父类调用该方法，执行时调用的是子类中重写的方法
- 如果在子类中用new覆盖父类中用virtual声明的虚方法时，实例化父类调用该方法，执行时调用的是父类中的虚方法

### 多态性

多态是同一个行为具有多个不同表现形式或形态的能力，简单来说就是“一个接口，多个功能”

#### 静态多态性和动态多态性

- 静态多态性中，函数的响应是在编译时发生的。
- 动态多态性中，函数的响应是在运行时发生的。

#### 静态多态性

- 函数重载：函数名相同，函数定义不同（如参数个数，参数类型不同），但是不可以只是返回类型不同
- 运算符重载：可以重定义或重载C#中内置的运算符，通过关键字operator后跟运算符的符号来定义的

```c#
public static Box operator+ (Box b, Box c) {
  Box box = new Box();
  box.length = b.length + c.length;
  box.breadth = b.breadth + c.breadth;
  box.height = b.height + c.height;
  return box;
}
// 上面的函数为用户自定义的类Box实现了加法运算符（+）
// 他把两个Box对象的属性相加，并返回相加后的Box对象
```

#### 动态多态性

动态多态性是通过抽象类和虚方法实现的

- 抽象类： 使用关键字abstract创建抽象类，用于提供接口的部分类的实现。当一个派生类继承自该抽象类时，实现即完成。抽象类包含抽象方法，抽象方法可被派生类实现，派生类具有更专业的功能
- 虚方法： 使用关键字virtual声明的，可以在不同的继承类中有不同的实现，对虚方法的调用是在运行时发生的

#### 实现多态

- 虚方法 父类方法加关键字virtual 子类同名方法加关键字override
- 抽象类 abstract
  - 抽象类不能被实例化
  - 抽象成员必须在抽象类中
  - 子类继承抽象类后，必须把父类的所有抽象成员都重写
  - 抽象成员的访问修饰符不能是private
  - 在抽象类中可以包含实例成员，并且抽象类的实例成员可以不被子类实现
  - 如果父类的抽象方法中有参数，那么继承这个抽象类的子类在重写父类方法时必须传对应的参数，返回值也一样

```C#
public abstract class Animal
{
    public abstract void Bark();
}

public class Dog:Animal
{
    public override void Bark()
    {
        Console.WriteLine("dog bark");
    }
}
Animal animal = new Dog();
```

- 接口

### 接口

接口只包含了成员的声明，成员的定义是派生类的责任，接口提供了派生类应遵循的标准结构。

接口使用 interface 关键字声明，它与类的声明类似。接口声明默认是 public 的。

#### 接口继承

```c#
namespace TestInhert {
  interface Parent {
    void MyParent();
  }
  interface Child:Parent {
    void MyChild();
  }
  class InhertClass: Child {
    public void MyParent(){}
    public void MyChild(){}
  }
}
```

### 部分类 partial

在同一可以声明相同的部分类

```C#
public partial class Person {}
public partial class Person {}
```

### 密封类 sealed

密封类不能被继承，但是可以继承别的类

```C#
public sealed class Person:Test {}
public class Test{}
```

### 命名空间

命名空间的设计目的是提供一种让一组名称与其他名称分隔开的方式。

在一个命名空间中声明的类的名称与另一个命名空间中声明的相同的类的名称不冲突。

简单来说：相当于不同文件夹下的文件可以重名。

快捷引入命名空间 Alt + Shift + F10

#### 项目之间类引用

- 添加引用
- 引入命名空间

#### using关键字

1. 引入命名空间，这样在使用的时候就不用在前面加上命名空间名称

```C#
using System;
using Namespace1.SubNameSpace;
```

2. using static指令：指定无需指定类型名称即可访问其静态成员的类型

```C#
using static System.Math
var = PI; // 直接使用System.Math.PI
```

3. 别名

```C#
using Project = PC.MyCompany.Project;
```

4. using语句：将实例与代码绑定

```C#
using (Font font3 = new Font("Arial", 10.0f),
            font4 = new Font("Arial", 10.0f))
{
    // Use font3 and font4.
}
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

```C#
#define PI
using System
namespace PreprocessorDApp1 {
  class Program {
    static void Main(string[] args) {
      #if (PI)
        Console.WriteLine("PI is defined");
      #else
        Console.WriteLine("PI is NOT defined");
      #endif
      Console.ReadKey();
    }
  }
}
```
