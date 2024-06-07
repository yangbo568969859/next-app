## Process

### 通过进程打开指定应用程序
```C#
string path = @"D:\software\unitypack\2019.4.38f1c1\Editor\Unity.exe";
ProcessStartInfo psi = new ProcessStartInfo(path);
Process p = new Process();
p.StartInfo = psi;
p.Start();
```

## Thread
- Start()
- Name

### 线程中如何访问控件
```C#
private void buttonClick() {
  Thread th = new Thread(Test);
  th.IsBackground = true;
  th.Start("123");
}

private void Test(object s) {
  for (int i = 0; i < 10000; i++) {
    Console.WriteLine(i);
  }
}
```
