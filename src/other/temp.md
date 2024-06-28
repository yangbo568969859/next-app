用js写一个函数，列出一个整数的所有分解类型，比如对于数字4，可以分解为以下内容

```yaml
1111
112
121
13
211
22
31
4
```

```js
function getDecompositions(num) {
  const result = [];

  function backtrack(current, start, remaining) {
    if (remaining === 0) {
      result.push(current.join(''));
      return;
    }

    for (let i = start; i <= remaining; i++) {
      current.push(i);
      backtrack(current, i, remaining - i);
      current.pop();
    }
  }

  backtrack([], 1, num);
  return result;
}

// 示例用法
console.log(getDecompositions(4));
```

```js
function getDecompositions(num) {
  const result = new Set();

  function backtrack(current, remaining) {
    if (remaining === 0) {
      result.add(current.join(''));
      return;
    }

    for (let i = 1; i <= remaining; i++) {
      current.push(i);
      backtrack(current, remaining - i);
      current.pop();
    }
  }

  function generatePermutations(arr) {
    const result = new Set();

    function permute(current, remaining) {
      if (remaining.length === 0) {
        result.add(current.join(''));
        return;
      }

      for (let i = 0; i < remaining.length; i++) {
        current.push(remaining[i]);
        permute(current, remaining.slice(0, i).concat(remaining.slice(i + 1)));
        current.pop();
      }
    }

    permute([], arr);
    return Array.from(result);
  }

  backtrack([], num);
  const decompositions = Array.from(result);
  const finalResult = new Set();

  for (const decomposition of decompositions) {
    const permutations = generatePermutations(decomposition.split(''));
    for (const permutation of permutations) {
      finalResult.add(permutation);
    }
  }

  return Array.from(finalResult);
}

// 示例用法
console.log(getDecompositions(4));
```

```js
function aaa (num) {
  const result = new Set();
  function backtrack(current, remaining) {
    if (remaining === 0) {
      // result.push(current.join(''));
      result.add(current.join(''));
      return;
    }
    console.log(current, remaining);
    for (let i = 1; i <= remaining; i++) {
      current.push(i);
      backtrack(current, remaining - i);
      current.pop();
    }
  }
  backtrack([], num);
  console.log(result);
}
```

```js
const compose = (...funcs) => {
  // write your code here
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return (arg) => {
    return funcs.reduce((promise, curr) => {
      return promise.then((res) => curr(res));
    }, Promise.resolve(arg));
  }
}

const plus1 = (n) => n + 1;
const minus2 = (n) => new Promise((resolve) => resolve(n - 2));
const multiply3 = (n) => { return n * 3 };
const actionFunc = compose(plus1, minus2, multiply3);
actionFunc(0).then(res => console.log(res)); // -3
```
