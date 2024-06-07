---
title: webapck 热更新原理
description: 热更新原理
date: 2021-05-10
---

# webapck 热更新原理

Hot Module Replacement(HMR)，无需完全刷新整个页面的同时，更新模块

- 启动webpack，生成compiler对象。compiler上有很多方法，比如可以启动webpack所有编译工作，以及监听本地文件变化
- 使用express框架启动本地server，让浏览器可以请求本地的静态资源
- 本地server启动之后，再去启动websocket服务，通过websocket，可以建立本地服务和浏览器的双向通信。相当于本地文件发生变动，可以立马通知浏览器热更新代码

## 实现原理

### webpack-dev-server启动本地服务

根据webpack-dev-server的package.json中的bin命令，找到命令的入口文件 bin/webpack-dev-server.js

```js
// node_modules/webpack-dev-server/bin/webpack-dev-server.js

// 生成webpack编译对象compiler
let compiler = webpack(config);

// 启动本地服务
let server = new Server(compiler, options, log);
server.listen(options.port, options.host, (err) => {
  if (err) {
    throw err;
  }
})
```

```js
// node_modules/webpack-dev-server/lib/Server.js
// 本地服务代码
class Server {
  constructor(compiler, options, log) {
    this.setupApp();
    this.createServer();
  }

  setupApp() {
    // 依赖express
    this.app = express();
  }

  createServer() {
    this.listeningApp = http.createServer(this.app);
  }

  listen(port, host, callback) {
    return this.listeningApp.listen(port, hostname, (err) => {
      // 启动express服务后，启动websocket服务
      this.createSocketServer();
    })
  }
}
```

- 启动webpack，生成compiler实例，compiler上有很多方法，比如启动webpack所有编译工作，以及监听本地文件变动
- 使用express框架启动本地server，让浏览器可以请求本地的静态资源
- 本地server启动之后，再去启动websocket服务。通过websocket，可以建立本地服务和浏览器的双向通信，这样：本地文件发生变化就可以告知浏览器进行热更新代码了

### 修改webpack.config.js的entry配置

启动本地服务前，调用updateCompiler(this.compiler)方法，获取webpack客户端代码路径，根据配置获取webpack热更新代码路径

```js
// 获取websocket客户端代码
const clientEntry = `${require.resolve('../../client/')}?${domain}${sockHost}${sockPath}${sockPort}`
// 根据配置获取webpack热更新代码路径
let hotEntry
if (options.hotOnly) {
  hotEntry = require.resolve('webpack/hot/only-dev-server');
} else {
  hotEntry = require.resolve('webpack/hot/dev-server');
}
```

修改后的webpack入口配置如下

```js
{
  entry: {
    index: [
      // 上面获取的clientEntry
      'xxx/node_modules/webpack-dev-server/client/index.js?http://localhost:8080',
      // 上面获取的hotEntry
      'xxx/node_modules/webpack/hot/dev-server.js',
      // 开发配置的入口
      './src/index.js'
    ]
  }
}
```

- webpack-dev-server/client/index.js
  - 这个文件用于websocket的，用于浏览器和服务端通信
- webpack/hot/dev-server.js
  - 这个文件主要用于检查更新逻辑的

### 监听webpack编译结束

修改好入口配置后，又调用了setupHooks方法。这个方法是用来注册监听事件的，监听每次webpack编译完成

```js
// node_modules/webpack-dev-server/lib/Server.js
// 绑定监听事件
setupHooks() {
  const { done } = compiler.hooks;
  // 监听webpack的done钩子，tapable提供的监听方法
  done.tap('webpack-dev-server', (stats) => {
    this._sendStats(this.sockets, this.getStats(stats));
    this._stats = stats;
  })
}
```

当监听到一次webpack编译结束，就会调用_sendStats方法通过websocket给浏览器发送通知，ok和hash事件，这样浏览器就可以拿到最新的hash值了，做检查更新逻辑

```js
// 通过websoket给客户端发消息
_sendStats(sockets, stats) {
  this.sockWrite(sockets, 'hash', stats.hash);
  this.sockWrite(sockets, 'ok', true);
}
```

### webpack监听文件变化

每次修改代码，就会触发编译。主要通过setupDevMiddleware方法实现

这个方法主要执行了webpack-dev-middleware库。他与webpack-dev-server的区别是 后者只负责启动服务和前置准备工作。文件相关的操作都抽离到了webpack-dev-middleware库中，主要是本地文件的编译、输出和监听

```js
// webpack-dev-middleware源码
// node_modules/webpack-dev-middleware/index.js
compiler.watch(options.watchOptions, (err) => {
  if (err) {
    // 错误处理
  }
})
// 通过“memory-fs”库将打包后的文件写入内存
setFs(context, compiler)
```

- 调用compiler.watch方法
  - 首先对本地文件代码进行编译打包，也就是webpack的一系列编译流程
  - 编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成后继续监听
