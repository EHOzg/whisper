---
title: "vue 响应式原理"
description: ""
category: "网络技术"
order: 1
---

### 响应式数据的最终目标

响应式数据的最终目标 是当对象本身或属性发生变化时，将会运行一些函数，最常见的就是render函数
再具体是线上，vue用到了几个核心部件：

1. observer（观察者）：用来把数据变成响应式数据
2. Dep（依赖收集器）：用来收集依赖
3. Watcher（观察者）：用来收集依赖
4. Scheduler(调度器): 用来调度Watcher的执行

### Observer

Observer是Vue响应式系统的核心，它的作用是将普通JavaScript对象转换为响应式对象，使其能够响应数据的变化
一般来说当 obj.a = 3 这里相当于obj的一个属性改变了 但是没有任何内容察觉到对象属性改变了，这时候observer就把对象的每个属性通过 object.defineProperty 转换为带有getter 和 setter的属性，这样一来，当访问或设置属性时，vue就有机会做一些别的事情
