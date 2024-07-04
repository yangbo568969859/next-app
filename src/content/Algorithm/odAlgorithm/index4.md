---
title: 华为od算法4
description: 华为od算法
date: 2024-06-11
---

# 算法4

## 万能单词拼写/掌握单词个数

有一个字符串数组 words 和一个字符串 chars。假如可以用 chars 中的字母拼写出 words 中的某个“单词”（字符串），那么我们就认为你掌握了这个单词。

words 的字符仅由 a-z 英文小写字母组成，例如 "abc"

chars 由 a-z 英文小写字母和 "?" 组成。其中英文 "?" 表示万能字符，能够在拼写时当作任意一个英文字母。例如："?" 可以当作 "a" 等字母。

注意：每次拼写时，chars 中的每个字母和万能字符都只能使用一次。

输出词汇表 words 中你掌握的所有单词的个数。没有掌握任何单词，则输出0。

输入描述：

- 第一行：输入数组 words 的个数，记作N。
- 第二行 ~ 第N+1行：依次输入数组words的每个字符串元素
- 第N+2行：输入字符串chars

输出描述：输出一个整数，表示词汇表 words 中你掌握的单词个数

备注

- `1 ≤ words.length ≤ 100`
- `1 ≤ words[i].length, chars.length ≤ 100`
- 所有字符串中都仅包含小写英文字母、英文问号

```yaml
4
cat
bt
hat
tree
atach??
输出 3
说明 可以拼写字符串 cat bt hat

3
hello
world
cloud
welldonehohneyer
输出 2
可以拼写字符串 hello world
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let input = []
rl.on('line', (line) => {
  input.push(line)
}).on('close', () => {
  const N = parseInt(input[0]) // 读取单词数量
  const words = input.slice(1, N + 1) // 读取单词数组
  const chars = input[N + 1] // 读取字符串

  const count = new Array(26).fill(0) // 初始化数组
  const freeCharCount = 0;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== '?') {
      count[chars[i].charCodeAt() - 'a'.charCodeAt()]++;
    } else {
      freeCharCount++;
    }
  }

  function canSpell(worldCount, count, freeCharCount) {
    for (let i = 0; i < 26; i++) {
      if (wordCount[i] > count[i]) {
        freeCharCount -= wordCount[i] - count[i];
        if (freeCharCount < 0) {
          return false;
        }
      }
    }
    return true;
  }
  let result = 0;
  for (let word of words) {
    const worldCount = new Array(26).fill(0)
    for (let ch of word) {
      worldCount[ch.charCodeAt() - 'a'.charCodeAt()]++;
    }
    if (canSpell(worldCount, count, freeCharCount)) {
      result++;
    }
  }
  console.log(result)
})
```

## CPU算力分配

现有两组服务器A和B，每组有多个算力不同的CPU，其中 A[i] 是 A 组第 i 个CPU的运算能力，B[i] 是 B组 第 i 个CPU的运算能力。

一组服务器的总算力是各CPU的算力之和。

为了让两组服务器的算力相等，允许从每组各选出一个CPU进行一次交换，

求两组服务器中，用于交换的CPU的算力，并且要求从A组服务器中选出的CPU，算力尽可能小。

输入描述：

第一行输入为L1和L2，以空格分隔，L1表示A组服务器中的CPU数量，L2表示B组服务器中的CPU数量。

第二行输入为A组服务器中各个CPU的算力值，以空格分隔。

第三行输入为B组服务器中各个CPU的算力值，以空格分隔。

- `1 ≤ L1 ≤ 10000`
- `1 ≤ L2 ≤ 10000`
- `1 ≤ A[i] ≤ 100000`
- `1 ≤ B[i] ≤ 100000`

输出描述：

对于每组测试数据，输出两个整数，以空格分隔，依次表示A组选出的CPU算力，B组选出的CPU算力。

要求从A组选出的CPU的算力尽可能小。

备注：

- 保证两组服务器的初始总算力不同。
- 答案肯定存在

