<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-5">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Web3 Crypto Payment
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Pay with your Web3 wallet using Ethereum, USDT, or other supported cryptocurrencies
        </p>
        
        <!-- Network Selection -->
        <div v-if="isWalletConnected" class="max-w-md mx-auto">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="text-sm font-medium text-gray-700 mb-3">Select Test Network</div>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="switchToSepolia"
                :class="[
                  'p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium',
                  currentNetwork?.chainId === SUPPORTED_NETWORKS.SEPOLIA
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                ]"
              >
                <div class="flex items-center justify-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Sepolia</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">ETH, USDT, USDC, DAI</div>
              </button>
              
              <button 
                @click="switchToPolygonAmoy"
                :class="[
                  'p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium',
                  currentNetwork?.chainId === SUPPORTED_NETWORKS.POLYGON_AMOY
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-700'
                ]"
              >
                <div class="flex items-center justify-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Polygon Amoy</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">MATIC, USDT, USDC, DAI</div>
              </button>
            </div>
          </div>
        </div>
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
              
              <!-- 网络状态 -->
              <div class="mt-2 text-sm">
                <div v-if="currentNetwork" class="flex items-center justify-between">
                  <span class="text-gray-600">
                    Network: {{ currentNetwork.name }} ({{ currentNetwork.chainId }})
                  </span>
                  <div v-if="!Object.values(SUPPORTED_NETWORKS).includes(currentNetwork.chainId)" class="flex gap-2">
                    <button 
                      @click="switchToSepolia"
                      class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded"
                    >
                      Switch to Sepolia
                    </button>
                    <button 
                      @click="switchToPolygonAmoy"
                      class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded"
                    >
                      Switch to Amoy
                    </button>
                  </div>
                </div>
                <div v-if="Object.values(SUPPORTED_NETWORKS).includes(currentNetwork?.chainId || 0)" class="text-green-600 text-xs">
                  ✓ Connected to {{ currentNetwork?.name }}
                </div>
                
                <!-- 网络切换选择器 -->
                <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div class="text-xs font-medium text-gray-700 mb-2">Switch Network:</div>
                  <div class="flex gap-2">
                    <button 
                      @click="switchToSepolia"
                      :disabled="isPaymentInProgress"
                      :class="[
                        'flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors',
                        isPaymentInProgress 
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : currentNetwork?.chainId === SUPPORTED_NETWORKS.SEPOLIA
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50'
                      ]"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Sepolia
                      </div>
                    </button>
                    <button 
                      @click="switchToPolygonAmoy"
                      :disabled="isPaymentInProgress"
                      :class="[
                        'flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors',
                        isPaymentInProgress 
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : currentNetwork?.chainId === SUPPORTED_NETWORKS.POLYGON_AMOY
                            ? 'bg-green-100 border-green-300 text-green-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'
                      ]"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        Polygon Amoy
                      </div>
                    </button>
                  </div>
                  
                  <!-- 当前网络支持的代币 -->
                  <div v-if="Object.values(SUPPORTED_NETWORKS).includes(currentNetwork?.chainId || 0)" class="mt-3">
                    <div class="text-xs font-medium text-gray-700 mb-2">Supported Tokens:</div>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="token in supportedCurrencies" :key="token.symbol" 
                            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {{ token.symbol }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="walletBalance !== '0'" class="mt-2 text-sm">
                <span class="text-green-600">Balance: {{ walletBalance }} {{ selectedCurrency }}</span>
              </div>
              
              <!-- 测试网络水龙头提示 -->
              <div v-if="Object.values(SUPPORTED_NETWORKS).includes(currentNetwork?.chainId || 0) && walletBalance === '0'" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <div class="text-blue-800 font-medium mb-1">Need test tokens?</div>
                <div class="text-blue-700">
                  <div v-if="currentNetwork?.chainId === SUPPORTED_NETWORKS.SEPOLIA">
                    Get free ETH from: 
                    <a href="https://sepoliafaucet.com/" target="_blank" class="underline hover:text-blue-900">Sepolia Faucet</a>
                  </div>
                  <div v-else-if="currentNetwork?.chainId === SUPPORTED_NETWORKS.POLYGON_AMOY">
                    Get free MATIC from: 
                    <a href="https://faucet.polygon.technology/" target="_blank" class="underline hover:text-blue-900">Polygon Faucet</a>
                  </div>
                </div>
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
                :class="[
                  'w-full px-4 py-3 border rounded-lg text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                  isAmountLocked 
                    ? 'border-blue-300 bg-blue-50 text-blue-700 cursor-not-allowed' 
                    : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                ]"
                :disabled="!isWalletConnected || isAmountLocked"
                @input="estimateGasFee"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <select 
                  v-model="selectedCurrency" 
                  :class="[
                    'bg-transparent border-none focus:outline-none',
                    isAmountLocked ? 'text-blue-600 cursor-not-allowed' : 'text-gray-500'
                  ]"
                  :disabled="isAmountLocked"
                  @change="onCurrencyChange"
                >
                  <option v-for="token in supportedCurrencies" :key="token.symbol" :value="token.symbol">
                    {{ token.symbol }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- 外部支付提示 -->
            <div v-if="isExternalPayment" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-sm text-blue-800">
                  <div class="font-medium">
                    {{ currentOrder ? 'Order Payment' : 'External Payment' }}
                  </div>
                  <div class="text-blue-600">
                    {{ currentOrder 
                      ? `Order #${currentOrder.orderNumber} - Amount and currency are locked` 
                      : 'Amount and currency are locked from external source' 
                    }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Gas Fee Estimate -->
            <div v-if="gasEstimate !== '0' && paymentAmount" class="mt-2 text-sm text-gray-600">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Estimated Gas Fee: ~{{ gasEstimate }} {{ currentNetwork?.chainId === SUPPORTED_NETWORKS.SEPOLIA ? 'ETH' : 'MATIC' }}
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
              :class="[
                'w-full px-4 py-3 border rounded-lg',
                isAmountLocked 
                  ? 'border-blue-300 bg-blue-50 text-blue-700 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
              ]"
              :disabled="!isWalletConnected || isAmountLocked"
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
              v-if="isWalletConnected && !isProcessing && !isPaymentInProgress"
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
            
            <button
              v-if="isPaymentInProgress && !isProcessing"
              disabled
              class="w-full bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
            >
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Payment in Progress...
              </span>
            </button>
            
            <!-- 支付状态提示 -->
            <div v-if="isPaymentInProgress" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-center gap-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div class="text-sm font-medium text-blue-800">Payment in progress... Please wait for confirmation</div>
              </div>
              <div v-if="currentTransaction" class="mt-2 text-xs text-blue-600 text-center">
                Transaction: {{ currentTransaction.hash.substring(0, 10) }}...{{ currentTransaction.hash.substring(58) }}
              </div>
            </div>
            
            <!-- 交易状态显示 -->
            <div v-if="isWatchingTransaction && currentTransaction && !isPaymentInProgress" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <div class="text-sm font-medium text-green-800">Transaction Confirmed</div>
                    <div class="text-xs text-green-600">
                      {{ currentTransaction.hash.substring(0, 10) }}...{{ currentTransaction.hash.substring(58) }}
                    </div>
                  </div>
                </div>
                <div class="text-xs text-green-600">
                  {{ currentTransaction.confirmations }} confirmations
                </div>
              </div>
              <div class="mt-2 text-xs text-green-700">
                Payment completed successfully!
              </div>
            </div>
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
import { web3PaymentService, type PaymentRequest, type TransactionStatus } from '~/utils/web3Payment'
import { paymentService } from '~/utils/paymentService'
import type { PaymentOrder } from '~/types/payment'
import Swal from 'sweetalert2'

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

// 硬编码的收款地址，确保一致性 (使用正确的校验和格式)
const HARDCODED_RECIPIENT_ADDRESS = '0xFBE3a95Caf0d8c9f862Ce16D8eCEf9f1F667aF17'

// 网络配置
const SUPPORTED_NETWORKS = {
  SEPOLIA: 11155111,
  POLYGON_AMOY: 80002
}
const currentNetwork = ref<{ chainId: number; name: string } | null>(null)

// Reactive data
const currentOrder = ref<PaymentOrder | null>(null)
const isOrderMode = ref(false)
const isWalletConnected = ref(false)
const isConnecting = ref(false)
const isProcessing = ref(false)
const walletAddress = ref('')
const paymentAmount = ref('')
const paymentDescription = ref('Payment for NovelHub Premium Subscription')
const selectedCurrency = ref('ETH')
const walletBalance = ref('0')
const gasEstimate = ref('0')
const isLoadingBalance = ref(false)

// 交易状态相关
const currentTransaction = ref<{
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
} | null>(null)
const isWatchingTransaction = ref(false)

// 支付状态管理
const isPaymentInProgress = ref(false)
const paymentStartTime = ref<number | null>(null)

// 外部参数控制
const isExternalPayment = ref(false)
const isAmountLocked = ref(false)

// Supported currencies (动态根据网络变化)
const supportedCurrencies = ref<Array<{ symbol: string; name: string }>>([])

// Payment history
const paymentHistory = ref<Array<{
  id: number
  amount: string
  currency: string
  description: string
  timestamp: Date
  transactionHash?: string
}>>([])

// Web3 connection
const connectWallet = async () => {
  isConnecting.value = true
  
  try {
    const result = await web3PaymentService.connectWallet()
    
    if (result.success && result.address) {
      walletAddress.value = result.address
      isWalletConnected.value = true
      
      // 检查网络
      await checkNetwork()
      
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

// 处理 URL 参数
const handleUrlParams = () => {
  const amount = route.query.amount as string
  const currency = route.query.currency as string
  const orderNo = route.query.orderno as string
  
  if (orderNo) {
    // 从订单页面跳转，根据订单号查询订单信息
    isExternalPayment.value = true
    isAmountLocked.value = true
    loadOrderByOrderNo(orderNo)
    console.log('Order payment parameters:', { orderNo })
  } else if (amount && currency) {
    // 从外部页面跳转，设置支付参数
    isExternalPayment.value = true
    isAmountLocked.value = true
    
    // 设置支付数量和币种
    paymentAmount.value = amount
    selectedCurrency.value = currency.toUpperCase()
    
    // 设置支付描述
    paymentDescription.value = `Payment for NovelHub Service - ${amount} ${currency.toUpperCase()}`
    
    console.log('External payment parameters:', { amount, currency })
  }
}

// 根据订单号加载订单信息
const loadOrderByOrderNo = async (orderNo: string) => {
  try {
    console.log('Loading order by order number:', orderNo)
    
    // 调用后端API查询订单信息
    const result = await paymentService.getOrderByOrderNo(orderNo)
    
    if (result.success && result.order) {
      console.log('Order loaded successfully:', result.order)
      
      // 设置订单信息
      currentOrder.value = result.order
      isOrderMode.value = true
      
      // 设置支付参数（锁定状态）
      paymentAmount.value = result.order.amount.toString()
      selectedCurrency.value = result.order.currency.toUpperCase()
      paymentDescription.value = `Payment for ${result.order.planName} - Order #${result.order.orderNumber}`
      
      console.log('Order payment details set:', {
        amount: paymentAmount.value,
        currency: selectedCurrency.value,
        description: paymentDescription.value
      })
    } else {
      console.error('Failed to load order:', result.error)
      showPaymentError('Order Not Found', result.error || 'Order not found or invalid order number')
    }
  } catch (error) {
    console.error('Error loading order:', error)
    showPaymentError('Order Load Error', 'Failed to load order information. Please try again.')
  }
}

// 更新支持的代币列表
const updateSupportedCurrencies = () => {
  const tokens = web3PaymentService.getSupportedTokens()
  supportedCurrencies.value = tokens
  
  // 如果当前选择的代币不在新网络中支持，切换到第一个可用的代币
  if (tokens.length > 0 && !tokens.find(token => token.symbol === selectedCurrency.value)) {
    selectedCurrency.value = tokens[0]?.symbol || 'ETH'
  }
}

// 检查网络
const checkNetwork = async () => {
  try {
    const networkInfo = await web3PaymentService.getNetworkInfo()
    currentNetwork.value = networkInfo
    
    const isSupportedNetwork = Object.values(SUPPORTED_NETWORKS).includes(networkInfo?.chainId || 0)
    if (!isSupportedNetwork) {
      notify.warning('Unsupported Network', 'Please switch to a supported testnet (Sepolia or Polygon Amoy)')
    } else {
      // 更新支持的代币列表
      updateSupportedCurrencies()
    }
  } catch (error) {
    console.error('Network check error:', error)
  }
}

// 切换到指定网络
const switchToNetwork = async (networkKey: 'SEPOLIA' | 'POLYGON_AMOY') => {
  // 检查是否正在支付中
  if (isPaymentInProgress.value) {
    showPaymentWarning('Payment in Progress', 'Cannot switch network while payment is in progress. Please wait for the current payment to complete.')
    return
  }

  try {
    let result
    if (networkKey === 'SEPOLIA') {
      result = await web3PaymentService.switchToSepolia()
    } else {
      result = await web3PaymentService.switchToPolygonAmoy()
    }
    
    if (result.success) {
      const networkName = networkKey === 'SEPOLIA' ? 'Ethereum Sepolia' : 'Polygon Amoy'
      showPaymentInfo('Network Switched', `Successfully switched to ${networkName} Testnet`)
      await checkNetwork()
      await loadBalance() // 重新加载余额
    } else {
      showPaymentError('Network Switch Failed', result.error || 'Failed to switch network')
    }
  } catch (error) {
    console.error('Network switch error:', error)
    showPaymentError('Network Switch Failed', 'Failed to switch network')
  }
}

// 切换到Ethereum Sepolia测试网络
const switchToSepolia = async () => {
  await switchToNetwork('SEPOLIA')
}

// 切换到Polygon Amoy测试网络
const switchToPolygonAmoy = async () => {
  await switchToNetwork('POLYGON_AMOY')
}

// SweetAlert2 通知方法
const showPaymentSuccess = (message: string, txHash?: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Payment Successful!',
    text: message,
    html: txHash ? `
      <div class="text-left">
        <p>${message}</p>
        <div class="mt-3 p-2 bg-gray-100 rounded text-sm">
          <strong>Transaction Hash:</strong><br>
          <code class="text-xs break-all">${txHash}</code>
        </div>
      </div>
    ` : message,
    confirmButtonText: 'Great!',
    confirmButtonColor: '#10b981',
    timer: 50000,
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

const showPaymentInfo = (title: string, message: string) => {
  Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3b82f6',
    timer: 30000,
    timerProgressBar: true
  })
}

const showPaymentWarning = (title: string, message: string) => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#f59e0b'
  })
}

