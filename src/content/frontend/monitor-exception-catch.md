---
title: 前端异常的捕获与处理
description: 前端异常的捕获与处理是前端开发中非常重要的一环。在 JavaScript 代码的执行过程中,可能会出现各种异常,如语法错误、运行时错误、网络请求错误等。如果这些异常没有被正确捕获和处理,可能会导致页面崩溃、用户体验下降,甚至数据丢失等严重后果。为了提高前端应用的稳定性和可靠性,我们需要采取适当的措施来捕获和处理异常
date: 2021-08-05
---

# 前端异常捕获

- 页面元素异常
- 页面卡顿和异常
- 接口调用情况
  - 对于接口调用情况，通常需要上报客户端的相关参数，用户OS、浏览器版本、请求参数
- 页面逻辑是否错误
  - 对于页面逻辑错误，除了用户OS和浏览器版本之外，需要的是报错的堆栈信息以及具体报错位置

## 异常类型

- Error 错误的基类，其他错误都继承自该类型
- SyntaxError 语法错误 指在解析代码时发生的错误，通常是由不正确的语法或使用未定义的变量、函数导致的（括号、分号缺失）
- TypeError 类型错误 指在执行操作时，传递的参数与预期的类型不匹配导致的错误
- EvalError eval错误 指在使用eval()函数时发生的错误，由于eval()函数的安全性和性能问题,一般不推荐使用,所以EvalError相对较少见
- ReferenceError 引用错误 指在访问一个未定义的变量、函数或对象时发生的错误
- RangeError 范围错误 指当一个值不在其允许的范围内时发生的错误。常见的范围错误包括创建一个过大的数组、将数字转换为超出范围的字符串等
- URIError URI错误 指在使用encodeURI()或decodeURI()等函数时,如果传递了格式不正确的URI,就会发生URI错误
- InternalError 内部错误 指在JavaScript引擎内部发生的错误,通常是由于浏览器或JavaScript引擎的bug导致的

## 异常捕获方式

- 使用 try-catch 语句
- finally语句(finally语句通常与try-catch语句一起使用,用于指定无论是否发生异常都会执行的代码块)
- 全局异常处理 window.onerror
- Promise 异常处理: 对于使用Promise的异步操作,可以使用Promise的catch方法来捕获和处理异常

### 全局捕获

window.error 无法捕获静态资源异常和 JS 代码错误

```js
window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
  console.log('errorMessage: ' + errorMessage); // 异常信息
  console.log('scriptURI: ' + scriptURI); // 异常文件路径
  console.log('lineNo: ' + lineNo); // 异常行号
  console.log('columnNo: ' + columnNo); // 异常列号
  console.log('error: ' + error); // 异常堆栈信息
  // ...
  // 异常上报
};
throw new Error('这是一个错误');
```

```js
window.addEventListener('error', function() {
  console.log(error);
  // ...
  // 异常上报
});
throw new Error('这是一个错误');
```

静态资源加载异常

方法一：onerror 来捕获

```html
<script>
  function errorHandler(error) {
    console.log("静态资源加载异常", error);
  }
</script>
<script src="http://cdn.xxx.com/js/error.js" onerror="errorHandler(this)"></script>
<link rel="stylesheet" href="http://cdn.xxx.com/styles/error.css" onerror="errorHandler(this)">
<!-- 这样可以拿到静态资源错误，但是代码侵入性较多，不建议使用 -->
```

方法二：addEventListener("error")

由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行，但是这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等

```html
<!DOCTYPE html>
<html lang="zh">
 
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>error</title>
  <script>
    window.addEventListener('error', (error) => {
      console.log('捕获到异常：', error);
    }, true)
  </script>
</head>
 
<body>
  <!-- 随便一张无法访问的图片地址 -->
  <img src="https://xxx.png">
</body>
 
</html>
```

### try... catch

使用try... catch虽然能够较好地进行异常捕获，不至于使得页面由于一处错误挂掉，但try ... catch捕获方式显得过于臃肿，大多代码使用try ... catch包裹，影响代码可读性

