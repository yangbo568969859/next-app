# 设计模式

## 什么是设计模式

模式是一种可复用的解决方案，用于解决软件设计中遇到的常见问题

换个通俗的说法：设计模式是解决某个特定场景下对各种问题的解决方案，因此，当我们遇到合适的场景，我们可能会条件反射一样自然而然想到符合这种场景的设计模式

就好比我们新玩的一个游戏，游戏有很多关卡，每个关卡都用了很长时间，等你所有关卡都通关之后，如果你第二次再去玩，你基本就知道每一关怎么通关最快，心里就有了自己的游戏攻略；在程序的世界，编程的“套路”就是设计模式

在将函数作为一等公民的对象语言中，有许多需要利用对象多态性的设计模式

## 设计模式分类

### 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点

实现方式是用一个变量先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这样就确保了一个类只有一个实例对象

单例模式适用于全局只能有一个实例对象的场景 单例模式的一般结构

```javascript
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this
    }
    return Singleton.instance
  }
}
const single1 = new Singleton()
const single2 = new Singleton()
console.log(single1 === single2) // true
```

利用闭包实现单例模式

```html
<button id="create">
  点击创建新窗口
</button>
<button id="hide">
  点击隐藏
</button>
```

```javascript
const create = document.querySelector('#create')
const createWindow = (() => {
  let div = null
  return (words) => {
    if (!div) {
      div = document.createElement('div')
      div.innerHTML = words || '我是默认的语句'
      div.className = 'common-box'
      div.style.cssText = "width: 200px; height: 200px; background: red; display: none"
      document.body.appendChild(div)
    }
    return div
  }
})()

// 创建
create.addEventListener('click', ()=>{
  let box = createWindow('content')
  box.style.display = 'block'
}, false)

//隐藏
document.querySelector('#hide').addEventListener('click', ()=>{
  document.querySelector('.common-box').style.display = 'none'
}, false)
```

vuex 和 vue-router中对单例模式的使用

```javascript
let _Vue
function install(Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue
  // ...
}
// 我们一般在main.js通过 Vue.use(Router) 来使用vue-router，每次会去执行 install 方法，
// 如果不小心多次调用 Vue.use(Router)就会造成install执行多次，如果没有处理的话，
// 就会产生数据不同步的问题，vue-router 在每次调用 install 方法的时候，
// 就将 installed 属性改为true，并且记录了当前的Vue，下次重复调用 install 的时候会直接return
```

应用场景

- 登录模态窗口
- vuex redux
- vue jquery

### 责任链模式

使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止

![modinum-01](/static/responsibility-01.png)

经典案例

场景: 某电商针对已付过定金的用户有优惠政策, 在正式购买后, 已经支付过 500 元定金的用户会收到 100 元的优惠券, 200 元定金的用户可以收到 50 元优惠券, 没有支付过定金的用户只能正常购买。

- orderType: 表示订单类型, 1: 500 元定金用户；2: 200 元定金用户；3: 普通购买用户
- pay: 表示用户是否已经支付定金, true: 已支付；false: 未支付
- stock: 表示当前用于普通购买的手机库存数量, 已支付过定金的用户不受此限制

未优化的代码

```javascript
var order = function(orderType, pay, stock){
  if (orderType === 1) { // 500 元定金购买模式
    if (pay === true) { // 已支付定金
      console.log( '500 元定金预购, 得到 100 优惠券' )
    } else { // 未支付定金，降级到普通购买模式
      if (stock > 0) { // 用于普通购买的手机还有库存
        console.log( '普通购买, 无优惠券' )
      } else {
        console.log( '手机库存不足' )
      } 
    }
  } else if (orderType === 2) { 
      if (pay === true) { // 200 元定金购买模式
        console.log( '200 元定金预购, 得到 50 优惠券' ); 
      } else {
        if (stock > 0) {
          console.log( '普通购买, 无优惠券' )
        } else {
          console.log( '手机库存不足' )
        } 
      }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log( '普通购买, 无优惠券' )
    } else {
      console.log( '手机库存不足' )
    }
  } 
};
order( 1 , true, 500); // 输出: 500 元定金预购, 得到 100 优惠券
```

优化后的代码

