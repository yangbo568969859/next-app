### DOTween
- transform.DOMove(Vector3.one, 2); DOMoveX DOMoveY DOMoveZ DOLocalMove
- transform.DORotate(new Vector3(50, 50, 50));
- transform.DOScale(new Vector3(2, 2, 2), 2); 缩放
- transform.DOPunch(new Vector3(0, 1, 0), 2, 3, 0.1f); 
- 时间 强度 频次 随机角度 DOShakePosition
- Blend 混合
```C#
transform.DOBlendableMoveBy(new Vector3(1, 1, 1), 1)
transform.DOBlendableMoveBy(new Vector3(-2, -2, -2), 1)
```

### 数字滚动 打印机效果
