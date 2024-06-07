---
title: 设计模式概念
description: 设计原则等
date: 2021-04-14
---

# 设计模式概念

## 设计模式

### 创建型(Creational)

主要关注对象的创建过程，旨在提供一种灵活、可复用的对象像创建机制，从而解耦对象的创建和使用。这类设计模式通过某种方式控制对象的创建，以适应不同的应用场景

- 单例模式(Singleton)
- 工厂方法模式(Factory Method)
- 抽象工厂模式(Abstract Factroy)
- 建造者模式(Builder)
- 原型模式(Prototype)

### 结构型(Structural)

主要关注类和对象的组合方式，以获得更大的结构。这类模式通过某种方式组合类或对象，从而形成更加灵活、强大的结构

- 适配器模式(Adapter)
- 桥接模式(Bridge)
- 组合模式(Composite)
- 装饰模式(Decorator)
- 外观模式(Facade)
- 享元模式(Flyweight)
- 代理模式(Proxy)

### 行为型(Behavioral)

主要关注对象之间的通信和交互方式，以实现更加灵活、可扩展的行为。这类模式通过某种方式定义对象之间的交互，从而实现特定的行为

- 责任链模式(Chain of Responsibility)
- 命令模式(Command)
- 解释器模式(Interpreter)
- 迭代器模式(Iterator)
- 中介者模式(Mediator)
- 备忘录模式(Memento)
- 观察者模式(Observer)
- 状态模式(State)
- 策略模式(Strategy)
- 模板方法模式(Template Method)
- 访问者模式(Visitor)

## 设计原则

### 单一职责原则(Single Responsibility)

一个类应该只有一个引起它变化的原因，也就是说：一个类应该只负责一项职责

### 开闭原则(Open-Closed)

软件实体(类、模块、函数等)应该对扩展开放，对修改关闭。也就是说应该通过扩展的方式来实现对原有类功能的扩展，而不要修改原有的代码

### 依赖倒置原则(Dependency Inversion)

高层模块不应该依赖于低层模块，两者都应该依赖于抽象。抽象不应该依赖于细节，细节应该依赖于抽象。也就是说：应该通过抽象来解耦模块之间的依赖关系

### 接口隔离原则(Interface Segregation)

客户端不应该依赖于它不需要的接口，也就是说：应该将大的接口拆分成小的、特定的接口，以避免客户端依赖不需要的方法

### 迪米特法则(Low of Demeter)

最少知道原则，一个对象应该对其他对象保持最少的了解。也就是说：一个对象应该只与其直接相关的对象进行交互，而不应该与间接相关的对象进行交互

### 里氏替换原则(Liskov Substitution)

子类应该可以替换其基类，而不影响程序的正确性。也就是说：子类应该遵循基类的契约，保证可以在不修改程序的情况下替换基类

## 模式介绍

## 创建型模式

### 单例模式

确保一个类只有一个实例，并提供一个全局访问点来访问这个实例

Singleton(单例)：定义一个Instance操作，允许客户端访问它的唯一实例

### 建造者模式

允许你分步骤构建复杂对象，允许你使用相同的构建代码生成不同类型和形式的对象

包含角色

- Builder(抽象建造者) 为创建一个产品对象的各个部件指定抽象接口
- ConcreteBuilder(具体建造者) 实现Builder接口，构造和装配各个部件
- Product(产品) 表示被构造的复杂对象。包含多个组成部件的复杂对象
- Director(指挥者) 构建一个使用Builder接口的对象。主要用于创建一个复杂的对象，两个作用：一是隔离了客户与对象的生产过程，二是负责控制产品对象的生产过程

工作流程

- 客户端创建Director对象，并将具体建造者对象传入Director
- Director通知建造者开始建造，Director会调用建造者的建造方法，完成复杂对象的建造
- 建造完成后，建造者将复杂对象返回给Director，然后Director将复杂对象返回给客户端

优点

- 建造者独立易扩展
- 便于控制细节风险
- 可以对建造过程进行更精细的控制
- 可以更改产品的内部表示

使用场景

- 需要生成的对象具有复杂的内部结构
- 需要生曾的对象内部属性本身相互依赖
- 与不可变对象配合使用，因为不可变对象一旦创建就不可更改，所以通过建造者模式可以方便地创建不同配置地不可变对象

建造者模式与工厂模式的区别在于：建造者模式更加关注零件装配的顺序,而工厂模式更注重零件的创建

## 结构型

### 装饰模式

允许向一个现有的对象添加新的功能，同时又不改变其结构

核心思想是动态地给一个对象添加一些额外地职责，就增加功能来说：装饰模式相比生成子类更加灵活。装饰模式以对客户端透明地方式动态地给一个对象附加更多责任。换言之：客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不需要创造更多子类的情况下，将对象地功能加以扩展

包含角色

- Component(抽象组件) 定义一个对象接口，可以给这些对象动态地添加职责
- Concrete Component(具体组件) 定义一个对象，可以给这个对象添加一些职责
- Decotator(抽象装饰类) 维持一个指向组件对象地指针，并定义一个与组件接口一致的接口
- Concrete Decotator(具体装饰类) 向组件添加职责

工作流程

