---
title: "现代图形学笔记：从光栅化到物理渲染"
description: "记录图形学底层的数学之美、三维空间转换，以及 PBR 材质与纹理采样的核心逻辑。"
pubDate: 2026-06-12
tags: ["图形学", "WebGL", "Three.js", "PBR"]
---

在用 Three.js 构建 3D 场景时，我们习惯了直接创建 `Mesh`、赋予 `Material`、扔进 `Scene`。但当纹理出现锯齿、光影效果不够逼真，或者性能遇到严重瓶颈时，唯有回到图形学底层，才能理解 GPU 在屏幕背后究竟做了什么。

这篇笔记记录了从坐标变换、纹理采样到物理渲染（PBR）的核心逻辑。

---

## 坐标变换：从三维世界到二维屏幕

一个顶点要渲染到屏幕上，需要经历一系列空间转换。这套变换链条通常被称为 **MVP 矩阵**：

1. **局部空间（Local Space / Object Space）**：模型自身的坐标系。
2. **世界空间（World Space）**：通过 **Model 矩阵** 将模型放置到场景中的具体位置。
3. **相机空间（View Space / Eye Space）**：以相机为原点、相机朝向为 Z 轴的坐标系。通过 **View 矩阵** 转换。
4. **裁剪空间（Clip Space）**：通过 **Projection 矩阵**（透视或正交）转换。此时顶点坐标表示为齐次坐标 $(x, y, z, w)$。超出视锥体（Frustum）的顶点会被裁剪掉。
5. **NDC 空间（Normalized Device Coordinates）**：通过透视除法（Perspective Division，即所有坐标除以 $w$）后，坐标范围被归一化到 $[-1, 1]^3$。
6. **屏幕空间（Screen Space）**：通过视口变换（Viewport Transform）映射到实际的像素分辨率。

在编写 Vertex Shader 时，我们最常写的代码就是：

```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
```

这行代码一步到位，完成了从局部空间到裁剪空间的转换。

---

## 纹理采样：像素与像素的映射

纹理本质上是一个二维色彩数组，其坐标称为 UV 坐标，范围在 $[0, 1]$ 之间。把纹理贴到三维几何体上，最核心的两个挑战是**放大（Magnification）**和**缩小（Minification）**。

### 纹理放大（Magnification）

当一个 $128 \times 128$ 像素的纹理被拉伸填充到 $512 \times 512$ 的屏幕区域时，GPU 需要决定如何填补像素之间的空隙：

- **Nearest Filtering（最近邻过滤）**：直接取最近的像素色值。画面会出现明显的马赛克。
- **Linear Filtering（双线性过滤）**：取周围 4 个像素进行插值，边缘会变得模糊平滑。

### 纹理缩小（Minification）与 Mipmapping

当高分辨率纹理渲染在很远的小物体上时，一个屏幕像素可能对应纹理上的几十个像素。如果仍然只采样一个点，就会产生严重的走样（Aliasing，如莫尔条纹和闪烁）。

为了解决这个问题，图形学引入了 **Mipmap（多级渐远纹理）**。
GPU 会预先生成一系列分辨率减半的图像序列（如 $256 \times 256$、$128 \times 128$、……、$1 \times 1$）。渲染时，GPU 会计算当前像素对应的纹理范围大小，自动选择合适层级的 Mipmap 进行采样：

- **Trilinear Filtering（三线性过滤）**：在最接近的两个 Mipmap 层级上分别进行双线性过滤，然后对这两个层级的结果进行线性插值，彻底消除了层级过渡时的突变线。
- **Anisotropic Filtering（各向异性过滤）**：当视线与贴图呈斜角时，普通的 Mipmap 会过度模糊。各向异性过滤会沿着视线方向进行非等比的采样，保留斜角视角下的纹理细节。

---

## 物理渲染（PBR）的本质

现代 3D 引擎默认的渲染方案是物理渲染（Physically Based Rendering，PBR）。它力求在数学上模拟光线在真实物理世界中的传播。

### 渲染方程（The Rendering Equation）

$$L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (\omega_i \cdot n) d\omega_i$$

简单来说，某一点向某个方向反射出的总光量 $L_o$，等于该点自身发出的光 $L_e$，加上所有入射光 $L_i$ 经过双向反射分布函数（BRDF）$f_r$ 调制后的反射光总和。

### 材质属性的物理映射

在 Three.js 的 `MeshStandardMaterial` 中，我们主要通过以下属性来控制材质的 BRDF 表现：

- **粗糙度（Roughness）**：表面微几何结构的粗糙程度。微观上的高低不平会导致入射光线发生漫反射（Specular Reflection 变宽变暗）。
- **金属度（Metalness）**：区分金属和绝缘体。金属具有极高的反射率，会吸收几乎所有的漫反射光（折射光直接转换为自由电子的能量），且其反射光通常带有金属自身的色彩。
- **法线贴图（Normal Map）**：在不增加几何顶点的前提下，通过扰动片元着色器中的法线方向，模拟表面细微的凹凸起伏和光影变化。

---

## 走向 WebGPU

随着 WebGPU 规范的落地，Web 端图形学迎来了质的飞跃。

WebGL 基于 OpenGL ES，是一种基于全局状态机的 API。这意味着每次绘制（Draw Call）前都要不断更改全局状态，给 CPU 带来了沉重的提交开销。

而 WebGPU 直接映射了现代 Vulkan、Metal 和 D3D12 API，引入了**管线（Pipeline）**、**绑定组（Bind Group）**和**命令缓冲区（Command Buffer）**的概念。它将大部分状态校验和编译工作移到了初始化阶段，在运行时能够实现极低的 CPU 开销，释放 GPU 的真正算力，使得在网页端运行海量粒子系统和复杂的 GPU 驱动计算成为可能。
