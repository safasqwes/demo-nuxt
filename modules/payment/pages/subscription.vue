<template>
  <div class="subscription-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">订阅管理</h1>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else-if="!subscription" class="text-center py-12">
        <el-empty description="您还没有订阅任何套餐">
          <el-button type="primary" @click="$router.push('/pricing')">
            去选择套餐
          </el-button>
        </el-empty>
      </div>
      
      <div v-else class="max-w-4xl mx-auto">
        <!-- 当前订阅信息 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">{{ subscription.plan_name }}</h2>
              <p class="text-gray-600">{{ subscription.description }}</p>
            </div>
            <el-tag 
              :type="getStatusType(subscription.status)"
              size="large"
            >
              {{ getStatusText(subscription.status) }}
            </el-tag>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div class="text-sm text-gray-600 mb-1">订阅ID</div>
              <div class="font-mono text-sm">{{ subscription.subscription_id }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">下次扣费时间</div>
              <div class="font-semibold">{{ formatDate(subscription.current_period_end) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">每月费用</div>
              <div class="font-semibold text-lg">${{ (subscription.amount / 100).toFixed(2) }}</div>
            </div>
          </div>
          
          <div class="flex gap-4">
            <el-button 
              type="primary"
              @click="updatePaymentMethod"
            >
              更新支付方式
            </el-button>
            <el-button 
              type="warning"
              @click="pauseSubscription"
              :disabled="subscription.status !== 'active'"
            >
              暂停订阅
            </el-button>
            <el-button 
              type="danger"
              @click="cancelSubscription"
            >
              取消订阅
            </el-button>
          </div>
        </div>
        
        <!-- 订阅历史 -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="p-6 border-b">
            <h3 class="text-xl font-semibold">订阅历史</h3>
          </div>
          
          <div v-if="subscriptionHistory.length === 0" class="text-center py-8">
            <el-empty description="暂无历史记录" />
          </div>
          
          <div v-else class="divide-y">
            <div 
              v-for="record in subscriptionHistory" 
              :key="record.id"
              class="p-6"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ record.plan_name }}</div>
                  <div class="text-sm text-gray-600">{{ formatDate(record.created_at) }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold">${{ (record.amount / 100).toFixed(2) }}</div>
                  <el-tag 
                    :type="getStatusType(record.status)"
                    size="small"
                  >
                    {{ getStatusText(record.status) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义订阅类型
interface Subscription {
  id: number
  subscription_id: string
  plan_name: string
  description: string
  amount: number
  currency: string
  status: string
  current_period_start: string
  current_period_end: string
  created_at: string
}

interface SubscriptionHistory {
  id: number
  plan_name: string
  amount: number
  status: string
  created_at: string
}

const router = useRouter()
const loading = ref(false)
const subscription = ref<Subscription | null>(null)
const subscriptionHistory = ref<SubscriptionHistory[]>([])

// 获取订阅信息
const fetchSubscription = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取订阅信息
    // const response = await $fetch('/api/user/subscription')
    // subscription.value = response.data
    
    // 模拟数据
    subscription.value = {
      id: 1,
      subscription_id: 'sub_1234567890',
      plan_name: '月度订阅',
      description: '每月自动续费，享受持续服务',
      amount: 999,
      currency: 'usd',
      status: 'active',
      current_period_start: '2025-10-01T00:00:00Z',
      current_period_end: '2025-11-01T00:00:00Z',
      created_at: '2025-09-01T10:30:00Z'
    }
    
    // 获取订阅历史
    subscriptionHistory.value = [
      {
        id: 1,
        plan_name: '月度订阅',
        amount: 999,
        status: 'active',
        created_at: '2025-10-01T00:00:00Z'
      },
      {
        id: 2,
        plan_name: '月度订阅',
        amount: 999,
        status: 'active',
        created_at: '2025-09-01T00:00:00Z'
      }
    ]
  } catch (error) {
    ElMessage.error('获取订阅信息失败')
  } finally {
    loading.value = false
  }
}

// 更新支付方式
const updatePaymentMethod = () => {
  // TODO: 实现支付方式更新
  ElMessage.info('支付方式更新功能开发中...')
}

// 暂停订阅
const pauseSubscription = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要暂停订阅吗？暂停期间将无法享受订阅服务。',
      '暂停订阅',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用API暂停订阅
    // await $fetch(`/api/subscription/${subscription.value?.subscription_id}/pause`, { method: 'POST' })
    
    ElMessage.success('订阅已暂停')
    fetchSubscription()
  } catch (error) {
    // 用户取消操作
  }
}

// 取消订阅
const cancelSubscription = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要取消订阅吗？取消后将无法享受订阅服务，且无法恢复。',
      '取消订阅',
      {
        confirmButtonText: '确定取消',
        cancelButtonText: '保留订阅',
        type: 'warning'
      }
    )
    
    // TODO: 调用API取消订阅
    // await $fetch(`/api/subscription/${subscription.value?.subscription_id}/cancel`, { method: 'POST' })
    
    ElMessage.success('订阅已取消')
    subscription.value = null
  } catch (error) {
    // 用户取消操作
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    'active': 'success',
    'paused': 'warning',
    'cancelled': 'danger',
    'past_due': 'warning'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'active': '活跃',
    'paused': '已暂停',
    'cancelled': '已取消',
    'past_due': '逾期'
  }
  return texts[status] || '未知'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchSubscription()
})

// SEO
useHead({
  title: '订阅管理 - NovelHub',
  meta: [
    { name: 'description', content: '管理您的订阅服务，查看订阅状态和历史记录' }
  ]
})
</script>

<style scoped>
.subscription-page {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

