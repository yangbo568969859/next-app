# MCP

## 什么是MCP（Model Context Protocol）模型上下文协议

模型上下文协议是一种新兴的AI技术规范，旨在标准化和优化大模型(LLM)与应用程序之间的上下文信息交互。它为AI模型提供了一种结构化的方式处理、保持、交换上下文数据，从而提升模型理解能力和应用效果

大模型LLM自身只有多模态(文本、视频、图片)输出能力，无法使用外部工具进行多模态融合。

- 无法联网查询
- 无法从数据库查数据
- 无法操作浏览器

要赋予LLM 使用外部工具的能力，需要搭建如下流程

![mcp](./image/mcp.png)

## 总体架构及特点

- MCP Hosts: MCP主机，通过 MCP 访问数据的程序，例如 Claude Desktop、IDE 或 AI 工具
- MCP Client：MCP客户端，与服务器保持 1:1 连接的协议客户端，是AI助手与MCP服务器之间的通信桥梁，负责将用户请求转化为MCP服务器可识别的标准化API调用，并返回结果
- MCP Server：MCP服务器，轻量级程序，每个程序都通过标准化模型上下文协议公开特定功能
- Local Data Sources：本地数据源，MCP 服务器可以安全访问的您的计算机文件、数据库和服务
- Remote Services: 远程服务，MCP 服务器可通过互联网（例如通过 API）连接到的外部系统

![mcp-frame](./image/mcp-frame.png)

| 特性        | MCP Server                        | MCP Client             |
| -----------| ------------------ | ---------------------- |
| 角色        | 提供数据或服务                      | 连接AI模型与服务器        |
| 功能        | 暴露工具、资源、提示（如文件、天气访问）| 发起请求、接收响应、执行任务 |
| 位置        |  可本地或远程运行                   | 通常集成在AI应用中         |
| 传输支持     | STDIO、SSE等                      | STDIO、SSE等             |
| 示例        | 天气服务器、数据库服务器              | Claude Desktop、CLI客户端 |

### 工作流程

#### MCP Client

- MCP client首先从Mcp Server获取MCP Server支持的API、工具列表
- 将用户的查询连同工具描述通过 function calling 一起发送给 LLM
- LLM 决定是否需要使用工具以及使用哪些工具
- 如果需要使用工具，MCP client 会通过 MCP server 执行相应的工具调用。
- 工具调用的结果会被发送回 LLM。
- LLM 基于所有信息生成自然语言响应。
- 最后将响应展示给用户。

#### MCP Server

- 资源（Resources）：类似文件的数据，可以被客户端读取，如 API 响应或文件内容。
- 工具（Tools）：可以被 LLM 调用的函数（需要用户批准）。
- 提示（Prompts）：预先编写的模板，帮助用户完成特定任务。

支持两种协议的实现

- stdio 标准输入/输出
- SSE 服务器发送事件

### 主要特点

- 开放标准和可扩展性：MCP提供了一个通用协议，取代了当前碎片化的集成方式。开发者可以通过MCP快速构建与不同数据源的连接，而无需为每个数据源单独定制实现。
- 安全的双向连接：MCP允许开发者构建安全的双向连接，使AI工具能够访问和操作数据，同时保护用户的隐私和数据安全
- 丰富的参考实现和开源支持：MCP提供了多种参考实现，包括Google Drive、Slack、GitHub、Postgres等流行的企业系统。此外，MCP的SDK和服务器实现均为开源，开发者可以根据需要进行定制化开发
- 支持多种集成场景：MCP支持文件系统操作、数据库查询、浏览器自动化、团队协作工具等多种场景，能够满足企业和个人用户的多样化需求
- 促进生态系统发展

## MCP 服务器

## 常见的MCP

提供MCP服务的网站

- Smithery - Model Context Protocol Registry smithery.ai/ 
- PulseMCP | Keep up-to-date with MCP www.pulsemcp.com/ 
- Awesome MCP Servers mcpservers.org/ 
- MCP Servers mcp.so/ 
- Glama MCP glama.ai/mcp/servers 
- Cursor Directory cursor.directory/

### 浏览器

### 地图

- 谷歌地图mcp https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps
- 高德地图mcp https://lbs.amap.com/api/mcp-server/gettingstarted
- 百度地图mcp https://lbs.baidu.com/faq/api?title=mcpserver/base
- 腾讯地图mcp https://lbs.qq.com/service/MCPServer/MCPServerGuide/overview

### 数据库

- PostgreSQL MCP Server https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
- redis https://github.com/modelcontextprotocol/servers/tree/main/src/redis

### 文件
