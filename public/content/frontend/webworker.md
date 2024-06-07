---
title: web worker技术
description: javascript的 webWorker 技术
date: 2021-05-10
---

# web worker

Web Worker 一种可以运行在web应用程序后台线程，独立于主线程之外的技术；用于执行耗时的任务，而不会阻塞主线程的执行；通过将计算密集型或长时间运行的任务放入 Web Worker 中，可以避免主线程的阻塞，提高页面的响应性和用户体验

## 使用场景

- Worker API局限性：同源限制、无DOM对象、异步通信。因此适合不涉及 DOM 操作的任务
- Worker 的使用成本：创建时间 + 数据传输时间；考虑到可以预创建，可以忽略创建时间，只考虑数据传输成本
- 任务特点：需要是可并行的多任务，为了充分利用多核能力，可并行的任务数越接近 CPU 数量，收益会越高

## 使用限制

- 在 Worker 线程的运行环境中没有 window 全局对象，也无法访问 DOM 对象
- Worker中只能获取到部分浏览器提供的 API，如定时器、navigator、location、XMLHttpRequest等
- 每个线程运行在完全独立的环境中，需要通过postMessage、 message事件机制来实现的线程之间的通信

## 实践

### 创建 Web Worker

```js
const worker = new Worker(path, options);
```

- path： 有效的js脚本的地址，必须遵守同源策略。无效的js地址或者违反同源策略，会抛出SECURITY_ERR 类型错误
- options.type 可选，用以指定 worker 类型。该值可以是 classic 或 module。 如未指定，将使用默认值 classic
- options.credentials 可选，用以指定 worker 凭证。该值可以是 omit, same-origin，或 include。如果未指定，或者 type 是 classic，将使用默认值 omit (不要求凭证)
- options.name 可选，在 DedicatedWorkerGlobalScope 的情况下，用来表示 worker 的 scope 的一个 DOMString 值，主要用于调试目的。

### 数据传输

主线程和worker线程之间通过 postMessage 方法进行通信，以及监听message事件来接收消息

```js
// main.js 主线程代码
const myWorker = new Worker('./worker.js'); // 创建worker

myWorker.addEventListener('message', (e) => {
  console.log(e.data);
})
// 这种写法也可以
// myWorker.onmessage = e => { // 接收消息
//    console.log(e.data);
// };

myWorker.postMessage('hello worker'); // 向 worker 线程发送消息
```

```js
// worker.js
self.onmessage = e => {
  const data = e.data;
  self.postMessage('Greeting from Worker.js'); // 向主线程发送消息
}
```

主线程与worker线程之间的数据传递是传值而不是传址，及时传递的是同一个Object，并且被直接传递回来，接收到的也不是原来的那个值

### 监听错误信息

webWorker 提供了两个事件监听错误，error 和 messageerror

- error 当worker内部出现错误时触发
- messageerror 当message事件接收到无法被反序列化的参数时触发

```js
// main.js（主线程）
const myWorker = new Worker('/worker.js'); // 创建worker

myWorker.addEventListener('error', err => {
  console.log(err.message);
});
myWorker.addEventListener('messageerror', err => {
  console.log(err.message)
});
```

```js
// worker.js（worker线程）
self.addEventListener('error', err => {
  console.log(err.message);
});
self.addEventListener('messageerror', err => {
  console.log(err.message);
});
```

### 关闭worker线程

worker 线程的关闭在主线程和 worker 线程都能进行操作，但对 worker 线程的影响略有不同

```js
// main.js 主线程
const myWorker = new Worker('/worker.js'); // 创建worker
myWorker.terminate();
```

```js
// worker.js（worker线程）
self.close();
```

无论是在主线程关闭worker，还是在worker线程内部关闭worker，worker线程当前的EventLoop中的任务会继续执行。至于worker 线程下一个 Event Loop 中的任务，则会被直接忽略，不会继续执行

区别在于：主线程手动关闭worker，主线程与worker线程之间的连接会被立刻停止，即使worker线程当前的Event Loop 中仍有待执行的任务继续调用 postMessage() 方法，但主线程不会再接收到消息

在 worker 线程内部关闭 worker，不会直接断开与主线程的连接，而是等 worker 线程当前的 Event Loop 所有任务执行完，再关闭。也就是说，在当前 Event Loop 中继续调用 postMessage() 方法，主线程还是能通过监听message事件收到消息的

### Worker 线程引用其他js文件

在 worker 线程中利用 importScripts() 方法加载我们需要的js文件，而且，通过此方法加载的js文件不受同源策略约束！

