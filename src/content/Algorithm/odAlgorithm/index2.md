---
title: 华为od算法2
description: 华为od算法
date: 2024-06-11
---

# 算法2

## 环中最长子串/字符成环找偶数

给你一个字符串 s，字符串s首尾相连成一个环形 ，请你在环中找出 'o' 字符出现了偶数次最长子字符串的长度。

输入描述：输入是一串小写字母组成的字符串（备注：`1 <= s.length <= 5 x 10^5s` 只包含小写英文字母）

输出描述：输出是一个整数

```js
function longestEvenOddSubstring(str) {
  const len = str.length;
  let count = 0;

  // 遍历字符串，统计 o 字符出现的次数
  for (let chr of str) {
    if (chr === 'o') {
      count += 1;
    }
  }
  // 如果 o 字符出现偶数次，则最长子串的长度为 count
  if (count % 2 === 0) {
    console.log(len);
  } else {
    // 如果 o 字符出现奇数次，则最长子串的长度为 count - 1
    console.log(len - 1);
  }
}
```

## 找座位

在一个大型体育场内举办了一场大型活动，由于疫情防控的需要，要求每位观众的必须间隔至少一个空位才允许落座。现在给出一排观众座位分布图，座位中存在已落座的观众，请计算出，在不移动现有观众座位的情况下，最多还能坐下多少名观众。

输入描述：一个数组，用来标识某一排座位中，每个座位是否已经坐人。0表示该座位没有坐人，1表示该座位已经坐人

输出描述：整数，在不移动现有观众座位的情况下，最多还能坐下多少名观众

```js
// 遍历数组中的每个座位，如果当前座位为0（没有坐人），且其左右两侧的座位也为0或者不存在，那么我们可以在当前座位安排一名观众
function findMaximumCapable(seats) {
  const seatArr = seats.split('');
  let len = seatArr.length;
  let maxCount = 0;
  // 处理第一个座位
  if (seatArr[0] === '0' && seats[1] === '0') {
    maxCount += 1;
    seatArr[0] = '1';
  }
  // 处理中间的座位
  for (let i = 1; i < seatArr.length - 1; i++) {
    if (seatArr[i] === '0' && seatArr[i - 1] === '0' && seatArr[i + 1] === '0') {
      maxCount += 1;
      seatArr[i] = '1';
    }
  }
  // 处理最后一个座位
  if (seatArr[len - 1] === '0' && seats[len - 2] === '0') {
    maxCount += 1;
  }

  console.log(maxCount);
}
```

## 转盘寿司

寿司店周年庆，正在举办优惠活动回馈新老客户。

寿司转盘上总共有 n 盘寿司，prices[i] 是第 i 盘寿司的价格，

如果客户选择了第 i 盘寿司，寿司店免费赠送客户距离第 i 盘寿司最近的下一盘寿司 j，前提是 prices[j] < prices[i]，如果没有满足条件的 j，则不赠送寿司。

每个价格的寿司都可无限供应

输入描述：输入的每一个数字代表每盘寿司的价格，每盘寿司的价格之间使用空格分隔，例如

3 15 6 14 ：第 0 盘寿司价格 `prices[0]` 为 3，第 1 盘寿司价格 `prices[1]` 为 15

每盘寿司的价格 price 范围为：1 ≤ price ≤ 1000

输出描述：

输出享受优惠后的一组数据，每个值表示客户选择第 i 盘寿司时实际得到的寿司的总价格。使用空格进行分隔，例如：

3 21 9 17

```js
// 通过遍历寿司价格数组并计算每个寿司的最优价格来解决。
// 我们可以使用一个栈来维护寿司的价格，并根据栈顶元素的价格来确定是否可以免费获得下一盘寿司
// function getPrices(prices) {
//   const n = prices.length;
//   const stack = [];
//   const optimalPrice = new Array(n).fill(0);

//   for (let i = 0; i < n; i++) {
//     while 
//   }
// }
```

## 找朋友

在学校中，N个小朋友站成一队，第i个小朋友的身高为height[i] 第i个小朋友可以看到的第一个比自己身高更高的小朋友j，那么是i的好朋友(要求j>i)。

请重新生成一个列表，对应位置的输出是每个小朋友的好朋友位置，如果没有看到好朋友，请在该位置用0代替。 小朋友人数范围是[0,40000]。

输入描述：第一行输入N，N表示有N个小朋友；第二行输入N个小朋友的身高height[i]，都是整数

输出描述：输出N个小朋友的好朋友的位置

