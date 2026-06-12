---
title: "Vue 3 组件通信全景解析"
description: "全面梳理 Vue 3 中从父子组件到跨组件通信的多种机制，结合真实场景给出选型与最佳实践。"
category: "工程实战"
order: 2
---

# Vue 3 组件通信全景解析

在 Vue 3 应用开发中，组件通信是构建清晰应用架构的基础。根据组件之间的关系，通信方式通常可以划分为**父子组件通信**与**跨组件通信**两大类。

本文将梳理 Vue 3 Composition API（特别是 `<script setup>`）下最常用的通信机制，并分析其适用场景。

---

## 1. 父子组件通信

父子组件通信是最高频的场景，主要遵循「Props 下行，Events 上行」的单向数据流原则。

### 1.1 Props 与 Emits

这是最基础的通信手段。父组件通过 `props` 向下传递数据，子组件通过 `emit` 向上触发事件来通知父组件。

#### 子组件（`Child.vue`）

```vue
<script setup lang="ts">
// 定义 Props
const props = defineProps<{
  title: string
  count: number
}>()

// 定义 Emits
const emit = defineEmits<{
  (e: "increment", step: number): void
}>()

function handleClick() {
  emit("increment", 1)
}
</script>

<template>
  <div class="child-box">
    <h3>{{ title }}</h3>
    <p>当前计数：{{ count }}</p>
    <button @click="handleClick">增加</button>
  </div>
</template>
```

#### 父组件（`Parent.vue`）

```vue
<script setup lang="ts">
import { ref } from "vue"
import Child from "./Child.vue"

const title = ref("计数器组件")
const count = ref(0)

function handleIncrement(step: number) {
  count.value += step
}
</script>

<template>
  <div class="parent-box">
    <Child :title="title" :count="count" @increment="handleIncrement" />
  </div>
</template>
```

---

### 1.2 双向绑定（v-model）

在 Vue 3.4 及以上版本中，官方引入了全新的 `defineModel()` 宏，极大简化了双向绑定的实现。它不仅支持默认的 `v-model`，还支持多个具名 `v-model` 绑定。

#### 子组件（`CustomInput.vue`）

```vue
<script setup lang="ts">
// 声明双向绑定值
const modelValue = defineModel<string>()

// 声明第二个具名双向绑定值
const status = defineModel<boolean>("status", { default: false })
</script>

<template>
  <div>
    <input v-model="modelValue" />
    <button @click="status = !status">
      状态：{{ status ? "启用" : "禁用" }}
    </button>
  </div>
</template>
```

#### 父组件（`Parent.vue`）

```vue
<script setup lang="ts">
import { ref } from "vue"
import CustomInput from "./CustomInput.vue"

const message = ref("Hello Vue")
const isActive = ref(true)
</script>

<template>
  <div>
    <p>输入内容：{{ message }}</p>
    <p>激活状态：{{ isActive }}</p>
    <CustomInput v-model="message" v-model:status="isActive" />
  </div>
</template>
```

#### 💡 与 Vue 2 `.sync` 修饰符的演变差异

在 Vue 2 中，`v-model` 和 `.sync` 是两个独立的概念：

- `v-model` 默认只能绑定一个值（对应的 prop 是 `value`，触发的事件是 `input`）。
- 如果需要实现多个属性的双向绑定，则必须借助 `.sync` 修饰符（如 `:title.sync="docTitle"`，子组件内部触发 `this.$emit('update:title', newTitle)`）。

**在 Vue 3 中，`.sync` 修饰符已被移除，其功能完全合并到了 `v-model` 中：**

- Vue 3 的 `v-model` 支持参数传递（如 `v-model:status="isActive"`）。其底层原理就是将 `status` 属性与子组件的 `update:status` 事件进行关联。
- 这意味着，在 Vue 3 中你可以同时给同一个组件绑定多个不同的 `v-model`（如上面的示例中，同时绑定了默认的 `v-model` 和具名的 `v-model:status`），语法更加统一和直观。

---

### 1.3 模板引用与 defineExpose

当父组件需要主动调用子组件的方法或访问其内部属性时，可以通过 `ref` 获取子组件实例。在 `<script setup>` 中，子组件的属性默认是关闭的，必须使用 `defineExpose` 显式暴露给外部。

