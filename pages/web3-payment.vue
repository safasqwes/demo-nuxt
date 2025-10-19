<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-5">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Web3 Crypto Payment
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Pay with your Web3 wallet using Ethereum, USDT, or other supported cryptocurrencies
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Payment Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
          
          <!-- Wallet Connection Status -->
          <div class="mb-6">
            <div v-if="!isWalletConnected" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span class="text-yellow-800 font-medium">Wallet not connected</span>
              </div>
              <p class="text-yellow-700 text-sm mt-1">Please connect your wallet to proceed with payment</p>
            </div>
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span class="text-green-800 font-medium">Wallet connected</span>
                </div>
                <button 
                  @click="loadBalance"
                  :disabled="isLoadingBalance"
                  class="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                >
                  <span v-if="isLoadingBalance">Loading...</span>
                  <span v-else>Refresh Balance</span>
                </button>
              </div>
              <p class="text-green-700 text-sm mt-1 break-all">{{ walletAddress }}</p>
              <div v-if="walletBalance !== '0'" class="mt-2 text-sm">
                <span class="text-green-600">Balance: {{ walletBalance }} {{ selectedCurrency }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Amount -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
            <div class="relative">
              <input
                v-model="paymentAmount"
                type="number"
                step="0.0001"
                placeholder="0.00"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                :disabled="!isWalletConnected"
                @input="estimateGasFee"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <select v-model="selectedCurrency" class="bg-transparent border-none text-gray-500 focus:outline-none" @change="onCurrencyChange">
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                  <option value="DAI">DAI</option>
                </select>
              </div>
            </div>
            <!-- Gas Fee Estimate -->
            <div v-if="gasEstimate !== '0' && paymentAmount" class="mt-2 text-sm text-gray-600">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Estimated Gas Fee: ~{{ gasEstimate }} ETH
              </span>
            </div>
          </div>

          <!-- Payment Description -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              v-model="paymentDescription"
              type="text"
              placeholder="Payment for NovelHub Premium Subscription"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :disabled="!isWalletConnected"
            />
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              v-if="!isWalletConnected"
              @click="connectWallet"
              :disabled="isConnecting"
              class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isConnecting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
              <span v-else>Connect Wallet</span>
            </button>
            
            <button
              v-if="isWalletConnected && !isProcessing"
              @click="initiatePayment"
              :disabled="!paymentAmount || parseFloat(paymentAmount) <= 0"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay {{ paymentAmount }} {{ selectedCurrency }}
            </button>
            
            <button
              v-if="isProcessing"
              disabled
              class="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
            >
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            </button>
          </div>
        </div>

        <!-- Payment Info & History -->
        <div class="space-y-6">
          <!-- Supported Currencies -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Supported Currencies</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="currency in supportedCurrencies" :key="currency.symbol" 
                   class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {{ currency.symbol.charAt(0) }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ currency.symbol }}</div>
                  <div class="text-sm text-gray-500">{{ currency.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Recent Payments</h3>
            <div v-if="paymentHistory.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>No payment history yet</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="payment in paymentHistory" :key="payment.id" 
                   class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{{ payment.amount }} {{ payment.currency }}</div>
                    <div class="text-sm text-gray-500">{{ payment.description }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-green-600 font-medium">Completed</div>
                  <div class="text-xs text-gray-500">{{ formatDate(payment.timestamp) }}</div>
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
              Security & Privacy
            </h3>
            <ul class="text-sm text-gray-700 space-y-2">
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                All transactions are secured by blockchain technology
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                We never store your private keys or seed phrases
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Smart contracts ensure secure and transparent payments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '~/utils/useNotification'
import { web3PaymentService, type PaymentRequest } from '~/utils/web3Payment'
import { paymentService } from '~/utils/paymentService'
import type { PaymentOrder } from '~/types/payment'

// Meta tags for SEO
useHead({
  title: 'Web3 Crypto Payment - NovelHub',
  meta: [
    { name: 'description', content: 'Pay with your Web3 wallet using Ethereum, USDT, USDC, and other supported cryptocurrencies for NovelHub services.' },
    { name: 'keywords', content: 'web3 payment, crypto payment, ethereum, usdt, blockchain payment, novelhub' }
  ]
})

const route = useRoute()
const router = useRouter()
const { notify } = useNotification()

// Reactive data
const currentOrder = ref<PaymentOrder | null>(null)
const isOrderMode = ref(false)
const isWalletConnected = ref(false)
const isConnecting = ref(false)
const isProcessing = ref(false)
const walletAddress = ref('')
const paymentAmount = ref('')
const paymentDescription = ref('Payment for NovelHub Premium Subscription')
const selectedCurrency = ref('MATIC')
const walletBalance = ref('0')
const gasEstimate = ref('0')
const isLoadingBalance = ref(false)

// Supported currencies
const supportedCurrencies = ref([
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'USDT', name: 'Tether USD' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'DAI', name: 'Dai Stablecoin' }
])

// Payment history
const paymentHistory = ref([
  {
    id: 1,
    amount: '0.1',
    currency: 'ETH',
    description: 'Premium Subscription',
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: 2,
    amount: '50',
    currency: 'USDT',
    description: 'Silver Coins Package',
    timestamp: new Date(Date.now() - 172800000) // 2 days ago
  }
])

// Web3 connection
const connectWallet = async () => {
  isConnecting.value = true
  
  try {
    const result = await web3PaymentService.connectWallet()
    
    if (result.success && result.address) {
      walletAddress.value = result.address
      isWalletConnected.value = true
      notify.success('Wallet Connected', `Connected to ${result.address.substring(0, 6)}...${result.address.substring(38)}`)
    } else {
      notify.error('Connection Failed', result.error || 'Failed to connect wallet. Please try again.')
    }
  } catch (error) {
    console.error('Wallet connection error:', error)
    notify.error('Connection Failed', 'Failed to connect wallet. Please try again.')
  } finally {
    isConnecting.value = false
  }
}

// Payment processing
const initiatePayment = async () => {
  if (!isWalletConnected.value || !paymentAmount.value) return

  isProcessing.value = true

  try {
    let paymentRequest: PaymentRequest

    if (isOrderMode.value && currentOrder.value) {
      // 订单模式支付
      paymentRequest = {
        amount: currentOrder.value.tokenAmount,
        currency: currentOrder.value.currency,
        recipientAddress: currentOrder.value.recipientAddress,
        description: currentOrder.value.description,
        orderId: currentOrder.value.orderId
      }
    } else {
      // 自由支付模式
      paymentRequest = {
        amount: paymentAmount.value,
        currency: selectedCurrency.value,
        recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // 示例收款地址
        description: paymentDescription.value
      }
    }

    // 处理支付
    const result = await web3PaymentService.processPayment(paymentRequest)

    if (result.success && result.transactionHash) {
      if (isOrderMode.value && currentOrder.value) {
        // 验证订单支付
        await verifyOrderPayment(result.transactionHash)
      } else {
        // 添加支付历史
        const newPayment = {
          id: Date.now(),
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          description: paymentRequest.description,
          timestamp: new Date(),
          transactionHash: result.transactionHash
        }
        paymentHistory.value.unshift(newPayment)

        notify.success('Payment Successful', `Successfully paid ${paymentRequest.amount} ${paymentRequest.currency}`)
        
        // 重置表单
        paymentAmount.value = ''
        paymentDescription.value = 'Payment for NovelHub Premium Subscription'
      }
    } else {
      notify.error('Payment Failed', result.error || 'Payment could not be processed. Please try again.')
    }
  } catch (error) {
    console.error('Payment error:', error)
    notify.error('Payment Failed', 'Payment could not be processed. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// 验证订单支付
const verifyOrderPayment = async (txHash: string) => {
  if (!currentOrder.value) return

  try {
    const result = await paymentService.verifyPayment({
      orderId: currentOrder.value.orderId,
      txHash: txHash,
      fromAddress: walletAddress.value
    })

    if (result.success) {
      if (result.confirmed) {
        notify.success('Order Paid Successfully', 'Your order has been confirmed and processed!')
        // 跳转到成功页面或返回产品页面
        router.push('/payment-success')
      } else {
        notify.info('Payment Pending', `Transaction submitted. Waiting for ${result.requiredConfirmations - result.confirmations} more confirmations.`)
        // 可以设置定时器检查状态
        setTimeout(() => checkOrderStatus(), 30000) // 30秒后检查
      }
    } else {
      notify.error('Payment Verification Failed', result.error || 'Failed to verify payment')
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    notify.error('Verification Error', 'Failed to verify payment. Please contact support.')
  }
}

// 检查订单状态
const checkOrderStatus = async () => {
  if (!currentOrder.value) return

  try {
    const result = await paymentService.getOrderStatus(currentOrder.value.orderId)
    if (result.success && result.order) {
      currentOrder.value = result.order
      if (result.order.status === 1) { // 1 = 已支付
        notify.success('Order Confirmed', 'Your order has been confirmed!')
        router.push('/payment-success')
      }
    }
  } catch (error) {
    console.error('Check order status error:', error)
  }
}

// Utility functions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Load wallet balance
const loadBalance = async () => {
  if (!isWalletConnected.value || !walletAddress.value) return

  isLoadingBalance.value = true
  try {
    const result = await web3PaymentService.getTokenBalance(selectedCurrency.value, walletAddress.value)
    if (result.balance) {
      walletBalance.value = parseFloat(result.balance).toFixed(4)
    }
  } catch (error) {
    console.error('Balance load error:', error)
  } finally {
    isLoadingBalance.value = false
  }
}

// Estimate gas fee
const estimateGasFee = async () => {
  if (!isWalletConnected.value || !paymentAmount.value || parseFloat(paymentAmount.value) <= 0) {
    gasEstimate.value = '0'
    return
  }

  try {
    const result = await web3PaymentService.estimateGasFee(
      selectedCurrency.value,
      paymentAmount.value,
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' // 示例收款地址
    )
    if (result.gasFee) {
      gasEstimate.value = parseFloat(result.gasFee).toFixed(6)
    }
  } catch (error) {
    console.error('Gas estimation error:', error)
  }
}

// Handle currency change
const onCurrencyChange = async () => {
  gasEstimate.value = '0'
  if (isWalletConnected.value) {
    await loadBalance()
  }
}

// Initialize order from URL parameters
const initializeOrder = async () => {
  const { productId, currency, amount, fiatAmount, description } = route.query

  if (productId && currency && amount) {
    isOrderMode.value = true
    
    // 创建订单
    try {
      const result = await paymentService.createOrder({
        currency: currency as string,
        fiatAmount: parseFloat(fiatAmount as string),
        description: description as string,
        productType: 'points', // 积分购买
        productId: productId as string
      })

      if (result.success && result.order) {
        currentOrder.value = result.order
        selectedCurrency.value = result.order.currency
        paymentAmount.value = result.order.tokenAmount
        paymentDescription.value = result.order.description
      } else {
        notify.error('Order Creation Failed', result.error || 'Failed to create order')
        router.push('/payment-products')
      }
    } catch (error) {
      console.error('Create order error:', error)
      notify.error('Order Error', 'Failed to create order')
      router.push('/payment-products')
    }
  }
}

// Check if wallet is already connected
onMounted(async () => {
  try {
    // 初始化订单
    await initializeOrder()

    const result = await web3PaymentService.checkConnection()
    if (result.connected && result.address) {
      walletAddress.value = result.address
      isWalletConnected.value = true
      await loadBalance()
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error)
  }
})
</script>
