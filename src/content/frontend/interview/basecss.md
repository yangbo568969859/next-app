---
title: CSS基础
description: 盒模型、BFC、层叠上下文、布局等
date: 2020-08-11
---

# 基础CSS

## 盒模型

页面渲染时，dom元素所采用的布局模型。可通过box sizing及进行设置

- content-box w3c标准盒模型
- border-box IE盒模型

## BFC(Block formatting context)

块级格式上下文，是一个独立的区域，让处于BFC内部的元素与外部的元素相互隔离，使内外元素定位不会发生相互影响

触发条件

- 根元素
- position: absolute/fixed
- display: inline-block/table
- float值不为none 元素
- overflow的值不为visible

规则

- 属于同一个BFC的两个相邻box垂直排列
- 属于同一个BFC的两个相邻box的margin会发生重叠
- BFC中子元素的marginbox的左边，与包含块 (BFC) border box的左边相接触 (子元素 absolute 除外)
- BFC 的区域不会与 float 的元素区域重叠
- 计算 BFC 的高度时，浮动子元素也参与计算
- 文字层不会被浮动层覆盖，环绕于周围

应用

- 阻止margin重叠
- 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个div都位于同一个 BFC 区域之中)
- 自适应两栏布局
- 可以阻止元素被浮动元素覆盖

```css
.container {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
  background-color: #f1f1f1;
  padding: 20px;
}
.right {
  overflow: hidden;
  background-color: #e9e9e9;
  padding: 20px;
}
```

## 实现三栏布局

圣杯布局（三列自适应，左右定宽，中间自适应）

```html
<body>
  <div class="box">
    <div class="center"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>
<style>
  .box {
    padding: 0 200px 0 200px;
  }
  .center, .left, .right {
    height: 500px;
    float: left;
    position: relative;
  }
  .center {
    width: 100%;
  }
  .left {
    width: 200px;
    left: -200px;
    margin-left: -100%;
  }
  .right {
    width: 200px;
    right: -200px;
    margin-right: -200px;
  }
</style>
```

## 层叠上下文

元素提升为一个比较特殊的图层，在三维空间中(Z轴)高出普通元素一等

触发条件

- 根层叠上下文
- position不为static并且设置了z-index属性
- css3属性 flex|transform|opacity|filter|will-change|-wibkit-oerflow-scrolling
  - opacity值不是1
  - trasnform值不是none
  - filter值不为none
  - will-change指定的属性值为上面任意一个

层叠等级：层叠上下文在z轴上的排序

- 在同一层叠上下文，层叠等级才有意义
- z-index优先级最高

[层叠等级](../image/z-index.png)

## 居中布局

- 水平居中
  - 行内元素 text-align: center
  - 块级元素 margin: 0 auto
  - absolute + transform
  - flex + justify-content: center;
- 垂直居中
  - line-height: height;
  - absolute + transform
  - flex + align-items: center
  - table
- 水平垂直居中
  - absolute + transform
  - flex + justify-content + align-items

```html
<style>
  .box {
      width: 400px;
      height: 400px;
      background: #fcc;
      position: relative;
  }
  /* position + 负margin */
  .horizontal-center-negmargin {
      position: absolute;
      width: 100px;
      height: 50px;
      left: 50%;
      margin-left: -50px;
      background: red;
  }
  /* position + transform */
  .horizontal-center-marginauto {
      position: absolute;
      width: 100px;
      height: 50px;
      left: 0;
      right: 0;
      margin: auto;
      background: red;
  }
  /* position + margin auto */
  .horizontal-center-transform {
    position: absolute;
    left: 50%;
    transform: translate(0, -50%);
    background: red;
  }

</style>
<div class="box">
  <div class="horizontal-center">1111</div>
</div>
```

## link 与 @import 的区别

- link 可以定义RSS，定义Rel等，而@import只能用于加载css
- 当解析到link时，页面会同步加载所引入的css，而@import所引用的css会等页面加载完才被加载
- link 可以使用js动态引入，@import不可以

## css 缩写

- transition
  - transition-property 属性
  - transition-duration 间隔
  - transition-timing-function 曲线
  - transition-delay 延迟
