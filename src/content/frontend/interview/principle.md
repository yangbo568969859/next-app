---
title: js 原理
description: async/await原理，instanceof原理
date: 2022-08-11
---

# js原理相关

## async/await原理

async和await的实现依赖js的promise机制和生成器函数，当遇到await表达式时，js引擎会暂停函数的执行，将控制权交给调用者。
在后台，js引擎会监视await等待的Promise对象的状态变化，当Promise状态变为已解决或已拒绝时，引擎会恢复函数的执行，并根据Promise的状态返回解决值或抛出异常

实现原理：async/await是一种语法糖，原理是利用ES6里的 迭代函数-generator函数

generator函数说明：generator函数跟普通函数在写法上的区别就是：多了一个星号*，并且只有在generator函数中才能使用yield关键字，yield相当于generator函数执行的中途暂停点，如果需要暂停点继续执行后面函数，就需要用到next方法，next方法执行后返回一个对象(value和done)

- value：暂停点后面接的值，也就是yield后面接的值
- done: 是否generator函数已走完，没走完为false，走完为true

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const g = gen();
console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true} 可以看到最后一个是undefined，这取决于你generator函数有无返回值
// 比如上述gen 函数最终返回了3 那么最后一个next()的value就是3
```

yield后面接函数的话，到了对应暂停点yield，会马上执行此函数，并且该函数的执行返回值，会被当做此暂停点对象的value

```js
function fn(num) {
  console.log(num)
  return num
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) 
// 1
// { value: 1, done: false }
console.log(g.next())
// 2
//  { value: 2, done: false }
console.log(g.next()) 
// { value: 3, done: true }
```

yield后面接Promise

```js
function fn (num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}

function* gen() {
  yield fn(1);
  yield fn(2);
  return 3;
}
const genFn = gen();
console.log(genFn.next()); // { value: Promise { <pending> }, done: false }
console.log(genFn.next()); // { value: Promise { <pending> }, done: false }
console.log(genFn.next()); // { value: 3, done: true }

// 其实我们想要的结果是，两个Promise的结果1 和 2，那怎么做呢？很简单，使用Promise的then方法就行了
const genResFn = gen();
const next1 = genResFn.next();
next1.value.then((res) => {
  console.log(next1) // 1秒后输出 { value: Promise { 1 }, done: false }
  console.log(res1) // 1秒后输出 1

  const next2 = g.next()
  next2.value.then(res2 => {
    console.log(next2) // 2秒后输出 { value: Promise { 2 }, done: false }
    console.log(res2) // 2秒后输出 2
    console.log(g.next()) // 2秒后输出 { value: 3, done: true }
  })
})
```

next函数传参：generator函数可以用next方法来传参，并且可以通过yield来接收这个参数，注意两点

- 第一次next传参是没有用的，只有从第二次开始next传参才有用
- next传值时，顺序是：先右边yield，后左边接收参数

```js
function* gen() {
  const num1 = yield 1;
  console.log(num1)
  const num2 = yield 2;
  console.log(num2)
  return 3;
}
const g = gen();
console.log(g.next(1)) // { value: 1, done: false }
console.log(g.next(2)) // { value: 2, done: false }
```

Promise+next传参

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}

const g = gen()
const next1 = g.next()
next1.value.then(res => {
  console.log(next1) // 1秒后输出 { value: Promise { <pending> }, done: false }
  console.log(res) // 1秒后输出 2

  const next2 = g.next(res)
  next2.value.then(res2 => {
    console.log(next2) // 2秒后同时输出 { value: Promise { 4 }, done: false }
    console.log(res2) // 2秒后同时输出 4

    const next3 = g.next(res2) // 传入上次的res2
    next3.value.then(res3 => {
      console.log(next3) // 3秒后同时输出 { value: Promise { 8 }, done: false }
      console.log(res3) // 3秒后同时输出 8

       // 传入上次的res3
      console.log(g.next(res3)) // 3秒后同时输出 { value: 8, done: true }
    })
  })
})
```

