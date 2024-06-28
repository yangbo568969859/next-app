---
title: js高频手写题
description: js高频手写题
date: 2022-05-14
---

# js高频手写题

## 实现一个sleep函数

```js
function sleep (time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
```

## 实现一个版本号比较

```yaml
1.0.0 > 1.0.1 > 1.1.0 > 2.0.0
```

```js
function compareVersion(v1, v2) {
  const v1Split = v1.split('.')
  const v2Split = v2.split('.')

  const maxLen = Math.max(v1Split.length, v2Split.length)
  if (maxLen !== v1Split.length) {
    while (v1Split.length < maxLen) {
      v1Split.push('0')
    }
  }
  if (maxLen !== v2Split.length) {
    while (v2Split.length < maxLen) {
      v2Split.push('0')
    }
  }
  for (let i = 0; i < maxLen; i++) {
    if (v1Split[i] > v2Split[i]) {
      return 1
    } else if (v1Split[i] < v2Split[i]) {
      return -1;
    }
  }
  return 0;
}
```

## 实现一个Object.assign

```js
function MyAssign(target, ...args) {
  if (target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  let ret = Object(target)
  for (let i = 0; i < args.length; i++) {
    const nextSource = args[i];
    if (nextSource !== null || nextSource !== undefined) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          ret[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return ret;
}
```

## Promise相关

### Promise.resolve()

### Promise.reject()

### Promise.all()

```js
Promise.all = function (promiseArr) {
  let index = 0;
  let result = [];
  return new Promise((resolve, reject) => {
    promiseArr.forEach((promise, i) => {
      Promise.resolve(p).then(val => {
        index++;
        result[i] = val;
        if (index === promiseArr.length) {
          resolve(result);
        }
      }, err => {
        reject(err);
      })
    })
  })
}
```

### Promise.race()

```js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((promise, i) => {
      Promise.resolve(p).then(val => {
        resolve(val);
      }, err => {
        reject(err);
      })
    })
  })
}
```

## 实现Ajax

```js
```

## 数组扁平

## 使用闭包实现每隔一秒打印 1,2,3,4

## 手写一个观察者

## 实现一个通用的事件侦听器函数

## 解析URL Params

## 模板引擎实现

## 图片懒加载

```js
let imageList = document.querySelectorAll('img');
```

## 查找字符串中出现最多的字符和个数

```js
function findMostFrequentChar(str) {
  const countMap = {}
  let maxChar = '';
  let maxCount = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    countMap[char] = (countMap[char] || 0) + 1;
  }

  for (const char in countMap) {
    if (countMap[char] > maxCount) {
      maxChar = char;
      maxCount = countMap[char];
    }
  }
}
```
