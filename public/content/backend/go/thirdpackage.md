## 第三方库

### 业务开发
- [Gin](https://gin-gonic.com/zh-cn/docs/) 一款 HTTP 框架，使用简单、性能优秀、资料众多
```shell
go get -u github.com/gin-gonic/gin
```
- [Swagger](https://github.com/swaggo/gin-swagger) 和Gin配套使用的
```shell
go get -u github.com/swaggo/swag/cmd/swag
```
- [Gorm](https://gorm.io/zh_CN/) orm 的方式操作数据库；如果有读写分离需求也可以使用 GORM 官方提供的插件 [https://github.com/go-gorm/dbresolver](https://github.com/go-gorm/dbresolver) ，配合 GORM 使用
```shell
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```
- [Error](https://github.com/pkg/errors) 错误处理提供了更强大的功能
  - 包装异常
  - 包装堆栈等。
```go
// WithMessagef annotates err with the format specifier.
func WithMessagef(err error, format string, args ...interface{}) error

// WithStack annotates err with a stack trace at the point WithStack was called.
func WithStack(err error) error
```
- [zorolog](https://github.com/rs/zerolog) 日志打印库，存在感低；也就是说性能强；使用 API 简单
```go
"github.com/rs/zerolog/log"
log.Debug().Msgf("OrderID :%s", "12121")
```
- [excelize](https://github.com/qax-os/excelize)  是一个读写 Excel 的库，基本上你能遇到的 Excel 操作它都能实现
- [now](https://github.com/jinzhu/now) 是一个时间工具库
  - 获取当前的年月日、时分秒。
  - 不同时区支持。
  - 最后一周、最后一个月等。
- [Decimal](https://github.com/shopspring/decimal) 当业务上需要精度计算时

### 基础工具
- [goconvey]()
- [gomonkey]()
- [dig]()
- [cobra]()
- [redis]()
- [elastic]()

<table><tbody>
  <tr>
    <th>名称</th><th>类型</th><th>功能</th><th>星级</th>
  </tr>
  <tr>
    <td>Gin业务开发HTTP</td>
    <td>业务开发</td>
    <td>HTTP 框架</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>GORM</td>
    <td>业务开发</td>
    <td>ORM 框架</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>errors</td>
    <td>业务开发</td>
    <td>异常处理库</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>zorolog</td>
    <td>业务开发</td>
    <td>业务开发日志库</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>excelize</td>
    <td>业务开发</td>
    <td>Excel相关需求</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>now</td>
    <td>业务开发</td>
    <td>时间处理</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>️Decimal</td>
    <td>业务开发</td>
    <td>精度处理</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>configor</td>
    <td>业务开发</td>
    <td>配置文件</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>️go-cache</td>
    <td>业务开发</td>
    <td>本地缓存</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>copier</td>
    <td>业务开发</td>
    <td>数据复制</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>env</td>
    <td>业务开发</td>
    <td>环境变量</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>user_agent</td>
    <td>业务开发</td>
    <td>读取 user-agent</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>phonenumbers</td>
    <td>业务开发</td>
    <td>手机号码验证</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>goconvey</td>
    <td>基础工具</td>
    <td>单测覆盖率</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>dig</td>
    <td>基础工具</td>
    <td>依赖注入</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>cobra</td>
    <td>基础工具</td>
    <td>命令行工具</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>cli</td>
    <td>基础工具</td>
    <td>命令行工具</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>BloomRPC</td>
    <td>基础工具</td>
    <td>gRPC 调试客户端</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>redis</td>
    <td>基础工具</td>
    <td>Redis 客户端</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>elastic</td>
    <td>基础工具</td>
    <td>elasticsearch 客户端</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>resty</td>
    <td>基础工具</td>
    <td>http 客户端</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>pulsar-client-go</td>
    <td>基础工具</td>
    <td>Pulsar 客户端</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>go-grpc-middleware</td>
    <td>基础工具</td>
    <td>gRPC 中间件</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>go-pilosa</td>
    <td>基础工具</td>
    <td>pilosa 客户端</td>
    <td>⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>pb</td>
    <td>基础工具</td>
    <td>命令行工具进度条</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>testify</td>
    <td>基础工具</td>
    <td>断言库</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>gomock</td>
    <td>基础工具</td>
    <td>接口测试库</td>
    <td>⭐️⭐️⭐️⭐️</td>
  </tr>
  <tr>
    <td>gomonkey</td>
    <td>基础工具</td>
    <td>mock工具</td>
    <td>⭐️⭐️⭐️⭐️⭐️</td>
  </tr>
</table>
