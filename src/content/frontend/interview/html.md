---
title: html知识基础
description: html语义化等
date: 2022-05-14
---

# html

## 介绍下DOCTYPE以及作用

Doctype 是HTML5的文档声明，通过它可以告诉浏览器，使用哪一个HTML版本标准解析文档

## html 语义化

用正确的标签处理正确的内容，让浏览器和搜索引擎更好地解析页面

- 在没有css文件的情况下可以让页面呈现清晰的结构
- 有利于SEO和搜索引擎建立良好的沟通
- 有利于团队开发和维护，语义化具有可读性，减少差异化

## 什么是严格模式与混杂模式

严格模式：是浏览器支持的最高标准运行，不允许出现一些过时或非标准用法

混杂模式：页面以宽松向下兼容的方式显示，模拟了早期浏览器的行为，浏览器对 HTML 的语法和结构要求相对宽松,允许一些非标准的用法

## 行级元素和块级元素

块级元素(Block-level)：p、div、form、ul、li、ol、table、h1、h2、h3、h4、h5、h6、dl、dt、dd

- 总是在新行上开始，每个块级元素独占一行，默认从上到下排列
- 宽度未设置时，默认是它的容器宽度的100%
- 高度、行高以及外边距内边距都是可以设置的
- 块级元素可以容纳其他行级元素和块级元素

行级元素(Inline)：span、a、img、button、input、select

- 和其它元素都会在一行显示
- 高、行高以及外边距和内边距可以设置
- 宽度就是文字或者图片的宽度，不能改变
- 行级元素只能容纳文本或者其它行内元素

行内元素设置width无效；设置height无效，可以设置line-height；设置margin，padding只有左右有效，上下无效

通过css的display可以改变元素的显示类型

- display:inline 将元素转换为行级元素
- display:block 将元素转换为块级元素
- display:inline-block 将元素设置为行级块元素,具有行级元素和块级元素的特点

## HTML5有哪些新元素和新特性

- 新的语义元素：header、nav、footer、article、section、main
- 新的表单元素和属性：
  - input 新增 type 属性值:date、time、email、url、number、range 等
  - datalist 与 `<input>` 配合使用,提供输入建议
  - output 表示计算结果或用户操作的输出
  - progress
- 多媒体元素：audio、video、source、track(为多媒体元素添加文本轨道,如字幕)
- 图形和绘图：canvas、svg等
- 离线 Web 应用
- Web Workers 允许在后台线程中运行脚本,而不会阻塞用户界面
- Web Sockets 提供了在 Web 应用和服务器之间建立持久连接的能力,实现实时通信
- 历史管理 History API:允许操作浏览器的历史记录,实现无刷新的页面导航

## iframe的作用以及优缺点

优点

- 可以在页面上独立显示一个页面或内容，不会与页面其他元素产生冲突
- 可以方便地在多个页面中复用相同的内容,减少重复编码
- 加载是异步的,页面可以在不等待 iframe 加载完成的情况下进行展示
- 独立性:每个 `iframe` 都有自己独立的 DOM 结构、JavaScript 环境和样式,不会影响主页面

缺点

- 搜索引擎可能无法正确解析 iframe 中的内容
- 会阻塞主页面的 onload 事件
- 和主页面共享连接池,影响页面并行加载
- 过多或不必要的 `iframe` 会增加页面的加载时间和资源消耗,影响性能
- 安全风险:如果 `iframe` 中嵌入的是不可信的第三方内容,可能会引入安全风险,如跨站脚本攻击 (XSS)

最佳实践

- 明确指定 width 和 height 属性:为 iframe 设置明确的宽度和高度,以确保页面布局的稳定性
- 使用 title 属性提供描述性标题:为 iframe 添加 title 属性,提供关于嵌入内容的简要描述,增强可访问性
- 设置 sandbox 属性:根据需要设置 sandbox 属性,限制 iframe 中的某些功能,如禁止弹出窗口、禁止脚本执行等,提高安全性
- 谨慎处理 allow 属性:根据实际需求设置 allow 属性,控制 iframe 对某些功能和 API 的访问权限,如全屏、麦克风、摄像头等
- 合理设置 referrerpolicy 属性:根据隐私要求设置 referrerpolicy 属性,控制在导航到 iframe 中的内容时如何发送 referrer 信息
- 提供替代内容:在 iframe 标签之间提供替代内容,以便在不支持 iframe 或无法加载嵌入内容时显示
- 避免在 iframe 中嵌入敏感信息:不要在 iframe 中嵌入敏感信息,如登录表单、个人数据等,以防止潜在的安全风险
- 定期审查和更新嵌入内容:定期审查 iframe 中嵌入的第三方内容,确保其安全性和合规性,并及时更新或移除过期的内容
- 监控 iframe 的性能影响:监控 iframe 对页面性能的影响,如加载时间、资源消耗等,并进行优化

## meta viewport 是做什么用的，怎么写

Viewport，适配移动端，可以控制视口的大小和比例

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```
