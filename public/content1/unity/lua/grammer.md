# Lua 语法

## 语法注意项

lua中除了 nil 和 false，其余都为真（包括0）
lua中table下标是从1开始的
lua循环中不能修改i的值

```lua
for i = 10, 1, -1 do
  print(i)
  if i = 5 then break end
  i = 1; -- 无效 lua默认会在前面加上local关键字
end
```

### require

- 运行指定文件
- 末尾不带拓展符
- 目录层级用 "."分割
- 只会运行一次
- 从package.path中的路径里查找 (例如有个子文件夹child 那么我们可以指定 package.path = package.path..";./child/?.lua" 那么require的时候就不需要拼接问价夹名了)
- 如何多次调用

### 迭代器

可以利用next 函数判断table是不是nil

```lua
-- 判断table是否为nil
t = {}
if next(t) == nil then
  print("t is nil")
else 
  print("t not is nil")
end;
```

ipairs用法(如果中间某个数值断掉，比如直接从5 到 6 那么中间断掉得值是不会迭代得)

```lua
t = {"a", "b", "c", "d"}
for i,j in ipairs(t) do
  print(i, j)
end
```

pairs 用法

```lua
t = {
  "apple": "apple",
  "blue": "blue",
  "cool": "cool"
}
for k,v in pairs(r) do
  print(k, v)
end
```

### string 字符串库

字符串正数序号也是从1下标开始的
