# Git多账号管理

由于 Git 所具有的巨大优越性，越来越多的公司以及个人开始由 Svn 转向 Git 。一般来讲，每位员工都会被分配给一个公司内部的邮箱。比如一个 996 公司的员工 “张三”，获得的可能就是一个 “zhansan@996icu.com” 的邮箱。比较规范的公司，就会要求我们使用自己的名字和公司所分配给自己的这个邮箱来配置 Git（姓名和邮箱可以不用引号括起来）：

```shell
git config --global user.name "张三"
git config --global user.email "zhansan@996icu.com"
```

但是这种配置是全局的，如果我们之前刚好有在 GitHub 上维护项目，那这样势必就会将之前所做的 Git 账户配置给覆盖了。那怎么解决呢？我们总不能来回覆盖，来回添加密钥吧。我们能不能同时配置多个 Git 账户呢？

当然能。

这里以 Mac 为例，如果我们之前配置过全局的用户名和邮箱，那么在用户目录下的.gitconfig文件中（如/Users/zhangsan/.gitconfig），会有类似如下的配置：

```shell
[user]
    name = 张三
    email = zhangsan@gmail.com
```

当然，我们也可以直接使用命令来查看：

```shell
git config --global user.name
git config --global user.email
```

如果设置了这两个全局属性，就会输出对应的值。若任何输出的话，则表示未设置。

如果设置过，我们就需要将用户名和邮箱这两个全局变量进行重置。使用如下命令：

```shell
git config --global --unset user.name 
git config --global --unset user.email
```

我们知道，一般 Git 服务器为了安全，都会要求我们添加一个安全的 SSH 密钥。但是默认情况下，生成的密钥的文件名都是一样的。因而，不同的用户，必须设置不同文件名的密钥文件，否则会发生覆盖。所以，接下来千万别觉得太熟悉不过了，就一路回车，千万要悠着点手速。

以 “张三” 为例，首先，我们需要根据公司邮箱来生成密钥对:

```shell
ssh-keygen -t rsa -C "zhansan@996icu.com"
```

回车后会出现下面这句话：

```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/zhangsan/.ssh/id_rsa):
```

这时候可千万别一路回车，注意看提示，这里要我们输入要保存的私钥的路径和文件名，为了以后易找，我们就仍然放在该路径下，只不过更改个跟平台相关的文件名，输入：

```shell
Users/zhangsan/.ssh/996icu_id_rsa
```

接着就可以一路回车了，默认密码为空即可。

生成完密钥之后，我们还需要使用ssh-add命令是把专用密钥添加到ssh-agent的高速缓存中。该命令位置在/usr/bin/ssh-add，用法如下：

```shell
ssh-add -K ~/.ssh/996icu_id_rsa
```

之后我们需要将生成的密钥对中的公钥里的内容用文本编辑器打开，复制下来，添加到对应的平台上面，比如公司的 GitLab 或者 GitHub 等。

Mac 下面可以直接使用如下命令来把公钥复制到剪切板：

```shell
pbcopy < ~/.ssh/996icu_id_rsa.pub
```

同样地，我们使用 “zhangsan@gmail.com” 这个邮箱，来生成供 GitHub 使用的账户的私钥github_id_rsa和公钥github_id_rsa.pub，并把公钥添加到 GitHub 平台上。

接下来我们还需要修改 Git 的本地配置，来将远程的服务器地址和本地的私钥文件进行关联。这样通过比较私钥和之前填在该平台上的公钥，就能进行权限验证。

在Users/用户名/.ssh/目录下面新建一个名为config的配置文件，添加如下内容：

```shell
# github email address
Host github
HostName github.com 
User git
PreferredAuthentications publickey
IdentityFile ~/.ssh/github_id_rsa

# gitlab email address
# 公司内网地址
HostName 192.168.6.106 
User git
PreferredAuthentications publickey
IdentityFile ~/.ssh/996icu_id_rsa
```

这里就将远程地址和本地的私钥文件对应了起来。

配置文件中的 HostName 是远程仓库的访问地址，这里可以是 IP，也可以是域名。Host 是用来拉取的仓库的别名，配不配置都行。如果 HostName 没配置的话，那就必须把 Host 配置为仓库 IP 地址或者域名，而非别名。

配置了这些之后，我们就能够成功的从远程拉取仓库了，拉取之后，cd到仓库目录下，配置该仓库使用的用户名和邮箱：

```shell
git config --local  user.name 张三
git config --local  user.email zhansan@996icu.com
```

当然，你也可以直接不用 --local参数

注意，这里的账户可以和我们开始时生成秘钥的邮箱不同。那个邮箱其实配置的是我们电脑针对某个 IP 的 “全局” 账户（注意，不是global参数指定的那个全局），这里配置的是某个仓库下的 “局部” 用户，当然，你把这个仓库再 copy 一份的话，就可以设置个其他的用户名和邮箱了，毕竟是局部的嘛，相当于多个用户在同一台电脑上进行工作。

还有，如果你未指用户名和邮箱的话，Git 会自动使用电脑登录的用户名，比如“zhangsan”,邮箱默认就是 “zhangsan@zhangsan.local”,这当然不是我们想要的，所以最好配置下吧。

[参考: Git多账号管理](https://zhuanlan.zhihu.com/p/62071906)
