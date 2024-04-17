## 值类型/简单类型
C#提供一套预定义的结构类型叫做简单类型。简单类型用保留字定义，这些保留字仅仅是在System名字空间里预定义的结构类型的化名。比如int是保留字，System.Int32是在System名字空间中预定义类型。一个简单类型和它化名的结构类型是完全一样的，也就是说写int和写System。Int32是一样的。简单类型主要有整型，浮点类型，小数类型，布尔类型，字符型
### 整型
C# 支持9中整型 sbyte，byte，short，ushort，int，uint，long，ulong和char
- sbyte:代表有符号的8位整数，数值范围从-128 ～ 127
- byte:代表无符号的8位整数，数值范围从0～255
- short:代表有符号的16位整数，范围从-32768 ～ 32767
- ushort:代表有符号的16位整数，范围从0 到 65,535
- int:代表有符号的32位整数，范围从-2147483648 ～ 2147483648
- uint:代表无符号的32位整数，范围从0 ～ 4294967295
- long:代表有符号的64位整数，范围从-9223372036854775808 ～ 9223372036854775808
- ulong:代表无符号的64位整数，范围从0 ～ 18446744073709551615。
- char:代表无符号的16位整数，数值范围从0～65535。 Char类型的可能值对应于统一字符编码标准(Unicode)的字符集

### 浮点类型
float和double
- Float型所能表示的值的范围大约可以从1.5*10 -45～3.4* 10 38，精确到小数点后面7位
- Double型所能表示的值的范围大约可以从5.0*10 -324～1.7* 10 308，精确到小数点后面15位或16位。 如果二元操作中的其中一个操作数为浮点类型，那么另外一个操作数是整型或浮点类型，运算规则如下: a，如果其中一个操作数是整型，则操作数被转换为另一个操作数的浮点数类型; b，如果操作数之一为double，则另一操作数也被转换成double类型，运算以double类型的精度和取值范围进行，并且所得结果也为double类型; c，否则，运算至少将以float类型的取值范围和精度进行，并且所得结果也为float型

### 小数(decimal)类型
小数类型非常适用于金融和货币运算。数值范围从1.0*10 -28～7.9* 10 28，精确到小数点后面28位。如果二元操作中的其中一个操作数是小数类型，那么另外一个从操作数是整型或小数类型。整型在运算前被转化为小数类型数。如果一个小数类型的算术运算产生了一个对于小数类型的格式来说太小的值，操作的结果将会变成0。如果一个小数类型的算术运算产生了一个对于小数类型的格式来说太大的值，就会触发溢出错误。小数类型较浮点类型而言，具有更大的精确度，但是数值范围相对小了很多。将浮点类型的数向小数类型的数转化时会产生溢出错误，将小数类型的数向浮点类型的数转化时会造成精确度的损失。因此，两种类型不存在隐式或显式转换。布尔型:值为true或false。没有标准能实现布尔类型和其他类型的转换。 1.2 枚举类型 枚举类型的元素使用的类型只能是long，int，short，byte。默认类型是int。默认第一个元素的值是0，每一个连续的元素按1递增。可以给元素直接赋值
```C#
enum monthnames   
{  
　January=1,  
　February,    
　march=31
};  
// 可以强制定义其他类型，如:  
enum monthnames : byte  
{　　
  January,   
　February,   
　March
};  
enum monthnames 
{
　January=1,
　February,
　march=31
};
// 可以强制定义其他类型，如:
enum monthnames : byte
{　　　　
  January,
　February,
　March
};
```

## 引用类型
类类型，字符串类型，接口类型，代表类型和数组类型

### String （引用类型）
字符串不可变性，当给一个字符串重新赋值之后，旧值并没有销毁

字符串可以看成是char类型的一个只读数组，只读(aaa[1])，想要改变字符串内容
```C#
string s = "abcdef";
s = "bbcdef"
char[] chs = s.toCharArray();
chs[0] = "b";
s = new string(chs);
```

#### String方法
- aaa.ToUpper() ToLower()
- aaa.Equals(bbb, StringComparsion.OrdinalIgnoreCase)
- Split() 分割字符串 
- Replace 
- Substring
- Contains
- StartWith EndWidth
- IndexOf LastIndexOf
- Trim TrimStart TrimEnd
- isNullOrEmpty()
- string.Join("|", new string[] { "121", "2222", "3333" }); || string.Join("|", "121", "2222", "3333")

#### Float 
- float.TryParse("0.3", out float result) // 将字符串转换为float

### ArrayList 集合
ArrayList 长度可以改变，类型不限制；取值要注意，取到的值都是Object需要利用里氏转换进行强制转换

```C#
ArrayList list = new ArrayList();
```
- list.Add() 添加单个元素
- list.AddRange() 添加多个元素 如数组
- list.Clear() 清空所有元素
- list.Remove() RemoveAt RemoveRange
- Reverse() Sort Insert InsertRange
- Contains()

### List泛型集合
```C#
List<int> list = new List<int>();
```
- Add AddRange
- list.ToArray()  List泛型集合转换为数组


### Hashtable 键值对集合
foreach 遍历键值对
```C#
Hashtable ht = new Hashtable();
ht.Add(1, "aaa");
ht.Add(2, "aaa");
foreach(var item in ht.keys) {

}
```
- ht.Add(key, value) 或 ht[key] = value
- ContainsKey ContainsValue Contains
- Clear Remove

### Dictionary
表示键和值的集合。提供一组键到一组值的映射。每次对字典的添加都包含一个值和与其关联的键
#### 特性
- 使用必须包含命名空间 System.Collection.Generic
- Dictionary里面的每一个元素都是一个键值对
- 键必须唯一
- 键和值可以使任何类型
- 读取复杂度接近O(1)
- 键值对之间的偏序可以不定义
#### 方法
- Add 
- Clear 移除所有键和值
- ContainsKey 确定 ```Dictionary<TKey, TValue>``` 是否包含指定的键
- ContainsValue 确定 ```Dictionary<TKey, TValue>``` 是否包含指定的值
- Equals(Object) 
- Finalize(Object) 
- GetEnumerator 返回循环访问```Dictionary<TKey, TValue>```的枚举器
- GetHashCode 用作特定类型的哈希函数
- GetObjectData
- GetType 获取当前实例的Type
- MemberwiseClone 创建当前Object的浅表副本
- OnDeserialization 实现System.Runtime.Serialization.ISerializable接口，并在完成反序列化之后引发反序列事件
- Remove
```C#
// Dictionary<TKey, TValue>
Dictionary<int, string> dic = new Dictionary<int, string>();
dic.Add(1, "hello1");
dic.Add(2, "hello2");
dic.Add(3, "hello3");
dic[3] = "newhello3";
foreach(KeyValuePair<int, string> kv in dic)
{
    Console.WriteLine("{0}---{1}", kv.Key, kv.Value);
}
foreach(var item in dic.Keys) {
    Console.WriteLine("{0}---{1}", item, dic[item]);
}
```
