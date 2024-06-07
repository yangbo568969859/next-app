# Unity 帧率设置

## 设置帧率

通过代码来限定游戏帧率

```C#
Application.targetFrameRate = -1;
```

设置为-1标识不限定帧率，一般情况在手机游戏中限定帧率为30

```C#
Application.targetFrameRate = 30;
```

但是把这个代码添加到工程之后，在Unity中运行起来发现没有起作用，[官网](https://docs.unity3d.com/2021.3/Documentation/ScriptReference/Application-targetFrameRate.html)这么解释

```md
指示游戏尝试以指定的帧率渲染。
默认的targetFrameRate是一个特殊值-1，表示游戏应以平台的默认帧率渲染。此默认速率取决于平台：

- 在独立平台上，默认帧率是可实现的最大帧率。
- 在移动平台上，由于需要节省电池电量，默认帧率小于可实现的最大帧率。移动平台上的默认帧率通常为每秒30帧。
- 所有移动平台可实现的最大帧率都有固定上限，这等于屏幕的刷新率（60Hz=60fps，40Hz=40fps，…）。Screen.currentResolution包含屏幕刷新率。
- 此外，所有移动平台都只能在VBlank上显示帧。因此，应将targetFrameRate设置为-1，或是等于屏幕刷新率的值，或是刷新率除以一个整数。否则，生成的帧率始终小于targetFrameRate。注意：如果将targetFrameRate设置为刷新率除以一个整数，则整数除法得到的有效fps与将QualitySettings.vSyncCount设置为相同整数值时相同。
- iOS会忽略QualitySettings.vSyncCount设置。相反，设备会在帧准备就绪之后的第一个可能VBlank上显示帧，应用程序会实现 targetFrameRate。
- 在[WebGL](https://forum.unity.com/threads/targetframerate-not-working-in-2021-3-1-lts-webgl.1281161/)上，默认值允许浏览器选择帧率来匹配其渲染循环时序，这通常会产生最平滑的效果。只有当您想要限制WebGL上的CPU使用率时，才建议使用非默认值。
使用VR时，Unity将使用SDK指定的目标帧率并忽略游戏指定的值。
设置targetFrameRate不保证会实现帧率。由于平台规格不同，帧率可能会出现波动，或者由于设备速度太慢，游戏可能无法达到帧率。
此外，如果设置了QualitySettings.vSyncCount属性，将忽略targetFrameRate，而游戏将使用vSyncCount和平台的默认渲染率来确定目标帧率。例如，如果平台的默认渲染速率为每秒60帧且vSyncCount设置为2，则游戏将以每秒30帧为目标。
在编辑器中，targetFrameRate仅影响Game视图。不会影响其他编辑器窗口。
```

大致总结

- Application.targetFrameRate是用来让游戏以指定的帧率运行，如果设置为-1就让游戏以最快的速度运行。
- 但是这个设定会垂直同步影响。
- 如果设置了垂直同步，那么就会抛弃这个设定 而根据屏幕硬件的刷新速度来运行。
- 如果设置了垂直同步为1，那么就是60帧。
- 如果设置了为2，那么就是30帧。

## 测试和显示帧率

### 显示帧率

```C#
public class FPSCounter : MonoBehaviour
{
  /// <summary>
  /// 更新显示帧率的时间间隔
  /// </summary>
  private readonly float m_updateTime = 0.5f;
  /// 帧数
  private int my_frames = 0;

  private int preFrameCount = 0;

  public int mHighValue = 30; // 高于这个值显示mHighColor文字
  public int mLowValue = 20; // 低于这个值显示mLowColor文字
  // 显示帧率的Text组件
  public Text mTxtFrameCount;

  // 文字颜色预设
  public Color mHighColor;
  public Color mMidColor;
  public Color mLowColor;

  void OnEnabled()
  {
    StartCoroutine("UpdateCounter");
  }

  void OnDisabled()
  {
    StopCoroutine("UpdateCounter");
  }

  protected IEnumerator UpdateCounter()
  {
    while(true)
    {
      var previousUpdateTime = Time.unscaledTime;
      var previousUpdateFrames = Time.frameCount;

      while (Time.unscaledTime < previousUpdateTime + updateInterval)
      {
        yield return null;
      }
      float newValue = 0f;
      var timeElapsed = Time.unscaledTime - previousUpdateTime;
      var framesChanged = Time.frameCount - previousUpdateFrames;
      newValue = framesChanged / timeElapsed;
      UpdateValue(newValue);
    }
  }

  private void UpdateValue(float value)
  {
    if (mTxtFrameCount == null)
      return;
    int roundedValue = (int)value;

    if (roundedValue != preFrameCount)
    {
      if (roundedValue <= mLowValue)
        mTxtFrameCount.color = mLowColor;
      else if (roundedValue < mHighValue)
        mTxtFrameCount.color = mMidColor;
      else
        mTxtFrameCount.color = mHighColor;
      mTxtFrameCount.text = $"{roundedValue.ToString()} FPS";
    }
  }
}
```
