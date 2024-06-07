---
title: Bun
description: Bun介绍
date: 2021-05-13
---

# Bun

Bun是一个新兴的Javascript运行时，旨在提供更快的性能和更好的开发体验

## Bun介绍

- 性能优势
  - Bun 使用 JavaScriptCore（Safari 的 JavaScript 引擎）作为其运行时引擎，并进行了优化，以提供更快的启动时间和执行速度
  - Bun 利用了现代 JavaScript 引擎的优势，如即时编译（JIT）和优化的垃圾回收机制，以提高性能
  - 根据官方的基准测试，Bun 在启动时间和某些场景下的执行速度方面优于 Node.js
- 内置工具和功能
  - Bun 内置了一些常用的开发工具和功能，如打包器（bundler）、测试运行器和代码转换器等
  - 它支持 ECMAScript 模块（ESM）和 CommonJS 模块，并提供了一个快速的模块解析器
  - Bun 还内置了一个基于 Rust 的快速 Web 服务器，可以直接在 Bun 中编写和运行 Web 应用程序
- 兼容性和生态系统
  - Bun 努力与 Node.js 保持一定程度的兼容性，许多为 Node.js 编写的 JavaScript 代码可以在 Bun 中运行
  - 然而，由于 Bun 是一个相对较新的运行时，其生态系统和可用的第三方库可能不如 Node.js 丰富和成熟
- 应用场景
  - Bun 适用于对性能要求较高的 JavaScript 应用程序，如 Web 服务器、API 服务、实时应用等
  - 它可以用于开发命令行工具和实用程序，利用其快速的启动时间和执行速度
  - Bun 还可以用于构建和打包前端应用程序，利用其内置的打包器和转换器

## 快速上手

Mac/Linux 上安装

```bash
curl https://bun.sh/install | bash
```

Windows 上安装

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

新建 http.js

```js
export default {
  port: 3000,
  fetch(request) {
    return new Response('Welcome to Bun!');
  },
};
```

运行

```bash
bun run http.js
```

浏览器打开 http://localhost:3000 即可

## 常用功能

### 常用命令

- bun add：等同于 yarn add 或 npm install
- bun install：等同于 yarn install 或 npm install
- bun run：类似于 npm run
- bun create：通过该命令，可快速创建一个模板项目
- bun bun：该命令会递归收集指定文件的导入依赖，然后生成包含这些信息的 node_modules.bun 文件
- bun upgrade：要升级 bun，请运行bun upgrade

### 配置文件bunfig.toml

bunfig.toml 是 bun 的配置文件

它允许您在 bunfig.toml 加载配置，而不是每次都将参数传递给命令行。在解析命令行参数之前加载配置文件，这意味着命令行参数可以覆盖这个配置

```bash
# Set a default framework to use
# By default, bun will look for an npm package like `bun-framework-${framework}`, followed by `${framework}`
framework = "next"
logLevel = "debug"

# publicDir = "public"
# external = ["jquery"]

[macros]
# Remap any import like this:
#     import {graphql} from 'react-relay';
# To:
#     import {graphql} from 'macro:bun-macro-relay';
react-relay = { "graphql" = "bun-macro-relay" }

[bundle]
saveTo = "node_modules.bun"
# Don't need this if `framework` is set, but showing it here as an example anyway
entryPoints = ["./app/index.ts"]

[bundle.packages]
# If you're bundling packages that do not actually live in a `node_modules` folder or do not have the full package name in the file path, you can pass this to bundle them anyway
"@bigapp/design-system" = true

[dev]
# Change the default port from 3000 to 5000
# Also inherited by Bun.serve
port = 5000

[define]
# Replace any usage of "process.env.bagel" with the string `lox`.
# The values are parsed as JSON, except single-quoted strings are supported and `'undefined'` becomes `undefined` in JS.
# This will probably change in a future release to be just regular TOML instead. It is a holdover from the CLI argument parsing.
"process.env.bagel" = "'lox'"

[loaders]
# When loading a .bagel file, run the JS parser
".bagel" = "js"

[debug]
# When navigating to a blob: or src: link, open the file in your editor
# If not, it tries $EDITOR or $VISUAL
# If that still fails, it will try Visual Studio Code, then Sublime Text, then a few others
# This is used by Bun.openInEditor()
editor = "code"

# List of editors:
# - "subl", "sublime"
# - "vscode", "code"
# - "textmate", "mate"
# - "idea"
# - "webstorm"
# - "nvim", "neovim"
# - "vim","vi"
# - "emacs"
# - "atom"
# If you pass it a file path, it will open with the file path instead
# It will recognize non-GUI editors, but I don't think it will work yet
```

- framework ：指定默认使用的 framework 版本，bun 将根据 bun-framework-${framework} 格式找寻找 npm 包；
- logLevel ：指定 log 级别（可用值 error 、 warn 、 info 和 debug ）；
- publicDir ：指定 public 目录；
- external ：指定外部扩展，作用等同于 Webpack 的 externals；
- macros ：宏定义，用于替换 import 路径，比如：import { graphql } from 'react-relay'; 将被转换为 import { graphql } from "macro:bun-macro-relay/bun-macro-relay.tsx";
- dev.port ：指定服务的监听端口（默认 3000 ）；
- define ：作用等同于 Webpack 的 DefinePlugin；
- loaders ：指定各类文件的解析器
