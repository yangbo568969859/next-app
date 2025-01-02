# Rust 

## rust环境搭建

### 安装

按照官网[安装流程](https://www.rust-lang.org/learn/get-started)来：

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成之后，我们在终端输入：

```shell
rustc --version
cargo --version
```

如果输出的是版本号，表示安装成功；如果不是版本号，一版是环境变量需要单独再配置下

mac下环境变量添加 

```shell
echo 'source $HOME/.cargo/env' >> ~/.zshrc
# 这将在 .zshrc 文件的末尾添加一行代码，使得 Rust 环境变量在启动终端时自动加载。
```

### 新建项目

```shell
cargo new my_project --lib
# --lib 是 cargo 命令行工具的一个选项，用于指示Cargo创建一个新的库（library）项目
```

### 文件目录

```shell
.
├── Cargo.toml
└── src
    └── main.rs
    └── lib.rs
```

- Cargo.toml 是 Cargo 项目的依赖管理文件
- src/main.rs 是 Cargo 项目的入口文件
- src/lib.rs 是 Cargo 项目的库文件

## 理解rust代码

```rust
use std::io;

fn main() {
    println!("Hello, please input your name:");

    let mut name = String::new();

    // 从标准输入读取
    io::stdin().read_line(&mut name)
        .expect("Failed to read line");

    // 去除换行符
    let name = name.trim();

    println!("Hello, {}! Welcome to the world of Rust.", name);
}
```

- use std::io; // 导入标准库,这行代码导入了 Rust 标准库中的 io（输入输出）模块
- :: // 是一个很重要的操作符，主要用于访问模块、结构体、枚举、函数、常量等的命名空间中的成员
- fn main() // 定义一个名为 main 的函数，程序的入口
- println！ // 一个宏，用于打印格式化的字符串到控制台
- let mut name = String::new() // 创建一个可变的String类型的变量name
- io::stdin().read_line(&mut name) // 从标准输入读取一行文本到 name 变量
- .expect("Failed to read line"); // 如果读取失败，程序将 panic 并显示错误信息
- let name = name.trim(); // 移除字符串两端的空白字符。

- pub 关键字 // 是访问修饰符，表示“公共”的意思，fn 是函数的关键字。通过 pub fn 定义的函数可以在模块外部被访问和调用
- #[wasm_bindgen] // 使用#[wasm_bindgen]定义的函数，可以使得Rust 代码能够与 JavaScript 无缝交互。通过使用这个属性，你可以轻松地将 Rust 函数导出给 JavaScript 使用，或者从 Rust 代码中调用 JavaScript 函数
- #[wasm_bindgen(start)] // 表示当前的函数在js中导入使用是自动执行的
