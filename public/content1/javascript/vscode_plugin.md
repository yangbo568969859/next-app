# VsCode 插件开发

## 初始化插件工程

- npm install -g yo generator-code
- yo code (如果未成功创建项目下的相关文件，看下第一步是不是报错了很多warning，是不是node版本不对应，下载正确的node版本)
- 项目创建完，vscode打开项目， Ctrl+Shift+P 输入 Hello World 命令，就可以运行插件下定义的命令了

## 文件说明

- extension.ts 文件是vscode插件的入口文件
- package.json

```json
{
  "name": "vcplugin", // 插件名
  "displayName": "vcplugin", // 显示在应用市场的名字
  "description": "vcplugin test plugin", // 插件描述
  "version": "0.0.1", // 插件版本
  "engines": {
    "vscode": "^1.85.0" // vscode最低版本要求
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [ // 激活事件组，用来定义插件在什么时候被激活
    "onCommand:vcplugin.helloWorld",
    "onCommand:vcplugin.askQuestion"
  ],
  "main": "./extension.js", // 入口文件
  "contributes": { // 基本所有配置都在这里，保存通过哪些命令触发插件、插件配置信息等等 详情可参考官方文档：https://code.visualstudio.com/api/references/contribution-points
    "commands": [
      {
        "command": "vcplugin.helloWorld",
        "title": "Hello World"
      },
      {
        "command": "vcplugin.askQuestion",
        "title": "Ask Question"
      }
    ]
  },
  "scripts": {
    ...
  },
  "devDependencies": {
    ...
  }
}

```

## 发布插件

- [azure](https://dev.azure.com/) 创建账号
- 创建组织：（组织命名随便命，不一定要跟项目一致）
- 获取 Personal Access Token
- New Token
- 创建发布者
- vsce login
- 在 package.json 中添加 publisher 字段
- 使用命令发布  vsce publish
- 插件管理页面 [publishers](https://marketplace.visualstudio.com/manage)

## 官方API

[extension](https://code.visualstudio.com/api/get-started/your-first-extension)

[中文教程](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/)
