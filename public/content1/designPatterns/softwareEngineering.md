---
title: 软件工程与技术
description: 软件工程与技术
date: 2021-04-25
---

# 软件工程与技术

## 操作系统

### 微内核结构操作系统

微内核(Microkernel)是一种操作系统的架构设计，它将操作系统的功能划分为多个独立的模块，每个模块运行在自己的地址空间中，模块之间通过消息传递来进行通信，微内核本身只保留了最基本的功能：进程管理、线程管理、内存管理和进程间通信等，其他功能如：设备驱动、文件系统、网络协议栈等都被移动到用户空间，作为独立的服务进程运行

主要特点

- 模块化设计：微内核将操作系统划分为多个独立的模块，每个模块都用明确的功能和接口，模块之间松耦合、易于开发、测试和维护
- 高度可扩展性：由于大部分操作系统的功能都在用户空间实现，因此可以方便地添加删除修改服务而不需要修改内核
- 高可靠性：由于服务进程运行在用户空间，一个服务进程的崩溃不会影响整个系统，内核可以在服务进程出错时重启它
- 安全性：由于服务进程运行在自己的地址空间,它们之间是隔离的,一个服务进程的错误不会影响到其他服务进程
- 可移植性：由于微内核本身很小,只包含最基本的功能,因此可以方便地移植到不同的硬件平台上

缺点

- 性能开销：由于服务进程都运行在用户空间，与内核进行通信需要频繁地切换上下文，导致一定地性能开销
- 复杂性：微内核设计的实现和设计比单内核复杂得多，需要仔细设计模块之间的通信机制和接口

实现

- Mach:由卡内基梅隆大学开发,是最早的微内核操作系统之一。它曾被用于NeXTSTEP和早期的Mac OS X系统。
- QNX:由QNX软件系统公司开发,广泛用于嵌入式系统和实时系统。
- L4:由Jochen Liedtke开发,是一个高度可扩展和可移植的微内核。
- Minix:由Andrew S. Tanenbaum开发,最初是为了教学目的,后来发展成为一个完整的操作系统。
- Hurd:由GNU项目开发,是GNU操作系统的内核,但一直处于开发状态。

### 分时操作系统

分时操作系统(Time-Sharing Operating System)是一种多用户、多任务的操作系统，允许多个用户同时使用一台计算机并为每个用户分配一定的时间片，使得每个用户都能得到及时的响应。分时操作系统的主要目的时提高计算机资源利用率，让多个用户能共享计算机的处理时间，内存空间，I/O设等资源

主要特点

- 支持多用户
- 多任务：允许每个用户同时运行多个任务，系统通过时间片轮转的方式为每个任务分配处理时间
- 交互性：提供了交互式用户界面，用户可以通过终端与系统进行交互，输入命令和数据，并获得及时的响应
- 共享资源：允许多个用户共享系统资源如：处理器、内存、I/O设备等
- 隔离性：提供了一定的隔离性，一个用户的操作不会影响其他用户

局限性

- 性能开销：为了支持多用户多任务，分时系统需要频繁地进行上下文切换和资源管理
- 安全性：由于多个用户共享系统资源，如果没有良好地安全机制，一个用户地操作可能影响别的用户
- 可靠性：多用户同时使用系统，一个用户的错误操作可能导致整个系统崩溃

### 数据库系统

数据库系统(Database System)提供了一种有效地方式来存储、管理和检索大量的结构化数据。数据库系统不仅仅是数据的集合，更是一个完整的软件系统，包括数据库管理系统(DBMS)、数据库应用系统和数据库本身。

主要特点

- 数据持久性
- 数据共享
- 数据独立性
- 数据一致性
- 数据安全性

数据库管理系统(DBMS)负责管理数据库中的数据，提供数据定义、数据操作、数据查询、数据控制等

- 关系型数据库管理系统(RDBMS) MySQL、Oracle、SQL Server
- NOSQL数据库管理系统 MongoDB、Cassandra、Redis等
- NewSQL数据库管理系统 Google Spanner、CockroachDB等

## 架构设计

### 以架构为核心

