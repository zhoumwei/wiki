# Vue 面试题

## 1. Vue基础概念

### Q1: 什么是Vue.js？它的核心特性是什么？
**答：** Vue.js是一个用于构建用户界面的渐进式JavaScript框架。

核心特性：
- **响应式数据绑定**：数据驱动视图，数据变化自动更新DOM
- **组件化开发**：将UI拆分为独立可复用的组件
- **虚拟DOM**：提高渲染性能
- **指令系统**：提供丰富的指令简化DOM操作
- **轻量级**：体积小，学习成本低
- **生态系统完善**：Vuex、Vue Router、Vue CLI等

### Q2: Vue实例的生命周期有哪些阶段？
**答：** Vue实例的生命周期分为四个阶段，共8个钩子函数：

1. **创建阶段**：
   - beforeCreate：实例创建前，数据观测和事件配置之前
   - created：实例创建后，已完成数据观测、属性和方法的运算

2. **挂载阶段**：
   - beforeMount：挂载开始前，render函数首次被调用
   - mounted：挂载完成后，el被新创建的vm.$el替换

3. **更新阶段**：
   - beforeUpdate：数据更新前，发生在虚拟DOM重新渲染和打补丁之前
   - updated：数据更新后，虚拟DOM重新渲染和打补丁之后

4. **销毁阶段**：
   - beforeDestroy：实例销毁前，实例仍然完全可用
   - destroyed：实例销毁后，所有的事件监听器被移除，子实例被销毁

Vue 3.x中新增了：
- setup()：Composition API的入口

### Q3: v-if和v-show的区别？
**答：**

| 特性 | v-if | v-show |
|------|------|--------|
| 渲染 | 惰性渲染，条件为false时不渲染 | 始终渲染，通过CSS display控制显示隐藏 |
| 切换开销 | 高，涉及DOM的创建和销毁 | 低，仅切换CSS样式 |
| 初始渲染开销 | 条件为false时低 | 始终有开销 |
| 适用场景 | 条件很少改变时 | 需要频繁切换显示状态时 |

## 2. 组件化开发

### Q4: 组件之间通信的方式有哪些？
**答：** Vue组件间通信的方式包括：

1. **父子组件通信**：
   - props：父组件向子组件传递数据
   - $emit/$on：子组件向父组件传递消息

2. **非父子组件通信**：
   - EventBus：中央事件总线
   - Vuex：状态管理模式
   - provide/inject：祖先组件向后代组件注入数据

3. **$refs和$parent/$children**：
   - 直接访问组件实例

4. **$attrs和$listeners**：
   - 透传属性和事件监听器

### Q5: 组件的data为什么必须是函数？
**答：** 组件的data必须是函数的原因是为了保证每个组件实例都维护一份独立的数据副本。

如果data是对象，那么所有组件实例将共享同一个data对象，修改一个实例的数据会影响其他所有实例。而data作为函数返回一个新对象，确保每个实例都有自己独立的数据空间。

```javascript
// 错误写法
data: {
  message: 'hello'
}

// 正确写法
data() {
  return {
    message: 'hello'
  }
}
```

### Q6: computed和watch的区别？
**答：**

| 特性 | computed | watch |
|------|----------|-------|
| 类型 | 计算属性 | 监听器 |
| 声明式 | 是 | 否 |
| 缓存 | 有缓存，依赖数据变化才重新计算 | 无缓存，数据变化立即执行 |
| 使用场景 | 复杂逻辑的计算，有返回值 | 观察数据变化执行异步操作或开销较大的操作 |
| 返回值 | 必须有返回值 | 无返回值要求 |

## 3. Vue响应式原理

### Q7: Vue 2.x的响应式原理？
**答：** Vue 2.x的响应式原理基于Object.defineProperty()实现：

1. **数据劫持**：通过Object.defineProperty()劫持data中所有属性的getter和setter
2. **依赖收集**：在getter中收集依赖（Watcher）
3. **派发更新**：在setter中通知依赖更新

局限性：
- 无法检测对象属性的添加或删除
- 无法检测通过索引设置数组项
- 无法检测直接修改数组长度

### Q8: Vue 3.x的响应式原理有什么改进？
**答：** Vue 3.x使用Proxy代替Object.defineProperty()实现响应式：

优势：
- 可以监听对象属性的添加和删除
- 可以监听数组索引和length的变化
- 支持Map、Set、WeakMap、WeakSet等数据结构
- 性能更好，只在访问时才进行代理

实现原理：
```javascript
const reactive = (target) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      // 派发更新
      trigger(target, key)
      return Reflect.set(target, key, value, receiver)
    }
  })
}
```

## 4. Vue Router

### Q9: Vue Router的导航守卫有哪些？
**答：** Vue Router的导航守卫分为三类：

1. **全局守卫**：
   - beforeEach：全局前置守卫
   - beforeResolve：全局解析守卫
   - afterEach：全局后置钩子

2. **路由独享守卫**：
   - beforeEnter：定义在路由配置中

3. **组件内守卫**：
   - beforeRouteEnter：进入路由前调用
   - beforeRouteUpdate：路由参数变化时调用
   - beforeRouteLeave：离开路由前调用

执行顺序：
beforeEach → beforeEnter → beforeRouteEnter → beforeResolve → afterEach

### Q10: hash模式和history模式的区别？
**答：**