### Promise 异常捕获

Promise 中的异常不能被try catch 和 window.onerror 捕获，这就需要监听 unhandledrejection 来帮助我们捕获这部分错误

```js
window.addEventListener('unhandledrejection', (error) => {
  e.preventDefault();
  console.log("捕获到 promise 错误了");
  console.log("错误的原因是", e.reason);
  console.log("Promise 对象是", e.promise);
  return true;
})
// 错误1
Promise.reject("promise error");
// 错误2
new Promise((resolve, reject) => {
  reject("promise error");
});
// 错误3
new Promise((resolve) => {
  resolve();
}).then(() => {
  throw "promise error";
});
```

### 请求异常捕获

以最常用的 HTTP 请求库 axios 为例，模拟接口响应 401 的情况

```js
import axios from 'axios';

// 请求
axios.get('api/test/401')
// 结果
// Uncaught (in promise) Error: Request failed with status code 401
// at createError (axios.js:1103)
// at settle (axios.js:1102)
// at XMLHttpRequest.handleLoad (axios.js:1011)
```

可以看出来 axios 的异常可以当做 Promise 异常来处理：

使用 axios 的拦截器来做统一梳理，同理能统一处理的异常也可以在放在拦截器里处理

```js
import axios from 'axios';
// ...
axios.interceptors.response.use(
  function (response) {
  },
  function (error) {
    if (error.response.status === 401) {
      goLogin(); // 跳转登录页
    } else if (error.response.status === 502) {
      alert(error.response.data.message || "系统升级中，请稍后重试");
    }
    return Promise.reject(error.response);
  }
);
```

## 异常捕获常见问题

### 跨域脚本无法准确捕获异常

跨域之后window.onerror根本捕获不到正确的异常信息，而是统一返回一个Script error

解决方案： 对script标签增加一个crossorigin="anonymous"，并且服务器添加Access-Control-Allow-Origin

```js
<script src="http://cdn.xxx.com/index.js" crossorigin="anonymous"></script>
```

### sourceMap

通常在生产环境下的代码是经过webpack打包后压缩混淆的代码，所以我们可能会遇到这样的问题，所有报错的代码夯实都在第一行了，这是因为生产环境下，我们的代码压缩成了一行

解决方法：开启webpack的source-map，利用webpack打包后生成的一份.map的脚本文件就可以让浏览器对错误位置进行追踪了；就是webpack.config.js中加上一行devtool: 'source-map'

开启source-map的缺陷是兼容性，目前只有Chrome浏览器和Firefox浏览器才对source-map支持。不过我们对这一类情况也有解决办法。可以使用引入npm库来支持source-map，可以参考mozilla/source-map。这个npm库既可以运行在客户端也可以运行在服务端，不过更为推荐的是在服务端使用Node.js对接收到的日志信息时使用source-map解析，以避免源代码的泄露造成风险

```js
const express = require('express');
const fs = require('fs');
const router = express.Router();
const sourceMap = require('source-map');
const path = require('path');
const resolve = file => path.resolve(__dirname, file);
// 定义post接口
router.get('/error/', async function(req, res) {
  // 获取前端传过来的报错对象
  let error = JSON.parse(req.query.error);
  let url = error.scriptURI; // 压缩文件路径
  if (url) {
    let fileUrl = url.slice(url.indexOf('client/')) + '.map'; // map文件路径
    // 解析sourceMap
    let consumer = await new sourceMap.SourceMapConsumer(fs.readFileSync(resolve('../' + fileUrl), 'utf8')); // 返回一个promise对象
    // 解析原始报错数据
    let result = consumer.originalPositionFor({
      line: error.lineNo, // 压缩后的行号
      column: error.columnNo // 压缩后的列号
    });
    console.log(result);
  }
});
module.exports = router;
```

### Vue捕获异常

