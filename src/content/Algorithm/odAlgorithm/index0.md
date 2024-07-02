---
title: 华为od算法0
description: 华为od算法
date: 2024-06-11
---

# 算法0

## 字符串序列判定/最后一个有效字符

输入两个字符串S和L，都只包含英文小写字母。S长度`<=`100，L长度`<=`500,000。判定S是否是L的有效子串。

判定规则：

S中的每个字符在L中都能找到（可以不连续），

且S在L中字符的前后顺序与S中顺序要保持一致。

（例如，S=”ace”是L=”abcde”的一个子序列且有效字符是a、c、e，而”aec”不是有效子序列，且有效字符只有a、e）

```js
// 思路双指针法来解决
// 使用两个指针，一个指向字符串S，另一个指向字符串L。然后，我们逐个比较S中的字符是否在L中出现，并且保持它们的相对顺序
function isSubsequence(s, t) {
  let i = 0;
  let j = 0;

  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) {
      i++;
    }
    j++;
  }

  return i === s.length;
}
```

## 山脉个数/攀登者1

攀登者喜欢寻找各种地图，并且尝试攀登到最高的山峰。

地图表示为一维数组，数组的索引代表水平位置，数组的元素代表相对海拔高度。其中数组元素0代表地面。

例如：[0,1,2,4,3,1,0,0,1,2,3,1,2,1,0]，代表如下图所示的地图，地图中有两个山脉位置分别为 1,2,3,4,5 和 8,9,10,11,12,13，最高峰高度分别为 4,3。最高峰位置分别为3,10。

一个山脉可能有多座山峰(高度大于相邻位置的高度，或在地图边界且高度大于相邻的高度)。登山者想要知道一张地图中有多少座山峰。

```js
// 
function countPeaks(map) {
  let count = 0;
  let mapSize = map.length;

  for (let i = 0; i < mapSize; i++) {
    // 当前元素位于开头 且下一个元素大于当前元素
    if (i === 0 && map[i] > map[i + 1]) {
      count++
    }
    // 当前元素位于末尾 且上一个元素大于当前元素
    if (i === mapSize - 1 && map[i] > map[i - 1]) {
      count++
    }
    // 如果当前位置的高度大于前一个位置和后一个位置的高度
    if ((i > 0 && i < mapSize - 1) && map[i] > map[i - 1] && map[i] > map[i + 1]) {
      count++
    }
  }


  return count;
}
```

## 构成指定长度字符串的个数/字符串拼接

给定 M`（0 < M ≤ 30）`个字符（a-z），从中取出任意字符（每个字符只能用一次）拼接成长度为 N`（0 < N ≤ 5）`的字符串，

要求相同的字符不能相邻，计算出给定的字符列表能拼接出多少种满足条件的字符串，

输入非法或者无法拼接出满足条件的字符串则返回0。

输入描述：给定的字符列表和结果字符串长度，中间使用空格(" ")拼接

输出描述：满足条件的字符串个数

```js
function countString(str, n) {

}
```

## 用连续自然数之和来表达整数

一个整数可以由连续的自然数之和来表示。给定一个整数，计算该整数有几种连续自然数之和的表达式，且打印出每种表达式

输入描述: 一个目标整数T `(1 <= T <= 1000)`

输出描述：

- 该整数的所有表达式和表达式的个数。如果有多种表达式，输出要求为
  - 自然数个数最少的表达式优先输出
  - 每个表达式中按自然数递增的顺序输出，具体的格式参见样例。在每个测试数据结束时，输出一行”Result:X”，其中X是最终的表达式个数

```yaml
输入:
9

输出:
9=9
9=4+5
9=2+3+4
Result:3

说明:
整数 9 有三种表示方法，第1个表达式只有1个自然数，最先输出，第2个表达式有2个自然数，第2次序输出，第3个表达式有3个自然数，
最后输出。每个表达式中的自然数都是按递增次序输出的。
数字与符号之间无空格
```

