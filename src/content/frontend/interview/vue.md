---
title: Vue生命周期&Vue3
description: 生命周期、状态管理、Composition、响应式升级等
date: 2020-07-11
---

# Vue

## 生命周期

vue2 的生命周期

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

vue3 的生命周期

- beforeCreate
  - 在实例初始化之后，数据观测(data observer)和 event/watcher 事件配置之前被调用
  - 在组合API中，setup 函数取代了 beforeCreate 钩子函数的功能
- created
  - 在实例创建完成后被立即调用
  - 这一步：实例已完成以下配置：数据观测(date observer)、property和方法的运算，watch/event事件回调
  - 然而，挂载阶段还没有开始 $el property目前尚不可用。在组合API中，setup函数取代了created钩子函数的功能
- mounted
  - 实例被挂载后调用，这时app.mount()被新创建的 vm.$el 替换
  - 如果跟实例挂载到了一个文档内的元素上，当mounted被调用时， vm.$el 也在文档内
- beforeUpdate
  - 数据更新时调用,发生在虚拟 DOM 打补丁之前
  - 这里适合在更新之前访问现有的 DOM,比如手动移除已添加的事件监听器
- updated
  - 由于数据更改导致的虚拟DOM重新渲染和打补丁，在这之后会调用该钩子
  - 当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作
- beforeUnmount
  - 在卸载组件实例之前调用，这个阶段实例依然可以正常访问
- unmounted
  - 在卸载组件实例之后调用，调用此钩子，组件实例的所有指令都被解除绑定，所有事件监听器都被移除，所有子组件实例被销毁
- errorCaptured
- activated
  - 被 keep-alive 缓存的组件激活时调用
- deactivated
  - 被 keep-alive 缓存的组件失活时调用

## 计算属性computed和侦听器watch

- 计算属性是基于他们的依赖进行缓存的，只有在它的相关依赖发生变化时才会重新求值（适用于计算较为复杂的逻辑）
- 监听器允许你执行异步操作，如访问API和修改其他数据（适用于观察某个值的变化并执行相应的操作）

## 插槽

插槽允许你在组件的模板中定义占位符，并在使用组件时填充这些占位符，它提供了一种将内容分发到组件的方式

## 状态管理

- vuex 解决了组件之间共享状态的问题，提供了一种集中式的状态管理方案，Vuex使用单一状态树，通过定义状态、突变和动作来管理应用的状态

## 组件通信

- 父组件通过props向子组件传递数据
- 子组件通过$emit触发事件，父组件监听事件并处理
- 使用$refs直接访问子组件实例
- 使用EventBus实现跨组件通信
- 使用vuex管理全局状态，实现组件之间的数据共享

## 路由原理

基于前端路由的概念，通过拦截浏览器URL变化，动态加载和渲染对应的组件,从而实现页面的无刷新切换。它利用了浏览器的 History API 或 hash 来管理 URL 的变化,并通过 Vue.js 的响应式系统和组件化机制,将路由与组件进行了深度集成

- hash模式
  - 标志是在域名后面带有#号
  - 通过window.location.hash 获取到当前url的hash，hash模式下通过hashchange方法可以监听url中hash的变化
  - 兼容性好、并且hash的变化会在浏览器history中留下记录，可以实现浏览器的前进和后退功能
  - 缺点是多了个#号，url整体上不够美观
- history模式
  - 基于html5的history对象
  - 通过location.pathname获取到当前url的路由地址；通过pushState和replaceState方法可以修改url的地址，结合popState方法监听到url中路由的变化
  - 特点是实现更加方便，可读性更强，url更加美观
  - 劣势：当用户刷新或者直接输入地址时会向服务器发送一个请求，histroy模式需要服务端支持，将路由都重定向到跟路由

vue-router路由工作流程

- 导航触发
  - 当用户点击router-link组件或调用$router对象的方式时，触发导航
  - vue-router会拦截这些导航事件，并根据目标路径和路由配置进行处理
- 路由匹配
  - vue-router根据当前的url路径和路由配置匹配
  - 使用路由匹配算法来查找当前url路径匹配的路由对象
  - 匹配会考虑路由嵌套、路由参数、通配符等因素
