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

设置根元素fon-size

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
