---
title: 前端包管理器探究
description: npm/yarn/pnpm发展历程介绍以及优缺点
date: 2022-05-14
---

# 前端包管理器探究

前端接触到的包管理工具有 npm、yarn 以及 pnpm，项目中一般常用 npm 来作为包管理工具，最近有接触到 pnpm，具有安装速度快、节约磁盘控件、安全性好的优点，它的出现是为了解决 npm 和 yarn 存在的问题，然后就研究了一下三者之间的差别

## npm

npm 从 v1 - v3 - v5 版本迭代都有重大变化

### npm v1 依赖嵌套

npm v1 版本中使用了简单的嵌套模式进行依赖管理。比如我们在项目中依赖了 A、C、D 模块，而这三个模块依赖了不同的 B 模块，此时生成的 node_modules 目录如下

```shell
node_modules
├── A@1.0.0
|     └── node_modules
|            └── B@1.0.0
├── C@1.0.0
|     └── node_modules
|            └── B@2.0.0
├── D@1.0.0
|     └── node_modules
|            └── B@1.0.0
```

- 项目中引用的包越多，嵌套的层级越深，文件路径过长，大量的重复包被安装，比如上面的 B@1.0.0 就会安装两份
- node_modules 文件体积过大，多个依赖包同时依赖同一个包，就会安装多次
- 安装速度慢

### npm v3 扁平化

npm v3 完成重写依赖安装程序，npm v3 通过扁平化的方式将子依赖所在的目录中，以减少依赖嵌套导致的深层树和冗余，此时的 node_modules 目录如下

```shell
node_modules
├── A@1.0.0
├── B@1.0.0
├── C@1.0.0
      └── node_modules
            └── B@2.0.0
├── D@1.0.0
```

npm 实现了额外的依赖查找算法，核心是递归向上查找 node_modules。在安装新包时，会不停的向上级 node_modules 中查找。如果找到相同版本的包就不会重新安装，在遇到版本冲突时才会在该模块下的 node_modules 目录下存放该模块的子依赖
v3 的变化，虽然避免了嵌套过深和重复安装问题，带来了新的问题：幽灵依赖（Phantom dependency），带来了结构不确定性

幽灵依赖主要是发生在某个包未在 package.json 中定义，但项目中依然可以引用到的情况

```json
{
  "name": "nuxt-demo",
  "version": "1.0.0",
  "description": "Serverless Nuxt.js Application Created By Serverless Framework",
  "author": "yangbo",
  "private": true,
  "dependencies": {
    "A": "^1.15.1",
    "C": "^2.14.3"
  }
}
```

在 js 文件中可以直接引用 A 包，也可以引用 B 包，因为 B 是 A 的依赖项，安装的时候，npm 会将依赖 B 平铺安装在 node_modules，因此可以引用它，导致的问题：

- 依赖不兼容
- 依赖缺失

### npm v5 扁平 + lock

v5 版本会在下载包时默认生成 package-lock.json 文件

package-lock.json 文件可以帮我们记录每一个包版本和其所依赖的其他包版本，这样在下一次安装的时候就可以通过这个文件来安装。package.json 和 package-lock.json 两者确保得到的 node_modules 目录结构，保证了安装依赖的确定性

- 一致性
- 兼容性

## yarn

### yarn v1

yarn 的出现是为了解决 npm v3 中存在的一些问题；yarn 生成的 node_modules 目录结构和 npm v5 是相同的，默认生成一个 yarn.lock（来解决依赖版本错乱的问题） 文件，只不过和 package-lock 的格式有所不同

#### yarn.lock vs package-lock.json

- 文件格式不同，npm v5 使用的是 json 格式，yarn 使用的是自定义格式
- package-lock.json 文件里记录的依赖的版本都是确定的，不会出现语义化版本范围符号(~ ^ \*)，而 yarn.lock 文件里仍然会出现语义化版本范围符号
- package-lock.json 文件内容更丰富，实现了更密集的锁文件，包括子依赖的提升信息
  - npm v5 只需要 package.lock 文件就可以确认 node_modules 目录结构
  - yarn.lock 无法确定顶层依赖，需要 package.json 和 yarn.lock 两个文件才能确定 node_modules 目录结构

#### 相较于npm的一些优点

- 缓存机制：
  - yarn使用一个全局的缓存目录来存储所有依赖项，而npm使用分散的缓存目录结构，
  - yarn拥有离线模式，当你执行 yarn install 时，首先会尝试使用本地缓存，如果之前已经缓存过这些依赖项，那么在离线模式下也能安装
- 并行安装：默认使用多线程来下载和安装依赖包
- 版本锁定更加稳定：yarn.lock的文件更加扁平化和准确，能够最大限度避免多个版本依赖问题

### yarn v2

推出了 Plug'n'Play 零安装模式，放弃了 node_modules，更加保证以来的可靠性，构建速度也得到了极大提升

