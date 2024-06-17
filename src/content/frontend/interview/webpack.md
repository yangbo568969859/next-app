---
title: Webpack
description: webpack知识体系、流程、配置及参数
date: 2022-08-11
---

# Webpack

知识体系

- 配置相关
  - Loader
  - Plugin
  - Webpack 性能优化
- 原理相关
  - Webpack 核心库 Tapable
  - Webpack 调试和构建
  - Webpack 热更新(HMR)原理
  - tree-shaking
  - Babel
- 其它
  - Rollup
  - Vite

## 流程

初始化阶段

- 初始化参数：从配置文件、配置对象、Shell 中读取参数，与默认配置参数合并得到最终参数
- 创建编译器对象：用上一步得到的参数创建 Cpmpiler 对象
- 初始化编译环境：包括注入内置插件、注册各种模块工厂、初始化RuleSet 集合、加载配置的插件等
  - RuleSet 是 Webpack 内部的一个规则集合,它定义了如何处理不同类型的模块文件。每个规则包含了一个或多个条件,用于匹配模块文件,以及一组应用于匹配到的模块的加载器 (Loaders) 和选项
- 开始编译：执行 Complier 的 run 方法
- 确定入口：根据配置中的 entry 找出所有文件的入口，调用 Compilation.addEntry 将入口文件转换为 dependence 对象

构建阶段

- 编译模块(make)：根据 entry 对应的 dependence 创建 module 对象，调用 loader 将模块转译为标准 js 内容，调用 js 解释器将内容转换为 AST 对象，从中找出该模块的依赖模块，再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
- 完成模块编译：上一步递归处理所能触达到的模块后，得到了每个模块被编译后的内容以及他们之间的依赖关系图

生成阶段

- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 chunk，再把每个 chunk 转换成一个单独的文件加入到输出列表，这一步是可以修改输出文件内容的最后一步
- 写入文件系统：在确定好输出内容后，根据配置确定输出路径和文件名，把文件内容写入到文件系统中

## 初始化一个基本配置的 webpack 需要的 package 及分类

### webpack

本质上，webpack是一个现代Javascript应用程序的静态模块打包器(module bundler)。当webpack处理应用程序时，他会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要地每个模块，然后将所有这些模块打包成一个或多个bundle

- webpack 模块打包器。它的主要目的是捆绑 JavaScript 文件以在浏览器中使用，但它也能够转换、捆绑或打包几乎任何资源或资产
- webpack-cli 命令行界面
- webpack-dev-server 将 webpack 与提供实时重新加载的开发服务器结合使用。这应该仅用于开发(底层使用的 webpack-dev-middleware)
- webpack-merge 合并多个 webpack 配置对象，提供了一个函数，可以将两个或多个配置对象合并成一个
- cross-env 跨平台运行设置和使用环境变量的脚本

### babel

- @babel/core 将 ES6+ 转译为向后兼容的 JavaScript
- @babel/plugin-proposal-class-properties 直接在类上使用属性（Babel 配置示例）

```js
class MyClass {
  myProps = 42; // 类中直接定义实例属性和静态属性，而不需要在构造函数中使用 this 关键字

  constructor() {
    console.log(this.myProps);
  }
}
```

- @babel/preset-env Babel 预设，它可以根据你的目标环境自动确定你需要的 Babel 插件和 polyfills
- @babel/plugin-proposal-decorators Babel 插件，用于转换装饰器语法。装饰器是一种语法，允许你注解和修改类和属性

```js
function mixin(behaviour) {
  return function(target) {
    Object.assign(target.prototype, behaviour);
  };
}
// 使用装饰器应用mixin
@mixin({ foo: "bar" })
class MyClass {}

let obj = new MyClass();
console.log(obj.foo); // 输出 bar
```

### Loaders

- babel-loader webpack 的加载器，使用 babel 和 webpack 转换 JavaScript 文件
- sass-loader 加载 SCSS 并编译为 CSS
- postcss-loader 使用 PostCSS 处理 CSS(自动添加 CSS3 部分属性的浏览器前缀)
- css-loader 解决 CSS 导入问题
- style-loader 将 CSS 注入 DOM(就是将处理好的 css 通过 style 标签的形式添加到页面上)
- 其它
  - webpack5 之后就不需要使用 url-loader、file-loader 去处理图片和字体等，使用内置的 asset/resource 类型
    - asset/resource 类型的模块会生成一个单独的文件，并导出此文件的 URL。这与 file-loader 的行为类似
    - asset/inline 将资源作为 data URI 内联到 bundle 中，这与 url-loader 的行为类似
    - asset 在文件大小小于指定限制时，将资源作为 data URI 内联，否则作为单独的文件处理。这是 url-loader 和 file-loader 的混合行为

```js
// 图片和字体处理
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 // 50kb
          }
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
        generator: {
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 // 50kb
          }
        }
      }
    ]
  }
};
```

### Plugins

