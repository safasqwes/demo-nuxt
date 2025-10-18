<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Thank you for your purchase. Your points have been added to your account.
        </p>
      </div>

      <div v-if="order" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
        <dl class="space-y-2">
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">Order Number:</dt>
            <dd class="text-sm text-gray-900">{{ order.orderNumber }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">Plan:</dt>
            <dd class="text-sm text-gray-900">{{ order.planName }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">Amount:</dt>
            <dd class="text-sm text-gray-900">${{ (order.amount / 100).toFixed(2) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">Points Added:</dt>
            <dd class="text-sm text-gray-900">{{ order.points || 'N/A' }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-gray-500">Status:</dt>
            <dd class="text-sm text-green-600 font-medium">Paid</dd>
          </div>
        </dl>
      </div>

      <div v-if="loading" class="text-center">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading order details...
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error loading order details
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-3">
        <NuxtLink
          to="/payment/points"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View My Points
        </NuxtLink>
        <NuxtLink
          to="/"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue Reading
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Order {
  id: number
  orderNumber: string
  planName: string
  amount: number
  currency: string
  points?: number
  status: number
  createdAt: string
}

const loading = ref(true)
const error = ref('')
const order = ref<Order | null>(null)

// SEO
useHead({
  title: 'Payment Successful - NovelHub',
  meta: [
    { name: 'description', content: 'Your payment was successful. Thank you for your purchase!' }
  ]
})

// Get order details from URL parameters
const getOrderDetails = async () => {
  try {
    const route = useRoute()
    const sessionId = route.query.session_id as string
    
    if (!sessionId) {
      throw new Error('No session ID provided')
    }

    const response = await $fetch(`/api/payment/success?session_id=${sessionId}`)
    
    if (response.success) {
      order.value = response.data
    } else {
      throw new Error(response.message || 'Failed to load order details')
    }
  } catch (err: any) {
    console.error('Failed to load order details:', err)
    error.value = err.message || 'Failed to load order details'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOrderDetails()
})
</script>