// 监听交易状态
const watchTransactionStatus = async (txHash: string) => {
  isWatchingTransaction.value = true
  currentTransaction.value = {
    hash: txHash,
    status: 'pending',
    confirmations: 0
  }

  // 显示交易已提交的提示
  showPaymentInfo('Transaction Submitted', `Your transaction has been submitted to the blockchain. Waiting for confirmation...`)

  try {
    await web3PaymentService.watchTransaction(txHash, (status: TransactionStatus) => {
      currentTransaction.value = {
        hash: status.hash,
        status: status.status,
        confirmations: status.confirmations
      }

      if (status.status === 'confirmed') {
        // 交易确认成功
        showPaymentSuccess(
          `Payment confirmed with ${status.confirmations} confirmations!`,
          status.hash
        )
        
        // 重置表单
        paymentAmount.value = ''
        paymentDescription.value = 'Payment for NovelHub Premium Subscription'
        
        // 刷新余额
        loadBalance()
        
        // 结束支付状态
        isPaymentInProgress.value = false
        paymentStartTime.value = null
        
        // 如果是订单模式，跳转到成功页面
        if (isOrderMode.value && currentOrder.value) {
          setTimeout(() => {
            router.push('/payment-success')
          }, 3000)
        }
      } else if (status.status === 'failed') {
        // 交易失败
        showPaymentError('Transaction Failed', 'Your transaction has failed. Please try again.')
        
        // 结束支付状态
        isPaymentInProgress.value = false
        paymentStartTime.value = null
      }
    })
  } catch (error) {
    console.error('Transaction watch error:', error)
    showPaymentError('Transaction Watch Error', 'Failed to monitor transaction status.')
    
    // 结束支付状态
    isPaymentInProgress.value = false
    paymentStartTime.value = null
  } finally {
    isWatchingTransaction.value = false
    currentTransaction.value = null
  }
}