```js
// 通过枚举连续自然数的起始值和个数来解决
// 使用双重循环来枚举所有可能的表达式，并将满足条件的表达式存储起来
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let target;
rl.on('line', function myAnswer (answer) {
  target = Number(answer);
  console.log(target + '=' + target);

  const expressions = [];
  for (let i = 1; i < target; i++) {
    let sum = 0;
    let expression = '';
    for (let j = i; sum < target; j++) {
      sum += j;
      expression += j + '+';
      if (sum === target) {
        expressions.push(target + '=' + expression.slice(0, -1));
        break;
      }
    }
  }
  expressions.sort((a, b) => a.length - b.length);
  expressions.forEach(item => console.log(item));
  console.log('Result:' + (expressions.length + 1));
})
```

## 全量和已占用字符集、字符串统计

给定两个字符集合，一个是全量字符集，一个是已占用字符集，已占用字符集中的字符不能再使用。要求输出剩余可用字符集

输入描述：

输入一个字符串 一定包含@，@前为全量字符集 @后的为已占用字符集
已占用字符集中的字符一定是全量字符集中的字符
字符集中的字符跟字符之间使用英文逗号隔开
每个字符都表示为字符+数字的形式用英文冒号分隔，比如a:1标识一个a字符
字符只考虑英文字母，区分大小写
数字只考虑正整型 不超过100
如果一个字符都没被占用 @标识仍存在，例如 a:3,b:5,c:2@

输出描述：

输出可用字符集
不同的输出字符集之间用回车换行
注意 输出的字符顺序要跟输入的一致，如下面用例不能输出b:3,a:2,c:2
如果某个字符已全部占用 则不需要再输出

```yaml
a:3,b:5,c:2@a:1,b:2

a:2,b:3,c:2
```

```js
function custom (str) {
  const strArr = str.split('@');
  const result = [];
  let all = strArr[0].split(',');
  let used = strArr[1].split(',');
  const allCharCount = new Map();
  const usedCharCount = new Map();
  for (let i = 0; i < all.length; i++) {
    const allChar = all[i].split(':');
    allCharCount.set(allChar[0], allChar[1]);
  }
  for (let i = 0; i < used.length; i++) {
    const usedChar = used[i].split(':');
    usedCharCount.set(usedChar[0], usedChar[1]);
  }
  for (const [ch, totalCount] of allCharCount) {
    const occupiedCount = usedCharCount.get(ch) || 0;
    const availableCount = totalCount - occupiedCount;
    if (availableCount > 0) {
      result.push(ch + ':' + availableCount);
    }
  }
  return result.join(',');
}
```

## 密码输入检测

给定用户密码输入流input，输入流中字符 `'<'` 表示退格，可以清除前一个输入的字符，请你编写程序，输出最终得到的密码字符，并判断密码是否满足如下的密码安全要求

密码长度`>=`8;
密码至少需要包含1个大写字母:
密码至少需要包含1个小写字母;
密码至少需要包含1个数字;
密码至少需要包含1个字母和数字以外的非空白特殊字符;
注意空串退格后仍然为空串，且用户输入的字符串不包含 `'<'` 字符和空白字符。

输入描述：用一行字符串表示输入的用户数据，输入的字符串中 `<` 字符标识退格，用户输入的字符串不包含空白字符，例如:`ABC<c89%000<`

输出描述：输出经过程序处理后，输出的实际密码字符串，并输出该密码字符串是否满足密码安全要求。两者间由 ',' 分隔，例如:ABc89%00,true

```yaml
输入：
ABC<c89%000<

输出：
ABc89%00,true

解释: 多余的C和0由于退格被去除,最终用户输入的密码为ABc89%00，且满足密码安全要求输出true
```

```js
function processPassword(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '<') {
      stack.pop();
    } else {
      stack.push(str[i]);
    }
  }
  const realPass = stack.join('');
  function checkPassword (pass) {
    if (pass.length < 8) {
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      return false;
    }
    if (!/[a-z]/.test(pass)) {
      return false;
    }
    if (!/\d/.test(pass)) {
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      return false;
    }
    return true;
  }
  const isSecure = checkPassword(realPass);

  return `${realPass},${isSecure}`
}
```

