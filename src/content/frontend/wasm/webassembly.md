# Webassembly 和 Emscripten

## Webassembly

Webassembly(WASM)是一种用于基于堆栈的虚拟机的二进制指令格式，Wasm格式可以直接运行在浏览器上，其他编程语言通过编译器编译成Wasm从而实现在浏览器上运行

随着Web功能越来越强大，对性能要求也越来越高，Wasm可以让C/C++等更底层的语言直接运行在浏览器上从而获得和本地应用相接近的性能

除了C/C++还有非常多的语言支持编译成wasm，如Rust、Go、C#等，[这里](https://github.com/appcypher/awesome-wasm-langs)可以查看目前支持Wasm的语言和语言支持的进度

### 二进制格式

Wasm程序编译、传输和加载的单位称为模块。Wasm规范定义了二进制和文本两种模块格式。Wasm二进制格式，以.wasm为后缀，推荐的mime为application/wasm。Wasm采用了虚拟机/字节码技术，其他语言编译成Wasm字节码后由浏览器的虚拟机执行

Wasm的二进制文件以4字节的魔数和4字节的版本号开头，魔数为 0x00 0x61 0x73 0x6D（\0asm），版本号为 0x01 0x00 0x00 0x00 当前版本号为 1。Wasm 二进制格式采用小端方式编码数值，所以版本号 0x01 在最前面

Wasm 二进制文件除了前面 8 字节的魔数和版本号，后面的字节被划分为一个个段（section），每个段都有一个类型 ID，文件整体结构如下代码所示。

```css
magic = 0x00 0x61 0x73 0x6D
version = 0x01 0x00 0x00 0x00
1 type section        用到的所有函数类型
2 import section      所有的导入项
3 function section    索引表，内部函数所对应的签名索引
4 table section       定义的所有表
5 memory section      定义的所有内存
6 global section      定义的所有全局变量信息
7 export section      所有的导入项
8 start section       起始函数索引，加载模块后会自动执行起始函数
9 element section     表初始化数据
10 code section       存储内部函数的局部变量信息和字节码
11 data section       内存初始化数据
12 data count section data section 中的数据段数，为了简化单边验证
```

Wasm 规范一共定义了 13 种段，每种段都有一个 ID （0 到 12）。上面代码中没有写自定义段 0 custom section 自定义段主要给编译器等工具使用，里面可以存放调试信息，删除它并不会对文件执行造成任何影响。

除了自定义段，其他所有的段都最多只能出现一次，且必须按照段 ID 递增的顺序出现。有这个规则是因为 Wasm 设计为可以一遍完成解析、验证和编译，也就是可以边下载边分析。

### 文本格式

Wasm 文本格式（WebAssembly Text Format 主要是为了方便理解和分析 Wasm 模块，以 .wat 为后缀。可以使用 wabt（WebAssembly Binary Toolkit） 工具中的汇编器 wat2wasm 将 wat 转为 wasm，反汇编器 wasm2wat 将 wasm 转为 wat。

