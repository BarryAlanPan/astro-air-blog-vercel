---
layout: '../../layouts/MarkdownPost.astro'
title: '使用Pillow加载图像数据时的通道问题'
pubDate: 2020-07-10
description: '近期在处理医学图像数据，加载图像数据时，遇到了灰度图片加载的问题。'
author: 'Barry'
cover:
  url: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-150120.jpg'
  square: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-150120.jpg'
  alt: 'cover'
tags: ["笔记", "Deep Learning"]
theme: 'dark'
featured: true
---

   近期在处理医学图像数据，加载图像数据时，遇到了灰度图片加载的问题。

   起因是ResNet101只支持3通道的数据输入，而灰度图片不存在RGB通道之分。在训练的过程中遇到了预测结果不准确的问题，让我怀疑是数据集在加载时出了问题，于是查看了加载部分(Dataloader)的代码。

---

## PART Ⅰ: 问题还原

   我通过测试代码模拟了当时加载图片时的情况：

![使用**PIL.Image.open**的默认模式加载图片](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-144957.png)

   可以从图中看到，即便使用默认的图片加载方式打开图片，在image对象转为numpy数组的过程中，也会自动将灰度图片转化为三通道数据（我猜测是.bmp文件的问题）

---

## PART Ⅱ: 解决办法(读取模式)

   经过上网查证时，发现不同的图片（不限于灰度图片）也会在加载时出现类似的通道问题。以当前的128*128的图像数据为例，可能会产生[128, 128, 1]或[128, 128, 3]或[128, 128, 4]的张量。下面给出一些论坛针对不同类型图片的通道问题的解决方案：

![[StackOverFlow 解答一](https://stackoverflow.com/questions/60152049/how-to-convert-pil-image-to-numpy-array)：针对灰度图片载入为单通道数据的方法](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-144959.png)

![[StackOverFlow 解答二](https://stackoverflow.com/questions/44955656/how-to-convert-rgb-pil-image-to-numpy-array-with-3-channels)：针对三通道（或四通道情况）的载入方法](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-144960.png)

   非常容易发现是载入模式的不同，其主要解决办法就是在载入时直接将图像转化为RGB通道数据。⚠️：注意，这种方法同时适用于需要灰度数据的情况，见解答一中的方法。

   下面给出三种载入方式的详细代码：

```python
from PIL import Image

pic = Image.open(img_path)  # 默认加载方式
pic = Image.open(img_path).convert('L')  # 灰度图片的加载方式，返回[128, 128]
pic = Image.open(img_path).convert('RGB')  # 彩色图片的三通道加载方式，返回[128, 128, 3]

img = np.array(pic)  # 先将图片转化为numpy数组

img = torch.from_numpy(img)  # 将numpy数组转化为张量(Tensor)
```

---

## PART Ⅲ: 解决办法(Tensor维度变换 + 传播)

   同时，也可以在载入并转化为Tensor后，对Tensor直接进行变化操作，效果如图：

![通过 **增维 >> 传播** 可以直接实现 **Tensor[128, 128] >> Tensor[128, 128, 1] >> Tensor[128, 128, 3]**](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-07-10-145001.png)

```python
import torch

tensor.unsqueeze_(-1)  # 为Tensor在末尾增加一维
tensor = tensor.expand(-1, -1, 3)  # 让增维后的Tensor传播扩大 ⚠️：这里的"-1"会交给Pytorch自动计算
```
