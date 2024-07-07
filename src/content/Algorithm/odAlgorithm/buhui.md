- 转盘寿司
- 求满足条件的最长子串的长度
- 字符串摘要
- 执行任务赚获取最多积分
- 虚拟游戏理财
- 核酸检测
- 小朋友来自多少小区

```js
// 字符串摘要
function getStr(str) {
  str = str.toLowerCase();
  let charCount = new Array(126).fill(0);
  let sb = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= 'a' || str[i] <= 'z') {
      sb += str[i];
      charCount[str[i].charCodeAt()]++;
    }
  }

  let answer = [];
  let input = sb + ' ';
  let repeat = 1;
  let pre = input.charAt(0);
  charCount[pre.charCodeAt()]--;
  for (let i = 0; i < input.length; i++) {
    let cur = input.charAt(i);
    charCount[cur.charCodeAt()]--;
    if (cur === pre) {
      repeat++;
    } else {
      let num = repeat > 1 ? repeat : charCount[pre.charCodeAt()];
      answer.push(pre + num);
      repeat = 1;
      pre = cur;
    }
  }
  answer.sort((a, b) => {
    let anum = a.slice(1);
    let bnum = b.slice(1);
    if (anum !== bnum) {
      return bnum - anum
    } else {
      return a.charAt(0) - b.charAt(0);
    }
  })
}
```

```js
// 转盘寿司
function handle (prices) {
  let res = new Array(prices.length).fill(0);
  let stack = [];
  for (let i = 0; i < prices.length * 2 - 1; i++) {
    let realIndex = i % prices.length;

    while (stack.length && prices[stack[stack.length - 1]] > prices[realIndex]) {
      let topIndex = stack.pop();
      res[topIndex] = prices[topIndex] + prices[realIndex];
    }

    stack.push(prices[i])
  }

  while (stack.length > 0) {
    let topIndex = stack.pop();
    res[topIndex] = prices[topIndex];
  }
}
```

```js
// 求满足条件的最长子串的长度 abC124ACb
function handle (str) {
  let maxLength = 0;
  let hasLetter = false;
  let left = 0; let right = 0;
  let letterIdx = [];

  while (right < str.length) {
    let char = str.charAt(right);
    if (char.match(/[a-zA-Z]/)) {
      hasLetter = true;
      letterIdx.push(right);
      if (letterIdx.length > 1) {
        left = letterIdx.shift() + 1;
      }
      if (right === left) {
        right++;
        continue;
      }
    }
    maxLength = Math.max(maxLength, right - left + 1);
    right++;
  }
  console.log(maxLength);
}
```

```js
// 执行任务赚获取最多积分
function handle () {
  
}
```

```js
// 虚拟游戏理财
function handle () {
// 解题思路:
// 可以通过动态规划来解决。我们可以定义一个三维数组 dp[i][j][k]，表示投资前 i 个理财产品，总投资额不超过 j，总风险不超过 k 的情况下，能获得的最大回报。然后我们可以根据这个二维数组逆向推导出每个产品的投资额。
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
 
let input = []
rl.on('line', (line) => {
  input.push(line)
}).on('close', () => {
  // m -> 产品数；N -> 总投资额；X -> 可接受的总风险
  const [m, N, X] = lines[0].split(' ').map(Number)
  // 每个项目预期回报率
  const returns = lines[1].split(' ').map(Number)
  // 每个项目的风险值
  const risks = lines[2].split(' ').map(Number)
  // 每个项目的最大投资额度
  const maxInvestments = lines[3].split(' ').map(Number)
 
  let maxReturn = 0;
  const dp = Array.from({
    length: m + 1
  }, () => {
    return Array.from({
      length: N + 1
    }, () => Array(X + 1).fill(0))
  })
 
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= N; j++) {
      for (let k = 1; k <= X; k++) {
        dp[i][j][k] = dp[i - 1][j][k]; // 不投资第i个项目的情况 
        if (risks[i - 1] <= k && maxInvestments[i - 1] <= j) { // 如果第i个产品风险小于当前风险
          dp[i][j][k] = Math.max(dp[i][j][k], dp[i - 1][j - maxInvestments[i - 1]][k - risks[i - 1]] + returns[i - 1]);
        }
      }
    }
  }
  // 根据 dp 数组逆向推导每个产品的投资额
  let j = m;
  let k = x;
  const investments = Array(n).fill(0);
  for (let i = n; i > 0 && j > 0 && k > 0; i--) {
    if (dp[i][j][k] !== dp[i - 1][j][k]) { // 如果投资了第 i 个产品
      investments[i - 1] = maxInvestments[i - 1]; // 投资额为最大投资额
      j -= maxInvestments[i - 1]; // 减去投资的额度
      k -= risks[i - 1]; // 减去投资的风险值
    }
  }
 
  return investments.join(" ");
})
}
```

```js
// 核酸检测
// num 5;
// confirmedCases 1,2
// inputs ['1,1,0,1,0', '1,1,0,0,0']
1,1,0,1,0
1,1,0,0,0
0,0,1,0,1
1,0,0,1,0
0,0,1,0,1
function handle (num, confirmedCases, inputs) {
  let confirm = confirmedCases.split(',').map(Number);
  let visited = new Array(num).fill(false);
  let contacts = Array.from({ length: num }, () => {
    return Array(num).fill(false);
  })
  inputs.forEach((value, index) => {
    let split = value.split(',')
    contacts[index] = split.map(value => value == 1);
  })
  console.log('contacts', contacts);

  function dfs (contacts, visited, start) {
    visited[start] = true;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[start][i] && !visited[i]) {
        dfs(contacts, visited, i);
      }
    }
  }
  confirm.forEach((value) => {
    dfs(contacts, visited, value);
  })
  console.log('visited', visited);
  let count = 0;
  visited.forEach((hasVisited, index) => {
    if (hasVisited && !confirm.includes(index)) {
      count++;
    }
  })
  console.log(count);
}
```

```js
// 小朋友来自多少小区
// inputs = '2 2 3'
function handle1 (inputs) {
  let arr = inputs.split(' ').map(Number);
  // 创建一个数组存储每个小区孩子数量
  let counts = [];
  let result = 0;
  arr.forEach(value => {
    let children = value;
    while (children >= counts.length) {
      counts.push(0);
    }
    counts[children]++;
  })
  // arr = [0, 0, 2, 1]
  // arr = [0, 0, 8, 0, 5, 0, 2]
  counts.forEach((value, index) => {
    if (value > 0) {
      let districtSize = index + 1; // 3
      result += Math.ceil(value / districtSize) * districtSize
    }
  })
  console.log(result);
  
}
```