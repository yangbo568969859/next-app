
### [人像抠图](https://www.techug.com/post/how-are-various-backgrounds-realized-during-live-broadcasting-talk-about-the-technology-behind-the-virtual-background/)

#### 实时语义分割


#### 算法探索
- 优化边缘
  - 第一种优化边缘的方法构造边缘损失，参考 MODNet，通过对人像标签进行膨胀腐蚀操作，得到人像边缘区域标签，通过对边缘区域计算损失来增强网络对边缘结构的提取能力。
  - 第二种优化边缘方法是使用 OHEM 损失，相比于人像主体区域，人像边缘区域往往容易错误分类，在训练时，通过对人像分割的预测结果进行在线难例挖掘，可以隐性地优化人像边缘区域
- 无监督学习
  - 第一种无监督学习方法通过数据增强实现，参考 PortraitNet，对于给定的一张输入图片图片，对其颜色、高斯模糊和噪声组成的数据增强处理后得到变换后的图片图片，虽然图片相对图片在外观上发生了变化，但变化前后两张图片对应的前景人像是一样的，因此，可以通过 KL Loss 约束数据增强前后图片预测结果保持一致，从而增强网络对光照、模糊等外界条件变化的鲁棒性。
  - 第二种无监督学习方法是通过利用无标签的真实图片和背景图片进行对抗训练实现，参考 Background Matting，在模型训练时，通过引入额外的鉴别器网络，判断输入鉴别器的图片是由网络预测的人像前景和随机背景合成的，还是真实的图片，减少人像预测结果中存在的 artifact
- 多任务学习
  - 多任务学习通常是指增加与原任务相关的子任务进行协同训练，提升网络在原任务上的效果，例如 Mask-RCNN 中检测和分割任务。人像分割的难点之一是当视频中的人像做出一定动作时（例如挥手等），对于手臂等部位的分割效果较差。为了更好的捕捉人体的信息，我们尝试在模型训练引入人体姿势信息进行多任务训练，参考 Pose2Seg，通过解析人像姿势来更好地的捕捉肢体动作信息。在测试时，只需使用训练的人像分割分支进行推理，能在提升分割的准确率的同时，兼顾了性能
- 模型轻量化
  - 针对业务场景的需要，我们选用了基于 mobilenet-V2 网络的 U-net 结构，根据 mnn 算子的特点，对模型进行优化裁剪，以满足实际业务性能需求
- 策略优化
  - 在实际开会场景中，不少参会人员在很多时候是保持不动的。在这种状态下，用实时帧率去做人像分割，存在一定的浪费资源。针对这种场景，我们设计了一种边缘位置帧差法，基于相邻帧人像边缘区域的变化，对人像是否移动进行准确判断，同时该方法能够有效去除人物说话、表情变化、外部区域变化等干扰。边缘位置帧差法可以有效降低参会人员静止时人像分割算法的频率，从而大大降低了能耗
#### 数据工程
人像分割对于数据较为依赖，现有的开源数据集与会议场景有较大差异，而分割数据的标注获取费时费力，为了降低数据获取成本、提升已有数据的利用率，我们尝试在数据合成、自动化标注上做了一些尝试。
- 数据合成
  - 在数据合成时，我们利用已有模型筛选出部分较好的子数据集，利用平移、旋转、薄板变换等方式，增加人像姿态和动作的多样性，然后与会议场景的不同背景进行融合，扩充训练数据。在数据变换时，若人像标签与边界相交，则利用坐标关系，在合成新图片时，保持标签和边界的原有相交关系，避免人像与边界分离、浮空等现象，让生成的图片更加真实
- 自动化标注、清洗
  - 利用多种开源的检测、分割、matting算法，设计一套高效的自动化标注，清洗工具，进行数据的快速自动化打标和清洗质检，降低数据标注获取成本

### 基于webGL实现美颜
### Web视频超分探索
- web平台主要深度学习工具箱
- 基于Tensorflow.js的超分实现
```js
// 视频数据获取
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("2d");
gl.drawImage(video, 0, 0);
var imageData = gl.getImageData(0, 0, width, height);
```
```js
// 神经网络模型加载和推理
var model = await tf.loadLayersModel("sr-tf/model.json");
const inputTensor = tf.tensor(inputs, [1, 1, height, width], 'float32');
model.summary();
const prediction = model.predict(inputTensor);
const outputY = await prediction.data();
```
```js
// 超分图像显示
var srImage = new ImageData(srDataArray, width * 2, height * 2);
document.getElementBuId('tf-canvas').getCntext('2d').putImageData(srImage, 0, 0);
```
- Tensorflow.js定制接口
  - 增加从Video生成纹理的输入接口：该接口以HTMLVideoElement为参数，直接将从Video元素生成texture，避免从javascript输入图像数据
  - 增加推理结果的纹理获取接口：通过该接口应用可以直接从tensorflow.js拿到Texture推理结果，应用可以通过webGL对结果继续进行处理直至在canvas中显示，避免超分数据在GPU和CPU之间复制
- 性能分析
### 高效实时视频处理
### Web 平台深度神经网络的应用及优化
### 传输到 WebRTC
WebRTC 的传输离不开媒体流（MediaStream），MediaStream 是一个媒体内容的流，一个流包含几个轨道，比如视频和音频轨道。

WebGL 的使用是在 canvas 中进行的，我们可以通过 canvas 的 caputureStream API 获取到 mediaStream 对象，获取后即可进行传输
