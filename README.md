# [Next.js 14] 基于 Next.js 的前端工程创建和模板化

next.js 是一个基于 React 的轻量化服务端渲染框架，它提供了一些开箱即用的特性，如基于文件系统的路由器、自动代码分割、静态文件服务、CSS 模块化、服务端渲染、热模块替换等，使得开发者可以快速高效构建 React 应用程序

特点

- 基于文件系统的路由器 不需要配置路由器
- 服务端渲染 Next.js 可以在服务器端渲染 React 组件，从而提高页面的加载速度和 SEO
- 自动代码分割 Next.js 可以自动将页面和组件拆分成小块，从而提高页面的加载速度
- 静态文件服务
- CSS 模块化 Next.js 支持 css 模块化，可以将 css 样式和组件进行关联，从而避免央视冲突
- 热模块替换 Next.js 支持热模块替换，可以在不刷新页面的情况下更新组件

## 项目创建

Next.js 14 对 Node.js 版本要求 18.17 以上

```shell
# 自动安装
npx create-next-app@latest
# 已创建项目手动安装
npm install next@latest react@latest react-dom@latest
```

使用 TypeScript 模板来创建一个默认的 Next.js 应用

```shell
npx create-next-app@latest
What is your project named? ... next-project
Would you like to use TypeScript? ... No / Yes
Would you like to use ESLint? ... No / Yes
Would you like to use Tailwind CSS? ... No / Yes
Would you like to use `src/` directory? ... No / Yes
Would you like to use App Router? (recommended) ... No / Yes
Would you like to customize the default import alias (@/*)? ... No / Yes
What import alias would you like configured? ... @/*
Creating a new Next.js app in D:\study\react\next-project.
```

- TypeScript YES
- ESLint YES
- use `src/` directory 默认是 app 路径（前端一般较多使用 src 目录，这个选 NO 会生成 src/app 路径）
- App Router 是否使用 APP 路由模式
- 是否使用 @ 设置别名

命令执行完成后，运行项目

```shell
npm run dev
```

打开 http://localhost:3000/ 成功运行

![next-start](./image/next-start.png)

## Git Hooks 和 CommitLint

Git 提交信息需要遵循 Angular 约定是为了使提交信息格式清晰、易于阅读和理解，从而提高代码协作的效率

### 安装 husky

"husky"是一个为了方便使用Git hooks的工具，它能够帮助你在项目中自动化地执行一些Git相关的操作。使用husky，你可以在Git的一些关键操作（例如提交、推送、合并等）前或后，执行一些脚本或命令，比如代码格式化、自动化测试、打包发布等

他可以帮助我们额外拦截一些如git commit等指令。需要注意的是，husky只在Git仓库中才能正常工作，所以在使用之前请确保你的项目已经初始化为Git仓库

```shell
npm install husky --save-dev
```

package.json 中新增 husky 配置

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test"
    }
  }
}
```

执行 husky install

```shell
# prepare在npm install的时候会自动自行
npm run prepare
# 或者
npx husky install
```

执行完这个命令后，工程目录中会生成.husky 目录，存储 hooks

创建一个 hook

```shell
# 脚本创建 9.0版本add废弃了(会提示 add command is deprecated)，可以手动创建或者脚本创建
npx husky add .husky/pre-commit "npm run lint"
# 脚本创建2
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

手动创建 .husky 目录下创建 pre-commit 和 commit-msg

```bash
# pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
echo "husky pre-commit" && npx lint-staged

# commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
echo "husky commit-msg" && npx --no-install commitlint --edit $1
```

配置完成后 git commit 的时候就会对相关文件执行 lint-staged 和 message 校验的工作了

git commit执行之后会报错是因为我们还没配置commitlint (Please add rules to your `commitlint.config.js`)下面我们就开始配置

### 安装 commitlint

- commitizen 就像是生产线上的模板，它定义了产品的外观和结构，提供了一种易于理解和使用的模板来生成规范化的提交信息。
- cz-customizable 就像是生产线上的调整机器，你可以给产品换个颜色，换个包装等等。它可以根据不同的需求对模板进行定制，适应不同的项目需求。
- commitlint 就像是生产线上的检测设备，这意味着不管你如何去 DIY 这个产品，他总要有一个审核标准来说明他是一个合格产品。而 commitlint 支持多种规范配置文件，其中就包括 commitlint-config-cz，它继承了 commitlint-config-conventional 的基础规范，并增加了对 commitizen 规范的支持

对自动生成 commit 信息的校验

```shell
npm install @commitlint/config-conventional @commitlint/cli --save-dev
```

更目录创建 commitlint.config.js 文件，配置 commitlint

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "revert"
      ]
    ],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"]
  }
};
```

再次执行git commit，只要commit信息符合 commitlint.config.js 配置，就能成功

全局安装 commitizen

```shell
npm install -g commitizen
npm install -g cz-conventional-changelog
```

随后你就可以使用以下命令获得中规中距的 commit 信息了。

```shell
git cz
```

安装 cz-customizable

```shell
pnpm install cz-customizable --save-dev
```

添加以下配置到 package.json 中

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```

