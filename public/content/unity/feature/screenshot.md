## Unity截图方法

### ScreenCapture.CaptureScreenshot（全屏截图）
全屏截图我们使用的是ScreenCapture.CaptureScreenshot 使用全屏截图的优点是：简单、快速的截取某一帧的画面，能够将画面中所有主摄像机能看到的所有画面都截图保存。 缺点就是不能够规定图像大小，只能够全屏截取。截取方法如下
```C#
ScreenCapture.CaptureScreenshot(Application.streamingAssetsPath+"/全屏截图.png", 0);
ScreenCapture.CaptureScreenshotAsTexture();
ScreenCapture.CaptureScreenshotIntoRenderTexture();
```

### ReadPixels （自定义位置及大小截图）
自定义截图我们使用的是Texture2D.ReadPixels，根据一个Rect类型来截取指定范围的屏幕，读取屏幕像素存储为纹理图片。此方法的优点就是截图位置和图片大小可以自己随便定义（注意不要超出屏幕范围→_→）
截图时我们使用协程（IEnumerator），需要在相机渲染完一帧之后执行，所以需要用协程

```C#
IEnumerator ScreenShot() {
  yield return new WaifForEndFrame();
  Rect screenRect = new Rect(0, 0, Screen.width, Screen.height);
  Texture2D m_texture;
  m_texture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
  m_texture.ReadPixels(screenRect, 0, 0);
  m_texture.Apply();
  Convert.ToBase64String(m_texture.EncodeToPNG()); // texture转为png再转banse64
}
```

### RenderTextures （自定义相机以及大小截图）
自定义相机截图，使用RenderTextures，和Texture2D.ReadPixels相比，不同点在于RenderTextures可以读取某个摄像机渲染的像素。使用自定义相机截图的步骤和上一个方法差不多，唯一不同的就是需要设置一下相机渲染然后在进行数据读取截图并保存。
使用RenderTextures的优点就是截屏的时候可以指定设摄像机，适合截屏的时候屏蔽UI。
同样首先是等渲染完一帧之后在进行操作

```C#
IEnumerator ScreenShot(Camera mCamera) {
  yield return new WaifForEndFrame();
  // 初始化一个RenderTexture，然后将其赋值到Camera身上，并激活渲染贴图
  RenderTexture mRender = new RenderTexture((int)mRect.width, (int)mRect.height, 16);
  mCamera.targetTexture = mRender;
  //开始渲染
  mCamera.Render();
  RenderTexture.active = mRender;
  // 定义Texture并读取像素数据
  Texture2D mTexture = new Texture2D((int)mRect.width, (int)mRect.height, TextureFormat.RGB24, false);
  //读取屏幕像素信息并存储为纹理数据
  mTexture.ReadPixels(mRect, 0, 0);
  //应用
  mTexture.Apply();
  // 读取完数据还多做一步才做，那就是释放资源，要将刚刚的渲染数据销毁释放
  mCamera.targetTexture = null;
  RenderTexture.active = null;
  GameObject.Destroy(mRender);
  // 最后把这些纹理数据生成为png图片文件
  byte[] bytes = mTexture.EncodeToPNG();
  string filename = Application.streamingAssetsPath + "/Screenshot.png";
  System.IO.File.WriteAllBytes(filename, bytes);
}
```

### 总结
- 全屏截图（ScreenCapture.CaptureScreenshot） 在全屏截图的时候很方便。
- 自定义截图（Texture2D.ReadPixels） 适合用在自定义图片大小的时候。
- 自定义相机截图（RenderTextures） 截屏的时候可以指定设摄像机，适合截屏的时候屏蔽UI。


### 参考
[截图像素越界](https://blog.csdn.net/qq_41505689/article/details/112545073)
