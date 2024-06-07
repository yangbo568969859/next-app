# WebAssembly 常用开发语言和工具链

## WebAssembly 语言生态介绍

### C/C++

C/C++ 最常用编译工具链之一的 LLVM 已经把 WebAssembly 添加为受支持的后端

社区发展了 WebAssembly System Interface 标准（简称 WASI，非 WebAssembly Proposal）。基于这套标准，WebAssembly 的运行环境能够获取系统 IO 等能力，不再依赖宿主语言，变成了一个独立的能够运行在非 Web 端的产品

### Rust

Rust 实现的 wasmtime 虚拟机就是最重量级的 WebAssembly 高性能虚拟机之一

Rust 编译器借助 LLVM 的能力生成 WebAssembly 产物，因此 WebAssembly 也是 Rust 的目标语言之一。同时，Rust 兼容 C/C++ 的内存模型，无 GC，因此生成的 WebAssembly 产物体积小巧性能表现良好，与 C/C++ 生成的 WebAssembly 模块能够无缝衔接

### Go

社区也存在 Go 实现的大量开源项目，例如 wazero 就是 Go 实现的高性能 WebAssembly 虚拟机

Go 语言在 WebAssembly 社区也有令人诟病的几个问题。首先就是 WASI 支持，虽然 Go 在服务端发力，但是由于 Go 的 WebAssembly 不支持 WASI，因而 Go 的 WebAssembly 产物不能脱离 Web 环境，这可能会阻碍 Go 的 WebAssembly 社区在服务端的发展。其次，Go 的 GC 依赖使得 WebAssembly 产物体积严重膨胀，难以做到 Web 端所需的轻量化

### AssemblyScript

AssemblyScript 使用 TypesScript 中的部分语法并做了部分修改，是一门专为 WebAssembly 服务的语言。WebAssembly 最初就是为了前端场景设计的，AssemblyScript 的语法让前端开发者能够很自然地写出可编译为 WebAssembly 的程序。因此，在前端社区中，越来越多的开发者选择 AssemblyScript 开发 WebAssembly 项目

AssemblyScript 最初就是为了 Web 端设计的，因此它不支持 WASI 标准。此外，AssemblyScript 生成的 WebAssembly 包含了 GC，产物大小会比 C/C++ 生成的产物大不少。AssemblyScript 底层也借用了 LLVM 的能力，它将类 TypeScript 的语言解析成 AST，生成 LLVM IR，最后生成 WebAssembly 产物

AssemblyScript 虽然方便了前端程序员编写 WebAssembly 项目，但是其内置的部分库，以及生成的 WebAssembly 稍显臃肿，优化也没有做到最优。例如，导入导出部分生成的代码进行了内存拷贝、pow 库函数生成了大量冗余代码，这些都有待优化

### Javascript

JavaScript 是前端领域必不可少的语言，大量的 JavaScript 项目运行在各类平台，浏览器、移动端 APP、PC 桌面端都能见到它的身影。WebAssembly 作为 Web 端的希望之星，设计之初就能够和 JavaScript 交互使用。为此，WebAssembly 自有一套 JS-API 标准，用于规范 JavaScript 和 WebAssembly 互操作

然而，由于 JavaScript 语言特性，它难以生成完备的 WebAssembly 产物。大量 JavaScript 项目无法无缝迁移到 WebAssembly 上。当然，想让 JavaScript 跑在 WebAssembly 上也不是毫无办法。生产环境中已经存在将 JavaScript 引擎编译到 WebAssembly，运行在 WebAssembly 引擎中的例子。这种场景直觉上没什么应用前景，但实际上他与 Serverless 和容器化场景不谋而合。在服务端场景中，这种设计让用户能够继续编写 JavaScript 代码，服务端则能够获得较少的性能损失，获得更小的体积和更快的启动速度，可以说是双赢

## WebAssembly 工具生态

### Emscripten

Emscripten创建的想法来自于 将C/C++ 编译生成的LLVM IR翻译成JS，发明了一种Relooper算法，这种算法能将任意控制流图转为结构化的控制流图

