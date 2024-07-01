---
title: 华为od算法3
description: 华为od算法
date: 2024-06-11
---

# 算法3

## 学生排名/智能成绩表

小明来到学校当老师，需要将学生按考试总分或单科分数进行排名，你能帮帮他吗？

输入描述：

- 第 1 行输入两个整数，学生人数 n 和科目数量 m
- 第 2 行输入 m 个科目名称，彼此之间用空格隔开。
  - 科目名称只由英文字母构成，单个长度不超过10个字符。
  - 科目的出现顺序和后续输入的学生成绩一一对应。
  - 不会出现重复的科目名称。
- 第 3 行开始的 n 行，每行包含一个学生的姓名和该生 m 个科目的成绩（空格隔开）
  - 学生不会重名。
  - 学生姓名只由英文字母构成，长度不超过10个字符。
  - 成绩是0~100的整数，依次对应第2行种输入的科目。
- 第n+2行，输入用作排名的科目名称。若科目不存在，则按总分进行排序。

输出描述：输出一行，按成绩排序后的学生名字，空格隔开。成绩相同的按照学生姓名字典顺序排序。

```yaml
3 2
yuwen shuxue
fangfang 95 90
xiaohua 88 98
minmin 100 82
shuxue

输出 xiaohua fangfang minmin
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let inputs = [];
rl.on('line', (line) => {
  inputs.push(line);
}).on('close', () => {
  // 第一行 学生人数 n 和科目数量 m
  // 第二行 m 个科目
  // 第三行 姓名+m学科成绩
  // n+2 排名科目名称，不存在按总成绩
  const [n, m] = inputs[0].split(' ').map(Number);
  const allProjects = inputs[1].split(' ');
  const resultLevel = inputs[inputs.length - 1];
  const students = [];
  for (let i = 2; i < n + 2; i++) {
    const splitValue = inputs[i].split(' ');
    students.push({
      name: splitValue[0],
      scores: splitValue.slice(1).map(Number),
      allScore: splitValue.slice(1).map(Number).reduce((acc, cur) => { return acc + cur}, 0)
    })
  }

  let result = []
  const rankSubject = allProjects.indexOf(resultLevel);
  students.sort((a, b) => {
    const score1 = rankSubject === -1 ? a.allScore : a.scores[rankSubject];
    const score2 = rankSubject === -1 ? b.allScore : b.scores[rankSubject];
    if (score2 !== score1) {
      return score2 - score1
    } else {
      return a.name.localeCompare(b.name);
    }
  })
  for (let i = 0; i < students.length; i++) {
    result.push(students[i].name);
  }
  console.log(result.join(' '));
})
```

## 按身高和体重排队

某学校举行运动会，学生们按编号(1、2、3…n)进行标识，现需要按照身高由低到高排列，对身高相同的人，按体重由轻到重排列；对于身高体重都相同的人，维持原有的编号顺序关系。请输出排列后的学生编号。

输入描述：

两个序列，每个序列由n个正整数组成（0 < n <= 100）。第一个序列中的数值代表身高，第二个序列中的数值代表体重。

输出描述：

排列结果，每个数值都是原始序列中的学生编号，编号从1开始

```yaml
4 
100 100 120 130
40 30 60 50

输出 2 1 3 4
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const inputs = []
rl.on('line', (line) => {
  inputs.push(line);

  if (inputs.length === 3) {
    let n = parseInt(inputs[0]);
    let heights = inputs[1].split(' ').map(Number);
    let weights = inputs[2].split(' ').map(Number);

    let persons = [];
    for (let i = 0; i < n; i++) {
      persons.push({
        id: i + 1,
        height: heights[i],
        weight: weights[i]
      })
    }
    persons.sort((a, b) => {
      if (a.height === b.height) {
        return a.weight - b.weight;
      } else {
        return a.height - b.height;
      }
    })
    console.log(persons.map(person => person.id).join(' '));
  }
})
```

## 字符串变换最小字符串

给定一个字符串s, 最多只能进行一次变换， 返回变换后能得到的最小字符串（按照字典序进行比较）。

变换规则： 交换字符串中任意两个不同位置的字符。

输入描述：

一串小写字母组成的字符串s。

输出描述：

按照要求进行变换得到的最小字符串。

备注：

