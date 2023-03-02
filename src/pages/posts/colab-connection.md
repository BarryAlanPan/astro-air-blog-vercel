---
layout: '../../layouts/MarkdownPost.astro'
title: 'Pycharm及VScode连接Colab'
pubDate: 2021-10-24
description: '通过Cloudflared服务在Colab开通一条隧道让我们能够连接Colab的运行环境'
author: 'Barry'
cover:
  url: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-CleanShot%202021-10-24%20at%2014.01.11%402x.png'
  square: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-CleanShot%202021-10-24%20at%2014.01.11%402x.png'
  alt: 'cover'
tags: ["教程", "Deep Learning"]
theme: 'dark'
featured: true
---

Colab作为Google推出的专为 DeepLearning 打造的 Jupyter Notebook 运行环境，具有强大的GPU甚至专用于神经网络训练的TPU。然而，它也具有很大的局限性。因为Colab仅支持Jupyter Notebook，意味着它不能像专业IDE一样拥有强大的debug工具。本文采用一种折中的办法，通过Cloudflared服务在Colab开通一条隧道让我们能够连接Colab的运行环境。




## 准备材料
---

- 域名一个（阿里，腾讯，freenom等等都可以）
- cloudflare账号
- 科学上网环境（保证稳定）
- 脑子




## Cloudflare准备工作
---

因为需要用到Cloudflare tunnel来连接Colab环境，需要一个域名作为tunnel的基础，

### Cloudflare DNS绑定

进入域名代理商（阿里，腾讯，freenom等等都可以）的域名管理页面，将域名解析的DNS服务器更改为Cloudflare提供的DNS。

![Cloudflare提示更改解析服务器](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055029.png)

![进入域名代理商后台更改解析服务器](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055045.png)

回到Cloudflare确认站点是否被解析代理，这样就完成了域名部分的设置

### Cloudflared服务安装

因为需要用到Cloudflare tunnel完成SSH连接，我们需要在本地[安装Cloudflared服务](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup)并更改SSH Config。

博主用的是MacOS，所以用homebrew完成了安装，安装完成后要找到cloudflared的绝对路径（在后面设置SSH Config会用到）

以homebrew为例，输入

```bash
brew info cloudflared
```

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055103.png)

记下绝对路径后，按照[官方页面引导](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide#2-authenticate-cloudflared)，授权cloudflared将绑定域名作为tunnel即可（无需建立tunnel，只要授权！！！）。



## 开始创建Colab环境
---

到这里，Cloudflare的工作就告一段落了

### Colab中创建tunnel

[Google Colaboratory](https://colab.research.google.com)

> Colab是Google提供的带有免费GPU和TPU的jupyter notebook运行环境

将以下代码复制到新建的笔记本当中。

```python
# 安装SSH环境
!pip install colab_ssh --upgrade

from colab_ssh import launch_ssh_cloudflared, init_git_cloudflared
launch_ssh_cloudflared(password="这里写SSH连接密码")

# 将你的git仓库克隆进来
# init_git_cloudflared('仓库地址')

# 将笔记本连接到你的Google Drive，在跑大型模型的时候不用担心上传问题和模型保存问题了
from google.colab import drive
drive.mount('/content/gdrive/')
```

> 要记得开启GPU/TPU，默认是关闭的。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055158.jpg)

![根据需求选择](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-55201.jpg)

保存后就可以开始执行代码了，执行后会弹出一些提示，首先要更改SSH Config，这里参考MacOS的SSH设置。

```bash
touch ~/.ssh/config
vim ~/.ssh/config
```

进入编辑文件后将提示的Host内容复制进去，同时记得将尖括号改为你Cloudflared的绝对路径（/usr/local/Cellar/cloudflared/2021.10.3/bin/cloudflared 每个人的都不一定一样），一定要到那个文件夹里面看一下cloudflared在不在里面，这一步错了就肯定连不上了。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055204.jpg)

如果要使用SSH进去~~截图GPU装逼~~可以先用命令行连接。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055159.jpg)

这里我SSH连接服务器试一下

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055206.jpg)

Pro计划($ 9.99)提供更高的稳定性和Tesla P100，和传统的GPU服务器相比可以说是非常便宜了。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-55208.jpg)




## IDE连接服务器
---

经过测试，VScode可以正常连接服务器，Pycharm因为bug无法处理SSH config中的转义字符，在2021.3 EAP版本中这个问题被修复。

### VScode连接服务器

首先在扩展中安装插件Remote - SSH。

[Remote - SSH - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

安装完成后连接服务器 → 输入密码 → 打开文件夹，即成功连接到开发环境。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055207.jpg)

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055203.jpg)

### Pycharm连接服务器

因为正式版（2021.2）还有bug，所以用2021.3 EAP进行演示。

首先新增一个环境。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-55204.jpg)

输入地址和登录root账户

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055205.jpg)

输入密码后，把环境改成python3

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055201.jpg)

扫描完包后，完成部署

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055200.jpg)




## 遇到的问题
---

### 命令行连接ssh时报错

```bash
failed to connect to origin error="websocket: bad handshake"
```

**原因**：该问题普遍发生于Colab免费版本，推测是因为免费版本的runtime是受严格限制的，因此ssh服务非常不稳定，甚至无法验证。

**解决方法**：购买Colab Pro或者Colab Pro+付费方案

### Pycharm连接环境时报错

```bash
Server closed connection during identification exchange
```

**原因**：这个问题最早可以追溯到2020年5月，起因是一位同学希望能够通过设置ssh config来自动连接remote interpreter，但是报了相同的错误。

[问题原帖](https://youtrack.jetbrains.com/issue/PY-41977)



这个问题的根源来自Pycharm不能正确的读取环境变量，也就意味着无法识别转义字符。

[错误根源](https://youtrack.jetbrains.com/issue/IDEA-222673)



从日志中也能看出，ssh config中的%h在执行时并没有被转义，而是直接贴了上去。

![](https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2021-10-24-055202.jpg)

**解决方法**：如果真的急用，可以升级2021.3 EAP版，官方在youtrack中确认了环境变量bug的更新将会包含在该版本中，不过EAP版的bug真的很多，不建议使用。
