---
title: vscode 插件开发
description: VSCode 插件，让你的开发效率突飞猛进
date: 2024-05-05
---

# vscode 插件开发

## 开发环境准备

- Visual Studio Code
- Node.js
- Npm/Yarn
- vscode 推荐的脚手架 Yeoman 和 Generator-code
- 插件打包和发布工具 vsce

## 初始化项目

```bash
# 工具安装
npm install --global yo generator-code
# 创建插件项目
yo code
```

```bash
# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Yes
# ? Bundle the source code with webpack? No
# ? Which package manager to use? npm

# ? Do you want to open the new folder with Visual Studio Code? Open with `code`
```

> 脚手架工具支持创建插件（New Extension）、主题（New Color Theme）、新语言支持（New Language Support）、代码片段（New Code Snippets）、键盘映射（New Keymap）、插件包（New Extension Pack）。以上不同类型的脚手架模板只是侧重的预设功能不同，本质还是 VSCode 插件

## 项目结构

```yaml
.
├── .vscode
  ├── launch.json    # 插件加载和调试的配置
  ├── settings.json  # vscode本地配置
├── CHANGELOG.md     # 变更记录
├── extension.js     # 插件执行入口文件
├── jsconfig.json    # JavaScript 类型检查配置
├── node_modules 
├── package-lock.json
├── package.json     # 声明当前插件相关信息
├── README.md        # 插件使用说明
└── vsc-extension-quickstart.md    # 插件开发者快速入门
```

对于初始化项目结构，我们可以基于此改造一些 extension.js 文件，因为所有代码放在 extension.js 对于功能较多不太合适，我们新建一个src，将extension.js 文件放到 src 目录下，然后在package.json 中更改main入口为改造后的路径

### package.json 说明

- activationEvents 用于定义插件何时被加载/激活
  - onLanguage:${language} 打开特定语言文件时
  - onCommand:${command} 调用某个 VSCode命令时
  - onDebug Debug 时
  - onView:${viewId} 指定 id 的视图展开时
  - onUri 插件的系统级 URI 打开时
  - onWebviewPanel webview 触发时
  - onFileSystem:${scheme} 以某个协议（ftp/sftp/ssh等）打开文件或文件夹时
  - `*` VSCode 启动时
- contributes 用于定义扩展项的具体配置。常用扩展项有(通常完成命令的开发后，会将其与菜单/快捷键进行关联，以便调用)
  - 代码片段（snippets）
  - 命令（commands）
  - 菜单（menus）
  - 快捷键（keybindings）
  - 主题（themes）

```json
{
  "name": "vcplugin", // 插件名称
  "displayName": "vcplugin", // 显示名称
  "description": "vcplugin code编码", // 描述信息
  "version": "1.0.1", // 版本号 semver格式
  "icon": "images/vcplugin.jpg", // 图标
  "engines": { // 插件最低支持的vscode版本号
    "vscode": "^1.85.0"
  },
  "categories": [ // 分类，可选 Languages/Snippets/Linters/Themes/Other 等等
    "Other"
  ],
  "activationEvents": [], // 加载/激活方式
  "main": "./src/extension.js", // 入口文件路径
  "publisher": "568969859", // 发布者
  "contributes": { // 注册扩展项配置
    "commands": [
      {
        "command": "vcplugin.helloWorld", // 命令名称
        "title": "Hello World" // 命令描述
      },
    ]
  }
}
```

### extension.js 说明

在extension.js 中，我们需要定义一个 activate 方法，这个方法是插件的入口函数，在插件的入口函数中，我们需要注册命令、菜单等扩展项

```js
const vscode = require('vscode');

// 扩展程序激活时会调用此方法
// 首次执行命令时会激活扩展程序
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand('vcplugin.helloWorld', function () {
    const dateMsg = new Date().toLocaleString();
    // 右下角消息提示
    vscode.window.showInformationMessage('Hello vcplugin! current Time is ' + dateMsg);
  });
}
// 当您的扩展程序停用时，将调用此方法
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
```

## 启动项目

打开 src/extension.ts 文件，并按下 F5 即可运行项目

这里默认采用的就是 Debug 模式进行运行

我们也可以通过 vscode Debug 窗口中的按钮点击运行位置如下

## 开发人员调试窗口

可以使用 Ctrl/cmd+Shift+P 打开一个命令调用窗口，并输入 Developer: Toggle Developer Tools，回车后即可打开一个和浏览器开发者调试工具一样的窗口

vscode 是基于 electron 框架开发的，所以必然也是拥有开发者调试工具的。跟浏览器的 console 调试基本一样。

## 插件打包 VSCE

### 安装

```bash
npm install -g @vscode/vsce

npm install -g vsce
```

或者不安装

```bash
npx vsce [命令参数]
```

```bash
vsce package
```

### 打包

打包成 VSIX

在项目根目录下执行

```bash
vsce package
```

这里需要注意，vsce 打包时如果项目的依赖是采用了 pnpm 进行下载的，vsce 会打包失败的，需要删除 node_modules 然后使用 npm 重新下载，再执行 vsce package

### 发布

