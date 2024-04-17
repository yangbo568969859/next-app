# nrm nvm 使用

## nrm npm源管理器，快速的切换npm源间切换

### nrm命令

- nrm ls 查看可选的源
- nrm use taobao 切换源
- nrm add registry <http://192.168.10.127:8081/repository/npm-public/>  其中reigstry为源名，url为源的路径
- nrm del registry 删除对应的源，reigstry为源名
- nrm test 测试相应源的响应时间

## nvm node管理工具

### nvm命令

- nvm list available 显示所有可以安装的node版本
- nvm install 16.13.1 安装16.13.1版本的node
- nvm list 查看自己安装的node
- nvm use X.X.X 切换到指定的node版本

## npm相关

npm 的 .npmrc 文件在哪里？缓存及全局包文件在什么位置？

一般在C盘 C:/Users/用户名/.npmrc

- npm缓存清理 npm cache clean --force
- 淘宝源镜像证书问题
  - 设置npm ssl不校验 npm config set strict-ssl false
  - package.lock 或 yarn.lock 全局替换 <https://registry.npm.taobao.org> 为 <https://registry.npmmirror.com>

### 碰到问题

- npm ERR! Error: EPERM: operation not permitted, unlink 'e:\Users\zoe\Desktop\ReactStudy\antd-hooks-demo
\node_modules.staging\antd-bc74d47f\dist\antd.js'
  - 第一种是直接删除缓存文件，找到C盘下我的用户名下的.npmrc文件删除即可
  - 第二种是执行：npm cache clean --force，同样达到清除缓存文件的目的
  - 清除后，再重新安装
