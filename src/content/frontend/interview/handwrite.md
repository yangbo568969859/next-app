---
title: js高频手写题
description: js高频手写题
date: 2022-05-14
---

# js高频手写题

## 实现一个compose函数

```js
function compose(...func) {
  return (arg, callback) => {
    let isFunc = callback && typeof callback === 'function'

    const promiseRes = func.reduce((promise, curr) => {
      return promise.then(curr)
    }, Promise.resolve(arg))

    if (isFunc) {
      promiseRes.then(res => callback(null, res), error => callback(error))
    } else {
      return promiseRes
    }
  }
}

const plus1 = (v) => v + 1;
const minus = (v) => new Promise((resolve) => resolve(v - 2));
const multiply = (v) => { return v * 3 }
const actionFunc = compose(plus1, minus, multiply);

actionFunc(0).then(result => console.log(result))
actionFunc(0, (error, res) => !error && console.log(res))

```

## 实现 JSON.stringify

```js
function jsonStringify (obj) {
  let type = typeof obj
  if (type === 'object') {
    let json = []
    let isArr = Array.isArray(obj)
    for (let k in obj) {
      let value = obj[k]
      let ctype = typeof value
      if (/string|undefined|function/.test(obj)) {
        value = '"' + value + '"'
      } else if (ctype === 'object') {
        value = jsonStringify(value);
      }
      console.log(value)
      json.push((isArr ? "" : '"' + k + '":') + String(value))
    }
    console.log(json)
    return (isArr ? "[" : "{") + String(json) + (isArr ? "]" : "}")
  } else {
    if (/string|undefined|function/.test(obj)) {
      obj = '"' + obj + '"'
    }
    return String(obj)
  }
}
```

## 实现一个JSON.parse

- eval
- Function

```js
function jsonParse(opt) {
  return eval('(' + opt + ')')
}
```

```js
var jsonStr = '{ "age": 20, "name": "jack" }'
var jsonRes = (new Function('return ' + jsonStr))()
```

## 实现一个继承

寄生组合继承

```js
function Parent (name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log('parent name:' + this.name)
}
function Child (name, parentName) {
  Parent.call(this, parentName);
  this.name = name
}
function createObj (proto) {
  function F() {}
  F.prototype = proto
  return new F()
}
Child.prototype = create(Parent.prototype)
Child.prototype.sayName = function () {
  console.log('child name:' + this.name)
}
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.sayName();    // parent name: father

var child = new Child('son', 'father');
```

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

## 实现有并行限制的Promise调度器

```yaml
 addTask(1000,"1");
 addTask(500,"2");
 addTask(300,"3");
 addTask(400,"4");
 的输出顺序是：2 3 1 4

 整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4
```

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.queue = [];
    this.runCounts = 0;
  }

  add (time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time)
      })
    }
    this.queue.push(promiseCreator);
  }

  taskStart() {
    for (let i = 0; i < this.limit; i++) {
      this.request()
    }
  }

  request () {
    if (!this.queue || !this.queue.length || this.runCounts >= this.limit) {
      return;
    }
    this.runCounts++;
    const func = this.queue.shift()
    func().then((res) => {
      this.runCounts--;
      this.request();
    })
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order)
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.taskStart();
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

## 实现LRU算法

```js
class LRUCache {
  constructor(capacity) {
    this.cacheMap = new Map();
    this.capacity = capacity;
  }
  get (key) {
    if (this.cacheMap.has(key)) {
      let value = this.cacheMap.get(key);
      this.cacheMap.delete(key);
      this.cacheMap.set(key, value)
      return value;
    } else {
      return -1;
    }
  }
  put (key, value) {
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key);
      this.cacheMap.set(key, value);
    } else if (this.cacheMap.size < this.capacity) {
      this.cacheMap.set(key, value)
    } else {
      this.cacheMap.set(key, value);
      this.cacheMap.delete(this.cacheMap.keys().next().value);
    }
  }
}
```

## 模板字符串解析功能

```js
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18
}
render(template, data); // 我是姓名，年龄18，性别undefined

function render(template, data) {
  let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
    return data[key]
  })
  return computed;
}
```

## 数组转树形

```js
function listToTree(list) {
  let temp = {};
  let treeData = [];

  for (let i = 0; i < list.length; i++) {
    temp[list[i].id]
  }
}
```

## 大数相加

```js
function add (a, b) {
  let maxLength = Math.max(a.length, b.length)
  a = a.padStart(maxLength, '0');
  b = b.padStart(maxLength, '0');

  let f = 0;
  let res = '';
  for (let i = maxLength - 1; i >= 0; i--) {
    let temp = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(temp / 10);
    res = temp % 10 + res
  }
  if (f !== 0) {
    res = '' + f + res;
  }
  return res;
}
```

## 排序

```js
// 冒泡排序
function bubbleSort (arr) {
  let length = arr.length;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
}
// 选择排序
function selectSort (arr) {
  let length = arr.length;
  let minIndex = 0;
  if (!arr || !arr.length) {
    return arr
  }
  for (let i = 0; i < length; i++) {
    minIndex = i;
    for (let j = i; j < length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr;
}
// 插入排序
function insertSort (arr) {
  if (!arr || !arr.length) {
    return arr;
  }
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    for (; j >= 0; j--) {
      if (arr[j] > key) {
        arr[j + 1] = arr[j]
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }
  return arr;
}
```