- s是都是小写字符组成
- `1<=s.length<=1000`

```yaml
输入：
abcdef

输出：
abcdef

说明：abcdef已经是最小字符串，不需要交换

贪心的题目：字典序最小，字符串越前面优先级越大，因此从左往右遍历字符串，遍历的同时右侧寻找可以交换的位置（字典序更小）
如果找到了可以交换的位置则交换字符然后返回结果即可
```

```js
const readline = require('readline');
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.on('line', (line) => {
  const str = line.trim();
  const minStr = str.split('').sort().join(''); // 与排序后的字符串比较

  if (str === minStr) {
    console.log(str);
  } else {
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== minStr[i]) {
        const char = minStr[i];
        const changeIndex = str.lastIndexOf(char); // 如果存在多个该字符则找最后一个字符与他替换才能成为最小字符串
        const array = str.split('');
        [array[i], array[changeIndex]] = [array[changeIndex], array[i]];
        console.log(array.join(''));
        break;
      }
    }
  }
})
  
```

## GPU调度/执行时长

为了充分发挥GPU[算力]，需要尽可能多的将任务交给GPU执行，现在有一个任务数组，数组元素表示在这1秒内新增的任务个数且每秒都有新增任务。

假设GPU最多一次执行n个任务，一次执行耗时1秒，在保证GPU不空闲情况下，最少需要多长时间执行完成

输入描述：

- 第一个参数为GPU一次最多执行的任务个数，取值范围[1, 10000]
- 第二个参数为任务数组长度，取值范围[1, 10000]
- 第三个参数为任务数组，数字范围[1, 10000]

输出描述：

执行完所有任务最少需要多少秒。

```yaml
3
5
1 2 3 4 5

输出 6
一次最多执行3个任务，最少耗时6s

4
5
5 4 1 1 1
一次最多执行4个任务，最少耗时5s
```

```js
const readline = require('readline');
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let maxTasks = 0;
let tasks = [];
let tasksLength = 0;
rl.on('line', (line) => {
  if (maxTasks === 0) {
    maxTasks = Number(line);
  } else if (tasksLength === 0) {
    tasksLength = Number(line);
  } else if (tasks.length === 0) {
    tasks = line.split(' ').map(Number);
  }
}).on('close', () => {
  let currentTasks = 0;
  let totalTime = 0;
  let index = 0;

  while (currentTasks !== 0 || index !== tasks.length) {
    if (index < tasksLength) {
      currentTasks += tasks[index];
      index++;
    }
    currentTasks -= maxTasks;
    if (currentTasks < 0) {
      currentTasks = 0;
    }
    totalTime++;
  }
  console.log(totalTime);
})
```

## 最大N个数于最小N个数的和

给定一个数组，编写一个函数来计算它的最大N个数与最小N个数的和。你需要对数组进行去重。

说明:

数组中数字范围[0,1000]
最大N个数与最小N个数不能有重叠，如有重叠，输入非法返回-1
输入非法返回-1

输入描述：

- 第一行输入M, M标识数组大小
- 第二行输入M个数，标识数组内容
- 第三行输入N，N表示需要计算的最大、最小的N个数

输出描述：输出最大N个数与最小N个数的和。

```yaml
输入：
5
95 88 83 64 100
2

输出：
342

说明：
最大2个数[100,95],最小2个数[83,64],输出为342

输入：
5
3 2 3 4 2
2

输出：
-1

说明：
最大2个数[4,3] 最小2个数[3,2], 有重叠输出为-1
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
  if (inputs.length === 3) {
    let M = parseInt(inputs[0]);
    let arrM = input[1].split(' ').map(Number);
    let N = parseInt(inputs[2]);
    let numSet = new Set();
    for (let i = 0; i< arrM.length; i++) {
      if (numSet.has(arrM[i]) || arrM[i] < 0 || arrM[i] > 1000) {
        console.log(-1);
        return;
      } else {
        numSet.add(arrM[i]);
      }
    }
    if (numSet.size < N * 2) {
      console.log(-1);
      return;
    }

    const sortNum = [...numSet].sort((a, b) => a - b);

    let left = 0;
    let right = sortNum.length - 1;
    let sum = 0;
    while (N > 0) {
      sum += sortNum[left] + sortNum[right];
      left++;
      right--;
      N--;
    }
    console.log(sum);
    return;
  }
})
```

