<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r hidden md:block">
      <div class="h-16 flex items-center justify-center border-b">
        <span class="font-bold text-lg">Admin Panel</span>
      </div>
      <nav class="p-4 space-y-1">
        <NuxtLink class="nav-item" to="/admin">
          <el-icon class="mr-2"><Odometer /></el-icon>Dashboard
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/users">
          <el-icon class="mr-2"><User /></el-icon>用户管理
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/novels">
          <el-icon class="mr-2"><Notebook /></el-icon>小说管理
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/orders">
          <el-icon class="mr-2"><Tickets /></el-icon>订单管理
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/plans">
          <el-icon class="mr-2"><Coin /></el-icon>套餐管理
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/promotions">
          <el-icon class="mr-2"><Discount /></el-icon>促销活动
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/banners">
          <el-icon class="mr-2"><Picture /></el-icon>横幅管理
        </NuxtLink>
        <NuxtLink class="nav-item" to="/admin/analytics">
          <el-icon class="mr-2"><DataAnalysis /></el-icon>数据统计
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <el-button class="md:hidden" @click="toggleMobileMenu"><el-icon><Menu /></el-icon></el-button>
          <span class="font-semibold">NovelHub 管理后台</span>
        </div>
        <div class="flex items-center gap-2">
          <el-button @click="goHome">回到站点</el-button>
          <el-button type="danger" @click="logout">退出</el-button>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, Odometer, User, Notebook, Tickets, Coin, Discount, Picture, DataAnalysis } from '@element-plus/icons-vue'
import { useAdminStore } from '~/modules/admin/stores/admin'

const adminStore = useAdminStore()

const logout = () => {
  adminStore.logout()
  navigateTo('/admin/login')
}

const goHome = () => navigateTo('/')
const toggleMobileMenu = () => {}
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  color: #374151;
}
.nav-item:hover { background: #f3f4f6; }
.nav-item.router-link-active { background: #eef2ff; color: #3730a3; }
</style>