以架构为核心的软件开发方法是一种强调软件系统整体结构和组织的开发方法。它将软件架构设计作为开发过程的核心，并围绕架构进行各个开发阶段的工作，这种方法的目标是构建高质量、可维护、可扩展的软件系统

关键特点

- 架构驱动
- 迭代和增量开发
- 关注质量属性
- 利用架构模式和风格
- 架构评估和演进
- 团队协作和沟通

### 4+1视图

- 逻辑视图(Logical) 描述系统的功能结构，关注系统的组件、类、对象以及他们之间的关系。逻辑视图主要面向系统的最终用户，展示系统提供的服务和功能
- 开发视图(Development) 描述系统的静态组织结构，关注软件模块、子系统、层次结构以及他们之间的依赖关系。主要面向开发人员，帮助他们理解系统的代码结构和组织方式
- 进程视图(Process) 描述系统的动态行为和运行时结构，关注系统的进程、线程、并发机制以及它们之间的通信和同步。进程视图主要面向系统集成人员和性能分析人员,帮助他们理解系统的运行时行为和性能特征
- 物理视图(Physical) 描述系统的物理部署结构,关注系统的硬件组件、网络拓扑、物理设备以及它们之间的连接关系。物理视图主要面向系统管理员和运维人员,帮助他们理解系统的物理部署和运行环境
- 场景视图(Scenarios) 通过一组重要的用例或场景来描述系统的行为和交互,将其他四个视图联系起来。场景视图主要用于验证和说明其他视图,确保它们能够满足系统的关键需求

## 软件开发

软件维护工具主要有

- 版本控制工具
- 文档分析工具
- 开发信息库工具
- 逆向工程工具
- 再工程工具

- 软件需求分析
  - 数据流图
- 软件概念设计
  - 模块结构图
  - 层次图
  - HIPO图
- 软件详细设计
  - 伪代码
  - 程序流图
  - 盒图

### 软件架构评估方法

- ATAM(Architecture Tradeoff Analysis Method) 架构权衡分析方法
  - 通过利益相关者的参与，识别架构的关键质量属性和场景，并评估架构在满足这些属性时的权衡取舍
  - 包括准备、评估和报告三个阶段，通过结构化的评估架构的适用性和风险
- SAAM(Software Architecture Analysis Method) 软件架构分析方法
  - 一种基于场景的架构评估方法
  - 通过定义一组场景来描述系统的功能和质量需求，并评估架构在满足这些场景时的表现
  - 包括场景开发、架构描述、单个场景评估和场景交互评估等步骤
- ALMA(Architecture-Level Modifiability Analysis) 架构级可修改性分析
  - 用于评估软件架构可修改性的方法
  - 通过分析架构的修改场景和修改影响，评估架构在面对变量时的适应性和灵活性
  - 评估过程包括目标设定、架构描述、变更场景开发、影响分析和结果解释等步骤
- CBAM(Cost Benefit Analysis Method) 成本效益分析法
  - 是一种基于成本效益分析的架构评估方法
  - 通过量化架构决策的成本和收益,帮助利益相关者做出明智的架构选择
  - 评估过程包括准备、收集数据、计算收益和成本、分析结果和制定决策等步骤
- DCAR(Decision-Centric Architecture Review) 以决策为中心的架构审查
  - 是一种以决策为中心的架构评审方法
  - 它通过识别和评估架构中的关键决策,评估这些决策对系统质量属性的影响
  - DCAR的评估过程包括准备、决策识别、决策评估、结果分析和报告等步骤

### 软件开发生命周期

- 评估现有系统（问题定义和规划）
- 确定新系统的要求（需求分析）
- 设计提议的系统（软件设计）
- 开发新系统（程序编码）
- 新系统投入使用（软件测试）
- 新系统完成以及运行一段时间后，需要进行彻底的评估，并时刻进行严格维护

设计阶段

- 系统结构图（SC） 概要设计阶段
- 问题分析图（PAD）详细设计阶段
- 结构化分析（SA）和数据流程图（DFD）需求分析阶段和概要设计阶段

软件开发模型

