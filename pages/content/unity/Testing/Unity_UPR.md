# Unity UPR 使用

## 介绍

Unity UPR是Unity官方提供的专业在线性能优化工具，帮助开发者诊断和优化游戏项目开发过程中存在的性能问题
[UPR地址](https://upr.unity.cn/)
[论坛](https://learn.unity.com/g/uprzhuan-qu?tab=discussion)

## 步骤

桌面版下载[download](https://upr.unity.cn/download)
官网登录账号
进入我的项目
创建项目
新建测试
复制session id 粘贴到URP客户端，并按回车
构建项目（需要勾选Development Build 和 Autoconnect Profiler）
运行项目（同一网络环境）

### Asset Checker资源检测

[Asset Checker](https://upr.unity.cn/instructions/assetchecker)

## 报告参数

### Total Reserved/Used 总内存占用

1.Reserved是Unity向系统申请的总内存，但是并不包含第三方库的自身分配内存和系统缓存；Used是当前正在使用的总内存。
2.Unity引擎为避免频繁向操作系统申请开辟内存，因此开启较大一块内存作为缓存，即Total Reserved。
3.所以在运行时，Unity引擎首先是向Reserved中来申请内存，当不使用时也是先向Reserved中释放内存，从而来保证游戏运行的流畅性。
4.当Reserved中空内存不够用时，Unity引擎才会再次向操作系统申请开辟内存。
5.从图表中可以看到，Reserved Total和Used Total折线走势基本类似，Reserved值略大于Used值。
6.在性能调优时，可以尽可能地控制Used Total的大小。
7.Used Total越大，则Reserved Total越大，而当Used Total降下去后，Reserved Total也是会随之下降。

### Mono Reserved/Used     脚本内存，只升不降

1.Mono内存表示游戏中脚本分配的内存，其中游戏逻辑由开发人员编写，因此容易出现内存问题。
2.“托管堆内存”代表Mono“应该”自动地改变堆的大小来适应程序所需要的内存，并且定时地使用垃圾回收（Garbage Collect）来释放已经不需要的内存。
3.往往开发人员会忘记清除对不再需要使用的内存的引用，从而导致Mono认为这块内存一直有用，无法回收，从而造成内存泄漏。
4.Mono内存泄漏会使空闲内存减少，GC频繁，mono堆不断扩充，最终导致游戏内存占用的升高。
5.由于Mono自身的限制，其堆内存分配是 “只升不降” 的，即：Mono的堆内存一旦分配，就不会返还给系统。
6.最终导致内存过高，进程被操作系统Kill或者崩溃。

### GFX Reserved/Used

1.GfxDriver可以理解为GPU显存开销，主要由Texture，Vertex buffer以及index buffer组成。
2.所以尽可能地减少或释放Texture和mesh等资源，即可降低GfxDriver内存。

### FMod Reserved/Used

1.项目运行时用于音效的资源所占用的内存。
2.Unity内置的Audio内部使用的是FMod。
3.FMod内存较高的话，可以对AudioSource和AudioClip等资源进行优化。

### Profiler Reserved/Used

项目运行时Unity Profiler分配的内存，不会带到上线的版本，在确认内存占用时，需要去除这部分的内存。
