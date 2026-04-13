---
title: "Cesium 环境搭建与快速入门"
description: "开启 3D 空间可视化之旅：渲染你的第一个地球。"
category: "空间引擎"
order: 1
---

# Cesium 快速入门

Cesium 是目前最强大的 Web 3D 空间可视化引擎之一。

### 基础设置
1. 注册 Cesium Ion 获取 Access Token。
2. 安装 `cesium` 依赖。
3. 初始化 Viewer 实例。

```js
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});
```

### 未来探索
* **3D Tiles**: 渲染大规模建筑群。
* **Entity API**: 创建动态实体。
* **Czml**: 描述随时间变化的数据。
