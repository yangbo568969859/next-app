---
title: tailwindcss：原子化 CSS 框架
description: 快速掌握 tailwindcss，基本使用介绍
date: 2023-03-14
---

# tailwindcss

## 初始化tailwindcss

```shell
npm install -D tailwindcss
npx tailwindcss init
```

上述命令执行完毕后会在根目录生成一个tailwind.config.js文件，该文件配置了tailwindcss的基本使用。

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在入口的css加上以下三行代码：分别是引入 tailwind 的基础样式、组件样式、工具样式的

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

之后就可以在组件里用 tailwind 提供的 class 了

```js
import './index.css'

function App() {
  return (
    <div className="text-base p-1 border border-black border-solid"></div>
  )
}

export default App;
```

## tailwind.config.js 配置

比如我们使用 p-1 这个 class，默认编译后的结果是 padding: 0.25rem; 如果你需要自己定义，可以在tailwind.config.js中配置

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      padding: {
        1: '30px'
      }
    },
  },
  plugins: [],
}
```

配置完后，p-1就会重新编译成 padding: 30px; 这样的结果

text-base 是font-size、line-height 两个样式，这种通过数组配置

```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      padding: {
        1: '30px'
      },
      fontSize: {
        'base': ['30px', '2rem']
      }
    },
  },
  plugins: [],
}
```

以上两种方式都是全局更改，有时候想要临时设置一些值，可以使用 [] 语法

- 比如 text-[14px]，它就会生成 font-size:14px 的样式
- 比如 aspect-[4/3] ，它就会生成 aspect-ratio:4/3 的样式
- hover类型写法 hover:text-[16px]

## 响应式

写响应式的页面的时候，我们要指定什么宽度的时候用什么样式，我们可以使用默认提供的断点实现(断点的含义是 大于等于，即min-width)

- 比如： md:bg-blue-500 表示在默认配置md屏幕宽度下，背景色为蓝色

自定义配置断点值

```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      padding: {
        1: '30px'
      },
      fontSize: {
        'base': ['30px', '2rem']
      }
    },
    screens: {
      'md': '300px'
    }
  },
  plugins: [],
}
```

高级用法：你甚至可以结合任意值语法，实现各种变态的响应式需求，如

```html
<!-- 下面的这个盒子，让它在1300px以下（包含1300px）屏幕下显示绿色，以上显示蓝色 -->
<div class="w-12 h-12 max-[1300px]:bg-green-500 bg-blue-500"></div>
```

## 样式实现方式(React中)

- 使用className
- @layer：@layer 可以将样式层级分组，在不同的层级中可以使用相同的类名
- @apply：@apply 可以将类名应用到一个元素上，它会将该元素的所有样式都应用到该元素上

注意：尽管使用@apply语法可以解决样式复用的问题，但并不推荐在早期就进行抽象，因为自定义class的做法会生成更多的样式代码，造成生成的css文件变得更大

```js
import './index.css'
function App() {
  return (
    <div className="text-base p-1 border border-black border-solid custom-div">
      <span className="inline-block h-12 w-12 rounded-full ring-2 ring-white"></span>
      <span className="inline-block h-12 w-12 rounded-full ring-2 ring-white"></span>
      <span className="inline-block h-12 w-12 rounded-full ring-2 ring-white"></span>
    </div>
  )
}

export default App;
```

可以看出上面写了重复的冗余代码，这时候我们可以借助 @apply 来实现

```css
.custom-div .custom-img {
  @apply inline-block h-12 w-12 rounded-full ring-2 ring-white;
}
```

```js
import './index.css'
function App() {
  return (
    <div className="text-base p-1 border border-black border-solid custom-div">
      <span className="custom-img"></span>
      <span className="custom-img"></span>
      <span className="custom-img"></span>
    </div>
  )
}

export default App;
```

## 内置 class 不能满足我的需求

@layer 和 @apply 就能扩展内置原子 class；但如果你想跨项目使用，可以开发个tailwind插件

```js
// custom.plugin.js
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
  addUtilities({
    '.custom': {
      background: 'blue',
      color: 'yellow'
    },
    '.customFont': {
      'font-size': '70px'
    }
  })
})
```

在tailwind.config.js中引入

```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {},
  plugins: [
    require('./custom.plugin')
  ],
}
```

## 自定义样式中使用Tailwind的变量

比如我们有一个自定义样式，想要使用Tailwind配置中的 red-200 颜色，如何做呢

```css
.custom {
  color: ?;
}
```

因为Tailwind本身是一个postcss插件，所以任何有关TailwindCSS的配置信息都可以通过css的方式拿到

```css
.custom {
  color: theme('colors.red.200');
}
```

## 冲突解决

比如项目中本来有个border的class，而tailwind也有，如何解决：可以通过加prefix来解决，不过这样所有的原子 class 都得加 prefix 了

```js
module.exports = {
  prefix: 'custom-',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {},
  plugins: [
    require('./custom.plugin')
  ],
}
```

```html
<div class='custom-m-1'></div>
```

## 重写/覆盖Tailwind配置

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      textColor: {
        primary: '#1D2129',
        regular: '#4E5969',
        secondary: '#86909C',
        disabled: '#C9CDD4',
      }
    },
  },
  // ...
}
```

```html
<div>
  <span class="text-primary">主色</span>
  <span class="text-regular">常规色</span>
  <span class="text-secondary">次要色</span>
  <span class="text-disabled">禁用色</span>
</div>
```

## 如果想继续使用 嵌套语法

TailwindCSS封装了[postcss-nested](https://www.npmjs.com/package/postcss-nested)与[postcss-nesting](https://www.npmjs.com/package/postcss-nesting)插件，抛出了一个新的postcss插件，你只需要在postcss.config.js文件中加入以下代码，即可在css文件中使用嵌套语法了

```js
module.exports = {
  plugins: {
    'tailwindcss/nesting': {}, // [!code focus]
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 原理分析

tailwindcss 是通过 postcss 来实现的，postcss 会将 css 文件转换成浏览器可以识别的 css，然后再去执行一些插件。

postcss 是一个 css 编译器，它是 parse、transform、generate 的流程

postcss 就是通过 AST 来拿到 @tailwind、@layer、@apply 这些它扩展的指令，分别作相应的处理，也就是对 AST 的增删改查

如何扫描到 js、html 中的 className 的呢：这是因为他有个extractor，用来通过正则匹配文本中的class，之后添加到AST中，最终生成代码

tailwind 就是基于 postcss 的 AST 实现的 css 代码生成工具，并且做了通过 extractor 提取 js、html 中 class 的功能

## vscode 插件推荐

- Tailwind CSS IntelliSense 智能提示样式名，以及展示编译后的样式代码