后来Emscripten加入了对WebAssembly的支持，其功能变成了将C/C++或是其它基于LLVM IR的语言的项目工程编译到WebAssembly。任何可移植的 C/C++ 库都可以被 Emscripten 编译成 WebAssembly，例如图形库、声音库等。Emscripten 主要在 Emcc 中使用 Clang + LLVM 将目标代码编译成 WebAssembly。同时，Emcc 还会生成包含 API 的 JavaScript 代码，这些代码能够在 Node.js 里运行，或者能够被 HTML 包含，在浏览器里面运行

#### 库支持

为了支持 C/C++ 标准库，Emscripten 在 musl libc 和 LLVM libcxx 库的基础上做了定制化，实现了 WASI 标准接口，提供了大部分的 C/C++ 标准库能力。此外，Emscripten 提供了部分他们适配过的常用库，包括 socket 库、html 库、gl 库等。这些库能力的支持让 Emscripten 能够将大部分 C/C++ 工程无缝迁移到 WebAssembly 上，大大拓展了 WebAssembly 的生态

然而，尽管 Emscripten 做了大量的工作，它仍然不能完美地将 C/C++ 工程迁移到 WebAssembly。下面将会简要介绍部分局限性

- 多线程 WebAssembly的多线程支持早就有了提案，但是截至目前，还未完成。因此，即使Emscripten移植了pthread库，这种移植依然处于类似用户态的模拟多线程，并非原生的多线程。模拟的多线程具有较大的开销，在生产环境种性能表现不好，应用价值也不大
- 计时 由于WebAssembly的隔离性，它不能直接访问硬件资源，因此WebAssembly无法直接获取硬件能力，例如CPU时钟，如果想在WebAssembly中使用C库的能力比如clock_t，只能使用模拟的方式，误差大精度低
- 库导入 由于WebAssembly是独立的二进制格式，Emscripten无法将第三方静态或者动态库与 WebAssembly 产物进行连接。因此，如果想要移植现有的 C/C++ 项目，必须保证项目中不依赖现成的静动态库，必须全源码编译

Emscripten 底层依然使用的是 clang + wasm-ld 的能力将工程编译成 WebAssembly 产物。此外，在 LLVM 的基础上，Emscripten 做了大量移植工作，提供了更多样的选项。为了实现这些能力，Emscripten 开发了 emcc 项目

emcc 基于 clang，提供了大量额外的编译选项。例如，emcc 能让用户选择是否编译 WASI 产物，选择需要导出到外部的函数，选择是否生成 JavaScript 和 HTML 胶水代码；并且，emcc 会根据用户的编译选项，自动化地选择依赖的库，生成额外的编译和链接命令，省去了大量手动配置的时间

除了 clang 和 wasm-ld 的优化能力，emcc 还引入了 Closure Compiler 和 Binaryen。前者是一个 JavaScript to JavaScript 优化器，优化 Emscripten 生成的 JavaScript 代码；后者则是一个独立的 WebAssembly to WebAssembly 优化器，提供了 LLVM 以外的多个优化 Pass

### Binaryen

Binaryen 的目的是让编译到 WebAssembly 的工作变得 简单，快速，有效

- 简单 Binaryen在一个头文件中有一个简单的C API，也可以从Js中使用。它接受类似 WebAssembly 的形式的输入，但也接受通用控制流图
- 快速 Binaryen 的内部 IR 使用紧凑的数据结构，设计为完全并行的代码生成和优化，使用所有可用的 CPU 内核。Binaryen 的 IR 也非常容易和快速地编译为 WebAssembly，因为它本质上是 WebAssembly 的一个子集
- 有效 相比于其他通用编译器，Binaryen 更关注与 WebAssembly 特性强相关的优化。Binaryen 的优化器有许多途径可以提高运行速度，减小产物体积。其强大的优化能力足以使 Binaryen 作为编译器后端使用

Binaryen 可以理解为 WebAssembly 编译器后端 + WebAssembly 编译工具链

### wasi-sdk

wasi-sdk 可以看作是魔改过后的 LLVM，添加了 WASI 的支持。使用方式和 clang 编译 C/C++ 项目基本一致，可以直接使用 clang 命令。wasi-sdk 中，libc 的实现和 Emscripten 相似，都是使用了开源的 musl libc 库，进行了部分修改以适配 WASI。在 C/C++ 编写的 WebAssembly 工程中，可以使用 wasi-sdk 替代 LLVM 作为默认编译工具链。

