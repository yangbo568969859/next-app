# Koa

Koa 是 NodeJS 的一个中间件框架。Koa 使用自己的上下文（ctx）替换或提取 Node 的 req 和 res 对象属性

Koa 利用生成器函数和 async/await 实现更清晰的代码。虽然这有助于避免在 Express 中常见的“回调地狱”问题

## 使用场景

- 应用程序不是基于浏览器且不需要路由和模板支持时，请使用 Koa
- 强调性能(更轻量级)，使用Koa

## Koa 基本路由

```js
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

const asyncActivity = () => {
  return {
    success: true
  };
};

app.use(async function handleError(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = error;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

router.get("/", async (ctx, next) => {
  const result = await asyncActivity();
  ctx.body = result;
});

app.listen(3001, () => console.log("Example app listening on port 3001!"));
```

## 一个基本的Koa配置

### 目录结构

```yaml
├─
├─ common         共用方法、常量目录
├─ config         数据库基本配置目录
├─ logs           日志目录
├─ middleware     中间件
├─ models         Schema和Model
├─ public         静态文件目录
├─ routes         url 路由配置
├─ utils          工具方法
├─ views          ejs页面模板
├─ app.js         koa 入口
├─ package.json   项目依赖包配置
├─ README.md      项目说明
```

### 热更新配置

每次修改 js 文件，我们都需要重启服务器，这样修改的内容才会生效，但是每次重启比较麻烦，影响开发效果

在开发环境中引入 nodemon 插件，实现实时热更新，自动重启项目

```shell
npm install nodemon -S
```

package.json中新增dev环境脚本

```json
{
  "scripts": {
    "dev": "nodemon app.js"
  }
}
```

### 跨域配置

安装 koa2-cors

```js
const cors = require('koa2-cors')
app.use(cors())
```

### 数据库

mongoDB 数据库

### 日志配置

#### morgan 记录请求日志

morgan 是 express 默认的日志中间件，也可以脱离 express，作为 node.js 的日志组件单独使用

```js
const Koa = require('koa')
const morgan = require('morgan')
const fs = require('fs')
const app = new Koa()

// 使用'morgan'中间件，并设置日志格式为'dev'
app.use(morgan('dev'))
// 输出日志到目录
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'), { flags: 'a', encoding: 'utf8' }); 
app.use(morgan('combined', { stream: accessLogStream }));
```

#### winston 记录错误日志

由于 morgan 只能记录 http 请求的日志，所以我们还需要 winston 来记录其它想记录的日志，例如：访问数据库出错等

```js
const { format, createLogger, transports } = require('winston')
const { combine, timestamp, printf } = format
const DailyRotateFile = require('winston-daily-rotate-file') // 日志清除插件
const path = require('path')

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    logFormat,
  ),
  transports: [
    new (transports.Console)(),
    new (transports.File)({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    new (transports.File)({
      filename: path.join(__dirname, '../logs/info.log'),
      level: 'info',
    }),
    new DailyRotateFile({
      filename: path.join('logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '300m',
      maxFiles: '10d',
      utc: true
    })
  ]
})

module.exports = logger

```

### 请求路由处理

### 错误处理

### 静态文件配置

### pm2使用

## 源码分析

- listen http的语法糖，实际上还是用了http.createServer()，然后监听了一个端口
- ctx 利用 上下文(context) 机制，将原来的req,res对象合二为一，并进行了大量拓展,使开发者可以方便的使用更多属性和方法，大大减少了处理字符串、提取信息的时间
- use koa的核心 —— 中间件（middleware）。解决了异步编程中回调地狱的问题，基于Promise，利用 洋葱模型 思想，使嵌套的、纠缠不清的代码变得清晰、明确，并且可拓展，可定制，借助许多第三方中间件，可以使精简的koa更加全能（例如koa-router，实现了路由）。其原理主要是一个极其精妙的 compose 函数。在使用时，用 next() 方法，从上一个中间件跳到下一个中间件