Plug'n'Play 零安装模式特点如下

- 无需node_modules目录
  - 在 PnP 模式下,项目不再需要 node_modules 目录来存储依赖项
  - 相反,Yarn 会在项目根目录下生成一个 .pnp.js 文件,该文件包含了项目的依赖项信息和解析逻辑
  - 这样可以显著减少项目的磁盘空间占用,并避免了 node_modules 目录的嵌套和复杂性
- 快速安装和解析
  - 由于不需要创建 node_modules 目录和复制依赖项文件,PnP 模式下的依赖安装速度非常快
  - Yarn 会直接使用全局缓存中的依赖项,而不是将其复制到项目中
  - 在运行时,Yarn 会通过 .pnp.js 文件中的解析逻辑来定位和加载依赖项,无需进行文件系统的查找
- 确定性和可重复性
  - PnP 模式确保了项目的依赖项版本和结构的确定性
  - .pnp.js 文件包含了项目的完整依赖关系图,确保了在不同环境下项目的依赖项始终一致

## pnpm （performance npm）

pnpm 具有安装速度快、节约磁盘空间、安全性好等优点，它的出现也是为了解决 npm 和 yarn 存在的问题

### 基本使用

```shell
npm install -g pnpm

pnpm add vue
pnpm add vue -D
pnpm add -O [package] //保存到optionalDependencies

pnpm update

pnpm remove/uninstall

pnpm dlx // 从源中获取包而不将其安装为依赖项，热加载，并运行它公开的任何默认命令二进制文件。

pnpm link

pnpm store prune // 删除全局不再被引用的包
```

### 特性

- 本地安装包速度快
- 磁盘空间利用高效
- 安全性高 避免了 npm/yarn 非法访问依赖和二重身风险

### 性能提升

#### 硬链接（hard link）节约磁盘空间

硬链接可以理解为源文件的副本，使得用户可以通过不同的路径去找到某个文件，他和源文件大小一样但事实是不占用任何空间。pnpm 会在全局 store 目录里存储项目 node_modules 文件的硬链接。硬链接可以使得不同的项目可以从全局可寻址的存储仓库 store 寻找到同一个依赖，大大节省了磁盘空间

如果 A 是 B 的硬链接，则 A 的 indexNode（指针）与 B 的 indexNode 指向的是同一个。删除其中任何一个都不会影响另外一个的访问。作用：允许一个文件拥有多个有效路径，这样用户可以避免勿删

#### 符号链接（symbolic link）创建嵌套结构

pnpm 在引用依赖时通过符号链接去找对应磁盘目录（.pnpm）下的依赖地址
类似于桌面快捷方式。比如 A 是 B 的软链接（A 和 B 都是文件名），A 和 B 的 indexNode 不相同，但 A 中只是存放着 B 的路径，访问 A 时，系统会自动找到 B，删掉 A 与 B 没有影响，相反删掉 B，A 依然存在，但它的指向是一个无效链接

pnpm 在创建链接时会根据具体情况选择使用硬链接或软链接

- 如果依赖项与项目位于同一文件系统,pnpm 会优先创建硬链接,以获得更好的性能和直接访问
- 如果依赖项与项目位于不同的文件系统或分区,pnpm 会创建软链接,以允许跨文件系统的链接和访问

#### pnpm 局限性

- 忽略了 package-lock。npm 的锁文件旨在反映平铺的 node_modules 布局，但是 pnpm 默认创建隔离布局，无法由 npm 的锁文件格式反映出来，而是使用自身的锁文件 pnpm-locl.yaml
- 符号链接兼容性；存在一些场景符号链接不能适用比如 electron 应用、部署在 lambda 上的应用无法使用 pnpm
- 子依赖提升到统计的目录结构，虽然由于 node.js 的父目录上溯寻址逻辑，可以实现兼容。但对于类似 Egg、Webpack 的插件加载逻辑，在用到相对路径的地方，需要去适配
- 不同应用的依赖是硬链接到同一份文件，如果在调试时修改了文件，有可能会无意中影响到其他项目

## 其他

### semver规范

SemVer 是指语义版本规范（Semantic Versioning），用来约定包版本格式。它由三部分组成：主版本号、次版本号和修订版本号

- 主版本号MAJOR 当升级API无法进行向下兼容，会破坏现有代码功能的时候，必须升级主版本号
- 次版本号MINOR 添加了向下兼容的功能，可以升级次版本号。此时意味着增加了新功能，但是不影响现有功能使用
- 修订版本号PATCH 当进行向下兼容的bug修复，可以升级修订版本号。这意味着新版本只是对之前版本中的错误进行了修复，没有添加新的功能，且与之前的版本兼容
- 预发版本号和版本构建号TAG 通常使用连接符“-”和“+”来连接，比如：2.1.3-beat.1+build3.2