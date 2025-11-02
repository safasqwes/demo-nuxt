<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-5">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ $t('payment.header.title') }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {{ $t('payment.header.subtitle') }}
        </p>

      </div>

      <!-- Stripe Payment Form -->
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Stripe Payment</h2>

          <!-- Plan Details -->
          <div v-if="planDetails" class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <h4 class="font-semibold text-purple-900 text-lg">Package Details</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Package Name:</span>
                  <span class="text-sm text-purple-900 font-semibold">{{ planDetails.planName || planDetails.name }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Price:</span>
                  <span class="text-sm text-purple-900 font-semibold">${{ (planDetails.price / 100).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Points:</span>
                  <span class="text-sm text-purple-900 font-semibold">{{ planDetails.pointsAmount?.toLocaleString() || 'N/A' }} points</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stripe Payment Button -->
          <button
            @click="initiateStripePayment"
            :disabled="isProcessing || !planDetails"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isProcessing" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Pay with Stripe</span>
          </button>

          <!-- Stripe Info -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-sm text-blue-800">
                <div class="font-medium">Secure Payment</div>
                <div class="text-blue-600 mt-1">
                  You will be redirected to Stripe's secure checkout page to complete your payment.
                </div>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              {{ $t('payment.security.title') }}
            </h3>
            <ul class="text-sm text-gray-700 space-y-2">
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('payment.security.blockchain') }}
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('payment.security.privateKeys') }}
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ $t('payment.security.smartContracts') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '~/utils/useNotification'
import { paymentService } from '~/utils/paymentService'
import { stripeService } from '~/utils/stripeService'
import Swal from 'sweetalert2'

// Meta tags for SEO
const { t } = useI18n()
useHead({
  title: t('payment.seo.title'),
  meta: [
    { name: 'description', content: t('payment.seo.description') },
    { name: 'keywords', content: t('payment.seo.keywords') }
  ]
})

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

// Reactive data
const planDetails = ref<any>(null) // 套餐详细信息
const isProcessing = ref(false)
const isLoadingPlanDetails = ref(false)

// 处理 URL 参数
const handleUrlParams = () => {
  const planId = route.query.planId as string

  // 如果有 planId，加载套餐详情
  if (planId) {
    loadPlanDetailsById(parseInt(planId))
  } else {
    // 没有 planId，重定向到首页（pricing 页面已隐藏）
    router.push('/')
  }
}

// Stripe 支付处理
const initiateStripePayment = async () => {
  if (!planDetails.value) {
    notify.error('Error', 'Please select a plan first')
    return
  }

  isProcessing.value = true

  try {
    const baseUrl = window.location.origin
    const result = await stripeService.createCheckoutSession({
      planId: planDetails.value.planId,
      successUrl: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/payment?planId=${planDetails.value.planId}&method=stripe`
    })

    if (result.success && result.sessionUrl) {
      // 跳转到 Stripe Checkout
      stripeService.redirectToCheckout(result.sessionUrl)
    } else {
      showPaymentError('Payment Error', result.error || 'Failed to create payment session')
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    showPaymentError('Payment Error', 'An unexpected error occurred')
  } finally {
    isProcessing.value = false
  }
}

// 根据 planId 加载套餐详情
const loadPlanDetailsById = async (planId: number) => {
  isLoadingPlanDetails.value = true
  try {
    console.log('Loading plan details:', planId)

    const result = await paymentService.getPlans()

    if (result.success && result.plans) {
      const plan = result.plans.find((p: any) => p.planId === planId)
      if (plan) {
        planDetails.value = plan
        console.log('Plan details loaded successfully:', plan)
      } else {
        console.warn('Plan not found:', planId)
        notify.error('Error', 'Plan not found')
        router.push('/')
      }
    } else {
      console.error('Failed to load plans:', result.error)
      notify.error('Error', result.error || 'Failed to load plan details')
    }
  } catch (error) {
    console.error('Error loading plan details:', error)
    notify.error('Error', 'Failed to load plan details')
  } finally {
    isLoadingPlanDetails.value = false
  }
}

// 停止所有轮询（如果有的话）
const stopAllPolling = () => {
  // 清理所有定时器的代码（如果有）
}

// SweetAlert2 通知方法
const showPaymentSuccess = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Payment Successful!',
    text: message,
    confirmButtonText: 'Great!',
    confirmButtonColor: '#10b981',
    timer: 5000,
    timerProgressBar: true
  })
}

const showPaymentError = (title: string, message: string) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'Try Again',
    confirmButtonColor: '#ef4444'
  })
}



// Component lifecycle
onMounted(async () => {
  try {
    // 处理 URL 参数
    handleUrlParams()
  } catch (error) {
    console.error('Error initializing payment page:', error)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  console.log('Payment component unmounted')

  // 清理所有轮询和定时器
  stopAllPolling()
})
</script>
