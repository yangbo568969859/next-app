---
title: 前端优化之-图片优化
description: 网络图片优化
date: 2022-08-05
---

# 图片优化

## 针对 nos 网络图片体积优化

- 基于 nos 支持 webp 格式图片的功能，可以利用该功能优化前台或后台项目中展示给用户的图片

### webp

WebP 是由 Google 开发的一种新的图片格式，它支持有损压缩、无损压缩和透明度，压缩后的文件大小比 JPEG、PNG 等都要小

- 项目中大量使用了图片，图片资源的优化成为必不可少的异步，虽然有的项目可能用到图片懒加载技术，对性能方面有一定的提升，但是提升有限，调研并测试 webp 格式图片兼容性和性能之后，觉得在项目中可以使用该技术
- 使用 webp 格式图片后，除了可以带来网页加载速度，还能减少带宽
- 兼容性
  - webp 的兼容性现在来说大部分已经普及，虽然已经普及，兼容性还是要考虑

### 解决方案

- 解决方案一 针对客户端的 vue

  - 使用 canvas 的 toDataURL 进行判断

  ```javascript
  // 是否支持webp格式图片
  export const isSupportWebp = () => {
    try {
      return (
        document
          .createElement("canvas")
          .toDataURL("image/webp", 0.5)
          .indexOf("data:image/webp") === 0
      );
    } catch (err) {
      return false;
    }
  };
  ```

  - 通过加载一张 webp 图片进行判断

  ```javascript
  // 先加载一个WebP图片，如果能获取到图片的宽度和高度，就说明是支持WebP的，反之则不支持
  function check_webp_feature(feature, callback) {
    const kTestImages = {
      lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", // 有损
      lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", // 无损
      alpha:
        "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==", // 透明
      animation:
        "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA" // 动图
    };
    const img = new Image();
    img.onload = function() {
      const result = img.width > 0 && img.height > 0;
      callback(feature, result);
    };
    img.onerror = function() {
      callback(feature, false);
    };
    img.src = `data:image/webp;base64,${kTestImages[feature]}`;
  }

  function check_webp_feature2(nature = "lossy") {
    const hash = new Map([
      ["lossy", "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"], // 有损
      ["lossless", "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="], // 无损
      [
        "alpha",
        "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=="
      ], // 透明
      [
        "animation",
        "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
      ] // 动图
    ]);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        const result = img.width > 0 && img.height > 0;
        resolve(result);
      };
      img.onerror = function() {
        reject(false);
      };
      img.src = `data:image/webp;base64,${hash.get(nature)}`;
    });
  }
  check_webp_feature2()
    .then(result => {
      console.log("支持webp", result);
    })
    .catch(err => {
      console.log("不支持webp", err);
    });
  ```

```vue
<template>
  <img
    :class="className"
    :src="rimg"
    :srcset="rimg2x ? `${rimg} 1x,${rimg2x} 2x` : ''"
  />
</template>

<script>
import { realImageUrl } from "@/utils/utils";
export default {
  props: {
    img: {
      type: String,
      default: ""
    },
    img2x: {
      type: String,
      default: ""
    },
    className: {
      type: [String, Array],
      default: ""
    }
  },
  computed: {
    rimg() {
      return realImageUrl(this.img, this.$store.state.isSupportWebp);
    },
    rimg2x() {
      return realImageUrl(this.img2x, this.$store.state.isSupportWebp);
    }
  }
};
</script>
```

- 解决方案二 针对服务端渲染的 nuxt

  - 主要利用 nuxt 的中间件（middleware）功能，在路由中间件层根据浏览器发来的 html 请求的 header 中的 accept 参数来判断浏览器是否支持 image/webp；在 middleware 文件夹下新建一个文件，主要是提供全局变量

  ```js
  // nuxt.config.js
  module.exports = {
    router: {
      middleware: ["supportWebp"]
    }
  };
  ```

  ```js
  // middleware/supportWebp.js
  // 主要是根据html请求头部的accept来判断是否有image/webp存在，存在则说明请求的浏览器支持webp格式图片
  // 除了根据上面一条规则外，还加了一个兜底判断规则，是根据请求头的user-agent来判断是什么机型，这块主要是对ios14以下的版本做了判断，主要是根据mdn上各大浏览器对webp的支持版本
  // 将是否支持webp的变量存储到store中，项目中可以直接使用
  export default function({ store, userAgent, req }) {
    if (process.server) {
      // 判断是否是在服务端
      userAgent = process.server
        ? req.headers["user-agent"]
        : navigator.userAgent;
      const ua = userAgent.toLowerCase();
      let isSupportWebp = false;
      if (
        req.headers.accept &&
        req.headers.accept.split(",").indexOf("image/webp") > -1
      ) {
        isSupportWebp = true;
        store.commit("updateIsSupportWebp", isSupportWebp);
        return;
      }
      const isAndroid = ua.indexOf("android") > -1 || ua.indexOf("adr") > -1;
      const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
      if (isIOS) {
        const iosVer = ua.match(/cpu iphone os (.*?) like mac os/)[1];
        if (iosVer && iosVer.split("_")[0] >= 14) {
          isSupportWebp = true;
        }
      }
      if (isAndroid) {
        isSupportWebp = true;
      }
      store.commit("updateIsSupportWebp", isSupportWebp);
    }
  }
  ```

- 如果支持 webp 格式，对项目中的图片做了组件封装，封装了一个图片组件，在其组件 computed 中根据 store 存储的是否支持 webp 变量来对图片 url 做处理，根据 nos 提供的文档在 url 拼接参数 type=webp
- 易千面中已经接入 webp 格式图片的技术，分别测试了 Google，firefox，Edge，Safari，IE11 版本浏览器，图片均能正常显示，在支持 webp 的浏览器中性能提示 30%以上