```js
// 举例：向咖啡中加配料更新价格
// 抽象组件：饮料
class Beverage {
  constructor() {
    if (new.target === Beverage) {
      throw new Error("Beverage is an abstract class.");
    }
  }

  getDescription() {
    throw new Error("Method 'getDescription()' must be implemented.");
  }

  cost() {
    throw new Error("Method 'cost()' must be implemented.");
  }
}
// 具体组件：浓缩咖啡
class Espresso extends Beverage {
  getDescription() {
    return "Espresso";
  }

  cost() {
    return 1.99;
  }
}
// 抽象装饰类：调料
class CondimentDecorator extends Beverage {
  constructor(beverage) {
    super();
    if (new.target === CondimentDecorator) {
      throw new Error("CondimentDecorator is an abstract class.");
    }
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription();
  }

  cost() {
    return this.beverage.cost();
  }
}
// 具体装饰类：摩卡
class Mocha extends CondimentDecorator {
  getDescription() {
    return `${this.beverage.getDescription()}, Mocha`;
  }

  cost() {
    return this.beverage.cost() + 0.2;
  }
}
class Milk extends CondimentDecorator {
  getDescription() {
    return `${this.beverage.getDescription()}, Milk`;
  }

  cost() {
    return this.beverage.cost() + 0.1;
  }
}
// 客户端代码
let beverage = new Espresso();
console.log(`${beverage.getDescription()} $${beverage.cost()}`);
beverage = new Mocha(beverage);
console.log(`${beverage.getDescription()} $${beverage.cost()}`);
beverage = new Milk(beverage);
console.log(`${beverage.getDescription()} $${beverage.cost()}`);
```

优点

- 装饰类和被装饰类可以独立发展，不会相互耦合，装饰模式是继承的一个替代模式，装饰模式可以动态扩展一个实现类的功能
- 通过使用不同的具体装饰类以及这些装饰类的排列组合，可以创造出很多不同行为的组合
- 装饰模式完全遵守开闭原则，对现有代码的修改是关闭的，对扩展时开放的

缺点

- 会产生很多小对象，过度使用会让程序变得复杂
- 装饰模式相对于继承更加灵活，但是也更加容易出错

使用场景

- 需要扩展一个类的功能,或给一个类添加附加职责
- 需要动态的给一个对象添加功能,这些功能可以再动态的撤销
- 需要增加由一些基本功能的排列组合而产生的非常大量的功能,从而使继承关系变的不现实

实际例子

- Java I/O 类:Java的I/O类广泛使用了装饰模式。例如,BufferedInputStream是一个装饰类,它装饰了InputStream类,为其添加了缓冲功能。类似地,DataInputStream、LineNumberInputStream等都是装饰类
- Web服务器请求处理:在Web服务器中,可以使用装饰模式来处理请求。例如,可以有一个基本的请求处理组件,然后使用装饰器来添加日志记录、身份验证、数据压缩等功能
- 图形用户界面:在图形用户界面中,可以使用装饰模式来添加滚动条、边框等装饰。例如,在Java Swing中,JScrollPane是一个装饰类,它可以给其他组件添加滚动条
- 游戏角色装备:在游戏中,可以使用装饰模式来表示角色的装备。例如,可以有一个基本的角色类,然后使用装饰器来添加武器、盔甲等装备,每个装备都会影响角色的属性和行为

```js
// 抽象组件：角色
class Character {
  constructor(name) {
    this.name = name;
  }

  getAttack() {
    return 10;
  }

  getDefense() {
    return 10;
  }

  getDescription() {
    return `${this.name}`;
  }
}
// 抽象装饰类: 装备
class EquipmentDecorator extends Character {
  constructor(character) {
    super();
    this.character = character;
  }

  getAttack() {
    return this.character.getAttack();
  }

  getDefense() {
    return this.character.getDefense();
  }

  getDescription() {
    return this.character.getDescription();
  }
}
// 具体装饰类：武器
class WeaponDecorator extends EquipmentDecorator {
  constructor(character, weaponName, attactBonus) {
    super(character);
    this.weaponName = weaponName;
    this.attactBonus = attactBonus;
  }

  getAttack() {
    return super.getAttack() + this.attactBonus;
  }

  getDescription() {
    return `${super.getDescription()}, Weapon: ${this.weaponName}`
  }
}
// 具体装饰类:盔甲
class ArmorDecorator extends EquipmentDecorator {
  constructor(character, armorName, defenseBonus) {
    super(character);
    this.armorName = armorName;
    this.defenseBonus = defenseBonus;
  }

  getDefense() {
    return super.getDefense() + this.defenseBonus;
  }

  getDescription() {
    return `${super.getDescription()}, Armor: ${this.armorName}`;
  }
}
// 客户端代码
let character = new Character("Warrior");
console.log(character.getDescription());
console.log(`Attack: ${character.getAttack()}, Defense: ${character.getDefense()}`);

character = new WeaponDecorator(character, "Sword", 5);
console.log(character.getDescription());
console.log(`Attack: ${character.getAttack()}, Defense: ${character.getDefense()}`);

character = new ArmorDecorator(character, "Shield", 3);
console.log(character.getDescription());
console.log(`Attack: ${character.getAttack()}, Defense: ${character.getDefense()}`);
```

### 适配器模式

适配器模式允许一个类接口转换成客户端所期望地另一种接口，从而使原本由于接口不兼容而无法一起工作的类能一起工作

核心思想是将一个类的接口包装在一个新的适配器类中，从而使其与其他类兼容。适配器模式分为类适配器和对象适配器；类适配器通过继承实现，对象适配器通过组合实现

包含角色

- Target(目标接口) 定义客户端使用的特定领域相关的接口
- Adaptee(适配者类) 需要适配的类
- Adapter(适配器) 通过包装一个适配者对象，把适配者接口转换成目标接口，让客户端可以通过目标接口调用适配者类

工作流程

