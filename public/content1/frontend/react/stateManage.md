# React 状态管理

## Redux

Redux 是一个功能强大且广泛使用的状态管理库，它遵循单项数据流和不可边状态的原则。使用单一的全局状态存储(Store),所有组件都可以访问和更新这个状态

### 核心概念

- action 描述状态变化的对象
- reducer 根据action更新状态的纯函数
- store 状态管理和分发action的对象

```js
// redux 实现
const initialState = {
  count: 0,
}
export function reducer(state = initialState, action) {
  switch(action.type) {      
    case 'plus':        
    return {            
      ...state,                    
      count: state.count + 1        
    }      
    case 'subtract':        
    return {            
      ...state,            
      count: state.count - 1        
    }      
    default:
    return initialState    
  }
}

export const createStore = () => {
  let currentState = {}; // 公共状态
  let observers = []; // 观察者队列
  function getState() {
    return currentState;
  }
  function dispatch (action) {
    currentState = reducer(currentState, action);
    observers.forEach(fn => fn());
  }
  function subscribe (fn) {
    observers.push(fn);
  }
  dispatch({ type: '@@REDUX_INIT' })  //初始化store数据  
  return {
    getState,
    dispatch,
    subscribe
  }
}
```

```js
// Provider 组件
import React from 'react';
export class Provider extends React.Component {
  // 需要声明静态属性childContextTypes来指定context对象的属性,是context的固定写法
  static childContextTypes = {
    store: {}
  }

  // 实现getChildContext方法，返回一个对象
  getChildContext() {
    return {
      store: this.store
    }
  }

  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }

  render () {
    return this.props.children;
  }
}
```

### Redux Middleware

所谓中间件，我们可以理解为拦截器，用于对某些过程进行拦截和处理，且中间件之间能够串联使用；在redux中，我们中间件拦截的是dispath提交到reducer的这个过程，从而增强dispatch的功能

中间件的设计遵循了洋葱模型(Onion Model),即每个Middleware都可以在action被dispatch之前或之后对其进行处理，并且可以选择是否将action传递给下一个middleware，middleware的执行顺序是按照其注册的顺序依次执行的

```js
function createStore (reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState = {};
  let observers = [];
  function getState() {
    return currentState;
  }
  function dispatch (action) {
    currentState = reducer(currentState, action);
    observers.forEach((observer) => observer());
  }
  function subscribe (fn) {
    observers.push(fn);
  }
  dispatch({ type: '@@REDUX_INI' }); // 初始化store数据
  return {
    getState,
    subscribe,
    dispatch,
  }
}
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);
    let dispatch = store.dispatch;
    let chain = [];

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
      //解释一下这里为什么不直接 dispatch: dispatch      
      //因为直接使用dispatch会产生闭包,导致所有中间件都共享同一个dispatch,如果有中间件修改了dispatch或者进行异步dispatch就可能出错
    }

    chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    }
  }
}

// compose于将多个Middleware组合成一个新的dispatch函数
// compose函数使用reduce方法将Middleware从右到左组合起来,形成一个新的函数。通过使用Redux Middleware,我们可以在不修改Redux核心代码的情况下,扩展和增强Redux的功能
// compose这一步对应了middlewares.reverse(),是函数式编程一种常见的组合方法
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((res, cur) => (...args) => res(cur(...args)));
}
```

```js
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
}
```

### 辅助函数

- combineReducers 将多个reducer合并为一个
- applyMiddleware 用于应用中间件

### Redux Toolkit

Redux Toolkit 是 Redux 的增强版，它提供了一些辅助函数和工具来简化 Redux 的使用。

主要函数

- configureStore: 用于创建一个Redux Store，简化了store的配置过程，内置了一些中间件：redux-thunk、redux-devtools-extension，提供了更好的类型推断
- createReducer：用于创建一个reducer，允许你使用一个查找表(lookup table)来定义reducer的逻辑，这样可以避免编写冗长的switch语句。此外它还内置了immer库,使得直接修改状态成为可能,而无需手动创建不可变的更新
- createAction: 这个函数用于创建action creator函数,它简化了action creator的定义,并且提供了更好的类型推断支持
- createSlice: 这个函数是Redux Toolkit的核心,它允许你将reducer、action creators和初始状态定义在一个地方,称为"slice"。这样可以大大减少样板代码,并且使得代码更加模块化和易于理解
- createAsyncThunk: 这个函数用于创建异步的action creator,它简化了异步操作的处理,并且内置了一些常见的异步场景,如请求开始、请求成功和请求失败等