## 小明找位置

小朋友出操，按学号从小到大排成一列；小明来迟了，请你给小明出个主意，让他尽快找到他应该排的位置。

输入描述：

- 第一行：输入已排成队列的小朋友的学号（正整数），以空格隔开。
- 第二行：小明的学号；
- 算法复杂度要求不高于 nlog(n)。
- 学号为整数类型，队列规模 ≤ 10000。

输出描述：输出一个数字，代表队列位置（从 1 开始）。

## 执行任务赚获取最多积分

现有N个任务需要处理，同一时间只能处理一个任务，处理每个任务所需要的时间固定为1。

每个任务都有最晚处理时间限制和积分值，在最晚处理时间点之前处理完成任务才可获得对应的积分奖励。

可用于处理任务的时间有限，请问在有限的时间内，可获得的最多积分。

输入描述：

- 第一行为一个数 N，表示有 N 个任务(1 ≤ N ≤ 100)
- 第二行为一个数 T，表示可用于处理任务的时间(1 ≤ T ≤ 100)
- 接下来 N 行，每行两个空格分隔的整数（SLA 和 V），SLA 表示任务的最晚处理时间，V 表示任务对应的积分。
  - 1 ≤ SLA ≤ 100
  - 0 ≤ V ≤ 100000

输出描述：可获得的最多积分

```yaml
输入
4
3
1 2
1 3
1 4
1 5
输出
5
```

```js

```

## 最多购买宝石数目

橱窗里有一排宝石，不同的宝石对应不同的价格，宝石的价格标记为 gems[i],0<=i<n, n = gems.length

宝石可同时出售0个或多个，如果同时出售多个，则要求出售的宝石编号连续；

例如客户最大购买宝石个数为m，购买的宝石编号必须为gems[i],gems[i+1]...gems[i+m-1](0<=i<n,m<=n)

假设你当前拥有总面值为value的钱，请问最多能购买到多少个宝石,如无法购买宝石，则返回 0。

输入描述：

- 第一行输入n，参数类型为int，取值范围：[0,10^6]，表示橱窗中宝石的总数量。

- 之后n行分别表示从第0个到第n-1个宝石的价格，即gems[0]到gems[n-1]的价格，类型为int，取值范围：(0,1000]。

- 之后一行输入v，类型为int，取值范围：[0,10^9]表示你拥有的钱。

输出描述：输出int类型的返回值，表示最大可购买的宝石数量。

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
  let n = parseInt(inputs[0]);
  let v = parseInt(inputs[inputs.length - 1]);
  let gems = inputs.slice(1, n - 1).map(num => parseInt(num));
  
  // 滑动窗口思想
  let left = 0;
  let right = 0;
  let sum = 0;
  let result = 0;

  while (right < n) {
    sum += gems[right];
    if (sum > v) {
      sum -= gems[left];
      left++;
    }
    result = Math.max(result, right - left + 1);
    right++;
  }
  console.log(result);
})
```

## 素数之和/RSA加密算法

RSA加密算法在网络安全世界中无处不在，它利用了极大整数因数分解的困难度，数据越大，安全系数越高，给定一个32位正整数，请对其进行因数分解，找出是哪两个素数的乘积。

输入描述：一个正整数num

`0 < num <= 2147483647`

输出描述：如果成功找到，以单个空格分割，从小到大输出两个素数，分解失败，请输出-1 -1

素数,也称质数,是一个在自然数中有重要地位的数。它的定义如下

- 素数是一个大于1的自然数。
- 素数只能被1和它本身整除,不能被其他数整除

```yaml
15

输出 3 5
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.on('line', (line) => {
  const num = parseInt(line);

  // 是否为素数
  function isPrime(num) {
    if (num <= 1) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        return false;
      }
    }

    return true;
  }
  if (isPrime(num)) {
    console.log('-1 -1');
    rl.close();
    return
  }

  for (let i = 0; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      let j = num / i;
      if (isPrime(i) && isPrime(j)) {
        console.log(i < j ? (i + ' ' + j) : (j + ' ' + i))
        rl.close();
        return;
      }
    }
  }
  console.log('-1 -1');
  rl.close();
})
```
