# Unity 工作流

## unity工程目录结构及用途

| 特殊文件夹 | 作用 |
| --- | ---- |
| Asset | 用来存储和重用的项目资产，导入和生成的静态资源都会放在这里 |
| Library | 用来存储项目内部资产数据信息的目录，主要时Unity内部使用，不需要代码托管（项目资源出问题优先删这个） |
| Packages | 用来存储项目的包文件 |
| ProjectSettings | 用来存储项目设置的信息 |
| UserSettings | 用来存储用户设置信息 |
| Temp | 用来存储使用Unity编辑器打开项目时的临时数据，一旦关闭Untiy编辑器也会被删除 |
| Logs | 用来存储项目的日志信息，不包含编辑器日志信息 |

## Unity Assets目录中的特殊文件夹及用途

| 特殊文件夹 | 作用 |
| --- | ---- |
| Editor | 可多个，存放编辑器使用的脚本和资源，用来扩展编辑器功能的，不会发布到应用程序，也不会在运行时运行 |
| Editor Default Resources | 根目录唯一，存放编辑器默认资源 |
| Gizmos | 根目录唯一，特殊对象图标，该目录不会发布到运行时 |
| Plugins | 2019后无，但仍可用，仍能保证其中代码编译的优先顺序，2019后一般用asmdef文件定义 |
| Resources | 可以多个，使用Resources.load加载，在Editor中使用也会剥离出应用程序，使用这个容易造成性能问题（包体积过大，启动时间增加，内存消耗增加），建议正式项目中一定不要有此文件夹，使用AB包构建加载 |
| Standard Assets | 根目录唯一，其中代码编译优先，存放导入的标准资源包，一般很少使用 |
| StreamingAssets | 根目录唯一，不随程序构建，希望原始文件格式保持的资源 |
| 忽略导入的文件夹 | . ~ cvs .tmp |

## Assets目录结构设计

- 一级目录设计原则：
  - 目录尽可能少
  - 区分编辑模式与运行模式
  - 区分工程大版本（比如说按mod、资料片划分）
  - 访问场景文件、全局配置文件便捷
  - 不在一级目录做资源类别区分，只有Video类视频建议直接放到StreamAssets下
- 二级目录设计原则：
  - 只区分资源类型
  - 资源类型大类划分要齐全
  - 不做子类型区分
  - 不做功能区分
  - 不做生命周期区分
- 三级目录设计原则：
  - Audio/Texture/Models三级目录做子类型区分
  - 其他类型资源可按功能模块/生命周期区分

## 资源导入工作流

### 手动编写工具

- 优点：根据项目特点自定义安排导入工作流，并且可以和后续资源制作与打包发布工作流结合
- 缺点：存在开发和维护成本，会让编辑器页面变得复杂
- 适合类型：大型商业游戏团队
- 相关接口
  - AssetPostprocessor
    - 编写编辑器代码继承AssetPostprocesser对象自定义实现一些列OnPreprocessXXX接口修改资源导入设置属性
    - 需要考虑相同资源不同配置的设置，一般会根据文件路径或文件名区分
    - 导入资源设置持久化问题，使用scriptObject、preset解决
    - 开发者可能导入后修改了资源设置，有些开发团队是打包前再次设置，但这样做可能有些问题（错误或性能问题）只有打包后才能暴露
  - AssetsModifiedProcessor（新试验接口）
    - 资源被添加、删除、修改、移动时回调该对象的OnAssetsModified接口
    - 可以解决导入后修改的问题
```C#
public class XXXAssetPostprocessor : AssetPostprocessor 
{
	public void OnPreprocessXXXAsset()
	{
		XXXAssetImporter xxxImporter = (XXXAssetImporter)assetImporter;
		xxxImporter.属性 = xxx
		...
		xxxImporter.SaveAndReimport();
	}
}
```
```C#
void OnAssetsModified(string[] changedAssets, string[] addedAssets, string[] deletedAssets, AssetMoveInfo[] movedAssets)
{
		...
}
```

### 利用 Presets 功能
Presets是什么

- 将相同属性设置跨多个组件、资源或项目设置保存和应用的资源，该资源运行时没有效果，仅能在Unity编辑器下使用，2018版本引入。
- 其实就是将资源的设置保存成preset，然后重复应用相同设置。
- preset manager可以管理这些preset。支持不同目录、文件名导入时直接应用对应preset
- 但还是只能导入时设置，建议配合AssetsModifiedProcessor使用

优点： 使用简单方便，只需要Assets目录结构合理规范即可
缺点： 无法和后续工作流整合，只适合做资源导入设置。
适合类型：小型团队或中小规模项目
参考资料：[https://docs.unity3d.com/cn/2021.2/Manual/DefaultPresetsByFolder.html](https://docs.unity3d.com/cn/2021.2/Manual/DefaultPresetsByFolder.html)

### 利用AssetGraph工具

优点： 功能全，覆盖Unity资源工作流全流程，节点化编辑，直观

缺点： 有一定上手成本，一些自定义生成节点也需要开发，Unity日本团队制作，不是Unity标准包，Unity新功能支持较慢。

适合类型： 任何规模项目和中大型团队

AssetGraph仓库地址： [https://github.com/Unity-Technologies/AssetGraph](https://github.com/Unity-Technologies/AssetGraph)
