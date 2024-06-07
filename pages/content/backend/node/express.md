# Express

Express 是 NodeJS 的一个 Web 框架。它通过为 Node 的 req 和 res 对象添加有用的方法和属性来增强其功能

## 使用场景

- 应用程序是基于浏览器的，并且需要支持路由和模板，请使用 Express
- 需要社区提供更多支持/文档，请使用 Express

## 基本路由

```js
const express = require('express');
const app = express();

const asyncActivity = async () => {
  return {
    success: true,
  }
}

const asyncWrapper = fn => (...args) => fn(...args).catch(args[2]);

app.get('/', asyncWrapper(async (req, res, next) => {
  const result = await asyncActivity();
  res.json(result);
}));

app.use(function errorMiddleware(error, req, res, nexr) {
  res.status(500)
  res.send(error)
})
```

## 中间件

Express的中间件是基于回调的

### 源码解析

## 一个基本的Express配置

### 目录结构

```yml
├─ bin            数据库初始化脚本
│  ├─ db          项目数据库安装，其中 setup.sh 为命令入口，初始化数据库
├─ common         共用方法、常量目录
├─ conf           数据库基本配置目录
├─ dao            代码主逻辑目录
├─ log            日志目录
├─ public         静态文件目录
├─ routes         url 路由配置
├─ .eslintrc.js   eslint 配置
├─ app.js         express 入口
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

可以使用CORS（跨源资源共享）中间件来配置跨域

```js
const express = require('express')
const cors = require('cors')
const app = express()

// 启用所有 CORS 请求
app.use(cors())
// 只允许特定的源进行跨域请求
app.use(cors({
  origin: 'http://example.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}))
```

```js
// 单个路由配置CORS请求
const express = require('express')
const cors = require('cors')
const app = express()

// 单个路由配置CORS请求
app.get('/products/:id', cors(), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})
// 单个路由配置CORS请求加配置
const corsOptions = {
  origin: 'http://example.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}
app.get('/goods/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})
```

设置res.headers

```js
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})
```

### 数据库初始化

### 日志配置

#### morgan 记录请求日志

morgan 是 express 默认的日志中间件，也可以脱离 express，作为 node.js 的日志组件单独使用

```js
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const app = express()

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

项目中按模块划分请求处理，我们在 routes 目录下分别新建每个模块路由配置，例如用户模块，则为 user.js 文件，我们在 app.js 主入口文件中引入每个模块的路由，以用户模块进行举例，相关代码逻辑如下

```js
// 引入用户模块路由配置
const usersRouter = require('./routes/users')
// 使用用户模块的路由配置
app.use('/users', usersRouter)
```

其中 routes/users.js 文件中的路由配置如下：

```js
const express = require('express')
const router = express.Router()
const logger = require('../common/logger')

// 新增用户
router.post('/addUser', (req, res, next) => {
  
})
// 用户列表
router.get('/queryUserList', (req, res, next) => {
  
})

module.exports = router

```

客户端通过 /users 开头的请求路径，都会跳转到用户模块路由中进行处理，比如请求 /users/addUser 会跳转到用户模块的 addUser 方法中进行处理

### token认证

express-jwt 是 node.js 的一个中间件，他来验证指定 http 请求的 JsonWebTokens 的有效性，如果有效就将jsonWebTokens 的值设置到 req.user 里面，然后路由到相应的 router

```js
const { expressjwt: expressJWT } = require('express-jwt')

app.use(expressJWT({
  secret: 'my-secret',
  algorithms: ['HS256'],
}).unless({
  // 除了以下这些 URL，其他的URL都需要验证
  path: [
    '/getToken',
    '/getToken/adminLogin',
    '/appVersion/upload',
  ]
}))
```

我们可以选择在生成 token 时，将对应登录的用户 id 注入 token 中，如文件 dao/tokenDao.js 文件中所配置的

```js
// uid 注入 token 中
ret = {
  code: 0,
  data: {
    token: jsonWebToken.sign({
      uid: obj.uid
    },
    CONSTANT.SECRET_KEY, {
      expiresIn: 60 * 60 * 24
    }),
  }
};
```

后续我们可以在请求中，通过请求信息 req.body.uid，获取得到先前注入 token 里面的用户 id 信息。

### 错误处理

### 静态文件配置

```js
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, 'public')))
```

### pm2使用

### eslint&prettier配置

安装eslint相关依赖，根目录下创建.eslintrc.js文件

```js
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'comma-dangle': 'off',
    'no-unused-vars': 'off',
    semi: 'off'
  }
}
```

### 其他

#### 常用中间件

- body-parser 用于处理 post 请求提交的数据，把数据保存在 req.body 中，以一个对象的形式提供给服务器，方便进行后续的处理
- dotenv 用于按需加载不同的环境变量文件
- chalk 用于改变console输出的样式
- mount-routes 可以自动挂载 routes 目录的所有路由，以文件名称作为路由的根，也可以指定具体的路径
- cors 解决跨域问题
- express-jwt + jsonwebtoken  生成 JWT 字符串 + 将 JWT 字符串解析还原成 JSON 对象
- log4js Node 日志管理工具，可以将自定义格式的日志输出到各种渠道
- nodemailer 简单易用的 Node.JS 邮件发送模块
- multer 用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件
- express-swagger-generator 自动生成 api 文档
- crypto-js 纯 JavaScript 的加密算法类库，可以非常方便的在前端进行其所支持的加解密操作（支持的算法：MD5,SHA-1,SHA-256,AES,HMAC）
- express-session 针对 express 框架提供的一套 session 扩展，session 是另一种记录客户状态的机制，不同的是 Cookie 保存在客户端浏览器中，而 session 保存在服务器上
