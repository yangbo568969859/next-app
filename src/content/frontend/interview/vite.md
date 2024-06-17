---
title: vite
description: vite系列知识
date: 2022-04-05
---

# vite

## 安装

## 问题

### 为什么Vite 速度比 Webpack 快

- 开发模式差异
  - 开发环境下：webpack是先打包再启动开发服务器；Vite 是直接启动，然后再按需编译依赖文件
- ES Module支持
  - 通过使用`export和import`语法，ES Module允许在浏览器端导入和导出模块
- 底层语言差异
  - webpack 是基于node构建的，而vite是基于esbuild进行预构建依赖
  - 预构建依赖通常指的是在项目启动或构建之前，对项目中所需的依赖项进行预先的处理或构建。这样做的好处在于，当项目实际运行时，可以直接使用这些已经预构建好的依赖，而无需再进行实时的编译或构建，从而提高了应用程序的运行速度和效率
- 热更新处理
  - 在 Webpack 中，当一个模块或其依赖的模块内容改变时，需要重新编译这些模块
  - 在 Vite 中，当某个模块内容改变时，只需要让浏览器重新请求该模块即可，这大大减少了热更新的时间

对比 webpack，vite 缺点

- 首屏加载
  - 没有对文件进行 bundle 操作，会导致大量的 http 请求
  - dev 服务运行期间会对源文件做转换操作，需要时间
  - Vite 需要把 webpack dev 启动完成的工作，移接到了 dev 响应浏览器的过程中，时间加长
- 懒加载
  - 和首屏加载一样，动态加载的文件需要对源文件进行转换操作
  - 还可能会有大量的 http 请求，懒加载的性能同样会受到影响

优点

- 更快的冷启动
- 更快的热更新

### vite 插件 常见的 hook 有哪些

hook: 即钩子。Vite 会在生命周期的不同阶段中去调用不同的插件以达到不同的目的

- config 可用于修改 vite config，用户可以通过这个 hook 修改 config；例如 vite-aliases 这个插件可以帮助我们自动生成别名。它利用的就是这个钩子
- configResolved 在解析 Vite 配置后调用，用于获取解析完毕的 config，在这个 hook 中不建议修改 config
- configServer 用于给 dev-server 添加自定义 middleware
- configurePreviewServer 与 configureServer 相同但是作为预览服务器
- transformIndexHtml 注入变量，用来转换 HTML 的内容。vite-plugin-html 插件可以帮助我们在html里注入变量，就是利用这个钩子
- handleHotUpdate
