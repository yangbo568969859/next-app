## 健壮性
### 三不要原则
- 不要相信任何外部输入的参数
- 不要忽略任何一个错误
- 不要假定异常不会发生

## GO函数的异常处理设计
### 认识GO语言的异常：panic
panic指的是Go程序在运行时出现的一个异常情况，如果异常出现了，但没有捕获并恢复，Go程序的执行就会终止，即便出现异常的位置不在主Goroutine中

panic来源
- Go运行时
- Go开发人员通过panic函数主动触发的
Go提供了捕捉panic并恢复程序正常执行秩序的方法，我们可以通过recover函数来实现这一点
recover是Go内置的专门用于恢复panic的函数，它必须放在一个defer函数中才能生效
```go
func bar() {
  defer func() {
    if e := recover(); e != nil {
      fmt.Println("recover the panic:", e)
    }
  }()
  println("call bar")
  panic("panic occurs in bar")
  zoo()
  println("exit bar")
}
```
### 应对panic
- 评估程序对panic的忍受度
  - 针对各种应用对panic忍受度的差异，我们采取应对panic的策略也不同；就比如后端http服务器程序这样的关键系统，就需要在特定的位置捕捉并恢复panic，以保证服务器整体的一个健壮性；像一个单次运行于控制台的命令交互程序，对崩溃的忍受度就没有那么高
- 提示潜在bug
  - 可以使用panic，部分模拟断言对潜在bug的提示功能
  - Go标准库中，大多数panic的使用都是充当类似断言的作用的
- 不要混淆异常和错误
  - 作为API函数的作者，一定不要将panic当做错误返回提供给API调用者

## 函数简洁性
### 使用defer简化函数实现
defer是Go语言提供的一种延迟调用机制，defer的运作离不开函数
- 在Go中，只有在函数（和方法）内部才能使用defer
- defer关键字后面只能接函数（或方法），这些函数被称为deferred函数，defer将它们注册到其所在的Gorountine中，用于存放deferred函数的栈数据结构中，这些deferred函数将在执行defer的函数退出前，按后进先出的书序被程序调度执行

### defer使用的几个注意事项
- 明确哪些函数可以作为deferred函数
  - 对于有返回值的自定义函数或方法，返回值会在deferred函数被调度执行的时候自动丢弃
  - append/cap/len/make/new/imag等内置函数都是不能直接作为deferred函数的
  - close/copy/delete/print/recover等内置函数都可以直接被defer设置为deferred函数
  ```go
  func bar() (int, int) {
    return 1, 1
  }
  func foo() {
    var c chan int
    var sl []int
    var m = make(map[string]int, 10)
    m["item1"] = 1
    m["item2"] = 2
    var a = complex(1.0, -1.4)

    var sl1 []int
    defer bar()
    defer append(sl, 11)
    defer cap(sl)
    defer close(c)
    defer complex(2, -2)
    defer copy(sl1, sl)
    defer delete(m, "item1")
    defer imag(a)
    defer len(sl)
    defer make([]int, 10)
  }
  ```
  - 对于那些不能直接作为deferred函数的内置函数，我们可以使用一个包裹它的匿名函数来间接满足要求
  ```go
  defer func() {
    _ = append(sl, 11)
  }()
  ```
- 注意defer关键字后面表达式的求值时机
  - defer关键字后面的表达式，是在将deferred函数注册到deferred函数栈的时候进行求值的
- 知晓 defer 带来的性能损耗

## 方法
函数是Go代码中的基本功能逻辑单元，它承载了Go程序的所有执行逻辑。可以说，Go程序的执行流本质上就是在函数调用栈中上下流动，从一个函数到另一个函数

### 方法的本质
- Go方法的本质就是，一个以方法的receiver参数作为第一个参数的普通函数
- Go方法的声明有六个组成部分，除了和函数一样的关键字、方法名、参数列表、返回值列表、方法体之外还多了一个receiver部分，这个receiver参数也是方法和类型之间的纽带，也是方法和函数最大不同
### 方法receiver的类型选择（方法接收器）
- 每个方法只能有一个receiver参数
- 方法接收器（receiver）参数、函数/方法参数，以及返回值变量对应的作用域范围，都是函数/方法体对应的显式代码块
- receiver参数的基类型本身不能为指针或接口类型，Go要求，方法声明要与receiver参数的基类型声明放在同一个包内
  - 我们不能为原生类型（int float64 map）添加方法
  - 不能跨越Go包为其他包的类型声明新方法
- receiver参数类型
  - receiver参数的类型为T时
    - 对参数t做任何修改，都只会影响副本，而不会影响到原T类型实例
  - receiver参数的类型为*T时
    - 对参数 t 做的任何修改，都会反映到原 T 类型实例上
- 选择receiver参数类型的第一个原则
  - 如果Go方法要把对receiver参数代表的类型实例的修改反映到原类型实例上，那么我们应该选择*T作为receiver参数的类型
- 选择receiver参数类型的第二个原则
  - 一般情况下，我们通常会为receiver参数选择T类型，因为这样可以缩窄外部修改类型实例内部状态的接触面，也就是尽量少暴露可以修改类型内部状态的方法
  -  考虑到Go方法调用时，receiver参数是以值拷贝的形式传入方法中的，那么，如果receiver参数类型的size较大，以值拷贝形式传入就会导致较大的性能开销，这时我们选择*T作为receiver类型可能好点
- 选择receiver参数类型的第三个原则
  - 就是T类型是否需要实现某个接口，也就是是否存在将T类型的变量赋值给某个接口类型变量的情况
### 方法集合
方法集合也是用来判断一个类型是否实现了某接口类型的唯一手段
### 方法“继承”
“继承”是通过Go语言的类型嵌入（Type Embedding）来实现的
- 类型嵌入指的是在一个类型的定义中嵌入了其他类型
  - 接口类型的类型嵌入
  ```go
  type E interface {
    M1()
    M2()
  }
  type I interface {
    M1()
    M2()
    M3()
  }
  type L interface { 
    E
    M3()
  }
  // I等价于L 像这种在一个接口类型（I）定义中，嵌入另外一个接口类型（E）的方式，就是我们说的接口类型的类型嵌入
  ```
  - 结构体类型的类型嵌入
  ```go
  type T1 int
  type t2 {
    n int
    m int
  }
  type I interface {
    M1()
  }
  type S1 struct {
    T1
    *t2
    I
    a int
    b string
  }
  // T1、t2 和 I 这三个标识符既代表字段的名字，也代表字段的类型
  // 标识符T1表示的字段名为T1，它的类型为自定义类型T1
  // 标识符t2表示的字段名为t2，它的类型为自定义结构体t2的指针类型
  // 标识符I表示的字段为I，它的类型为借口类型I
  ```
    - 这种以某个类型名、类型的指针类型名或接口类型名，直接作为结构体字段的方式就叫做结构体的类型嵌入，这些字段也被叫做嵌入字段（Embedded Field）