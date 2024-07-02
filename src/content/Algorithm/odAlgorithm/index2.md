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

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：

## 

输入描述：

输出描述：