- 导航守卫
  - 路由匹配完成后，vue-router会依次执行相关的导航守卫
  - 导航守卫可以是全局守卫、路由独享守卫或组件内守卫
  - 守卫函数接收 to、from、next 三个参数,分别表示目标路由、当前路由和下一步操作
  - 守卫函数可以进行权限验证、重定向、取消导航等操作
- 组件解析
  - 当导航守卫执行完成后,Vue Router 会根据匹配到的路由对象的 component 属性解析对应的组件
  - 如果组件是异步组件或使用了路由懒加载,Vue Router 会动态加载组件
- 组件渲染
  - Vue Router 将解析后的组件传递给 `<router-view>` 组件进行渲染
  - `<router-view>` 组件作为占位符,用于渲染匹配到的组件。
  - 如果存在嵌套路由,Vue Router 会递归渲染嵌套的 `<router-view>` 组件
- 导航完成
  - 当组件渲染完成后,导航就算完成了
  - Vue Router 会更新浏览器的 URL,并将当前路由对象保存到浏览器的历史记录中
  - 如果使用了 History 模式,Vue Router 会利用 HTML5 History API 来修改浏览器的 URL

## vue3

### Composition API

组合式API，提供了一种新的方式来组织组件的逻辑。在组合API中，生命周期钩子函数以on开头，如onMounted，onUpdated等，这些钩子函数可以在setup函数中直接使用

选项API和组合API可以混合使用，建议使用组合API，提供了更好的逻辑复用和代码组织方式

- setup 函数
- 响应式系统
  - reactive
  - ref
  - computed
- 生命周期钩子
  - 常用的生命周期钩子包括 onMounted、onUpdated、onUnmounted 等,它们与 Options API 中的生命周期钩子对应
- 依赖注入
  - 提供了 provide 和 inject 函数,用于在组件之间共享数据
  - provide 函数用于在父组件中提供数据,inject 函数用于在子组件中注入和使用数据
- 逻辑复用
  - 将组件的逻辑提取到独立的函数中,并在多个组件之间共享和复用这些函数
  - 通过组合不同的函数,我们可以灵活地组织和重用组件的逻辑,提高代码的可维护性和可读性

### 自定义 hooks

优势

- 代码复用：通过将可复用的逻辑提取到自定义 hooks 中,我们可以在多个组件之间共享和重用这些逻辑,避免了代码的重复
- 逻辑封装：自定义 hooks 将特定的逻辑封装到独立的函数中,使得组件的代码更加简洁和易于理解
- 可组合性：自定义 hooks 可以相互组合和嵌套,通过组合不同的 hooks,我们可以构建出复杂的功能
- 响应式数据：自定义 hooks 内部可以使用 Vue 3 的响应式 API,如 ref 和 reactive,创建和管理响应式数据
- 生命周期钩子：自定义 hooks 可以访问 Vue 3 的生命周期钩子,如 onMounted、onUnmounted 等,允许我们在 hooks 内部执行一些初始化和清理的逻辑

```js
import { ref, onMounted, onUnmounted } from 'vue'
export function useMouse () {
  const x = ref(0)
  const y = ref(0)

  function update (e) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  })

  return { x, y }
}
```

```js
import { ref } from 'vue'
export function useAsyncData(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url).then(response => response.json()).then(json => (data.value = json)).catch(err => (error.value = err))

  return {
    data,
    error
  }
}
```

### 响应式升级

在vue2中，响应式系统是基于Object.defineProperty实现的，它通过递归地遍历数据对象，为每个属性添加getter和setter，以实现数据的响应式，然而这种方式用一些局限性，例如无法检测对象属性的添加或删除，以及数组索引的变化

vue3中，采用一种全新的响应式系统，基于ES6的 Proxy和Reflect API，提供更加灵活和高效的响应式机制

- Proxy 和 Reflect
  - vue3中使用Proxy对象来拦截对数据对象的访问和修改操作，Proxy可以监听对象的任意属性的访问和修改，包括属性的添加和删除
  - 通过 Proxy,Vue 3 可以实现更细粒度的响应式控制,不再需要递归遍历数据对象
  - Reflect API 提供了一组方法,用于在 Proxy 中对原始对象进行操作,如获取属性值、设置属性值等
