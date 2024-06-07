# UnityEditor API

## 自定义unity编辑器顶部菜单

```C#
using UnityEditor;

public class TestMenu : MonoBehoviour {
  [MenuItem("Prism/TestMenu", false, 1)] // string itemName, bool isValidateFunction(在调用具有相同itemName的菜单函数之前), int priority(菜单优先顺序)
  static void TestTopMenu () {
    Debug.LogError("测试顶部菜单显示");
  }
}
```
