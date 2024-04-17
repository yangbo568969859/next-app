### .gitignore 不生效的解决方案

当我们将 .gitignore 文件配置好后，却往往不能失效。这是因为 .gitignore 只能忽略那些没有被追踪(track)的文件，因为 git 存在本地缓存，如果文件已经纳入了版本管理，那么修改 .gitignore 是不能失效的。那么解决方案就是要将 git 的本地缓存删除，然后重新提交。

往往是因为git上的文件没有删除，某些文件已经被纳入了版本管理中，修改 .gitignore 是无效的

解决方法就是先把本地缓存删除（改变成未被追踪状态），然后再提交：

```shell
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

删除指定文件的缓存

```shell
git rm -r --cached src/main/resources/application-local.yml
```

### You have not concluded your merge (MERGE_HEAD exists)

Undo the merge and pull again.
To undo a merge:
git merge --abort [Since git version 1.7.4]
git reset --merge [prior git versions]

### .git 文件过大

### git 一直登录问题

```shell
## 全局的
git config --global credential.helper store

git config --global user.email "email"
git config --global user.name "name"

```

```shell
## local
git config --local credential.helper store

git config --local user.email "email"
git config --local user.name "name"
```
