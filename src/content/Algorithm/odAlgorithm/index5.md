---
title: 华为od算法5
description: 华为od算法
date: 2024-06-11
---

# 算法5

## 求最多可以派出多少支团队

用数组代表每个人的能力 一个比赛活动要求参赛团队的最低能力值为N 每个团队可以由一人或者两人组成 且一个人只能参加一个团队 计算出最多可以派出多少只符合要求的队伍。

输入描述：

- 第一行代表总人数，范围1-500000
- 第二行数组代表每个人的能力- 数组大小，范围1-500000- 元素取值，范围1-500000
- 第三行数值为团队要求的最低能力值，范围1-500000

输出描述：最多可以派出的团队数量

```yaml
5
3 1 5 7 9
8

输出 3
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let totalPeople = 0;
let abilities = [];
let minAbility = 0;

rl.on('line', (line) => {
  if (totalPeople === 0) {
    totalPeople = parseInt(line);
  } else if (abilities.length === 0) {
    abilities = line.split(' ').map(Number);
  } else if (!minAbility) {
    minAbility = parseInt(line);

    abilities.sort((a, b) => a - b);

    let left = 0;
    let right = totalPeople - 1;
    let result = 0;

    while (left < right) {
      if (abilities[right] >= minAbility) {
        result++;
        right--;
      } else if (abilities[right] + abilities[left] >= minAbility) {
        result++;
        left++;
        right--;
      } else {
        left++;
      }
    }
    if (left === right && abilities[left] >= minAbility) {
      res += 1;
    }
    console.log(result);
  }
})

function aaaa (line, abilities, totalPeople) {
    minAbility = parseInt(line);

    abilities.sort((a, b) => a - b);

    let left = 0;
    let right = totalPeople - 1;
    let result = 0;

    while (left < right) {
      if (abilities[right] >= minAbility) {
        result++;
        right--;
      } else if (abilities[right] + abilities[left] >= minAbility) {
        result++;
        left++;
        right--;
      } else {
        left++;
      }
    }
    if (left === right && abilities[left] >= minAbility) {
      res += 1;
    }
    console.log(result);
}
```

## 寻找连续区间/数组连续和

给定一个含有N个正整数的数组, 求出有多少个连续区间（包括单个正整数）, 它们的和大于等于x。

输入描述：

- 第一行两个整数N x`(0 < N <= 100000, 0 <= x <= 10000000)`
- 第二行有N个正整数(每个正整数小于等于100)。

输出描述：

输出一个整数，表示所求的个数。

```yaml
3 7
3 4 7

4
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let N = 0;
let x = 0;
let nums = [];

rl.on('line', (line) => {
  if (N === 0) {
    let splitV = line.split(' ').map(Number);
    N = splitV[0];
    x = splitV[1];
  } else {
    nums = line.trim().split(' ').map(Number);

    let left = 0; // 滑动窗口左端点
    let right = 0; // 滑动窗口右端点
    let result = 0;
    let sum = 0;

    while (right < N) {
      sum += nums[right];
      while (sum >= x) {
        result += N - right;
        sum -= nums[left];
        left++;
      }
      right++;
    }
    console.log(result);
  }
})
```

## 字符串分割转换

给定一个非空字符串S，其被N个‘-’分隔成N+1的子串，给定正整数K，要求除第一个子串外，其余的子串每K个字符组成新的子串，并用‘-’分隔。对于新组成的每一个子串，如果它含有的小写字母比大写字母多，则将这个子串的所有大写字母转换为小写字母；

反之，如果它含有的大写字母比小写字母多，则将这个子串的所有小写字母转换为大写字母；大小写字母的数量相等时，不做转换。

输入描述：输入为两行，

- 第一行为参数K
- 第二行为字符串S。

输出描述：输出转换后的字符串。

```yaml
3
12abc-abCABc-4aB@

输出：12abc-abc-ABC-4aB-@
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let num = 0;
let str = '';
rl.on('line', (line) => {
  if (num === 0) {
    num = parseInt(line);
  } else {
    str = line;
    let result = '';
    const strArr = str.split('-');
    const prefix = strArr[0];
    const lastFix = strArr.slice(1);
    let allStr = lastFix.join('')
    let res = []
    for (let i = 0; i < allStr.length; i+=num) {
      let subStr = allStr.slice(i, i+num);
      let upper = 0;
      let lower = 0;
      for (let j = 0; j < subStr.length; j++) {
        if (/[a-z]/.test(subStr[j])) {
          lower++;
        } else if (/[A-Z]/.test(subStr[j])) {
          upper++;
        }
      }
      if (upper > lower) {
        subStr = subStr.toLowerCase();
      } else if (lower > upper) {
        subStr = subStr.toUpperCase();
      }
      res.push(subStr)
    }
    console.log(prefix + res.join('-'))
  }
})
```

