---
title: git commit
description: git commit message 规范
date: 2021-05-11
---

# git commit message 规范

## 格式

每个 commit message 包含一个 header, 一个 body 和一个 footer。header由 type，scope，subject 组成。header中的 type 和 subject 是必填的，scope 选填。body 和 footer 选填

```js
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Type 类型

- build: 构建
- feat: 新功能
- fix: 在提测或者上线之后修复的bug
- docs: 仅仅修改了文档.如：README,CHANGELOG等
- style: 修改代码风格.如：修改了缩进，空格，逗号；增加，修改，删除了注释；删除多余的文件；删除console.log等
- refactor: 代码重构，没有新增功能也没有修复bug
- pref: 性能优化
- test: 修改测试用例。如单元测试，集成测试等
- revert: 回滚到某个版本
- chore: 改变构建流程，增加了依赖库或修改了配置文件等

Scope 指定本次变更修改的文件

## Git Hooks 和 CommitLint

Git 提交信息需要遵循 Angular 约定是为了使提交信息格式清晰、易于阅读和理解，从而提高代码协作的效率

使用 commitlint (opens new window)和 husky 验证并限制 commit message。不符合规定格式的日志拒绝提交

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