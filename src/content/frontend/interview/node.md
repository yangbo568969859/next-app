---
title: node
description: node系列知识
date: 2021-04-05
---

# node 基础

## node 是什么

## node 事件循环机制

外部输入数据 -> 轮循阶段(poll) -> 检查阶段(check) -> 关闭阶段(close callbacks) -> 定时器检查阶段(timer) -> I/O 阶段(I/O callbacks) -> 闲置阶段(idle, prepare) -> 轮询阶段(poll)

- timer 阶段： 执行到期的 setTimeout/setInterval 队列回调
- I/O 阶段：执行上轮循环循环中的少数未执行的 I/O 回调
- idle，prepare (仅 node 内部使用)
- poll
  - 执行回调
  - 执行定时器
    - 如有到期的 setTimeout/setInterval，则返回 timer 阶段
    - 如有 setImmediate，则前往 check 阶段
- check 阶段 执行 setImmediate
- close callbacks

process.nextTick 独立于 EventLoop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其它 microtask 执行

![image](./images/node_eventlop.png)

## 其他

### nodejs是如何处理高并发的

nodejs通过其独特的设计和事件驱动的非阻塞I/O模型，实现了高并发。(适合I/O密集型应用，不适合CPU密集型应用)

- 单线程事件循环
  - 使用单个线程来处理所有的请求和事件
  - 事件循环不断地检查事件队列，并执行相应的回调函数。
  - 当一个请求到达时，Node.js 将其放入事件队列中，然后继续处理下一个请求，而不会等待当前请求完成
- 非阻塞I/O
  - 当 Node.js 发起一个 I/O 操作（如文件读取、网络请求）时，它不会阻塞线程，而是立即返回，并在 I/O 操作完成后通过回调函数通知事件循环
  - 这样可以在等待 I/O 操作完成的同时处理其他请求，提高了并发性能
- 事件驱动
  - 当某个事件发生时（如请求到达、I/O 操作完成），Node.js 会触发相应的事件，并执行关联的回调函数
  - 通过事件驱动的方式，Node.js 可以高效地处理大量的并发请求
- 异步编程
  - Node.js 提供了大量的异步 API，如文件系统操作、网络请求等
  - 通过使用回调函数、Promise 或 async/await，可以编写异步代码，避免阻塞线程
  - 异步编程允许 Node.js 在等待 I/O 操作完成的同时处理其他请求，提高了并发性能
- 负载均衡
- 垃圾回收