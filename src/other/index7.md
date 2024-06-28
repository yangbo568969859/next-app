# 算法2

## 灰度图存储

## 手机APP防沉迷系统

智能手机方便了我们生活的同时，也侵占了我们不少的时间。“手机Ap防沉迷系统” 能够让我们每天合理的规划手机App使用时间，在正确的时间做正确的事

输入描述：

输出描述：

## 小朋友来自多少小区

幼儿园组织活动，老师布置了一个任务：

每个小朋友去了解与自己同一个小区的小朋友还有几个。

我们将这些数量汇总到数组 garden 中。

请根据这些小朋友给出的信息，计算班级小朋友至少来自几个小区？

输入描述：

输入：garden[] = {2, 2, 3}

- garden 数组长度最大为 999
- 每个小区的小朋友数量最多 1000 人，也就是 garden[i] 的范围为 [0, 999]

输出描述：

输出：7

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.on('line', (line) => {
  const input = line.split(' ');
  const zones = new Array(1000).fill(0);
  let result = 0;

  let index = 0;
  while (true) {
    if (index >= input.length) {
      break;
    } else {
      zones[input[index]] += 1;
    }
    index += 1;
  }

  for (let i = 0; i < 1000; i++) {
    if (zones[i] <= 0) {
      continue;
    } else {
      let total = Math.ceil(zones[i] / (i + 1));
      result += total * (i + 1);
    }
  }

  console.log(result);
  rl.close();
})

function aaa ([2, 2, 3]) {
  const zones = new Array(1000).fill(0);
  let result = 0;

  let index = 0;
  while (true) {
    if (index >= input.length) {
      break;
    } else {
      zones[input[index]] += 1;
    }
    index += 1;
  }

  for (let i = 0; i < 1000; i++) {
    if (zones[i] <= 0) {
      continue;
    } else {
      let total = Math.ceil(zones[i] / (i + 1));
      console.log(total, i + 1, total * (i + 1));
      result += total * (i + 1);
    }
  }

  console.log(result);
}
```

## 测试用例执行计划

某个产品当前迭代周期内有N个特性（F1, F2, ..., FN）需要进行覆盖测试，每个特性都被评估了对应的优先级，特性使用其ID作为下标进行标识。

设计了M个测试用例（T1, T2,...,TM），每个用例对应了一个覆盖特性的集合，测试用例使用其ID作为下标进行标识，测试用例的优先级定义为其覆盖的特性的优先级之和。

在开展测试之前，需要制定测试用例的执行顺序，规则为：优先级大的用例先执行，如果存在优先级相同的用例，用例ID小的先执行。

输入描述：

- 第一行输入为N和M，N表示特性的数量，M表示测试用例的数量。
- 之后N行表示特性ID=1到特性ID=N的优先级。
- 再接下来M行表示测试用例ID=1到测试用例ID=M关联的特性的ID的列表。

输出描述：按照执行顺序（优先级从大到小）输出测试用例的ID，每行一个ID。

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
  let [M, N] = inputs.shift().split(' ').map(Number);
  let featuresNums = inputs.slice(0, N).map(Number);

  let testCases = inputs.slice(N).map((line, index) => {
    let sum = line.split(' ').reduce((acc, cur) => {
      return acc + featuresNums[index];
    })

    return {
      id: index + 1,
      priority: sum,
    }
  })
  testCases.sort((a, b) => {
    return b.proiority - a.priority || a.id - b.id;
  })
  testCases.forEach(testCase => {
    console.log(testCase.id)
  })
})
```

## 螺旋数字矩阵

输入描述：

输出描述：

## 堆内存申请

有一个总空间为100字节的堆，现要从中新申请一块内存，内存分配原则为:

优先分配紧接着前一块已使用的内存，分配空间足够时分配最接近申请大小的空闲内存。

输入描述：

- 第1行是1个整数，表示期望申请的内存字节数。
- 第2到第N行是用空格分割的两个整数，表示当前已分配的内存的情况，每一行表示一块已分配的连续内存空间，每行的第1个和第2个整数分别表示偏移地址和内存块大小，如: 0 1 3 2 表示0偏移地址开始的1个字节和3偏移地址开始的2个字节已被分配，其余内存空闲。

输出描述：

- 若申请成功，输出申请到内存的偏移 若申请失败，输出-1。

备注:

- 若输入信息不合法或无效，则申请失败
- 若没有足够的空间供分配，则申请失败
- 堆内存信息有区域重叠或有非法值等都是无效输入

```yaml
输入：
1
0 1
3 2

输出：
1

说明：
堆中已使用的两块内存是偏移从0开始的1字节和偏移从3开始的2字节，空闲的两块内存是偏移从1开始2个字节和偏移从5开始95字节根据分配原则，新申请的内存应从1开始分配1个字节，所以输出偏移为1。
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let mallocSize; // 需要分配的内存大小
let useMemory = []; // 已分配的内存
rl.on('line', (line) => {
  if (!mallocSize) {
    mallocSize = parseInt(line.trim());
    if (mallocSize <= 0 || mallocSize > 100) {
      console.log(-1)
      process.exit(0);
    }
  } else {
    const memoryBlock = line.split(' ').map(Number);
    useMemory.push(memoryBlock);
  }
}).on('close', () => {
  useMemory.sort((a, b) => a[0] - b[0]);

  let start = 0;
  let bestFitStart = -1;
  let minSizeDiff = Number.MAX_SAFE_INTEGER;

  for (let block of useMemory) {
    let blockStart = block[0];
    let blockSize = block[1];

    if (blockStart < start || blockStart <= 0 || blockStart + blockSize > 100) {
      console.log(-1)
      process.exit(0);
    }
    let freeSpace = blockStart - start
    // 空闲空间
    if (mallocSize <= freeSpace && (freeSpece - mallocSize) < minSizeDiff) {
      bestFitStart = blockStart;
      minSizeDiff = freeSpace - mallocSize;
    }
    start = blockStart + blockSize;
  }
  // 检查最后一个内存块是否有足够空间
  if (100 - start >= mallocSize && (100 -start-mallocsize) < minSizeDiff) {
    bestFitStart = start;
  }
  console.log(bestFitStart)
})
```

## 单行道汽车通行时间

M（1<=M<=20）辆车需要在一条不能超车的单行道到达终点，起点到终点的距离为N（1<=N<=400）。速度快的车追上前车后，只能以前车的速度继续行驶。求最后一车辆到达目的地花费的时间。

注：每辆车固定间隔一小时出发，比如第一辆车0时出发，第二辆车1时出发，以此类推

输入描述：

- 第一行两个数字：M N分别代表车辆数和到终点的距离，以空格分隔。
- 接下来M行，每行1个数字S，代表每辆车的速度。`0<S<30`。

输出描述：

最后一辆车到达目的地花费的时间

```yaml
2 11
3
2

输出 5.5
```

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let inputs = []

rl.on('line', (line) => {
  lines.push(line)
}).on('close', () => {
  const [M, N] = lines[0].split(' ').map(Number)
  const speeds = lines.slice(1, M + 1).map(Number)
  const arrivalTimes = new Array(M).fill(0)
  arrivalTimes[0] = N / speeds[0]

  for (let index = 1; index < M; index++) {
    const currentTime = N / speeds[index] + index;
    if (currentTime > arrivalTimes[index - 1]) {
      arrivalTimes[index] = currentTime;
    } else {
      arrivalTimes[index] = arrivalTimes[index - 1];
    }
  }
  console.log(arrivalTimes[M - 1] - M + 1)
})
```