- 响应式API
  - reactive：用于创建一个响应式对象，返回一个Proxy对象，可以直接修改其属性，触发响应式更新
  - ref：用于创建一个响应式的值，返回一个带有value属性的对象，通过.value可以访问和修改值，触发响应式更新
  - computed：计算属性，根据其依赖的响应式数据自动计算并返回结果
  - watch：监听一个或多个响应式数据变化
- 响应式工具函数
  - isRef：函数用于判断一个值是否是 ref 类型的响应式值
  - toRef：函数用于为一个响应式对象的属性创建一个 ref,使其能够独立触发响应式更新
  - toRefs：函数用于将一个响应式对象转换为一个普通对象,其中每个属性都是对应的 ref
- 响应式效果
  - Vue 3 引入了响应式效果的概念,它是一个函数,当其依赖的响应式数据发生变化时,会自动重新执行
  - 响应式效果通过 watchEffect 函数创建,它接收一个回调函数作为参数,并自动追踪其中使用的响应式数据
  - 当响应式数据发生变化时,响应式效果会自动重新执行,更新相关的副作用

### diff 算法升级

Vue 3 对虚拟 DOM 的 diff 算法进行了重大改进和优化,以提高性能并支持更多的场景。以下是 Vue 3 diff 算法升级的主要变化

- 静态提升
- 预字符串化
- 块级别的diff
- 更智能的列表diff
- 更好的组件diff

### Teleport

Teleport 是 Vue 3 引入的一个新特性,它允许我们将组件的一部分模板"传送"到 DOM 中的其他位置,而不受组件层级的限制。这在处理模态框、弹出框、通知等场景时非常有用,因为这些元素通常需要放置在 DOM 结构的特定位置,以确保正确的样式和行为

```vue
<template>
  <div>
    <h1>组件内容</h1>
    <Teleport to="body">
      <div class="modal">
        <h2>模态框内容</h2>
        <button @click="closeModal">关闭</button>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      // 关闭模态框的逻辑
    }
  }
}
</script>
```

在上面的示例中,我们使用了 `<Teleport>` 组件,并通过 to 属性指定了目标位置为 "body"。这意味着 `<Teleport>` 内部的模板内容将被传送到 `<body>` 标签下,而不是在当前组件的 DOM 结构中

特点和优势

- 灵活的目标位置：通过 to 属性,我们可以指定 Teleport 的目标位置,可以是一个 CSS 选择器或者一个 DOM 元素
- 保持组件的逻辑和状态：
  - 虽然 Teleport 将模板内容传送到了其他位置,但它仍然保持了组件的逻辑和状态
  - 可以在组件中正常地定义数据、方法、计算属性等,并在 Teleport 内部的模板中使用它们
- 解决 CSS 样式和 z-index 问题
  - 使用传统的方式处理模态框或弹出框时,常常会遇到 CSS 样式和 z-index 的问题,因为它们被限制在组件的 DOM 结构中
  - 通过 Teleport,我们可以将这些元素传送到 DOM 的更高层级,避免了样式和 z-index 的限制
- 支持多个 Teleport
  - 在一个组件中,我们可以使用多个 Teleport 将不同的模板内容传送到不同的目标位置。
  - 每个 Teleport 都有自己的目标位置和独立的 DOM 结构,互不影响

### Suspense

Suspense 是 Vue 3 引入的一个新特性,它允许在组件树中协调对异步依赖的处理,并在等待异步组件时渲染一个加载状态

Suspense 组件有两个插槽:default 和 fallback。default 插槽用于渲染主要内容,而 fallback 插槽用于在主要内容加载完成之前渲染一个加载状态。

使用场景：

- 异步组件加载（注意的是,使用 Suspense 组件时,异步组件应该使用 defineAsyncComponent 函数来定义,以便 Vue 能够正确地处理异步加载过程）
- 条件性渲染
- 嵌套的异步依赖

```vue
<template>
  <Suspense>
    <template #default>
      <async-component />
    </template>
    <template #fallback>
      <loading-spinner />
    </template>
  </Suspense>
</template>

<script>
import AsyncComponent from './AsyncComponent.vue';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  components: {
    AsyncComponent,
    LoadingSpinner,
  },
};
</script>
```

### Fragment

在vue2中，每个组件都必须有一个根元素，即template中只能有一个根节点，这就会导致：有时候我们可能不需要一个额外的根节点，但为了满足根节点要求，不得不添加一个无意义的根节点。为了解决这个问题：Vue3引入了Fragment概念，Fragment 允许组件的 template 中包含多个根级别的节点,而不需要将它们包裹在一个单独的元素中

