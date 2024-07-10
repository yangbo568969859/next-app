---
title: 字符串常见算法
description: 替换空格、字符串的排列、括号生成等
date: 2022-06-13
---

# 二叉树基本操作

## 常见算法题

- 表示数值的字符串
- 替换空格
- 正则表达式匹配
- 字符串的排列
- 字符串翻转
- 左旋转字符串
- 字符流中第一个不重复的字符
- 括号生成
- 最长公共前缀
- 最长回文子串
- 有符号整数反转
- 无重复字符的最长子串
- 重复删除字符串中的所有相邻重复项

### 无重复字符的最长子串

```js
function findMaxStr (str) {
  let max = 0;
  let left = 0; let right = 1;
  let temp = '';

  while (right < str.length) {
    temp = str.slice(left, right);
    if (temp.indexOf(str.charAt(right)) > -1) {
      left++;
      continue;
    } else {
      right++;
    }
    max = Math.max(max, right - left);
  }
}
```

### 重复删除字符串中的所有相邻重复项

```js
// aabbsssssa -> bbsssssa -> sssa -> sa
function removeDuplicates (str) {
  let stack = [];
  for (let s of str) {
    let prev = stack.pop();
    if (prev !== s) {
      stack.push(prev);
      stack.push(s)
    }
  }
  console.log(stack.join(''))
}
```