```js
// 目标接口:新的温度计接口
class NewThermometer {
  constructor() {
    console.log('target', new.target)
    if (new.target === NewThermometer) {
      throw new Error("NewThermometer cannot be instantiated directly");
    }
  }

  getTemperature () {
    throw new Error("Method 'getTemperature()' must be implemented.");
  }
}
// 适配者类 旧的温度计
class OldThermometer {
  constructor() {
    this.themperature = 0;
  }

  setTemperture(temperature) {
    this.temperature = temperature;
  }

  getTemperatureInFahrenheit() {
    return this.temperature;
  }
}
// 适配器:将旧温度计适配到新温度计接口

class ThermometerAdapter extends NewThermometer {
  constructor(oldThermometer) {
    super()
    this.oldThermometer = oldThermometer;
  }

  getTemperature() {
    const temperatureInFahrenheit = this.oldThermometer.getTemperatureInFahrenheit();
    const temperatureInCelsius = (temperatureInFahrenheit - 32) * 5 / 9;
    return temperatureInCelsius;
  }
}
// 客户端代码
function clientCode (thermometer) {
  console.log(`Temperature: ${thermometer.getTemperature()}°C`);
}
const oldThermometer = new OldThermometer();
oldThermometer.setTemperture(98.6);

const newThermometer = new ThermometerAdapter(oldThermometer);
clientCode(newThermometer);
// 在这个例子中,NewThermometer是目标接口,定义了新的温度计应该具有的接口。OldThermometer是适配者类,表示旧的温度计,它使用华氏度表示温度。ThermometerAdapter是适配器,它包装了一个OldThermometer对象,并将其接口转换为NewThermometer接口,将华氏度转换为摄氏度
```

优点

- 可以让任何两个没有关联的类一起运行
- 增加了类的透明度，对于客户端来说，适配器是透明的
- 灵活性好，适配器可以新增和移除，不影响客户端

缺点

- 过多的使用适配器，会让系统非常凌乱，不易整体进行把控。比如明明看到的是A接口，其实内部被适配成了B接口的实现
- 适配器模式的代码复杂度增加，需要额外的代码来实现适配

使用场景

- 系统需要使用现有的类,而此类的接口不符合系统的需要
- 想要建立一个可以重复使用的类,用于与一些彼此之间没有太大关联的一些类一起工作
- 需要一个统一的输出接口,而输入端的类型不可预知

### 组合模式

组合模式是一种结构型设计模式，它允许你将对象组合成树形结构来表现 “部分-整体” 的层次关系。组合模式使得客户端对单个对象和组合对象的使用具有一致性

组合模式的核心思想是定义一个抽象的组件接口，让单个对象和组合对象都实现这个接口。这样，客户端就可以一致的对待单个对象和组合对象，而不必关心他们的具体类型

包含角色

- Component(组件) 定义组合中所有对象的通用接口，并为所有类声明一个接口用于访问和管理它的子组件
- Leaf(叶子) 在组合中表示叶子节点，叶子节点没有子节点
- Composite(组合) 定义所有子部件的那些部件的行为，存储子部件，在组件接口中实现与子部件有关的操作

实现方式

- 透明式(Transparent) 在透明式组合模式中,组合类和叶子类都实现相同的接口。这使得客户端可以以相同的方式对待组合对象和叶子对象,而不需要区分它们的差异
- 安全式(Safe) 组合类和叶子类实现不同的接口。组合类实现了管理子组件的方法,而叶子类则不实现这些方法。这样可以确保客户端代码不会尝试在叶子对象上执行不适用的操作

工作流程

```js
// 下面是一个使用JavaScript实现的组合模式的例子,演示了如何使用组合模式来表示文件系统中的目录和文件
class FileSystemItem {
  constructor(name) {
    this.name = name;
  }

  display() {
    throw new Error("Method 'display()' must be implemented.");
  }
}
// 叶子：文件
class File extends FileSystemItem {
  contructor(name) {
    super(name);
  }

  display() {
    console.log(`Displaying file ${this.name}`);
  }
}
// 组合：目录
class Directory extends FileSystemItem {
  constructor(name) {
    super(name);
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  display() {
    console.log(`Directory: ${this.name}`);
    for (const item of this.items) {
      item.display();
    }
  }
}

// 客户端代码
function clientCode () {
  const root = new Directory("root");
  const dir1 = new Directory("dir1");
  const dir2 = new Directory("dir2");

  const file1 = new File("file1.txt");
  const file2 = new File("file2.txt");
  const file3 = new File("file3.txt");

  root.add(dir1);
  root.add(dir2);
  root.add(file1);

  dir1.add(file2);
  dir2.add(file3);

  root.display();
}

clientCode();
```

优点

- 客户端可以一致地对待单个对象和组合对象
- 组合模式使得在组合体内加入新组件很容易，客户端不会察觉到组合体内部地数据变化
- 组合模式提供了一种灵活地方式来构建复杂地树形结构并可以方便地对整个结构进行操作

缺点

- 某些情况下，组合模式会使设计变得过于一般化，导致系统中出现大量地小类，增加了系统地复杂度
- 组合模式地叶子和组合类需要实现相同地接口，这可能会带来一些额外地工作量

使用场景

- 你想表示对象的部分-整体层次结构
- 你希望客户端能够忽略组合对象与单个对象的不同,客户端将统一地使用组合结构中的所有对象

### 桥接模式

桥接模式是一个结构性设计模式，它将抽象部分和实现部分分离，使他们都可以独立地变化。这种分离可以在程序运行时刻实现，也可以在编译时实现。桥接模式通过提供抽象化和现实化之间地桥接结构，来实现二者地解耦

包含角色

