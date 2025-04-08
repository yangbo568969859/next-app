# MCP 实践

## MCP高德地图实践

高德地图mcp地址 https://lbs.amap.com/api/mcp-server/gettingstarted

获取key地址 https://lbs.amap.com/api/mcp-server/create-project-and-key

### SSE 连接配置

```json
{
  "mcpServers": {
    "amap-amap-sse": {
      "url": "https://mcp.amap.com/sse?key=<您在高德官网上申请的key>"
    }
  }
}
```

### Stdio NodeJS I/O 模式接入 MCP 服务

```json
{
  "mcpServers": {
    "amap-maps": {
      "command": "npx",
      "args": ["-y", "@amap/amap-maps-mcp-server"],
      "env": {
        "AMAP_MAPS_API_KEY": "您在高德官网上申请的key"
      }
    }
  }
}
```

### vscode 配置

settings.json中配置

```json
{
  "chat.agent.enabled": true,
  "mcp": {
      "servers": {
          "my-mcp-amap": {
              "type": "sse",
              "url": "https://mcp.amap.com/sse?key=<您在高德官网上申请的key>"
          }
      }
  }
}
```

## edgeone-pages-mcp-server

Pages MCP Server 利用无服务器边缘计算能力和 KV 存储，通过 API 接收 HTML 内容，即可自动生成即时生效的公共访问链接，实现秒级静态页面部署并内置错误处理机制

https://edgeone.cloud.tencent.com/pages/document/173172415568367616

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

```md
请生成一个包含上面的推荐内容的 HTML 页面,用好看的图像化表达出来。
​
页面应使用 Bootstrap 5 框架进行布局和样式设计，并包含以下几个部分：
​
1.  头部（Header）：
    *   包含一个标题，显示“杭州算力小镇住宿小区推荐”。
    *   包含一个副标题，显示“祝贺您拿到offer,为您在杭州的算力小镇，推荐性价比超高的住宿小区”。
    *   包含一个更新时间，显示“更新时间: (自动获取今天时间，如：2025年4月1日)”。
​
2.  地图（Map）：
    *   使用高德地图嵌入，显示以下推荐住宿小区的位置。
    *   地图应具有 100% 的宽度和 400px 的高度。
​
3.  住宿小区列表（Cafe List）：
    *   以卡片形式展示住宿小区信息，每行显示 4 个住宿小区。
    *   住宿小区信息应包括：
        *   位置
        *   评分（使用 Font Awesome 星星图标）
        *   交通
        *   周边设施
        *   人均消费
        *   房源情况
        *   租金
        *   特色（例如：停车场、免费 WiFi），使用 Font Awesome 图标。
    *   使用 Unsplash API 获取住宿小区的图片，每张图片的高度为 200px。
​
4.  交通分析（Travel Info）：
    *   提供从住宿小区到杭州算力小镇的交通建议，包括预计车程时间。
​
5.  页脚（Footer）：
    *   包含版权信息，显示“© 2025 算力小镇住宿推荐 | 数据来源: 高德地图 | 制作：LucianaiB”。
​
使用 CSS 自定义样式，包括：
​
*   主色调（primary-color）：#6f4e37
*   辅助色调（secondary-color）：#f5f5dc
*   强调色调（accent-color）：#d4a76a
*   卡片hover效果：鼠标悬停时卡片向上移动并增加阴影
​
确保页面具有响应式布局，可以在不同设备上正常显示。
```

接下来重要的一步是部署到公网,这里就是利用EdgeOne Pages MCP。

```shell
将代码部署到 EdgeOne Pages 并生成公开访问链接
```

## MCP数据库实践

PostgreSQL MCP Server 查询数据库信息

## Build an MCP server in Cursor

### Prompt 1

核心需求：我们要使用 TypeScript 搭建一个新的 MCP 服务器。开始是一个空目录，需要创建项目的基本骨架，安装必须的依赖，搭好项目结构，并且在每次提交时，都要记录“重要文件”到 .cursor/rules/important-files.mdc 中。

需要做什么？

- 在空目录下初始化一个 TypeScript 项目。
- 使用 pnpm 安装依赖，比如 @modelcontextprotocol/sdk, zod 等，以及对应的开发依赖（TypeScript、tsx、@types/node）。
- 设置 package.json，包括 scripts（如 build、dev）和基本项目元信息（bin, type 等）。
- 配置 tsconfig.json，启用严格模式以及一些推荐的编译选项，把编译结果放到 dist 目录下。
- 创建一个简单的入口文件 src/main.ts，其中示例演示了如何创建一个 MCP Server，定义简单的工具（如加法工具），以及如何用 stdio 传输。
- 建立并更新 .cursor/rules/important-files.mdc，列出项目中“重要”的文件路径，保证每次新增文件都记录进去。
- 运行 pnpm build 验证能否成功编译。

