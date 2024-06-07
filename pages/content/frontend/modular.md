---
title: 前端模块化
description: 前端模块化 CommonJS 和 ES6模块
date: 2021-05-10
---

# 前端模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。目前流行的js模块化规范有CommonJS、AMD、CMD以及ES6的模块系统

## CommonJS

Node.js 是commonJS规范的主要实践者，他有4个重要的环境变量为模块化的实现提供支持：module、exports、require、global。实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports），用require加载模块

- 在 commonjs 中每一个js文件都是一个单独的模块，我们可以称之为module
- 该模块中，包含commonjs规范的核心变量：exports、module.exports、require
- exports 和 module.exports 可以负责对模块中的内容进行导出
- require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容

```js
// 定义math.js
var basicNum = 0;
function add(a, b) {
  return a + b;
}
module.exports = {
  add: add,
  basicNum: basicNum,
};

// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math.js');
math.add(2, 4);
```

commonJS用同步的方式加载模块，在服务端，模块文件都存储在本地磁盘，读取非常快；但在浏览器中，限于网络原因，更合理的方式是使用异步加载

### 实现原理

在编译的过程中，实际 Commonjs 对 js 的代码块进行了首尾包装， 我们以上述的 home.js 为例子🌰，它被包装之后的样子如下

```js
(function (exports, require, module, __filename, __dirname) {
  const sayName = require('./hello.js');
  module.exports = function say() {
    return {
      name: sayName(),
      author: '我不是外星人',
    };
  };
});
// 在 Commonjs 规范下模块中，会形成一个包装函数，我们写的代码将作为包装函数的执行上下文，使用的 require ，exports ，module 本质上是通过形参的方式传递到包装函数中的
```

```js
// 包装函数本质
function wrapper(script) {
  return (
    '(function (exports, require, module, __filename, __dirname) {' +
    script +
    '\n})'
  );
}
// 包装函数执行
const modulefunction = wrapper(`
  const sayName = require('./hello.js')
    module.exports = function say(){
        return {
            name:sayName(),
            author:'author'
        }
    }
`);
// 如上模拟了一个包装函数功能， script 为我们在 js 模块中写的内容，最后返回的就是如上包装之后的函数。当然这个函数暂且是一个字符串

runInThisContext(modulefunction)(module.exports, require, module, __filename, __dirname)
// 在模块加载的时候，会通过 runInThisContext (可以理解成 eval ) 执行 modulefunction ，传入require ，exports ，module 等参数。最终我们写的 nodejs 文件就这么执行了
```

### require文件加载流程

```js
const fs =      require('fs')      // 核心模块
const sayName = require('./hello.js')  // 文件模块
const crypto =  require('crypto-js')   // 第三方自定义模块
```

当 require 方法执行的时候，接收的唯一参数作为一个标识符 ，Commonjs 下对不同的标识符，处理流程不同，但是目的相同，都是找到对应的模块。

require加载标识符原则

- 首先像fs、http、path等标识符，会被作为nodejs的核心模块
- ./ 和 ../ 作为相对路径的文件模块。 / 作为绝对路径的文件模块
- 非路径形式也非核心模块，将会当作自定义模块

- 核心模块的优先级仅次于缓存加载，在Node源码编译中，已被编译成二进制代码，所以加载核心模块速度最快
- 路径形式的模块处理：已 ./ ，../ 和 / 开始的标识符，会被当作文件模块处理，require() 方法会将路径转化为真实路径，并以真实路径为索引，将编译后的结果缓存起来，第二次加载的时候会更快
- 自定义模块处理：自定义模块，一般指的是非核心的模块，它可能是一个文件或者一个包，它的查找会遵循以下原则
  - 在当前目录下的node_modules目录查找
  - 如果没有，在父级目录的node_modules查找
  - 沿着路径向上递归，直到根目录下的 node_modules 目录
  - 在查找过程中，会找 package.json 下 main 属性指向的文件，如果没有 package.json ，在 node 环境下会以此查找 index.js ，index.json ，index.node

### require 模块引入与处理

CommonJS 模块同步加载并执行模块文件，CommonJS 模块在执行阶段分析模块依赖，采用深度优先遍历（depth-first traversal），执行顺序是父 -> 子 -> 父

比如 main.js 和 a.js模块都引用了b.js， 但是b.js 模块只执行了一次；a.js 和 b.js 模块相互引用，但是没有造成循环引用的情况