- animation
  - animation-name: 动画名称
  - animation-duration: 间隔
  - animation-timing-function: 曲线
  - animation-delay: 延迟
  - animation-iteration-count: 次数
  - animation-direction: 方向
  - animation-fill-mode: 静止模式
    - forwards 停止时，保留最后一帧
    - backwards 停止时，回到第一帧
    - both 同时运用 forwards / backwards

## 单行文本省略和多行文本省略

```css
.line {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## flex 实现九宫格

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
  width: 300px; /* 或者你想要的任何宽度 */
}

.flex-item {
  flex: 0 0 33.333%; /* 每个子项占据1/3的宽度 */
  box-sizing: border-box;
  padding: 10px; /* 根据需要添加内边距 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* 添加阴影以便更好的视觉效果 */
  text-align: center;
}
```

## 自适应布局

### rem

rem是相对根元素font-size的单位。为了简化编写rem单位，可以使用postcss插件进行转化

安装postcss插件

```shell
npm install postcss postcss-pxtorem autoprefixer -D
```

创建postcss.config.js文件

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16, // 表示1rem等于多少px，这里设置为16px
      propList: ['*', '!font-size'] // propList，表示需要转化哪些属性。这里设置为*，表示所有属性都需要转化， 同时!font-size表示不转化font-size属性
    }
  }
};
```

设置根元素font-size

假设设计稿的宽度是1242px，那么根元素font-size的值为：屏幕宽度 * 16 / 1242

- 通过css设置根元素字体大小(推荐):

```css
/* 1242下，1rem = 16px */
html {
    font-size: calc(100vw * 16 / 1242);
}
```

- 通过js设置

```js
function setFontSize() {
  // 获取屏幕宽度
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // 根据屏幕宽度和设计稿的尺寸比例计算字体大小
  var fontSize = screenWidth / 10; // 假设设计稿宽度为10rem

  // 设置HTML元素的字体大小
  document.documentElement.style.fontSize = fontSize + 'px';
}

setFontSize();
window.addEventListener('resize', setFontSize);
```

### vw

### tailwindcss

使用 Tailwind CSS 可以轻松实现自适应布局，Tailwind CSS提供了一组响应式工具类，可以根据不同的屏幕尺寸应用不同的样式

主要思路

- 设置响应式断点
  - Tailwind CSS 默认提供了五个响应式断点：sm(640px)、md(768px)、lg(1024px)、xl(1280px)和2xl(1536px)
  - 在 tailwind.config.js 文件中，可以自定义响应式断点
- 使用响应式工具类
  - Tailwind CSS 的响应式工具类允许你根据不同的屏幕尺寸应用不同的样式，这些工具类以断点前缀开头，后跟样式类名
    - 例如：sm:text-lg 表示在sm断点及以上应用text-lg样式
    - 例如：md:flex 表示在md断点及以上应用flex样式
- 使用flexbox或grid布局
  - Tailwind CSS 提供了flexbox和grid布局，可以轻松创建自适应的布局结构
  - 对于 flexbox，可以使用flex、flex-col、flex-wrap等工具类
  - 对于 grid，grid、grid-cols-*、grid-rows-*、gap-* 等工具类
- 利用margin和padding工具类
  - Tailwind CSS 提供了丰富的 Margin 和 Padding 工具类，可以控制元素的间距和内边距
  - 使用 m-*、my-*、mx-*、mt-*、mb-*、ml-*、mr-*、p-*、py-*、px-*、pt-*、pb-*、pl-*、pr-* 等工具类来调整元素的间距
- 使用响应式显示和隐藏工具类
  - Tailwind CSS 提供了响应式显示和隐藏工具类，可以根据屏幕尺寸控制元素的可见性
  - 使用 hidden、block、inline-block、flex、inline-flex、sm:hidden、md:block 等工具类来控制元素的显示和隐藏

```xml
<div class="container mx-auto">
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <!-- 内容区域 1 -->
    </div>
    <div class="w-full md:w-1/2 lg:w-1/3 p-4">
      <!-- 内容区域 2 -->
    </div>
    <div class="w-full lg:w-1/3 p-4">
      <!-- 内容区域 3 -->
    </div>
  </div>
</div>
```


