# flutter

VS code 快捷创建flutter  
Ctrl + Shift + P
输入 Flutter: New Project

f5快速开始运行

在编译别人的项目之前，请先修改一下两个变量以匹配你的环境

一个是位于android\build.gradle中的 com.android.tools.build:gradle

另一个是位于android\gradle\wrapper\gradle-wrapper.properties中的 distributionUrl

打包flutter apk 运行 flutter build apk
flutter build apk --target-platform android-arm64
flutter build apk --target-platform android-arm64 -t lib/main_prod.dart
安装apk 打包完成之后运行 flutter install

创建插件模板
flutter create —org com.example —template=plugin hello

分析渲染问题
flutter run --profile

性能图层提供的两项参数
检查多视图叠加的视图渲染开关checkerboardOffscreenLayers，
和检查缓存的图像开关checkerboardRasterCacheImages，来检查这两种情况
