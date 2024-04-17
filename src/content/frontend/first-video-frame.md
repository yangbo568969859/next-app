## 获取视频第一帧
```js
// file 文件可以利用 URL.createObjectURL(file) 转成本地url
const getVideoPoster = (url, time = 1, coverWidth = 300) => {
  let width = 0
  let height = 0
  let dataURL = ''
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    video.currentTime = time // 获取视频第1s封面，可根据自身需求调整
    video.setAttribute('crossOrigin', 'anonymous')
    video.setAttribute('src', url)
    // Object.assign(video, {
    //   currentTime: time,
    //   src: url,
    //   crossOrigin: 'anonymous'
    // })
    video.addEventListener('loadeddata', function () {
      width = video.videoWidth
      height = video.videoHeight
      // 视频宽度过宽进行压缩，防止输出图片过大，设置最大宽度为outputWidth，可调整
      if (width > coverWidth) {
        height = height * coverWidth / width // 获取压缩后高度
        width = coverWidth
      }
      // 通过canvas输出图片
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      // Object.assign(canvas, {
      //   width: width,
      //   height: height
      // })
      if (canvas) {
        canvas.getContext('2d').drawImage(video, 0, 0, width, height)
        dataURL = canvas.toDataURL('image/jpeg')
        resolve(dataURL)
      }
    })
  })
}
```