Vue中，异常被Vue自身给try...catch了，不会传到window.onerror；借助Vue.config.errorHandler这样的Vue全局配置，可以在Vue指定组件的渲染和观察期间未补获错误的处理函数。这个处理函数被调用时，可以获取错误信息和Vue实例

```js
// vue2
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
}
```

```js
// vue3
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
  // err: 错误对象,包含错误的详细信息
  // instance: 发生错误的组件实例
  // 一个字符串,指示错误发生的位置或上下文信息

  // 处理错误的逻辑
  console.error('全局错误捕获:', err);
  // 可以在这里记录错误信息、发送错误报告等
}
app.mount('#app');
```

除了使用app.config.errorHandler进行全局错误处理外,Vue 3还提供组件级别的错误处理，在组件内部,可以使用onErrorCaptured生命周期钩子来捕获子组件的错误

```js
export default {
  onErrorCaptured(err, instance, info) {
    // 处理子组件的错误
    console.error('组件错误捕获:', err);
    return false; // 阻止错误继续向上传播
  }
};
```

### React捕获异常

在React中，可以使用ErrorBoundary组件包括业务组件的方式进行异常捕获，配合React 16.0+新出的componentDidCatch API，可以实现统一的异常捕获和日志上报

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

需要注意的是：error boundaries 并不会捕捉下面这些错误

- 事件处理器
- 异步代码
- 服务端渲染代码
- error boundaries内部错误

## 其他

```js
function datetime() {
  const d = new Date();
  const time = d.toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  const day = d.toJSON().slice(0, 10);
  return `${day} ${time}`;
}

window.onerror = function (message, source, lineno, colno, error) {
  let submitData = {}
  if (error && error.stack) {
    submitData = {
      title: message,
      msg: error.stack,
      source: source,
      category: 'js',
      level: 'error',
      timestamp: datetime()
    }
  } else if (typeof msg === 'string') {
    submitData = {
      title: message,
      msg: JSON.stringify({
        resourceUrl: source,
        rowNum: lineno,
        colNum: colno
      }),
      category: 'js',
      level: 'error',
      timestamp: datetime()
    }
  }
  if(JSON.stringify(submitData) !== '{}') {
    requestList.frontend.add(submitData);
    console.log(submitData)
  }
}
window.addEventListener('error', event => {
  console.log('====window.addEventListener====');
  console.log(event.target);
}, true);

// 当promise被reject并且错误信息没有被处理的时候
window.addEventListener('unhandledrejection', event => {
  console.log('unhandledrejection:' + event.reason); // 捕获后自定义处理
});

// 捕获处理console.error
var consoleError = window.console.error;
window.console.error = function () {
  // JSON.stringify(arguments)
  consoleError && consoleError.apply(window, arguments);
};

// if (!window.XMLHttpRequest) return;
// var xmlhttp = window.XMLHttpRequest;
// var _oldSend = xmlhttp.prototype.send;
// var _handleEvent = function (event) {
//   if (event && event.currentTarget && event.currentTarget.status !== 200) {
//     // 自定义错误上报 }
//   }
//   xmlhttp.prototype.send = function () {
//     if (this['addEventListener']) {
//       this['addEventListener']('error', _handleEvent);
//       this['addEventListener']('load', _handleEvent);
//       this['addEventListener']('abort', _handleEvent);
//     } else {
//       var _oldStateChange = this['onreadystatechange'];
//       this['onreadystatechange'] = function (event) {
//         if (this.readyState === 4) {
//           _handleEvent(event);
//         }
//         _oldStateChange && _oldStateChange.apply(this, arguments);
//       };
//     }
//     return _oldSend.apply(this, arguments);
//   }
// }

// if (!window.fetch) return;
// let _oldFetch = window.fetch;
// window.fetch = function () {
//   return _oldFetch.apply(this, arguments)
//     .then(res => {
//       if (!res.ok) { // True if status is HTTP 2xx
//         // 上报错误
//       }
//       console.log(res)
//       return res;
//     })
//     .catch(error => {
//       // 上报错误
//       console.log(error)
//       throw error;
//     })
// }
```
