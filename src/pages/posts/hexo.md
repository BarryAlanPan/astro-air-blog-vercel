---
layout: '../../layouts/MarkdownPost.astro'
title: 'Hexo框架实现个人博客'
pubDate: 2019-07-04
description: '本文志在教会同学们动手搭建个人博客，作为很好的知识储备工具'
author: 'Barry'
cover:
  url: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-131816.jpg'
  square: 'https://barrypan-blog.oss-cn-shanghai.aliyuncs.com/PicStorage/2020-02-08-131816.jpg'
  alt: 'cover'
tags: ["Hexo", "教程"]
theme: 'dark'
featured: true
---

本文参考自B站优秀up主的视频：https://www.bilibili.com/video/av44544186

## 本地调试

1. 安装node.js
   - 查看nodejs和npm版本
2. 安装cnpm
   - npm install -g cnpm --registry=https://registry.npm.taobao.org
3. 安装hexo
   - cnpm install -g hexo-cli
   - 验证hexo（hexo -v）
4. 在目录下建立博客文件夹，同时cd进目录
5. 安装git
6. 创建架构
   - hexo init
7. 开始本地调试
   - hexo s
8. 创建博文
   - hexo new "我的第一篇博文"
   - 文章会自动生成在/source/_post目录下
9. 清理并生成
   - hexo clean
   - hexo g

------

## 远端部署

1. 登陆GitHub并新建仓库

   - 仓库名为"用户名.github.io"
   - 创建

2. 在博客目录下安装git插件

   - cnpm install --save hexo-deployer-git

3. 设置_config.yml

   - 在Deployment下的type: 后加上git（注意！type:和git间有一空格）

   - 在type项下一行加

     ```
     repo: 仓库链接
     ```

   - 下一行加

     ```
     branch: master
     ```

     

4. 设置git

   - ```
     git config --global user.name "Your Name"
     git config --global user.email "email@example.com"
     ```

5. 部署到远端

   - hexo d
   - 登陆github

6. **大功告成！！！**

   - 仓库名.github.io

------

## 主题更换

1. 下载zip包解压在themes文件夹下或git clone下来

2. 在博客目录中更改

   - ```
     theme: 主题名（默认是landscape）
     ```

     

3. 清理并生成

   - hexo clean
   - hexo g

4. 调试并部署

------

## 进阶部分（域名更改）

## 嫌xxx.github.com太丑了？花钱买一个域名！

1. ping你的个人博客（xxx.github.io），拿到IP地址后复制下来

2. 对你的域名进行管理

   - 添加解析

   - | 记录类型 | 主机记录 | 解析线路 |    记录值     | TTL值  |
     | :------: | :------: | :------: | :-----------: | :----: |
     |  CNAME   |   www    |   默认   | xxx.github.io | 10分钟 |
     |    A     |    @     |   默认   |    IP地址     | 10分钟 |

     

3. 最后一步

   - 到github项目中
   - 找到Github Pages一栏
   - 在Custom Domain填上你的域名并保存（注意：域名指"xxx.cn"等等）
   - 等待十分钟，开始愉快的玩耍
