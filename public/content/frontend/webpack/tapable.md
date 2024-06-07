---
title: Webpack 插件机制之 Tapable-源码解析
description: Webpack 插件机制之 Tapable-源码解析
date: 2021-05-22
---

# Webpack 插件机制之 Tapable-源码解析

webpack 本质上是一种事件流的机制，他的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable。

## Tapable

Tapable 的核心思路优点类似于 nodejs 的 events，最基本的发布/订阅模式

```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

// 注册时间对应的监听函数
myEmitter.on("start", params => {
  console.log("start", params);
});

// 触发事件
myEmitter.emit("start", "webpack tabable工作流");
```

## Tapable 钩子函数

```js
const {
  SyncHook, // 同步串行 不关心监听函数的返回值
  SyncBailHook, // 同步串行 只要监听函数中有一个函数的返回值不为undefined，则跳过剩下所有的逻辑
  SyncWaterfallHook, // 同步串行 上一个监听函数的返回值可以传给下一个监听函数
  SyncLoopHook, // 同步循环 当监听函数被触发的时候，如果该监听函数返回true时则这个监听函数会重复执行，返回undefined则表示退出循环
  AsyncParallelHook, // 异步并发 不关心监听函数的返回值
  AsyncParallelBailHook, // 异步并发
  AsyncSeriesHook, // 异步串行 不关心callback()的参数
  AsyncSeriesBailHook, // 异步串行 callback()的参数不为null，就会直接执行callAsync等触发函数绑定的回调函数
  AsyncSeriesLoopHook, // 异步串行 可以触发handler循环调用
  AsyncSeriesWaterfallHook // 异步串行 上一个监听函数的中的callback(err, data)的第二个参数,可以作为下一个监听函数的参数。
} = require("tapable");
```

### SyncHook

例子

```js
const { SyncHook } = require("tapable");
// 所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。
let queue = new SyncHook(["param1"]);

queue.tap("event 1", function(param1) {
  console.log("1", param1);
});

quene.tap("event 2", function(param1) {
  console.log("2", param1);
});

queue.tap("event 3", function() {
  console.log("3");
});

queue.call("hello");

// 1 hello
// 2 hello
// 3
```

原理

```js
class SyncHook {
  constructor() {
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push(fn);
  }

  call() {
    this.taps.forEach(tap => tap(...arguments));
  }
}
```

### SyncBailHook

只要监听函数中有一个函数的返回值不为 undefined，则跳过剩下所有的逻辑

```js
const { SyncBailHook } = require("tapable");
let queue = new SyncBailHook(["param1"]);

// 订阅
queue.tap("event 1", function(param1) {
  // tap 的第一个参数是用来标识订阅的函数的
  console.log(param1, 1);
  return 1;
});

queue.tap("event 2", function(param1) {
  console.log(param1, 2);
});

queue.tap("event 3", function() {
  console.log(3);
});

// 发布
queue.call("hello", "world"); // 发布的时候触发订阅的函数 同时传入参数

// 控制台输出
/* hello 1 */
```

实现

```js
class SyncBailHook {
  constructor() {
    this.taps = [];
  }

  tap(name, fn) {
    this.taps.push(fn);
  }

  call() {
    for (let i = 0; i < this.taps.length; i++) {
      let tap = this.taps[i];
      let result = tap(...arguments);
      if (result) {
        break;
      }
    }
  }
}
```

### 源码实现

```js
// node_modules/tapable/lib/SyncHook.js
const factory = new SyncHookCodeFactory();
// 继承基础Hook类
class SyncHook extends Hook {
  // 重写Hook的compile方法
  compile(options) {
    // 开发者订阅的事件传
    factory.setup(this, options);
    // 动态生成call方法
    return factory.create(options);
  }
}

module.exports = SyncHook;
```