- 执行setFs方法
  - 目的：将编译后的文件打包到内存（这就是为什么开发过程中，dist目录没有打包后的代码）
  - 原因在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销，这一切都归功于memory-fs

### 浏览器接收到热更新的通知

我们已经可以监听到文件的变化了，当文件发生变化，就触发重新编译。同时还监听了每次编译结束的事件。当监听到一次webpack编译结束，_sendStats方法就通过websoket给浏览器发送通知，检查下是否需要热更新。下面重点讲的就是_sendStats方法中的ok和hash事件都做了什么

```js
// webpack-dev-server/client/index.js
var socket = require('./socket');
var onSocketMessage = {
  hash: function hash(_hash) {
    // 更新currentHash值
    status.currentHash = _hash;
  },
  ok: function ok() {
    sendMessage('ok');
    // 进行更新检查等操作
    reloadApp(options, status);
  }
}
// 连接服务地址socketUrl，?http://localhost:8080，本地服务地址
socket(socketUrl, onSocketMessage);

function reloadApp() {
  if (hot) {
    log.info('[WDS] App hot update...');
        
    // hotEmitter其实就是EventEmitter的实例
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
  }
}
```

socket方法建立了websocket和服务端的连接，并注册了 2 个监听事件

- hash事件：更新最新一次打包后的hash值
- ok事件：进行热更新检查

热更新检查事件是调用reloadApp方法。这个方法又利用node.js的EventEmitter，发出webpackHotUpdate消息

```js
// node_modules/webpack/hot/dev-server.js
var check = function check() {
  // module.hot.check 是 HotModuleReplacementPlugin 中的方法
  module.hot.check(true).then(function (updatedModules) {
    // 容错，直接刷新页面
    if (!updatedModules) {
      window.location.reload();
      return;
    }
    // 热更新结束，打印信息
    if (upToDate()) {
      log("info", "[HMR] App is up to date.");
    }
  }).cache(function(err) {
    window.location.reload();
  })
}
var hotEmitter = require("./emitter");
hotEmitter.on("webpackHotUpdate", function(currentHash) {
  lastHash = currentHash;
  check();
});
```

### HotModuleReplacementPlugin

### moudle.hot.check 开始热更新

由HotModuleReplacementPlugin包将moudle.hot.check塞入到bundle.js中

- 利用上一次保存的hash值，调用hotDownloadManifest发送xxx/hash.hot-update.json的ajax请求
- 请求结果获取热更新模块，以及下次热更新的Hash标识，并进入热更新准备阶段

```js
hotAvailableFilesMap = update.c; // 需要更新的文件
hotUpdateNewHash = update.h; // 更新下次热更新hash值
hotSetStatus("prepare"); // 进入热更新准备状态
```

- 调用hotDownloadUpdateChunk发送xxx/hash.hot-update.js 请求，通过JSONP方式。(因为JSONP获取的代码可以直接执行)

```js
function hotDownloadUpdateChunk(chunkId) {
  var script = document.createElement("script");
  script.charset = "utf-8";
  script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
  if (null) script.crossOrigin = null;
  document.head.appendChild(script);
}
```

- 新编译后的代码是在一个webpackHotUpdate函数体内部的。也就是要立即执行webpackHotUpdate这个方法

```js
window["webpackHotUpdate"] = function (chunkId, moreModules) {
    hotAddUpdateChunk(chunkId, moreModules);
};
```

- hotAddUpdateChunk方法会把更新的模块moreModules赋值给全局全量hotUpdate

```js
function hotAddUpdateChunk(chunkId, moreModules) {
  // 更新的模块moreModules赋值给全局全量hotUpdate
  for (var moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      hotUpdate[moduleId] = moreModules[moduleId];
    }
  }
  // 调用hotApply进行模块的替换
  hotUpdateDownloaded();
}
```

- hotUpdateDownloaded方法会调用hotApply进行代码的替换

### hotApply 热更新模块替换

热更新的核心逻辑就在hotApply方法了

- 删除过期的模块，就是需要替换的模块

```js
var queue = outdatedModules.slice();
while (queue.length > 0) {
  moduleId = queue.pop();
  // 从缓存中删除过期的模块
  module = installedModules[moduleId];
  // 删除过期的依赖
  delete outdatedDependencies[moduleId];
  
  // 存储了被删掉的模块id，便于更新代码
  outdatedSelfAcceptedModules.push({
    module: moduleId
  });
}
```

- 将新的模块添加到modules中

```js
appliedUpdate[moduleId] = hotUpdate[moduleId];
for (moduleId in appliedUpdate) {
  if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
    modules[moduleId] = appliedUpdate[moduleId];
  }
}
```

- 通过__webpack_require__执行相关模块的代码

```js
for (let i = 0; i < outdatedSelfAcceptedModules.length; i++) {
  var item = outdatedSelfAcceptedModules[i];
  moduleId = item.module;

  try {
    // 执行最新的代码
    __webpack_require__(moduleId);
  } catch (e) {
    // 容错处理
  }
}
```