```js
// utils.js
const add = (a, b) => a + b;


// worker.js（worker线程）
// 使用方法：importScripts(path1, path2, ...); 

importScripts('./utils.js');

console.log(add(1, 2)); // log 3
```

ESModule 模式

```js
// main.js（主线程）
const worker = new Worker('/worker.js', {
  type: 'module'  // 指定 worker.js 的类型
});

// utils.js
export default add = (a, b) => a + b;

// worker.js（worker线程）
import add from './utils.js'; // 导入外部js
self.addEventListener('message', e => { 
    postMessage(e.data);
});
add(1, 2); // log 3
export default self; // 只需把顶级对象self暴露出去即可
```

### 传递的数据类型

postMessage() 传递的数据可以是由结构化克隆算法处理的任何值或 JavaScript 对象，包括循环引用

结构化克隆算法不能处理的数据

- Error以及Function对象
- DOM节点
- 对象的某些特定参数不会被保留
  - RegExp 对象的 lastIndex 字段不会被保留
  - 属性描述符，setters以及getters同样不会被复制
  - 原型链上的属性也不会被追踪和复制

可以传递的数据

- 原始类型 (symbol除外)
- 可序列化对象(Object, Array)
- 特殊类型(ArrayBuffer, Blob, ImageData)

如果需要传递函数：可以将函数名或标识符作为消息传递，然后在 Web Worker 中根据接收到的标识符来调用相应的函数

```js
// 主线程代码
worker.postMessage({ type: 'executeFunction', functionName: 'processData' });

// Web Worker 代码（worker.js）
self.onmessage = function(event) {
  const { type, functionName } = event.data;
  if (type === 'executeFunction') {
    if (typeof self[functionName] === 'function') {
      self[functionName]();
    }
  }
};

function processData() {
  // 在 Web Worker 中执行的函数
  console.log('Processing data in Web Worker');
}
```

传递大型数据：对于大型数据集或二进制数据，可以使用 ArrayBuffer 或 Blob 来传递数据，以提高传输效率。

```js
// 例如，可以将大型数组转换为 ArrayBuffer，然后在 Web Worker 中使用 TypedArray 视图来操作数据

// 主线程代码
const largeArray = new Float64Array(1000000);
// 填充大型数组的数据
// ...

const arrayBuffer = largeArray.buffer;
worker.postMessage(arrayBuffer, [arrayBuffer]);

// Web Worker 代码（worker.js）
self.onmessage = function(event) {
  const arrayBuffer = event.data;
  const largeArray = new Float64Array(arrayBuffer);
  console.log('Received large array:', largeArray);
};
```

### SharedWorker

SharedWorker 是一种特殊类型的 Worker，可以被多个浏览上下文访问，比如多个 windows，iframes 和 workers，但这些浏览上下文必须同源。它们实现于一个不同于普通 worker 的接口，具有不同的全局作用域：SharedWorkerGlobalScope ，但是继承自WorkerGlobalScope

#### 创建SharedWorker

```js
const worker = new SharedWorker('shared-worker.js');
```

#### 端口通信

与 SharedWorker 通信需要使用端口（MessagePort）对象。 在主线程中，通过 worker.port 属性获取与 SharedWorker 关联的端口对象

```js
// main.js（主线程）
const myWorker = new SharedWorker('./sharedWorker.js');

myWorker.port.start(); // 开启端口

myWorker.port.addEventListener('message', msg => {
  console.log(msg.data);
})

// 如果采用 onmessage 方法，则默认开启端口，不需要再手动调用SharedWorker.port.start()方法
// main.js（主线程）
const myWorker = new SharedWorker('./sharedWorker.js');

myWorker.port.onmessage = msg => {
  console.log(msg.data);
};

```

#### 处理连接

在 SharedWorker 中，通过监听 onconnect 事件来处理来自不同客户端的连接请求。
每个连接请求都会触发 onconnect 事件，事件对象的 ports 属性是一个包含连接端口的数组。
通过 ports[0].postMessage() 方法向连接的客户端发送消息，通过 ports[0].onmessage 事件监听来自客户端的消息

```js
// SharedWorker 代码（shared-worker.js）
self.onconnect = function(event) {
  const port = event.ports[0];
  port.postMessage('Connected to SharedWorker!');
  port.onmessage = function(event) {
    console.log('Received message from client:', event.data);
    // 处理来自客户端的消息
  };
};
```

