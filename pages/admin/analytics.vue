<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">数据统计</h1>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-blue-600"><User /></el-icon>
            <span>总用户数</span>
          </div>
        </template>
        <div class="text-3xl font-bold text-blue-600">12,456</div>
        <div class="text-sm text-gray-500 mt-1">+12% 较上月</div>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-green-600"><Money /></el-icon>
            <span>总收入</span>
          </div>
        </template>
        <div class="text-3xl font-bold text-green-600">$45,678</div>
        <div class="text-sm text-gray-500 mt-1">+8% 较上月</div>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-purple-600"><Notebook /></el-icon>
            <span>总小说数</span>
          </div>
        </template>
        <div class="text-3xl font-bold text-purple-600">1,234</div>
        <div class="text-sm text-gray-500 mt-1">+5% 较上月</div>
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-orange-600"><View /></el-icon>
            <span>总阅读量</span>
          </div>
        </template>
        <div class="text-3xl font-bold text-orange-600">2,345,678</div>
        <div class="text-sm text-gray-500 mt-1">+15% 较上月</div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 收入趋势 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-green-600"><TrendCharts /></el-icon>
            <span>收入趋势</span>
          </div>
        </template>
        <div class="h-64 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <el-icon class="text-4xl mb-2"><DataAnalysis /></el-icon>
            <div>图表组件开发中...</div>
          </div>
        </div>
      </el-card>

      <!-- 用户增长 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-blue-600"><TrendCharts /></el-icon>
            <span>用户增长</span>
          </div>
        </template>
        <div class="h-64 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <el-icon class="text-4xl mb-2"><DataAnalysis /></el-icon>
            <div>图表组件开发中...</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 排行榜 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门小说 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-red-600"><Trophy /></el-icon>
            <span>热门小说排行</span>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="(novel, index) in topNovels" :key="novel.id" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
              {{ index + 1 }}
            </div>
            <img :src="novel.cover" :alt="novel.title" class="w-12 h-16 object-cover rounded" />
            <div class="flex-1">
              <div class="font-medium">{{ novel.title }}</div>
              <div class="text-sm text-gray-500">{{ novel.author }}</div>
            </div>
            <div class="text-sm text-gray-500">{{ novel.views.toLocaleString() }} 阅读</div>
          </div>
        </div>
      </el-card>

      <!-- 最新订单 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-green-600"><Tickets /></el-icon>
            <span>最新订单</span>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="flex justify-between items-center">
            <div>
              <div class="font-medium">{{ order.plan_name }}</div>
              <div class="text-sm text-gray-500">{{ order.user_email }}</div>
            </div>
            <div class="text-right">
              <div class="font-semibold">${{ (order.amount / 100).toFixed(2) }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Money, Notebook, View, TrendCharts, DataAnalysis, Trophy, Tickets } from '@element-plus/icons-vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

// 模拟数据
const topNovels = [
  { id: 1, title: 'Martial Peak', author: 'Momo', cover: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=100&h=120&fit=crop', views: 1500000 },
  { id: 2, title: 'Tales of Demons and Gods', author: 'Mad Snail', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=120&fit=crop', views: 1200000 },
  { id: 3, title: 'Solo Leveling', author: 'Chugong', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&h=120&fit=crop', views: 1000000 },
]

const recentOrders = [
  { id: 1, plan_name: '高级套餐', user_email: 'user1@example.com', amount: 1999, created_at: '2025-10-16T10:30:00Z' },
  { id: 2, plan_name: '月度订阅', user_email: 'user2@example.com', amount: 999, created_at: '2025-10-16T09:15:00Z' },
  { id: 3, plan_name: '基础套餐', user_email: 'user3@example.com', amount: 999, created_at: '2025-10-16T08:45:00Z' },
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}
</script>

