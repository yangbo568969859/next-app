# webapck 热更新原理

Hot Module Replacement(HMR)，无需完全刷新整个页面的同时，更新模块

- 启动webpack，生成compiler对象。compiler上有很多方法，比如可以启动webpack所有编译工作，以及监听本地文件变化
- 使用express框架启动本地server，让浏览器可以请求本地的静态资源
- 本地server启动之后，再去启动websocket服务，通过websocket，可以建立本地服务和浏览器的双向通信。相当于本地文件发生变动，可以立马通知浏览器热更新代码