```yaml
2 2
1 1
2 2

输出1 2
说明 从A组中选出算力为1的CPU，与B组中算力为2的CPU进行交换，使得两组服务器算力都等于3
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let lines = [];
rl.on('line', (line) => {
  lines.push(line);
}).on('close', () => {
  const [L1, L2] = lines[0].split(' ').map(Number);

  let totalPowerA = 0;
  let totalPowerB = 0;
  const powerA = lines[1].split(' ').map(Number);
  totalPowerA = powerA.reduce((a, b) => a + b);
  const powerBmap = new Map();
  const powerB = lines[2].split(' ').map(Number);
  for (let temp of powerB) {
    totalPowerB += temp;
    powerBmap.set(temp, (powerBmap.get(temp) || 0) + 1);
  }

  let halfDiff = Math.round((totalPowerA - totalPowerB) / 2);

  for (let power of powerA) {
    let serachB = power - halfDiff;
    if (powerBmap.has(serachB) && powerBmap.get(searchB) > 0) {
      console.log(power, serachB);
      break;
    }
  }

})
```

## 小明的幸运数

小明在玩一个游戏，游戏规则如下：在游戏开始前，小明站在坐标轴原点处（坐标值为0）.

给定一组指令和一个幸运数，每个指令都是一个整数，小明按照指令前进指定步数或者后退指定步数。前进代表朝坐标轴的正方向走，后退代表朝坐标轴的负方向走。

幸运数为一个整数，如果某个指令正好和幸运数相等，则小明行进步数+1。

例如：

幸运数为3，指令为[2,3,0,-5]

指令为2，表示前进2步；

指令为3，正好和幸运数相等，前进3+1=4步；

指令为0，表示原地不动，既不前进，也不后退。

指令为-5，表示后退5步。

请你计算小明在整个游戏过程中，小明所处的最大坐标值。

输入描述：

- 第一行输入1个数字，代表指令的总个数 n（1 ≤ n ≤ 100）
- 第二行输入1个数字，代表幸运数m（-100 ≤ m ≤ 100）
- 第三行输入n个指令，每个指令的取值范围为：-100 ≤ 指令值 ≤ 100

输出描述：输出在整个游戏过程中，小明所处的最大坐标值。异常情况下输出：12345

```yaml
2
1
-5 1
输出 0
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let inputs = []
rl.on('line', (line) => {
  inputs.push(line);
}).on('close', () => {
  const allNum = parseInt(inputs[0])
  const luckyNum = parseInt(inputs[1])

  if (allNum < 1 || allNum > 100 || luckyNum < -100 || luckyNum > 100) {
    console.log(12345)
    process.exit(0);
  }
  const arraySteps = inputs[2].split(' ').map(Number)
  let maxCord = 0;
  let currentCord = 0;

  for (let i = 0; i < allNum; i++) {
    let step = arraySteps[i]
    if (step < -100 || step > 100) {
      console.log(12345)
      process.exit(0);
    }
    if (step === luckyNum) {
      if (step > 0) {
        step = 1
      } else {
        step = -1
      }
    }
    currentCord += step;
    maxCord = Math.max(currentCord, maxCord)
  }
  console.log(maxCord)
})
```

## 来自异国的客人/幸运数字

有位客人来自异国，在该国使用m进制计数。该客人有个幸运数字`n(n<m)`，每次购物时，其总是喜欢计算本次支付的花费(折算为异国的价格后)中存在多少幸运数字。问：当其购买一个在我国价值k的产品时，其中包含多少幸运数字？

输入描述：第一行输入为 k, n, m。

- k 表示 该客人购买的物品价值（以十进制计算的价格）
- n 表示 该客人的幸运数字
- m 表示 该客人所在国度的采用的进制

输出描述：输出幸运数字的个数，行末无空格。当输入非法内容时，输出0