#### 子组件（`ChildModal.vue`）

```vue
<script setup lang="ts">
import { ref } from "vue"

const isVisible = ref(false)

function show() {
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}

// 必须显式暴露方法
defineExpose({
  show,
  hide,
})
</script>

<template>
  <div v-if="isVisible" class="modal">
    <p>这是一个模态框</p>
    <button @click="hide">关闭</button>
  </div>
</template>
```

#### 父组件（`Parent.vue`）

```vue
<script setup lang="ts">
import { useTemplateRef } from "vue"
import ChildModal from "./ChildModal.vue"

// Vue 3.5 推荐使用 useTemplateRef 获取模板引用
const modalRef = useTemplateRef<InstanceType<typeof ChildModal>>("myModal")

function openModal() {
  modalRef.value?.show()
}
</script>

<template>
  <div>
    <button @click="openModal">打开模态框</button>
    <ChildModal ref="myModal" />
  </div>
</template>
```

#### 💡 与 Vue 2 `$parent` / `$children` 的演变差异

在 Vue 2 中，我们可以通过 `this.$parent` 访问父组件实例，通过 `this.$children` 访问子组件实例数组。

**在 Vue 3 中，这两个特性的地位发生了改变：**

- **`$children` 已被彻底移除**：Vue 3 不再提供 `$children` 属性。因为组件树中子组件的顺序是动态不确定的，直接依赖数组索引访问子组件极易出错且不易维护。官方推荐使用**模板引用（Template Refs）**结合 `defineExpose` 作为获取子组件实例的唯一标准方式。
- **`$parent` 遭到冷落**：尽管在 Options API 中 `$parent` 依然存在，但在 Composition API 的 `<script setup>` 中，直接获取并操作它需要用到 `getCurrentInstance()?.parent` 这种非公开的底层 API。官方强烈不建议直接操作 `$parent` 来修改父组件的状态，这会导致严重的紧耦合。推荐使用更为纯粹的 **Emits（自定义事件）** 或 **Provide / Inject** 替代。

---

### 1.4 透传 Attribute 与事件（Fallthrough Attributes）

当父组件向子组件传递属性（如 `class`、`style`、`id` 等）或事件监听器，而子组件并没有在 `props` 或 `emits` 中声明它们时，这些属性和事件会直接「透传」给子组件的根节点。

#### 1. 默认继承行为

如果子组件是单根节点，父组件传递的 `class` 和 `style` 会自动合并到子组件的根节点上。

#### 2. 禁用继承与手动分配

如果不希望根节点自动继承，可以通过 `defineOptions` 禁用默认继承，并使用 `$attrs` 将属性绑定到指定的内部元素上。

##### 子组件（`MyButton.vue`）

```vue
<script setup lang="ts">
import { useAttrs } from "vue"

// 禁用默认继承（Vue 3.3+ 推荐方式）
defineOptions({
  inheritAttrs: false,
})

// 在 script 中获取透传的属性
const attrs = useAttrs()
</script>

<template>
  <div class="button-container">
    <!-- 将透传的 class/style/id/事件等绑定到指定的 button 元素上 -->
    <button v-bind="$attrs" class="custom-btn">
      <slot />
    </button>
  </div>
</template>
```

#### 3. 事件透传与 Vue 2 的差异（.native 与 $listeners）

在 Vue 2 中，如果想在子组件根节点上监听原生事件，必须使用 `.native` 修饰符（如 `@click.native`）；同时，Vue 2 中属性和事件监听器是分开存放的，分别通过 `$attrs` 和 `$listeners` 获取。

**在 Vue 3 中，这两点发生了重大变化：**

1. **`.native` 修饰符已被移除**：Vue 3 会自动将所有未在 `emits` 中声明的事件监听器作为原生事件透传给子组件的根元素。
   - 如果子组件**没有**声明 `emits: ['click']`，父组件绑定的 `@click` 将作为原生事件绑定在子组件根节点上。
   - 如果子组件声明了 `emits: ['click']`，则父组件的 `@click` 必须由子组件内部通过 `emit('click')` 手动触发。
