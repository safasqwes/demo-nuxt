<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">NovelHub Premium Content</h1>
        <p class="text-xl text-gray-600">Purchase premium content with Web3 payments</p>
      </div>

      <!-- Order Summary -->
      <div v-if="currentOrder" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Order Number:</span>
                <span class="font-semibold text-gray-900">#{{ currentOrder.orderNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Plan:</span>
                <span class="font-semibold text-gray-900">{{ currentOrder.planName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Amount:</span>
                <span class="font-semibold text-gray-900">{{ currentOrder.amount }} {{ currentOrder.currency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Points:</span>
                <span class="font-semibold text-gray-900">{{ currentOrder.points }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  currentOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentOrder.status === 'paid' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ currentOrder.status.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl font-bold text-purple-600 mb-2">{{ currentOrder.amount }}</div>
              <div class="text-lg text-gray-600">{{ currentOrder.currency }}</div>
              <div class="text-sm text-gray-500 mt-1">Total Amount</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Premium Article -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Article</h3>
            <p class="text-gray-600 mb-4">Exclusive research article with detailed analysis</p>
            <div class="text-2xl font-bold text-blue-600 mb-4">0.01 ETH</div>
            <button 
              @click="createOrderAndPay('premium-article', 'Premium Article', 0.01, 'ETH', 100)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>

        <!-- Premium Video -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Video</h3>
            <p class="text-gray-600 mb-4">High-quality educational video content</p>
            <div class="text-2xl font-bold text-purple-600 mb-4">0.0005 MATIC</div>
            <button 
              @click="createOrderAndPay('premium-video', 'Premium Video', 0.05, 'MATIC', 200)"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>

        <!-- Premium Course -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Course</h3>
            <p class="text-gray-600 mb-4">Complete course with certification</p>
            <div class="text-2xl font-bold text-green-600 mb-4">1.0 USDT</div>
            <button 
              @click="createOrderAndPay('premium-course', 'Premium Course', 1.0, 'USDT', 500)"
              class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>

        <!-- Premium E-book -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium E-book</h3>
            <p class="text-gray-600 mb-4">Downloadable e-book content</p>
            <div class="text-2xl font-bold text-orange-600 mb-4">2.5 USDC</div>
            <button 
              @click="createOrderAndPay('premium-ebook', 'Premium E-book', 2.5, 'USDC', 300)"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>

        <!-- Premium Audio -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Audio</h3>
            <p class="text-gray-600 mb-4">High-quality audio content</p>
            <div class="text-2xl font-bold text-red-600 mb-4">5.0 DAI</div>
            <button 
              @click="createOrderAndPay('premium-audio', 'Premium Audio', 5.0, 'DAI', 150)"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>

        <!-- Premium Subscription -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200">
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Subscription</h3>
            <p class="text-gray-600 mb-4">Monthly subscription with all content</p>
            <div class="text-2xl font-bold text-indigo-600 mb-4">10.0 USDT</div>
            <button 
              @click="createOrderAndPay('premium-subscription', 'Premium Subscription', 10.0, 'USDT', 1000)"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create Order & Pay
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Instructions -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">How Order Payment Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Create Order</h3>
            <p class="text-gray-600">Click "Create Order & Pay" to generate an order</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Redirect to Payment</h3>
            <p class="text-gray-600">You'll be redirected to the payment page with order details</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
            <p class="text-gray-600">Connect your Web3 wallet and select payment network</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Complete Payment</h3>
            <p class="text-gray-600">Confirm the transaction to complete your order</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { paymentService } from '~/utils/paymentService'
import type { PaymentOrder } from '~/types/payment'
import Swal from 'sweetalert2'

// Meta tags for SEO
useHead({
  title: 'NovelHub Buy Content - Order Premium Content',
  meta: [
    { name: 'description', content: 'Purchase premium content on NovelHub using Web3 payments. Create orders and pay with ETH, MATIC, USDT, USDC, and DAI.' },
    { name: 'keywords', content: 'premium content, order payment, web3 payment, crypto payment, novelhub, ethereum, polygon' }
  ]
})

const router = useRouter()
const currentOrder = ref<PaymentOrder | null>(null)

// 创建订单并跳转到支付页面
const createOrderAndPay = async (productId: string, productName: string, amount: number, currency: string, points: number) => {
  try {
    // 显示加载提示
    Swal.fire({
      title: 'Creating Order...',
      text: 'Please wait while we create your order',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    // 创建订单
    const result = await paymentService.createOrder({
      planId: 1, // 使用默认计划ID
      description: `Purchase ${productName}`
    })

    if (result.success && result.order) {
      // 关闭加载提示
      Swal.close()
      
      // 保存当前订单信息
      currentOrder.value = result.order
      
      // 构建支付页面URL，携带订单号
      const paymentUrl = `/web3-payment?orderno=${result.order.orderNumber}`
      
      // 跳转到支付页面
      router.push(paymentUrl)
      
      console.log('Order created successfully:', result.order)
    } else {
      // 显示错误提示
      Swal.fire({
        icon: 'error',
        title: 'Order Creation Failed',
        text: result.error || 'Failed to create order. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    
    // 显示错误提示
    Swal.fire({
      icon: 'error',
      title: 'Order Creation Error',
      text: 'An unexpected error occurred. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ef4444'
    })
  }
}
</script>
