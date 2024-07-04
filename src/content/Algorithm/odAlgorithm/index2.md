---
title: 华为od算法2
description: 华为od算法
date: 2024-06-11
---

# 算法2

## 寻找最富裕的小家庭

在一棵树中，每个节点代表一个家庭成员，节点的数字表示其个人的财富值，一个节点及其直接相连的子节点被定义为一个小家庭。

现给你一棵树，请计算出最富裕的小家庭的财富和。

输入描述：

- 第一行为一个数N，表示成员总数，成员编号`1-N，1<=N<=1000`
- 第二行为N个空格分隔的数，表示编号1-N的成员的财富值。`0<=财富值<=1000000`
- 接下来N-1行，每行两个空格分隔的整数(N1,N2)，表示N1是N2的父节点。

输出描述：最富裕的小家庭的财富和

```yaml
4
100 200 300 500
1 2
1 3
2 4

输出：700
说明：
成员1,2,3组成的小家庭财富值为600
成员2,4组成的小家庭财富值为700
```

```js
function getMaxWealthFamily(N, wealths, familys) {
  wealths = wealths.unshift(0); // 下标从一开始
  let maxWealth = wealths[1];
  let familyWealth = [...wealths];

  for (let i = 2; i < N + 1; i++) {
    const [N1, N2] = familys[i].split(' ').map(Number);
    familyWealth[N1] += wealths[N2];
    maxWealth = Math.max(maxWealth, familyWealth[N1])
  }
  console.log(maxWealth);
}
```

## 开源项目热度榜单

某个开源社区希望将最近热度比较高的开源项目出一个榜单，推荐给社区里面的开发者。对于每个开源项目，开发者可以进行关注(watch)、收藏(star)、fork、提issue、提交合并请求(MR)等。

数据库里面统计了每个开源项目关注、收藏、fork、issue、MR的数量，开源项目的热度根据这5个维度的加权求和进行排序。

H = Wwatch X#watch + Wstar X#star +Wfork X#fork +Wissue X#issue +Wmr X#mr H表示热度值，Wwatch、Wstar、Wfork、Wissue、Wmr分别表示5个统计维度的权重，#watch、#star、#fork、#issue、#mr分别表示5个统计维度的统计值。

榜单按照热度值降序排序，对于热度值相等的，按照项目名字转换为全小写字母后的字典序排序（'a','b','c',...,'x','y','z')。

输入描述：

- 第一行输入为N，表示开源项目的个数，`0<N<=100`。

- 第二行输入为权重值列表，一共5个整型值，分别对应关注、收藏、fork、issue、MR的权重，权重取值`0<W<=50`。

- 第三行开始接下来的N行为开源项目的统计维度，每一行的格式为：name nr_watch nr_star nr_fork nr_issue nr_mr
  - 其中name为开源项目的名字，由英文字母组成，长度`<=50`
  - 其余5个整型值分别为该开源项目关注、收藏、fork、issue、MR的数量，数量取值`0<nr<=1000`。

输出描述：

按照热度降序，输出开源项目的名字，对于热度值相等的，按照项目名字转换为全小写字母后的字典序排序`('a'>'b'>'c'>...>'x'>'y'>'z')`。

```js
function getPopulerProject(length, weights, projects) {
  let tempProjects = projects.map(value => {
    let splitValue = value.split(' ');
    let name = splitValue[0];
    let scores = splitValue.slice(1);
    let hotness = 0;
    for (let j = 0; j < 5; j++) {
      hotness += weights[j] * scores[j]
    }
    return {
      name: name,
      hotness: hotness
    }
  })
  tempProjects.sort((a, b) => {
    if (a.hotness !== b.hotness) {
      return b.hotness - a.hotness;
    } else {
      return a.name.localeCompare(b.name);
    }
  })
  for (let project of tempProjects) {
    console.log(project.name);
  }
}
```

## 考勤信息

公司用一个字符串来表示员工的出勤信息

- absent:缺勒
- late: 迟到
- leaveearly: 早退
- present: 正常上班

现需根据员工出勤信息，判断本次是否能获得出勤奖，能获得出勤奖的条件如下:

- 缺勤不超过一次，
- 没有连续的迟到/早退:
- 任意连续7次考勤，缺勒/迟到/早退不超过3次

输入描述：

- 第一行输入一个整数n，表示有多少个员工
- 后面n行，每一行输入若干个字符串，表示第i名员工的出勤信息

输出描述：输出n行，每一行表示这名员工能否获得出勤奖，如果可以，则输出“true"，否则输出”false"

```yaml
输入：
2
present
present absent present present leaveearly present absent

输出：
true false
```