- 先去 [azure](https://dev.azure.com/) 创建账号，登录完点击以下链接，或者再次访问 azure
- 进去后，创建组织：（组织命名随便命，不一定要跟项目一致）
- 获取 Personal Access Token（右上角头像左边的用户按钮，下拉后有个菜单 Personal Access Token，点击进入 ）
- 点击 New Token
- 创建好后复制保存好这个 Personal Access Token（PS：一定要记得保存下来）
- 创建发布者，访问[创建发布者页面 publisher](https://marketplace.visualstudio.com/manage) （Name 最好跟上一步一样，好记一点）
- 执行命令登录 vsce login xxx，会要求输入 Personal Access Token
- 在 package.json 中添加 publisher 字段
- 发布 vsce publish
- 查看插件发布情况，访问 [插件管理](https://marketplace.visualstudio.com/manage) 页面，点击查看发布历史

```bash
vsce publish
```

### 官方API

[extension](https://code.visualstudio.com/api/get-started/your-first-extension)

[中文教程](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/)

## 其他

### 左侧菜单图标显示

通过在 package.json 中的 contributes 中添加对应的属性即可

```json
"contributes": {
  "viewsContainers": {
    "activitybar": [
      {
        "id": "vcpluginWebview",
        "title": "vcplugin",
        "icon": "images/cat.png"
      }
    ]
  },
  "views": {
    "vcpluginWebview": [
      {
        "type": "webview",
        "id": "vcplugin.chat-webview",
        "name": "vcplugin"
      }
    ]
  }
}
```

### webview容器注册

假设我们点击左侧定义的菜单按钮，需要打开一个 webview 页面，如何去实现

在上面菜单中，我们定义了一个 id 为 vcplugin.chat-webview 的按钮，点击这个按钮后，会触发一个事件，我们需要在 extension.activate 中实现这个事件；对于打开一个 webview 页面，vscode 也提供了对应的构造器，构造器必须实现 resolveWebviewView 方法

```js
function activate(context) {
  const chatViewProvider = new ChatViewProvider(context); //注册webview实例
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vcplugin.chat-webview",
      chatViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  );
}
```

```js
// ChatViewProvider 必须实现 resolveWebviewView 方法
const vscode = require("vscode");
const { getHtmlForWebview } = require("./webview");

class ChatViewProvider {
  constructor(context) {
    this._context = context;
  }

  resolveWebviewView(webviewView, context) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,  // 启用脚本
      retainContextWhenHidden: true, // 保持上下文
    };

    webviewView.webview.html = getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "insertCode":
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  }

  // vscode向webview发送消息
  sendMessageToIframe(options) {
    this._view.webview.postMessage({
      origin: "vscode",
      ...options,
    });
  }
}

module.exports = {
  ChatViewProvider,
};
```

```js
// webview.js
const webviewUrl = "http://xxx"; // 你要打开的webview的地址

const getHtmlForWebview = () => {
  let hash = new Date().getTime();
  let realUrl = `${webviewUrl}?hash=${hash}`;
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CodeMaker</title>
      </head>
      <body style="padding-left:0;padding-right:0">
        <iframe
          src="${realUrl}"
          frameborder="0"
          style="width:100%;height: calc(100vh - 3px)"
          id="codemaker-webui"
          allow="cross-origin-isolated; autoplay; clipboard-read; clipboard-write"
        ></iframe>
      </body>
      <script>
      const iframeuri = "${realUrl}";
      const webviewUrl = "${webviewUrl}";
      const iframe = document.getElementById('codemaker-webui');
      const vscode = acquireVsCodeApi();
      console.log('vscode', vscode)
      window.addEventListener('message', event => {
        console.log(event, webviewUrl)
        const data = event.data;
        vscode.postMessage({
          command: data.type,
          content: data.content,
        })
        // 只接受从指定的域名发送过来的消息
        if (event.origin === "${webviewUrl}") {
          vscode.postMessage(event.data);
        } else if (event.origin && event.origin.startsWith('vscode-webview')) {
          iframe.contentWindow.postMessage(event.data, iframeuri);
        }
      });
      </script>
    </html>`;
};

module.exports = {
  getHtmlForWebview,
};
```

### 快捷键绑定

package.json 中定义 keybindings 字段，可以定义快捷键

```json
{
  "contributes": {
    "commands": [
      {
        "command": "vcplugin.toggle-comment",
        "title": "Toggle Comment"
      }
    ],
    "keybindings": [
      {
        "command": "vcplugin.toggle-comment",
        "key": "ctrl+shift+g",
        "mac": "cmd+shift+g"
      }
    ]
  }
}
```

在上面示例中，我们在commands中定义了一个命令: vcplugin.toggle-comment，除此之外我们还需要在keybindings中定义快捷键绑定的命令；通过这种方式,你可以在VS Code插件中定义快捷键并将其与相应的命令关联起来。当用户按下定义的快捷键时,对应的命令就会被触发执行

```js
// 实现
const vscode = require('vscode');

function activate(context) {
  // 注册一个快捷键
  let keybindingDisposable = vscode.commands.registerCommand('vcplugin.toggle-comment', () => {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
      let document = editor.document;
      let selection = editor.selection;

      // 获取选中的文本
      let text = document.getText(selection);

      // 根据选中的文本是否已经被注释来切换注释
      let isCommented = text.startsWith('//');
      let newText = isCommented ? text.replace(/^\/\//mg, '') : text.replace(/^/mg, '//');

      // 替换选中的文本
      editor.edit(editBuilder => {
        editBuilder.replace(selection, newText);
      });
    }
  })
  // 将快捷键添加到订阅列表中
  context.subscriptions.push(keybindingDisposable);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
```
