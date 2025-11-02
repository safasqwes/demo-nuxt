<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-5">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ $t('pricing.title') }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ $t('pricing.subtitle') }}
        </p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="product in products" :key="product.id" 
             class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <!-- Product Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">{{ product.icon }}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <!-- Price -->
          <div class="text-center mb-6">
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ${{ product.fiatPrice }}
            </div>
            <div class="text-sm text-gray-500">
              {{ $t('pricing.oneTimePayment') }}
            </div>
          </div>

          <!-- Features -->
          <!-- <ul class="space-y-3 mb-8">
            <li v-for="feature in product.features" :key="feature" 
                class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ feature }}
            </li>
          </ul> -->

          <!-- Select Button -->
          <button @click="selectProduct(product)"
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            {{ $t('pricing.selectPlan') }}
          </button>
        </div>
      </div>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl font-bold mb-6">{{ $t('pricing.readyToStart') }}</h2>
          <!-- <p class="text-xl text-blue-100 mb-8">
            Join over 1 million creators and start using our professional tools
          </p> -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="startFreeTrial" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              {{ $t('pricing.startFreeTrial') }}
            </button>
            <button @click="goToContact" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              {{ $t('pricing.contactUs') }}
            </button>
          </div>
        </div>
      </section>
      <!-- Payment Method Selection Modal -->
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-8">
            <!-- Modal Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ $t('pricing.completePurchase') }}</h2>
              <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Product Summary -->
            <div v-if="selectedProduct" class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ selectedProduct.name }}</h3>
                  <p class="text-sm text-gray-600">{{ selectedProduct.description }}</p>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">${{ selectedProduct.fiatPrice }}</div>
                  <div class="text-sm text-gray-500">{{ $t('pricing.oneTimePayment') }}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button @click="closePaymentModal"
                      class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                {{ $t('pricing.cancel') }}
              </button>
              <button @click="goToStripePayment" 
                      :disabled="isCreatingPayment"
                      class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isCreatingPayment" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('pricing.creatingPayment') }}
                </span>
                <span v-else>{{ $t('pricing.proceedToPayment') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { paymentService } from '~/utils/paymentService'

// SEO Meta
const { t } = useI18n()
useHead({
  title: t('pricing.seo.title'),
  meta: [
    { name: 'description', content: t('pricing.seo.description') },
    { name: 'keywords', content: t('pricing.seo.keywords') }
  ]
})

// Types
interface PaymentProduct {
  id: string
  name: string
  description: string
  fiatPrice: number
  icon: string
  features: string[]
}

// Redirect to home page if pricing page is accessed directly (hidden until payment is ready)

// Reactive data
const products = ref<PaymentProduct[]>([])
const selectedProduct = ref<PaymentProduct | null>(null)
const showPaymentModal = ref(false)
const isCreatingPayment = ref(false)

// Services
const { notify } = useNotification()

// Initialize products
const initializeProducts = async () => {
  try {
    const response = await paymentService.getProducts()
    if (response.success && response.products) {
      // 将后端返回的 PaymentPlan 转换为前端需要的 PaymentProduct 格式
      products.value = response.products.map((plan: any) => ({
        id: plan.planId.toString(),
        name: plan.planName, // 后端字段是 planName
        description: plan.description,
        fiatPrice: plan.price / 100, // 后端返回的是分，转换为元
        icon: getPlanIcon(plan.planName), // 根据套餐名称获取图标
        features: plan.features ? plan.features.split(',') : [] // features 是字符串，需要分割
      }))
    } else {
      console.error('Failed to load products:', response.message || 'Unknown error')
      notify.error('Error', response.message || t('pricing.failedToLoadProducts'))
    }
  } catch (error) {
    console.error('Error loading products:', error)
    notify.error('Error', t('pricing.failedToLoadProducts'))
  }
}

// 根据套餐名称获取图标
const getPlanIcon = (planName: string): string => {
  const name = planName.toLowerCase()
  if (name.includes('basic') || name.includes('基础') || name.includes('入门')) return '📦'
  if (name.includes('pro') || name.includes('专业') || name.includes('高级')) return '⭐'
  if (name.includes('enterprise') || name.includes('企业') || name.includes('商业')) return '🏢'
  if (name.includes('premium') || name.includes('高级') || name.includes('尊享')) return '💎'
  if (name.includes('vip') || name.includes('会员')) return '👑'
  if (name.includes('free') || name.includes('免费') || name.includes('试用')) return '🆓'
  return '📋' // 默认图标
}

// Select product
const selectProduct = async (product: PaymentProduct) => {
  // 首先验证登录状态
  const { verifLogin } = await import('~/utils/verifLogin')
  
  const isLoggedIn = await verifLogin({
    message: t('pricing.pleaseLogin') || '请登录以选择方案',
    onSuccess: () => {
      // 用户登录成功，继续选择产品
      selectedProduct.value = product
      showPaymentModal.value = true
    },
    onCancel: () => {
      // 用户取消登录
      notify.info('提示', '需要登录后才能选择购买方案')
    },
    loginType: 'google' // 只显示 Google 登录
  })

  // 如果用户未登录或取消登录，则不继续
  if (!isLoggedIn) {
    return
  }

  // 用户已登录，继续选择产品（如果 onSuccess 中没有处理）
  if (!selectedProduct.value) {
    selectedProduct.value = product
    showPaymentModal.value = true
  }
}

// Go to Stripe payment page
const goToStripePayment = async () => {
  if (!selectedProduct.value) {
    notify.error('Error', 'Please select a product first')
    return
  }

  isCreatingPayment.value = true
  
  try {
    // Redirect to payment page with planId
    await navigateTo(`/payment?planId=${selectedProduct.value.id}`)
  } catch (error) {
    console.error('Navigation error:', error)
    notify.error('Error', 'Failed to navigate to payment page')
  } finally {
    isCreatingPayment.value = false
  }
}

// Close payment modal
const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedProduct.value = null
}

// Start free trial - navigate to home page
const startFreeTrial = () => {
  navigateTo('/')
}

// Go to contact page
const goToContact = () => {
  navigateTo('/contact-us')
}

// Format time remaining
const formatTimeRemaining = (ttl: number) => {
  const now = Date.now() / 1000
  const remaining = ttl - now
  if (remaining <= 0) return 'expired'
  
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)
  return `${minutes}m ${seconds}s`
}

// Initialize
onMounted(async () => {
  // 隐藏 pricing 页面，重定向到首页
  await navigateTo('/')
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