```js
// node_modules/tapable/lib/Hook.js
class Hook {
  constructor() {
    this.taps = [];
    this.call = this._call;
  }

  compile(options) {
    // 继承类必须重写compile
    throw new Error("Hooks must implement compile()");
  }

  _createCall(type) {
    return this.compile({
      taps: this.taps
      // ...等参数
    });
  }

  tap(options, fn) {
    // 同步 整理配置项
    options = Object.assign({ type: "sync", fn: fn }, options);
    // 将订阅的事件存储在taps里面
    this._insert(options);
  }

  _insert(item) {
    // 将item 推进 this.taps
    this.taps[i] = item;
  }
}

function createCompileDelegate(name, type) {
  return function lazyCompileHook(...args) {
    // 创造call等函数
    this[name] = this._createCall(type);
    // 执行触发call函数
    return this[name](...args);
  };
}

Object.definePropertys(Hook.prototype, {
  _call: {
    value: createCompileDelegate("call", "sync"),
    configurable: true,
    writable: true
  }
});
// call方法究竟是什么，是通过重写的compile方法生成出来的
```

看下 SyncHook 的全部代码

```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  // call 方法个性化定制
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapSeries({
      onError: (i, error) => onError(error),
      onDone,
      rethrowIfPossible
    });
  }
}

const factory = new SyncHookCodeFactory();

class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = SyncHook;
// compile主要是执行factory的方法，而factory是SyncHookCodeFactory的实例，继承了HookCodeFactory类，然后factory实例调用了setup方法
```

setup 就是将 taps 中订阅的事件方法统一给了 this.\_x;

```js
// node_modules/tapable/lib/HookCodeFactory.js
setup(instance, options) {
  instance._x = options.taps.map(t => t.fn)
}
```

再看下 factory 实例调用的 create 方法

```js
create (options) {
  this.init(options);
  let fn;
  switch (this.options.type) {
    case 'sync':
      fn = new Function(
        this.args(),
        '"use strict"; \n' +
        this.header() +
        this.content({
          onError: err => `throw ${err};\n`,
          onResult: result => `return ${result};\n`,
          resultReturns: true,
          onDone: () => "",
          rethrowIfPossible: true
        })
      )
      break;
  }
}
// create会将传进来的所有事件，进行组装。最终生成call方法。 如下就是我们这次的案例最终生成的call方法
```

### Tapable 在 Webpack 中的应用

执行 webpack 时，会生成一个 compiler 实例

```js
const Compiler = require("./Compiler");
const MultiCompiler = require("./MultiCompiler");

const webpack = (options, callback) => {
  let compiler;
  if (typeof options === "object") {
    compiler = new Compiler(options.context);
  } else {
    throw new Error("Invalid argument: options");
  }
};
```

Compiler 是继承了 Tapable 的。同时发现 webpack 的生命周期 hooks 都是各种各样的钩子

```js
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      /** @type {AsyncSeriesHook<Stats>} */
      done: new AsyncSeriesHook(["stats"]),
      /** @type {AsyncSeriesHook<>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<Compiler>} */
      beforeRun: new AsyncSeriesHook(["compiler"]),
      /** @type {AsyncSeriesHook<Compiler>} */
      run: new AsyncSeriesHook(["compiler"]),
      /** @type {AsyncSeriesHook<Compilation>} */
      emit: new AsyncSeriesHook(["compilation"]),
      /** @type {AsyncSeriesHook<string, Buffer>} */
      assetEmitted: new AsyncSeriesHook(["file", "content"]),
      /** @type {AsyncSeriesHook<Compilation>} */
      afterEmit: new AsyncSeriesHook(["compilation"])

      // ....等等等很多
    };
  }
}
```

然后在初始化 webpack 的配置过程中，会循环我们配置的以及 webpack 默认的所有插件也就是 plugin

```js
if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    if (typeof plugin === "function") {
      plugin.call(compiler, compiler);
    } else {
      plugin.apply(compiler);
    }
  }
}
// 这个过程，会把plugin中所有tap事件收集到每个生命周期的hook中。 最后根据每个hook执行call方法的顺序（也就是生命周期）。就可以把所有plugin执行了
```
