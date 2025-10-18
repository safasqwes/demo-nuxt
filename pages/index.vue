<template>
  <div class="home-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">欢迎来到 NovelHub</h1>
      <p class="text-xl text-center text-gray-600 mb-12">您的小说阅读平台</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <el-icon class="text-blue-600 text-2xl"><Reading /></el-icon>
          </div>
          <h3 class="text-xl font-semibold mb-2">阅读小说</h3>
          <p class="text-gray-600 mb-4">发现和阅读精彩的小说内容</p>
          <el-button type="primary" @click="$router.push('/novels')">
            开始阅读
          </el-button>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <el-icon class="text-green-600 text-2xl"><Wallet /></el-icon>
          </div>
          <h3 class="text-xl font-semibold mb-2">积分充值</h3>
          <p class="text-gray-600 mb-4">购买积分解锁更多功能</p>
          <el-button type="success" @click="$router.push('/pricing')">
            查看套餐
          </el-button>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <el-icon class="text-purple-600 text-2xl"><Setting /></el-icon>
          </div>
          <h3 class="text-xl font-semibold mb-2">管理后台</h3>
          <p class="text-gray-600 mb-4">管理员专用后台系统</p>
          <el-button type="warning" @click="$router.push('/admin/login')">
            管理后台
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Reading, Wallet, Setting } from '@element-plus/icons-vue'

// SEO
useHead({
  title: 'NovelHub - 小说阅读平台',
  meta: [
    { name: 'description', content: 'NovelHub是您的小说阅读平台，提供丰富的小说内容和便捷的阅读体验' }
  ]
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>

