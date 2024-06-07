# React 内置函数用法及场景

## FC

FC(Functon Component) 表示函数组件，使用FC定义的组件是一个纯函数，接收props作为参数，返回JSX元素。FC是在typescript中使用的类型定义，用于为函数组件提供类型检查和只能提示

使用场景

- 当组件是一个纯函数，只依赖于props进行渲染时，可以使用FC定义组件
- 适用于简单的展示型组件，没有内部状态和生命周期方法

## PureComponent

PureComponent 是 React 提供的一个基类,用于定义纯组件；继承自PureComonent的组件会自动实现shouldComponentUpdate方法。对props和state进行浅比较，如果props和state没有变化则不重新渲染。

使用场景

- 当组件的 props 和 state 是不可变的,且渲染结果只依赖于 props 和 state 时,可以使用 PureComponent
- 适用于需要优化性能的组件,避免不必要的重新渲染

## memo

React.memo 是React提供的一个高阶组件(Higher-Order Component),用于优化函数组件的性能。它的作用是对函数组件进行浅比较（Shallow comparison），如果props没有变化则不重新渲染。

应用场景

- 纯函数组件(Pure Functional Component):当一个组件是纯函数组件，即它的渲染结果只依赖于props，而不依赖于内部状态或外部因素时，可以使用React.memo对其进行优化。如果Props没有发生变化，组件就不需要重新渲染。从而避免不必要的渲染开销
- 频繁渲染的组件: 对于频繁渲染的组件，如果他的props变化不频繁，可以使用React.memo对其进行优化。通过对props进行浅比较，可以避免组件在props没有变化时进行不必要的重新渲染，从而提高性能
- 组件树中的中间组件:在组件树中,如果某个中间组件的 props 变化不频繁,但它的父组件频繁更新,导致该中间组件也频繁重新渲染,可以使用 React.memo 对该中间组件进行优化。这样可以避免不必要的渲染传播,提高整个组件树的性能

示例：

```jsx
import React, { memo } from 'react';
const MyComponent = memo(function MyComponent(props) {
  console.log('MyComponent rendered');
  return <div>{props.name}</div>;
})

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MyComponent name="John" />
    </div>
  )
}
```

在上面的示例中,MyComponent 是一个函数组件,使用 React.memo 进行了优化。当 ParentComponent 的 count 状态发生变化时,会触发 ParentComponent 的重新渲染。但是,由于 MyComponent 的 props name 没有发生变化,因此 MyComponent 不会重新渲染,控制台不会输出 "MyComponent rendered"

需要注意的是,React.memo 只对 props 进行浅比较,如果 props 中包含复杂对象或数组,即使它们的内容发生了变化,但引用没有变化,React.memo 也会认为 props 没有变化,从而跳过重新渲染。在这种情况下,可以结合使用 useMemo 或 useCallback 来优化复杂对象或函数的创建和传递

示例：

```jsx
import React, { memo, useMemo, useCallback } from 'react';
const MyComponent = memo(function MyComponent(props) {
  console.log('MyComponent rendered');
  return <div>{props.data.name}</div>;
})
function ParentComponent() {
  const [count, setCount] = useState(0);

  const data = useMemo(() => {
    return {
      name: 'John'
    }
  }, [])
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, [])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MyComponent data={data} onClick={handleClick} />
    </div>
  )
}
```

在上面的示例中:

- MyComponent 是一个使用 React.memo 优化的函数组件,它接收一个复杂对象 data 作为 prop。
- 在 ParentComponent 中,使用 useMemo 来创建 data 对象。useMemo 接受一个函数和一个依赖数组作为参数。它会在依赖数组发生变化时重新计算函数的返回值,并将结果缓存起来。在这个例子中,依赖数组为空数组 [],表示只在组件挂载时计算一次 data 对象,后续渲染时直接使用缓存的值
- 在 ParentComponent 中,使用 useCallback 来创建 handleClick 函数。useCallback 接受一个函数和一个依赖数组作为参数。它会在依赖数组发生变化时重新创建函数,并将函数缓存起来。在这个例子中,依赖数组为空数组 [],表示只在组件挂载时创建一次 handleClick 函数,后续渲染时直接使用缓存的函数
- 当 ParentComponent 的 count 状态发生变化时,会触发 ParentComponent 的重新渲染。但是,由于 data 对象是通过 useMemo 创建的,它的引用在组件的生命周期内保持不变。同样,handleClick 函数也是通过 useCallback 创建的,它的引用也保持不变。因此,尽管 ParentComponent 重新渲染了,但传递给 MyComponent 的 props 引用没有发生变化,MyComponent 不会重新渲染,控制台不会输出 "MyComponent rendered"

```js
// 优化列表渲染
import React, { memo, useMemo } from 'react';

const ListItem = memo(function ListItem({item}) {
  console.log('ListItem rendered');
  return <li>{item.name}</li>;
})
function MyList({ data }) {
  const memoizedData = useMemo(() => {
    return data;
  }, [data])

  return (
    <div>
      {memoizedData.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function ParentComponent() {
  const [count, setCount] = useState(0);
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MyList data={data} />
    </div>
  )
}
```

- ListItem 是一个使用 React.memo 优化的函数组件,用于渲染列表项。
- MyList 组件接收一个 data 数组作为 prop,用于渲染列表。在 MyList 组件内部,使用 useMemo 对 data 进行了优化。通过将 data 作为依赖项传递给 useMemo,可以确保只有当 data 发生变化时,才会重新计算 memoizedData 的值
- 在 ParentComponent 中,定义了一个固定的 data 数组,并将其传递给 MyList 组件
- 当 ParentComponent 的 count 状态发生变化时,会触发 ParentComponent 的重新渲染。但是,由于 data 数组是固定的,没有发生变化,因此 MyList 组件接收到的 data prop 的引用也没有变化。通过使用 useMemo,MyList 组件内部的 memoizedData 的值也不会重新计算,从而避免了不必要的列表项重新渲染
