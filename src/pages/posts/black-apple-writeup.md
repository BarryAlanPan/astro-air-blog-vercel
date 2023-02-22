---
layout: '../../layouts/MarkdownPost.astro'
title: '黑苹果装机WriteUp'
pubDate: 2035-07-01
description: '19年折腾黑苹果装机的一些记录'
author: 'Barry'
cover:
  url: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-130708.jpg'
  square: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-130708.jpg'
  alt: 'cover'
tags: ["黑苹果", "装机"]
theme: 'dark'
featured: true
---

![在印度马哈拉施特拉邦，Apple 与 Applied Environmental Research Foundation 展开合作，对红树林进行保护与培育。这一海岸森林生态系统可以吸收和存储大气中的二氧化碳。|wide](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-130708.jpg)

## 写在开头

​	2019年7月30日，在我心中酝酿许久的那颗对于MacOS的渴望之心，终于还是迸发了出来，也就有了这个Write Up，旨在能够让自己坚持搞下去（毕竟大价钱买的SSD）且能给后面要装黑苹果的同学铺个路，不多说，直接上配置。


## 配置

> 笔记本机型：神舟战神G8-KP7S1
> 主板：Notebook P65_67HSHP ( 100 Series/C230 Series 芯片组 Family - A152 )
> CPU：英特尔 Core i7-7700HQ @ 2.80GHz 四核
> 内存：16 GB ( 英睿达 DDR4 2400MHz )
> 显卡：Nvidia GeForce GTX 1070 ( 8 GB / 蓝天(CLEVO) )
> 声卡：瑞昱 ALC899 @ 英特尔 High Definition Audio 控制器
> 网卡：瑞昱 RTL8168/8111/8112 Gigabit Ethernet Controller / 蓝天(CLEVO)

## Day1

​	开始装机，这款神舟用的蓝天准系统 公模，所以拆完D面就直接找到了多出的M.2接口

![ D面大体就是这个亚子 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125547.jpg)


![ 如图，左边有一个空闲的M.2插槽 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125552.jpg)

​	然而问题来了，我拿手边一个空闲的SSD试了一下发现接口对不上，在查阅后发现了问题，原来是因为M.2接口也分Socket2和Socket3，而他们的区别也不止在支持的协议上，还有他们的接口形状。

![ 图示为2和3明显的接口区别，购买时千万不要踩坑 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125556.png)

​	观察完了插槽和接口还不够，我拨打了神舟客服询问了该拓展插槽支持的协议，惊奇的发现不支持NVMe，只支持SATA和PCIe，最终我只得放弃三星的高速SSD，选择了Intel的稳定且价格较低的500G SSD。

![1](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125550.png)

​	然后就是坐等到货的漫长时光啦，Day1 END。。。

## Day2

​	今天算是工程中最重要的步骤之一，我要检查是否每个硬件都有其对应的apple原生驱动，首先来到声卡，这很明显是一块板载的ALC899声卡，我查了下，竟恰好有托管在github上的项目专门针对ALC899在MacOS中的原生高音质输出进行体现和维护

![ Github中的项目 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125547.png)

​	然后就是烧录U盘了，我用的balenaetcher，这是一个在Github上的开源项目，支持MacOS的dmg安装文件的烧录，但在烧录之前，我还要校验一遍MD5来确保dmg文件没有问题，然后烧录进去。

​	在烧录完的盘里配置了一下plist文件，研究了很多关于配置的文章，坐等明天取回盘后开工！

​	Day2 END

## Day3

​	硬盘取回家前，先将系统包（包内含用于EFI恢复的PE系统、Clover引导和苹果系统安装程序）烧录进U盘

![ ESP分区内的EFI为Clover引导文件夹 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125555.jpg)

![ 烧录完后的U盘存储结构 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125550.jpg)

​	我们已经确认了ESP分区为存放Clover引导的地方，PE分区显然是PE系统，而5.77GB的分区我们可以猜测就是MacOS的安装包存放位置

​	下面就进入到装SSD环节

![ 可以明显的看到神舟原厂并没有给配M.2螺丝 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125558.jpg)

![ 而螺丝的短小超出了我的想象 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125548.jpg)

​	最后只得利用我所能找到最短且口径相同的螺丝代替，SSD仍存在松动，这也是我不得不吐槽神舟的地方，盒子里不给配螺丝，扩展位也不给螺丝，非常不方便加装。

​	烧录完成后我重新插拔U盘并进行重启，在开机页面F2进入BIOS页面，选择通过USB启动，成功的进入了Clover引导页面，然而迎来的却是更大的问题

![ Clover只能识别Windows系统，却识别不到安装包 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125553.jpg)

​	最终尝试N次后无果，确认是镜像出了问题，立即换了网站下载镜像并重复以上步骤，进入Clover页面终于看到了安装包选项，接下来是更头疼的问题

![ 滚代码时屏幕出现🚫符号 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125554.jpg)

​	在查阅CSDN和简书中的类似问题后发现，一切有关🚫的问题都指向了“Couldn't allocate memory”这个Error，翻译成中文就是无法分配内存，而这只有在Mac系统下的Clover Configure中设置EFI才能解决，也就是说在当前情况下这个问题是无解的，最后只得借助网上已经配好的EFI碰运气，终于在更换了一个类似机型的config.plist文件后进入了安装页面（具体解决原理会在后面讲到）

![ 一开始尝试更改启动选项为AHCI，然而没有效果 ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125556.jpg)

![1](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125549.jpg)

![ 成功进入安装页面后的成就感（虽然当时的EFI是抄来的） ](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-125557.jpg)

​	就这样，系统成功安装，但是在使用方面仍存在很多问题，也是后面几天会解决的问题，到Day3结束时就已经查询了近百篇博客，知识量的庞大非常考验人的毅力和总结能力，因为黑苹果的许多特殊原因（错误的多样性等等），有许多问题需要自己去尝试和寻找答案，这是个高压且工作量巨大的过程。

Day3 END