高级用法

- createEntityAdapter 管理规范化的状态
  - 通过定义实体适配器，轻松地对规范化地状态进行增删改查等操作
  - 实体适配器提供了一组预定义的reducer函数，如addOne、addMany、removeOne等使得状态的更新变得简洁和高效
- createSelector 进行状态的衍生和缓存
- extraReducers 处理额外的action
- createAsyncThunk 处理异步操作
- createAction 和 createReducer 实现可重用的reducer逻辑
- redux-toolkit/query 简化数据获取

```js
// 中间件配置详解
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import customMiddleware from './customMiddleware';
import counterSlice from "./features/counterSlice";
const store = configureStore({
  reducer: {
    counter: counterSlice,
  }
  // middleware: [thunk, logger],
  middleware: [...getDefaultMiddleware(), customMiddleware], // 添加自定义的中间件
})
```

```ts
// 异步示例
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface MovieState {
  list: object;
  totals: number;
}

const initialState: MovieState = {
  list: [],
  totals: 0
}

const getMovieListApi = () => {
  return fetch(
    'https://pcw-api.iqiyi.com/search/recommend/list?channel_id=1&data_type=1&mode=24&page_id=1&ret_num=48'
  ).then(res => res.json())
}

// thunk函数允许执行异步逻辑, 通常用于发出异步请求。
// createAsyncThunk 创建一个异步action，方法触发的时候会有三种状态：
// pending（进行中）、fulfilled（成功）、rejected（失败）
export const getMovieData = createAsyncThunk('movie/getMovieData', async () => {
  const res = await getMovieListApi();
  console.log("🚀 ~ getMovieData", res);
  return res;
})

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    // 数据请求完触发
    loadDataEnd (state, action) {
      console.log("🚀 ~ loadDataEnd");
      state.list = action.payload;
      state.totals = action.payload.length;
    }
  },
  // extraReducers 字段让 slice 处理在别处定义的 actions， 
  // 包括由 createAsyncThunk 或其他slice生成的actions。
  extraReducers: (builder) => {
    builder.addCase(getMovieData.pending, (state) => {
      console.log("🚀 ~ pending 进行中", state);
    }).addCase(getMovieData.fulfilled, (state, { payload }) => {
      console.log("🚀 ~ fulfilled", payload);
      state.list = payload.data.list
      state.totals = payload.data.list.length
    }).addCase(getMovieData.rejected, (state, err) => {
      console.log("🚀 ~ rejected", err);
    })
  }
})

// 导出方法
export const { loadDataEnd } = movieSlice.actions;

// 导出reducer
export default movieSlice.reducer;

```

```tsx
// 异步使用实例
import { useSelector, useDispatch } from 'react-redux'
import { getMovieData } from './store/features/asyncSlice'
function App () {
  const { list } = useSelector((state: any) => state.movie);
  const dispatch = useDispatch();

  return (
    <>
      <button onClick={() => dispatch(getMovieData() as any)}>
        获取数据
      </button>
      <ul>
        { list.map((item: any) => <li key={item.tvId}>{ item.name }</li>) }
      </ul>
    </>
  )
}
```

## Zustand

- 状态共享：状态管理最必要的一点就是状态共享。这也是 context 出来以后，大部分文章说不需要 redux 的根本原因。因为context 可以实现最最基础的状态共享。但这种方法（包括 redux 在内），都需要在最外层包一个 Provider。 Context 中的值都在 Provider 的作用域下有效
- 状态变更：
- 状态派生
- 性能优化
- 数据分形和状态组合
- 多环境集成

## react hooks + useSyncExternalStore

```jsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- subscribe
  - 这是一个函数，其作用是订阅外部存储的变化。当外部存储发生变化时，它应该调用传入的callback
  - 这个函数应该返回一个取消订阅的函数。这样，当组件被卸载或订阅被重新创建时，我们可以确保没有内存泄漏或无效的回调调用
- getSnapshot
  - 这是一个函数，其作用是从外部存储中获取当前的数据快
  - 每次组件渲染时，useSyncExternalStore 都会调用此函数来读取当前的数据状态
- getServerSnapshot
  - 这个函数的作用与 getSnapshot 类似，但它是为服务端渲染（SSR）或预渲染时使用的。在客户端首次渲染或 hydrate 操作期间，React 会使用此函数而不是 getSnapshot 来读取数据的初始状态。这是为了确保在服务端渲染的内容与客户端的初始内容匹配，从而避免不必要的重新渲染和闪烁。如果你的应用不涉及服务端渲染，那么不需要这个参数

### 使用示例

```jsx
/*
  * articlesStore.js 
  */

// 初始化文章 ID 计数器
let nextId = 0;

// 初始文章列表
let articles = [{ id: nextId++, title: 'Article #1', content: 'This is the content of Article #1.' }];

// 用于存储所有订阅文章列表更改的监听器
let listeners = [];

export const articlesStore = {
  addArticle(title, content) {
    articles = [...articles, { id: nextId++, title: title, content: content }];
    // 通知所有监听器文章列表已更改
    emitChange();
  },
  // 订阅文章列表更改的方法
  subscribe(listener) {
    // 添加新的监听器
    listeners = [...listeners, listener];
    // 返回一个取消订阅的函数
    return () => {
      // 删除监听器
      listeners = listeners.filter(l => l !== listener);
    };
  },
  // 获取当前文章列表的“快照”
  getSnapshot() {
    return articles;
  }
};

// 通知所有监听器的辅助函数，遍历 listeners 数组并调用每个监听器
function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

```jsx
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

```jsx
import { useSyncExternalStore } from 'react';
import { articlesStore } from './articlesStore.js';
import { useOnlineStatus } from './useOnlineStatus'

export default function ArticlesApp() {
  // 使用 useSyncExternalStore 订阅文章列表的更改
  const articles = useSyncExternalStore(articlesStore.subscribe, articlesStore.getSnapshot);

  // 当点击按钮时添加新文章的处理函数
  const handleAddArticle = () => {
    // ……
    articlesStore.addArticle(title, content);
  };
  const isOnline = useOnlineStatus();

  return (
    <>
      <button onClick={handleAddArticle}>Add Article</button>
      <ul>
        {/* 映射文章列表以显示每篇文章的标题和内容 */}
        {articles.map(article => (
          <li key={article.id}>
            {* …… *}
          </li>
        ))}
      </ul>
      <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
    </>
  );
}
```

### 注意事项

- getSnapshot 的返回值不能总是不同的对象
  - useSyncExternalStore 依赖 getSnapshot 函数返回的值来决定是否重新渲染。如果每次都返回新的对象，即使对象的内容相同，React 会认为状态已经变化并重新渲染组件
- subscribe 不要放在组件内定义
  - 如果 subscribe 函数在组件内部定义，那么每次组件渲染都会创建一个新的 subscribe 函数实例。这是由于 useSyncExternalStore 会在 subscribe 函数改变时重新订阅，这意味着每次重新渲染都会导致重新订阅，可能导致不必要的开销，尤其是当订阅操作涉及复杂的计算或外部资源时

```js
// getSnapshot
function getSnapshot() {
  // 🔴 getSnapshot 不要总是返回不同的对象
  return {
    todos: myStore.todos
  };
}
function getSnapshot() {
  // ✅ 你可以返回不可变数据
  return myStore.todos;
}
```

```js
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 总是不同的函数，所以 React 每次重新渲染都会重新订阅
  function subscribe() {
    // ...
  }

  // ...
}
// 正确的做法是把 subscribe 函数移到组件外部，这样它在组件的整个生命周期中都保持不变；或者使用 useCallback 钩子来缓存 subscribe 函数
```