- Abstration(抽象化) 定义抽象类的接口，它一般是抽象类而不是接口，其中定义了一个Implementor类型的对象并可以维护该对象，它与Implementor之间具有关联关系，它即可易包含抽象的业务方法，也可以包含具体的业务方法
- RefinedAbstraction(具体抽象化)  扩充由Abstration定义的接口，通常情况下它不再是抽象类而是具体类。它实现了Abstration中声明的抽象业务方法。在RefinedAbstraction可以调用在 Implementor 中定义的业务方法
- Implementor(实现化接口) 定义实现类的接口，这个接口不一定要与 Abstraction 的接口完全一致，事实上这两个接口可以完全不同，一般而言，Implementor 接口仅提供基本操作，而 Abstraction 定义的接口可能会做更多更复杂的操作。Implementor 接口对这些基本操作进行了声明，而具体实现交给其子类。通过关联关系，在 Abstraction 中不仅拥有自己的方法，还可以调用到 Implementor 中定义的方法
- 具体实现化(Concrete Implementor)：实现实现化角色，定义具体的实现。

工作流程

```js
// 下面是一个简单的例子，演示了一个绘图应用,它可以使用不同的渲染器(如SVG、Canvas)来绘制不同的形状(如圆形、矩形)。
// 实现化角色
class Renderer {
  constructor() {
    if (new.target === Renderer) {
      throw new Error("Cannot instantiate abstract class.");
    }
  }

  renderCircle(radius) {

  }

  renderRect(width, height) {

  }
}
// 具体化实现角色：SVG渲染器
class SVGRenderer extends Renderer {
  renderCircle(radius) {
    console.log(`Rendering a circle with radius ${radius} using SVG.`);
  }

  renderRect(width, height) {
    console.log(`Rendering a rectangle with width ${width} and height ${height} using SVG.`);
  }
}
// 具体实现化角色:Canvas渲染器
class CanvasRenderer extends Renderer {
  renderCircle(radius) {
    console.log(`Rendering a circle with radius ${radius} using Canvas.`);
  }

  renderRect(width, height) {
    console.log(`Rendering a rectangle with width ${width} and height ${height} using Canvas.`);
  }
}
// 抽象化角色:形状
class Shape {
  constructor(renderer) {
    this.renderer = renderer
  }
}
// 修正抽象化角色：圆形
class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }

  draw() {
    this.renderer.renderCircle(this.radius);
  }
}
// 修正抽象化角色:矩形
class Rect extends Shape {
  constructor(renderer, width, height) {
    super(renderer);
    this.width = width;
    this.height = height;
  }

  draw() {
    this.renderer.renderRect(this.width, this.height);
  }
}

// 客户端代码
function clientCode () {
  const svgRenderer = new SVGRenderer();
  const canvasRenderer = new CanvasRenderer();

  const svgCircle = new Circle(svgRenderer, 100);
  const svgRect = new Rect(svgRenderer, 100, 200);
  const canvasCircle = new Circle(canvasRenderer, 100);
  const canvasRect = new Rect(canvasRenderer, 100, 200);

  svgCircle.draw();
  svgRect.draw();
  canvasCircle.draw();
  canvasRect.draw();
}

clientCode();

// Renderer是实现化角色,定义了渲染器的接口。
// SVGRenderer和CanvasRenderer是具体实现化角色,实现了具体的渲染方法。
// Shape是抽象化角色,持有一个渲染器的引用。
// Circle和Rect是修正抽象化角色,继承自Shape,并定义了具体的绘制方法。

// Rendering a circle with radius 5 using SVG.
// Rendering a rectangle with width 10 and height 20 using SVG.
// Rendering a circleRendering a circle with radius 8 using Canvas.
// Rendering a rectangle with width 15 and height 30 using Canvas.

// 如果我们想要添加一个新的渲染器(如WebGL渲染器),只需要创建一个新的WebGLRenderer类,实现Renderer接口,而不需要修改任何形状的代码

class WebGLRenderer extends Renderer {
  renderCircle(radius) {
    console.log(`Rendering a circle with radius ${radius} using WebGL.`);
  }

  renderRect(width, height) {
    console.log(`Rendering a rectangle with width ${width} and height ${height} using WebGL.`);
  }
}

// 客户端代码
const webglRenderer = new WebGLRenderer();
const webglCircle = new Circle(webglRenderer, 6);
const webglRect = new Rect(webglRenderer, 12, 24);

webglCircle.draw();
webglRect.draw();

// 同样地,如果我们想要添加一个新的形状(如三角形),只需要创建一个新的Triangle类,继承自Shape,并实现draw()方法,而不需要修改任何渲染器的代码
class Triangle extends Shape {
  constructor(renderer, base, height) {
    super(renderer);
    this.base = base;
    this.height = height;
  }

  draw() {
    console.log(`Rendering a triangle with base ${this.base} and height ${this.height}.`);
    // 使用渲染器绘制三角形...
  }
}
```

优点

- 分离抽象和实现，使他们可以独立变化
- 提高了系统的可扩展性
- 符合开闭原则
- 符合合成复用原则

缺点

- 会增加系统的理解和设计难度
- 要求正确识别出系统中两个独立变化的维度，因此其使用范围具有一定的局限性

### 享元模式

享元模式主要目标是使用共享技术有效地支持大量细粒度地对象，这种模式可以帮助节省内存，特别是在处理大量相似对象的情况下

主要思想是将一个对象的状态分为内部状态和外部状态，内部状态是对象共享出来的信息，存储在享元对象内部并且不会随着环境改变而改变；外部状态是对象得以依赖的一个标记，是随环境改变而改变的、不可以共享的状态

示例

```js

```

### 外观模式

它为复杂的子系统提供一个简化的接口，使得客户端可以更方便的使用这些子系统

