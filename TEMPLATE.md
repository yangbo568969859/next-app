# 数据格式

文件夹树形结构

```json
{
  "id": "", // 唯一标识
  "title": "", // 标题
  "icon": "", // 图标
  "ext": "", // 扩展名
  "link": "", // 链接
  "path": "", // 文件路径
  "description": "", // 详情
  "isDir": false, // 是否是文件夹
  "children": [], // 子文件夹
  "meta": {
    "title": "md标题",
    "data": "时间",
    "spoiler": "描述"
  }
}
```

文件map 快速查找