```javascript
const order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购, 得到 100 元优惠券');
  } else {
    return 'nextSuccessor'
  }
}
const order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购, 得到 100 元优惠券');
  } else {
    return 'nextSuccessor'
  }
}
const orderCommon = function(orderType, pay, stock) {
  if ((orderType === 3 || !pay) && stock > 0) {
    console.log('普通购买, 无优惠券')
  } else {
    console.log('库存不够, 无法购买')
  }
}
// 创建一个链条的函数或类
const Chain = function(fn){
  this.fn = fn
  this.successor = null
};
Chain.prototype.setNextSuccessor = function(successor){ 
  return this.successor = successor
};
Chain.prototype.passRequest = function(){
  const ret = this.fn.apply( this, arguments )
  if (ret === 'nextSuccessor'){
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }
  return ret
};
const chainOrder500 = new Chain(order500) // 实例化500节点
const chainOrder200 = new Chain(order200)
const chainOrderCommon = new Chain(orderCommon)
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderCommon)

chainOrder500.passRequest(1, true, 500)   // 输出: 500 元定金预购, 得到 100 元优惠券
chainOrder500.passRequest(2, true, 500)   // 输出: 200 元定金预购, 得到 100 元优惠券
chainOrder500.passRequest(3, true, 500)   // 输出: 普通购买, 无优惠券
chainOrder500.passRequest(1, false, 0)    // 输出: 库存不够, 无法购买
```

责任链模式优缺点

- 优点
  1. 解耦了请求发送者和N个接收者之间的复杂关系可以手动指定起始节点
  2. 使用了责任链模式之后，链中的节点对象可以灵活的拆分重组
- 缺点
  1. 不能保证某个请求一定会被链中的节点处理
  2. 对比较长的职责链，请求的处理可能涉及多个处理对象，系统性能将受到一定影响
  3. 调试不很方便，特别是链条比较长，环节比较多的时候，由于采用了类似递归的方式，调试的时候逻辑可能比较复杂

### 装饰器模式

给一个函数赋能，增强它的某种能力，它能动态的添加对象的行为（动态地给函数赋能）

适用场景：在原有方法保持不变，再挂载其他方法来满足新的需求；实现了函数的解耦，将函数拆分成多个可复用的函数，再将拆分出来的函数挂载到某个函数上，实现相同的效果但增强了复用性

```javascript
// AOP 装饰函数实现
// AOP 指的是面向切面编程
// before前置通知 就是在函数调用前执行
// after 后置通知 就是在函数调用后执行
// around 环绕通知 在方法执行前后分别执行
Function.prototype.before = function (fn) {
  const self = this // 保存原函数引用
  return function () { // 返回包含了原函数和新函数的 '代理函数'
    fn.apply(this, arguments) // 执行新函数，修正this
    return self.apply(this, arguments) // 执行原函数
  }
}
Function.prototype.after = function (fn) {
  const self = this
  return function () {
    const ret = self.apply(this, arguments)
    fn.apply(this, arguments)
    return ret
  }
}
Function.prototype.around = function(beforeFun, afterFun) {
 var _orgin = this
 return function() {
  return _orgin.before(beforeFun).after(afterFun).apply(this, arguments)
 }
}
let func = function () {
  console.log('func')
}
// 声明两个挂载函数
const func1 = function () {
  console.log('func1')
}
const func2 = function () {
  console.log('func2')
}
func = func.before(func1).after(func2)
func()
```

ES7装饰器（Decorator）实现log日志上报，需要使用Babel进行转换

```javascript
class Person {
  @log
  say(nick) {
    return `hi ${nick}`
  }
}

function log(target, name, decriptor){
  var _origin = descriptor.value
  descriptor.value = function(){
    console.log(`Calling ${name} with `, argumants)
    return _origin.apply(null, arguments)
  }

  return descriptor
}

var person = new Person()
person.say('小明')
```

应用场景

- 性能上报
- 异常处理

### 适配器模式

将一个接口转换为用户希望的另一个接口，使接口不兼容的那些类可以继续适用

```javascript
// 老接口
const getCityOld = (function () {
  return [
    {
      name: 'hangzhou',
      id: 1,
    },
    {
      name: 'jinhua',
      id: 2
    }
  ]
})()
// 新接口希望是下面形式 { hangzhou: 1, jinhua: 2 }
const cityAdaptor = (function() {
  const obj = {};
  for(let city of getCityOld) {
    obj[city.name] = city.id
  }
  return obj;
})()

console.log(cityAdaptor) // { hangzhou: 1, jinhua: 2 }
```

由此可以看出

适配器模式主要是用来解决两个已有接口不匹配的问题，它不考虑这些接口是怎么实现的，也不考虑他们将来如何变化。适配器模式不需要改变已有的接口，就能够使它们协同工作

适配器模式的一般结构

```javascript
// 目标接口
class Target {
  request() {
    console.log('Target: The default target\'s behavior.')
    return 'Target: The default target\'s behavior.'
  }
}
// 适配的类
class Adaptee {
  specialRequest() {
    console.log('Adaptee：The default Adaptee\'s behavior. ')
    return 'Adaptee：The default Adaptee\'s behavior. '
  }
}
// 适配器实现
class Adapter extends Target {
  constructor(adaptee) {
    super()
    this.adaptee = adaptee
  }
  request() {
    this.adaptee.specialRequest()
  }
}
let adaptee = new Adaptee();
let adapter = new Adapter(adaptee);
adapter.request();
```

