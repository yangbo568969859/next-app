# Rust WebAssembly

WebAssembly是一门不同于js的语言，WebAssembly是一门低级的类汇编语言；它有一种紧凑的二进制格式，使其能够以接近原生性能的速度运行，并且为诸如C++和Rust等拥有低级的内存模型语言提供了一个编译目标且使得他们能够z

流程：rust编写原始代码 -> 编译 -> 生成.wasm文件 -> 客户端加载.wasm文件

## wasm-bindgen

wasm-bindgen 是一个强大的工具链，旨在简化 WASM模块与js之间的交互，主要是将rust的性能优势引入web开发中，实现与js的无缝集成（主要功能就是自动生成可以必要的绑定和胶水代码，确保Rust和js之间可以正常的平滑通信）

在Cargo.toml中添加wasm-bindgen依赖

```yaml
[package]
name = "my_wasm_project"
version = "0.1.0"
edition = "els"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["Window", "Document", "HtmlCanvasElement", "CanvasRenderingContext2d"] }
// features 字段指定了你要启用的 Web API 特性。web-sys 默认并不包含所有的 Web API，你需要显式地指定你想要使用的那些特性。比如这里我们需要用canvas绘图，就需要显示的指定Document，HtmlCanvasElement，CanvasRenderingContext2d等canvs的特性
```

- [package] 生成的这个包的一些基本信息
- [lib] crate-type 是一个配置项，用于指定当你构建项目时生成的输出类型
- [dependencies] 指定依赖和依赖的版本。 比如： wasm-bindgen的版本为0.2

## wasm-pack

### 创建 Rust WebAssembly 项目

使用wasm-pack创建一个新的rust wasm项目；wasm-pack是一个工具，用于构建和大包Rust WebAssembly项目

```bash
# cmd中安装wasm-pack
cargo install wasm-pack
```

```bash
# 创建rust wasm项目
wasm-pack new rust-wasm-example
```

```bash
# 进入项目目录：
cd rust-wasm-example
```

```bash
# 编译
wasm-pack build --target web
```

### 在react中使用 rust wasm 模块

首先创建一个react前端项目

将rust-wasm-example整个文件夹复制到前端项目根目录中，在react项目中安装wasm包：

```shell
npm install ./rust-wasm-example/pkg
```

在 React 组件中导入和使用 Rust Wasm 模块：

```jsx
import React from 'react';

const App = () => {
  const greet = async () => {
    const rustApp = import('rust-wasm-example');
    const r = await (await rustApp).default();
    r.greet();
  };
  return (
    <div>
      <h1>Rust and React Integration</h1>
      <button onClick={greet}>Run Computation</button>
    </div>
  );
};

export default App;
```

### 编写 Rust 代码并导出函数

在 Rust 项目中，编写所需的功能并使用 #[wasm_bindgen] 宏导出函数，使其可以在 JavaScript 中调用

在我们的 rust-wasm 项目中，打开 rust-wasm-example\src\lib.rs 文件，其内容为：

```rust
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
  alert("Hello, rust-wasm!");
}
```

增加一个自定义函数，名为：climb_stairs

```rust
#[wasm_bindgen]
pub fn someRustFunction() -> String {
  // Rust 逻辑
  return "Hello from Rust!".to_string()
}

#[wasm_bindgen]
pub fn climb_stairs(n: i32) -> i32 {
  if n <= 2 {
    return n
  }
  return climb_stairs(n - 1) + climb_stairs(n - 2);
}
```

### 构建并测试

每次修改 Rust 代码后，都需要重新构建 Rust Wasm 模块，并重新安装到 React 项目中

```bash
# 在 Rust 项目目录中运行：
wasm-pack build --target web
```

```bash
# 将打包好的项目重新复制到前端项目，并按照刚才的步骤进行安装。
yarn add ./rust-wasm/pkg
```

```bash
# 启动前端项目
yarn start
```

### 用 Rust 编写第一个有意义的 Web Assembly

```shell
# 新建项目 
wasm-pack new rust-image-processor
# 进入目录
cd rust-image-processor
```

添加依赖

```yaml
[dependencies]
wasm-bindgen = "0.2"  
web-sys = "0.3"  // 是一个Rust的标准库，它提供了对Web API的绑定。包括 DOM、HTML、CSS、XMLHttpRequest、Fetch API、WebSocket 等等。 使得你可以使用 Rust 语言来编写与浏览器环境交互的代码。
wasm-bindgen-futures = "0.4"
image = "0.23"
console_log = "0.2"  
log = "0.4"
```

编写 Rust 代码

```rust
extern crate image;  
extern crate console_log; 
extern crate log; 

use log::*;   
use wasm_bindgen::prelude::*;  

#[wasm_bindgen]  
pub fn grayscale_image(image_data: Vec<u8>) -> Vec<u8> {  
  if image_data.is_empty() {  
    info!("Image data is empty.");  
  }
  let img = image::load_from_memory(&image_data).unwrap();  
  let gray_img = img.grayscale();  
  let mut buf: Vec<u8> = vec![];  
  gray_img.write_to(&mut buf, image::ImageOutputFormat::Png).unwrap();  
  buf  
}

#[wasm_bindgen(start)]  
pub fn main() {  
  console_log::init_with_level(log::Level::Info).unwrap();  
}
```

安装生成的 Wasm 包

```bash
yarn add ./rust-image-processor/pkg
```

react项目中使用

