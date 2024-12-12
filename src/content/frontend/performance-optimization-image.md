---
title: 前端优化之-图片优化
description: 网络图片优化
date: 2022-08-05
---

# 图片优化

## 图片类型和特点

计算机中以矢量图或位图来显示图像

- 矢量图
  - 矢量图用线段和曲线来描述图像，图形也包含了色彩和位置信息，但不记录每一点的信息。进行矢量图形的编辑时，定义的是描述图形的线和曲线的属性，这些属性将被记录下来，对矢量图形的操作，例如改变位置、形状和大小等都不会改变矢量图形的品质。矢量图形在显示或输出图像时，图像的品质不受设备的分辨率的影响
- 位图，也称点阵图
  - 一张位图放大之后，会看到图片是有很多小格子组成的，像栅格一样，每个格由像素组成，每一个像素由二进制表示，每一个像素上的二进制位数越多表示的色彩越丰富。每一个像素上的色彩是固定的。进行位图的操作时，本质是对每一个像素上的信息的定义，它不像矢量图一样定义图像的轮廓线或者直线，所以位图的品质和图像生成时采用的分辨率相关的，这也是为什么位图被放大之后，位图的边缘上会出现很多锯齿的原因

简单来说矢量图可以被无限放大，并且不会失真，而位图则在放大之后会出现失真的情况，但是位图因为在在像素上用二进制表示色彩，所以位图能表现的色彩丰富度会比矢量图多

### 位图文件压缩类型

- 有损压缩
  - 有损压缩是对图像本身的改变，在保存图像时保留了较多的亮度信息，而将色相相似的信息和周围的像素进行合并，合并的比例不同，压缩的比例也不同，由于描述图像的信息减少了，压缩比例可以变得很高，图片的质量也会随之下降
  - 有损压缩可以减少图像在内存和磁盘中所占用的空间，但是同时也会保持颜色的逐渐变化，删除图像中的突然变化，所以在屏幕上观看图像时，图像不会产生较大的外观影响，肉眼比较难以分辨出来，比如绿色的草地，在压缩的时间会围绕绿色的渐变来进行压缩
- 无损压缩
  - 无损压缩是对文件本身的压缩，是对文件的数据存储的方式进行优化，用某种算法表示重复的数据信息，图像可以完全还原，不会影响图像的内容，不会损失图像的任何细节
  - 无损压缩是将相同的颜色信息只保存一次，首先确认图像中哪些区域是相同的，哪些是不同的
  - 总的来说：无损压缩可以删除一些重复的数据，可以减少在磁盘上保存的尺寸，但是并不能减少图像的内存占用量，这是因为，从磁盘上读取图像时，软件又回把丢失的像素用匹配的颜色信息填充进来
 
## 前端需了解的图片格式

前端常见的图片格式有GIF、PNG、JPEG、WEBP和SVG等

- GIF
  - GIF图像是基于颜色列表的，最多支持8位(256色)，不支持半透明，只能是完全透明或者不透明，文件内部分成许多存储块，用来存储多福图像或者决定图像表现行为的控制块，用来实现帧动画和交互式的应用，GIF文件还通过LZW压缩算法无损压缩图像数据来减少图像尺寸
- PNG PNG图片图像是无损压缩的图片格式，不支持动画，与有损压缩相比，压缩之后的体积相对也较大，支持PNG8、PNG24、PNG32三种格式
  - PNG8: 非动画的Logo和图标等保真的小图尽量选择使用PNG8，尽量不选择使用PNG24和PNG32，因为PNG24和PNG32体积比PNG8大，PNG8格式主要是半透明的，支持透明度的调节，同一张图PNG8比GIF的体积是更小的
  - PNG24：如果想要极好的显示效果，并且不在乎文件的体积大小，是可以选择PNG24的，PNG24支持2的24次方种颜色，不支持透明
  - PNG32: 在PNG24的基础上增加了8位的透明信息，支持透明度的调节
- JPEG
  - JPEG适用于亮度和色彩压缩，在照片或者带阴影的图像上效果良好，但是不适用与图标几何图形，截图等图形场景。
  - JPEG图片文件后缀名是.jpg或者.jpeg，是一种有损光栅图像格式，即属于有损压缩，每次压缩保存JPEG时，一些信息会永久丢失
- WEBP
  - WEBP是基于自影像编码格式VP8,非正式发音为weppy，支持有损压缩，以及使用重复数据替换的无损压缩。有损WEBP图像平均比视觉相似压缩级别的JPEG图像体积小25-35%。无损WEBP图像通常比PNG格式的相同图像小26%。
  - WEBP还支持动画：在有损WEBP文件中，图像数据由VP8比特流表示，其中可能包含多个帧。无损WebP保存ANIM描述动画的ANMF块和表示动画序列帧的块。支持循环。
  - WEBP现在在主要网络浏览器(IE除外)的最新版本中得到了广泛的支持，虽然它没有对老版本的浏览器进行支持，兼容性是存在一定问题
- SVG
  - SVG可伸缩、无限放大图片质量不会下降，SVG文件是纯粹的XML，可以被很多文本编辑工具进行读取和修改，图像中的文本是可选的，可以和JavaScript一起进行运行，特别适合做地图，数据可视化，在线条艺术，LOGO和图标等方面都有应用
- AVIF
  - AVIF 是由开放媒体联盟 (AOM) 开发并于 2019 年发布的另一种最新图像格式。该格式基于 AV1 视频编解码器，源自视频帧


### 其他图片格式

- BMP(Bitmap)是Windows操作系统中的标准图像文件格式，支持多种压缩方法，包括有损或无损算法，可分为两类：设备相关位图(DDB)和设备无关位图(DIB)，BMP文件通常是不压缩的，所以一般比同一幅图像的压缩图像文件格式要大很多
- TIFF是一种灵活的位图格式，大部分TIFF文件一般也是未压缩的，但是也支持有损压缩和无损压缩，主要用于存储包括艺术照之类的照片，可以是任何类型的图像。但是TIFF文件往往比其他格式的图像大。这是因为通常包含元数据，以及大多数TIFF图像未压缩或使用压缩算法后仍保留相当大体积的文件的事实
- APNG(Animated Portable Network Graphics)是Mozilla首次引入的一种文件格式，它扩展了PNG标准以添加对动画图像的支持。类似于动画GIF格式，APNG更强大，因为它支持各种颜色深度, 而GIF仅支持8位索引颜色


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
