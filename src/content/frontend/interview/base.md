# 基础

## 防抖和节流

- 防抖：在事件触发n秒后执行函数，如果在n秒内再次触发事件，则重新计时
- 节流：如果在定时器的时间范围内再次触发，不予执行，等到当前定时器完成，才能开启下一个定时器任务

```js
// throttle
function thorttle(fn, delay) {
  let flag = true;

  return function (...args) {
    let context = this;
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(context, args);
      flag = true;
    }, delay);
  }
}
function thorttle1(fn, delay) {
  let last = 0;

  return function (...args) {
    let context = this;
    let now = new Date().getTime();
    if (now - last > delay) {
      return;
    }
    last = now;
    fn.apply(context, args);
  }
}
// debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay)
  }
}
```

## 重绘、重排、合成

重绘：样式计算-绘制
重排：生成DOM树-样式计算-生成布局树-构建图层-绘制

- 重绘：当页面上的元素样式改变并不影响它在文档流中的位置时(color,backgroundColor,visibility等)，浏览器会将新样式赋予给元素并重新绘制它
  - 调整窗口大小
  - 改变字体或字体大小
- 重排：对页面元素结构的修改引发了DOM几何尺寸的变化
  - 一个元素的几何属性发生变化(width、height、padding、margin、left、top、border等)
  - 使DOM节点发生增减或移动
  - 读写offset、scroll、client等属性
  - 调用window.getComputedStyle方法
- 合成：更改了一个既不需要布局也不需要绘制的属性，渲染引擎会跳过布局和绘制，直接执行后续的合成操作

### 如何避免

- 使用 translate 替代 top
- 使用 visibility 替换 display: none
- 避免使用 table 布局
- 优化CSS选择器：CSS 选择符从右往左匹配查找，避免使用深层次的或复杂的CSS选择器
- 集中更改样式
- 避免频繁访问布局属性 (offset, scroll, client)
- 使用 DocumentFragment 或 display: none; 对元素进行批量修改，修改完后将他们一次性添加回DOM
- 提升为合成层
  - 合成层的位图，会交由 GPU 合成，比 CPU 处理要快
  - 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层
  - 对于 transform 和 opacity 效果，不会触发 layout 和 paint

### GPU加速的原因

利用CSS3的 transform，opacity，filter等属性就可以实现合成效果，也就是GPU加速

- 在合成的情况下，直接跳过布局和绘制阶段，进入非主线程处理部分，即直接交给合成线程处理
- 充分发挥GPU优势，合成线程生成位图的过程中会调用线程池，并在其中使用GPU进行加速生成，GPU是非常擅长处理位图数据的
- 没有占用主线程资源

## 事件循环机制 （event loop）

### js 事件循环

- JS分为同步任务和异步任务
- 同步任务都是在主线程上执行，形成一个执行栈(execution context stack)
- 主线程之外，事件触发线程管理着一个任务队列(task queue)，只要异步任务有了运行结果，就在任务队列之中放置一个事件
- 一旦执行栈中的所有同步任务执行完毕(此时JS引擎空闲)，系统就会读取任务队列，将可以运行的异步任务队列添加到可执行栈中，开始执行
- 主线程不断重复上面的第三步

首先我们需要知道：js 是单线程的语言，EventLoop 是 js 的执行机制

异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。宏任务队列可以有多个，微任务队列只有一个

- 宏任务 (包含整体代码 script，setTimeout，setInterval，setImmediate，MessageChannel， I/O 操作、UI 渲染)
- 微任务 (Promise，process.nextTick、Object.observe、MutationObserver)

当某个宏任务执行完后，会查看是否有微任务队列，如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前面的任务，执行宏任务的过程中没要到微任务，一次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推

![image](./images/node_eventlop.png)

### node 事件循环

外部输入数据 -> 轮循阶段(poll) -> 检查阶段(check) -> 关闭阶段(close callbacks) -> 定时器检查阶段(timer) -> I/O 阶段(I/O callbacks) -> 闲置阶段(idle, prepare) -> 轮询阶段(poll)

- timer 阶段： 执行到期的 setTimeout/setInterval 队列回调
- I/O 阶段：执行上轮循环循环中的少数未执行的 I/O 回调
- idle，prepare (仅 node 内部使用)
- poll
  - 执行回调
  - 执行定时器
    - 如有到期的 setTimeout/setInterval，则返回 timer 阶段
    - 如有 setImmediate，则前往 check 阶段
- check 阶段 执行 setImmediate
- close callbacks

process.nextTick 独立于 EventLoop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其它 microtask 执行

![image](./images/node_eventlop.png)

## 跨域

