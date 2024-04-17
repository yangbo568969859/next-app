# 结合腾讯云 serverless 和 nuxt 发布一个简单线上博客

## 涵盖功能

- serverless 部署 nuxt 服务
- nuxt 项目
  - PWA （渐进式 Web 应用程序）旨在使用现有的 Web 技术提供用户更优的使用体验。
  - Nuxt 颜色模式切换 自动根据系统颜色模式完成网页的颜色模式切换
  - SSR

### serverless 部署 nuxt 服务

登录腾讯云后台，找到 Serverless 应用中心，新建应用，选择 nuxt 模板创建成功之后，在函数管理控制台下载代码或者直接在函数代码开发（建议下载到本地开发）;腾讯云会自动在 nuxt 模板里面生成 serverless.yml；后面可以自己按需求配置；关于 SECRET_ID，SECRET_KEY 的相关东西也会在 env 中保存

在本地代码开发完之后全局安装 serverless

```shell
npm install -g serverless
```

在 serverless.yml 文件所在的项目根目录，运行以下指令，将会弹出二维码，直接扫码授权进行部署

```shell
serverless deploy
```

关于 serverless 的发布流程就这些，当然在 serverless 后台也可以配置自己的域名；serverless 的缺点就是冷启动速度，第一次访问的时候冷启动时间较长，当然这个跟 serverless 的特性相关

### 渐进式 Web 应用程序

1. 安装@nuxtjs/pwa
2. 配置 pwa； pwa 默认所需图标是 static/icon.png, 若修改了文件位置或命名,如 static/icon2.png,则需要配置 icon
   关于 icon 配置 @nuxtjs/pwa 插件会自动根据 static/icon.png 生成[64, 120, 144, 152, 192, 384, 512]大小的图片
   manifest 是支持站点在主屏上创建图标的技术方案，并且定制 PWA 的启动画面的图标和颜色等，如下图

```javascript
// nuxt.config.js 配置
export default {
  // ...head
  buildModules: ["@nuxtjs/pwa"],
  pwa: {
    icon: {
      source: "/icon.png", //路径为static中的icon.png
      fileName: "icon.png"
    },

    manifest: {
      name: "我是名字",
      short_name: "我是名字",
      lang: "zh-CN",
      theme_color: "#fff",
      description: "我是描述"
    }
    // workbox: {        //开发环境取消注释,调试pwa, 打包时注释
    //   dev: true
    // }
  }
};
```

关于 mainfest 最后生成的 json 如下

```json
{
  "name": "我是名字",
  "short_name": "我是名字缩写",
  "description": "描述...",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ffffff",
  "theme_color": "#8a00f9",
  "icons": [
    {
      "src": "images/icons/icon_32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon_512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

mainfest.json 属性

- name — 网页显示给用户的完整名称;
- short_name — 这是为了在没有足够空间显示 Web 应用程序的全名时使用;
- description — 关于网站的详细描述;
- start_url — 网页的初始相对 URL 比如 /）
- display — 应用程序的首选显示模式;
  - fullscreen - 全屏显示;
  - standalone - 应用程序将看起来像一个独立的应用程序;
  - minimal-ui - 应用程序将看起来像一个独立的应用程序，但会有浏览器地址栏;
  - browser - 该应用程序在传统的浏览器标签或新窗口中打开.
- orientation — 应用程序的首选显示方向;
- background_color — 启动屏的背景颜色;
- theme_color — 网站的主题颜色;
- icons — 定义了 src、sizes 和 type 的图片对象数组,各种环境中用作应用程序图标的图像对象数组；

@nuxtjs/pwa 最后会自动在生成的 html 里加上 manifest.json 链接；会自带 hash

```html
<!-- @nuxtjs/pwa会自动在生成的 html 页面中添加以下 link 标签 -->
<link rel="manifest" href="/manifest.json" />
```

### Nuxt 颜色模式切换

1. 安装@nuxtjs/color-mode
2. 配置

```javascript
// nuxt.config.js 配置
export default {
  buildModules: ["@nuxtjs/color-mode"]
};
```

接下来是 css|less|sass 样式的开发，在 nuxt.config.js 的 css 模块引入对应的 css|less|sass 文件

```css
/* 初始化颜色变量 */
:root {
  --color: #243746;
  --color-primary: #158876;
  --color-secondary: #0e2233;
  --bg: #f3f5f4;
  --bg-secondary: #fff;
  --border-color: #ddd;
}
/* dark暗色变量 */
.dark-mode {
  --color: #ebf4f1;
  --color-primary: #41b38a;
  --color-secondary: #fdf9f3;
  --bg: #091a28;
  --bg-secondary: #071521;
  --border-color: #0d2538;
}
/* sepia护眼颜色变量 */
.sepia-mode {
  --color: #433422;
  --color-secondary: #504231;
  --bg: #f1e7d0;
  --bg-secondary: #eae0c9;
  --border-color: #ded0bf;
}
```

```javascript
// 我自己的是在main.less维护颜色变量
export default {
  css: ["@/assets/style/main.less"]
};
```

接下来就是各模块的样式或者全局背景色，主要是根据定义的颜色变量；例如

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: var(--bg);
  color: var(--color);
  transition: background-color 0.3s;
}
a {
  color: var(--color-primary);
}
```

切换颜色模式，主要通过 $colorMode.preference 来控制颜色模式，$colorMode 是@nuxtjs/color-mode 帮我们注册的全局变量，可以在任何组件都可以访问

核心还是通过 html 上的 class 来控制全局变量来实现颜色模式切换

它通过以下方式注入\$colorMode 帮助程序：

- preference：选择了实际的色彩模式（可以是'system'），对其进行更新以更改用户首选的色彩模式
- value：有助于了解何时检测到哪种颜色模式\$colorMode === 'system'，因此您不应该对其进行更新
- unknown：了解在 SSR 或生成期间是否需要渲染一个占位符很有用
- forced：有助于了解当前页面是否强制使用当前颜色模式（用于隐藏颜色选择器）

```vue
<template>
  <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="sepia">Sepia</option>
    </select>
  </div>
</template>

<style>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
```

nuxt 项目地址 [github](https://cli.vuejs.org/config/).
体验地址 [blog](https://service-fcy40h67-1256345838.sh.apigw.tencentcs.com/).