### Tree-Shaking

Tree-Shaking 是一种在打包过程中移除未使用代码的技术，它通过静态分析代码的导入和导出语句，确定哪些代码是实际使用的，并将未使用的代码从最终的打包文件中剔除，从而减小打包体积

vue3 通过采用ES6 Module语法优化打包策略

- 基于 ES6 模块的设计
  - 采用了 ES6 模块语法,每个功能模块都通过 export 关键字导出,而不是将所有内容都挂载到全局的 Vue 对象上
  - 使用 ES6 模块,打包工具可以更容易地分析代码的依赖关系,识别未使用的代码并将其移除
- 细粒度的导入和导出
  - 更细粒度的导入和导出方式,允许开发者按需导入所需的功能模块
  - 通过 `import { ref, computed } from 'vue'` 的方式,只导入 ref 和 computed 这两个响应式 API
- 优化的打包策略
  - 通过使用现代的打包工具和配置,如 Webpack、Rollup 等,实现了更高效的 Tree-Shaking
  - 打包工具会分析代码的依赖关系,并使用 Dead Code Elimination (DCE) 技术移除未使用的代码
- 更小的运行时体积
- 按需加载组件和插件
  - Vue 3 支持按需加载组件和插件,通过动态导入的方式,只在需要时才加载相应的代码
  - 可以使用 `import('./MyComponent.vue')` 的方式动态导入组件,而不是一次性导入所有组件

### 其他

- 插槽
- 自定义指令
- v-model 升级
- 异步组件

## vue3 面试相关

### vue3 性能提升主要体现在哪里

#### 编译阶段优化

- diff算法优化
  - 相对于vue2增加了静态标记，其作用是为了个会发生变化的地方添加一个flag、下次发生变化的时候直接找到该地方比较
- 静态提升
  - vue3中对埠村与更新的元素，会做静态提升，只会被创建一次，在渲染时直接使用。免去了重复创建造作，优化内存
  - 没做静态提升之前，未参与更新的元素也在render函数内部，会重复创建
  - 静态提升之后，未参与更新的元素，被放置在render函数外部，每次渲染时只要取出即可。同时该元素会被打上静态标记值为-1，负整数永远不会用于diff
- 事件监听缓存
  - 默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次diff算法的时候直接使用
- SSR优化

事件监听缓存

vue3中，事件监听缓存是一种优化技术、用于提升事件处理性能。它通过缓存事件处理程序来避免每次渲染时都创建新的事件处理程序函数，从而减少不必要的内存分配和函数创建开销

vue2中，没当组件重新渲染时，事件处理程序都会被重新创建，即使事件处理程序内容没有变化。这会导致一些性能问题

vue3中引入了事件监听缓存功能，自动缓存事件处理程序，并在组件重新渲染时重用缓存的事件处理程序，而不是每次创建新的

原理

- 当组件首次渲染时,Vue 会为事件处理程序创建一个缓存
- 在后续的渲染中,如果事件处理程序的内容没有发生变化,Vue 会直接使用缓存中的事件处理程序,而不是创建新的函数
- 如果事件处理程序的内容发生了变化,Vue 会更新缓存,并使用新的事件处理程序

#### 源码体积

vue3 移除了一些不常用的API(extend、set、directive、filter、$on $off $once $children $listener $scopedSlots)，最重要的是tree shaking。比如ref、computed等仅仅在用到的时候才会打包、没用到的模块都会被剔除掉

#### 响应式系统

vue3中采用proxy重写了响应式系统，proxy可以对整个对象进行监听，包括监听动态属性的增加、数组索引和数组长度变化、监听删除属性

### watch 和 watchEffect 的区别

watch 和 watchEffect都是监听器，watchEffect是一个副作用函数

- watch
  - 是通过显式指定要监听的数据源来创建侦听器的。你需要提供一个要监听的数据源和一个回调函数,当数据源发生变化时,回调函数会被触发
  - 是在侦听的数据源发生变化时触发回调函数。它会在侦听的数据源的值改变后,在下一个 DOM 更新周期之前执行回调函数
  - 返回一个停止侦听的函数,可以通过调用该函数来停止侦听器
