# 简介
主要用来删除一个目录下的名叫XX的文件夹。我们平时开发项目，经过几年，会积累很多node_modules文件夹，而这个文件占用空间非常大，以至于把磁盘塞满。但又不想一个一个项目去删除，那么这个工具的作用就体现出来了。

#### 安装

```
npm install -g @bve/del-cli
```

#### 用法

在当前目录下生成配置文件
```
bve-del init
```

#### 执行配置文件
执行当前目录下的配置文件。
```
bve-del run
```
执行指定配置文件
```
bve-del run a.config.js
```

#### 也可以直接命令执行，无需配置文件
删除当前目录下的所有node_modules文件夹
```
bve-del run node_modules ./
```