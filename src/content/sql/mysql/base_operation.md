# 数据库基本操作

## MySQL 启动和停止

```shell
# 管理员权限下运行
# 启动
net start mysql
# 终止
net stop mysql
```

## 数据库登录

```shell
mysql -u root -p
```

## 创建数据库

```shell
create database blog;
```

## 查看所有数据库

```shell
show databases;
```

## 选中某一数据库

```shell
use blog;
```

## 查看所有数据表

```shell
show tables;
```

## 删除数据库

```shell
drop database blog;
```

## 表操作

### 创建表

```sql
CREATE TABLE student (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Id',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  gender VARCHAR(10) NOT NULL COMMENT '性别',
  age INT NOT NULL COMMENT '年龄',
  class VARCHAR(50) NOT NULL COMMENT '班级名',
  score INT NOT NULL COMMENT '分数'
) charset utf8;
```

### 删除表

```sql
drop table student;
```

### 插入数据

```sql
INSERT INTO student (name, gender, age, class, score) VALUES ('张三', '男', 18, '一年级一班', 90), 
('李四', '女', 19, '一年级一班', 80), ('王五', '男', 20, '一年级二班', 70);
```

### 查询列

```shell
select name, score from student;
# as命名列
select name as "姓名", score as "分数" from student;
# where条件
select name as "姓名", score as "分数" from student where age > 18;
# where条件and连接多个
select name as "姓名", score as "分数" from student where age > 18 and gender='男';
# 用 LIKE 做模糊查询
select * from student where name like '王%';
# 通过 in 来指定一个集合：
select * from student where class in ('一年级二班', '一年级一班');
# not in：
select * from student where class not in ('一年级二班');
# 通过 between and 来指定一个区间
select * from student where age between 18 and 20;
# 通过limit实现分页返回
select * from student limit 0,5;
# 简写
select * from student limit 5;
#第二页的数据
select * from student limit 5,5;
# 通过 order by 来指定排序的列，asc表示升序，desc表示降序
select name, score, age from student order by score asc,age desc;
# 分组统计每个班级的平均成绩：
SELECT class as '班级', AVG(score) AS '平均成绩' FROM student GROUP BY class ORDER BY '平均成绩' DESC;
# 通过count统计班级人数
select class, count(*) as count from student group by class;
# 根据having统计
SELECT class,AVG(score) AS avg_score FROM student GROUP BY class HAVING avg_score > 90;
# distinct去重
SELECT distinct class FROM student;
```

## 内置函数

### 聚合函数

用于对数据的统计，比如AVG、COUNT、MAX、MIN、SUM等。

```sql
select avg(score) as '平均成绩',count(*) as '人数',sum(score) as '总成绩',min(score) as '最低分', max(score) as '最高分' from student;
```

### 字符串函数

用于对字符串的处理，比如 CONCAT、SUBSTR、LENGTH、UPPER、LOWER

```sql
SELECT CONCAT('xx', name, 'yy'), SUBSTR(name,2,3), LENGTH(name), UPPER('aa'), LOWER('TT') FROM student;
```

其中，substr 第二个参数表示开始的下标（mysql 下标从 1 开始），所以 substr('一二三',2,3) 的结果是 '二三'。

当然，也可以不写结束下标 substr('一二三',2)

### 数值函数

用于对数值的处理，比如 ROUND、CEIL、FLOOR、ABS、MOD

```sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```

### 日期函数

对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY

```sql
SELECT YEAR('2023-06-01 22:06:03'), MONTH('2023-06-01 22:06:03'),DAY('2023-06-01 22:06:03'),DATE('2023-06-01 22:06:03'), TIME('2023-06-01 22:06:03');
```

### 条件函数

根据条件是否成立返回不同的值，比如 IF、CASE

```sql
select name, if(score >=60, '及格', '不及格') from student;

SELECT name, score, CASE WHEN score >=90 THEN '优秀' WHEN score >=60 THEN '良好'ELSE '差' END AS '档次' FROM student;
```

if 和 case 函数和 js 里的 if、swtch 语句很像，很容易理解。

if 函数适合单个条件，case 适合多个条件。

### 系统函数

用于获取系统信息，比如 VERSION、DATABASE、USER

```sql
select VERSION(), DATABASE(), USER()
```

### 其他函数

NULLIF、COALESCE、GREATEST、LEAST

- NULLIF：如果相等返回 null，不相等返回第一个值。
- COALESCE：返回第一个非 null 的值：
- GREATEST、LEAST：返回几个值中最大最小的。

```shell
select NULLIF(1,1), NULLIF(1,2);
select COALESCE(null, 1), COALESCE(null, null, 2);
select GREATEST(1,2,3),LEAST(1,2,3,4);
```

### 类型转换函数

转换类型为另一种，比如 CAST、CONVERT、DATE_FORMAT、STR_TO_DATE

```shell
select greatest(1, '123',3);
# 3 最大，因为它并没有把 '123' 当成数字.
```

用 convert 或者 cast 做类型转换：

```shell
select greatest(1, convert('123', signed),3);
select greatest(1, cast('123' as signed),3);
```

## JOIN ON 关联查询

### 一对一查询

```sql
CREATE TABLE `mysql2-test`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` VARCHAR(45) NOT NULL COMMENT '名字',
  PRIMARY KEY (`id`)
);
```

```sql
CREATE TABLE `id_card` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `card_name` varchar(45) NOT NULL COMMENT '身份证号',
  `user_id` int DEFAULT NULL COMMENT '用户 id',
  PRIMARY KEY (`id`),
  INDEX `card_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)  CHARSET=utf8mb4;
```

```sql
INSERT INTO `user` (`name`)
VALUES
  ('张三'),
  ('李四'),
  ('王五'),
  ('赵六'),
  ('孙七'),
  ('周八'),
  ('吴九'),
  ('郑十'),
  ('钱十一'),
  ('陈十二');
```

```sql
INSERT INTO id_card (card_name, user_id) 
VALUES
  ('110101199001011234',1),
  ('310101199002022345',2),
  ('440101199003033456',3),
  ('440301199004044567',4),
  ('510101199005055678',5),
  ('330101199006066789',6),
  ('320101199007077890',7),
  ('500101199008088901',8),
  ('420101199009099012',9),
  ('610101199010101023',10);
```

```sql
SELECT * FROM user JOIN id_card ON user.id = id_card.user_id;

SELECT user.id, name, id_card.id as card_id, card_name 
  FROM user
  JOIN id_card ON user.id = id_card.user_id;
```

- INNER JOIN 是只返回两个表中能关联上的数据
- LEFT JOIN 是额外返回左表中没有关联上的数据。
- RIGHT JOIN 是额外返回右表中没有关联上的数据。

### 一对多查询

### 多对多查询

## 子查询
