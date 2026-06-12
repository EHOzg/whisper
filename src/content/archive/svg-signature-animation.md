---
title: "让签名活过来：SVG 描边动画的工程笔记"
description: "从签名设计到 Framer Motion 动画，记录 Whisper 首屏签名效果的完整实现过程。"
pubDate: 2026-04-21
tags: ["SVG", "动画", "Framer Motion", "工程"]
---

## 起因

Whisper 的首页需要一个签名动画。最开始的想法很简单：做一个手写体的「whisper」慢慢描出来，就像真正在写字一样。

找了一圈方案，最后把思路定在 SVG 描边动画上——用 `stroke-dashoffset` 控制路径的"已绘制长度"，配合 Framer Motion 做动画驱动。原理不复杂，难的是路径从哪来。

---

## 路径怎么来的

签名路径是整件事最花时间的部分。直接手写贝塞尔坐标不现实，这里用了两个工具串联完成：

第一步，用[英文签名设计](https://www.kachayv.cn/yw/)生成签名样式。输入名字，选一个看得顺眼的风格，把签名的大致形态确定下来。

第二步，把签名图作为参考，在 [SVG 路径可视化编辑器](https://yqnn.github.io/svg-path-editor/)里用贝塞尔曲线（Q 指令）一段一段地描出来。这一步没有捷径，需要手动对照签名形态调每个控制点。耐心坐下来描完，导出路径数据就好。

最终拿到的是一串很长的 `d` 属性字符串，类似这样：

```
M0 0 Q-29 46 -58 92 -11.5 65.5 35 39 34 68.5 33 98 ...
```

---

## 动画核心：`stroke-dasharray` + `pathLength`

SVG 描边动画的原理是：把路径的 `stroke-dasharray` 设为和路径总长度相同的值，然后通过改变 `stroke-dashoffset`，让路径从"完全隐藏"逐渐变成"完全显示"，视觉上就像在实时描绘一样。

Framer Motion 把这套机制封装成了 `pathLength` 属性，从 `0` 到 `1` 代表路径完成比例，不需要手动计算路径长度：

```tsx
<motion.path
  d={userPath}
  stroke="currentColor"
  strokeWidth="5.5"
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 6, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
/>
```

这是最基础的实现。但只有一层路径，看起来像铅笔线，没有墨水质感。

---

## 加上墨水质感：多层路径叠加

手写签名的笔触不是均匀的细线——有边缘模糊、有压力变化、有墨水在纸面轻微晕开的效果。要在浏览器里模拟这个，用了四层相同路径叠在一起，每层负责不同的视觉效果：

- **阴影层**：`strokeWidth` 较宽，透明度低，加模糊滤镜，位置略微偏移，制造轻微的立体感。
- **主线层**：正常宽度，高透明度，是签名主体。
- **压力层**：稍细的线，中等透明度，叠在主线上模拟笔触边缘的墨水扩散。
- **高光层**：极细的白色线，低透明度，略微向左上偏移，模拟墨水表面反光。

四层叠在一起，视觉上比单线丰富很多。

---

## 用 Mask 统一控制进度

四层分别显示没问题，但如果对每层分别做 `pathLength` 动画，时序很难对齐——阴影层可能已经画完，主线层还在中间。

解决方案是用 SVG `<mask>` 统一控制"显示区域"，四层都是静态的，只有 mask 本身在动：

```tsx
<defs>
  <mask id="signature-mask">
    <motion.path
      d={userPath}
      stroke="white"
      strokeWidth="24"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 6, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
    />
  </mask>
</defs>

<g mask="url(#signature-mask)">
  {/* 阴影、主线、压力、高光四层放在这里 */}
</g>
```

Mask 里的白色路径从左往右"出现"，下方 `<g>` 里的四层内容随之被揭开，效果完全同步，代码也更干净。

---

## 笔尖跟随点

最后加了一个跟随笔触运动的小圆点，代表正在写的笔尖位置。用 CSS `offset-path` 实现，让元素沿路径轨迹移动：

```tsx
<motion.circle
  r="4"
  fill="currentColor"
  style={{
    offsetPath: `path('${userPath}')`,
    offsetRotate: "auto",
  }}
  initial={{ offsetDistance: "0%", opacity: 0 }}
  animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
  transition={{
    duration: 6,
    ease: [0.4, 0, 0.2, 1],
    delay: 0.8,
    opacity: { times: [0, 0.05, 0.95, 1] },
  }}
/>
```

`opacity` 用数组的方式控制：开始时快速淡入，接近结束时再淡出，不会在路径末尾突然消失。

---

## 一个踩过的弯路

最初想给每层设置略微不同的动画时长，期望让各层之间产生微弱的时差，模拟墨水自然扩散的感觉。

做完发现视觉上几乎感知不到差异，但代码复杂了不少。最后还是回到了 Mask 方案：一个动画状态，驱动所有层同步揭开。

---

## 小结

整个签名动画的实现分三个部分：路径、质感、动画控制。

路径靠工具描出来，不用手写坐标；质感靠多层路径叠加实现；动画用 `<mask>` 统一控制，四层同步揭开，没有时序问题。

如果你也想做类似的签名效果，[SVG 路径可视化编辑器](https://yqnn.github.io/svg-path-editor/)是最省力的起点。🤫
