### 阻止锁屏 

UnityEngine.SleepTimeout

```C#
Screen.sleepTimeout = SleepTimeout.NeverSleep; // 永远不锁屏
Screen.sleepTimeout = SleepTimeout.SystemSetting; // 锁屏根据系统设置的睡眠时间
```

### 设置游戏品质

UnityEngine.QualitySettings.SetQualityLevel(int index)

游戏品质可以在 Edit/Project Settings/Quality 下找到并自定义新的品质参数

### 路径相关

- Application.persistentDataPath // 持久化数据存放目录
- Application.dataPath  // app程序包安装路径 应用程序数据目录
- Application.temporaryCachePath // 网络资源下载存放目录
- Application.streamingAssetsPath // 流数据缓存目录