项目根目录下创建.cz-config.js 文件来自定义提示(默认是.cz-config.js 文件，如果想对.cz-config.js 文件进行重命名则使用 cz-customizable 配置)

```js
module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: "feat", name: "✨ feat:     新增功能" },
    { value: "fix", name: "🐛 fix:      修复 bug" },
    { value: "docs", name: "📝 docs:     文档变更" },
    {
      value: "style",
      name: "💄 style:    代码格式（不影响功能，例如空格、分号等格式修正）"
    },
    {
      value: "refactor",
      name: "♻️ refactor: 代码重构（不包括 bug 修复、功能新增）"
    },
    { value: "perf", name: "⚡️ perf:     性能优化" },
    { value: "test", name: "✅ test:     添加、修改测试用例" },
    {
      value: "build",
      name:
        "🚀 build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）"
    },
    { value: "ci", name: "ci:       修改 CI 配置、脚本" },
    {
      value: "chore",
      name:
        "🔧 chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）"
    },
    { value: "revert", name: "⏪ revert:   回滚 commit" }
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ["docs", "文档相关"],
    ["components", "组件相关"],
    ["hooks", "hook 相关"],
    ["utils", "utils 相关"],
    ["element-ui", "对 element-ui 的调整"],
    ["styles", "样式相关"],
    ["deps", "项目依赖"],
    ["auth", "对 auth 修改"],
    ["other", "其他修改"],
    // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
    ["custom", "以上都不是？我要自定义"]
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    };
  }),

  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // 针对每一个 type 去定义对应的 scopes，例如 fix
  /*
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },
  */

  // 交互提示信息
  messages: {
    type: "选择你要提交的类型：",
    scope: "\n选择一个 scope（可选）：",
    // 选择 scope: custom 时会出下面的提示
    customScope: "请输入自定义的 scope：",
    subject: "填写简短精炼的变更描述：\n",
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: "列举非兼容性重大的变更（可选）：\n",
    footer: "列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n",
    confirmCommit: "确认提交？"
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ["feat", "fix"],

  // 跳过要询问的步骤
  // skipQuestions: ['body', 'footer'],

  // subject 限制长度
  subjectLimit: 100,
  breaklineChar: "|" // 支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
};
```

此时再次运行 git cz 时就可以看到

```shell
? 请选择提交的类型： (Use arrow keys)
❯ ✨ feat:      新增功能
  🐛 fix:      修复 bug
  📝 docs:      文档变更
  💄 style:     样式格式(不影响代码运行的变动)
  ♻️  refactor:    重构 (既不增加feature, 也不是修复bug)
  ⚡️ perf:      性能优化
  ✅ test:      增加测试
```

### 安装 lint-staged

使用lint-staged, 对暂存区代码进行eslint校验和prettier格式化

```shell
npm install lint-staged --save-dev
```

在 package.json 中配置 lint-staged 配置表明在运行 lint-staged 的时候将只匹配 src 和 test 目录下的 ts 和 tsx 文件

```json
{
  "lint-staged": {
    "src/*.{js,jsx,mjs,ts,tsx}": [
      "node_modules/.bin/prettier --write",
      "eslint --config .eslintrc.js"
    ],
    "src/*.{css,scss,less,json,html,md,markdown}": [
      "node_modules/.bin/prettier --write",
      "git add"
    ]
  }
}
```

这样，每次在执行 git commit 命令时，都会自动执行 npx lint-staged(package.json 中配置的 lint-staged)

## vscode 配置

根目录下新增 .vscode 文件夹，创建 settings.json 文件，该文件是一个覆盖已安装 vscode 的默认设置值，该文件配置仅对当前项目生效