一句话概括：用 TypeScript、pnpm 初始化一个 MCP 服务器项目，写好 package.json、tsconfig.json、src/main.ts 入口文件，并确保所有关键文件都写进 .cursor/rules/important-files.mdc。

### Prompt 2

核心需求：把 MCP 服务器和 GitHub 连接起来，能对 GitHub 的 issues 和 pull requests 做一些操作。要使用 Octokit 库，并且要将和 GitHub 交互的函数以及相关的 MCP 工具都写好。

需要做什么？

- 添加 .env 文件来存放 GitHub 的访问令牌等敏感信息，并把 .env 加入到 .gitignore 中，确保不会被提交到版本库。
- 安装 octokit，用它和 GitHub API 交互（获取 issue、PR 数据，创建评论等）。
- 在 src/github.ts 或类似文件中封装和 GitHub 的通信逻辑，比如：获取 issue、获取 PR、创建/更新 issue/PR、列出 issue/PR 等。
- 在 MCP 服务器里，通过 server.tool() 方式把这些封装好的操作暴露出去，每个工具都要带有名称和描述（方便 MCP 客户端知道这个工具是干什么的）。
- 删除示例中的“加法工具”等不再需要的 demo 工具，换成 GitHub 相关的工具。
- 依旧要维护好 .cursor/rules/important-files.mdc 文件，把所有关键文件加进去。

一句话概括：把 octokit 引入项目，用 .env 管理 GitHub 凭证，编写并注册新的工具让 MCP 服务器可以对 GitHub issues 和 PR 进行操作。

### Prompt 3
核心需求：将服务器原本依赖的 stdio 传输方式替换成基于 SSE（Server-Sent Events） 的传输方式，以便我们可以用更灵活的方式和服务通信。需要引入 express 并用它来实现 SSE。

需要做什么？

- 安装 express，并且添加对应的类型声明包（如 @express/types）。
- 在代码中移除对 StdioServerTransport 的依赖，改用 SSEServerTransport。
- 用 Express 搭建一个简易的服务端接口：
- GET /sse 用于初始化 SSE 连接
- POST /messages 用于接收消息并转发给服务器
- 让原本的 MCP 服务器实例 server.connect(transport) 通过 SSE 方式来发送和接收数据。
- 继续保持 .cursor/rules/important-files.mdc 的更新，保证新增或修改的文件都被记录。

一句话概括：使用 express+SSE 替换之前的 stdio 传输方案，添加对应的路由代码，并完成 SSE 连接，让 MCP 服务器通过 SSE 与外部交互。

### Prompt 4

核心需求：项目里的文件变得过大，为了让 Cursor 或其他协作方容易理解代码，我们要把它拆分成更细的模块，比如按 “GitHub 相关功能” 和 “工具相关逻辑” 分目录存放。

需要做什么？

- 识别现在的代码里有哪些功能混在一起，可以拆分的部分有两类：
  - github-functions：跟 GitHub 交互有关的内容
  - tools：要提供给 MCP 服务器的各种工具（这些工具可能会用到 github-functions）。
- 根据功能、领域不同，把大文件拆分成多个小文件，目录层次大致像：
- 每个新文件只负责一块相对单一的逻辑，比如 github-functions/issues.ts 专门处理 issue 相关的函数，tools/issueTools.ts 专门定义 issue 工具等。
- 更新 .cursor/rules/important-files.mdc，保证拆分后生成的所有重要文件都列出来。

一句话概括：按照 “GitHub 函数”和“工具”两个主题，把代码整理到不同文件和目录里，让每个文件的职责单一，便于后续维护。

### Prompt 5

核心需求：在 MCP 服务器中添加一组函数和工具，用来查看和管理 GitHub Actions 的状态（比如列出 Actions、查看状态、获取详情、取消或者重试等）。

需要做什么？

- 先看看已有的 GitHub 连接逻辑，复用或在原有基础上新增针对 GitHub Actions 的 API 调用。
- 在 github-functions 相关文件里，新增相应的函数：
- listActions / getActionStatus / getActionDetails / cancelAction / retryAction，并注意一定要包含 page 和 per_page 参数。
- 在 tools 里，把这些操作包装成 MCP 工具（server.tool()），方便外部调用。
- 继续更新 .cursor/rules/important-files.mdc，把新增文件或修改的地方列入其中。

一句话概括：添加针对 GitHub Actions 的查询、管理功能（列出、查看、取消、重试等），将对应函数作为新工具接入 MCP 服务器，确保 .cursor/rules/important-files.mdc 得到更新。
