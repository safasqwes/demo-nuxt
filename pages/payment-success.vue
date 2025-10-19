<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-5 text-center">
      <!-- Success Icon -->
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Success Message -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Payment Successful!
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Your payment has been confirmed and processed successfully.
      </p>

      <!-- Order Details -->
      <div v-if="orderDetails" class="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Order ID:</span>
            <span class="font-mono text-sm">{{ orderDetails.orderId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Amount:</span>
            <span class="font-semibold">{{ orderDetails.tokenAmount }} {{ orderDetails.currency }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Description:</span>
            <span>{{ orderDetails.description }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="text-green-600 font-semibold capitalize">{{ orderDetails.status }}</span>
          </div>
          <div v-if="orderDetails.transactionHash" class="flex justify-between">
            <span class="text-gray-600">Transaction:</span>
            <a :href="`https://polygonscan.com/tx/${orderDetails.transactionHash}`" 
               target="_blank" 
               class="text-blue-600 hover:text-blue-800 font-mono text-sm">
              {{ orderDetails.transactionHash.substring(0, 10) }}...
            </a>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-blue-50 rounded-2xl p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul class="text-left space-y-2 text-gray-700">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Your subscription/content has been activated
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            You can now access all premium features
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            A confirmation email has been sent to your account
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/" 
                  class="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200">
          Continue Reading
        </NuxtLink>
        <NuxtLink to="/payment-products" 
                  class="bg-white text-gray-700 py-3 px-8 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
          Browse More Content
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { PaymentOrder } from '~/types/payment'

// Meta tags for SEO
useHead({
  title: 'Payment Successful - NovelHub',
  meta: [
    { name: 'description', content: 'Your payment has been successfully processed. Continue enjoying premium content on NovelHub.' }
  ]
})

const route = useRoute()
const orderDetails = ref<PaymentOrder | null>(null)

// Get order details from route state or query
onMounted(() => {
  // 这里可以从路由状态或查询参数获取订单详情
  // 在实际应用中，可能需要根据订单ID从后端获取详细信息
  const orderId = route.query.orderId as string
  
  if (orderId) {
    // 模拟订单详情
    orderDetails.value = {
      orderId: orderId,
      recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      currency: 'MATIC',
      fiatAmount: 9.99,
      tokenAmount: '5.234',
      priceTTL: Date.now() / 1000 + 300, // 5分钟后过期
      status: 'paid',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      description: 'Premium Subscription',
      transactionHash: route.query.txHash as string
    }
  }
})
</script>