外观模式提供了一种简化复杂子系统访问的方法，它在客户端和子系统之间引入了一个外观对象，将客户端的请求委托给适当的子系统对象。这样可以简化客户端的代码，并将客户端与子系统解耦

包含角色

- Facade(外观)：提供一个统一的接口，用于访问子系统中的一群接口，外观定义了一个高层接口，让子系统更容易使用
- SubSystems(子系统)：实现系统的功能，能处理Facade对象指派的工作，子系统类不知道Facade的存在，也没有对Facade的引用

工作流程

- 客户端通过外观接口调用子系统的功能
- 外观将客户端的请求转发给相应的子系统对象
- 子系统完成相应的工作，并将结果返回给外观
- 外观将结果返回给客户端

```js
// 子系统类
// DVD播放
class DVDPlayer {
  on () {
    console.log('DVD Player is on');
  }

  play (movie) {
    console.log(`Playing movie: ${movie}`);
  }

  stop () {
    console.log('DVD player stopped');
  }

  off () {
    console.log('DVD player is off');
  }
}
// 投影
class Projector {
  on () {
    console.log('Projector is on');
  }

  wideScreenMode () {
    console.log('Projector in widescreen mode');
  }

  off () {
    console.log('Projector is off');
  }
}
// 环绕立体声
class SurroundSoundSystem {
  on() {
    console.log('Surround sound system is on');
  }

  setVolume(volume) {
    console.log(`Setting volume to ${volume}`);
  }

  off() {
    console.log('Surround sound system is off');
  }
}
// 外观类
class HomeTheaterFacade {
  constructor(devplayer, projector, soundSystem) {
    this.dvdPlayer = devplayer;
    this.projector = projector;
    this.soundSystem = soundSystem;
  }

  watchMovie(movie) {
    console.log('Get ready to watch a movie...');
    this.dvdPlayer.on();
    this.projector.on();
    this.projector.wideScreenMode();
    this.soundSystem.on();
    this.soundSystem.setVolume(5);
    this.dvdPlayer.play(movie);
  }

  endMove () {
    console.log('Shutting movie theater down...');
    this.dvdPlayer.stop();
    this.dvdPlayer.off();
    this.projector.off();
    this.soundSystem.off();
  }
}
// 客户端代码
const devPlayer = new DVDPlayer();
const projector = new Projector();
const soundSystem = new SurroundSoundSystem();

const homeTheater = new HomeTheaterFacade(devPlayer, projector, soundSystem);

homeTheater.watchMovie('Titanic');
homeTheater.endMove();
```

优点

- 让自己的代码独立于复杂子系统
- 减少客户端代码与子系统之间的依赖关系，从而使客户端代码更容易维护和修改
- 将客户端代码与子系统的实现细节隔离开来，从而使客户端代码更加健壮和稳定
- 提供一个简单的接口来访问复杂的子系统，从而使客户端代码更加简洁和易于理解

缺点和限制

- 外观类可能会变得过于复杂，尤其是当它需要处理许多子系统时。这可能会使外观类本身难以维护和修改
- 外观模式可能会引入不必要的间接性，尤其是当客户端代码只需要使用一个或几个子系统时。在这种情况下，直接使用子系统可能会更加简单和高效
- 如果子系统的接口发生变化，外观类也需要相应地进行修改。这可能会导致外观类的修改影响到所有使用它的客户端代码

使用场景

- 当你需要为一个复杂子系统提供一个简单接口时
- 当你想将子系统组织成层次结构时

### 代理模式

为另一个对象提供一个替身或占位符以控制对这个对象的访问。代理对象在客户端和目标对象之间起到中介作用，它可以在目标对象被访问之前或之后增加一些额外的处理

包含角色

- Subject(抽象主题) 定义了RealSubject和Proxy的公用接口，这样就可以在任何使用RealSubject的地方都可以使用Proxy
- RealSubject(真实主题) 定义了Proxy所代表的真实对象
- Proxy(代理) 保存一个引用使得代理可以访问实体，并提供一个与Subject相同的接口，这样代理就可以用来替代实体

工作流程

- 客户端通过代理对象调用请求
- 代理对象在调用真实主题之前或之后可以添加一些额外的处理
- 代理对象将请求传递给真实主题对象
- 真实主题对象处理请求并返回结果给代理对象
- 代理对象可以在返回结果给客户端之前再次添加一些额外的处理

```js
// 抽象主题
class Image {
  display () {}
}
// 真实主题
class RealImage extends Image {
  constructor(fileName) {
    super()
    this.fileName = fileName
    this.loadFromDisk(fileName)
  }

  display () {
    console.log(`Displaying ${this.fileName}`);
  }

  loadFromDisk () {
    console.log(`Loading ${this.fileName}`);
  }
}
// 代理类
class ProxyImage extends Image {
  constructor(fileName) {
    super()
    this.fileName = fileName
    this.realImage = null
  }

  display () {
    if (!this.realImage) {
      this.realImage = new RealImage(this.fileName)
    }
    this.realImage.display()
  }
}
// 客户端
const image = new ProxyImage('test_10mb.jpg')
// 第一次调用 display 方法，将触发真实图像的加载
image.display();
// 第二次调用 display 方法，不会触发真实图像的加载，因为它已经被加载过了
image.display();
```

使用场景

