# 组件库设计

## 组件库设计原则

## 组件划分

- 通用组件
- 布局组件
- 导航组件
- 数据录入型组件
- 数据展示型组件
- 反馈型组件
- 其它业务类型

## 架构

Monorepo + pnpm 的 workspace 模式

### Monorepo(单仓库)

优点

- 多项目代码在一个仓库里，相同版本依赖提升到顶层只安装一次，节省磁盘内存；
- 代码共享和复用：所有代码都在同一个仓库中，可以很容易地在不同项目之间共享和复用代码
- 统一构建和测试：共用一套构建系统和工具链进行构建和部署，提升了构建的效率

缺点：

- Monorepo可能随着时间推移变得庞大和复杂，导致构建时间增长和管理困难，git clone、pull的成本增加
- 权限管理问题：项目力度的权限管理较为困难
- 幽灵依赖：npm/yarn 安装依赖时，存在依赖提升，某个项目使用的依赖，并没有在其 package.json 中声明，也可以直接使用，这种现象称之为 “幽灵依赖”

### pnpm

优点：

- 高效的存储：pnpm使用一个全局的存储来保存所有的包，可以避免重复下载和存储相同的包，节省磁盘空间
- 更快的安装速度：非扁平的包结构，没有npm/yarn的复杂扁平算法，由于 pnpm 避免了重复下载和存储，所以它的安装速度通常比 npm 和 yarn 更快
- 更严格的包依赖管理：pnpm 会确保每个包只能访问它的依赖，这可以避免一些难以追踪的问题

缺点：

- 由于pnpm的工作方式与npm/yarn不同，一些依赖npm或yarn的工具可能无法与pnpm兼容
- 社区和生态相对于其它两个比较薄弱
- 由于 pnpm 的严格的包依赖管理，一些依赖于 npm 或 yarn 的宽松依赖管理的项目可能会在 pnpm 下出现问题

### 初始化流程

```shell
npm install pnpm -g

pnpm init

# 更改根目录的 package.json 文件
# 增加private字段 防止我们的根目录被当作包发布
{
  "private": true
}
```

#### 配置 pnpm 的 monorepo 工作区

管理多个项目，就可以采用 pnpm 的 monorepo。我们在仓库的根目录下创建一个 pnpm-workspace.yaml 文件，可以在 pnpm-workspace.yaml 配置文件中指定这个仓库中有多少个项目

```yaml
packages:
  - play # 存放组件测试的代码
  - docs # 存放组件文档
  - packages/* # packages 目录下都是组件包
```

在 packages 目录中又可以放很多包的项目目录，比如，组件包目录：components、主题包目录：theme-chalk、工具包目录：utils 等

以 components 包为例，我们进入components 目录底下初始化一个 package.json 文件，更改包名：@xxx/components

```shell
pnpm init
```

其他两个的包名创建规则一样，至此已经搭建了一个初步的项目目录

```js
├── README.md
├── package.json
├── packages
│   ├── components
│   │   └── package.json
│   ├── theme-chalk
│   │   └── package.json
│   └── utils
│       └── package.json
├── play
└── pnpm-workspace.yaml
```

#### 仓库项目内的包相互调用

@xxx/components 、@xxx/theme-chalk 、@xxx/utils 这几个包要互相进行调用呢，就需要把它们安装到仓库根目录下的 node_modules 目录中。
然后我们在根目录下进行安装操作

```shell
pnpm install @xxx/components -w
pnpm install @xxx/theme-chalk -w
pnpm install @xxx/utils -w
```

安装后根目录下的 package.json 的内容为：

```json
{
  "dependencies": {
    "@xxx/components": "workspace:*",
    "@xxx/theme-chalk": "workspace:*",
    "@xxx/utils": "workspace:*"
  },
}
// 注意：workspace:* 将来发布的时候会被转换成具体的版本号。
```
