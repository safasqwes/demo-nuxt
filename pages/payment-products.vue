<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <section class="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          选择适合您的
          <span class="text-yellow-300">创作计划</span>
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          从个人创作者到专业工作室，我们为每个创作者提供完美的解决方案
        </p>
        
        <!-- Billing Toggle -->
        <div class="flex items-center justify-center space-x-4 mb-12">
          <span :class="billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'">月付</span>
          <button
            @click="toggleBilling"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
            :class="billingCycle === 'yearly' ? 'bg-yellow-400' : 'bg-gray-600'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span :class="billingCycle === 'yearly' ? 'text-white' : 'text-blue-200'">年付</span>
          <span v-if="billingCycle === 'yearly'" class="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
            节省 20%
          </span>
        </div>
      </div>
    </section>
    <div class="max-w-6xl mx-auto px-5">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a subscription plan or purchase individual content with crypto payments
        </p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Subscription Plans -->
        <div v-for="product in subscriptionProducts" :key="product.id" 
             class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-6">{{ product.description }}</p>
            <div class="text-4xl font-bold text-green-600 mb-2">${{ product.fiatPrice }}</div>
            <div class="text-sm text-gray-500 mb-6">per month</div>
            <button @click="selectProduct(product)" 
                    class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200">
              Select Plan
            </button>
          </div>
        </div>

        <!-- Individual Content -->
        <!-- <div v-for="product in contentProducts" :key="product.id" 
             class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-6">{{ product.description }}</p>
            <div class="text-4xl font-bold text-blue-600 mb-2">${{ product.fiatPrice }}</div>
            <div class="text-sm text-gray-500 mb-6">one-time purchase</div>
            <button @click="selectProduct(product)" 
                    class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              Purchase Now
            </button>
          </div>
        </div> -->
      </div>

    <!-- Features Comparison -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">功能对比</h2>
          <p class="text-xl text-gray-600">详细了解每个计划包含的功能</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-6 font-semibold text-gray-900">功能</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">社交版</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">专业版</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">全包版</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-medium text-gray-900">{{ feature.name }}</td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.social" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.pro" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.max" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">常见问题</h2>
          <p class="text-xl text-gray-600">解答您可能关心的问题</p>
        </div>

        <div class="space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">{{ faq.question }}</h3>
                <svg
                  class="w-5 h-5 text-gray-500 transform transition-transform"
                  :class="{ 'rotate-180': openFaqs.includes(index) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
            <div v-if="openFaqs.includes(index)" class="px-6 pb-6">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-6">准备开始您的创作之旅？</h2>
        <p class="text-xl text-blue-100 mb-8">
          加入超过 100 万创作者，开始使用我们的专业工具
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            开始免费试用
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
            联系我们
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
              <h2 class="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Selected Product Info -->
            <div v-if="selectedProduct" class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-gray-900 mb-2">{{ selectedProduct.name }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ selectedProduct.description }}</p>
              <div class="text-2xl font-bold text-green-600">${{ selectedProduct.fiatPrice }}</div>
            </div>

            <!-- Currency Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Select Payment Currency</label>
              <div class="grid grid-cols-2 gap-3">
                <button v-for="token in supportedTokens" :key="token.symbol"
                        @click="selectCurrency(token.symbol)"
                        :class="[
                          'p-4 rounded-lg border-2 transition-all duration-200',
                          selectedCurrency === token.symbol 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        ]">
                  <div class="text-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span class="text-white font-bold text-sm">{{ token.symbol.charAt(0) }}</span>
                    </div>
                    <div class="font-semibold text-gray-900">{{ token.symbol }}</div>
                    <div class="text-xs text-gray-500">{{ token.name }}</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Price Display -->
            <div v-if="priceInfo" class="bg-blue-50 rounded-lg p-4 mb-6">
              <div class="text-center">
                <div class="text-sm text-gray-600 mb-1">You will pay</div>
                <div class="text-3xl font-bold text-blue-600">{{ priceInfo.tokenAmount }} {{ selectedCurrency }}</div>
                <div class="text-sm text-gray-500">≈ ${{ priceInfo.fiatAmount }}</div>
                <div class="text-xs text-gray-400 mt-1">Price valid for {{ formatTimeRemaining(priceInfo.priceTTL) }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button @click="closePaymentModal" 
                      class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button @click="proceedToPayment" 
                      :disabled="!selectedCurrency || !priceInfo"
                      class="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Proceed to Payment
              </button>
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
import { useNotification } from '~/utils/useNotification'
import { paymentService } from '~/utils/paymentService'
import type { PaymentProduct, TokenConfig } from '~/types/payment'

// Meta tags for SEO
useHead({
  title: 'Payment Products - NovelHub',
  meta: [
    { name: 'description', content: 'Choose from our subscription plans or purchase individual content with crypto payments.' },
    { name: 'keywords', content: 'subscription, crypto payment, web3, novelhub, content' }
  ]
})

const router = useRouter()
const { notify } = useNotification()

// Reactive data
const subscriptionProducts = ref<PaymentProduct[]>([])
const contentProducts = ref<PaymentProduct[]>([])
const supportedTokens = ref<TokenConfig[]>([])
const showPaymentModal = ref(false)
const selectedProduct = ref<PaymentProduct | null>(null)
const selectedCurrency = ref('')
const priceInfo = ref<any>(null)

// 响应式数据
const billingCycle = ref<'monthly' | 'yearly'>('yearly')
const openFaqs = ref<number[]>([])


// 功能对比数据
const features = ref([
  { name: '无限下载音乐和音效', social: true, pro: true, max: true },
  { name: '社交媒体授权', social: true, pro: true, max: true },
  { name: '商业用途授权', social: false, pro: true, max: true },
  { name: '音乐分轨下载', social: false, pro: true, max: true },
  { name: '客户项目授权', social: false, pro: true, max: true },
  { name: '视频素材和模板', social: false, pro: false, max: true },
  { name: '8K 视频素材', social: false, pro: false, max: true },
  { name: 'AI 配音和图像生成', social: false, pro: false, max: true },
  { name: 'RAW/LOG 素材', social: false, pro: false, max: true },
  { name: '优先客户支持', social: false, pro: true, max: true }
])
// FAQ 数据
const faqs = ref([
  {
    question: '免费试用期有多长？',
    answer: '所有计划都提供 7 天免费试用，无需信用卡即可开始。试用期间您可以访问所有功能，体验完整的服务。'
  },
  {
    question: '可以随时取消订阅吗？',
    answer: '是的，您可以随时取消订阅。取消后，您仍然可以使用服务直到当前计费周期结束。'
  },
  {
    question: '年付和月付有什么区别？',
    answer: '年付计划比月付计划便宜约 20%，并且提供更好的价值。年付用户还可以享受优先客户支持。'
  },
  {
    question: '商业用途授权包括什么？',
    answer: '商业用途授权允许您将内容用于付费项目、客户工作、广告和全球分发。这包括所有形式的商业使用。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持所有主要信用卡（Visa、MasterCard、American Express）、PayPal 和银行转账。'
  },
  {
    question: '可以升级或降级计划吗？',
    answer: '是的，您可以随时升级或降级您的计划。升级立即生效，降级将在当前计费周期结束后生效。'
  }
])
const toggleBilling = () => {
  billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
}

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}
// 从后端 API 获取套餐列表
const initializeProducts = async () => {
  try {
    const response = await paymentService.getProducts()
    if (response.success && response.products) {
      // 转换为前端需要的格式
      subscriptionProducts.value = response.products.map(plan => ({
        id: plan.planId,
        type: 'subscription',
        name: plan.name,
        description: plan.description,
        fiatPrice: plan.price / 100, // 转换为美元
        currency: 'USD',
        tokenAmount: '0',
        priceTTL: 0,
        points: plan.points
      }))
    }
  } catch (error) {
    console.error('Failed to load payment plans:', error)
    // 使用默认数据作为后备
    subscriptionProducts.value = [
      {
        id: 'plan_basic',
        type: 'subscription',
        name: '基础套餐',
        description: '适合偶尔阅读的用户',
        fiatPrice: 9.9,
        currency: 'USD',
        tokenAmount: '0',
        priceTTL: 0,
        points: 1000
      },
      {
        id: 'plan_premium',
        type: 'subscription',
        name: '高级套餐',
        description: '最受欢迎的选择',
        fiatPrice: 19.9,
        currency: 'USD',
        tokenAmount: '0',
        priceTTL: 0,
        points: 2600
      },
      {
        id: 'plan_ultimate',
        type: 'subscription',
        name: '终极套餐',
        description: '最超值选择',
        fiatPrice: 39.9,
        currency: 'USD',
        tokenAmount: '0',
        priceTTL: 0,
        points: 5999
      }
    ]
  }

  // 内容产品保持不变
  contentProducts.value = [
    {
      id: 'chapter-001',
      type: 'chapter',
      name: 'Chapter 1: The Beginning',
      description: 'First chapter of the epic fantasy novel',
      fiatPrice: 2.99,
      currency: 'USD',
      tokenAmount: '0',
      priceTTL: 0
    },
    {
      id: 'coins-100',
      type: 'coins',
      name: '100 Silver Coins',
      description: 'Purchase additional reading coins',
      fiatPrice: 4.99,
      currency: 'USD',
      tokenAmount: '0',
      priceTTL: 0
    }
  ]
}

