# go 基础

## 创建main.go文件

## 安装多个 Go 版本

### 方法一：重新设置PATH环境变量

将不同版本的Go安装在不同路径下，然后将Go二进制文件所在路径加入PATH环境变量中；每次需要重新设置PATH环境变量

### 方法二：go get 命令

```bash
go get golang.org/dl/go1.15.13
```

这个命令会将名为go1.15.13的可执行文件安装到$HOME/go/bin目录下，是Go1.15.13版本的专用下载器，再执行

```bash
go1.15.13 download
```

下载安装目录，使用带有版本号的go命令

```bash
go1.15.13 version
go1.15.13 env GOROOT
```

### 方法三：go get 命令安装非稳定版本

除了Go团队发布的稳定版本，我们还可以通过go get方法安装Go团队正在开发的非稳定版本（Unstable Version），克服网络问题的情况下，安装步骤和方法二一样

```bash
go get golang.org/dl/go1.17beta1
go1.17beta1 download
go1.17beta1 version
```

```bash
go get golang.org/dl/gotip
gotip download
```

## Go配置项

<table><tbody>
  <tr>
    <th>名称</th><th>作用</th><th>值</th>
  </tr>
  <tr>
    <td>GOARCH</td>
    <td>用于指示Go编译器生成代码所针对的CPU架构</td>
    <td>主要值是AMD64、Arm，默认值是本机的CPU架构</td>
  </tr>
  <tr>
    <td>GOOS</td>
    <td>用于指示Go编译器生成代码所针对的操作系统</td>
    <td>主要值是Linux、Darwin、Windows</td>
  </tr>
  <tr>
    <td>GO111MODULE</td>
    <td>它决定了当前使用的构建模式是传统的GOPATH模式还是Go Module模式</td>
    <td>Go1.16版本Go Module构建模式默认开启</td>
  </tr>
  <tr>
    <td>GOCACHE</td>
    <td>用于指示存储构建结果缓存路径，这些缓存可能会被后续的构建所使用</td>
    <td>不同操作系统，GOCACHE有不同的值，Windows使用go env GOCACHE值为USER\AppData\Local\go-build</td>
  </tr>
  <tr>
    <td>GOMODCACHE</td>
    <td>用于指示存放Go Module的路径</td>
    <td>在不同操作系统上，GOMODCACHE有不同的值，，Windows使用go env GOCACHE值为USER\go\pkg\mod</td>
  </tr>
  <tr>
    <td>GOPROXY</td>
    <td>用来配置Go Module proxy服务</td>
    <td>默认值为 https://proxy.golang.org.direct，中国大陆地区，一般设置为大陆地区提供的module proxy以获取加速</td>
  </tr>
  <tr>
    <td>GOPATH</td>
    <td>传统GOPATH构建模式下，用于指示Go包搜索路径的环境变量，在Go module机制启用之前是Go核心配置项。Go1.8版本之前需要手工配置，Go1.8版本引入了默认的GOPATH</td>
    <td></td>
  </tr>
  <tr>
    <td>GOROOT</td>
    <td>提示GO安装路径</td>
    <td></td>
  </tr>
</table>

## 依赖包下载

- 对于main.go中import的包需要go module来下载
  - 初始化go.mod

  ```shell
    go mod init github.com/bigwhite/hellomodule
  ```

  - 添加包方式
    - go.mod 手动添加
    - 执行 go mod tidy 命令，让 Go 工具自动添加
  - build
    - go build main.go
  - 调试
    - go run main.go

- Go包是Go语言的基本组成单位，一个Go程序就是一组包的集合，所有Go代码都位于包中
- Go源码可以导入其他Go包，并使用其中的导出语法元素，包括类型、变量、函数、方法等，而且，main函数是整个Go应用的入口函数
- Go源码需要先编译，再分发和运行。如果是单Go源文件的情况，我们可以直接使用go build命令加Go源文件名的方式编译。不过，复杂Go项目，需要在Go Module的帮助下完成项目构建

## Go项目布局

### 演进一 Go1.4版本删除pkg这一中间层目录并引入internal目录

- 删除src/pkg/xxx，直接使用src/xxx，Go预研项目源码深度减少一层，方便阅读和探索Go项目源码
- 新增internal包机制，一个Go项目里的internal目录下的Go包，只能被本项目内部的包导入

### 演进二 Go1.6版本新增vender目录

主要是解决Go包依赖管理的问题。增加了vender构建机制，也就是可以不在GOPATH环境变量下搜索依赖包，而在vender目录查找对应依赖包

vender机制和目录的引入，让Go项目第一次具备了可重现构建（Reproducible Build）能力

### 演进三 Go1.13版本引入go.mod和go.sum

引入Go Module构建机制，也就是在项目移入go.MOD以及在go.mod中明确项目所依赖的第三方包和版本，脱离GOPATH束缚，实现精准的可重现构建

### 典型结构布局

```
exe-layout
├── cmd/
│   ├── app1/
│   │   └── main.go
│   └── app2/
│       └── main.go
├── go.mod
├── go.sum
├── internal/
│   ├── pkga/
│   │   └── pkg_a.go
│   └── pkgb/
│       └── pkg_b.go
├── pkg1/
│   └── pkg1.go
├── pkg2/
│   └── pkg2.go
└── vendor/
```

