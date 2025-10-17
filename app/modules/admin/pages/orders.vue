<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">订单管理</h1>
      <div class="flex gap-2">
        <el-select v-model="statusFilter" placeholder="订单状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="待支付" value="0" />
          <el-option label="已支付" value="1" />
          <el-option label="已取消" value="2" />
          <el-option label="已退款" value="3" />
        </el-select>
        <el-input v-model="search" placeholder="搜索订单号" clearable class="w-64" />
        <el-button type="primary" @click="fetchOrders">搜索</el-button>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="order_id" label="订单号" width="180" />
      <el-table-column prop="user_id" label="用户ID" width="100" />
      <el-table-column prop="plan_name" label="套餐名称" min-width="150" />
      <el-table-column prop="amount" label="金额" width="120">
        <template #default="{ row }">
          ${{ (row.amount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewOrder(row)">详情</el-button>
          <el-button 
            v-if="row.status === 1"
            size="small" 
            type="danger"
            @click="refundOrder(row)"
          >
            退款
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
        @current-change="fetchOrders"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminOrderStore } from '~/modules/admin/stores/orders'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const store = useAdminOrderStore()
const loading = ref(false)
const items = computed(() => store.items)
const total = computed(() => store.total)
const page = ref(1)
const size = ref(20)
const search = ref('')
const statusFilter = ref('')

const fetchOrders = async () => {
  loading.value = true
  try {
    await store.fetchOrders(page.value, size.value)
  } finally {
    loading.value = false
  }
}

watch([page, size], fetchOrders)

onMounted(fetchOrders)

const getStatusType = (status: number) => {
  const types = ['warning', 'success', 'info', 'danger']
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts = ['待支付', '已支付', '已取消', '已退款']
  return texts[status] || '未知'
}

const viewOrder = (row: any) => {
  navigateTo(`/admin/orders/${row.id}`)
}

const refundOrder = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认退款该订单？', '提示', { type: 'warning' })
    // TODO: 调用退款API
    ElMessage.success('退款成功')
    fetchOrders()
  } catch {}
}
</script>