- 延迟加载（虚拟代理）：如上面的例子所示，代理可以延迟对象的创建和加载，直到真正需要时才进行。这可以提高系统的性能和响应速度
- 访问控制（保护代理）：代理可以控制对真实对象的访问权限，例如检查客户端是否有权限调用某个方法
- 远程代理：代理可以用于在不同的地址空间中表示一个对象，例如在分布式系统中。4. 记录日志（日志代理）：代理可以在调用真实对象的方法时记录一些日志信息，例如方法的调用时间、参数和返回值等。这可以用于调试、性能分析和审计等目的
- 智能引用：代理可以在真实对象被频繁访问时缓存其结果，或者在真实对象不再被使用时将其释放以节省内存

缺点

- 代理类需要实现与真实主题相同的接口，这可能会导致代码重复
- 代理类的引入可能会增加系统的复杂性和开销，尤其是在代理链较长的情况下
- 某些代理（如保护代理）可能会过度限制客户端对真实对象的访问，从而降低系统的灵活性

## 行为型模式

### 观察者模式

定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象，这个主题对象在状态发生变化时，会通知所有观察者对象，使他们能够主动更新自己

核心思想：当一个对象的状态发生变化时，所有依赖它的对象都得到通知并被自动更新。这种交互也称为 发布-订阅模式。观察者模式可以实现表示层和数据逻辑层的分离，并在观察目标和观察者之间建立一个抽象的耦合，观察者支持广播通信，观察目标会向所有登记过的观察者发出通知

包含角色

- Subject(主题) 也被称为观察者或可观察对象，它是指被观察的对象。主题提供了一个接口，可以增加和删除观察者对象
- Concrete Subject(具体主题) 主题的具体实现。当主题的状态发生变化时，所有注册过的观察者都会收到通知
- Observer(观察者) 将对观察主题的改变做出反应的对象
- Concrete Observer(具体观察者) 观察者的具体实现，它维护一个指向具体主题对象的引用，存储有关状态，这些状态应与主题的状态保持一致，并实现Observer的更新接口以使自己状态和主题状态保持一致

工作流程

```js
// 天气数据和显示板的交互
// 主题：天气数据
class WeatherData {
  constructor() {
    this.observers = [];
    this.temperature = null;
    this.humidity = null;
    this.pressure = null;
  }

  registerObserver(observer) {
    this.observer.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update())
  }

  measurementsChanged() {
    this.notifyObservers();
  }

  setMeasurements(temperature, humidity, pressure) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.measuredChanged();
  }

  getTemperature() {
    return this.temperature;
  }

  getHumidity() {
    return this.humidity;
  }

  getPressure() {
    return this.pressure;
  }
}
// 观察者：显示面板
class DisplayElement {
  constructor(weatherData) {
    this.weatherData = weatherData;
    this.temperature = null;
    this.humidity = null;
    this.pressure = null;
    this.weatherData.registerObserver(this);
  }

  update() {
    this.temperature = this.weatherData.getTemperature();
    this.humidity = this.weatherData.getHumidity();
    this.pressure = this.weatherData.getPressure();
    this.display();
  }

  display() {
    console.log(`Temperature: ${this.temperature}°C, Humidity: ${this.humidity}%, Pressure: ${this.pressure}hPa`);
  }
}

// 客户端// 客户端代码
const weatherData = new WeatherData();
const displayElement1 = new DisplayElement(weatherData);
const displayElement2 = new DisplayElement(weatherData);

weatherData.setMeasurements(25, 65, 1013);
weatherData.setMeasurements(26, 70, 1015);

weatherData.removeObserver(displayElement2);

weatherData.setMeasurements(27, 75, 1020);

// Temperature: 25°C, Humidity: 65%, Pressure: 1013hPa
// Temperature: 25°C, Humidity: 65%, Pressure: 1013hPa
// Temperature: 26°C, Humidity: 70%, Pressure: 1015hPa
// Temperature: 26°C, Humidity: 70%, Pressure: 1015hPa
// Temperature: 27°C, Humidity: 75%, Pressure: 1020hPa
```

优点

- 观察者和被观察者是抽象耦合的
- 建立一套触发机制

缺点

- 如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间
- 如果在观察者和观察目标之间有循环依赖的话,观察目标会触发它们之间进行循环调用,可能导致系统崩溃
- 观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的,而仅仅只是知道观察目标发生了变化

使用场景

- 一个抽象模型有两个方面,其中一个方面依赖于另一个方面。将这些方面封装在独立的对象中使它们可以各自独立地改变和复用
- 一个对象的改变将导致其他一个或多个对象也发生改变,而不知道具体有多少对象将发生改变,可以降低对象之间的耦合度
- 一个对象必须通知其他对象,而并不知道这些对象是谁
- 需要在系统中创建一个触发链,A对象的行为将影响B对象,B对象的行为将影响C对象……,可以使用观察者模式创建一种链式触发机制

实例

- 图形用户界面:当一个控件的状态发生改变时,其他控件需要自动更新。例如,当一个按钮被点击时,其他控件需要响应这个事件
- 事件管理:在事件驱动的系统中,观察者模式可以用来管理事件和事件的订阅者
- 系统通知:在许多系统中,当某些重要的事情发生时,系统需要通知所有相关的对象。例如,当一个任务完成时,所有等待这个任务的对象都需要得到通知