Wasm 文本格式是一个树的结构，每个节点用 ( 和 ) 括起来，( 后面跟着这个节点的类型，后面是它的子节点或属性，文本格式的根节点是 module，它的结构与二进制格式相似，如下代码所示。

```css
(module
    (type   ...)
    (import ...)
    (func   ...)
    (table  ...)
    (memory ...)
    (global ...)
    (export ...)
    (start  ...)
    (elem   ...)
    (data   ...)
)
```

上面代码中表示的是以 module 为根节点的树，它有 10 个子节点。

```Css
(module
  (type (func (param i32) (param i32) (result i32)))
  ;; 两个分号表示注释
)
```

上面代码中我们定义了一个函数签名，接收两个 i32 参数并返回一个 i32。每个参数都要声明它的类型，目前 Wasm 一共支持 i32 32位整数、i64 64位整数、f32 32位浮点数和 f64 64位浮点数这 4 种类型

我们还可以给上面函数声明一个标识符，也就是给函数取个名。

```css
(module
  (type $f1 (func (param i32 i32) (result i32)))
)
```

标识符以 $ 开头，而且参数类型一致的话可以将它们进行合并。

import 和 export 导入和导出域是 Wasm 与外部沟通的工具，import 导入外部的值，export 导出值给外部。导入和导出支持函数、表、内存和全局变量这 4 种类型。

```css
(module
  (import "imports" "imported_func" (func $log (param i32)))
  (func (export "exported_func")
    i32.const 13
    call $log
  )
)
```

### 编译为WASM

在生成wasm文件需要配置编译参数，常用的参数一般有 -O<level> 、-s WASM=1 、 -s EXPORTED_FUNCTIONS

- -O<level>: 设置优化级别，级别0表示不进行优化，级别1-3表示进行逐步增加的优化。
- -s WASM=1：指定编译为WebAssembly模块。
- -s EXPORTED_FUNCTIONS: 制定需要导出的函数，其值格式为函数1,函数2，这里需要强调的是函数都需要加上前缀下划线_
- -o <target>: 设置输出的文件格式，可以为.js、.mjs、.html、.wasm，例如当指定为-o out.html，则会输出out.js、out.html、out.wasm三个文件。
- -I <include_path>: 当emcc编译源文件时，会查找所包含的头文件，该参数可指定头文件的查找路径。
- --preload-file <file>: 预加载资源文件，如果c代码中有加载静态资源，则需要使用--preload-file arial.ttf将资源文件打包到*.data。
- -s USE_FREETYPE=1: 启动freeType字体库，emcc自动将freetype库打包至wasm文件。
- -g: 编译时添加DWARF调试信息到WebAssembly文件。
- [其他参数](https://emscripten.org/docs/tools_reference/emcc.html#emccdoc)

### wasm常用函数以及属性如下所示

- _malloc 分配指定长度的内存，返回指针位置
- _free 释放内存
- cwrap 使用native javascript 方法映射c或其他语言函数，包括参数的定义
- setValue 设置值到内存中，格式为setValue(ptr, value, type[, noSafe]), type为LLVM IR 类型，可以是i8, i16, i32, i64, float, double其中一种
- getValue 从指定内存读取值，格式为getValue(ptr, type[, noSafe])，type和setValue一致。当在某个指针ptr连续存储多个值时，可以使用getValue读取，例如ptr连续存储with、height、channels三个值，则可通过以下方式读取
- writeArrayToMemory: 格式为writeArrayToMemory(array, buffer), 将array数组写入到指定内存buffer。例如将图像数据通过writeArrayToMemory写入到heap内存, c代码可通过input指针从内存读取图像数据。Uint8Array为8位无符号数组，可存储图像数据[0, 255]。
- HEAPU32: Emscripten使用类型化数组分配内存，除了HEAPU32还包含HEAP8、HEAPU8、HEAP16、HEAPU16等等。当图像添加完水印，输出output、outoutLength两个指针，分别指针图像数据、长度值，其值可通过以下方式读取到javascript中

## Emscripten

Emscripten是跨平台的开源编译器工具集，它可以将C/C++代码编译成WebAssembly、js和HTML文件，编译后的代码可在现代Web浏览器中直接运行

HTML文件用来展示代码运行结果，js文件用于加载和运行Wasm模块，js文件是必须的，因为目前Wasm中并不能直接调用Web API，JS 文件会将 Wasm 文件中用到的 API 传递给 Wasm 文件

Emscripten通过将这些语言的源代码编译成LLVM，然后再通过LLVM工具链将IR编译成WebAssembly或js代码

### LLVM

Low Level Virtual Machine 是一个开源的编译器基础设施，它包括一些列的编译器工具、库、技术，用于优化代码的生成、静态分析、调试和代码转换等

```shell
# 下载 emsdk
git clone https://github.com/emscripten-core/emsdk.git
# 进入目录
cd emsdk
# 下载和安装最新 SDK
./emsdk install latest
# 激活最新版本 SDK
./emsdk activate latest
# 添加执行路径到 PATH 和环境变量到当前终端
source ./emsdk_env.sh

// 在 Windows下，使用 emsdk 代替 ./emsdk 命令，emsdk_env.bat 代替 source ./emsdk_env.sh 命令。
```

我们可以通过上方代码下载安装 emsdk，emsdk 中有多个工具，最关键的就是 emcc，它用于将 C/C++ 代码转为 Wasm 和 JS 文件，下面让我们将 C 代码编译成 Wasm。

```C++
#include <stdio.h>
int main() {
  printf("hello, world!\n");
  return 0;
}
```

编写上面 C 代码后，就可以执行 emcc ./hello_world.c，它会生成一个 a.out.wasm 和 a.out.js 文件，执行 a.out.js 就可以看到在控制台打印的 hello, world! 字符串。

### 在js中调用C函数

```C++
#include <stdio.h>
#include <emscripten/emscripten.h>
int main() {
  printf("hello, world!\n");
  return 0;
}
EMSCRIPTEN_KEEPALIVE 
int add(int a, int b) {
    return a + b;
}
```

在 add 方法前面加上 EMSCRIPTEN_KEEPALIVE 是防止 LLVM 把这个方法当作死码删除了（用来标记需要导出的函数）。然后就可以使用 emcc 进行编译了

```shell
emcc ./hello_world.c -o index.html -s EXPORTED_FUNCTIONS=_main,_add -s EXPORTED_RUNTIME_METHODS=ccall,cwrap
```

这里的 -o index.html 是指定输出的文件，.html 后缀会输出同名的 html，js 和 wasm 文件，.js 后缀会输出同名的 js 和 wasm 文件，.wasm 后缀会输出一个 wasm 文件。

-s 用于设置 emcc 的编译参数，EXPORTED_FUNCTIONS=_main,_add 表示对外暴露出 _main 和 _add 方法，方法名需要加上 _。

EXPORTED_RUNTIME_METHODS=ccall,cwrap 表示暴露出运行时的 ccall 和 cwrap 方法。

然后就可以本地起一个静态服务器访问 index.html 了。JS 胶水文件会暴露出一个 Module 对象，通过这个对象我们可以访问到 C 暴露出来的方法，比如通过 Module._add 可以调用 C 的 add 方法。

另外我们还可以使用 Module.ccall 和 Module.cwrap 来调用 C 的方法，这两个方法是 emscripten 的内置方法，通过这两个方法调用可以不用手动通过 EXPORTED_FUNCTIONS 导出特定方法。

ccall 的签名为 ccall(函数名, 返回类型, 参数类型, 参数)，它会直接调用指定函数名的函数。

cwrap 的签名为 cwrap(函数名, 返回类型, 参数类型)，它不会调用 C 函数，而是返回一个 JS 函数，通过这个 JS 函数可以调用 C 函数。
