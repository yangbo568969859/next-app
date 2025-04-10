# Node.js开发MCP服务器完整指南

## 1. MCP简介

MCP (Model Context Protocol) 是一个允许语言模型（如Claude）与外部工具和资源进行交互的协议。MCP服务器可以提供三种主要能力：

- Resources：类文件数据，可被客户端读取（如API响应或文件内容）
- Tools：可被语言模型调用的函数（需要用户批准）
- Prompts：帮助用户完成特定任务的预写模板

## 2. 开发环境准备

### 2.1 系统要求
- Node.js 14.0.0 或更高版本
- npm 或 yarn 包管理器

### 2.2 项目初始化

```bash
# 创建项目目录
mkdir weather-mcp-server
cd weather-mcp-server

# 初始化package.json
npm init -y

# 安装依赖
npm install @modelcontextprotocol/sdk express axios
```

## 3. 通信模式对比

MCP服务器支持两种主要的通信模式：

### 3.1 SSE (Server-Sent Events) 模式

- 基于HTTP长连接
- 适合Web环境
- 支持实时数据推送
- 配置简单，易于调试
- 适合分布式部署

### 3.2 Stdio模式

- 基于标准输入输出流
- 更轻量级
- 适合本地环境
- 性能较好
- 适合单机部署

## 4. 实现MCP服务器

### 4.1 基础服务器架构

```javascript
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 初始化MCP服务器
// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// 常量配置
const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";
```

### 4.2 工具函数实现

```javascript
// Add an addition tool
// 天气预报工具
server.tool("get-forecast",
  "获取指定位置的天气预报",
  {
    latitude: {
      type: 'number',
      description: '位置的纬度'
    },
    longitude: {
      type: 'number',
      description: '位置的经度'
    }
  },
  async ({ latitude, longitude }) => {
    try {
        const pointsResponse = await axios.get(
            `${NWS_API_BASE}/points/${latitude},${longitude}`,
            {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Accept': 'application/geo+json'
                }
            }
        );
        
        const forecastUrl = pointsResponse.data.properties.forecast;
        const forecastResponse = await axios.get(forecastUrl);
        
        return formatForecast(forecastResponse.data);
    } catch (error) {
        return `获取天气预报失败: ${error.message}`;
    }
  }
);

// 天气预警工具

server.tool("get-alerts",
  "获取指定区域的天气预警信息",
  {
    state: {
      type: 'string',
      description: '美国州代码（例如：CA, NY）'
    }
  },
  async ({ latitude, longitude }) => {
    try {
        const response = await axios.get(
            `${NWS_API_BASE}/alerts/active/area/${state}`,
            {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Accept': 'application/geo+json'
                }
            }
        );
        
        return formatAlerts(response.data);
    } catch (error) {
        return `获取天气预警失败: ${error.message}`;
    }
  }
);
```

### 4.3 辅助格式化函数

```javascript
function formatForecast(data) {
    const periods = data.properties.periods;
    return periods.map(period => `
        时段: ${period.name}
        温度: ${period.temperature}°${period.temperatureUnit}
        天气: ${period.shortForecast}
        详细: ${period.detailedForecast}
    `).join('\n---\n');
}

function formatAlerts(data) {
    if (!data.features || data.features.length === 0) {
        return "当前没有活动预警";
    }
    
    return data.features.map(feature => {
        const props = feature.properties;
        return `
            事件: ${props.event}
            地区: ${props.areaDesc}
            严重程度: ${props.severity}
            描述: ${props.description}
            指示: ${props.instruction || '无具体指示'}
        `;
    }).join('\n---\n');
}
```

### 4.4 Prompt的使用

MCP服务器支持定义Prompt模板，帮助语言模型更好地使用工具：

```javascript
server.prompt(
  "weather-check",
  "检查天气状况的提示模板",
  { code: z.string() },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `
          我是一个天气查询助手。我可以：
          1. 使用get-forecast工具查询具体位置的天气预报
          2. 使用get-alerts工具查询州级天气预警
          
          请告诉我您想了解哪里的天气信息？
      `
      }
    }]
  })
);
```

### 4.5 启动服务器

Stdio模式下启动服务器

```javascript
// 选择通信模式启动服务器
async function runServer() {
  // 使用Stdio模式
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server running on stdio");
  // 使用SSE模式
}
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
```

HTTP with SSE

```typescript
import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: {[sessionId: string]: SSEServerTransport} = {};

app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001);
```

## 5. 配置与测试

### 5.1 Claude Desktop配置

在以下位置创建或编辑配置文件：
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\\Claude\\claude_desktop_config.json`

```json
{
    "mcpServers": {
        "weather": {
            "command": "node",
            "args": ["/absolute/path/to/your/server.js"]
        }
    }
}
```

### 5.2 测试命令

在Claude Desktop中可以测试如下命令：
1. "查询旧金山的天气预报"
2. "查看加利福尼亚州的天气预警"

## 6. 调试技巧

1. 使用SSE模式时，可以通过浏览器直接访问工具端点进行测试
2. 启用调试日志：
```javascript
mcp.setLogLevel('debug');
```
3. 使用工具验证器：
```javascript
mcp.validateTool('get-forecast');
```

## 7. 最佳实践

1. 总是提供清晰的工具描述和参数说明
2. 实现适当的错误处理和重试机制
3. 使用类型定义提高代码可靠性
4. 添加适当的超时处理
5. 实现健康检查端点
6. 使用环境变量管理配置
7. 添加详细的日志记录

## 8. 注意事项

1. 确保工具函数是幂等的
2. 处理好并发请求
3. 实现速率限制
4. 注意API密钥的安全性
5. 考虑添加认证机制

