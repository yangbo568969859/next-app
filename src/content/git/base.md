# git

## git 初始化配置

1. 生成ssh秘钥，打开git终端，执行`ssh-keygen -t rsa -C "邮箱"`,执行成功，切换到~/.ssh目录下，复制id_rsa.pub内容
2. 进入gitlab|github的settings -> SSH and GPG keys，点击add ssh key，这一步等于说你把公钥放到了Github上进行托管
3. 全局配置git用户名和邮箱

```shell
git config --global user.name "XXX"
git config --global user.password "XXX@XX.com"
```

### git工作区域和流程

Workspace：工作区，就是平时进行开发改动的地方，是当前看到的最新的内容，在开发的过程也就是对工作区的操作
Index：暂存区，当执行`git add`命令后，工作区的文件就会被移入暂存区，暂存区标记了当前工作区中的那些内容是被git管理的，当完成某个需求或者功能后需要提交代码，第一步就是通过`git add` 先提交到暂存区
Repository：本地仓库，位于自己的本地电脑上，通过`git commit`提交暂存区的内容，会进入本地仓库
Remote：远程仓库，用来托管代码的服务器，远程仓库的内容能够被分布在多个地点的处于协作关系的本地仓库修改，本地仓库修改完代码后通过`git push`命令同步代码到远程仓库

### 基本操作

#### git add

添加文件到暂存区

```sh
# 添加某个文件到暂存区，后面可以跟多个文件，空格区分
git add xxx
# 添加当前更改的所有文件到暂存区
git add .
```

#### git commit

```sh
# 提交暂存的更改，会新开编辑器进行编辑
git commit
# 提交暂存的更改，并记录下备注
git commit -m "you commit message"
# 等同于 git add . && git commit -m
git commit -am
# 对最近一次的提交信息进行修改，此操作会修改commit的hash值
git commit --amend
```

#### git pull

```sh
# 从远程仓库拉取代码合并到本地，可简写为git pull 等同于 git fetch && git merge
git pull <远程主机名> <远程分支名>:<本地分支名>
# 使用rebase的模式进行合并
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```

#### git fetch

与`git pull`不同的是`git fetch`操作仅仅只会拉取远程的更改，不会自动进行merge操作，对你当前代码没有影响

```sh
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>
# 获取远程仓库所有分支的更新
git fetch --all
```

#### git push

#### git branch

```sh
当一个分支被推送并合并到远程分支后，-d 才会本地删除该分支。如果一个分支还没有被推送或者合并，那么可以使用-D强制删除它
# 新建本地分支，但不切换
git branch <branch-name> 
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看本地和远程分支
git branch -a
# 删除本地分支
git branch -D <branch-name>
# 删除远程分支
git branch -d <branch-name>
git push origin --delete <branch-name>
# 重新命名分支
git branch -m <old-branch-name> <new-branch-name> // 如果不在当前要命名的分支上
git branch -m <new-branch-name> // 如果在当前要命名的分支上
// 重命名并未提交到远程分支
```

```sh
# 重新命名分支并同步到远程
# Rename the local branch
$ git branch -m <newbranch>
 
# Delete the old branch on the remote
$ git push <remote> :<oldbranch>
 
# or use --delete
# $ git push <remote> --delete <oldbranch>
 
# Push the new branch, and set up the local branch to track the remote branch
$ git push --set-upstream <remote> <newbranch>
```
