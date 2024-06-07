# Unity Webgl事项

## Unity编译运行Webgl项目

生成文件结构

- index.html
- TemplateData
- StreamingAssets
- Build
  - UnityLoader.js                      // 加载unity内容的脚本
  - UnityBuild.json                     // PlayerSetting 中的部分设置以及其他资源的Url，给UntiyLoader用的
  - UnityBuild.wasm.framwork.unityweb   // Javascript 运行时和插件
  - UnityBuild.wasm.code.unityweb       // 编译完成的WebAssembly
  - UnityBuild.wasm.memory.unityweb     //
  - UnityBuild.wasm.data.unityweb       // 项目中的资源和场景