```js
// 以下是一个简单的示例，演示了如何使用 SharedWorker 在多个页面之间共享状态
// 主页面 1
const worker = new SharedWorker('shared-worker.js');
const port1 = worker.port;
port1.start();

port1.postMessage('Hello from Page 1');
port1.onmessage = function(event) {
  console.log('Page 1 received message:', event.data);
};

// 主页面 2
const worker = new SharedWorker('shared-worker.js');
const port2 = worker.port;
port2.start();

port2.postMessage('Hello from Page 2');
port2.onmessage = function(event) {
  console.log('Page 2 received message:', event.data);
};

// SharedWorker 代码（shared-worker.js）
let count = 0;

self.onconnect = function(event) {
  const port = event.ports[0];
  port.start();

  port.postMessage(`Connected to SharedWorker! Current count: ${count}`);

  port.onmessage = function(event) {
    console.log('SharedWorker received message:', event.data);
    count++;
    port.postMessage(`Updated count: ${count}`);
  };
};
```

## 第三方封装库

- promise-worker
- comlink
- Workly
- threads [使用示例](https://github.com/Snapmaker/Luban/blob/main/src/app/lib/manager/Pool.worker.js)
- workerpool

### workerpool 介绍

Workerpool 是一个用于简化 Web Worker 使用的 JavaScript 库。它提供了一种方便的方式来创建和管理 Worker 线程池，使得在浏览器中执行并行任务变得更加容易

```js
// index.js
import workerpool from 'workerpool'
const pool = workerpool.pool('./worker.js', { maxWorkers: 4 })
// 执行work内定义好的函数
pool.exec('task1', [arg1, arg2]).then(result => {
  console.log('Task 1 result:', result);
})
// 执行一个自定义函数
pool.exec((x, y) => { return x + y }, [1, 2]).then(result => {
  console.log(res);
})

// worker.js
importScripts("constant.js");
function a() {
  console.log("test");
}
```

#### 新增依赖管理

抽取依赖，管理编译和更新

新增一个依赖管理文件worker-depts.js，可按照路径作为 key 名构建一个聚合依赖对象，然后在 worker 文件内引入这份依赖

```js
// worker-depts.js
import * as _ from "lodash-es";
import * as math from "../math";

const workerDepts = {
  _,
  "util/math": math,
};

export default workerDepts;
```

```js
// worker.js
import workerDepts from "../util/worker/worker-depts";
```

定义公共调用函数，引入所打包的依赖并串联流程：

```js
// worker 内定义一个公共调用函数，注入 worker-depts 依赖，并注册在 workerpool 的方法内
// worker.js
import workerDepts from "../util/worker/worker-depts";

function runWithDepts(fn: any, ...args: any) {
  var f = new Function("return (" + fn + ").apply(null, arguments);");
  return f.apply(f, [workerDepts].concat(args));
}

workerpool.worker({
  runWithDepts,
});
```

```js
// 主线程文件内定义相应的调用方法，入参是自定义函数体和该函数的参数列表
// index.js
import workerpool from "workerpool";
export async function workerDraw(fn, ...args) {
  const pool = workerpool.pool("./worker.js");
  return pool.exec("runWithDepts", [String(fn)].concat(args));
}
// 完成以上步骤，就可以在项目任意需要调用 worker 的位置，像下面这样，自定义函数内容，引用所需依赖（已注入在函数第一个参数），进行使用了
```

```js
// 这里我们引用了一个项目内的公共函数 fibonacci，也引用了一个 lodash 的 map 方法，都可以在depts 对象上取到
// 项目内需使用worker时
const res = await workerDraw(
  (depts, m, n) => {
    const { map } = depts["_"];
    const { fibonacci } = depts["util/math"];
    return map([m, n], (num) => fibonacci(num));
  },
  input1,
  input2
);

```

优化语法支持

```js
// 没有语法支持的依赖管理是很难用的，通过对 workerDraw 进行 ts 语法包装，可以实现在使用时的依赖提示：
import workerpool from "workerpool";
import type TDepts from "./worker-depts";

export async function workerDraw<T extends any[], R>(
  fn: (depts: typeof TDepts, ...args: T) => Promise<R> | R,
  ...args: T
) {
  const pool = workerpool.pool("./worker.js");
  return pool.exec("runWithDepts", [String(fn)].concat(args));
}
```

其他问题

新增了 worker 以后，出现了 window和 worker 两种运行环境，如果你恰好和我一样需要兼容 node 端运行，那么运行环境就是三种，原本我们通常判断 window 环境使用的也许是 typeof window === 'object'这样，现在不够用了，这里可以改为 globalThis 对象，它是三套环境内都存在的一个对象，通过判断globalThis.constructor.name的值，值分别是'Window' / 'DedicatedWorker'/ 'Object'，从而实现环境的区分

[示例](https://github.com/Silencesnow/worker-demo-2022)
