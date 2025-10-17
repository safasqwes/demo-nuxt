<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">管理后台 Dashboard</h1>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <el-card shadow="hover">
        <template #header>今日新增用户</template>
        <div class="text-3xl font-bold">128</div>
      </el-card>
      <el-card shadow="hover">
        <template #header>今日订单</template>
        <div class="text-3xl font-bold">56</div>
      </el-card>
      <el-card shadow="hover">
        <template #header>今日收入</template>
        <div class="text-3xl font-bold">$1,240</div>
      </el-card>
      <el-card shadow="hover">
        <template #header>活跃读者</template>
        <div class="text-3xl font-bold">842</div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/modules/admin/stores/admin'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const adminStore = useAdminStore()

const logout = () => {
  adminStore.logout()
  navigateTo('/admin/login')
}
</script>