```jsx
import React, {useState, useEffect} from 'react';
const _imageUrl = 'https://images.pexels.com/photos/12196392/pexels-photo-12196392.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';

const App = ({imageUrl=_imageUrl}) => {
  const [grayImageUrl, setGrayImageUrl] = useState(imageUrl); 
  
  useEffect(() => {  
    
    const processor = async () => {
      const rustApp = import('rust-image-processor');
      const r = await (await rustApp).default();

      const response = await fetch(imageUrl);  
      const arrayBuffer = await response.arrayBuffer();  
      
      const _ = new Uint8Array(arrayBuffer);

      const grayImage = r.grayscale_image(_);  
      const blob = new Blob([grayImage], { type: 'image/png' });  
      setGrayImageUrl(URL.createObjectURL(blob)); 
    };

    processor(); 
  }, [imageUrl]);  

  return <img src={grayImageUrl} alt="Grayscale Image" />; 
};

export default App;
```

### 用Rust生成一个canvas文件

```yaml
[package]
name = "my_wasm_project"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["Window", "Document", "HtmlCanvasElement", "CanvasRenderingContext2d"] }
```

- wasm-bindgen 就是前面说的编译Rust代码的桥梁
- web-sys 是一个Rust的标准库，它提供了对Web API的绑定。包括 DOM、HTML、CSS、XMLHttpRequest、Fetch API、WebSocket 等等。 使得你可以使用 Rust 语言来编写与浏览器环境交互的代码
- features 字段指定了你要启用的 Web API 特性。web-sys 默认并不包含所有的 Web API，你需要显式地指定你想要使用的那些特性。比如这里我们需要用canvas绘图，就需要显示的指定Document，HtmlCanvasElement，CanvasRenderingContext2d等canvs的特性

```rust
use wasm_bindgen::prelude::*;
use web_sys::{window, Document, HtmlCanvasElement, CanvasRenderingContext2d};

#[wasm_bindgen]
pub fn draw_circle(canvas_id: &str) -> Result<(), JsValue> {
  // 获取全局window对象
  let window = window().expect("no global `window` exists");
  //	获取document
  let document = window.document().expect("window should have a document");
  // 通过 ID 获取 canvas 元素
  let canvas = document.get_element_by_id(canvas_id)
    .and_then(|e| e.dyn_into::<HtmlCanvasElement>().ok())
    .expect("canvas element not found");
  // 设置 canvas 尺寸
  canvas.set_width(500);
  canvas.set_height(500);
  // 获取 2D 渲染上下文
  let context = canvas
    .get_context("2d")
    .expect("failed to get context")
    .unwrap()
    .dyn_into::<CanvasRenderingContext2d>()
    .expect("context is not of type 2d");
  // 开始路径
  context.begin_path();
  // 绘制圆
  context.arc(250.0, 250.0, 100.0, 0.0, std::f64::consts::PI * 2.0)?;
  // 设置填充颜色
  context.set_fill_style(&JsValue::from_str("blue"));
  // 填充圆
  context.fill();
  // 设置描边颜色
  context.set_stroke_style(&JsValue::from_str("black"));
  // 描边圆
  context.stroke();
  Ok(())
}
```

- use关键字 use是把模块，项，或者路径导入当前的目录中。这使得你可以在代码中直接使用这些导入的名称，而不需要每次都写完整的路径
- ::操作符 ::是一个很重要的操作符，主要用于访问模块、结构体、枚举、函数、常量等的命名空间中的成员。
- pub关键字 pub 是访问修饰符，表示“公共”的意思，fn 是函数的关键字。通过 pub fn 定义的函数可以在模块外部被访问和调用
- #[wasm_bindgen] 使用#[wasm_bindgen]定义的函数，可以使得Rust 代码能够与 JavaScript 无缝交互。通过使用这个属性，你可以轻松地将 Rust 函数导出给 JavaScript 使用，或者从 Rust 代码中调用 JavaScript 函数。
- #[wasm_bindgen(start)] 表示当前的函数在js中导入使用是自动执行的。
- JsValue类型 是 wasm-bindgen 库中的一个类型，用于表示JavaScript中的值。它可以表示任何JavaScript值，如数字、字符串、对象等。在Wasm环境中，JsValue 用于在Rust和JavaScript之间传递数据
- dyn_into
  - 将 JavaScript 对象转换为特定的 Rust 类型。这个函数通常用于处理从 JavaScript 传递过来的对象，这些对象可能需要被转换成更具体的 Rust 类型，以便你可以调用该类型特有的方法或访问其属性
  - 由于 WebAssembly 和 JavaScript 之间的交互是通过接口定义来进行的，有时候你从 JavaScript 接收到的对象可能是通用的类型（如 JsValue），但你需要将其转换为特定的 Rust 类型（如 HtmlElement 或 Document）来使用。dyn_into 函数提供了这种转换能力，并且它会进行类型检查，确保转换是安全的
- expect 通常用于 Option 和 Result 类型。它的主要作用是当值为 None 或 Err 时提供自定义的错误消息，并触发 panic! 宏，从而终止程序。说白了，就是Rust的错误处理机制。这也是Rust为什么很安全的原因，每一句话都会有对应的错误处理

#### 编译打包

```shell
wasm-pack build --target web
```

#### 在vite中使用

新建一个vite项目

```shell
npm init vite
```

关联上面打包的文件

```bash
pnpm i ./my_wasm_project/pkg
```

为了可以自动编译，然后同步更新node_modules里面内容，我们在package.json里面写一个脚步执行

```json
"scripts": {
  "wasm": "cd ./my_wasm_project && wasm-pack build --target web && cd .. && pnpm install ./my_wasm_project/pkg"
},
```

组件中使用

```js
// 需要把引入一个init函数先执行，这个目的是为了先构建wasm的运行环境
import init, { draw_circle } from 'my_wasm_project/my_wasm_project'

onMounted(async () => {
  await init();
  draw_circle('my_canvas')
})
```