// Payment processing
const initiatePayment = async () => {
  if (!isWalletConnected.value || !paymentAmount.value) return

  // 检查是否正在支付中
  if (isPaymentInProgress.value) {
    showPaymentWarning('Payment in Progress', 'Please wait for the current payment to complete before starting a new one.')
    return
  }

  console.log('Initiating payment...', {
    isWalletConnected: isWalletConnected.value,
    paymentAmount: paymentAmount.value,
    currentOrder: currentOrder.value,
    isOrderMode: isOrderMode.value
  })

  // 开始支付状态
  isPaymentInProgress.value = true
  paymentStartTime.value = Date.now()
  isProcessing.value = true

  try {
    // 在支付前检查余额
    const balanceCheck = await web3PaymentService.checkBalance(selectedCurrency.value, paymentAmount.value)
    if (!balanceCheck.sufficient) {
      showPaymentError('Insufficient Balance', 
        `You have ${balanceCheck.balance} ${selectedCurrency.value}, but need ${paymentAmount.value} ${selectedCurrency.value} plus gas fees. Please add more funds to your wallet.`)
      
      // 结束支付状态
      isPaymentInProgress.value = false
      paymentStartTime.value = null
      isProcessing.value = false
      return
    }
    let paymentRequest: PaymentRequest

    if (isOrderMode.value && currentOrder.value) {
      // 订单模式支付
      paymentRequest = {
        amount: currentOrder.value.amount.toString(),
        currency: currentOrder.value.currency,
        recipientAddress: HARDCODED_RECIPIENT_ADDRESS, // 使用硬编码收款地址
        description: currentOrder.value.planName,
        orderId: currentOrder.value.orderId
      }
      console.log('Order mode payment request:', paymentRequest)
    } else {
      // 自由支付模式
      paymentRequest = {
        amount: paymentAmount.value,
        currency: selectedCurrency.value,
        recipientAddress: HARDCODED_RECIPIENT_ADDRESS, // 使用硬编码收款地址
        description: paymentDescription.value
      }
    }

    // 处理支付
    const result = await web3PaymentService.processPayment(paymentRequest)

    if (result.success && result.transactionHash) {
      // 开始监听交易状态
      await watchTransactionStatus(result.transactionHash)
      
      if (isOrderMode.value && currentOrder.value) {
        // 验证订单支付
        await verifyOrderPayment(result.transactionHash)
      } else {
        // 添加支付历史
        const newPayment = {
          id: Date.now(),
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          description: paymentRequest.description || 'Web3 Payment',
          timestamp: new Date(),
          transactionHash: result.transactionHash
        }
        paymentHistory.value.unshift(newPayment)
      }
    } else {
      // 根据错误类型显示不同的提示
      if (result.error && result.error.includes('Insufficient')) {
        showPaymentError('Insufficient Funds', result.error)
      } else if (result.error && result.error.includes('rejected')) {
        showPaymentWarning('Transaction Rejected', 'You cancelled the transaction.')
      } else if (result.error && result.error.includes('gas')) {
        showPaymentError('Gas Estimation Failed', result.error)
      } else {
        showPaymentError('Payment Failed', result.error || 'Payment could not be processed. Please try again.')
      }
      
      // 结束支付状态
      isPaymentInProgress.value = false
      paymentStartTime.value = null
    }
  } catch (error) {
    console.error('Payment error:', error)
    showPaymentError('Payment Failed', 'An unexpected error occurred. Please try again.')
    
    // 结束支付状态
    isPaymentInProgress.value = false
    paymentStartTime.value = null
  } finally {
    isProcessing.value = false
  }
}