## 查找众数及中位数

众数是指一组数据中出现次数量多的那个数，众数可以是多个。

中位数只是指把一组数据从小到大排列，最中间的那个数，如果这组数据的个数是奇数，那最中间那个就是中位数，如果这组数据的个数为偶数，那就把中间的两个数之和除以2，所得的结果就是中位数。

查找整型数组中元素的众数并组成一个新的数组，求新数组的中位数

输入描述：输入一个一维整型数组，数组大小取值范围 `0<N<1000，数组中每个元素取值范围 0<E<1000`

输出描述：输出众数组成的新数组的中位数

```yaml

```

```js
// 找出数组中的众数，并组成一个新的数组
// 计算新数组的中位数
function findMedianOfMode (arr) {
  const majMap = new Map();
  let maxCount = 0;
  for (let i = 0; i < arr.length; i++) {
    let count = majMap.get(arr[i]) || 0;
    majMap.set(arr[i], count + 1);
    count++;
    maxCount = Math.max(maxCount, count);
  }
  const mode = [];
  for (const [key, value] of majMap) {
    if (value === maxCount) {
      mode.push(key);
    }
  }
  let mid
  if (mode.length % 2 === 0) {
    mid = Math.floor((mode[mode.length / 2 - 1] + mode[mode.length / 2]) / 2);
  } else {
    mid = mode[Math.floor(mode.length / 2)];
  }
  console.log(mid);
}
```

## 最长的指定瑕疵度的元音子串

开头和结尾都是元音字母（aeiouAEIOU）的字符串为元音字符串，其中混杂的非元音字母数量为其瑕疵度。比如:

- “a” 、 “aa” 是元音字符串，其瑕疵度都为0
- “aiur” 不是元音字符串（结尾不是元音字符）
- “abira” 是元音字符串，其瑕疵度为2

给定一个字符串，请找出指定瑕疵度的最长元音字符子串，并输出其长度，如果找不到满足条件的元音字符子串，输出0。子串：字符串中任意个连续的字符组成的子序列称为该字符串的子串

输入描述：

- 首行输入是一个整数，表示预期的瑕疵度flaw，取值范围`[0, 65535]`
- 接下来一行是一个仅由字符a-z和A-Z组成的字符串，字符串长度`(0, 65535]`

输出描述：输出为一个整数，代表满足条件的元音字符子串的长度

```yaml
输入：
0
asdbuiodevauufgh
输出：
3
说明：满足条件的最长元音字符子串有两个，分别为uio和auu，长度为3。
```

思路：采用双指针方法遍历字符串

- 初始时左右边界指针都指向位置0
- 边界判断：左元音右缺陷（right++）、左缺陷右元音（left++）、左右都缺陷（left++、right++）、左右都元音（计算缺陷度）
- 计算元音字串的长度
  - 先判断当前缺陷度是否满足要求，小于则right++，大于则left++
  - 缺陷度符合要求后，才计算当前字串长度，并和历史最大值比较，更新最大值。

```js
function custom(flaw, str) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
  let maxLength = 0;
  let left = 0;
  let right = 0;
  let currentFlaw = 0;

  for (left = 0; left < str.length; left++) {
    while (right < str.length) {
      // 如果前后都是元音字符，且瑕疵度等于指定的瑕疵度，那么就更新最大长度
      if (vowels.has(str[left]) && vowels.has(str[right]) && currentFlaw === flaw) {
        maxLength = Math.max(maxLength, right - left + 1);
      }
      // 如果不是元音字符、那么瑕疵度+1
      if (!vowels.has(str[right])) {
        currentFlaw++;
      }
      // 如果瑕疵度大于指定的瑕疵度，那么就跳出循环
      if (currentFlaw > flaw) {
        break;
      }
    }
    // 如果左边的字符不是元音字符，那么瑕疵度-1，因为左边的字符已经不在窗口中了，如：aabaa，当窗口为aba时，左边的a已经不在窗口中了，所以瑕疵度-1
    if (!isVowel(str[left])) {
      currentFlaw--;
    }
  }
  
  console.log(maxLength);
}

function findYuan(flaw, str) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'])
  const vowelIdx = [];
  for (let i = 0; i < str.length; i++) {
    if (vowels.has(str[i])) {
      vowelIdx.push(i)
    }
  }
  let left = 0; let right = 0;
  const lengths = [];
  while (right < vowelIdx.length) {
    const lengthFlaw = vowelIdx[right] - vowelIdx[left] - (right - left);
    if (lengthFlaw > flaw) {
      left++;
    } else {
      if (lengthFlaw === flaw) {
        lengths.push(vowelIdx[right] - vowelIdx[left] + 1);
      }
      right++;
    }
  }
  if (lengths.length === 0) {
    return 0;
  }
  lengths.sort((a, b) => b - a)
  return lengths[0]
}
```