2. **`$listeners` 对象已被移除**：Vue 3 将所有的事件监听器都并入了 `$attrs` 中。例如，父组件传递的 `@change` 监听器在子组件的 `$attrs`（或 `useAttrs()`）中会以 `onChange` 属性的形式存在。
   - 这意味着，在 Vue 3 中你只需要写 `v-bind="$attrs"` 就可以一次性将所有透传的属性和事件监听器全部绑定给指定的内部元素，不再需要像 Vue 2 那样繁琐地写 `v-bind="$attrs" v-on="$listeners"`。

---

## 2. 跨组件通信

当组件嵌套层次较深，或者两个组件之间没有直接的父子关系时，使用 `props` 逐层传递会造成严重的「Prop 逐级透传」（Prop Drilling）。此时需要使用跨组件通信机制。

### 2.1 依赖注入（Provide / Inject）

`Provide` 和 `Inject` 允许祖先组件向其所有子孙组件注入数据，无需关心中间有多少层嵌套。

#### 祖先组件（`Ancestor.vue`）

```vue
<script setup lang="ts">
import { provide, ref, readonly } from "vue"

const theme = ref("dark")

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark"
}

// 推荐做法：提供只读数据和修改数据的方法，维护单向数据流
provide("theme", readonly(theme))
provide("toggleTheme", toggleTheme)
</script>

<template>
  <div :class="theme">
    <slot />
  </div>
</template>
```

#### 深层后代组件（`DeepChild.vue`）

```vue
<script setup lang="ts">
import { inject } from "vue"

// 注入数据，可提供默认值
const theme = inject<string>("theme", "light")
const toggleTheme = inject<() => void>("toggleTheme")
</script>

<template>
  <div class="card">
    <p>当前主题：{{ theme }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>
```

---

### 2.2 共享响应式全局状态（轻量级状态管理）

如果仅仅是想在几个不相干的组件之间共享少量状态，甚至不需要引入复杂的 Pinia。可以直接在单独的 TypeScript/JavaScript 文件中定义并导出响应式对象。

#### 全局状态文件（`store.ts`）

```typescript
import { ref, computed } from "vue"

// 共享的响应式状态
export const globalCount = ref(0)

// 共享的计算属性
export const doubleCount = computed(() => globalCount.value * 2)

// 修改状态的方法
export function incrementGlobal() {
  globalCount.value++
}
```

#### 组件 A（`ComponentA.vue`）和组件 B（`ComponentB.vue`）

```vue
<script setup lang="ts">
import { globalCount, doubleCount, incrementGlobal } from "./store"
</script>

<template>
  <div>
    <p>全局计数：{{ globalCount }}</p>
    <p>双倍计数：{{ doubleCount }}</p>
    <button @click="incrementGlobal">增加全局计数</button>
  </div>
</template>
```

---

### 2.3 状态管理工具（Pinia）

当应用变得庞大，状态变更逻辑复杂且需要支持 DevTools 调试、SSR、持久化等特性时，Pinia 是最佳选择。

#### Store 定义（`useUserStore.ts`）

```typescript
import { defineStore } from "pinia"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
  const nickname = ref("Guest")

  function setNickname(name: string) {
    nickname.value = name
  }

  return { nickname, setNickname }
})
```

#### 使用 Store 的组件（`UserProfile.vue`）

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useUserStore } from "./useUserStore"

const store = useUserStore()
// 使用 storeToRefs 保持解构后属性的响应性
const { nickname } = storeToRefs(store)
const { setNickname } = store
</script>

<template>
  <div>
    <p>用户名：{{ nickname }}</p>
    <button @click="setNickname('Alex')">更改为 Alex</button>
  </div>
</template>
```

---

### 2.4 事件总线（Event Bus）

在 Vue 3 中，组件实例移除了 `$on`、`$off` 和 `$once` 方法。若仍需使用事件总线，通常需要引入第三方库（如 `mitt` 或 `tiny-emitter`）。

#### 事件总线配置（`bus.ts`）

```typescript
import mitt from "mitt"

type Events = {
  notification: { message: string; type: "info" | "error" }
}

// 建议使用强类型定义事件
export const bus = mitt<Events>()
```

#### 发送事件组件（`Sender.vue`）

```vue
<script setup lang="ts">
import { bus } from "./bus"