| 特性 | hash模式 | history模式 |
|------|----------|-------------|
| URL形式 | http://example.com/#/user/id | http://example.com/user/id |
| 原理 | 监听hashchange事件 | 利用HTML5 History API |
| 服务端支持 | 不需要 | 需要配置服务端支持 |
| SEO友好性 | 较差 | 较好 |
| 兼容性 | IE8+ | IE10+ |

## 5. Vuex状态管理

### Q11: Vuex的核心概念有哪些？
**答：** Vuex的核心概念包括：

1. **State**：存储应用的状态数据
2. **Getter**：从state中派生出一些状态，类似于计算属性
3. **Mutation**：更改state的唯一方法，必须是同步函数
4. **Action**：提交mutation，可以包含任意异步操作
5. **Module**：将store分割成模块，每个模块拥有自己的state、mutation、action、getter

数据流：
View → dispatch Action → commit Mutation → State → View

### Q12: Vuex中Mutation和Action的区别？
**答：**

| 特性 | Mutation | Action |
|------|----------|--------|
| 调用方式 | store.commit('mutationName') | store.dispatch('actionName') |
| 异步处理 | 必须同步执行 | 可以包含异步操作 |
| 参数 | (state, payload) | (context, payload) |
| 触发更新 | 直接触发状态更新 | 通过commit触发mutation |

## 6. Vue 3 Composition API

### Q13: Composition API相比Options API的优势？
**答：** Composition API的优势：

1. **更好的逻辑复用**：通过组合函数实现逻辑复用
2. **更好的代码组织**：相关逻辑可以组织在一起
3. **更好的类型推导**：TypeScript支持更好
4. **更灵活的组件结构**：不受选项限制
5. **更好的Tree Shaking**：按需引入功能

### Q14: ref和reactive的区别？
**答：**

| 特性 | ref | reactive |
|------|-----|----------|
| 用途 | 为基本类型值创建响应式数据 | 为对象创建响应式数据 |
| 访问方式 | .value | 直接访问 |
| 返回值 | RefImpl实例 | Proxy对象 |
| 适用场景 | 基本类型、单个值 | 对象、数组 |

```javascript
// ref
const count = ref(0)
console.log(count.value)

// reactive
const state = reactive({ count: 0 })
console.log(state.count)
```

## 7. 性能优化

### Q15: Vue应用的性能优化策略？
**答：** Vue应用的性能优化策略包括：

1. **代码分割**：
   - 使用动态导入实现路由懒加载
   - 组件懒加载

2. **减少不必要的响应式数据**：
   - 使用Object.freeze()冻结不需要响应式的数据
   - 使用markRaw()标记原始数据

3. **合理使用v-if和v-show**：
   - 根据使用频率选择合适的指令

4. **列表渲染优化**：
   - 为v-for设置唯一的key
   - 避免同时使用v-if和v-for

5. **事件处理优化**：
   - 使用事件委托
   - 及时清理事件监听器

6. **组件优化**：
   - 使用functional组件
   - 使用keep-alive缓存组件

7. **服务端渲染（SSR）**：
   - 使用Nuxt.js实现服务端渲染

### Q16: 虚拟DOM的优势？
**答：** 虚拟DOM的优势：

1. **性能优化**：通过Diff算法减少DOM操作
2. **跨平台**：可以在不同平台上实现相同的渲染逻辑
3. **抽象化**：将开发者从复杂的DOM操作中解放出来
4. **一致性**：提供一致的API，屏蔽浏览器差异

工作原理：
1. 用JavaScript对象描述真实DOM结构
2. 数据变化时生成新的虚拟DOM树
3. 通过Diff算法对比新旧虚拟DOM树
4. 计算出最小的DOM操作集合
5. 批量更新真实DOM

## 8. Vue CLI和工程化

### Q17: Vue CLI的作用和特点？
**答：** Vue CLI是Vue.js官方提供的脚手架工具。

作用：
- 快速搭建Vue项目
- 提供图形化界面
- 插件系统
- 图形化项目管理

特点：
- 零配置原型开发
- 丰富的官方插件集成
- 图形化管理界面
- 支持自定义webpack配置
- 支持TypeScript、PWA、单元测试等

### Q18: Vue项目的目录结构规范？
**答：** 标准Vue项目目录结构：

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── views/           # 页面组件
├── router/          # 路由配置
├── store/           # 状态管理
├── utils/           # 工具函数
├── api/             # 接口请求
├── styles/          # 样式文件
├── plugins/         # 插件
├── directives/      # 自定义指令
├── mixins/          # 混入
├── App.vue          # 根组件
└── main.js          # 入口文件
```

## 9. TypeScript支持

### Q19: Vue 3如何支持TypeScript？
**答：** Vue 3对TypeScript的支持：

1. **定义组件**：
```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {}
  }
})
```

2. **类型推导**：
```typescript
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
}

const user: Ref<User> = ref({
  id: 1,
  name: 'John'
})
```

3. **Props类型定义**：
```typescript
import { PropType } from 'vue'

props: {
  user: {
    type: Object as PropType<User>,
    required: true
  }
}
```

### Q20: Composition API中如何使用TypeScript？
**答：** Composition API中使用TypeScript：

1. **setup函数参数类型**：
```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props: Props, { emit }: SetupContext) {
    // ...
  }
})
```

2. **响应式数据类型**：
```typescript
import { ref, reactive } from 'vue'

interface State {
  count: number
  name: string
}

const count = ref<number>(0)
const state = reactive<State>({
  count: 0,
  name: 'Vue'
})
```

3. **函数类型定义**：
```typescript
const increment = (): void => {
  count.value++
}

const fetchUser = async (id: number): Promise<User> => {
  // ...
}
```