```js
// id 为路径标识符
function require(id) {
  // 查找  Module 上有没有已经加载的 js  对象
  // Module 整个系统运行之后，会用 Module 缓存每一个模块加载的信息
  const cachedModule = Module._cache[id];
  // 如果已经加载了那么直接取走缓存的 exports 对象
  if (cachedModule) {
    return cachedModule.exports;
  }

  // 创建当前模块的module
  const module = { exports: {}, loaded: false }
  // 将module缓存到Module的缓存属性中，路径标识符作为id
  Module._cache[id] = module
  // 加载文件
  runInThisContext(wrapper('module.exports = "123"'))(module.exports, require, module, __filename, __dirname)
  // 加载完成
  module.loaded = true 
  /* 返回值 */
  return module.exports
}
```

require流程

- require会接收一个参数--文件标识符，然后分析定位文件，接下来会从Module上查找有没有缓存，如果有缓存，那么直接返回缓存的内容
- 如果没有缓存，会创建一个module对象，缓存到Module上，然后执行文件，加载完文件，将loaded属性设置为true，然后返回module.exports对象，完成模块加载流程
- 模块导出就是 return 这个变量的其实跟 a = b 赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址
- exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对 exports 进行赋值会导致 exports 操作的不再是 module.exports 的引用

require 避免重复加载

require 避免循环引用

```js
// a.js
const getMes = require('./b')
console.log('我是 a 文件')
exports.say = function(){
    const message = getMes()
    console.log(message)
}
// b.js
const say = require('./a')
const  object = {
   name:'《React进阶实践指南》',
}
console.log('我是 b 文件')
module.exports = function(){
    return object
}
// 主文件 main.js
const a = require('./a')
const b = require('./b')

console.log('node 入口文件')
```

- 首先执行 node main.js ，那么开始执行第一行 require(a.js)；
- 那么首先判断 a.js 有没有缓存，因为没有缓存，先加入缓存，然后执行文件 a.js （需要注意 是先加入缓存， 后执行模块内容）;
- a.js 中执行第一行，引用 b.js。
- 那么判断 b.js 有没有缓存，因为没有缓存，所以加入缓存，然后执行 b.js 文件。
- b.js 执行第一行，再一次循环引用 require(a.js) 此时的 a.js 已经加入缓存，直接读取值。接下来打印 console.log('我是 b 文件')，导出方法。
- b.js 执行完毕，回到 a.js 文件，打印 console.log('我是 a 文件')，导出方法。
- 最后回到 main.js，打印 console.log('node 入口文件') 完成这个流程。

如上第五步的时候，当执行 b.js 模块的时候，因为 a.js 还没有导出 say 方法，所以 b.js 同步上下文中，获取不到 say
解决方法：1. 动态加载a.js方法 2. 异步加载

require 动态加载

```js
// 用 require 动态加载 b.js 模块
console.log('我是 a 文件')
exports.say = function(){
    const getMes = require('./b')
    const message = getMes()
    console.log(message)
}
```

### exports 和 module.exports

```js
// a.js
exports.name = `《React进阶实践指南》`
exports.say = function (){
    console.log(666)
}
// main.js
const a = require('./a')
console.log(a)
// 打印结果
{name: '《React进阶实践指南》', say: [Function]}
```

为什么 exports={} 直接赋值一个对象就不可以呢

- 理想情况下是通过 exports = {} 直接赋值，不需要在 exports.a = xxx 每一个属性，但是如上我们看到了这种方式是无效的。为什么会这样？实际这个是 js 本身的特性决定的
- 通过上述讲解都知道 exports ， module 和 require 作为形参的方式传入到 js 模块中。我们直接 exports = {} 修改 exports ，等于重新赋值了形参，那么会重新赋值一份，但是不会在引用原来的形参

既然有了 exports，为何又出了 module.exports

- 如果我们不想在 commonjs 中导出对象，而是只导出一个类或者一个函数再或者其他属性的情况，那么 module.exports 就更方便了，如上我们知道 exports 会被初始化成一个对象，也就是我们只能在对象上绑定属性，但是我们可以通过 module.exports 自定义导出出对象外的其他类型元素

与 exports 相比，module.exports 有什么缺陷

- module.exports 当导出一些函数等非对象属性的时候，也有一些风险，就比如循环引用的情况下。对象会保留相同的内存地址，就算一些属性是后绑定的，也能间接通过异步形式访问到。但是如果 module.exports 为一个非对象其他属性类型，在循环引用的时候，就容易造成属性丢失的情况发生了

## AMD和require.js

AMD规范采用异步方式加载模块，模块的加载不影响他后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

require.js实现AMD规范的模块化：用require.config()指定引用路径等，用define()定义模块，用require()加载模块

首先我们需要引入require.js文件和一个入口文件main.js，main.js中配置require.config() 并规定项目中用到的基础模块

