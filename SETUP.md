# Demo-Nuxt Setup Guide

## 技术栈

- **Nuxt 4** - Vue.js 框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - 基于 Vue 3 的组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Pinia** - Vue 状态管理
- **Axios** - HTTP 客户端

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`

## 项目结构

```
demo-nuxt/
├── app/                      # 应用源代码
│   ├── assets/
│   │   └── css/
│   │       ├── main.css      # 全局样式
│   │       ├── theme.css     # 主题变量
│   │       └── tailwind.css  # Tailwind 配置
│   ├── components/           # Vue 组件
│   ├── composables/          # 组合式函数
│   ├── layouts/              # 布局组件
│   ├── pages/                # 页面路由
│   ├── stores/               # Pinia 状态管理
│   └── utils/                # 工具函数
├── public/                   # 静态资源
├── nuxt.config.ts           # Nuxt 配置
├── tailwind.config.js       # Tailwind 配置
└── package.json             # 项目依赖

```

## 使用 Element Plus

### 自动导入（推荐）

Element Plus 已配置自动导入，直接在组件中使用即可：

```vue
<template>
  <el-button type="primary">Click Me</el-button>
  <el-input v-model="value" placeholder="Please input" />
</template>

<script setup lang="ts">
const value = ref('')
</script>
```

### 常用组件示例

```vue
<template>
  <!-- 按钮 -->
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  
  <!-- 输入框 -->
  <el-input v-model="input" placeholder="请输入" />
  
  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" title="标题">
    <span>内容</span>
  </el-dialog>
  
  <!-- 表格 -->
  <el-table :data="tableData">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="age" label="年龄" />
  </el-table>
  
  <!-- 表单 -->
  <el-form :model="form">
    <el-form-item label="用户名">
      <el-input v-model="form.name" />
    </el-form-item>
  </el-form>
</template>
```

### 图标使用

```vue
<script setup lang="ts">
import { Search, Edit, Delete } from '@element-plus/icons-vue'
</script>

<template>
  <el-button :icon="Search">搜索</el-button>
  <el-icon><Edit /></el-icon>
</template>
```

## 使用 Tailwind CSS

### 实用类

```vue
<template>
  <!-- 布局 -->
  <div class="flex justify-center items-center">
    <div class="container mx-auto px-4">
      <!-- 网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="card p-6">
          <!-- 内容 -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- 响应式设计 -->
  <div class="text-sm md:text-base lg:text-lg">
    响应式文本
  </div>
  
  <!-- 暗黑模式 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    支持暗黑模式的内容
  </div>
</template>
```

### 自定义类（已预定义）

```vue
<template>
  <!-- 卡片 -->
  <div class="card card-hover p-6">
    卡片内容
  </div>
  
  <!-- 按钮 -->
  <button class="btn btn-primary">主要按钮</button>
  <button class="btn btn-secondary">次要按钮</button>
  <button class="btn btn-outline">轮廓按钮</button>
  
  <!-- 输入框 -->
  <input class="input" placeholder="输入内容" />
  
  <!-- 渐变文字 -->
  <h1 class="text-gradient">渐变标题</h1>
</template>
```

## 组合使用

### Element Plus + Tailwind CSS

```vue
<template>
  <!-- Element Plus 组件 + Tailwind 布局 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <el-card shadow="hover" class="card-hover">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">标题</span>
          <el-tag type="success">新</el-tag>
        </div>
      </template>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        内容描述
      </p>
      <el-button type="primary" class="w-full">
        操作按钮
      </el-button>
    </el-card>
  </div>
  
  <!-- Element Plus 表单 + Tailwind 样式 -->
  <el-form :model="form" class="max-w-md mx-auto">
    <el-form-item label="用户名">
      <el-input v-model="form.username" class="w-full" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email" type="email" class="w-full" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="w-full">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const form = reactive({
  username: '',
  email: ''
})
</script>
```

## 主题配置

### 暗黑模式

项目已配置暗黑模式支持，使用 `useTheme` composable：

```vue
<script setup lang="ts">
const { theme, isDark, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme">
    {{ isDark ? '🌙 Dark' : '☀️ Light' }}
  </button>
</template>
```

### 自定义主题色

在 `tailwind.config.js` 中自定义颜色：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        // ...
      }
    }
  }
}
```

在 `app/assets/css/theme.css` 中修改 CSS 变量：

```css
:root {
  --color-primary: #your-color;
}
```

## 构建和部署

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 生成静态站点

```bash
npm run generate
```

## 常见问题

### Element Plus 组件样式不显示

确保 `nuxt.config.ts` 中已正确配置：

```typescript
elementPlus: {
  importStyle: 'css',
}
```

### Tailwind CSS 不生效

1. 检查 `tailwind.config.js` 的 `content` 路径
2. 确保已在 `nuxt.config.ts` 中添加 `@nuxtjs/tailwindcss` 模块
3. 清除 `.nuxt` 缓存重新启动

### 暗黑模式切换无效

确保：
1. `<html>` 标签有 `class="dark"` 或 `data-theme="dark"`
2. Tailwind 配置了 `darkMode: 'class'`

## 参考资源

- [Nuxt 文档](https://nuxt.com)
- [Vue 3 文档](https://vuejs.org)
- [Element Plus 文档](https://element-plus.org)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Pinia 文档](https://pinia.vuejs.org)

## 示例页面

查看 `app/components/ExampleUsage.vue` 获取完整的使用示例。

在任何页面中使用：

```vue
<template>
  <div>
    <ExampleUsage />
  </div>
</template>
```

