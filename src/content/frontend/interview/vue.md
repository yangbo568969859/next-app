# Vue

## 生命周期

## 状态管理

## vue3

### Composition API

### 自定义 hooks

### 响应式升级

### diff 算法升级

### Teleport

### Suspense

### Fragment

### Tree-Shaking

### 其他

- 插槽
- 自定义指令
- v-model 升级
- 异步组件

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
