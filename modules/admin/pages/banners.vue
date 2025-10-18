<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">横幅管理</h1>
      <el-button type="primary">新增横幅</el-button>
    </div>

    <el-table :data="banners" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="image" label="图片">
        <template #default="{ row }">
          <img :src="row.image" class="w-24 h-12 object-cover rounded" />
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const banners = [
  { id: 1, title: '热门新书', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=200&fit=crop', link: '/', status: '启用' },
  { id: 2, title: '限时优惠', image: 'https://images.unsplash.com/photo-1461727885569-b2ddec0c4323?w=400&h=200&fit=crop', link: '/promotions', status: '启用' },
]
</script>