适配器模式优缺点

- 优点
  1. 目标类和适配者类解耦，通过引入一个适配器类或适配器函数来重用现有的类或函数，无需修改原有代码
  2. 增加了类或函数的透明性和复用性，将具体的实现封装在适配器类或函数中，提高了复用性
  3. 灵活性和可扩展性，通过一些配置文件，可以很方便的更换适配器，在不修改源代码基础上增加新的适配器类，符合开放封闭
- 缺点
  1. 过多的使用适配器，会让系统非常零乱

### 中介者模式

中介者模式的作用就是解除对象和对象之间的紧耦合关系，增加一个中介者对象之后，所有的相关对象都通过中介者对象来通信

中介者模式使得网状的多对多关系变成了相对简单的一对多关系

![modinum-01](/static/medium-01.png)![modinum-02](/static/medium-02.png)

举个例子

聊天室的例子

```javascript
// 公共类
function Mediator() {
  const users = []
  return {
    addUser(user) {
      users.push(user)
    },
    publishMessage(msg, recevier) {
      if (recevier) {
        recevier.messages.push(msg)
      } else {
        users.forEach(user => {
          user.messages.push(msg)
        })
      }
    }
  }
}
let mediator = Mediator()
// 成员类
function User(name) {
  this.name = name
  this.messages = []
  mediator.addUser(this)
}
User.prototype.sendMessage = function(msg, receiver) {
  // msg = '[' + this.name + ']: ' + msg
  msg = `[${this.name}]: ${msg}`
 mediator.publishMessage(msg, receiver)
}
let u1 = new User('Jack')
let u2 = new User('Peter')
let u3 = new User('Anna')
u1.sendMessage('Hi, anybody here?')
u2.sendMessage('Hi Jack, nice to meet you.', u1)
u3.sendMessage('Hi Guys!')
```

## 设计模式原则

### 单一职责原则（SRP）

- 一个程序只做好一件事
- 如果功能过于复杂就拆分开，每个部分保持独立
- 单例模式和装饰器模式

### 最少知识原则（LKP）

- 一个软件实体应当尽可能少的与其他实体发生相互作用，最少知识原则要求我们设计程序时，应当尽量减少对象之间的交互
- 体现最多的模式有：中介者模式

### 开放-封闭原则

- 对扩展开放对修改封闭
- 当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，但是不允许改动程序的源代码
- 适配器模式

## 前端设计模式总结

<table><tbody>
  <tr>
    <th>设计模式</th><th>特点</th><th>案例</th>
  </tr>
  <tr>
    <td>单例模式</td>
    <td>一个类只能构造出唯一实例</td>
    <td>弹框层的实践，登录弹窗、vue、jQuery、vuex、redux</td>
  </tr>
  <tr>
    <td>责任链模式</td>
    <td>链式执行后续的条件，直到返回结果为止</td>
    <td>if else 优化</td>
  </tr>
  <tr>
    <td>装饰器模式</td>
    <td>动态地给函数赋能</td>
    <td></td>
  </tr>
  <tr>
    <td>适配器模式</td>
    <td>一种数据结构改成另一种数据结构</td>
    <td>枚举值接口变更</td>
  </tr>
  <tr>
    <td>中介者模式</td>
    <td>增加一个中介者对象，所有的相关对象都通过中介者对象来通信</td>
    <td></td>
  </tr>
  <tr>
    <td>策略模式</td>
    <td>根据不同参数可以命中不同的策略</td>
    <td>动画库里的算法函数</td>
  </tr>
  <tr>
    <td>代理模式</td>
    <td>代理对象和本体对象具有一致的接口</td>
    <td>图片预加载</td>
  </tr>
  <tr>
    <td>迭代器模式</td>
    <td>能获取聚合对象的顺序和元素</td>
    <td>实现迭代器each（forEach）</td>
  </tr>
  <tr>
    <td>发布-订阅模式</td>
    <td>PubSub</td>
    <td>node的EventEmiter</td>
  </tr>
  <tr>
    <td>观察者模式</td>
    <td>当观察对象发生变化时自动调用相关函数</td>
    <td>vue 双向绑定</td>
  </tr>
  <tr>
    <td>命令模式</td>
    <td>不同对象间约定好相应的接口</td>
    <td></td>
  </tr>
  <tr>
    <td>模板方法模式</td>
    <td>父类中定好执行顺序</td>
    <td></td>
  </tr>
</table>
