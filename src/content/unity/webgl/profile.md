# 基于Unity Webgl的内存分析对wasm的理解

本文主要介绍基于 Unity Webgl 打包之后的 wasm 产物如何做内存分析

Unity WebGL游戏通常比普通H5(JS)游戏占用更大的内存，内存超出阈值时非常容易造成内存不足，因此内存分析变得非常重要

在过去Unity主要使用emscripten将代码编译为asm.js，现在主要使用emscripten将代码编译为WebAssembly，本文主要分析后者编译后的内存相关分析

## Unity WebGL内存结构

Unity WebGL内存结构可参考
![unity内存](./images/memory.png)

[参考官方](https://blog.unity.com/engine-platform/understanding-memory-in-unity-webgl)
[官方博客](https://blog.unity.com/engine-platform/unity-webgl-memory-the-heap)

Unity WebGl是以WebGl + WebAssembly技术为基础的应用，游戏的内存分配完全是由浏览器分配的

Unity WebGl的内存占用主要分为以下几个部分

- DOM + Canvas：导出的Unity WebGl是以Unity提供的模板或自定义WebGl模板中的index.html为入口的，我们可以在其对其进行改造，比如新增一些web端的js库、Canvas等操作，DOM是浏览器分配内存，Canvas画布与设备物理分辨率有关
- Unity Heap：托管堆、本机堆和原生插件底层内存。例如：游戏运行时逻辑分配的C#对象、Unity管理的AB包资源和场景等内存(所有 Unity 引擎运行时对象。这些包括托管和原生对象、加载的资源、场景和着色器)
- WASM编译：代码编译和运行时指令优化产生的内存
- GPU内存 纹理或模型Upload GPU之后的显存占用
- 音频 Unity将音频传递给浏览器后，播放音频时占用的内存
- 其他

## Webassembly 和 Emscripten

### Webassembly 简单介绍

Webassembly(WASM)是一种用于基于堆栈的虚拟机的二进制指令格式，Wasm 格式可以直接运行在浏览器上，其他编程语言通过编译器编译成 Wasm 从而实现在浏览器上运行

随着 Web 功能越来越强大，对性能要求也越来越高，Wasm 可以让 C/C++等更底层的语言直接运行在浏览器上从而获得和本地应用相接近的性能

除了 C/C++还有非常多的语言支持编译成 wasm，如 Rust、Go、C#等，[这里](https://github.com/appcypher/awesome-wasm-langs)可以查看目前支持 Wasm 的语言和语言支持的进度

#### 二进制格式

#### 文本格式

### Emscripten

Emscripten 是跨平台的开源编译器工具集，它可以将 C/C++代码编译成 WebAssembly、js 和 HTML 文件，编译后的代码可在现代 Web 浏览器中直接运行

js 文件用于加载和运行 Wasm 模块，js 文件是必须的，因为目前 Wasm 中并不能直接调用 Web API，JS 文件会将 Wasm 文件中用到的 API 传递给 Wasm 文件

Emscripten 通过将这些语言的源代码编译成 LLVM，然后再通过 LLVM 工具链将 IR 编译成 WebAssembly 或 js 代码

### 将C代码编译为WASM

在生成wasm文件需要配置编译参数，常用的参数一般有-O<level>、-s WASM=1、-s EXPORTED_FUNCTIONS等等

- -O<level>: 设置优化级别，级别0表示不进行优化，级别1-3表示进行逐步增加的优化。
- -s ALLOW_MEMORY_GROWTH=1 可以在运行时扩大内存容量的模式；当编译目标是asm.js时，可变内存模式会影响性能；当编译目标是wasm时，使用可变内存模式非常高效，不会影响运行性能
- -s WASM=1：指定编译为WebAssembly模块。
- -s EXPORTED_FUNCTIONS: 制定需要导出的函数，其值格式为函数1,函数2，这里需要强调的是函数都需要加上前缀下划线_
- -o <target>: 设置输出的文件格式，可以为.js、.mjs、.html、.wasm，例如当指定为-o out.html，则会输出out.js、out.html、out.wasm三个文件。
- -I <include_path>: 当emcc编译源文件时，会查找所包含的头文件，该参数可指定头文件的查找路径。
- --preload-file <file>: 预加载资源文件，如果c代码中有加载静态资源，则需要使用--preload-file arial.ttf将资源文件打包到*.data。
- --profiling-funcs 将为 WASM 文件中的类和方法保留一些可读的名称，以便您在使用浏览器开发工具时能够跟踪代码
- --memoryprofiler 将内存分配跟踪器嵌入到生成的页面上。 使用它来分析 Emscripten HEAP 的应用程序使用情况。
- 可在[官网](https://emscripten.org/docs/tools_reference/emcc.html)或[github](https://github.com/emscripten-core/emscripten/blob/main/src/settings.js)查看全部参数

下面指令将watermark.c文件编译为watermark.wasm文件，使用*.js格式，输出的文件包括：watermark.js、watermark.data、watermark.wams。使用EXPORTED_RUNTIME_METHODS导出运行时函数，使用EXPORTED_FUNCTIONS导出功能函数，并且将内存跟踪器嵌入到生成的页面上

```shell
emcc -O3 -s USE_FRETYPE=1 -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s EXPORTED_FUNCTIONS=_sbrk,_emscripten_stack_get_base,_emscripten_stack_get_end 
--memoryprofiler --profiling-funcs
```

### 基于 Emscripten 的内存分析

#### 内存模型的类型访问器

Emscripten内存表示使用类型化数组缓冲区 ( ArrayBuffer) 来表示内存，通过不同的视图可以访问不同的类型。下面列出了访问不同类型内存的视图

- HEAP8    8 位有符号内存
- HEAP16   16位有符号内存
- HEAP32   32位有符号内存
- HEAPU8   8 位无符号内存
- HEAPU16  16位无符号内存
- HEAPU32  32位无符号内存
- HEAPF32  32 位浮点内存
- HEAPF64  64 位浮点内存

#### UnityHeap

- 托管堆 C#对象托管对象、游戏状态
- 本机堆 Unity Native产生，引擎内部对象
- 原生插件底层内存 第三方插件（如lua）直接调用malloc产生

Unity引擎视角内存

- 托管堆的内存预留内存 System.GC.GetTotalMemory(false);
- 托管堆当前的内存使用量
- 本机堆内存分配峰值
- 本机堆空闲内存值
- 本机堆当前内存使用量

如何得到这些内存数据呢，Unity引擎视角得内存数据主要依托于 Profiler 来得到

```C#
// Profiler.cs
// 摘要
// 返回托管内存的保留空间的大小
// Returns the size of the reserved space for managed-memory.
public static extern long GetMonoHeapSizeLong();
// 摘要
// 获取为活动对象和非收集对象分配的托管内存
// Gets the allocated managed memory for live objects and non-collected objects.
public static extern long GetMonoUsedSizeLong();
// 摘要
// Unity 保留的总内存
// The total memory Unity has reserved.
public static extern long GetTotalReservedMemoryLong();
// 摘要:
//  Unity会在池中分配内存，以供Unity需要分配内存时使用，该函数返回这些池中未使用的内存量
//  Unity allocates memory in pools for usage when unity needs to allocate memory.
//  This function returns the amount of unused memory in these pools.
public static extern long GetTotalUnusedReservedMemoryLong();
// 摘要
// Unity 中内部分配器分配的总内存。 Unity从系统中保留大量内存； 这包括纹理所需内存的两倍，因为 Unity 在 CPU 和 GPU 上保留每个纹理的副本。 此函数返回这些池中已使用的内存量。
// The total memory allocated by the internal allocators in Unity. Unity reserves
// large pools of memory from the system; this includes double the required memory
// for textures becuase Unity keeps a copy of each texture on both the CPU and GPU.
// This function returns the amount of used memory in those pools.
public static extern long GetTotalAllocatedMemoryLong();
```

底层分配器视角

- UnityHeap总预分配内存大小
- UnityHeap使用上限
- UnityHeap真实使用量
- UnityHeap预留量

底层分配器视角得内存主要是基于WASM的

通过UnityWebGl暴露的 PlayerSettings.WebGL.emscriptenArgs 参数，我们可以在C#转ill2cpp再编译为WASM的时候增加编译参数来暴露底层代码的函数获取内存相关的数据
调用 emscripten 的 emcc 编译器时的命令行参数

```C#
PlayerSettings.WebGL.emscriptenArgs += " -s EXPORTED_FUNCTIONS=_sbrk,_emscripten_stack_get_base,_emscripten_stack_get_end";

PlayerSettings.WebGL.emscriptenArgs += $" -s TOTAL_MEMORY={MemorySize}MB";

PlayerSettings.WebGL.emscriptenArgs += " --memoryprofiler "; // 开启memoryprofiler，每次分配内存都会获取堆栈信息导致运行卡顿

PlayerSettings.WebGL.emscriptenArgs += " --profiling-funcs "; // 将为WASM文件中的类和方法保留一些可读的名称，以便您在使用浏览器开发工具时能够跟踪代码
```

因为通过emscriptenArgs增加的特殊函数只能在web端访问到，因此如果unity想要获取到对应的信息就需要使用jslib(unity和js进行交互的工具)来获取

```js
mergeInto(LibraryManager.library, {
  GetTotalMemorySize: function () {
    if (typeof TOTAL_MEMORY !== "undefined") {
      return TOTAL_MEMORY;
    }
    return buffer.byteLength;
  },
  GetDynamicMemorySize: function () {
    if (typeof _sbrk !== 'function')
    {
        return 0;
    }
    if (typeof DYNAMIC_BASE !== "undefined") {
      return HEAP32[DYNAMICTOP_PTR >> 2] - DYNAMIC_BASE;
    }
    if (typeof Module["___heap_base"] !== "undefined") {
      heap_base = Module["___heap_base"];
    }
    var heap_base = 7936880;
    var heap_end = _sbrk();
    return heap_end - heap_base;
  },
  GetUsedMemorySize: function () {
    if (typeof emscriptenMemoryProfiler !== "undefined") {
      return emscriptenMemoryProfiler.totalMemoryAllocated;
    }
    return 0;
  },
  GetUnAllocatedMemorySize: function () {
    if (typeof _sbrk !== 'function')
    {
        return 0;
    }
    var heap_end = _sbrk();
    return HEAP8.length - heap_end;
  },
});

// _sbrk 是Emscripten的 emcc 编译器编译时增加的EXPORTED_FUNCTIONS命令行参数，_sbrk()函数返回指向已分配内存起始位置的指针
// Module 是一个WebAssembly.Module，该对象包含已经由浏览器编译的无状态 WebAssembly 代码
// HEAP8 查看 8 位有符号内存
// `__heap_base`是Emscripten自动生成的变量，表示堆的起始位置
```

#### 其它参考

[unity和浏览器脚本交互(官方文档)](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)