function notify() {
  bus.emit("notification", { message: "操作成功", type: "info" })
}
</script>

<template>
  <button @click="notify">发送通知</button>
</template>
```

#### 接收事件组件（`Receiver.vue`）

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { bus } from "./bus"

const message = ref("")

function handleNotification(payload: { message: string }) {
  message.value = payload.message
}

onMounted(() => {
  bus.on("notification", handleNotification)
})

onUnmounted(() => {
  // 必须在卸载时取消监听，避免内存泄漏
  bus.off("notification", handleNotification)
})
</script>

<template>
  <div v-if="message" class="toast">收到广播消息：{{ message }}</div>
</template>
```

---

### 2.5 路由传参（Vue Router）

在单页面应用（SPA）中，路由跳转不仅是页面的切换，也是一种非常重要的跨页面（跨路由组件）通信手段。利用 Vue Router 可以通过 URL 或 History 状态在不同视图组件之间传递数据。

#### 1. 查询参数（Query）

通过 URL 的查询字符串传递数据。这种方式数据直观、可书签化、且刷新页面不丢失。

##### 发送组件

```typescript
import { useRouter } from "vue-router"

const router = useRouter()

// 跳转并携带 query 参数
router.push({
  path: "/detail",
  query: { id: "123", mode: "edit" },
})
```

##### 接收组件

```typescript
import { useRoute } from "vue-router"

const route = useRoute()
console.log(route.query.id) // 输出 '123'
console.log(route.query.mode) // 输出 'edit'
```

#### 2. 动态路由参数（Params）

通过路径参数传递，必须在路由配置文件中提前定义占位符（例如 `/detail/:id`）。

##### 发送组件

```typescript
// 跳转并携带 params 参数
router.push({
  name: "detail",
  params: { id: "123" },
})
```

##### 接收组件

```typescript
import { useRoute } from "vue-router"

const route = useRoute()
console.log(route.params.id) // 输出 '123'
```

#### 3. 历史状态（History State）

Vue Router 4 支持利用浏览器的 History State 传递不需要展示在 URL 上的临时状态或复杂对象（在路由跳转时，数据存在 `state` 中，刷新页面后丢失）。

##### 发送组件

```typescript
// 跳转并携带 state 状态
router.push({
  path: "/detail",
  state: { tempUser: { name: "Alex", role: "admin" } },
})
```

##### 接收组件

```typescript
// 从 window.history.state 中提取
console.log(history.state.tempUser) // 输出 { name: 'Alex', role: 'admin' }
```

---

## 3. 组件通信选型矩阵

不同机制的对比与最佳选择：

| 方案                    | 适用组件关系  | 复杂度 | 核心推荐场景                                                  |
| :---------------------- | :------------ | :----- | :------------------------------------------------------------ |
| **Props / Emits**       | 直系父子      | 低     | 父子单向数据流通信的首选                                      |
| **v-model**             | 直系父子      | 低     | 自定义表单输入框、单项控制器                                  |
| **defineExpose**        | 直系父子      | 中     | 外部需要调用子组件特殊行为（如弹窗 Show/Hide）                |
| **Fallthrough Attrs**   | 直系父子      | 低     | 传递根节点样式（class/style）、原生 HTML 属性或原生事件监听器 |
| **Provide / Inject**    | 嵌套树级      | 中     | 跨多层级的配置项注入、全局主题或多语言分发                    |
| **共享响应式状态**      | 任意组件      | 低     | 局部组件群之间共享少量数据，不想增加 Pinia 开销的场景         |
| **Pinia**               | 任意组件      | 中/高  | 大型应用全局状态、用户鉴权、跨页面/路由级别的核心数据共享     |
| **Event Bus（`mitt`）** | 任意组件      | 中     | 边缘、解耦事件驱动场景（如全局异常捕获后通知全局 Toast）      |
| **Vue Router**          | 跨页面/跨路由 | 低     | 路由级页面之间的参数传递、历史状态同步                        |

选择合适的通信工具能够让你的组件职责更加明确，代码更容易维护。建议在日常开发中，优先使用最简单、符合单向数据流的方案，在遇到性能瓶颈或多层级状态同步困难时，再逐步升级至全局状态管理或事件总线。