```js
// 使用观察者模式实现简单的事件管理的例子
// 主题:事件管理器
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventType, listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(listener);
  }

  unsubscribe(eventType, listener) {
    if (this.listeners.has(eventType)) {
      const index = this.listeners.get(eventType).indexOf(listener);
      if (index !== -1) {
        this.listeners.get(eventType).splice(index, 1);
      }
    }
  }

  notify (eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(listener => listener(data));
    }
  }
}
// 观察者：事件监听器
class EventListener {
  constructor(name) {
    this.name = name;
  }

  handleEvent(data) {
    console.log(`${this.name} received: ${data}`);
  }
}

// 客户端代码
const eventManager = new EventManager();

const listener1 = new EventListener("Listener 1");
const listener2 = new EventListener("Listener 2");

eventManager.subscribe("eventA", listener1.handleEvent.bind(listener1));
eventManager.subscribe("eventA", listener2.handleEvent.bind(listener2));
eventManager.subscribe("eventB", listener1.handleEvent.bind(listener1));

eventManager.notify("eventA", "Event A occurred!");
eventManager.notify("eventB", "Event B occurred!");

eventManager.unsubscribe("eventA", listener2.handleEvent);

eventManager.notify("eventA", "Event A occurred again!");

// Listener 1 received: Event A occurred!Listener 2 received: Event A occurred!
// Listener 1 received: Event B occurred!
// Listener 1 received: Event A occurred again!
```

### 备忘录模式

它允许在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便在需要时可以将对象恢复到先前的状态

包含角色

- Originator(发起人) 负责创建一个备忘录，以记录当前自身的内部状态，并可以使用备忘录来恢复内部状态
- Memento(备忘录) 用于存储Originator的内部状态，可以防止Originator以外的对象访问备忘录
- Caretaker(管理者) 负责保存备忘录,但不能对备忘录的内容进行操作或检查

工作流程

- Originator创建一个包含其内部状态的备忘录对象
- Originator将备忘录对象传递给Caretaker保存
- 当需要恢复状态时,Originator从Caretaker获取备忘录对象,并使用其中的状态信息来恢复自身的内部状态

优点

- 提供了一种可以恢复状态的机制,使得用户可以方便地回到某个历史的状态
- 实现了内部状态的封装,除了创建它的发起人之外,其他对象都不能够访问这些状态信息
- 简化了发起人类,发起人不需要管理和保存其内部状态的各个备份,所有状态信息都保存在备忘录中,并由管理者进行管理

使用场景

适用于需要保存和恢复数据的相关状态场景,比如撤销操作、事务管理、游戏存档等。但是如果类的成员变量过多,会占用比较大的资源,而且每一次保存都会消耗一定的内存,这时需要注意程序的性能问题

### 命令模式

它将请求封装成对象，以便使用不同的请求、队列或者日志来参数化其他对象。命令模式也支持可撤销的操作

包含角色

- Command(抽象命令类) 声明执行操作的接口
- ConcreteCommand(具体命令类) 将一个接收者对象绑定于一个动作，调用接收者相应的操作，以实现Execute
- Invoker(调用者) 要求该命令执行这个请求
- Receiver(接收者) 知道如何实施与执行一个请求的相关操作。任何类都可能作为一个接收者
- Client(客户端) 创建一个具体命令对象并确定其接收者

工作流程

- 客户端创建一个具体的命令对象，并设置其接收者
- 调用者得到命令对象，并在某个时刻调用命令对象的执行方法
- 具体命令对象执行命令，将请求转发给其他接收者

```js
// 接收者
class Receiver {
  execute() {
    console.log('Executing a request.');
  }
}
// 抽象命令类
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute() {}
}
// 具体命令类
class ConcreteCommand extends Command {
  execute() {
    console.log('ConcreteCommand: Calling receiver.');
    this.receiver.execute();
  }
}
// 调用者
class Invoker {
  setCommand(command) {
    this.command = command;
  }

  executeCommand() {
    console.log('Invoker: Calling command.');
    this.command.execute();
  }
}
// 客户端
const receiver = new Receiver();
const command = new ConcreteCommand(receiver);
const invoker = new Invoker();

invoker.setCommand(command);
invoker.executeCommand();
```

优点

- 降低系统耦合度
- 新的命令可以很容易添加到系统中
- 可以比较容易地设计一个命令队列和宏命令(组合命令)
- 可以方便地实现对请求地Undo和Redo

使用场景

- 需要抽象出待执行地动作，然后以参数地形式提供出来 - 类似于过程设计中的回调机制，而命令模式正是回调机制的一个面向对象的替代品
- 在不同的时刻指定、排列和执行请求。一个命令对象可以有与初始请求无关的生存期
- 需要支持取消操作
- 支持修改日志功能,这样当系统崩溃时,这些修改可以被重做一遍
- 需要支持事务操作

命令模式将调用操作的对象与知道如何实现该操作的对象解耦,使得调用者和接收者之间没有直接引用,调用者与接收者之间通过命令对象进行交互

### 状态模式

允许一个对象在其内部状态改变时改变时改变它的行为，看起来似乎修改了它的类。在状态模式中，行为是通过状态来定义的，也就是说，每一个状态定义了一组相关的行为

包含角色

- Context(上下文，环境类) 定义客户端需要的接口。维护一个ConcreteState子类的实例，这个实例定义当前状态
- State(抽象状态类) 这是一个抽象类或者接口，定义了所有具体状态的公共接口
- ConcreteState(具体状态类) 这是实现抽象状态定义的接口的类。每一个类封装了一个特定的状态所对应的行为

工作流程

优点

- 封装了转换规则，并且封装状态的行为和状态转换。这样，我们可以通过改变状态来改变对象的行为
- 将特定的状态相关的行为都放入一个对象中，由于所有与状态相关的代码都存在于某个ConcreteState中，所以通过定义新的子类可以很容易地增加新的状态和转换
- 消除了庞大的条件分支语句。状态模式通过把各种状态转移逻辑分布到State的子类之间，来减少相互间的依赖
- 可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数

使用场景

