<template>
  <div class="orders-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">我的订单</h1>
      
      <!-- 筛选器 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">状态:</label>
            <el-select v-model="filters.status" placeholder="全部状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="待支付" value="0" />
              <el-option label="已支付" value="1" />
              <el-option label="已取消" value="2" />
              <el-option label="已退款" value="3" />
            </el-select>
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">时间范围:</label>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
          
          <el-button type="primary" @click="fetchOrders">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <el-empty description="暂无订单记录">
          <el-button type="primary" @click="$router.push('/pricing')">
            去购买套餐
          </el-button>
        </el-empty>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold">{{ order.plan_name }}</h3>
              <p class="text-sm text-gray-600">订单号: {{ order.order_id }}</p>
            </div>
            <div class="text-right">
              <el-tag 
                :type="getStatusType(order.status)"
                size="large"
              >
                {{ getStatusText(order.status) }}
              </el-tag>
              <p class="text-sm text-gray-500 mt-1">{{ formatDate(order.created_at) }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span class="text-sm text-gray-600">支付金额:</span>
              <p class="font-semibold text-lg">${{ (order.amount / 100).toFixed(2) }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">获得积分:</span>
              <p class="font-semibold text-lg text-green-600">{{ order.points.toLocaleString() }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">支付方式:</span>
              <p class="font-semibold">{{ getPaymentMethod(order.payment_intent_id) }}</p>
            </div>
          </div>
          
          <div v-if="order.subscription_id" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-2">
              <el-icon class="text-blue-600"><Refresh /></el-icon>
              <span class="text-sm text-blue-800">订阅订单</span>
            </div>
            <p class="text-xs text-blue-600 mt-1">
              订阅ID: {{ order.subscription_id }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <el-button 
              size="small" 
              @click="viewOrderDetail(order)"
            >
              查看详情
            </el-button>
            
            <el-button 
              v-if="order.status === 0"
              type="primary" 
              size="small"
              @click="continuePayment(order)"
            >
              继续支付
            </el-button>
            
            <el-button 
              v-if="order.status === 1 && order.subscription_id"
              type="warning" 
              size="small"
              @click="cancelSubscription(order)"
            >
              取消订阅
            </el-button>
            
            <el-button 
              v-if="order.status === 1"
              type="success" 
              size="small"
              @click="downloadInvoice(order)"
            >
              下载发票
            </el-button>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="flex justify-center mt-8">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

// 定义订单类型
interface Order {
  id: number
  order_id: string
  plan_name: string
  amount: number
  currency: string
  points: number
  status: number
  subscription_id?: string
  payment_intent_id?: string
  created_at: string
  updated_at: string
}

const router = useRouter()
const loading = ref(false)
const orders = ref<Order[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filters = ref({
  status: '',
  dateRange: null as [string, string] | null
})

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取订单列表
    // const response = await $fetch('/api/orders', {
    //   query: {
    //     page: currentPage.value,
    //     size: pageSize.value,
    //     status: filters.value.status,
    //     start_date: filters.value.dateRange?.[0],
    //     end_date: filters.value.dateRange?.[1]
    //   }
    // })
    // orders.value = response.data
    // total.value = response.total
    
    // 模拟数据
    orders.value = [
      {
        id: 1,
        order_id: 'ORD-20251016-001',
        plan_name: '高级套餐',
        amount: 1999,
        currency: 'usd',
        points: 2500,
        status: 1,
        payment_intent_id: 'pi_1234567890',
        created_at: '2025-10-15T10:30:00Z',
        updated_at: '2025-10-15T10:35:00Z'
      },
      {
        id: 2,
        order_id: 'ORD-20251016-002',
        plan_name: '月度订阅',
        amount: 999,
        currency: 'usd',
        points: 500,
        status: 1,
        subscription_id: 'sub_1234567890',
        payment_intent_id: 'pi_0987654321',
        created_at: '2025-10-14T15:20:00Z',
        updated_at: '2025-10-14T15:25:00Z'
      },
      {
        id: 3,
        order_id: 'ORD-20251016-003',
        plan_name: '基础套餐',
        amount: 999,
        currency: 'usd',
        points: 1000,
        status: 0,
        created_at: '2025-10-13T09:15:00Z',
        updated_at: '2025-10-13T09:15:00Z'
      }
    ]
    total.value = 3
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = (order: Order) => {
  router.push(`/orders/${order.id}`)
}

// 继续支付
const continuePayment = (order: Order) => {
  router.push(`/payment/checkout?order_id=${order.order_id}`)
}

// 取消订阅
const cancelSubscription = async (order: Order) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消订阅吗？取消后将无法享受订阅权益。',
      '取消订阅',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用API取消订阅
    // await $fetch(`/api/subscription/${order.subscription_id}/cancel`, { method: 'POST' })
    
    ElMessage.success('订阅已取消')
    fetchOrders()
  } catch (error) {
    // 用户取消操作
  }
}

// 下载发票
const downloadInvoice = (order: Order) => {
  // TODO: 实现发票下载
  ElMessage.info('发票下载功能开发中...')
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchOrders()
}

// 获取状态类型
const getStatusType = (status: number) => {
  const types = ['warning', 'success', 'info', 'danger']
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const texts = ['待支付', '已支付', '已取消', '已退款']
  return texts[status] || '未知'
}

// 获取支付方式
const getPaymentMethod = (paymentIntentId?: string) => {
  if (!paymentIntentId) return '未知'
  // 根据payment_intent_id判断支付方式
  return '信用卡'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchOrders()
})

// SEO
useHead({
  title: '我的订单 - NovelHub',
  meta: [
    { name: 'description', content: '查看您的订单记录和支付历史' }
  ]
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.order-card {
  transition: transform 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>