## 连续字母长度

给定一个字符串，只包含大写字母，求在包含同一字母的子串中，长度第 k 长的子串的长度，相同字母只取最长的那个子串。

输入描述：

- 第一行有一个子串`(1<长度<=100)`，只包含大写字母。
- 第二行为 k的值

输出描述：输出连续出现次数第k多的字母的次数。

```yaml
输入：
AAAAHHHBBCDHHHH 3

输出：
2

说明：
同一个字母连续出现最多的A和H，4次；第二多是H，3次；但是H已经存在4个连续的，所以不考虑；下一个最长子传是BB，输出2
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.on('line', (str) => {
  rl.on('line', (k) => {
    k = parseInt(k);
    const arr = str.split('');
    let currChar = arr[0];
    let time = 1;
    const obj = {};

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === currChar) {
        time++;
      } else {
        obj[currChar] = obj[currChar] ? Math.max(time, obj[currChar]) : time;
        currChar = arr[i];
        time = 1;
      }
    }
    // 设置最后一次的结果
    obj[currChar] = obj[currChar] ? Math.max(time, obj[currChar]) : time;
    console.log(Object.values(obj).sort((a, b) => b - a)[k - 1] ?? -1)
  })
})
```

## 火星文计算

已知火星人使用的运算符为#、$，其与地球人的等价公式如下

`x#y = 2*x+3*y+4`

`x$y = 3*x+y+2`

已知：

- 其中x、y是无符号整数
- 地球人公式按C语言规则计算
- 火星人公式中，$的优先级高于#，相同的运算符，按从左到右的顺序计算

现有一段火星人的字符串报文，请你来翻译并计算结果

输入描述：

火星人字符串表达式（结尾不带回车换行）

输入的字符串说明：字符串为仅由无符号整数和操作符（#、$）组成的计算表达式。

例如：`123#4$5#67$78`。

用例保证字符串中，操作数与操作符之间没有任何分隔符。
用例保证操作数取值范围为32位无符号整数。
保证输入以及计算结果不会出现整型溢出。
保证输入的字符串为合法的求值报文，例如：123#4$5#67$78
保证不会出现非法的求值报文，例如类似这样字符串：
`#4$5` //缺少操作数

`4$5#` //缺少操作数

`4#$5` //缺少操作数

`4 $5` //有空格

`3+4-5*6/7` //有其它操作符

`12345678987654321$54321` //32位整数计算溢出

输出描述：根据输入的火星人字符串输出计算结果（结尾不带回车换行）。

```yaml
7#6$5#12

输出： 226
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', (str) => {
  const stack = []; // 存储数值信息栈
  let i = 0;

  while (i < str.length) {
    const char = str[i];
    if (/\d/.test(char)) {
      const start = i;
      while (i < str.length && /\d/.test(str[i])) {
        i++;
      }
      const num = parseInt(str.substring(start, i));
      stack.push(num);
    } else {
      if (char === '#') {
        i++;
      } else if (char === '$') {
        const x = stack.pop();
        i++;
        const start = i;
        while (i < str.length && /\d/.test(str[i])) {
          i++;
        }
        const y = parseInt(str.substring(start, i));
        stack.push(3 * x + y + 2);
      }
    }
  }
  const reverse = []
  while (stack.length) {
    reverse.push(stack.pop());
  }
  let result = reverse.pop();
  while (reverse.length) {
    const y = reverse.pop();
    result = result * 2 + 3 * y + 4;
  }
  console.log(result)
})
```

## 虚拟游戏理财

在一款虚拟游戏中生活，你必须进行投资以增强在虚拟游戏中的资产以免被淘汰出局。

现有一家Bank，它提供有若干理财产品 m 个，风险及投资回报不同，你有 N（元）进行投资，能接收的总风险值为X。

你要在可接受范围内选择最优的投资方式获得最大回报。

备注：

在虚拟游戏中，每项投资风险值相加为总风险值；
在虚拟游戏中，最多只能投资2个理财产品；
在虚拟游戏中，最小单位为整数，不能拆分为小数；
投资额*回报率=投资回报

输入描述：

第一行：

产品数（取值范围[1,20]）
总投资额（整数，取值范围[1, 10000]）
可接受的总风险（整数，取值范围[1,200]）
第二行：产品投资回报率序列，输入为整数，取值范围[1,60]

第三行：产品风险值序列，输入为整数，取值范围[1, 100]

第四行：最大投资额度序列，输入为整数，取值范围[1, 10000]

输出描述：每个产品的投资额序列