- 当一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为时
- 当一个操作中含有庞大的多分支的条件语句，且这些分支依赖于该对象的状态时。这个状态通常用一个或多个枚举常量表示。通常，有多个操作包含这一相同的条件结构。State模式将每一个条件分支放入一个独立的类中。这使得你可以根据对象自身的情况将对象的状态作为一个对象，这一对象可以不依赖于其他对象而独立变化

### 中介者模式

通过引入一个中介者对象来简化对象之间的通信或交互，这种模式用于系统内部的对象之间的通信，使得这些对象不需要显式的相互引用，从而降低它们之间的耦合度

包含角色

- Mediator
- ConcreteMediator
- Colleague
- ConcreteColleague

工作流程

优点

使用场景

### 模板方法

它在一个方法中定义了一个算法的骨架，将一些步骤推迟到子类中。模板方法允许子类在不改变算法结构的情况下重写算法的特定步骤

包含角色

- 抽象父类：定义一系列方法，这些方法组成了一个算法的框架或模板。这个模板中的一些方法是抽象的，需要子类来提供具体的实现
- 具体子类：子类可以在不改变算法框架的前提下，重写父类的抽象方法来改变算法的某些部分

工作流程

```js
class AbstractClass {
  templateMethod() {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  baseOperation1() {
    console.log('AbstractClass says: I am doing the bulk of the work');
  }

  baseOperation2() {
    console.log(
      'AbstractClass says: But I let subclasses override some operations'
    );
  }

  baseOperation3() {
    console.log(
      'AbstractClass says: But I am doing the bulk of the work anyway'
    );
  }

  requiredOperations1() {}

  requiredOperation2() {}

  hook1() {}

  hook2() {}
}

class ConcreteClass1 extends AbstractClass {
  requiredOperations1() {
    console.log('ConcreteClass1 says: Implemented Operation1');
  }

  requiredOperation2() {
    console.log('ConcreteClass1 says: Implemented Operation2');
  }
}

class ConcreteClass2 extends AbstractClass {
  requiredOperations1() {
    console.log('ConcreteClass2 says: Implemented Operation1');
  }

  requiredOperation2() {
    console.log('ConcreteClass2 says: Implemented Operation2');
  }

  hook1() {
    console.log('ConcreteClass2 says: Overridden Hook1');
  }
}

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass1());
console.log('');

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass2());

function clientCode(abstractClass) {
  abstractClass.templateMethod();
}
// 在这个例子中，AbstractClass 是抽象父类，它定义了一个名为 templateMethod 的模板方法。这个模板方法由一系列的方法组成，其中 requiredOperations1 和 requiredOperation2 是抽象的，需要子类 ConcreteClass1 和 ConcreteClass2 来提供具体的实现
// hook1 和 hook2 是钩子方法，子类可以选择是否覆盖它们
```

优点

- 减少重复代码
- 提高代码复用性并提供了一种很好的代码阻止结构

使用场景

### 策略模式

定义了一系列算法，将每个算法封装起来，并且使它们可以相互替换。策略模式让算法可以独立于使用它的客户端而变化

策略模式提供了一种更清晰、更灵活的方式来组织代码。它将算法的实现和使用分离开来,使得代码更容易理解和维护。同时,它也遵循了开闭原则,你可以引入新的策略而无需修改现有的代码

包含角色

- Strategy(抽象策略类) 定义所有支持算法的公共接口，上下文使用这个接口来调用某个ConcreteStrategy定义的算法
- ConcreteStrategy(具体策略类) 以Strategy接口实现某具体算法
- Context(上下文)：维护一个对Strgtegy对象的引用。可定义一个接口来让Strategy访问它的数据

工作流程

- 客户端创建一个具体的策略对象，将其传给上下文
- 上下文存储对策略对象的引用，上下文不知道具体的策略类，它是通过Strategy接口与所有策略进行交互
- 上下文调用策略对象的执行方法

```js
// 抽象策略类
class CalculationStrategy {
  calculate(price) {}
}
// 具体策略类
class NormalStrategy extends CalculationStrategy {
  calculate(price) {
    return price;
  }
}
// 具体策略类
class DiscountStrategy extends CalculationStrategy {
  calculate(price) {
    return price * 0.8;
  }
}
// 上下文
class PriceContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  calculate(price) {
    return this.strategy.calculate(price);
  }
}
// 客户端
const priceContext = new PriceContext(new NormalStrategy());
console.log(priceContext.calculate(100)); // 100
priceContext.setStrategy(new DiscountStrategy());
console.log(priceContext.calculate(100)); // 80
// 在这个例子中,CalculationStrategy是抽象策略类,它定义了计算价格的接口。NormalStrategy和DiscountStrategy是具体策略类,分别实现了普通计算和打折计算
// PriceContext是上下文,它维护对策略对象的引用,并提供了一个setStrategy方法来动态地改变策略
// 在客户端代码中,我们首先创建了一个使用NormalStrategy的PriceContext,并计算价格,输出为100。然后,我们将策略改为DiscountStrategy,再次计算价格,这次输出为80
// 这个例子展示了策略模式如何让算法可以独立于使用它的客户端而变化。客户端可以在运行时根据需要切换算法,而不需要修改使用算法的代码
```

优点

- 运行时切换对象内的算法
- 将算法的实现和使用算法的代码隔离开来
- 可以使用组合来替代继承
- 开闭原则。你可以在不修改原有代码的情况下引入新的策略

使用场景

- 使用对象中各种不同的算法变体，并希望能在运行时切换算法时
- 有许多仅在执行某些行为时略有不同的相似类时
- 当算法在上下文的逻辑中不是特别重要时，使用策略模式可以将业务逻辑与算法的实现细节隔离开来

### 状态

包含角色

工作流程

优点

使用场景