```js
function kaoqin (N, arr) {
  function check(records) {
    let absent = 0;
    for (let i = 0; i < records.length; i++) {
      if (records[i] === 'absent') {
        absent++;
        if (absent > 1) {
          return false;
        }
      } else if (records[i] === 'leaveearly' || records[i] === 'late') {
        if (i > 0 && (records[i - 1] === 'late' || records[i - 1] === 'leaveearly')) {
          return false;
        }
      }
      if (i >= 6) {
        let count = 0;
        for (let j = i - 6; j <= i; j++) {
          if (records[j] !== 'present') {
            count++;
          }
        }
        if (count > 3) {
          return false;
        }
      }
    }

    return true;
  }
}
```

## 寻找身高相近的小朋友

小明今年升学到小学一年级，来到新班级后发现其他小朋友们身高参差不齐，然后就想基于各小朋友和自己的身高差对他们进行排序，请帮他实现排序。

输入描述：

- 第一行为正整数H和N，`0<H<200`，为小明的身高，`0<N<50`，为新班级其他小朋友个数。
- 第二行为N个正整数H1-HN，分别是其他小朋友的身高，取值范围`0<Hi<200` (`1<= i <=N`)，且N个正整数各不相同。

输出描述：

输出排序结果，各正整数以空格分割。和小明身高差绝对值最小的小朋友排在前面，和小明身高差绝对值最大的小朋友排在最后，如果两个小朋友和小明身高差一样，则个子较小的小朋友排在前面。

思路：属于排序算法的应用，解题思路是计算每个同学的身高和小明身高的差值，然后按照这个差值进行排序，差值相同，则按身高排序；差值不同，绝对值大的排后面

```yaml
输入：
100 10
95 96 97 98 99 101 102 103 104 105

输出：
99 101 98 102 97 103 96 104 95 105

说明：
小明身高100，班级学生10个，身高分别为95 96 97 98 99 101 102 103 104 105，按身高差排序后结果为: 99 101 98 102 97 103 96 104 95 105。
```

```js
function findSimilyHeight (targetHeight, studentsNum, heights) {
  heights.sort((a, b) => {
    let diffA = Math.abs(a - targetHeight);
    let diffB = Math.abs(b - targetHeight);
    if (diffA === diffB) { // 身高差一样，个子矮的排前面
      return a - b;
    }
    return diffA - diffB;
  })
}
```

## 分配土地

从前有个村庄，村民们喜欢在各种田地上插上小旗子，旗子上标识了各种不同的数字。

某天集体村民决定将覆盖相同数字的最小矩阵形的土地分配给村里做出巨大贡献的村民，请问此次分配土地，做出贡献的村民种最大会分配多大面积?

输入描述：

- 第一行输入 m 和 n，
  - m 代表村子的土地的长
  - n 代表土地的宽
- 第二行开始输入地图上的具体标识

输出描述：此次分配土地，做出贡献的村民种最大会分配多大面积

备注：

- 旗子上的数字为1~500，土地边长不超过500
- 未插旗子的土地用0标识

```yaml
3 3
1 0 1
0 0 0
0 1 0

输出 9
说明：土地上的旗子为1，其坐标分别为(0,0)，(2,1)以及(0,2)，为了覆盖所有旗子，矩阵需要覆盖的横坐标为0和2，纵坐标为0和2，所以面积为9，即（2-0+1）*（2-0+1）= 9


3 3
1 0 2
0 0 0
0 3 4

输出 1
由于不存在成对的小旗子，故而返回1，即一块土地的面积。
```

```js
// inputs 为数组 ['1 0 2', '0 0 0', '0 3 4']
function getMaxSize(m, n, inputs) {
  let land = []
  inputs.forEach(value => {
    land.push(value.split(' ').map(Number));
  })
  let maxArea = 0;
  let minpos = {};
  let maxpos = {};
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let num = land[i][j];
      if (num !== 0) {
        if (!minpos[num]) {
          minpos[num] = [i, j];
          maxpos[num] = [i, j];
        } else {
          minpos[num] = [Math.min(minpos[num][0], i), Math.min(minpos[num][1], j)];
          maxpos[num] = [Math.max(maxpos[num][0], i), Math.max(maxpos[num][1], j)];
        }
      }
    }
  }
  console.log(minpos, maxpos);
  for (let num in minpos) {
    let area = (maxpos[num][0] - minpos[num][0] + 1) * (maxpos[num][0] - minpos[num][1] + 1);
    maxArea = Math.max(maxArea, area);
  }
  console.log(maxArea);
}
```

## 剩余银饰的重量