- 瀑布模型
  - 瀑布模型是一种线性顺序的开发模型,将开发过程划分为几个独立的阶段,如需求分析、设计、实现、测试和维护
  - 每个阶段完成后,才会进入下一个阶段,前一阶段的输出是后一阶段的输入
  - 瀑布模型强调严格的文档管理和阶段评审,适用于需求明确、技术成熟的项目
  - 缺点是灵活性较差,难以适应需求变更,后期发现问题的成本较高
- 迭代模型
- 螺旋模型
  - 螺旋模型是一种风险驱动的迭代开发模型,将项目划分为多个螺旋周期
  - 每个螺旋周期都包括四个阶段:计划、风险分析、开发和评估
  - 螺旋模型强调风险管理和用户反馈,适用于高风险、不确定性较大的项目
  - 缺点是管理复杂,需要有经验的团队和严格的过程控制。
- V模型
- 敏捷模型
  - 敏捷开发模型是一种迭代增量的开发方法,强调快速交付可工作的软件
  - 敏捷开发注重与客户的紧密协作,响应变化,持续改进。
  - 常见的敏捷方法有Scrum、极限编程(XP)、看板等
  - 敏捷开发适用于需求多变、时间紧迫的项目,可以快速适应变化和交付价值。
  - 缺点是对团队的能力和自律性要求较高,需要良好的沟通和协作
- 原型模型
  - 原型模型强调快速开发一个可交互的原型系统,以便与用户沟通和验证需求
  - 通过不断迭代和改进原型,逐步完善系统的功能和性能。
  - 原型模型适用于需求不明确或难以描述的项目,有助于减少需求误解和风险
  - 缺点是原型可能与最终系统差异较大,需要重新开发,增加了开发成本
- 增量模型
  - 增量模型将系统划分为多个独立的增量,每个增量都经历完整的开发过程
  - 每个增量都交付一部分可工作的功能,逐步构建完整的系统
  - 增量模型适用于大型复杂项目,可以提前交付部分功能,获得用户反馈
  - 缺点是需要仔细规划增量划分,确保增量之间的依赖关系和集成
- 大爆炸模型

软件构件

软件构件(Software Component)是一种可重用、独立部署和可组合的软件单元,它封装了特定的功能或服务,并通过明确定义的接口与其他构件进行交互。软件构件是构建大型复杂软件系统的基本构建块,通过将系统划分为多个可重用的构件,可以提高软件的模块化、可维护性和可扩展性

- 独立性(Independence):构件是一个独立的软件单元,它封装了内部实现细节,并提供了明确定义的接口。构件可以独立开发、测试和部署,不依赖于其他构件的内部实现
- 可重用性(Reusability):构件被设计为可重用的软件单元,可以在不同的应用程序和上下文中被使用。通过将常见的功能封装到构件中,可以减少重复开发的工作量,提高开发效率。
- 可组合性(Composability):构件可以与其他构件组合在一起,形成更大的软件系统。通过定义明确的接口和契约,构件可以相互协作和通信,实现复杂的功能
- 封装性(Encapsulation):构件将内部实现细节隐藏起来,只通过接口与外部交互。这种封装性使得构件的内部实现可以独立演化和优化,而不影响其他构件的使用
- 可替换性(Replaceability):构件可以被其他功能相似的构件所替换,而不影响系统的整体行为。通过定义标准化的接口,可以实现构件的插拔式替换,提高系统的灵活性和可维护性。

## 数据库

数据库事务基本属性

- 原子性 atomicity
- 一致性 consitency
- 隔离性 isolation
- 持久性 durability

### 面向对象设计

面向对象设计时包含的主要活动（使用对象而不是仅仅是函数和逻辑来表示数据和行为）

- 识别类及对象：在问题域中识别出应该由软件表示的实体
- 定义属性：确定每个类和对象的状态，即他们的属性或数据成员
- 定义服务(操作)：定义每个类和对象可以执行的行为，即他们的方法或成员函数
- 识别关系：包括继承、关联、依赖和聚合
- 识别包：组织类和对象，通常用于命名空间管理和逻辑分组