// Select product and show payment modal
const selectProduct = async (product: PaymentProduct) => {
  selectedProduct.value = product
  selectedCurrency.value = ''
  priceInfo.value = null
  showPaymentModal.value = true
}

// Select currency and get price
const selectCurrency = async (currency: string) => {
  selectedCurrency.value = currency
  
  if (selectedProduct.value) {
    try {
      const result = await paymentService.getTokenPrice(currency, selectedProduct.value.fiatPrice)
      if (result.success && result.priceInfo) {
        priceInfo.value = result.priceInfo
      } else {
        notify.error('Price Error', result.error || 'Failed to get token price')
      }
    } catch (error) {
      console.error('Get price error:', error)
      notify.error('Price Error', 'Failed to get token price')
    }
  }
}

// Proceed to payment
const proceedToPayment = () => {
  if (selectedProduct.value && selectedCurrency.value && priceInfo.value) {
    // Navigate to payment page with order details
    router.push({
      path: '/web3-payment',
      query: {
        productId: selectedProduct.value.id,
        currency: selectedCurrency.value,
        amount: priceInfo.value.tokenAmount,
        fiatAmount: selectedProduct.value.fiatPrice,
        description: selectedProduct.value.name
      }
    })
  }
}

// Close payment modal
const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedProduct.value = null
  selectedCurrency.value = ''
  priceInfo.value = null
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
  await initializeProducts()
  supportedTokens.value = paymentService.getSupportedTokens()
})
</script>