有 N 块二手市场收集的银饰，每块银饰的重量都是正整数，收集到的银饰会被熔化用于打造新的饰品。 每一回合，从中选出三块 最重的 银饰，然后一起熔掉。假设银饰的重量分别为 x 、y 和 z，且 `x <= y <= z`。那么熔掉的可能结果如下：

如果`x == y == z`，那么三块银饰都会被完全熔掉；
如果`x == y且y != z`，会剩余重量为z - y的银块无法被熔掉；
如果`x != y且y == z`，会剩余重量为y - x的银块无法被熔掉；
如果`x != y且y != z`，会剩余重量为z - y与y - x差值的银块无法被熔掉。
如果剩余两块，返回较大的重量（若两块重量相同，返回任意一块皆可）；如果只剩下一块，返回该块的重量；如果没有剩下，就返回 0。

输入描述：

- 第一行为银饰数组长度 n，`1 ≤ n ≤ 40`，
- 第二行为 n 块银饰的重量，重量的取值范围为`[1，2000]`，重量之间使用空格隔开

输出描述：

如果剩余两块，返回较大的重量（若两块重量相同，返回任意一块皆可）；如果只剩下一块，返回该块的重量；如果没有剩下，就返回 0。

```yaml
3
1 1 1

输出 0
说明：选出 1 1 1，得到 0，最终数组转换为 []，最后没有剩下银块，返回 0

3
3 7 10
输出 1
说明：选出 3 7 10，需要计算 (7-3) 和 (10-7) 的差值，即(7-3)-(10-7)=1，所以数组转换为 [1]，剩余一块，返回该块重量，返回 1
```

```js
function lastWeight(arr) {
  arr.sort((a, b) => {
    return b - a;
  })

  while (arr.length >= 3) {
    let z = arr.shift();
    let y = arr.shift();
    let x = arr.shift();

    if (x == y && y == z) {
      continue;
    } else {
      let remaining = 0;
      if (x === y && y < z) {
        remaining = z - y;
      } else if (x < y && y == z) {
        remaining = y - x;
      } else {
        remaining = Math.abs((z - y) - (y - x));
      }
      if (remaining !== 0) {
        arr.push(remaining);
      }
      arr.sort((a, b) => b - a);
    }
  }

  if (arr.length === 0) {
    console.log(0);
  } else {
    console.log(arr[0])
  }
}
```

## 内存冷热标记

现代计算机系统中通常存在多级的存储设备，针对海量 workload 的优化的一种思路是将热点内存页优先放到快速存储层级，这就需要对内存页进行冷热标记。

一种典型的方案是基于内存页的访问频次进行标记，如果统计窗口内访问次数大于等于设定阈值，则认为是热内存页，否则是冷内存页。

对于统计窗口内跟踪到的访存序列和阈值，现在需要实现基于频次的冷热标记。内存页使用页框号作为标识。

输入描述：

- 第一行输入为 N，表示访存序列的记录条数，`0 < N ≤ 10000`
- 第二行为访存序列，空格分隔的 N 个内存页框号
- 第三行为阈值

输出描述：

第一行输出标记为热内存的内存页个数，如果没有被标记的热内存页，则输出 0 。

如果第一行 > 0，则接下来按照访问频次降序输出内存页框号，一行一个，频次一样的页框号，页框号小的排前面。

```yaml
10
1 2 1 2 1 2 1 2 1 2
5

输出 
2
1
2
在这个例子中，内存页框号 1 和 2 都被访问了 5 次，达到了阈值，因此它们被标记为热内存页。输出首先是热内存页的数量 2，然后是按照访问频次降序排列的页框号 1 和 2(频次一样的页框号，页框号小的排前面)。


5
1 2 3 4 5 
3
输出 0

在这个例子中，没有任何内存页的访问次数达到阈值 3，因此没有热内存页，输出为 0。
```

```js
// records [1, 2, 1, 2, 3]
function memoryColdHotMark(recordsNum, records, threshold) {
  let pageFrequency = records.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {}) // 获取每个页面的访问频率计数
  console.log(pageFrequency)
  let hotPage = Object.entries(pageFrequency).filter(([page, freq]) => {
    return freq >= threshold
  })
  if (hotPage.length > 0) {
    hotPage.sort((a, b) => {
      return pageFrequency[b] - pageFrequency[a] || a - b;
    })
    console.log(hotPage.length)
    hotPage.forEach(value=> {
      console.log(Number(value[0]))
    })
  }
}
```

## 字符串摘要

给定一个字符串的摘要算法，请输出给定字符串的摘要值