```yaml
5 100 10 

10 20 30 40 50 

3 4 5 6 10 

20 30 20 40 30

输出
0 30 0 40 0

说明：

投资第二项30个单位，第四项40个单位，总的投资风险为两项相加为4+6=10
```

```js
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
```

## 绘图机器

绘图机器的绘图笔初始位置在原点(0,0)机器启动后按照以下规则来进行绘制直线。

1. 尝试沿着横线坐标正向绘制直线直到给定的终点E

2. 期间可以通过指令在纵坐标轴方向进行偏移，offsetY为正数表示正向偏移,为负数表示负向偏移

给定的横坐标终点值E 以及若干条绘制指令，

请计算绘制的直线和横坐标轴以及x=E的直线组成的图形面积。

输入描述：

首行为两个整数 N 和 E
表示有N条指令,机器运行的横坐标终点值E
接下来N行 每行两个整数表示一条绘制指令x offsetY
用例保证横坐标x以递增排序的方式出现
且不会出现相同横坐标x

取值范围

`0<N<=10000`
`0<=x<=E<=20000`
`-10000<=offsetY<=10000`

输出描述：一个整数表示计算得到的面积 用例保证结果范围在0到4294967295之内。

```yaml
4 10 
1 1 
2 1 
3 1 
4 -2

输出 12
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
let lines = [];
let n = 0;
let e = 0;

rl.on('line', (line) => {
  lines.push(line);
}).on('close', () => {
  n = parseInt(lines[0].split(' ')[0]);
  e = parseInt(lines[0].split(' ')[1]);
  let offsets = new Array(e).fill(0);

  let inputs = lines.slice(1);
  for (let i = 0; i < inputs.length; i++) {
    let [x, offsetY] = inputs.split(' ').map(Number);
    offsets[x] = offsetY;
  }

  let dp = new Array(e).fill(0);
  dp[0] = 0;
  for (let i = 1; i < e; i++) {
    dp[i] = offsets[i] + dp[i - 1];
  }

  let ans = 0;
  for (const num of dp) {
    ans += Math.abs(num);
  }
  console.log(ans);
})
```

## 机场航班调度

XX市机场停放了多架飞机，每架飞机都有自己的航班号CA3385，CZ6678，SC6508等，航班号的前2个大写字母(或数字)代表航空公司的缩写，后面4个数字代表航班信息。但是XX市机场只有一条起飞用跑道，调度人员需要安排目前停留在机场的航班有序起飞。为保障航班的有序起飞，调度员首先按照航空公司的缩写（航班号前2个字母）对所有航班进行排序，同一航空公司的航班再按照航班号的后4个数字进行排序最终获得安排好的航班的起飞顺序。请编写一段代码根据输入的航班号信息帮助调度员输出航班的起飞顺序。航空公司缩写排序按照从特殊符号$ & *, 09，AZ排序；

输入描述：第一行输入航班信息，多个航班号之间用逗号（“，”）分隔，输入的航班号不超过100个例如：

```yaml
CA3385,CZ6678,SC6508,DU7523,HK4456,MK0987

备注：航班号为6位长度，后4位为纯数字，不考虑存在后4位重复的场景
```

输出描述：

```yaml
CA3385,CZ6678,DU7523,HK4456,MK0987,SC6508
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (line) => {
  const inputs = line.split(',');

  inputs.sort((s1, s2) => {
    let order = '$&*0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < 2; i++) {
      let diff = order.indexOf(s1[i] - order.indexOf(s2[i]))
      if (diff !== 0) {
        return diff;
      }
    }
    return s1.slice(2) - s2.slice(2); // 比较后4位
  })
  console.log(inputs.join(','))
})

function aaa (line) {
  const inputs = line.split(',');
  const allOrder = '$&*0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZ'

  function strcmp (a1, a2) {
    if (a1 > a2) {
      return 1
    } else if (a1 < a2) {
      return -1
    } else {
      return 0;
    }
  }
  inputs.sort((s1, s2) => {
    const attr1 = s1.slice(0, 2);
    const attr2 = s2.slice(0, 2);
    const nums1 = s1.slice(2);
    const nums2 = s2.slice(2);
    if (attr1 === attr2) {
      return strcmp(nums1, nums2)
    } else {
      return strcmp(attr1, attr2)
    }
  })
  console.log(inputs.join(','))
}
```

## 围棋的气

围棋棋盘由纵横各19条线垂直相交组成，棋盘上一共19x19=361个交点，对弈双方一方执白棋，一方执黑棋，落子时只能将棋子置于交点上。

“气”是围棋中很重要的一个概念，某个棋子有几口气，是指其上下左右方向四个相邻的交叉点中，有几个交叉点没有棋子，由此可知：