10 2 4：10用4进制表示时为22，同时，异国客人的幸运数字是2，故而此处输出为2，表示有2个幸运数字

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.on('line', (line) => {
  let [k, m, n] = line.split(' ').map(Number);
  if (k < 0 || n < 0 || m <= 1 || n > m) {
    console.log(0);
  } else {
    let count = 0;
    while (k > 0) {
      if (k % m === n) {
        count++;
      }
      k = Math.floor(k / m);
    }
    console.log(count);
  }
})
```

## 园区参观路径

园区某部门举办了Family Day，邀请员工及其家属参加；

将公司园区视为一个矩形，起始园区设置在左上角，终点园区设置在右下角；

家属参观园区时，只能向右和向下园区前进，求从起始园区到终点园区会有多少条。

输入描述：

- 输入第一行为园区的长和宽；
- 接下来每一行表示该园区是否可以参观，0表示可以参观，1表示不可以参观。

输出描述：输出为不同路径的数量

```js
输入：
3 3
0 0 0
0 1 0
0 0 0

输出：
2
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let input = []
rl.on('line', (line) => {
  input.push(line);
}).on('close', () => {
  const [m, n] = input[0].split(' ').map(Number);
  let grid = []
  for (let i = 1; i < input.length; i++) {
    grid.push(input[i].split(' ').map(Number))
  }
  let dp = Array.from({ length: m }, () => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        if (i === 0 && j === 0) {
          dp[i][j] = 1;
        } else if (i === 0) {
          dp[i][j] = dp[i][j - 1]
        } else if (j === 0) {
          dp[i][j] = dp[i - 1][j]
        } else {
          dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        }
      }
    }
  }
  console.log(dp[m - 1][n - 1])
})
```

## 英文输入法

主管期望你来实现英文输入法单词联想功能。需求如下:

依据用户输入的单词前缀，从已输入的英文语句中联想出用户想输入的单词，按字典序输出联想到的单词序列，如果联想不到，请输出用户输入的单词前缀。

注意：

- 英文单词联想时，区分大小写
- 缩略形式如"don’t”，判定为两个单词，"don“和"t“
- 输出的单词序列，不能有重复单词，且只能是英文单词，不能有标点符号

输入描述：

输入为两行，首行输入一段由英文单词word和标点符号组成的语句str；

接下来一行为一个英文单词前缀pre

`0 < word.length() ⩽ 20`
`0 < str.length() ⩽ 1000`
`0 < pre ⩽ 20`

输出描述：输出符合要求的单词序列或单词前缀，存在多个时，单词之间以单个空格分割；

```yaml
I love you
He

输出 He 
说明：从已输入的信息中无法联想出任何符合要求的单词，因此输出用户输入的单词前缀


```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let ipnut = []
rl.on('line', (line) => {
  rl.on('line', (prefix) => {
    let sentense = line.replace(/[^\w\s]/g, ' ');
    const worldSet = new Set(sentense.split(' '));
    let ans = '';
    for (const word of Array.from(worldSet).sort()) {
      if (word.startsWith(prefix)) {
        ans += word + ' ';
      }
    }
    if (ans) {
      console.log(ans);
    } else {
      console.log(prefix);
    }
    rl.close();
  })
})
```

## 字符串筛选排序

输入一个由N个大小写字母组成的字符串
按照ASCII码值从小到大进行排序
查找字符串中第K个最小ASCII码值的字母(`k>=1`)
输出该字母所在字符串中的位置索引(字符串的第一个位置索引为0)
k如果大于字符串长度则输出最大ASCII码值的字母所在字符串的位置索引
如果有重复字母则输出字母的最小位置索引

输入描述：

- 第一行输入一个由大小写字母组成的字符串
- 第二行输入k ，k必须大于0 ，k可以大于输入字符串的长度

输出描述：

- 输出字符串中第k个最小ASCII码值的字母所在字符串的位置索引
- k如果大于字符串长度则输出最大ASCII码值的字母所在字符串的位置索引
- 如果第k个最小ASCII码值的字母存在重复 则输出该字母的最小位置索引用例

```yaml
AbCdeFG
3
输出 5
```

```js
function solution(str, index) {
  if (index > str.length) {
    index = str.length
  }
  return str.indexOf(str.split('').sort()[index - 1]);
}
```