去除字符串中非字母的符号。
如果出现连续字符(不区分大小写) ，则输出：该字符 (小写) + 连续出现的次数。
如果是非连续的字符(不区分大小写)，则输出：该字符(小写) + 该字母之后字符串中出现的该字符的次数
对按照以上方式表示后的字符串进行排序：字母和紧随的数字作为一组进行排序，数字大的在前，数字相同的，则按字母进行排序，字母小的在前。

输入描述：一行字符串，长度为[1,200]

输出描述：摘要字符串

```yaml
输入：aabbcc
输出：a2b2c2

输入：bAaAcBb
输出：a3b2b2c0

bAaAcBb:
第一个b非连续字母，该字母之后字符串中还出现了2次(最后的两个Bb) ，所以输出b2
a连续出现3次，输出a3，
c非连续，该字母之后字符串再没有出现过c，输出c0
Bb连续2次，输出b2
对b2a3c0b2进行排序，最终输出a3b2b2c0
```

```js
function getStringNum (str) {
  str = str.toLowerCase();
  let sb = ''
  let charCount = new Array(128).fill(0);
  for (let i = 0; i < str.length; i++) {
    let ch = str[i]
    if (ch >= 'a' && ch <= 'z') { // 如果是一个字母
      sb += ch;
      charCount[ch.charCodeAt()]++;
    }
  }
  let ans = []
  let input = sb + ' '
  let pre = input.charAt(0);
  let repeat = 1;
  charCount[pre.charCodeAt()]--;
  for (let i = 1; i < input.length; i++) {
    let cur = input[i];
    charCount[cur.charCodeAt()]--;
    if (cur === pre) {
      repeat++;
    } else {
      // 如果cur 和 pre字符不是同一个字符，表示出现了非连续字符
      ans.push(pre + (repeat > 1 ? repeat : charCount[pre.charCodeAt()]))// 将pre的摘要添加进ans中
      pre = cur;
      repeat = 1;
    }
  }
  ans.sort((a, b) => {
    if (a.charAt(a.length - 1) !== b.charAt(a.length - 1)) {
      // 最后一个字符不相等
      return b.charAt(b.length - 1) - a.charAt(a.length - 1);
    } else {
      return a.charAt(0) - b.charAt(0);
    }
  })

  let res = ''
  for (let an of ans) {
    res += an;
  }
  console.log(res);
}
```

## 整型数组按个位置排序/最低位排序

给定一个非空数组(列表)，其元素数据类型为整型，请按照数组元素十进制最低位从小到大进行排序，十进制最低位相同的元素，相对位置保持不变
当数组元素为负值时，十进制最低位等同于去除符号位后对应十进制值最低位。

输入描述：给定一个非空数组，其元素数据类型为32位有符号整数，数组长度[1,1000]

输出描述：输出排序后的数组

```yaml
输入：
1,2,5,-21,22,11,55,-101,42,8,7,32

输出：
1,-21,11,-101,2,22,42,32,5,55,7,8
```

```yaml
这道题目是关于排序算法的问题，具体来说是按照数组元素的十进制最低位及元素索引位置进行排序。、

解题思路
首先，读入非空数组，将数组中的每个元素按照题目要求计算其十进制最低位，并记录下来该元素的索引位置和原始值。
创建一个辅助数组或列表，将每个元素的十进制最低位、索引位置和原始值组成一个元组，放入辅助数组中。
使用排序算法对辅助数组进行排序，排序规则是按照十进制最低位从小到大排序，如果最低位相同，则按照索引位置从小到大排序。
排序完成后，从辅助数组中提取原始值，即为排序后的结果。
```

```js
function getSortedArr (arr) {
  arr.sort((a, b) => {
    let akey = a > 0 ? a % 10 : -a % 10;
    let bkey = b > 0 ? b % 10 : -b % 10;
    return akey - bkey;
  })
  console.log(arr);
}
```

## 数组去重和排序

给定一个乱序的数组，删除所有的重复元素，使得每个元素只出现一次，并且按照出现的次数从高到低进行排序，相同出现次数按照第一次出现顺序进行先后排序。

输入描述：一个数组

输出描述：去重排序后的数组

```yaml
1,3,3,3,2,4,4,4,5

输出 3,4,1,2,5
```

```js
function uniqueArrarSort(arr) {
  let map = new Map();
  let uniqueArr = [];
  for (let i = 0; i < arr.length; i++) {
    let count = map.get(arr[i]) || 0;
    map.set(arr[i], count + 1);
    if (uniqueArr.indexOf(arr[i]) === -1) {
      uniqueArr.push(arr[i])
    }
  }

  uniqueArr.sort((a, b) => {
    if (map.get(a) === map.get(b)) {
      return null;
    } else {
      return map.get(b) - map.get(a);
    }
  })
}
```
