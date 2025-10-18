<template>
  <div class="pricing-page">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">选择您的套餐</h1>
        <p class="text-xl text-gray-600">解锁更多功能，享受更好的阅读体验</p>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div 
          v-for="plan in plans" 
          :key="plan.id"
          class="pricing-card bg-white rounded-xl shadow-lg p-8 relative"
          :class="{ 'ring-2 ring-blue-500 scale-105': plan.is_popular }"
        >
          <!-- 推荐标签 -->
          <div v-if="plan.is_popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              最受欢迎
            </span>
          </div>
          
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-gray-600 mb-4">{{ plan.description }}</p>
            
            <div class="mb-4">
              <span class="text-4xl font-bold text-blue-600">${{ (plan.price / 100).toFixed(2) }}</span>
              <span v-if="plan.plan_type === 1" class="text-gray-500">/月</span>
            </div>
            
            <div class="text-lg font-semibold text-green-600 mb-4">
              {{ plan.points.toLocaleString() }} 积分
            </div>
          </div>
          
          <ul class="space-y-3 mb-8">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center">
              <el-icon class="text-green-500 mr-2"><Check /></el-icon>
              <span>{{ feature }}</span>
            </li>
          </ul>
          
          <el-button 
            type="primary" 
            size="large" 
            class="w-full"
            @click="selectPlan(plan)"
            :loading="selectedPlanId === plan.id"
          >
            {{ plan.plan_type === 1 ? '立即订阅' : '立即购买' }}
          </el-button>
        </div>
      </div>
      
      <!-- 积分说明 -->
      <div class="mt-16 bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-6">积分使用说明</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon class="text-blue-600 text-2xl"><Reading /></el-icon>
            </div>
            <h3 class="font-semibold mb-2">解锁VIP章节</h3>
            <p class="text-gray-600 text-sm">使用积分解锁付费章节，享受完整阅读体验</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon class="text-green-600 text-2xl"><Star /></el-icon>
            </div>
            <h3 class="font-semibold mb-2">无广告阅读</h3>
            <p class="text-gray-600 text-sm">去除所有广告干扰，专注阅读体验</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <el-icon class="text-purple-600 text-2xl"><Download /></el-icon>
            </div>
            <h3 class="font-semibold mb-2">离线下载</h3>
            <p class="text-gray-600 text-sm">下载小说到本地，随时随地阅读</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Reading, Star, Download } from '@element-plus/icons-vue'

// 定义套餐类型
interface PaymentPlan {
  id: number
  plan_id: string
  price_id: string
  name: string
  description: string
  price: number
  currency: string
  points: number
  duration_days: number | null
  plan_type: number // 1-订阅 2-一次性购买
  features: string[]
  is_popular?: boolean
}

const router = useRouter()
const loading = ref(false)
const plans = ref<PaymentPlan[]>([])
const selectedPlanId = ref<number | null>(null)

// 获取套餐列表
const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/payment/plans')
    if (response.success) {
      plans.value = response.data.map((plan: any) => ({
        id: plan.id,
        plan_id: plan.planId,
        price_id: plan.priceId,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        points: plan.points,
        duration_days: plan.durationDays,
        plan_type: plan.planType,
        features: plan.features ? JSON.parse(plan.features) : [],
        is_popular: plan.id === 2 // Mark second plan as popular
      }))
    } else {
      throw new Error(response.message || 'Failed to fetch plans')
    }
  } catch (error: any) {
    console.error('Failed to fetch plans:', error)
    ElMessage.error('获取套餐信息失败: ' + (error.message || 'Unknown error'))
    
    // Fallback to mock data
    plans.value = [
      {
        id: 1,
        plan_id: 'plan_basic',
        price_id: 'price_basic',
        name: '基础套餐',
        description: '适合偶尔阅读的用户',
        price: 999, // $9.99
        currency: 'usd',
        points: 1000,
        duration_days: null,
        plan_type: 2,
        features: [
          '1000 积分',
          '解锁VIP章节',
          '无广告阅读',
          '基础客服支持'
        ]
      },
      {
        id: 2,
        plan_id: 'plan_premium',
        price_id: 'price_premium',
        name: '高级套餐',
        description: '最受欢迎的选择',
        price: 1999, // $19.99
        currency: 'usd',
        points: 2500,
        duration_days: null,
        plan_type: 2,
        is_popular: true,
        features: [
          '2500 积分',
          '解锁VIP章节',
          '无广告阅读',
          '离线下载',
          '优先客服支持',
          '专属阅读主题'
        ]
      },
      {
        id: 3,
        plan_id: 'plan_subscription',
        price_id: 'price_subscription',
        name: '月度订阅',
        description: '每月自动续费',
        price: 999, // $9.99/月
        currency: 'usd',
        points: 500,
        duration_days: 30,
        plan_type: 1,
        features: [
          '每月 500 积分',
          '解锁VIP章节',
          '无广告阅读',
          '离线下载',
          '优先客服支持',
          '自动续费'
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

// 选择套餐
const selectPlan = async (plan: PaymentPlan) => {
  selectedPlanId.value = plan.id
  
  try {
    const response = await $fetch('/api/payment/create-session', {
      method: 'POST',
      body: { 
        planId: plan.plan_id,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      }
    })
    
    if (response.success) {
      // 跳转到Stripe支付页面
      window.location.href = response.data.checkoutUrl
    } else {
      throw new Error(response.message || 'Failed to create checkout session')
    }
  } catch (error: any) {
    console.error('Failed to create checkout session:', error)
    ElMessage.error('创建支付会话失败: ' + (error.message || 'Unknown error'))
  } finally {
    selectedPlanId.value = null
  }
}

onMounted(() => {
  fetchPlans()
})

// SEO
useHead({
  title: '套餐选择 - NovelHub',
  meta: [
    { name: 'description', content: '选择适合您的积分套餐，解锁更多阅读功能' }
  ]
})
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pricing-card {
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>