## 拼接URL

给定一个url前缀和url后缀,通过`,`分割 需要将其连接为一个完整的url（约束：不用考虑前后缀URL不合法情况）

- 如果前缀结尾和后缀开头都没有/，需要自动补上/连接符
- 如果前缀结尾和后缀开头都为/，需要自动去重

输入描述：url前缀(一个长度小于100的字符串) url后缀(一个长度小于100的字符串)

输出描述：拼接后的url

```yaml
/acm,/bb

输出 /acm/bb

/abc/,/bcd

输出 /abc/bcd
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', (line) => {
  const splitVal = line.split(',');
  if (splitVal.length === 0) {
    console.log('/');
    process.close();
  }
  let [prefix, suffix] = line.split(',');
  if (prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1);
  }
  if (suffix.startsWith('/')) {
    suffix = suffix.slice(1);
  }
  console.log(prefix + '/' + suffix);
})
```

## 最少停车数/停车场车辆统计

特定大小的停车场，数组cars[]表示，其中1表示有车，0表示没车。车辆大小不一，小车占一个车位（长度1），货车占两个车位（长度2），卡车占三个车位（长度3）。

统计停车场最少可以停多少辆车，返回具体的数目。

输入描述：整型字符串数组cars[]，其中1表示有车，0表示没车，数组长度小于1000。

输出描述：整型数字字符串，表示最少停车数目。

```yaml
1,0,1

输出 2
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', (line) => {
  let result = 0;
  let placseCount = 0; // 停车场已有车辆
  let cars = line.split(',').join('').split('0');

  
  for (let slot of cars) {
    const occupied_length = slot.length;

    if (occupied_length === 0) {
      result = result;
    } else if (occupied_length % 3 === 0 && occupied_length > 0) {
      // 被3整除说明可以放整数辆卡车
      result += Math.floor(occupied_length / 3);
    } else if (occupied_length % 3 !== 0 && occupied_length > 0) {
      // 不能被3整除 需要去求得可以放卡车的数，其余只能放一辆货车或者小车
      result += Math.floor((occupied_length - occupied_length % 3) / 3)
      result += 1;
    }
  }
  console.log(result);
})
```

## API集群负载统计

RESTful API集合部署在服务器集群的多个节点上，近期对客户端访问日志进行了采集，需要统计各个API的访问频次，根据热点信息在服务器节点之间做负载均衡，现在需要实现热点信息统计查询功能。

RESTful API是由多个层级构成，层级之间使用 / 连接，如 /A/B/C/D 这个地址，A属于第一级，B属于第二级，C属于第三级，D属于第四级。

现在负载均衡模块需要知道给定层级上某个名字出现的频次，未出现过用0表示，实现这个功能。

输入描述：

- 第一行为N，表示访问历史日志的条数，0 ＜ N ≤ 100。
- 接下来N行，每一行为一个RESTful API的URL地址，约束地址中仅包含英文字母和连接符 / ，最大层级为10，每层级字符串最大长度为10
- 最后一行为层级L和要查询的关键字。

输出描述：输出给定层级上，关键字出现的频次，使用完全匹配方式（大小写敏感）

```yaml
5
/huawei/computing/no/one
/huawei/computing
/huawei
/huawei/cloud/no/one
/huawei/wireless/no/one
2 computing

输出 2


5
/huawei/computing/no/one
/huawei/computing
/huawei
/huawei/cloud/no/one
/huawei/wireless/no/one
4 two

输出 0
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let inputs = []
rl.on('line', (line) => {
  inputs.push(line);
}).on('close', () => {
  const N = parseInt(inputs[0]);
  const urls = inputs.slice(1, N + 1);
  const end = inputs[N + 1];
  const endLevel = parseInt(end.split(' ')[0]);
  const endKey = end.split(' ')[1];

  let result = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const splitUrls = url.split('/');

    if (splitUrls.length >= endLevel && splitUrls[endLevel] === endKey) {
      result++;
    }
  }
  console.log(result);
});
```
