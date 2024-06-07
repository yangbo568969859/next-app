## Unity音频资源优化

### LoadType

1. Streaming 流（音频永久存在设备上(硬盘或闪存上) ，播放流媒体方式. 不需要RAM进行存储或播放）
动态解码声音。此方法使用==最小量的内存==来缓冲从磁盘逐渐读取并在运行中解码的压缩数据。请注意，解压缩发生在分析器窗口的音频面板的“Streaming CPU”部分中可监视其CPU使用率的单独流式线程上。注意：即使没有加载任何音频数据，流式片段也会有大约200KB的过载。
2. Decompress On Load 加载时解压缩（适用于小音频）（未压缩的音频将存储在RAM中。这个选项需要的内存最多，但是播放它不会像其他选项那样需要太多的CPU电源）
音频文件一经加载就会被解压缩。对较小的压缩声音使用此选项可避免即时解压缩的性能开销。==请注意，在加载时解压缩Vorbis编码的声音比使用它压缩大约多十倍的内存（对于ADPCM编码大约是3.5倍）==，所以不要将此选项用于大文件。
3. Compressed In Memory 压缩在内存中（音频剪辑将存储在RAM中，播放时将解压缩，播放时不需要额外的存储）
保持声音在存储器中压缩并在播放时解压缩。这个选项有一个小的性能开销（尤其是对于Ogg / Vorbis压缩文件），所以==只能用于较大的文件==，因为在加载时解压缩会使用大量的内存。解压缩在混音器线程上发生，并可在Profiler窗口的音频面板中的“DSP CPU”部分进行监视。

### Preload Audio Data 预加载音频数据
如果启用，音频剪辑将在场景加载时预先加载。默认情况下，这反映了在场景开始播放时所有音频剪辑已完成加载的标准Unity行为。如果未设置该标志，音频数据将要么被上加载的第一个的AudioSource.Play() / 的AudioSource.PlayOneShot()，或者它可以通过加载的AudioSource.LoadAudioData()，并通过再次卸载的AudioSource.UnloadAudioData()。

总结：小文件音频建议使用预加载，大文件音频建议使用将Load Type修改为 Streaming ,这样在播放完毕后会自动释放对应文件。

### 压缩格式 Compression Format

1. PCM 提供高品质但牺牲文件大小最适合使用在很短的音效上
2. ADPCM 这种格式适用于大量音效上如脚步爆破和武器，它比PCM小3.5倍但CPU使用率远低于Vorbis/MP3
3. Vorbis/MP3 比PCM小但是品质比PCM低，比ADPCM消耗更多CPU。但大多数情况下我们还是应该使用这种格式，这个选择还多了个Quality可以调节质量改变文件大小 （Quality测试1和100对内存影响并不大）

### 音道

强制音效用单声道
只有少数的手机装置真的有立体声喇叭，而将音效强制设定为单声道能让内存的消耗减半。就算游戏会输出部份的立体声，有些单声道像是 UI 音效还是可以开启这个选项

### 长音频播放消耗大量内存，如果播放时不想在内存中进行解压，有两个选择

- Load Type选“Streaming”， Compression Format 选”Vorbis"，使用最少的内存，但需要更多的CPU电量和硬盘I/O操作；

- Load Type选“Compressed In Memory”， Compression Format 选”Vorbis"，磁盘I/O操作被替换成内存的消耗，请注意，要调整“Quaility”滑块以减小压缩剪辑的大小，以交换音质，一般推荐70%左右。

- 一般是看到底音乐占据多少内存以及你的目标机型是什么样子的，如果音乐占据的内存本身比较高，你的目标机型的内存又比较小，那么就选择第二种，这种方案会卡一点，否则选择第一种就更好

### 声音特效

- 对于经常播放的和短的音频剪辑，使用“Decompress On Load”和“PCM或ADPCM"压缩格式。当选择PCM时，不需要解压缩，如果音频剪辑很短，它将很快加载。你也可以使用ADPCM。它需要解压，但解压比Vorbis快得多。
- 对于经常播放，中等大小的音频剪辑使用”Compressed In Memory“和”ADPCM“压缩格式，比原始PCM小3.5倍，解压算法的CPU消耗量不会像vorbis消耗那么多CPU。
- 对于很少播放并且长度比较短的声音剪辑，使用”Compressed In Memory", ADPCM 这种压缩格式,原因同（2）。
- 对于很少播放中等大小的音频，使用”Compressed In Memory“ 和Vorbis压缩格式。这个音频可能太长，无法使用adpcm存储，播放太少，因此解压缩所需的额外CPU电量不会太多。

[参考](https://zhuanlan.zhihu.com/p/299799873)

### 音频管理设计

- 免去在Unity Editor中手动创建播放器，并拖动音频片段到播放器上，完全由代码控制（把音频文件放在Resources文件夹中，这样就能用Resources.Load动态加载）；
- 不需要在Unity Editor中把代码文件绑定到gameObject上；
- 缓存多个AudioSource（可以使用对象池缓存），缓存常用的AudioClip（使用Dictionary缓存）；
- 当需要播放音频时，从AudioSource的缓存池中取出一个播放器audioSource，再从AudioClip缓存中取出播放片段audioClip，使用取出的播放器audioSource播放音频audioClip；
- 当播放器audioSource播放完成后，播放器audioSource回收到对象池中，等待下次被使用；
- 限制播放器无限制增加，根据游戏使用音频情况来确定播放器缓存的最大数量（遵循长时间内不频繁创建销毁播放器的原则，这样既能保证当前缓存的播放器不会占用太大内存，也能免去创建和销毁播放器带来的性能消耗）；
- 背景音乐播放器独立出来，和音效互不干扰；
- 目前只支持播放一个背景音乐，可以切换，但同一时间，只能有一个背景音乐。

[参考](https://www.ifeelgame.net/tools/%E5%9C%A8unity%E4%B8%AD%E4%BD%BF%E7%94%A8%E9%9F%B3%E9%A2%91%E7%AE%A1%E7%90%86/)