```yaml
输入：
2
100 95

输出：
0 0

说明：
第一个小朋友身高100，站在队尾位置，向队首看，没有比他身高高的小朋友，所以输出第一个值为0。
第二个小朋友站在队首，前面也没有比他身高高的小朋友，所以输出第二个值为0。
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let n = 0; // 人数
let height = []; // 身高数组

rl.on('line', (line) => {
  if (!n) {
    n = parseInt(line.trim());
  } else {
    height = line.trim().split(' ').map(Number);

    let friends = new Array(n).fill(0);
    let stack = [0];
    for (let i = 1; i < n; i++) {
      while (stack.length && height[i] > height[stack[stack.length - 1]]) {
        friends[stack.pop()] = i;
      }
      stack.push(i);
    }

    let result = '';
    for (let i = 0; i < n; i++) {
      result += friends[i] + ' ';
    }
    console.log(result.trim());
  }
})
```

## 爱吃蟠桃的孙悟空

孙悟空爱吃蟠桃，有一天趁着蟠桃园守卫不在来偷吃。已知蟠桃园有 N 棵桃树，每颗树上都有桃子，守卫将在 H 小时后回来。

孙悟空可以决定他吃蟠桃的速度K（个/小时），每个小时选一颗桃树，并从树上吃掉 K 个，如果树上的桃子少于 K 个，则全部吃掉，并且这一小时剩余的时间里不再吃桃。

孙悟空喜欢慢慢吃，但又想在守卫回来前吃完桃子。

请返回孙悟空可以在 H 小时内吃掉所有桃子的最小速度 K（K为整数）。如果以任何速度都吃不完所有桃子，则返回0。

输入描述：

- 第一行输入为 N 个数字，N 表示桃树的数量，这 N 个数字表示每颗桃树上蟠桃的数量。
- 第二行输入为一个数字，表示守卫离开的时间 H。
- 其中数字通过空格分割，N、H为正整数，每颗树上都有蟠桃，且 0 < N < 10000，0 < H < 10000。

输出描述：吃掉所有蟠桃的最小速度 K，无解或输入异常时输出 0

```js
// 思路：通过二分查找来解决
// 我们可以在1到最大桃子数之间进行二分查找，找到最小的速度K，使得在H小时内可以吃完所有的桃子
function findMinimumSpeed(piles, H) {
  let maxPile = Math.max(...piles);
  let left = 1;
  let right = maxPile;
  let result = 0;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // 中间值 mid，表示当前尝试的速度K
    let hours = 0;
    for (let pile of piles) {
      hours += Math.ceil(pile / mid);
    }
    if (hours <= H) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  console.log(result);
}
```

## 游戏分组/王者荣耀

2020年题：

英雄联盟是一款十分火热的对战类游戏。每一场对战有10位玩家参与，分为两组，每组5人。每位玩家都有一个战斗力，代表着这位玩家的厉害程度。为了对战尽可能精彩，我们需要把玩家们分为实力尽量相等的两组。一组的实力可以表示为这一组5位玩家的战斗力和。现在，给你10位玩家的战斗力，请你把他们分为实力尽量相等的两组。请你输出这两组的实力差。

2023年题：

部门准备举办一场王者荣耀表演赛，有10名游戏爱好者参与，分5为两队，每队5人。每位参与者都有一个评分，代表着他的游戏水平。为了表演赛尽可能精彩，我们需要把10名参赛者分为实力尽量相近的两队。一队的实力可以表示为这一队5名队员的评分总和。现在给你10名参与者的游戏水平评分，请你根据上述要求分队最后输出这两组的实力差绝对值。例: 10名参赛者的评分分别为5 1 8 3 4 6 710 9 2，分组为 (135 8 10) (24 679)，两组实力差最小，差值为1。有多种分法，但实力差的绝对值最小为1。

输入描述：10个整数，表示10名参与者的游戏水平评分。范围在[1,10000]之间

输出描述：1个整数，表示分组后两组实力差绝对值的最小值.

```js
let res = Number.MAX_SAFE_INTEGER;
let totalSum = 0;
let targetSum = 0;
function dfs (nums, idx, count, currentSum) {
  if (count === 5) {
    let ohterTeamSum = totalSum - currentSum;
    res = Math.min(res, Math.abs(ohterTeamSum - currentSum));
    return;
  }

  if (idx === 10) {
    return
  }

  dfs(nums, idx + 1, count + 1, currentSum + nums[idx]);

  dfs(nums, idx + 1, count, currentSum);
}
function main(nums) {
  for (let num of nums) {
    totalSum += num;
  }
  targetSum = totalSum / 2;
  dfs(nums, 0, 0, 0);
  console.log(res);
}
```

