<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
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
        <div v-for="product in contentProducts" :key="product.id" 
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
        </div>
      </div>

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
import { useNotification } from '~/composables/useNotification'
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

// Sample products (in real app, this would come from API)
const initializeProducts = () => {
  subscriptionProducts.value = [
    {
      id: 'sub-monthly',
      type: 'subscription',
      name: 'Monthly Premium',
      description: 'Access to all premium content and features',
      fiatPrice: 9.99,
      currency: 'USD',
      tokenAmount: '0',
      priceTTL: 0
    },
    {
      id: 'sub-yearly',
      type: 'subscription',
      name: 'Yearly Premium',
      description: 'Best value - 12 months of premium access',
      fiatPrice: 99.99,
      currency: 'USD',
      tokenAmount: '0',
      priceTTL: 0
    }
  ]

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
onMounted(() => {
  initializeProducts()
  supportedTokens.value = paymentService.getSupportedTokens()
})
</script>