```js
// async/await 实现
function generatorToAsync (generatorFn) {
  return function () {
    const gen = generatorFn.apply(this, arguments);

    return new Promise((resolve, reject) => {
      function go (key, arg) {
        let res;
        try {
          res = gen[key](arg); // 这里有可能会执行返回reject状态的Promise
        } catch (err) {
          return reject(err);
        }

        // 解构获得value和done
        const { value, done } = res;
        if (done) {
          return resolve(value);
        } else {
          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }
      go("next") // 第一次执行
    })
  }
}

function* gen () {
  const num1 = yield fn(1)
  console.log(num1) // 2
  const num2 = yield fn(num1)
  console.log(num2) // 4
  const num3 = yield fn(num2)
  console.log(num3) // 8
  return num3
}

const asyncFn = generatorToAsync(gen)
console.log(asyncFn);
asyncFn().then(res => console.log(res))
```

## instanceof原理

instanceof 用于检查一个对象是否是某个构造函数的实例。它通过判断对象的原型链上是否存在构造函数的 prototype 属性来确定结果

```js
function myInstanceof (obj, constructorObj) {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  let proto = Object.getPrototypeOf(obj);
  // let proto = obj.__proto__;
  while (proto != null) {
    if (proto === constructorObj.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

## 浅拷贝

在js中，浅拷贝是指创建一个新的对象，并将原始对象的属性值复制到新对象中，但是如果属性值是引用类型(如对象，数组)，则只复制引用，而不是创建一个新的对象。这意味着原始对象和新对象共享相同的引用类型属性

原理是：遍历原始对象的可枚举属性，并将属性名和属性值复制到新对象中，对于原始类型(如数字、字符串、布尔值)的属性,会直接复制值;对于引用类型的属性,只复制引用,新对象和原始对象指向同一个引用

```js
const originObj = { a: 1, b: 2, c: { d: 3 } };
// 方法1 Object.assign()
const newObj = Object.assign({}, originObj);
// 方法2 扩展运算符
const newObj2 = { ...originObj };
// 数组可以使用slice方法
const originalArr = [1, 2, { a: 3 }];
const newArr = originalArr.slice();
const newArr = [ ...originalArr ];
// 手动拷贝
function shallowCopy(originObj) {
  if (typeof originObj !== 'object' || originObj === null) {
    return originObj;
  }

  const newObj = Array.isArray(originObj) ? [] : {};
  for (let key in originObj) {
    if (originObj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

## 深拷贝

在js中，深拷贝是指创建一个新的对象，并递归地复制原始对象的所有属性，包括嵌套的对象和数组，使得新对象和原始对象完全独立，互不影响

原理：

- 对于原始数据类型：直接复制值到新对象中
- 对于引用数据类型：递归地进行深拷贝，创建一个新对象或数组，将原始对象的属性值复制到新对象中
- 对于特殊对象： Date和RegExp，则需要根据其特定的构造函数创建新的对象

方法

- JSON.parse(JSON.stringify(obj))
  - 无法处理函数、Symbol等特殊类型的属性
  - 对象的属性如果是undefined、函数、Symbol，则会被忽略
  - 对象的原型链不会被复制
  - 循环引用的对象会导致错误
- 递归实现深拷贝
  - 无法处理函数、Symbol 等特殊类型的属性
  - 对象的原型链不会被复制
  - 循环引用的对象会导致无限递归

```js
// 方法1 JSON.parse(JSON.stringify(obj))
const obj1 = { a: 1, b: { c: 2 } };
const copyObj1 = JSON.parse(JSON.stringify(obj1));
// 方法2 递归实现深拷贝
function deepCopy (originObj) {
  if (typeof originObj !== 'object' || originObj === null) {
    return obj;
  }
  const newObj = Array.isArray(originObj) ? [] : {};

  for (let key in originObj) {
    if (originObj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(originObj[key]);
    }
  }

  return newObj;
}
// 方法3 更全面的实现
function deepCopyComplete (obj, cache = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (cache.has(obj)) {
    return cache.get(obj);
  }

  let newObj;

  if (obj instanceof Date) {
    newObj = new Date(obj);
  } else if (obj instanceof RegExp) {
    const reFlags = /\w*$/;
    const result = new RegExp(obj.source, reFlags);
    result.lastIndex = obj.lastIndex;
    newObj = result;
  } else if (obj instanceof Symbol) {
    newObj = Symbol(obj.toString());
  } else if (obj instanceof Set) {
    newObj = new Set();
    obj.forEach(value => {
      newObj.add(deepCopyComplete(value, cache));
    })
  } else if (obj instanceof Map) {
    newObj = new Map();
    obj.forEach((value, key) => {
      newObj.set(key, deepCopyComplete(value, cache));
    })
  } else {
    newObj = Array.isArray(obj) ? [] : {};
    cache.set(obj, newObj);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopyComplete(obj[key], cache);
      }
    }
    // myForeach(obj, (value, key) => {
    //   if (obj) {
    //     key = value;
    //   }
    //   newObj[key] = deepCopyComplete(obj[key], cache);
    // })
  }
  return newObj;
}

function myForeach (obj, fn) {
  let index = -1;
  const length = obj.length;
  while (++index < length) {
    fn(obj[index], index);
  }
  return obj;
}
```

## bind、call、apply

## EventBus

```js
function EventEmitter() {
  this.events = Object.create(null);
}

EventEmitter.prototype.on = function (type, listener, flag = false) {
  if (this.events[type]) {
    if (flag) {
      this.events[type].unshift(listener);
    } else {
      this.events[type].push(listener);
    }
  } else {
    this.events[type] = [listener];
  }
}
EventEmitter.prototype.emit = function (type, ...args) {
  if (this.events[type]) {
    this.events[type].forEach(fn => {
      fn.call(this, ...args);
    })
  }
}
EventEmitter.prototype.once = function (type, listener) {
  const wrapper = (...args) => {
    listener.call(this, ...args);
    this.off(type, wrapper);
  }

  wrapper.origin = listener;
  this.on(type, wrapper);
}
EventEmitter.prototype.off = function (type, listener) {
  if (this.events[type]) {
    this.events[type] = this.events[type].filter(fn => {
      return fn !== listener && fn.origin !== listener;
    })
  }
}
EventEmitter.prototype.removeAllListeners = function () {
  this.events = Object.create(null);
}
```

```js
class EventBus {
  constructor() {
    this.event = Object.create(null);
  }

  on (type, listener, flag = false) {
    if (this.event[type]) {
      if (flag) {
        this.event[type].unshift(listener);
      } else {
        this.event[type].push(listener);
      }
    } else {
      this.event[type] = [listener];
    }
  }

  once (type, listener) {
    const warpper = (...args) => {
      listener.call(this, ...args);
      this.off(type, warpper);
    }
    this.on(type, warpper);
  }

  emit (type, ...args) {
    if (this.event[type]) {
      this.event[type].forEach(fn => {
        fn.call(this, ...args);
      })
    }
  }

  off (type, listener) {
    if (this.event[type]) {
      this.event[type] = this.event[type].filter(fn => {
        return fn !== listener;
      });
    }
  }

  removeAllListeners () {
    this.event = Object.create(null);
  }
}
```

## 防抖和节流

```js
function debounce(fn, delay) {
  let timer;

  return function (..args) {
    let context = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    })
  }
}

function throttle (fn, delay) {
  let flag = true;

  return function (...args) {
    let context = this;
    if (!flag) {
      return;
    }
    flag = false;
    setTimeout(() => {
      fn.apply(context, args);
      flag = true;
    }, delay)
  }
}
function throttle2 (fn, delay) {
  let last = 0;

  return function (...args) {
    let context = this;
    let now = new Date().getTime();

    if (now - last < delay) {
      return;
    }
    last = now;
    fn.apply(context, args);
  }
}
```

## Promise A+

## Object.create

```js
function createObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

## 函数柯里化

函数柯里化是一种将接受多个参数的函数转换为接受一个单一参数的函数,并且返回接受余下参数且返回结果的新函数的技术

- 这个curry函数接受一个函数fn作为参数,并返回一个新的函数curried
  - 当调用curried函数时,它会接收一些参数args
  - 如果接收到的参数数量(args.length)大于等于原始函数fn所需的参数数量(fn.length),则使用apply方法将args传递给原始函数fn并返回结果
  - 如果接收到的参数数量小于原始函数所需的参数数量,则返回一个新的函数
  - 这个新的函数接受额外的参数newArgs,并通过递归调用curried函数,将之前的参数args和新的参数newArgs合并后传递给curried函数
  - 这个过程会一直递归,直到接收到的参数数量满足原始函数所需的参数数量,然后返回最终的结果

```js
function currey (fn) {
  return function curried (...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  }
}
```