- html-webpack-plugin 从模板生成 HTML 文件
- clean-webpack-plugin 删除/清理构建文件夹
- mini-css-extract-plugin 将 CSS 提取到单独的文件中
- css-minimizer-webpack-plugin 优化并最小化 CSS 资源
- copy-webpack-plugin 将文件复制到构建目录

### 其它

- eslint 跨应用程序强制执行样式指南
- eslint-config-prettier 实施更漂亮的规则
- eslint-import-resolver-webpack 在 webpack 中抛出导入/导出异常

## 配置及参数

- entry 入口，指定应用程序的入口文件,可以是单个文件或多个文件
- output 输出，指定打包后的文件输出位置和文件名
- mode 模式，指定打包模式,可以是 development、production 或 none
- module Loaders，用于处理不同类型的文件,如 JavaScript、CSS、图片等。
- plugin 插件: 用于扩展 Webpack 的功能,如优化、资源管理等
- devServer 提供了一个开发服务器,用于实时重新加载和热模块替换
- resolve 解析，配置模块解析的规则,如文件扩展名、别名等
- optimization 代码拆分、压缩
- externals 外部依赖（指定哪些模块应该作为外部依赖,不被打包到输出文件中）
- Performance 配置性能相关的选项,如资源大小限制、性能提示等
- watch 监视，启用监视模式,当文件发生变化时自动重新编译
- cache 配置缓存选项,以提高构建性能
- Source Maps 源映射，生成源映射文件,以便在调试时定位原始代码
- Environment Variables 环境变量 使用 webpack.DefinePlugin 插件定义环境变量
- Multi-Page Application 多页面应用，配置多个入口点和输出文件,以支持多页面应用

### hash

例如 filename: "[name][hash:8][ext]"

- hash：任何一个文件改动，整个项目的构建 hash 值都会改变
- chunkhash：文件的改动只会影响其所在 chunk 的 hash 值
- contenthash：每个文件都有单独的 hash，文件的改动只会影响自身的 hash 值

## Loader

loader 本质上就是一个函数，这个函数会在我们在我们加载一些文件时执行；
在 webpack 的定义中，loader 导出一个函数，loader 会在转换源模块(resource)的时候调用该函数。这个函数中，我们可以通过传入 this 上下文给 Loader API 来使用他们

设计原则

- 单一职责 一个 Loader 只做一件事情，维护简单，还能让 loader 以不同的组合方式串联使用
- 链式组合
- 模块化 保证 loader 是模块化的。loader 生成模块需要遵循和普通模块一样的设计原则
- 无状态 在多次模块的转化之间，我们不应该在 loader 中保留状态

```js
module.exports = function(source) {
  console.log("source>>>>", source);
  return source;
};
```

## Plugin

Plugin它是一个插件，用于增强webpack功能，webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果
plugin 通常是在 webpack 打包的某个时间节点做一些操作，一般使用 new Plugin() 的形式使用

```js
class DemoPlugin {
  constructor() {
    console.log("plugin init");
  }
  apply(compiler) {
    // 一个新的编译(compilation)创建之后（同步）
    // compilation代表每一次执行打包，独立的编译
    compiler.hooks.compile.tap("DemoWebpackPlugin", compilation => {
      console.log(compilation);
    });
    // 生成资源到 output 目录之前（异步）
    compiler.hooks.emit.tapAsync("DemoWebpackPlugin", (compilation, fn) => {
      console.log(compilation);
      compilation.assets["index.md"] = {
        // 文件内容
        source: function() {
          return "this is a demo for plugin";
        },
        // 文件尺寸
        size: function() {
          return 25;
        }
      };
      fn();
    });
    // 第二种写法(promise)
    compiler.hooks.emit.tapPromise("DemoWebpackPlugin", compilation => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }).then(() => {
        console.log(compilation.assets);
        compilation.assets["index.md"] = {
          // 文件内容
          source: function() {
            return "this is a demo for plugin";
          },
          // 文件尺寸
          size: function() {
            return 25;
          }
        };
      });
    });

    // 第三种写法(async await)
    compiler.hooks.emit.tapPromise("DemoWebpackPlugin", async compilation => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      console.log(compilation.assets);
      compilation.assets["index.md"] = {
        // 文件内容
        source: function() {
          return "this is a demo for plugin";
        },
        // 文件尺寸
        size: function() {
          return 25;
        }
      };
    });
  }
}
module.exports = DemoPlugin();
```

## SourceMap

SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置

```js
module.exports = {
  //...
  devtool: "source-map" // 使用完整的 SourceMap
};
```

- eval 每个模块都使用 eval() 执行，并且都有 //@ sourceURL。这是最快的配置，但它不能帮助你找到列信息，也不能很好地处理源代码内容
  - 生成代码通过 eval 执行
  - 无法定位到错误位置，只能定位到某个文件
  - 源代码位置通过 @sourceURL 注明
  - 不用生成 SourceMap 文件，打包速度快
