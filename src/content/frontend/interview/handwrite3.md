---
title: js高频手写题3
description: 异步求和函数
date: 2022-05-14
---

# js高频手写题

## 实现一个异步求和函数

```js
function asyncAdd(a, b, callback) {
  setTimeout(() => {
    callback(null, a + b);
  }, 1000)
}
function createAdd (a, b = 0) {
  return new Promise((resolve) => {
    asyncAdd(a, b, (err, result) => {
      if (!err) {
        resolve(result)
      }
    })
  })
}
async function sum (...args) {
  if (args.length > 1) {
    const result = [];
    for (let i = 0; i < args.length; i = i + 2) {
      result.push(createAdd(args[i], args[i + 1]));
    }
    return sum(...(await Promise.all(result)));
  }
  return args[0];
}
```

## 千分位格式化

```js
function thousandSeparator (num) {
  let numstr = num.toString();
  let result = '';
  while (numstr.length > 3) {
    result = '.' + numstr.slice(-3) + result;
    numstr = numstr.slice(0, numstr.length - 3);
  }
  if (numstr) {
    result = num + result;
  }
  return result;
}
```

## 获取两个日期之间的所有日期

```js
let startTime = '2018-07-25'; //开始日期
let endtime = '2018-08-02'; //结束日期
function getAllTime (startTime, endTime) {
  let result = [];
  let i = 0;
  while (startTime < endTime) {
    result[i] = startTime;

    // 获取开始日期时间戳
    let startTime_m = new Date(startTime).getTime();
    // 增加一天时间戳
    let nextDate = startTime_m + (24 * 60 * 60 * 1000);
    // 拼接
    let next_year = new Date(nextDate).getFullYear()
    let next_mouth = new Date(nextDate).getMouth() + 1;
    let next_day = new Date(nextDate).getDate();
    startTime = next_year + '-' + next_mouth + '-' + next_day;
    i++;
  }
}
```

## 事件循环

```js
const eventloop = {
  taskQueue: [],
  isRunning: false,
  queueTask(task) {
    this.taskQueue.push(task);
    if (!this.isRunning) {
      this.isRunning = true;
      this.nextTask();
    }
  },
  nextTask() {
    if (this.taskQueue.length === 0) {
      this.isRunning = false;
      return;
    }
    let task = this.taskQueue.shift();
    task();
    setTimeout(() => {
      this.nextTask();
    }, 0)
  }
}
eventloop.queueTask(() => console.log('task1'))
eventloop.queueTask(() => console.log('task2'))
```
