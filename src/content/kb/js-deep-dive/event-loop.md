---
title: "深入理解事件循环 (Event Loop)"
description: "探索 JS 异步机制的核心：从宏任务到微任务。"
category: "JS 底层"
order: 1
---

# 深入理解事件循环 (Event Loop)

JavaScript 是单线程的，但它如何处理并发？答案就是 Event Loop。

### 核心概念
* **Call Stack**: 执行同步代码。
* **Task Queue (MacroTask)**: setTimeout, setInterval, I/O.
* **MicroTask Queue**: Promise.then, process.nextTick, MutationObserver.

### 执行顺序
1. 执行 Call Stack 中的同步代码。
2. 检查并清空 MicroTask Queue。
3. 渲染页面（如果需要）。
4. 取出 Task Queue 中的第一个任务执行。
5. 重复上述步骤。