具体配置说明可以点左下角设置按钮，找到设置菜单，打开后可以查看自己 vscode 的各项设置

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.tabSize": 2
}
```

## 调试

在 .vscode 目录下创建 launch.json 文件

```json
{
  "version": "0.1.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

## Next.js 的目录结构

在初始化 next14 版本的项目时，会有个选项询问是否喜欢 src 目录结构，nextjs 默认是不会生成 src 目录结构的，因此如果喜欢 src 风格的目录结构，这个选项要注意一下

```shell
# 是否生成src的目录结构
Would you like to use `src/` directory? ... No / Yes
```

我默认生成的是 src 风格的目录

```md
/app 默认生成的 app 路径
/app/pages 路由页面
/utils 工具类脚本
/components 组成应用程序的各个 UI 组件将位于此处
```

## 代码格式化和质量工具

代码规范推荐使用创建项目时的 eslint 支持

```shell
# 这个选项选YES,自动生成eslint配置和安装对应的依赖包
Would you like to use ESLint? ... No / Yes
```

自动格式化我们安装 prettier 插件实现

```shell
npm install prettier --save-dev
```

根目录添加两个文件，.prettierrc 和.prettierignore

.prettierrc 项目的 prettier 配置（配置什么完全取决于自己团队或自己的代码风格）

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

.prettierignore 忽略代码格式化的文件或文件夹

```text
.yarn
.next
dist
node_modules
```

自动化 prettier，在 package.json 中新增 script 脚本

```json
{
  "scripts: {
    ...
    "prettier": "prettier --write ."
  }
}
```

以上配置好之后可以试着执行

```shell
npm run prettier
```

看下自己配置的格式化有没有生效

## 创建组件或页面模板

依赖包 fs-extra mustache log-symbols inquirer 等依赖

- fs-extra 是 fs 的扩展，继承了 fs 所有方法并为这些方法添加了 promise 语法
- mustache 是一种无逻辑的模板语法。它可用于 HTML、配置文件、源代码 - 任何东西
- log-symbols 各种日志级别的彩色符号
- inquirer Node.js 的一个易于嵌入且美观的命令行界面

注意：如果出现 Error [ERR_REQUIRE_ESM]: require() of ES Module not supported 说明是某个包不支持 require，就需要看对应的包哪个版本支持 require，我这边碰到两个包最新版本不支持 require，因此我选择了低版本（inquirer@7.1.0, log-symbols@4.0.0）

```shell
npm i fs-extra mustache log-symbols inquirer --save-dev
```

根目录创建 bin 文件夹，存放创建模板等脚本

bin 文件夹下创建 new/index.js 用于生成模板文件

```js
const rimraf = require("rimraf");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const Mustache = require("mustache");

const createModuleFiles = (moduleName, moduleType, moduleDesc) => {
  const outputName =
    moduleName[0].toLowerCase() + moduleName.slice(1, moduleName.length);
  const templates = [
    {
      template: "moduleComponentTsx.tpl",
      output: `app/components/${moduleName}/${moduleName}.tsx`
    },
    {
      template: "moduleComponentStyle.tpl",
      output: `app/components/${moduleName}/${moduleName}.module.css`
    }
  ];
  try {
    let tpl, output;
    templates.forEach(temp => {
      tpl = fs.readFileSync(
        path.resolve(__dirname, `./templates/component/${temp.template}`),
        "utf8"
      );
      output = Mustache.render(tpl, { moduleName, outputName, moduleDesc });
      fs.outputFileSync(path.resolve(process.cwd(), temp.output), output);
    });
    console.log("模块文件创建完成");
  } catch (error) {
    console.error(error);
  }
};

class NewModule {
  constructor() {
    this.createModule();
  }

  async createModule() {
    // 模块类型
    const moduleType = await this.inputType();
    // 模块名
    const moduleName = await this.inputName();
    // 模块描述
    const moduleDesc = await this.inputDesc();
    // 清除重名文件
    await this.clearFile(moduleName, moduleType);
    createModuleFiles(moduleName, moduleType, moduleDesc);
  }

  async inputType() {
    const { moduleType } = await inquirer.prompt([
      {
        name: "moduleType",
        message: "请选择创建类型",
        type: "list",
        choices: [
          {
            name: "UI组件",
            value: "component"
          },
          {
            name: "页面",
            value: "page"
          }
        ],
        default: "component"
      }
    ]);
    return moduleType;
  }
  async inputName() {
    const { moduleName } = await inquirer.prompt([
      {
        name: "moduleName",
        message: "请输入模块名称",
        type: "input"
      }
    ]);
    return moduleName;
  }
  async inputDesc() {
    const { moduleDesc } = await inquirer.prompt([
      {
        name: "moduleDesc",
        message: "请输入模块描述",
        type: "input"
      }
    ]);
    return moduleDesc;
  }

  async clearFile(moduleName, moduleType) {
    if (moduleType === "page") {
      rimraf.rimraf(
        path.resolve(process.cwd(), "app/component", `${moduleName}.module.css`)
      );
      rimraf.rimraf(
        path.resolve(process.cwd(), "app/app", `${moduleName}.tsx`)
      );
    } else if (moduleType === "component") {
    }
  }
}

new NewModule();
```

new 文件夹下创建 templates 目录，用于存放模板文件，创建 moduleComponentTsx.tpl 文件，存放下面代码 双花括号里的都是变量，通过传参读取对应的值

```text
// {{moduleDesc}}
import styles from './{{outputName}}.module.css';

export interface I{{outputName}} {
  sampleTextProp: string;
}

const {{outputName}}: React.FC<I{{outputName}}> = ({sampleTextProp}) => {
  return (
    <div className={styles.{{outputName}}}>
      { sampleTextProp }
    </div>
  )
}

export default {{outputName}};

```

pages 的逻辑类似，模板自己重新定义

在 package.json 创建对应的创建脚本

```shell
{
  "scripts: {
    ...
    "create": "node bin/new"
  }
}
```

运行命令

```shell
npm run create
```

可以到自己设置的目录查看是否创建成功

效果

![iamge](./image/create.gif)

## 其他

[代码仓库](https://github.com/yangbo568969859/next-app)
