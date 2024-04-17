# pm2

PM2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单

## 使用

安装

```shell
npm install pm2 -g
```

目录介绍

```yml
$HOME/.pm2 will contain all PM2 related files
$HOME/.pm2/logs will contain all applications logs
$HOME/.pm2/pids will contain all applications pids
$HOME/.pm2/pm2.log PM2 logs
$HOME/.pm2/pm2.pid PM2 pid
$HOME/.pm2/rpc.sock Socket file for remote commands
$HOME/.pm2/pub.sock Socket file for publishable events
$HOME/.pm2/conf.js PM2 Configuration
```

常用命令

```md
--watch 监听应用目录变化，一旦发生变化，自动重启（如果要精确监听或不监听的目录，最好通过config配置）
-i --instances 启用多少个实例，可用于负载均衡。如 -i 0 或者 -i max，根据机器核数确定实例数目
--ignore-watch 排除要监听的目录或文件，可以是特定文件名，也可以是正则，如 --ignore-watch "node_modules"
-n --name 应用的名称，产看应用信息的时候用到
-o --output <path> 标准输出日志文件路径
-e --error <path> 错误输出日志文件路径
--interpreter <interpreter> 
```

启动

```shell
pm2 start app.js --watch -i 2
```

重启

```shell
pm2 restart app.js
```

停止

```shell
# 停止特定的应用。可以先通过pm2 list获取应用的名字（--name指定的）或者进程id。
pm2 stop app_name|app_id
```

删除

```shell
# 类似pm2 stop，如下
pm2 stop app_name|app_id
pm2 stop all
```

查看进程状态

```shell
pm2 list
```

查看某个进程信息

```shell
[root@iZ94wb7tioqZ pids]# pm2 describe 0
Describing process with id 0 - name oc-server
┌───────────────────┬──────────────────────────────────────────────────────────────┐
│ status            │ online                                                       │
│ name              │ oc-server                                                    │
│ id                │ 0                                                            │
│ path              │ /data/file/qiquan/over_the_counter/server/bin/www            │
│ args              │                                                              │
│ exec cwd          │ /data/file/qiquan/over_the_counter/server                    │
│ error log path    │ /data/file/qiquan/over_the_counter/server/logs/app-err-0.log │
│ out log path      │ /data/file/qiquan/over_the_counter/server/logs/app-out-0.log │
│ pid path          │ /root/.pm2/pids/oc-server-0.pid                              │
│ mode              │ fork_mode                                                    │
│ node v8 arguments │                                                              │
│ watch & reload    │                                                              │
│ interpreter       │ node                                                         │
│ restarts          │ 293                                                          │
│ unstable restarts │ 0                                                            │
│ uptime            │ 87m                                                          │
│ created at        │ 2016-08-26T08:13:43.705Z                                     │
└───────────────────┴──────────────────────────────────────────────────────────────┘
```

日志查看

```shell
pm2 logs
```

## 配置文件

- 配置文件里的设置项，跟命令行参数基本是一一对应的
- yaml或json
- 启动时制定了配置文件，那么命令行参数会被忽略（个别参数除外 --env）

### 配置文件生成

常用配置说明

- apps： json结构，apps是一个数组，每一个数组成员就是对应一个pm2中运行的应用；
- name：应用程序名称；
- cwd：应用程序所在的目录；
- script：应用程序的脚本路径；
- log_date_format： 指定日志日期格式，如YYYY-MM-DD HH：mm：ss；
- error_file：自定义应用程序的错误日志文件，代码错误可在此文件查找；
- out_file：自定义应用程序日志文件，如应用打印大量的标准输出，会导致pm2日志过大；
- pid_file：自定义应用程序的pid文件；
- interpreter：指定的脚本解释器；
- interpreter_args：传递给解释器的参数；
- instances： 应用启动实例个数，仅在cluster模式有效，默认为fork；
- min_uptime：最小运行时间，这里设置的是60s即如果应用程序在60s内退出，pm2会认为程序异常退出，此时触发重启max_restarts设置数量；
- max_restarts：设置应用程序异常退出重启的次数，默认15次（从0开始计数）；
- autorestart ：默认为true, 发生异常的情况下自动重启；
- cron_restart：定时启动，解决重启能解决的问题；
- max_memory_restart：最大内存限制数，超出自动重启；
- watch：是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件。
- ignore_watch：忽略监听的文件夹，支持正则表达式；
- merge_logs： 设置追加日志而不是新建日志；
- exec_interpreter：应用程序的脚本类型，默认是nodejs；
- exec_mode：应用程序启动模式，支持fork和cluster模式，默认是fork；
- autorestart：启用/禁用应用程序崩溃或退出时自动重启；
- vizion：启用/禁用vizion特性(版本控制)；
- env：环境变量，object类型；
- force：默认false，如果true，可以重复启动一个脚本。pm2不建议这么做；
- restart_delay：异常重启情况下，延时重启时间；

js格式

```shell
pm2 ecosystem
```

将生成ecosystem.config.js

```js
module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
```

```shell
pm2 start ecosystem.config.js
```

json格式

```json
{
  "apps": [{
    "name": "express_project",
    "script": "app.js",
    "cwd": "./",
    "interpreter": "",
    "interpreter_args": "",
    "watch": true,
    "ignore_watch": ["node_modules", "public"],
    "exec_mode": "cluster_mode",
    "instances": "max",
    "max_memory_restart": "100M",
    "error_file": "./logs/app-err.log",
    "out_file": "./logs/app-out.log",
    "merge_logs": true,
    "log_date_format": "YYYY-MM-DD HH:mm:ss",
    "min_uptime": "60s",
    "max_restarts": 30,
    "autorestart": true,
    "restart_delay": "60",
    "env": {
      "NODE_ENV": "production",
      "REMOTE_ADDR": ""
    },
    "env_dev": {
      "NODE_ENV": "development",
      "REMOTE_ADDR": ""
    },
    "env_test": {
      "NODE_ENV": "test",
      "REMOTE_ADDR": ""
    }
  }]
}
```

```shell
pm2 start pm2.json
```

### 多环境配置

- env为默认的环境配置（生产环境），env_dev、env_test则分别是开发、测试环境。可以看到，不同环境下的NODE_ENV、REMOTE_ADDR字段的值是不同的。
- 在应用中，可以通过 process.env.REMOTE_ADDR 等来读取配置中生命的变量

```shell
pm2 start app.js --env dev
```

## 开机自动启动

可以通过pm2 startup来实现开机自启动

- 通过pm2 save保存当前进程状态
- 通过pm2 startup [platform]生成开机自启动的命令。（记得查看控制台输出）
- 将步骤2生成的命令，粘贴到控制台进行

## 更新pm2

- pm2 save 保存当前进程状态
- npm install pm2 -g
- pm2 update

## pm2 + nginx

```config
upstream my_nodejs_upstream {
  server 127.0.0.1:3001;
}
server {
  listen 80;
  server_name my_nodejs_server;
  root /home/www/project_root;
  
  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_max_temp_file_size 0;
    proxy_pass http://my_nodejs_upstream/;
    proxy_redirect off;
    proxy_read_timeout 240s;
  }
}
```
