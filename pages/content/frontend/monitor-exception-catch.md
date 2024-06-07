---
title: 前端异常的捕获与处理
description: 按键无法点击、元素不展示、页面白屏，这些都是我们前端不想看到的场景。在计算机程序运行的过程中，也总是会出现各种各样的异常。下面就让我们聊一聊有哪些异常以及怎么处理它们
date: 2021-08-05
---

# 前端异常捕获

- 接口调用情况
  - 对于接口调用情况，通常需要上报客户端的相关参数，用户OS、浏览器版本、请求参数
- 页面逻辑是否错误
  - 对于页面逻辑错误，除了用户OS和浏览器版本之外，需要的是报错的堆栈信息以及具体报错位置

## 异常捕获方式

### 异常捕获方式介绍

#### 全局捕获

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

#### try... catch

使用try... catch虽然能够较好地进行异常捕获，不至于使得页面由于一处错误挂掉，但try ... catch捕获方式显得过于臃肿，大多代码使用try ... catch包裹，影响代码可读性

### 异常捕获常见问题

#### 跨域脚本无法准确捕获异常

跨域之后window.onerror根本捕获不到正确的异常信息，而是统一返回一个Script error

解决方案： 对script标签增加一个crossorigin="anonymous"，并且服务器添加Access-Control-Allow-Origin

```js
<script src="http://cdn.xxx.com/index.js" crossorigin="anonymous"></script>
```

#### sourceMap

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

#### Vue捕获异常

Vue中，异常被Vue自身给try...catch了，不会传到window.onerror；借助Vue.config.errorHandler这样的Vue全局配置，可以在Vue指定组件的渲染和观察期间未补获错误的处理函数。这个处理函数被调用时，可以获取错误信息和Vue实例

```js
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
}
```

#### React捕获异常

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