- watchEffect
  - 是通过在回调函数中访问响应式数据来自动追踪依赖的。你只需要提供一个回调函数,watchEffect 会自动追踪回调函数中访问的响应式数据,并在数据发生变化时重新执行回调函数
  - 是在创建侦听器时立即执行一次回调函数,并在回调函数中访问的响应式数据发生变化时重新执行回调函数。它会在响应式数据更新后,在 DOM 更新之前执行回调函数
  - 返回一个停止侦听的函数,可以通过调用该函数来停止侦听器。此外,watchEffect 还支持在回调函数中返回一个清理函数,用于在侦听器被停止或重新执行前执行清理操作

```js
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);

// 使用 watch
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// 使用 watchEffect
watchEffect(() => {
  console.log(`Count is: ${count.value}`);
});

// 修改 count 的值
count.value++;
```

## 源码分析

### diff

vue2 Diff 算法(采用了双端 Diff 算法)

- 对比头头、尾尾、头尾、尾头是否可以复用，如果可以复用，就进行节点的更新和移动操作
- 如果经过四个端点的比较，都没有可复用的节点，则将
- 拿新的一组子节点的头部去 map 中查找，如果找到可复用的节点，则将相应的节点进行更新，并将其移动到头部，然后头部指针右移
- 然而，拿新的一组子节点的头部节点去旧的一组子节点中寻找可复用的节点，并非总能找到，这说明这个新的头部节点是新增节点，只需要将其挂载到头部即可
- 经过上述处理，最后还剩下新的节点就批量新增，剩下旧的节点就批量删除

- 同层级比较：Vue2 的 Diff 算法只会在同一层级进行比较，不会跨层级比较。这样可以大大减少比较的复杂度，提高性能
- 节点比较：比较两个节点时，如果类型不同，则直接删除旧节点，创建并插入新节点，如果类型相同，那么继续比较节点的属性和子节点
- 列表比较：在比较列表时，vue2 使用了一种叫双端比较的策略，首先同时从两个列表的头部和尾部开始比较，如果头部或尾部的节点相同，那么直接更新节点。如果头尾都不同，那么通过一个键值对的映射关系找到相同的节点，然后进行移动。这种策略可以有效地处理列表的顺序变化
- 子节点比较：在比较子节点时，如果新的子节点是文本节点，那么直接更新文本内容，如果新的子节点是数组，那么使用列表比较的策略进行比较

vue3 Diff 算法(在 vue2 的基础上进行了优化，主要改进在于引入了静态节点标记和块的概念)

- 静态节点标记：编译器会对静态节点进行标记，这样在更新过程中就可以直接跳过这些节点，不需要进行更新和比较
- 块的概念：每个块对应一个动态节点或组件，在更新过程中，只需要更新改变的块，而不需要更新整个组件，这样可以减少不必要的渲染，提高性能
- 优化列表渲染（LCS longest increasing subsequence）最长递增序列
  - 通过 LCS 算法，Vue 可以找出列表中顺序变化最小的一种方式，也就是找出最长的不需要移动的子序列，然后只移动其它需要移动的元素，这样可以大大减少 DOM 操作的数量
  - LCS 算法是一种动态规划算法，主要思想是通过比较新旧列表，找出两者之间最长的相同子序列，然后保持这个子序列不动只移动其它元素
- 优化组件更新

### nextTick

在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后立即使用这个方法，获取更新后的 DOM

### keep-alive

keepalive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染 。也就是所谓的组件缓存； 实现原理：将被缓存的组件实例存储到一个缓存对象中，当需要重新渲染这个组件时，会从缓存中获取到之前的实例，将其重新挂载到 DOM 上

props

- include：字符串或正则表达式。只有匹配的组件才会被缓存
- exclude：字符串或正则表达式。任何匹配的组件都不会被缓存
- max：最多可以缓存多少组件实例