// 验证订单支付
const verifyOrderPayment = async (txHash: string) => {
  if (!currentOrder.value) return

  try {
    const result = await paymentService.verifyPayment({
      paymentId: currentOrder.value.payments?.[0]?.paymentId || 0, // 从支付记录中获取 paymentId
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
      HARDCODED_RECIPIENT_ADDRESS // 使用正确的收款地址
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
  // 如果是外部支付模式，阻止币种变更
  if (isAmountLocked.value) {
    showPaymentWarning('Currency Locked', 'Currency cannot be changed in external payment mode')
    return
  }
  
  gasEstimate.value = '0'
  if (isWalletConnected.value) {
    await loadBalance()
  }
}

// Initialize order from URL parameters
const initializeOrder = async () => {
  const { productId, currency, amount, fiatAmount, description } = route.query

  // 如果是外部支付模式，跳过订单初始化
  if (isExternalPayment.value) {
    return
  }

  if (productId && currency && amount) {
    isOrderMode.value = true
    
    // 创建订单
    try {
      const result = await paymentService.createOrder({
        planId: parseInt(productId as string),
        description: description as string
      })

      if (result.success && result.order) {
        console.log('Order created successfully:', result.order)
        console.log('Order created successfully:', result.order)
        console.log('Order ID:', result.order.orderId)
        console.log('Order Number:', result.order.orderNumber)
        // 直接使用后端返回的订单数据
        currentOrder.value = {
          orderId: result.order.orderId,
          orderNumber: result.order.orderNumber,
          userId: result.order.userId,
          planId: result.order.planId,
          planName: result.order.planName,
          amount: result.order.amount,
          currency: result.order.currency,
          points: result.order.points,
          status: result.order.status,
          orderType: result.order.orderType,
          createdAt: result.order.createdAt,
          updatedAt: result.order.updatedAt,
          payments: result.order.payments || []
        }
        
        console.log('Order created with ID:', currentOrder.value.orderId)
        console.log('Order Number:', currentOrder.value.orderNumber)
        
        selectedCurrency.value = result.order.currency
        paymentAmount.value = result.order.amount.toString() // 使用 amount 字段
        paymentDescription.value = result.order.planName || 'Web3 Payment'
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
    // 处理 URL 参数
    handleUrlParams()

    // 初始化订单
    await initializeOrder()

    const result = await web3PaymentService.checkConnection()
    if (result.connected && result.address) {
      walletAddress.value = result.address
      isWalletConnected.value = true
      
      // 检查网络状态
      await checkNetwork()
      
      // 加载余额
      await loadBalance()
    } else {
      // 即使钱包未连接，也要初始化支持的代币列表（默认显示 Sepolia 的代币）
      updateSupportedCurrencies()
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error)
  }
})
</script>
