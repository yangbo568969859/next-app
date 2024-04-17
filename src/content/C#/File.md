## File类

### Path

```C#
string str = @"C:\Users\yangbo08\Desktop\static\image.png"
```

- Path.GetFileName(str); // image.png
- Path.GetFileNameWithoutExtension(str) 获得文件名，不包含扩展名 // image
- Path.GetExtension(str); // .png
- Path.GetDirectoryName(str);
- Path.GetFullPath(str);
- Path.Combine();

### File

- File.Create(@"C:\Users\yangbo08\Desktop\static\image.png")
- File.Delete(path);
- File.Copy(path, newPath);
- File.Move() 剪切
- File.ReadAllBytes // 字节读 ReadAllLines // 行读，返回数组 ReadAllText  // 行读，返回字符串
- File.WriteAllBytes() WriteAllLines WriteAllText
- File.AppendAllLines AppendAllText AppendText

```C#
byte[] buffer = File.ReadAllBytes(path);
string s = Encoding.GetEncoding("GB2312").GetString(buffer);

string cs = "今天天气怎么样";
byte[] buffer = Encoding.Default.getBytes(cs);
File.WriteAllBytes(path, buffer);
```

### FileStream 操作字节

```C#
string path = @"C:\Users\yangbo08\Desktop\Unity制作玩偶预制体流程.docx";
FileStream fsRead = new FileStream(path, FileMode.Append, FileAccess.Read);
byte[] buffer = new byte[1024 * 1024 * 5];
int r = fsRead.Read(buffer, 0, buffer.Length); // 返回本次实际读取到的有效字节数
string s = Encoding.Default.GetString(buffer, 0, r);
fsRead.Close(); fsRead.Dispose(); // 关闭流，释放资源
```

将创建文件流对象的过程写在using中，会自动帮助我们释放流所占用的资源

```C#
string path = @"C:\Users\yangbo08\Desktop\Unity制作玩偶预制体流程.docx";
using(FileStream fsRead = new FileStream(path, FileMode.Append, FileAccess.Read)) {

}
```

### StreamReader 和 StreamWriter 操作字符

```C#
using (StreamReader stReader = new StreamReader(path, Encoding.Default))
{
    while (!stReader.EndOfStream)
    {
        Console.WriteLine(stReader.ReadLine());
    }
}
using (StreamWhiter stWhiter = new StreamWhiter(path, true))
{
    stWhiter.Write("今天天气不错")
}
```