```js
function pruneCacheEntry(cache, key, keys, current) {
  const cached = cache[key];
  /* 判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || current.tag !== cache.tag)) {
    cached.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys.key);
}
// 在该函数内对this.cache对象进行遍历，取出每一项的name值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用pruneCacheEntry函数将其从this.cache对象剔除即可
function pruneCache(keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance;
  for (const key in cache) {
    const cachedNode = cache[key];
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions); // 获取组件名
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}
export default {
  name: "keep-alive",
  abstract: true, // 判断当前组件虚拟dom是否渲染成真的dom
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [Number, String]
  },
  create() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroy() {
    for (const key in this.cache) {
      // 删除所有的缓存
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted() {
    // 实时监听黑白名单的变动
    this.$watch("include", val => {
      pruneCache(this, name => matches(val, name));
    });
    this.$watch("exclude", val => {
      pruneCache(this, name => !matches(val, name));
    });
  },
  methods: {},
  render() {
    const slot = this.$slots.default;
    const vnode = getFirstComponentChild(slot);
    // 获取该组件节点的componentOptions
    const componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      const name = getComponentName(componentOptions);
      const { include, exclude } = this;
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && !name) ||
        !matches(include, name) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }

      const { cache, keys } = this;
      const key =
        vnode.key == null
          ? componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : "")
          : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }
      vnode.data.keepAlive = true;
    }

    return vnode || (slot && slot[0]);
  }
};
```

### 虚拟 DOM

### 修饰符

表单修饰符

- lazy 在我们填完信息，光标离开标签的时候，才会将值赋予给value，也就是在change事件之后再进行信息同步
- trim 自动过滤用户输入的首空格字符，而中间的空格不会过滤
- number 自动将用户的输入值转为数值类型，但如果这个值无法被parseFloat解析，则会返回原来的值

事件修饰符

- .stop 等同于 js 中的 event.stopPropagation() 防止事件冒泡
- .prevent 等同于 js 中的 event.preventDefault() 阻止执行默认行为(如果事件可取消，则取消该事件，而不停止事件的进一步传播)
- .capture 与事件冒泡的方向相反，事件捕获由外到内
- .self 只会触发自己范围内的事件，不包含子元素 (使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击)
- .once 只会触发一次
- .passive 在移动端，当我们在监听元素滚动事件的时候，会一直触发onscroll事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符
- .native 让组件变成像html内置标签那样监听根元素的原生事件，否则组件上使用 v-on 只会监听自定义事件

鼠标按钮修饰符

- .left
- .right
- .middle

键盘修饰符

- 普通键（enter、tab、delete、space、esc、up...）
- 系统修饰键（ctrl、alt、meta、shift...）

v-bind修饰符

- async 能对props进行一个双向绑定
- prop 设置自定义标签属性，避免暴露数据，防止污染HTML结构
- camel 将命名变为驼峰命名法，如将view-Box属性名转换为 viewBox

### 自定义指令

生命周期和vue2有所不同

- beforeMount 在绑定元素的父组件被挂载之前调用
- mounted 在绑定元素的父组件挂载之后调用
- beforeUpdate 在包含组件的 VNode 更新之前调用
- updated 在包含组件的 VNode 及其子 VNode 全部更新后调用
- beforeUnmount 在卸载绑定元素的父组件之前调用
- unmounted: 在卸载绑定元素的父组件之后调用

```js
// vue3 实现一个节流自定义指令
<script setup>
function throttle(func, delay) {
  let timeoutId;
  return function (...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  };
}
const vThrottle = {
    beforeMount(el, binding) {
        console.log(binding)
        if (typeof binding.value !== 'function') {
            throw new Error(`v-throttle 的值必须是一个函数`);
        }

        const delay = binding.arg || 200
        const throttleFunc = throttle(binding.value, delay)

        el.addEventListener('click', throttleFunc)
    },
    onUnmounted(el) {
        el.removeEventListener('click', throttledFunc);
    }
}
</script>
```

```js
// vue3 实现一键复制功能
```

### 过滤器Flters

vue3中已将过滤器filters移除了，官方建议使用计算属性或者方法来替代过滤器

vue2 filters源码分析

- 在编译阶段通过parseFilters将过滤器编译成函数调用（串联过滤器则是一个嵌套的函数调用，前一个过滤器执行的结果是后一个过滤器函数的参数）
- 编译后通过调用resolveFilter函数找到对应过滤器并返回结果
- 执行结果作为参数传递给toString函数，而toString执行后，其结果会保存在Vnode的text属性中，渲染到视图

