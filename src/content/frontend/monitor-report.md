---
title: 前端异常错误上报
description: 如何处理前端错误以及错误如何上报
date: 2021-08-05
---

# 错误上报

## 后端

### 单独的日志域名

对于日志上报使用单独的日志域名的目的是避免对业务造成影响。其一，对于服务器来说，我们肯定不希望占用业务服务器的计算资源，也不希望过多的日志在业务服务器堆积，造成业务服务器的存储空间不够的情况。其二，我们知道在页面初始化的过程中，会对页面加载时间、PV、UV 等数据进行上报，这些上报请求会和加载业务数据几乎是同时刻发出，而浏览器一般会对同一个域名的请求量有并发数的限制，如 Chrome 会有对并发数为 6 个的限制。因此需要对日志系统单独设定域名，最小化对页面加载性能造成的影响

### 跨域的问题

对于单独的日志域名，肯定会涉及到跨域的问题，采取的解决方案一般有以下两种

- 一种是构造空的 Image 对象的方式，其原因是请求图片并不涉及到跨域的问题；
- 利用 Ajax 上报日志，必须对日志服务器接口开启跨域请求头部 Access-Control-Allow-Origin:\*，这里 Ajax 就并不强制使用 GET 请求了，即可克服 URL 长度限制的问题。

```js
if (XMLHttpRequest) {
  var xhr = new XMLHttpRequest();
  xhr.open("post", "https://log.xxx.com", true); // 上报给node中间层处理
  xhr.setRequestHeader("Content-Type", "application/json"); // 设置请求头
  xhr.send(JSON.stringify(errorObj)); // 发送参数
}
```

### 省去响应主体

对于我们上报日志，其实对于客户端来说，并不需要考虑上报的结果，甚至对于上报失败，我们也不需要在前端做任何交互，所以上报来说，其实使用 HEAD 请求就够了，接口返回空的结果，最大地减少上报日志造成的资源浪费

## 前端

### 合并上报

类似于雪碧图的思想，如果我们的应用需要上报的日志数量很多，那么有必要合并日志进行统一的上报。
解决方案可以是尝试在用户离开页面或者组件销毁时发送一个异步的 POST 请求来进行上报，但是尝试在卸载（unload）文档之前向 web 服务器发送数据。保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在卸载事件处理器中产生的异步 XMLHttpRequest，因为此时已经会跳转到下一个页面。所以这里是必须设置为同步的 XMLHttpRequest 请求吗？

```js
window.addEventListener("unload", logData, false);

function logData() {
  var client = new XMLHttpRequest();
  client.open("POST", "/log", false); // 第三个参数表明是同步的 xhr
  client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  client.send(analyticsData);
}
```

使用同步的方式势必会对用户体验造成影响，甚至会让用户感受到浏览器卡死感觉，对于产品而言，体验非常不好，通过查阅 MDN 文档，可以使用 sendBeacon()方法，将会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：使它可靠，异步并且不会影响下一页面的加载。此外，代码实际上还要比其他技术简单！
下面的例子展示了一个理论上的统计代码模式——通过使用 sendBeacon()方法向服务器发送数据。

```js
window.addEventListener("unload", logData, false);

function logData() {
  navigator.sendBeacon("/log", analyticsData);
}
```

### GIT 上报

向服务器端上报数据，可以通过请求接口，请求普通文件，或者请求图片资源的方式进行。只要能上报数据，无论是请求 GIF 文件还是请求 js 文件或者是调用页面接口，服务器端其实并不关心具体的上报方式。那为什么所有系统都统一使用了请求 GIF 图片的方式上报数据呢？

- 防止跨域

一般而言，打点域名都不是当前域名，所以所有的接口请求都会构成跨域。而跨域请求很容易出现由于配置不当被浏览器拦截并报错，这是不能接受的。但图片的 src 属性并不会跨域，并且同样可以发起请求。（排除接口上报）

- 防止阻塞页面加载，影响用户体验

通常，创建资源节点后只有将对象注入到浏览器 DOM 树后，浏览器才会实际发送资源请求。反复操作 DOM 不仅会引发性能问题，而且载入 js/css 资源还会阻塞页面渲染，影响用户体验。
但是图片请求例外。构造图片打点不仅不用插入 DOM，只要在 js 中 new 出 Image 对象就能发起请求，而且还没有阻塞问题，在没有 js 的浏览器环境中也能通过 img 标签正常打点，这是其他类型的资源请求所做不到的。（排除文件方式）

- 相比 PNG/JPG，GIF 的体积最小

最小的 BMP 文件需要 74 个字节，PNG 需要 67 个字节，而合法的 GIF，只需要 43 个字节。
同样的响应，GIF 可以比 BMP 节约 41%的流量，比 PNG 节约 35%的流量。
并且大多采用的是 1\*1 像素的透明 GIF 来上报
1x1 像素是最小的合法图片。而且，因为是通过图片打点，所以图片最好是透明的，这样一来不会影响页面本身展示效果，二者表示图片透明只要使用一个二进制位标记图片是透明色即可，不用存储色彩空间数据，可以节约体积。

GET 请求会有长度的限制，需要确保的是请求的长度不会超过阈值

```js
const uploadScout = (url, success, error) => {
  const img = new Image();
  img.onload = () => {
    typeof success === "function" && success();
  };
  img.onerror = () => {
    typeof error === "function" && error(new Error("scout error"));
  };
  img.src = url; // 图片地址和上报地址
  // './haorooms.gif?ac=haorooms&'+Math.random()
};

const h5ClickScout = (params, options, success, error) => {
  const logUrl =
    options && options.logUrl
      ? options.logUrl
      : "https://trackh5.guahao.cn/blank.gif";
  const { args, data } = params;
  const res = serializeParams(args, data);
  const url = `${logUrl}?pdata=${res.pdata}&data=${res.data}`;
  uploadScout(url, success, error);
};
```