- 在棋盘的边缘上的棋子最多有3口气（黑1），在棋盘角点的棋子最多有2口气（黑2），其它情况最多有4口气（白1）
- 所有同色棋子的气之和叫作该色棋子的气，需要注意的是，同色棋子重合的气点，对于该颜色棋子来说，只能计算一次气，比如下图中，黑棋一共4口气，而不是5口气，因为黑1和黑2中间红色三角标出的气是两个黑棋共有的，对于黑棋整体来说只能算一个气
- 本题目只计算气，对于眼也按气计算，如果您不清楚“眼”的概念，可忽略，按照前面描述的规则计算即可现在，请根据输入的黑棋和白棋的坐标位置，计算黑棋和白棋一共各有多少气?

输入描述：

输入包括两行数据，如:

0 5 8 9 9 10

5 0 9 9 9 8

1、每行数据以空格分隔，数据个数是2的整数倍，每两个数是一组,代表棋子在棋盘上的坐标；

2、坐标的原点在棋盘左上角点，第一个值是行号，范围从0到18;第二个值是列号，范围从0到18；

3、举例说明: 第一行数据表示三个坐标 (0，5)、 (8，9)、 (9,10)；

4、第一行表示黑棋的坐标，第二行表示白棋的坐标。

5、题目保证输入两行数据，无空行且每行按前文要求是偶数个，每个坐标不会超出棋盘范围。

输出描述：

8 7

两个数字以空格分隔，第一个数代表黑棋的气数，第二个数代表白棋的气数。

```yaml
输入：
0 5 8 9 9 10
5 0 9 9 9 8

输出：
8 7
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
let inputs = []
let maxSides = 18
rl.on('line', (line) => {
  inputs.push(line);
}).on('close', () => {
  let blocks = inputs[0].split(' ').map(Number);
  let whites = inputs[1].split(' ').map(Number);

  function counting(alias, enemy) {
    let countSet = new Set();

    for (let i = 0; i < alias.length; i += 2) {
      let x = alias[i];
      let y = alias[i + 1];

      let pos = x + '_' + y;
      countSet.add(pos);
      if (x > 0) {
        countSet.add((x - 1) + '_' + y);
      }
      if (x < maxSides) {
        countSet.add((x + 1) + '_' + y);
      }
      if (y > 0) {
        countSet.add(x + '_' + (y - 1)); // 注意运算顺序，一定要加括号
      }
      if (y < maxSides) {
        countSet.add(x + '_' + (y + 1));
      }
    }

    let size = countSet.size;
    for (let i = 0; i < enemy.length; i += 2) {
      let pos = enemy[i] + '_' + enemy[i + 1];
      if (countSet.has(pos)) {
        size--;
      }
    }

    return size - (alias.length / 2); // 减去自身坐标数量
  }

  console.log(counting(blocks, whites), counting(whites, blocks));
})
```

## 小华地图寻宝

小华按照地图去寻宝，地图上被划分成 m 行和 n 列的方格，横纵坐标范围分别是 [0, n-1] 和 [0, m-1]。

在横坐标和纵坐标的数位之和不大于 k 的方格中存在黄金（每个方格中仅存在一克黄金），但横坐标和纵坐标数位之和大于 k 的方格存在危险不可进入。小华从入口 (0,0) 进入，任何时候只能向左，右，上，下四个方向移动一格。

请问小华最多能获得多少克黄金？

输入描述：

坐标取值范围如下：

0 ≤ m ≤ 50
0 ≤ n ≤ 50
k 的取值范围如下：

0 ≤ k ≤ 100
输入中包含3个字数，分别是m, n, k

输出描述：输出小华最多能获得多少克黄金

```yaml
输入 40 40 18

输出 1484

输入 5 4 7

输出 20
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (line) => {
  let [m, n, k] = line.split(' ').map(Number);
  const visted = Array.from({
    length: m
  }, () => {
    return Array(n).fill(0);
  })

  function sumOfDigits (num) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    return sum;
  }

  function dfs (x, y, m, n, k, visted) {
    // 判断坐标是否越界
    if (x < 0 || x >= m || y < 0 || y >= n || (sumOfDigits(x) + sumOfDigits(y) > k) || visted[x][y] === 1) {
      return 0;
    }
    visted[x][y] = 1;

    return dfs(x + 1, y, m, n, k, visted) + dfs(x - 1, y, m, n, k, visted) + dfs(x, y + 1, m ,n ,k ,visted) + dfs(x ,y - 1 ,m ,n ,k ,visted) + 1;
  }

  console.log(dfs(0, 0, m, n, k, visted));
  rl.close();
})
```