## 整数对最小和

给定两个整数数组array1、array2，数组元素按升序排列

假设从array1、array2中分别取出一个元素可构成一对元素，现在需要取出k对元素，并对取出的所有元素求和，计算和的最小值。

注意：两对元素如果对应于array1、array2中的两个下标均相同，则视为同一对元素

输入描述:

- 输入两行数组array1、array2，每行首个数字为数组大小`size(0 < size <= 100)`;
- `<array1[i] <=1000`
- `<array2[i] <= 1000`
- 接下来一行为正整数 k
- `0 < k <= array1.size() * array2.size()`

输出描述:

满足要求的最小和

```yaml
3 1 1 2
3 1 2 3
2

输出 4

用例中：需要两对元素
取第一个数组的第0个和第二个数组中第0个元素组成一对元素 [1, 1]
取第一个数组的第1个和第二个数组中第0个元素组成一对元素 [1, 1]
求和 1+1+1+1 = 4
```

```js
function minSumFun(array1, array2, k) {
  const pairsSum = [];

  // 循环嵌套，将array1和array2中的元素两两相加，并将结果存入pairsSum中
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      pairsSum.push(array1[i] + array2[j]);
    }
  }
  pairsSum.sort((a, b) => a - b);
  const minSum = pairsSum.slice(0, k).reduce((sum, cur) => sum + cur, 0);
  console.log(minSum);
}
```

## 找出作弊的人

公司组织了一次考试,现在考试结果出来了，想看一下有没人存在作弊行为,但是员工太多了,需要先对员工进行一次过滤,再进一步确定是否存在作弊行为。

过滤的规则为:找到分差最小的员工ID对(p1,p2)列表,要求`p1<p2`

员工个数取值范国:`O<n<100000`

员工ID为整数,取值范围:`0<=n<=100000`

考试成绩为整数,取值范围:`0<=score<=300`

输入描述：

员工的ID及考试分数

输出描述

分差最小的员工ID对(p1,p2)列表,要求`p1<p2`。每一行代表一个集合,每个集合内的员工ID按顺序排列,多行结果也以员工对中p1值大小升序排列(如果p1相同则p2升序)。

样例1

```yaml
输入
5
1 90
2 91
3 95
4 96
5 100
输出
1 2
3 4
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let input = []
rl.on('line', (line) => {
  input.push(line.trim());
}).on('close', () => {
  const n = parseInt(input.shift());// 员工个数
  // 创建一个数组用于存储员工的ID和分数
  const employees = input.map(item => {
    return item.split(' ').map(Number);
  })
  // 创建一个数组用于存储分差最小的员工id对
  let result = [];
  let minDiff = Number.MAX_SAFE_INTEGER;
  // 遍历排序后的员工数组，计算相邻员工的分差
  for (let i = 1; i < n; i++) {
    const diff = employees[i][1] - employees[i - 1][1];
    if (diff < minDiff) {
      minDiff = diff;
      result = [[employees[i - 1][0], employees[i][0]]];
    } else if (diff === minDiff) {
      result.push([employees[i - 1][0], employees[i][0]]);
    }
  }
  result.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < result.length; i++) {
    console.log(result[i].join(' '));
  }
})
```