```html
<!-- 网页中引入require.js及main.js -->
<script src="js/require.js" data-main="js/main"></script>
<!-- main.js 入口文件/主模块 -->
<!-- 首先用config()指定各模块路径和引用名 -->
<script>
  require.config({
    baseUrl: 'js/lib',
    paths: {
      jquery: 'jquery.min', //实际路径为js/lib/jquery.min.js
      underscore: 'underscore.min',
    },
  });
  // 执行基本操作
  require(['jquery', 'underscore'], function ($, _) {
    // some code here
  });
</script>
```

引用模块的时候，我们将模块名放在[]中作为reqiure()的第一参数；如果我们定义的模块本身也依赖其他模块,那就需要将它们放在[]中作为define()的第一参数。

```js
// 定义math.js
define(function () {
  var basicNum = 0;
  var add = function (x, y) {
    return x + y;
  };
  return {
    add: add,
    basicNum: basicNum,
  };
});
// 定义一个依赖underscore.js的模块
define(['underscore'], function () {
  var classify = function (list) {
    _.countBy(list, function (num) {
      return num > 30 ? 'old' : 'young';
    });
  };
  return {
    classify: classify,
  };
});

// 引用模块，将模块放在[]内
require(['jquery', 'math'], function ($, math) {
  var sum = math.add(10, 20);
  $('#sum').html(sum);
});
```

## CMD和sea.js

require.js在申明依赖的模块时会在第一之间加载并执行模块内的代码

```js
define(['a', 'b', 'c', 'd', 'e', 'f'], function (a, b, c, d, e, f) {
  // 等于在最前面声明并初始化了要用到的所有模块
  if (false) {
    // 即便没用到某个模块 b，但 b 还是提前执行了
    b.foo();
  }
});
```

CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的

```js
/** AMD写法 **/
define(['a', 'b', 'c', 'd', 'e', 'f'], function (a, b, c, d, e, f) {
  // 等于在最前面声明并初始化了要用到的所有模块
  a.doSomething();
  if (false) {
    // 即便没用到某个模块 b，但 b 还是提前执行了
    b.doSomething();
  }
});

/** CMD写法 **/
define(function (require, exports, module) {
  var a = require('./a'); //在需要时申明
  a.doSomething();
  if (false) {
    var b = require('./b');
    b.doSomething();
  }
});

/** sea.js **/
// 定义模块 math.js
define(function (require, exports, module) {
  var $ = require('jquery.js');
  var add = function (a, b) {
    return a + b;
  };
  exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function (math) {
  var sum = math.add(1 + 2);
});
```

## ES6 Module

ES6 在语言标准的层面上，实现了模块功能，而且实现的相当简单，旨在成为浏览器和服务器通用的模块解决方案

其模块功能由两个命令构成：export 和 import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
  return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

使用import命令的时候，用户需要知道所要加载的变量名或函数名。其实ES6还提供了export default命令，为模块指定默认输出，对应的import语句不需要使用大括号。这也更趋近于ADM的引用写法

```js
/** export default **/
//定义输出
export default { basicNum, add };
//引入
import math from './math';
function test(ele) {
  ele.textContent = math.add(99 + math.basicNum);
}
```

### 导出export和导入import

export 正常导出，import 导入

```js
const name = '《React进阶实践指南》' 
const author = '我不是外星人'
export { name, author }
export const say = function (){
    console.log('hello , world')
}
```

```js
// name , author , say 对应 a.js 中的  name , author , say
import { name, author, say } from './a.js'
```

默认导出 export default

```js
const name = '《React进阶实践指南》'
const say = function (){
    console.log('hello , world')
}
export default {
    name,
    say
} 
```

```js
import mes from './a.js'
console.log(mes) //{ name: '《React进阶实践指南》', say: Function }
```

混合导入｜导出

```js
export const name = '《React进阶实践指南》'
export const author = '2222'

export default function say (){
  console.log('hello , world')
}
```

```js
// 第一种：
import theSay, { name, author as bookAuthor } from './a.js'
console.log(
    theSay,     // ƒ say() {console.log('hello , world') }
    name,       // "《React进阶实践指南》"
    bookAuthor  // "2222"
)
// 第二种：
import theSay, * as mes from './a'
console.log(
    theSay, // ƒ say() { console.log('hello , world') }
    mes // { name:'《React进阶实践指南》' , author: "2222" ，default:  ƒ say() { console.log('hello , world') } }
)
```

## ES6模块和CommonJS模块的差异

- CommonJS模块输入的是一个值的拷贝，ES6模块输入的是值的引用。
  - CommonJS模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
  - ES6模块运行机制和CommonJS不一样，JS引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块
- CommonJS模块是运行时加载，ES6模块是编译时输出接口。
  - 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”
  - 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”
