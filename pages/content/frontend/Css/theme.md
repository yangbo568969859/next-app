# 主题更改

## 纯js主题色更改

```css
:root {
  --red: #f10000;
  --warn: #fa0;
  --primary: #3360ff;
  --bg-reg: #f0f3f4;
  --bg-canvas: #eceff4;
  --border-primary: #e7e8e9;
}

html[data-theme=dark] {
  --primary: #f10000;
}
```

```js
const rootHtml = document.querySelector('html')
if (rootHtml.getAttribute('data-theme') && rootHtml.getAttribute('data-theme') === 'dark') {
  document.querySelector('html').setAttribute('data-theme', 'light')
} else {
  document.querySelector('html').setAttribute('data-theme', 'dark')
}
```

## nextjs

借助第三方插件 [next-themes](https://github.com/pacocoursey/next-themes) 实现主题切换