- cmd 目录 就是存放项目要编译构建的可执行文件对应main包的源文件，如果你的项目中有多个可执行文件需要构建，每个可执行文件的main包单独放在一个子目录下
- pkgN 这是一个存放项目自身要使用的，同样也是可执行文件对应的main包所要依赖的库文件，同事这些目录下的包还可以被外部项目引用
- internal 目录：存放仅项目内部引用的 Go 包，这些包无法被项目之外引用；
- go.mod和go.sum，他们是Go语言包依赖管理所使用的的配置文件
- vendor 可选目录 用于在项目本地缓存特定版本依赖包的机制

### Go库项目的典型结构布局

```
lib-layout
├── go.mod
├── internal/
│   ├── pkga/
│   │   └── pkg_a.go
│   └── pkgb/
│       └── pkg_b.go
├── pkg1/
│   └── pkg1.go
└── pkg2/
    └── pkg2.go
```

### 对于以生产可执行程序为目的的Go项目，典型结构分五部分

- 放在项目顶层的Go Module相关文件，包括go.mod和go.sum
- cmd目录：存放项目要编译构建的可执行文件所对应的main包的源码文件
- 项目包目录：每个项目下的非main包都平铺在项目根目录下，每个目录对应一个Go包
- internal目录：存放仅项目内部引用的Go包，这些包无法被项目之外引用
- vender目录：可选目录，为了兼容Go1.5引入Vender构建模式而存在的。这个目录下的内容均由Go命令自动维护，不需要开发者手工干预

## Go 构建模式演化

### GOPATH

这种构建模式下，Go编译器可以自己本地GOPATH环境变量配置的路径下，搜寻Go程序依赖的第三方包，如果存在，就使用本地包进行编译，不存在会报错

GOPATH构建模式下，Go编译器实质上并没有关注Go项目所依赖的第三方包的版本

### vender

vender机制本质上就是在Go项目的某个特定目录，将项目所有依赖包缓存起来，这个特定目录就是vender

Go编译器会优先感知和使用vender目录下缓存的第三方包，而不是GOPATH环境变量所配置路径下的第三方包版本

使用vender机制管理第三方依赖包，最佳实践就是将vender目录一起提交到代码仓库中

要想启用vender机制，Go项目必须位于GOPATH环境变量配置的某个路径的src目录下面

### Go Module

一个Go Module是一个Go包的集合。module是有版本的，所以module下的包也就有了版本属性

```shell
go mod init // 创建go.mod文件，将当前项目变成一个Go Module
go mod tidy // 自动更新当前module的依赖信息
go build    // 执行新的modle构建
```

Go Module还支持代理服务加速第三方依赖的下载 GOPROXY=<https://proxy.golang.org,direct>

go mod tidy下载的依赖module会放置在本地module缓存路径下，可以通过GOMODCACHE环境变量，自定义缓存路径

执行go mod tidy后，还会创建一个新的文件 go.sum 存放了特定版本module内容的哈希值

## 深入Go Module构建模式

### 语义导入版本（Semantic Import Versioning）

- 由前缀v和一个满足语义版本的版本号组成 vX.Y.X
- 语义版本分为3部分：主版本号（major），次版本号（minor），补丁版本号（patch）

### 最小版本选择（Minimal Version Selection）

- Go 会在该项目依赖项的所有版本中，选出符合项目整体要求的“最小版本”

### Go 各版本构建模式机制和切换

通过设置GO111MODULE在GOPATH和Go Module两种模式切换

## Go Moudle 操作

### 为当前module添加依赖

```sh
go get github.com/google/uuid
```

或使用 go mod tidy

### 包版本降级 / 升级

- 查询包的多个发布版本
  - go list -m -versions github.com/sirupsen/logrus
- 执行带有版本号的 go get 命令
  - go get github.com/sirupsen/logrus@v1.7.0 该命令也可以将项目依赖包降级
- go mod tidy 帮助降级
  - go mod edit -require=github.com/sirupsen/logrus@v1.7.0
  - go mod tidy

### 添加一个主版本号大于 1 的依赖

在声明它的导入路径基础上，加上版本号信息

```sh
import github.com/user/repo/v2/xxx
```

### 升级依赖版本到一个不兼容版本

### 移除一个依赖

列出当前module的所有依赖

```sh
go list -m all
```

想要彻底移除go.mod中的依赖项，仅从源码删除对依赖项的导入语句是不够的，
正确做法是使用go mod tidy命令，将这个依赖彻底从Go Module构建上下文中清除，go mod tidy会自动分析源码依赖，而且将不再使用的依赖从go.mod和go.sum中移除

### 特殊情况：使用vender

在一些不方便访问外部网络，并且对Go应用构建性能敏感的环境，Go提供了可以快速建立和更新vender的命令

```sh
go mod vender
tree -LF 2 vender
```

想要基于vender构建，而不是基于本地缓存的Go Module构建

```sh
go build -mod=vender
```

## Go程序的执行次序

### main.main函数：Go应用的入口函数

Go要求：可执行程序的main包必须定义main函数，否则Go编译器会报错

### init函数：Go包的初始化函数

- 无需手工显示调用init函数
- Go包可以拥有多个init函数
- 按init次序顺序执行
- init函数在整个Go程序生命周期内仅会被执行一次

### init函数用途

- 重置包级变量值
- 实现对包级变量的复杂初始化
- init函数中实现“注册模式”

## Go包的初始化次序

- 依赖包按照 "深度优先" 的次序进行初始化
- 每个包内按以 常量 -> 变量 -> init函数 的顺序进行初始化
- 包内的多个init函数按出现的次序进行自动调用

### Go env 环境变量修改

go env -w GOARCH=amd64 GOOS=windows
go env -w GOARCH=wasm GOOS=js