同样的 wasi-sdk 也存在和 Emscripten 相似的局限性，包括多线程、time 能力等都是缺失的

### TingGo

TinyGo 是一个轻量级的 Go 编译器，主要用于嵌入式系统、WebAssembly 和命令行等较为轻量级的环境中。TinyGo 复用了 Go language tools 以及 LLVM，提供额外的编译 Go 的方法。
目前在服务端场景上，有部分 Go WebAssembly Serverless 函数服务，背后使用了 TinyGo 做支撑

### wabt

wabt 是一个工具链集合，其中包括 WebAssembly 的反汇编工具、解释器、编译器、验证工具等。下面简单对几个常用工具进行介绍

- wasm2wat 和 wat2wasm
- wasm2c

### wasm-pack

wasm-pack 工具由 Rust / WebAssembly 工作组开发维护，并且是现在最为活跃的 WebAssembly 应用开发工具。它支持将代码打包成 npm 模块，并且随附了 Webpack 插件，可以轻松地与已有的 JavaScript 应用结合

### wasm-bindgen

wasm-bindgen[19] 让 WebAssembly 模块和 JavaScript 之间能够进行交互。
wasm-bindgen 允许 JavaScript / WebAssembly 通过字符串、JavaScript 对象、类等进行通信。运用 wasm-bindgen 可以在 Rust 中定义 JavaScript 类或从 JavaScript 获取一个字符串或返回一个字符串给 JavaScript。目前这个工具主要关注 Rust 生态，但底层原理与语言无关。开发团队希望随着时间的推移，这个工具可以稳定并扩展到 C/C ++ 等语言生态中。功能包括：

- 将 JavaScript 能力导入到 Rust 中, 比如 DOM 操作，控制台日志记录或者性能监控。
- 导出 Rust 功能到 JavaScript，如类，函数等。
- 使用丰富的类型，如字符串，数字，类，闭包和对象，而不是简单的 u32 和浮点数。
- 自动为 JavaScript 使用的 Rust 代码生成 TypeScript 绑定。

配合 wasm-pack，用户可以在 web 上运行 Rust，将其作为一个更大的应用程序的一部分发布，在 NPM 上发布 Rust 的 WebAssembly 产物

| 语言 | 工具 | 介绍 |
| --- | ---- | ------ |
| C/C++ | Emscripten | Emscripten提供一个基于LLVM的C/C++ to WebAssembly编译器，该项目提供了完成的工程级的构建配置，支持搭建复杂的C/C++ WebAssembly工程，包括：Clang编译器，WASI库和其他常用库，自定义导出函数，生成Js胶水代码，CMake配置 |
| C/C++ | wasi-sdk | wasi-sdk提供了一个基于LLVM的C/C++ to WebAssembly编译器。该项目仅仅提供额外的WASI库，其它编译功能主要基于LLVM能力，可以看做是支持了 WASI 的 LLVM |
| Go | TinyGo | TinyGo 是一个基于 LLVM 的轻量级 Go 编译器，可以在嵌入式场景或者是 WebAssembly 场景提供编译能力 |
| Rust | wasm-pack | wasm-pack 是一个将 WebAssembly 打包成 npm 模块的工具，让现有工程和 JavaScript 结合 |
| Rust | wasm-bindgen | wasm-bindgen 工具是一个致力于 WebAssembly 与 JavaScript 交互的工具，目前主要支持 Rust 生态场景。它能够将 JavaScript 的能力导入到 Rust 中或者将 Rust 相关能力传入 JavaScript 中。wasm-bindgen 会自动生成绑定胶水代码。 |
| AssemblyScript | AssemblyScript | AssemblyScript 语言基于 TypeScript，提供了一套完整的编译工具链，能够将类 TypeScript 的 AssemblelyScript 语言编译到 WebAssembly，其中内置了大量的常用库 |
| N/A | Binaryen | Binaryen 是一个通用的语言无关的 WebAssembly 优化器，提供了 LLVM 外的额外优化 Pass，能够从 WebAssembly 生成体积更小性能更好的 WebAssembly 代码 |
| N/A | wabt | Wabt 是一个通用 WebAssembly 工具集合，能够提供常用的 WebAssembly 工具，包括 WebAssembly 文本二进制格式的转换，简单的符合标准的解释器等等 |