```js
// 在模板编译阶段过滤器表达式将会被编译为过滤器函数，主要通过parseFilters
_s(_f('filterformat')(message))
// _f全名是 resolveFilter，作用是从this.$options.filters中找到过滤器并返回
// _s全称是 toString 过滤器处理后的结果会当作参数传递给 toString函数，最终 toString函数执行后的结果会保存到Vnode中的text属性中，渲染到视图中
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true)
}
function resolveAsset (options, type, id, warnMissing) {
    if (typeof id !== 'string') {
        return
    }
    const assets = options[type]
    if (hasOwn(assets, id)) {
        return assets[id]
    }
    const camelizedId = camelize(id)
    if (hasOwn(assets, camelizedId)) {
        return assets[camelizedId]
    }
    const PascalCaseId = capitalize(camelizedId)
    if (hasOwn(assets, PascalCaseId)) {
        return assets[PascalCaseId]
    }
    const result = assets[id] || assets[camelizedId] || assets[PascalCaseId]
    if (process.env.NODE_ENV !== 'production' && warnMisssing && !result) {
        console.log('Failed to resolve ' + type.slice(0,-1) + ': ' + id, options)
    }
    return result
}
function toString (value) {
    return value == null ? '' : (
        typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
        // JSON.stringify()第三个参数可用来控制字符串里面的间距
    )
}

function paserFilters (filter) {
    let filters = filter.split('|')
    let expression = filters.shift().trim() // shift()删除数组第一个元素并将其返回，该方法会更改原数组
    let i
    if (filters) {
        for(i = 0;i < filters.length;i++) {
            experssion = warpFilter(expression,filters[i].trim())
        }
    }
    return expression
}
function warpFilter(exp, filter) {
    // 首先判断过滤器是否有其他参数
    const i = filter.indexof('(')
    if ( i<0 ) { // 不含其他参数，直接进行过滤器表达式字符串的拼接
        return `_f("${filter}")(${exp})`
    } else {
        const name = filter.slice(0,i) // 过滤器名称
        const args = filter.slice(i+1) // 参数，但还多了 ‘)’
        return `_f('${name}')(${exp},${args}` // 注意这一步少给了一个 ')'
    }
}
```

### 双向绑定原理

Object.difineProperty 和 Proxy

- Object.defineProperty 只能劫持对象的属性，Proxy 是直接代理对象
  - 由于 Object.defineProperty 只能劫持对象的属性，需要遍历对象的每一个属性，如果属性值也是对象，则需要递归进行深度遍历。
- Object.defineProperty 新增属性需要手动进行 Observe
  - 新增属性时，也需要重新遍历对象，对新增的属性再次使用 Object.defineProperty 进行劫持

vue2 双向绑定原理

- 对需要 observe 的数据进行递归遍历，包括子属性对象的属性，都加上 getter 和 setter，这样给这个对象某个属性赋值，就会触发 setter，监听数据变化
- compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据变动，收到通知，更新视图
- Watcher 订阅者是 Observer 和 Compiler 之间通信的桥梁，主要做的事情
  - 在自身实例化时往属性订阅器 dep 里面添加自己
  - 自身必须有一个 update 方法
  - 待属性变动 dep.notice 通知时，会调用自身的 update 方法并处罚 Compile 中绑定的回调
- 通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果

### h 函数

\_createVNode 函数做的事情

- 标准化 props class
- 给 VNode 打上编码标记
- 创建 VNode
- 标准化子节点

```js
// 除了类型必填以外，其他的参数都是可选的
h("div");
h("div", { id: "foo" });

// attribute 和 property 都能在 prop 中书写
// Vue 会自动将它们分配到正确的位置
h("div", { class: "bar", innerHTML: "hello" });

// 像 `.prop` 和 `.attr` 这样的的属性修饰符
// 可以分别通过 `.` 和 `^` 前缀来添加
h("div", { ".name": "some-name", "^width": "100" });

// 类与样式可以像在模板中一样
// 用数组或对象的形式书写
h("div", { class: [foo, { bar }], style: { color: "red" } });

// 事件监听器应以 onXxx 的形式书写
h("div", { onClick: () => {} });

// children 可以是一个字符串
h("div", { id: "foo" }, "hello");

// 没有 props 时可以省略不写
h("div", "hello");
h("div", [h("span", "hello")]);

// children 数组可以同时包含 vnodes 与字符串
h("div", ["hello", h("span", "hello")]);
```
