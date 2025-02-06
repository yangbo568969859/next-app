---
title: TypeScript常用的工具方法
description: TypeScript常用的工具方法Record、Partial、Required、Readonly、Pick、Omit
date: 2022-01-05
---

# 常用的工具方法Record、Partial、Required、Readonly、Pick、Omit

## keyof、extends、infer

- keyof操作符可以用于获取某种类型的所有键，其返回类型是联合类型
- extends 类继承/类型组合、类型约束和条件类型
- infer 类型推断,它允许我们从现有类型中提取类型信息

```ts
// keyof
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // type PersonKeys = "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const person = { name: 'zhangsan', age: 18, location: 'beijing' };
const name = getProperty(person, 'name');
```

```ts
// extends
// 类型约束
interface Lengthwise {
  length: number;
}
function logLength<T extends Lengthwise>(arg: T) {
  return arg.length; // 属性“length”在类型“T”中不存在。
}
logLength("Hello");    // OK
logLength([1, 2, 3]);  // OK
logLength(123);        // 错误：number 类型没有 length 属性
// 条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type ToArray<T> = T extends any ? T[] : never;
type StrOrNum = ToArray<string | number>; // string[] | number[]

// 类继承/类型组合
interface ChildComponentProps {
  onChange: (val: string)=> void
}

interface ChildComponentProps2 {
  onReset: (value: string)=> void
}

interface ParentComponentProps extends ChildComponentProps, ChildComponentProps2 {
  value: string
}
```

```ts
// infer 用于在条件中推断类型，它允许我们从现有类型中提取类型信息
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function getMessage(): string {
  return 'hello';
}
type MessageType = ReturnType<typeof getMessage>; // string
```

## Record 映射

在ts中，泛型工具类型 `Record<K, T>` 主要用于创建一个给定键类型K映射到值类型T的新类型。该类型的键名由 K 类型决定，而每个属性值则由 T 类型决定

- K 创建的新对象需要有哪些属性，属性可以只有一个，也可以有多个，多个属性时采用“联合类型”的写法
- T 对象属性的类型

源码

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
}
```

基本用法

```ts
// 假设我们有一个字符串数组，表示一些颜色的名字，我们可以定义一个类型来存储这些颜色对应的十六进制值
type ColorNames = 'red' | 'green' | 'blue';
type HexColorCode = string;

const colorMap: Record<ColorNames, HexColorCode> = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
};
// 结合枚举使用
enum StatusCodes {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
type StatusCodeMessage = string;
const statusMessages: Record<StatusCodes, StatusCodeMessage> = {
  StatusCodes.OK: 'OK',
  StatusCodes.NOT_FOUND: 'Not Found',
  StatusCodes.INTERNAL_SERVER_ERROR: 'Internal Server Error',
};
```

注意事项

- 属性名唯一：在使用 `Record<K, T>` 时，每个键应该是唯一的，不能重复。如果重复了，后面的键值对会覆盖前面的键值对
- 只能包含指定键的属性： `Record<K, T>` 创建的对象类型只能包含指定键的属性，不允许存在其他未定义的属性
- 可选属性会变成必选属性： `Record<K, T>` 创建的对象类型，如果键包含可选属性，生成的新类型的属性都是必选的。
- 值类型的一致性 所有属性的属性值都应该具有相同的类型 T，否则 TypeScript 编译器会报错

## Partial

在ts中，泛型工具类型 `Partial<T>` 主要用于将一个类型的所有属性都变为可选属性。

源码

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

使用场景

```ts
interface Foo {
  name: string
  age: number
}
type Bar = Partial<Foo>
// 相当于
type Bar = {
  name?: string
  age?: number
}

```

## Required

生成一个新类型，该类型与 T 拥有相同的属性，但是所有属性皆为必选项

源码

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

```ts
interface Foo {
  name: string;
  age?: number;
}
type Bar = Required<Foo>
// 相当于
type Bar = {
  name: string;
  age: number;
}
```

## Readonly

生成一个新类型，T 中的 K 属性是只读的，K 属性是不可修改的

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

```ts
interface Foo {
  name: string
  age: number
}
type Bar = Readonly<Foo>
// 相当于
type Bar = {
  readonly name: string
  readonly age: number
}
```

## Pick 包含哪些类型

生成一个新类型，映射类型 ; P in K 类似于 js的 for…in语句 ; extends 为泛型约束

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
```

```ts
interface Foo {
  name: string
  age: number
  gender?: string
}
type Bar = Pick<Foo, 'name' | 'age'>;
// 相当于
type Bar = {
  name: string
  age: number
}
```

## Omit 排除哪些类型

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

```ts
type Foo = {
  name: string;
  age: number;
}
type Bar = Omit<Foo, 'name'>;
// 相当于
type Bar = {
  age: number;
}
```

## Exclude 常用于类型的筛选操作

```ts
// Exclude用于从类型 T 中排除可以赋值给类型 U 的类型
type Exclude<T, U> = T extends U ? never : T;
// 如果 T 是 U 的子类型则返回 never 不是则返回 T
```

```ts
type A = number | string | boolean;
type B = number | boolean;

type FOO = Exclude<A, B>;
// 相当于
type FOO = string;
```

## Extract

```ts
// Extract用于从类型 T 中提取可以赋值给类型 U 的类型
type Extract<T, U> = T extends U ? T : never;
```

```ts
type A = number | string | boolean
type B = number | boolean

type FOO = Extract<A, B>
// 相当于
type FOO = number | boolean
```

## NonNullable

从泛型 T 中排除掉 null 和 undefined

```ts
NonNullable<T>
```

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type t = NonNullable<'name' | null | undefined>;
/* type t = 'name' */
```

## Parameters

`Parameters<T>` 是 TypeScript 中的一个实用工具类型，用于获取函数类型的参数类型数组。它以元组的形式返回函数参数的类型

```js
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type t = Parameters<(name: string) => any>; // type t = [string]

type t2 = Parameters<((name: string) => any)  | ((age: number) => any)>; // type t2 = [string] | [number]
```

## ConstructorParameters

以元组的方式获得构造函数的入参类型

```js
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
 
type t = ConstructorParameters<(new (name: string) => any)  | (new (age: number) => any)>;
// type t = [string] | [number]
```

## ReturnType

获得函数返回值的类型

```js
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type t = ReturnType<(name: string) => string | number>
// type t = string | number
```

## InstanceType

获得构造函数返回值的类型

```js
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

type t = InstanceType<new (name: string) => {name: string, age: number}>
/* 
type h = {
  name: string;
  age: number;
}
*/
```