前端领域中，跨域是指浏览器允许向服务器发送跨域请求，从而克服 Ajax 只能同源使用的限制

同源策略：协议+域名+端口相同 (即使两个不同的域名指向了同一个 ip 地址，也非同源)

他会限制以下几种行为

- Cookie, LocalStorage 和 IndexDB 无法读取
- DOM 和 JS 对象无法获得
- AJAX 请求无法发送

### 简单请求和非简单请求

简单请求：满足以下两大条件

- 方法是以下 3 中之一
  - HEAD
  - GET
  - POST
- 头信息不超过以下几个字段
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-type

凡是不满足以上两个条件的，就属于非简单请求，非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为“预检”请求
浏览器先询问服务器，服务器收到预检请求后，检查 Origin、Access-Control-Request-Methods 和 Access-Control-Request-Headers 字段以后，确认允许跨源请求，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错

### 解决方案

- JOSNP: 利用 script 标签不受跨域限制的特点，缺点是只支持 get 请求，只能接收 JSON 格式的数据，无法处理其它格式的数据
- CORS: 设置 Access-Control-Allow-Origin: \*
  - 即跨域资源共享，它允许浏览器向非同源服务器，发送 AJAX 请求，这种方式的跨域主要是在后端进行设置
  - 整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与
- postMessage
  - postmessage 是一种 html5 新增的跨文档通信方式，它可以在两个不同的窗口之间进行安全跨域通信。
  - 原理：在一个窗口中发送消息，另一个窗口监听消息并处理
- nginx 反向代理跨域
  - 实现原理：通过 nginx 配置一个代理服务器(同域不同端口)做中间件，反向代理要跨域的域名
- node 中间件
  - 原理：同源策略是浏览器要遵循的标准，而如果是服务器向服务器请求就没有跨域这么一说（原理大致和 nginx 相同，都是通过启一个代理服务器，实现数据的转发）
- websocket
  - websocket 是一种基于 TCP 协议的双向通信协议，它提供了一种浏览器和服务器之间实时、低延迟、高效率的全双工通信方式，同时允许跨域通讯
  - 浏览器在发送 websocket 请求时，会在请求头中携带 Origin 字段，用于告诉服务器该请求的来源。服务器在收到请求后，会根据 Origin 字段判断是否允许该请求跨域，如果允许，则在响应头中添加 CROS 头

#### JSONP 实现

```js
function getInfo(data) {
  console.log(data); // jsonp 跨域成功
}

let script = document.createElement("script");
script.src = "https://example.com/api?callback=getInfo";
document.body.appendChild(script);
```

#### postmessage 实现

```js
// 发送消息
var targetWindow = window.parent;
var message = "hello parent message";
targetWindow.postMessage(message, "*"); // 可以指定域名，这里*表示任意上层parent窗口

// 接收消息
window.addEventListener("message", function(event) {
  var message = event.data;
  console.log("message = " + message);
});
```

#### nginx 反向代理

```nginx
server {
    listen 80;
    server_name www.doman1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  # 反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; # 修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  # 当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

```js
// 前端代码
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open("get", "http://www.domain1.com:81/?user=admin", true);
xhr.send();
```

```js
// 后端代码
var http = require("http");
var server = http.createServer();
var qs = require("querystring");
server.on("request", function(req, res) {
  var params = qs.parse(req.url.substring(2));
  // 向前台写cookie
  res.writeHead(200, {
    "Set-Cookie": "l=123456;Path=/;Domain=www.domain2.com;HttpOnly" // HttpOnly:脚本无法读取
  });
  res.write(JSON.stringify(params));
  res.end();
});
server.listen(8080);
```

#### node 中间件实现

```js
// nodeMiddleServer
const express = require("express");
const { createproxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.static(__dirname));
// 使用代理
app.use(
  "/api",
  createproxyMiddleware({
    target: "http:localhost:8002",
    pathRewrite: {
      "^/api": ""
    },
    changeOrigin: true
  })
);

app.listen(8001);
```

```js
// nodeServer.js
const express = require("express");
const app = express();

app.get("/request", (req, res) => {
  res.end("request success");
});

