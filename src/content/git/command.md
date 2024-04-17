## Git常用命令

### stash

当你想记录工作目录和索引的当前状态，但又想返回一个干净的目录时， 使用 `git stash`，该命令将保存本地更改，并恢复工作目录以匹配头部提交

#### 应用场景

开发某新需求功能开发到一半，突然有个线上bug需要修复，想要切换到master分支，本地代码未提交，就会报错

```
error: Your local changes to the following files would be overwritten by checkout: XXX
Please commit your changes or stash them before you switch branches.
Aborting 
```

因为当前本地文件有更改且未提交，执行commit命令时需要保持工作区干净才能切换分支；由于情况紧急，你急忙commit上去，commit信息也写了个“暂存代码”，于是该分支提交记录就留下了一条黑历史...

如果学会了使用stash，你只需要

```shell
git stash
```

就这么简单，代码就保存起来了，当你修复完线上bug，切回自己之前开发了一半的分支，想要恢复代码，只需要执行

```shell
git stash apply
```

相关命令

```sh
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近的一次stash
git stash apply

# 应用最近的一次stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop
```

当有多条stash，可以指定操作stash，首先使用 `git stash list` 列出所有记录

```sh
git stash list
stash@{0}: WIP on ...
stash@{1}: WIP on ...
stash@{2}: On ...
```

应用第二条记录

```sh
git stash apply stash@{1}
```

pop drop同理

### reset --soft
>
> 完全不接触索引文件或工作树（但会像所有模式一样，将头部重置为<commit>）。这使得您的所有更改文件更改为“要提交的更改”

回退你已提交的commit，并将commit的修改内容放回到暂存区

一般我们在使用reset命令时，`git reset --hard`会被提及的比较多，他能让commit记录强制回溯到某一个节点。而`git reset --soft`的作用正如其名，`--soft`除了回溯节点外，还会保留节点的修改内容

#### 应用场景

- 一不小心把不该提交的内容commit了，这时想改回来，只能再commit一次，又多了一条“黑历史”
- 规范的团队，一般对于commit的内容要求职责明确，颗粒度要细，便于后续出现问题排查。本来属于两个不同功能的修改，一起commit上去，这种就属于不规范

#### 命令使用

```sh
git reset --soft HEAD^
```

git reset 相当于后悔药，给你重新改过的机会。对于上面的场景，就可以再次修改重新提交，保持干净的commit记录

以上说的还未push的commit，对于已经push的commit，也可以使用该命令，不过再次push时，由于远程分支和本地分支有差异，需要强制推送 `git push -f` 来覆盖被reset的commit

还有一点需要注意，在 `git reset --soft`指定commit，会将该commit到最近一次commit的所有修改内容全部恢复，而不是只针对该commit

### cherry-pick

### revert
>
> 给定一个或多个现有提交，恢复相关提交引入的更改，并记录一些这些更改的新提交。这就要求你的工作树是干净的

将现有的提交还原，恢复提交的内容，并生成一条还原记录

#### 应用场景

线上功能有问题，需要马上撤回，否者会影响系统使用。这时可能会想到用reset回退，可是分支上最新的提交有其他人的代码，用reset会把这部分代码也撤回。情况紧急，你又想不到好方法，只能使用reset，然后再让别人把他的代码合一遍

#### revert普通提交

```sh
git revert HEAD^
```

#### revert合并提交

#### revert和并提交后，再次合并分支会失效

### reflog
>
> 此命令管理重录中记录的信息。
如果说`git reset --soft`是后悔药，那么reflog就是强力后悔药。它记录了所有的commit操作记录，便于错误操作后找回记录

#### 应用场景

- 某天一不小心，发现自己在其他人分支提交了代码还推送到远程分支，这时因为分支只有你的最新提交，就想着使用 `reset --hard`，结果紧张不小心记错了commitHash，reset过头，把同事的commit搞没了。没办法，`reset --hard`是强制回退的，找不到commitHash了，只能让别人从本地分支再推一次