- eval-source-map
  - 生成代码通过 eval 执行
  - 包含 dataUrl 形式的 SourceMap 文件
  - 可以在编译后的代码中定位到错误所在行列信息
  - 生成 dataUrl 形式的 SourceMap，打包速度慢
- source-map
  - 生成了对应的 SourceMap 文件，打包速度慢
  - 在源代码中定位到错误所在行列信息
- cheap-source-map 生成一个不包含列信息的 SourceMap，同时 loader 的 SourceMap 也被简化为只包含对应的行
- inline-source-map 生成完整的 SourceMap，并且将 SourceMap 作为 DataUrl 嵌入到 bundle 中
  - 通过 dataUrl 的形式引入 SourceMap 文件
  - 余下和 source-map 模式一样
- cheap-module-source-map 和 'cheap-source-map' 类似，但是会生成完整的 SourceMap，包括 loader 的 sourcemap
- inline-cheap-source-map
- eval-cheap-module-source-map
  - 生成代码通过 eval 执行
  - 包含 dataUrl 形式的 SourceMap 文件
  - 可以在编译后的代码中定位到错误所在行信息
  - 不需要定位列信息，打包速度较快
  - 在源代码中定位到错误所在行信息
- inline-cheap-module-source-map
- hidden-source-map 生成完整的 SourceMap，但不会在 bundle 中添加引用注释
- nosources-source-map 生成完整的 SourceMap，但不包含源代码内容
  - 能看到错误出现的位置
  - 但是没有办法现实对应的源码

推荐

- 本地开发： eval-cheap-module-source-map
- 生产环境：none

## Webpack 性能优化

- 优化 resolve 配置
  - alias 创建 import 或 require 的别名，可以让你更方便地引入模块
  - extensions 自动解析确定的扩展名，使你在引入模块时可以不带扩展名(高频文件后缀名放前面；手动配置后，默认配置会被覆盖; 如果想保留默认配置，可以用 ... 扩展运算符代表默认配置)
  - modules 告诉 webpack 解析模块时应该搜索的目录
  - resolveLoader 决定了 webpack 如何去查找 loader（加载器）。resolveLoader 的配置和 resolve 配置非常相似，但 resolveLoader 是专门用来配置 loader 解析的
  - symlinks 如果项目不使用 symlinks（例如 npm link 或者 yarn link），可以设置 resolve.symlinks: false，减少解析工作量
- externals 从输出的 bundle 中排除依赖
- 缩小范围（loader）
  - include 符合条件的模块进行解析
  - exclude 排除符合条件的模块，不解析
- npParse
  - noParse 选项可以让 webpack 忽略对部分没有采用模块化的文件的递归解析和处理，这样做可以使得构建速度更快
  - 不需要解析依赖的第三方大型类库
  - 使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法
- IgnorePlugin 可以排除某些特定的模块，使 Webpack 不把这些指定的模块打包进来
- 多进程配置
- optimization 配置
  - splitChunks 可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到新生成的 chunk
  - runtimeChunk Webpack 会为每个入口添加一个只包含 runtime 的额外 chunk。这可以优化长期缓存
- 缓存
- 减小打包体积
  - webpack5 自带 terser-webpack-plugin， 默认开启了 parallel: true 配置

```js
module.exports = {
  // noParse
  module: {
    noParse: /jquery|lodash/,
    rules: []
  },
  // resolve
  resolve: {
    modules: [paths.src, "node_modules"], // webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
    extensions: [".js", ".jsx", ".json"],
    // extensions: ['.ts', '...'],
    symlinks: false,
    alias: {
      "@": paths.src,
      assets: paths.public
    },
    resolveLoader: {
      modules: ["node_modules", resolve("loader")], // 搜索目录
      alias: {
        "my-loader": path.resolve(__dirname, "loaders/my-loader.js") // 创建别名
      },
      extensions: [".js", ".json"] // 自动解析扩展名
    }
  },
  optimization: {
    runtimeChunk: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: 4,
      }),
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        }
      })
    ]
  },
  splitChunks: {
    // include all types of chunks
    chunks: 'all',
    // 重复打包问题
    cacheGroups:{
      vendors:{ // node_modules里的代码
        test: /[\\/]node_modules[\\/]/,
        chunks: "all",
        // name: 'vendors', 一定不要定义固定的name 切记不要为 cacheGroups 定义固定的 name，因为 cacheGroups.name 指定字符串或始终返回相同字符串的函数时，会将所有常见模块和 vendor 合并为一个 chunk。这会导致更大的初始下载量并减慢页面加载速度
        priority: 10, // 优先级
        enforce: true 
      }
    }
  }
};
```

## 原理

[热更新原理](../webpack/hotModuleReplacement.md)

[Tapable](../webpack/tapable.md)

### 热更新原理简单说明

HRM的原理实际上是 webpack-dev-server（WDS）和浏览器之间维护了一个websocket服务。当本地资源发生变化后，webpack会先将打包生成新的模块代码放入内存中，然后WDS向浏览器推送更新，并附带上构建时的hash，让客户端和上一次资源进行对比