app.listen(8002);
```

## 事件委托

事件委托本质上是利用了浏览器的事件冒泡机制，因为事件在冒泡过程中会上传到父节点，父节点可以通过事件对象获取到目标节点，因此可以把子节点的监听函数定义到父节点上，由父节点的监听函数统一处理多个子元素事件，这种方式称为事件委托

使用事件委托可以不必为每一个子元素都绑定监听事件，减少了内存上的消耗，并且使用事件代理还可以实现事件的动态绑定，比如新增一个子节点，无需单独为它增加一个监听事件，它绑定的事件会交给父元素的监听函数处理

## for...in 和 for...of 和 foreach 区别

for...in 遍历对象属性，顺序不确定，取决于 js 引擎实现（无法直接遍历数组），遍历的是对象的属性名(键)，（使用该循环时，需要使用 hasOwnProperty 方法过滤原型链上的属性，以确保只遍历对象本身的属性）
for...of 遍历可迭代对象(数组，字符串，Map，Set)元素时，按照元素在数组中的顺序进行遍历，遍历的是元素值
foreach 只能用于遍历数组，不能用于遍历对象，遍历的是元素值

## Performance 指标

## window.onload 和 DOMContentLoaded 区别

DOMContentLoaded 是在 HTML 文档被完全加载和解析之后才会触发的事件，并不需要等到(样式表，图像，子框架)加载完成之后再进行
load 事件，用于检测一个加载完全的页面，当一个资源及其依赖的资源已完成加载时，将会触发 load 事件

### DOMContentLoaded

## async 和 defer

async 和 defer 属性只对外部脚本起作用，如果没有 src 属性它们会被忽略

async： 指外部 js 文件和当前 html 页面同时加载（异步加载），在当前 js 文件加载完成后，执行 js 代码
defer： 指外部 js 文件和当前 html 页面同时加载（异步加载），但只在当前页面解析完成之后执行 js 代码

异步加载：指同时加载，即某个 js 文件加载的同时，其余文件也可以加载
同步加载：指某个 js 文件加载的同时，其余文件不能加载

defer 比 async 要先引入，他的执行在解析完全完成之后才能开始，它处在 DOMContentLoaded 事件之前。它保证脚本会按照它在 html 中出现的顺序执行，并且不会阻塞解析
async 脚本在他们完成下载后的第一时间执行，它处在 window 的 load 事件之前，这意味着可能设置了 async 的脚本不会按照它在 html 中出现的顺序执行

## apply、call 和 bind

apply 和 call 都是为了改变某个函数运行时的上下文(context)而存在的，也就是为了改变函数体内部 this 的指向
两者作用是一致的，区别是两者传参的方式不一样，例如

bind 方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind 方法的第二个及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数

总结

- apply、call 和 bind 都是用来改变函数的 this 指向的
- apply、call 和 bind 三者的第一个参数都是 this 要指向的调用对象，也就是指定的上下文
- apply、call 和 bind 三者都可以传参
- apply、call 是立即调用，bind 则是返回对应函数，便于后续调用

```js
var func = function(par1, par2) {};
func.call(this, par1, par2);
func.apply(this, [par1, par2]);
```

### 实现 apply

```js
Function.prototype.MyCall = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  let result;
  if (arr) {
    result = context.fn(...arr);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
};
```

### 实现 call

- 将函数设为对象的属性
- 执行&删除这个函数
- 指定 this 到函数并传入给定参数执行函数

```js
Function.prototype.MyCall = function(context) {
  context = context || window;
  context.fn = this;
  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  context.fn(...args);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
```

### 实现 bind

- 返回一个函数，绑定 this，传递预置参数
- bind 返回的函数可以作为构造函数使用，作为构造函数时应使得 this 失效，但是传入的参数依然有效

```js
Function.prototype.MyBind = function(context) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  var args = Array.prototype.slice.call(arguments, 1);
  var fToBind = this;
  var fNop = function() {};
  var fBound = function() {
    // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
    return fToBind.apply(
      this instanceof fNop ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };
  // 维护原型关系
  if (this.prototype) {
    fNop.prototype = this.prototype;
  }
  fBound.prototype = new fNop();
  return fBound;
};
```

## 类型判断

- typeof 只能识别基础类型和引用类型 (注意 null, NaN, document.all 的判断)
- constructor 指向创建该实例对象的构造函数 (注意 null 和 undefined 没有 constructor，以及 constructor 可以被改写，不太可靠)
- instanceof
- Object.prototype.toString.call ("[object Number]", "[object Undefined]" 等等类型)
- isArray

### 实现 instanceof

```js
function myInstanceOf(L, R) {
  var LeftValue = L.__proto__;
  var RightValue = R.prototype;

  while (true) {
    if (LeftValue === null) {
      return false;
    }
    if (LeftValue === RightValue) {
      return true;
    }
    LeftValue = LeftValue.__proto__;
  }
}
```

## new 本质

- 创建一个新对象
- 链接到原型 obj.**prototype** = Con.portotype;
- 绑定到 this
- 返回新对象(如果构造函数有自己的 return，则返回该值)

```js
function myNew(func) {
  return function() {
    let obj = {
      __proto__: func.prototype
    };
    const ret = func.apply(obj, Array.prototype.slice.call(arguments));

    return typeof ret === "object" ? ret : obj;
  };
}
```

## Object.create 实现原理

```js
// 将传入的对象作为原型
function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

## Promise

```js
```

## EventBus

```js
function EventEmitter() {
  this.events = Object.create(null);
}

EventEmitter.defaultMaxListeners = 10;

EventEmitter.prototype.on = function(type, listener, flag) {
  if (!this.events) {
    this.events = Object.create(null);
  }
  if (this.events[type]) {
    if (flag) {
      this.events[type].push(listener);
    } else {
      this.events[type].unshift(listener);
    }
  } else {
    this.events[type] = [listener];
  }
};
EventEmitter.prototype.emit = function(type, ...args) {
  if (this.events[type]) {
    this.events[type].forEach(fn => {
      fn.call(this, ...args);
    });
  }
};
EventEmitter.prototype.once = function(type, listener) {
  let _this = this;
  function only() {
    listener();
    _this.removeListener(type, only);
  }

  only.origin = listener;
  this.on(type, only);
};
EventEmitter.prototype.off = function(type, listener) {
  if (this._enents[type]) {
    this._events[type] = this._events[type].filter(fn => {
      return fn !== listener && fn.origin !== listener;
    });
  }
};
EventEmitter.prototype.removeListener = function(type, listener) {
  this.events = Object.create(null);
};
```

```js
class EventBus {
  constructor() {
    this.event = Object.create(null);
  }

  on(type, listener, flag) {
    if (this.event[type]) {
      if (flag) {
        this.event[type].unshift(listener);
      } else {
        this.event[type].push(listener);
      }
    } else {
      this.event[type] = [listener];
    }
  }

  emit(type, ...args) {
    if (this.event[type]) {
      this.event[type].forEach(fn => {
        fn.call(this, ...args);
      });
    }
  }
  once(type, listener) {
    const warpper = (...args) => {
      listener.call(this, ...args);
      this.off(type, warpper);
    };
    this.on(type, warpper);
  }
  off(type, listener) {
    if (this.event[type]) {
      // delete this.event[type]
      this.event[type] = this.event[type].filter(fn => {
        return fn !== listener;
      });
    }
  }

  removeAllListener() {
    this.event = Object.create(null);
  }
}
```

## 并发请求

假如有几十个请求，如何去控制并发

```js
// 使用async/await 和 Promise.all
async function sendRequest (urls, concurrencyLimit = 6) {
  const batchs = [];
  for (let i = 0; i < urls.length; i++) {
    const batch = urls.slice(i, i + concurrencyLimit);
    batchs.push(batch);
  }
  for (const batch of batchs) {
    const requests = batch.map(url => fecth(url));
    await Promise.all(requests);
  }
}
```

```js
// 使用并发控制库,如 p-limit
import pLimit from 'p-limit';
async function sendRequests (urls, concurrencyLimit = 6) {
  const limit = pLimit(concurrencyLimit);
  const requests = urls.map(url => limit(() => fetch(url)));
  await Promise.all(requests);
}
```

```js
// 使用队列和计数器
import axios from 'axios'

export const handQueue = (
  reqs // 请求总数
) => {
  reqs = reqs || []
  const requestQueue = (concurrency) => {
    concurrency = concurrency || 6 // 最大并发数
    const queue = [] // 请求池
    let current = 0
    // 这个函数用于从请求池中取出请求并发送。它在一个循环中运行，直到当前并发请求数current达到最大并发数concurrency或请求池queue为空
    // 对于每个出队的请求，它首先增加current的值，然后调用请求函数requestPromiseFactory来发送请求
    // 当请求完成（无论成功还是失败）后，它会减少current的值并再次调用dequeue，以便处理下一个请求
    const dequeue = () => {
      while (current < concurrency && queue.length) {
        current++;
        const requestPromiseFactory = queue.shift() // 出列
        requestPromiseFactory()
          .then(() => { // 成功的请求逻辑
          })
          .catch(error => { // 失败
            console.log(error)
          })
          .finally(() => {
            current--
            dequeue()
          });
      }

    }
    // 函数返回一个函数，这个函数接受一个参数requestPromiseFactory，表示一个返回Promise的请求工厂函数。
    // 这个返回的函数将请求工厂函数加入请求池queue，并调用dequeue来尝试发送新的请求，当然也可以自定义axios，利用Promise.all统一处理返回后的结果
    return (requestPromiseFactory) => {
      queue.push(requestPromiseFactory) // 入队
      dequeue()
    }
  }
  // 测试
  const enqueue = requestQueue(6)
  for (let i = 0; i < reqs.length; i++) {
    enqueue(() => axios.get('/api/test' + i))
  }
}
```
