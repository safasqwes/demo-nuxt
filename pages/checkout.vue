<template>
  <div class="checkout-page">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 订单信息 -->
          <div class="order-summary">
            <h2 class="text-2xl font-bold mb-6">订单详情</h2>
            
            <div v-if="selectedPlan" class="bg-white rounded-lg shadow-md p-6 mb-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <el-icon class="text-gray-400 text-2xl"><Reading /></el-icon>
                </div>
                <div>
                  <h3 class="font-semibold text-lg">{{ selectedPlan.name }}</h3>
                  <p class="text-gray-600">{{ selectedPlan.description }}</p>
                </div>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>套餐类型:</span>
                  <span>{{ selectedPlan.plan_type === 1 ? '订阅' : '一次性购买' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>积分数量:</span>
                  <span class="font-semibold">{{ selectedPlan.points.toLocaleString() }} 积分</span>
                </div>
                <div class="flex justify-between">
                  <span>有效期:</span>
                  <span>{{ selectedPlan.duration_days ? `${selectedPlan.duration_days}天` : '永久' }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>总价:</span>
                  <span class="text-blue-600">${{ (selectedPlan.price / 100).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 支付方式选择 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="font-semibold text-lg mb-4">选择支付方式</h3>
              
              <div class="space-y-3">
                <div 
                  v-for="method in paymentMethods" 
                  :key="method.id"
                  class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="{ 'border-blue-500 bg-blue-50': selectedPaymentMethod === method.id }"
                  @click="selectedPaymentMethod = method.id"
                >
                  <el-radio v-model="selectedPaymentMethod" :label="method.id" class="mr-3">
                    <el-icon class="text-xl mr-2">
                      <component :is="method.icon" />
                    </el-icon>
                    {{ method.name }}
                  </el-radio>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 支付表单 -->
          <div class="payment-form">
            <h2 class="text-2xl font-bold mb-6">支付信息</h2>
            
            <PaymentForm
              :payment-methods="paymentMethods"
              :selected-method="selectedPaymentMethod"
              :processing="processing"
              :selected-plan="selectedPlan"
              @method-change="selectedPaymentMethod = $event"
              @process-payment="processPayment"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Reading, CreditCard, Lock } from '@element-plus/icons-vue'

// 定义类型
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
  plan_type: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  available: boolean
}

const router = useRouter()
const route = useRoute()

const selectedPlan = ref<PaymentPlan | null>(null)
const selectedPaymentMethod = ref('stripe')
const processing = ref(false)

const paymentMethods: PaymentMethod[] = [
  { id: 'stripe', name: '信用卡/借记卡', icon: 'CreditCard', available: true },
  { id: 'paypal', name: 'PayPal', icon: 'Wallet', available: true },
  { id: 'alipay', name: '支付宝', icon: 'Money', available: false },
  { id: 'wechat', name: '微信支付', icon: 'ChatDotRound', available: false }
]

// 获取套餐信息
const fetchPlanDetails = async (planId: string) => {
  try {
    // TODO: 调用API获取套餐详情
    // const response = await $fetch(`/api/payment/plans/${planId}`)
    // selectedPlan.value = response.data
    
    // 模拟数据
    selectedPlan.value = {
      id: 1,
      plan_id: planId,
      price_id: 'price_premium',
      name: '高级套餐',
      description: '最受欢迎的选择',
      price: 1999,
      currency: 'usd',
      points: 2500,
      duration_days: null,
      plan_type: 2
    }
  } catch (error) {
    ElMessage.error('获取套餐信息失败')
    router.push('/pricing')
  }
}

// 初始化支付方式
const initializePayment = () => {
  if (selectedPaymentMethod.value === 'stripe') {
    initializeStripe()
  } else if (selectedPaymentMethod.value === 'paypal') {
    initializePayPal()
  }
}

// 初始化Stripe
const initializeStripe = () => {
  // TODO: 初始化Stripe Elements
  console.log('Initializing Stripe...')
}

// 初始化PayPal
const initializePayPal = () => {
  // TODO: 初始化PayPal按钮
  console.log('Initializing PayPal...')
}

// 处理支付
const processPayment = async () => {
  if (!selectedPlan.value) {
    ElMessage.error('请选择套餐')
    return
  }
  
  processing.value = true
  
  try {
    if (selectedPaymentMethod.value === 'stripe') {
      await processStripePayment()
    } else if (selectedPaymentMethod.value === 'paypal') {
      await processPayPalPayment()
    }
  } catch (error) {
    ElMessage.error('支付处理失败')
  } finally {
    processing.value = false
  }
}

// Stripe支付处理
const processStripePayment = async () => {
  // TODO: 处理Stripe支付
  console.log('Processing Stripe payment...')
  
  // 模拟支付成功
  setTimeout(() => {
    ElMessage.success('支付成功！')
    router.push('/orders')
  }, 2000)
}

// PayPal支付处理
const processPayPalPayment = async () => {
  // TODO: 处理PayPal支付
  console.log('Processing PayPal payment...')
  
  // 模拟支付成功
  setTimeout(() => {
    ElMessage.success('支付成功！')
    router.push('/orders')
  }, 2000)
}

// 监听支付方式变化
watch(selectedPaymentMethod, () => {
  nextTick(() => {
    initializePayment()
  })
})

onMounted(async () => {
  const planId = route.query.plan_id as string
  if (planId) {
    await fetchPlanDetails(planId)
    nextTick(() => {
      initializePayment()
    })
  } else {
    ElMessage.error('请选择套餐')
    router.push('/pricing')
  }
})

onUnmounted(() => {
  // 清理支付组件
})

// SEO
useHead({
  title: '支付页面 - NovelHub',
  meta: [
    { name: 'description', content: '安全便捷的支付体验' }
  ]
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.order-summary,
.payment-form {
  height: fit-content;
}
</style>

