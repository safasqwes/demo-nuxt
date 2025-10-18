<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <div class="flex gap-2">
        <el-input v-model="search" placeholder="搜索用户名/邮箱" clearable class="w-64" />
        <el-button type="primary" @click="fetchUsers">搜索</el-button>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="140" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewUser(row)">详情</el-button>
          <el-button 
            size="small" 
            :type="row.status === 1 ? 'warning' : 'success'"
            @click="toggleUserStatus(row)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination
        v-model:current-page="page"
        :page-size="size"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchUsers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminUserStore } from '~/modules/admin/stores/users'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const store = useAdminUserStore()
const loading = ref(false)
const items = computed(() => store.items)
const total = computed(() => store.total)
const page = ref(1)
const size = ref(20)
const search = ref('')

const fetchUsers = async () => {
  loading.value = true
  try {
    await store.fetchUsers(page.value, size.value)
  } finally {
    loading.value = false
  }
}

watch([page, size], fetchUsers)

onMounted(fetchUsers)

const viewUser = (row: any) => {
  navigateTo(`/admin/users/${row.id}`)
}

const toggleUserStatus = async (row: any) => {
  try {
    // TODO: 调用API切换用户状态
    ElMessage.success(`用户已${row.status === 1 ? '禁用' : '启用'}`)
    fetchUsers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

