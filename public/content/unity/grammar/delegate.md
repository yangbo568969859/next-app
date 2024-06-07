# 委托 Delegate

委托是一种类(Class),引用类型的数据类型

可以存储一个、或者多个方法的引用（可以封装一个、或者多个方法）

一个委托是一种类，可以指向一个或多个方法（这个委托有参数列表和返回值类型）
当你实例化委托后、即创建委托的实例
这个委托类型的实例，可以和任何其他方法相关联起来，即可以存储这些方法的引用（只要类型兼容（任何方法他们的签名和返回值和委托类型的签名和返回值保持一致））
你可以间接调用这些方法，通过类型的实例

```C#
public delegate void Mydelegate();
Debug.LogError("MyDelegate Is Class or Not: " + typeof(MyDelegate).IsClass);
```

## 使用委托需注意

委托使用不当会导致内存泄漏Memory Leak和性能下降