## 求满足条件的最长子串的长度

给定一个字符串，只包含字母和数字，按要求找出字符串中的最长(连续)子的长度，字符串本身是其最长的子串，子串要求:

只包含1个字母(az,AZ)，其余必须是数字;
字母可以在子串中的任意位置;
如果找不到满足要求的子串，如全是字母或全是数字，则返回-1。

输入描述：字符串(只包含字母和数字)

输出描述：子串的长度

```yaml
输入：
abC124ACb

输出：
4

说明：
满足条件的最长子串是C124或者124A，长度都是4
```

```js
function findMaxLength(str) {
  // 初始化最长子传长度
  let maxLength = 0;
  // 初始化一个标志，表示是否找到了包含字母的子串
  let hasLetter = false;
  // 初始化双指针L和R，分别表示子串的左右边界
  let l = 0; let r = 0;
  // 创建一个双端队列用于存储字母索引
  let letterIdx = [];

  while (r < str.length) {
    let char = str.charAt(r);

    if (char.match(/[a-zA-Z]/)) {
      hasLetter = true;
      letterIdx.push(r);

      if (letterIdx.length > 1) {
        l = letterIdx.shift() + 1;
      }
      if (r === l) {
        r++;
        continue;
      }
    }
    maxLength = Math.max(maxLength, r - l + 1);

    r++;
  }

  if (hasLetter) {
    console.log(maxLength);
  } else {
    console.log(-1);
  }
}
```

## 分割均衡字符串

均衡串定义:字符串只包含两种字符，且两种字符的个数相同。

给定一个均衡字符串，请给出可分割成新的均衡子串的最大个数。

约定字符串中只包含大写的'X"和'Y'两种字符。

输入描述：均衡串:XXYYXY

字符串的长度[2,10000]。给定的字符用均为均衡串。

输出描述：可分割为两个子串: XXYY, XY

```yaml
输入
XXYYXY

输出
2

备注
分割后的子串，是原字符串的连续子串。
```

```js
function splitString(str) {
  let ans = 0;
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === 'X') {
      count++;
    } else {
      count--;
    }
    if (count === 0) {
      ans++;
    }
  }
  console.log(ans);
}
```

## 机器人仓库搬砖

机器人搬砖，一共有N堆砖存放在N个不同的仓库中，第 i 堆中有 bricks[i] 块砖头，要求在8小时内搬完。

机器人每小时能搬砖的数量取决于有多少能量格，机器人一个小时中只能在一仓库中搬砖，机器人的能量格每小时补充一次且能量格只在这一个小时有效，为使得机器人损耗最小化，应尽量减小每次补充的能量格数。

为了保障在8小时内能完成砖任务，请计算每小时始机器人充能的最小能量格数。

备注:

- 1、无需考虑机器人补充能量的耗时
- 2、无需考虑机器人搬砖的耗时
- 3、机器人每小时补充能量格只在这一个小时中有效

输入描述：程序有输入为“30 12 25 8 19”一个整数数组，数组中的每个数字代表第i堆砖的个数，每堆砖的个数不超过100

输出描述：输出在8小时内完成搬砖任务，机器人每小时最少需要充多少个能量格；如果8个小时内无法完成任务，则输出“-1”；

```yaml
输入：
30 12 25 8 19

输出：
15
```

```js

```

## 出租车计费、靠谱的车

程序员小明打了一辆出租车去上班。出于职业敏感，他注意到这辆出租车的计费表有点问题，总是偏大。

出租车司机解释说他不喜欢数字4，所以改装了计费表，任何数字位置遇到数字4就直接跳过，其余功能都正常。

比如：

23再多一块钱就变为25；
39再多一块钱变为50；
399再多一块钱变为500；
小明识破了司机的伎俩，准备利用自己的学识打败司机的阴谋。

给出计费表的表面读数，返回实际产生的费用。

输入描述：只有一行，数字N，表示里程表的读数。(`1<=N<=888888888`)

输出描述：一个数字，表示实际产生的费用。以回车结束

```js
// 56 4+
function realFun(nums) {
  let realMoney = 0;
  nums = String(nums);
  for (let i = 0; i < nums.length; i++) {
    let digit = parseInt(nums[i]);
    if (digit > 4) {
      digit--;
    }
    realMoney = realMoney * 9 + digit;
  }
  console.log(realMoney);
}
```
