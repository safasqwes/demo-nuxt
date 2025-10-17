<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">小说管理</h1>
      <div class="flex gap-2">
        <el-input v-model="search" placeholder="搜索小说名称/作者" clearable class="w-64" />
        <el-button type="primary" @click="createNovel">新增小说</el-button>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="novel_name" label="名称" min-width="200" />
      <el-table-column prop="author" label="作者" width="140" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'info' : row.status === 2 ? 'warning' : 'success'">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publish_status" label="发布" width="120">
        <template #default="{ row }">
          <el-tag :type="row.publish_status === 1 ? 'success' : 'info'">
            {{ row.publish_status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editNovel(row)">编辑</el-button>
          <el-button size="small" @click="goChapters(row)">章节</el-button>
          <el-button size="small" type="danger" @click="removeNovel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination
        v-model:current-page="page"
        :page-size="size"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminNovelStore } from '~/modules/admin/stores/novels'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const store = useAdminNovelStore()
const loading = ref(false)
const items = computed(() => store.items)
const total = computed(() => store.total)
const page = ref(1)
const size = ref(10)
const search = ref('')

const fetch = async () => {
  loading.value = true
  try {
    await store.fetchNovels(page.value, size.value)
  } finally {
    loading.value = false
  }
}

watch([page, size], fetch)

onMounted(fetch)

const statusText = (s: number) => (s === 1 ? '已完结' : s === 2 ? '停更' : '连载中')

const createNovel = () => {
  // TODO: 打开创建弹窗
  ElMessage.info('创建小说功能开发中...')
}

const editNovel = (row: any) => {
  // TODO: 打开编辑弹窗
  ElMessage.info(`编辑小说 #${row.id}`)
}

const goChapters = (row: any) => {
  navigateTo(`/admin/novels/${row.id}/chapters`)
}

const removeNovel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该小说？', '提示', { type: 'warning' })
    // TODO: 调用删除接口
    ElMessage.success('已删除')
    fetch()
  } catch {}
}
</script>

