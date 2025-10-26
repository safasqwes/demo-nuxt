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
          
          <!-- Payment Information -->
          <div v-if="paymentInfo" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">Payment Information</h4>
            <div class="text-sm text-blue-800 space-y-1">
              <p><span class="font-medium">Order Number:</span> {{ paymentInfo.orderNumber }}</p>
              <p><span class="font-medium">Plan:</span> {{ paymentInfo.planName }}</p>
              <p><span class="font-medium">Amount:</span> ${{ paymentInfo.fiatAmount.toFixed(2) }} {{ paymentInfo.currency }}</p>
              <p><span class="font-medium">Crypto Amount:</span> {{ paymentInfo.tokenAmount }} {{ paymentInfo.tokenCurrency }}</p>
              <p><span class="font-medium">Recipient Address:</span> 
                <span class="font-mono text-xs">{{ paymentInfo.recipientAddress }}</span>
              </p>
              <p><span class="font-medium">Chain ID:</span> {{ paymentInfo.chainId }}</p>
            </div>
          </div>
          
          <!-- Plan Details -->
          <div v-if="planDetails" class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <h4 class="font-semibold text-purple-900 text-lg">Package Details</h4>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 套餐基本信息 -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Package Name:</span>
                  <span class="text-sm text-purple-900 font-semibold">{{ planDetails.planName }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Package Type:</span>
                  <span class="text-sm text-purple-900">{{ planDetails.planType === 1 ? 'Subscription' : 'One-time' }}</span>
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
              
              <!-- 套餐特色功能 -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Duration:</span>
                  <span class="text-sm text-purple-900">{{ planDetails.duration || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Status:</span>
                  <span class="text-sm text-purple-900">{{ planDetails.status === 1 ? 'Active' : 'Inactive' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-purple-700">Created:</span>
                  <span class="text-sm text-purple-900">{{ formatDate(new Date(planDetails.createdAt)) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 套餐描述 -->
            <div v-if="planDetails.description" class="mt-4 p-3 bg-white rounded-lg border border-purple-100">
              <h5 class="text-sm font-medium text-purple-700 mb-2">Description:</h5>
              <p class="text-sm text-purple-600">{{ planDetails.description }}</p>
            </div>
            
            <!-- 套餐特色列表 -->
            <div v-if="planDetails.features && planDetails.features.length > 0" class="mt-4">
              <h5 class="text-sm font-medium text-purple-700 mb-2">Features:</h5>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li v-for="feature in planDetails.features" :key="feature" class="flex items-center text-sm text-purple-600">
                  <svg class="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <!-- 积分价值说明 -->
            <div class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h6 class="text-sm font-medium text-yellow-800">Points Value</h6>
                  <p class="text-xs text-yellow-700 mt-1">
                    You will receive <strong>{{ planDetails.pointsAmount?.toLocaleString() || 'N/A' }} points</strong> 
                    upon successful payment. Points can be used to unlock premium content and features.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Plan Details Loading -->
          <div v-if="isLoadingPlanDetails" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
              <span class="text-sm text-gray-600">Loading package details...</span>
            </div>
          </div>
          
          <!-- Payment Status -->
          <div v-if="paymentStatus" class="mb-6 p-4 rounded-lg" 
               :class="{
                 'bg-yellow-50': paymentStatus.status === 0,
                 'bg-green-50': paymentStatus.status === 1,
                 'bg-red-50': paymentStatus.status === 3
               }">
            <h4 class="font-medium mb-2" 
                :class="{
                  'text-yellow-900': paymentStatus.status === 0,
                  'text-green-900': paymentStatus.status === 1,
                  'text-red-900': paymentStatus.status === 3
                }">
              Payment Status
            </h4>
            <div class="text-sm space-y-1" 
                 :class="{
                   'text-yellow-800': paymentStatus.status === 0,
                   'text-green-800': paymentStatus.status === 1,
                   'text-red-800': paymentStatus.status === 3
                 }">
              <p><span class="font-medium">Status:</span> 
                <span v-if="paymentStatus.status === 0">Pending</span>
                <span v-else-if="paymentStatus.status === 1">Completed</span>
                <span v-else-if="paymentStatus.status === 2">Processing</span>
                <span v-else-if="paymentStatus.status === 3">Expired</span>
                <span v-else-if="paymentStatus.status === 4">Cancelled</span>
              </p>
              <p v-if="paymentStatus.txHash"><span class="font-medium">Transaction Hash:</span> 
                <span class="font-mono text-xs">{{ paymentStatus.txHash }}</span>
              </p>
              <p v-if="paymentStatus.confirmations !== undefined">
                <span class="font-medium">Confirmations:</span> 
                {{ paymentStatus.confirmations }}/{{ paymentStatus.requiredConfirmations }}
              </p>
            </div>
          </div>
          
          <!-- Payment Timeout -->
          <div v-if="timeRemaining > 0" class="mb-6 p-4 bg-orange-50 rounded-lg">
            <h4 class="font-medium text-orange-900 mb-2">Payment Timeout</h4>
            <div class="text-sm text-orange-800">
              <p><span class="font-medium">Time Remaining:</span> {{ formatTime(timeRemaining) }}</p>
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
                    {{ paymentInfo ? 'Order Payment' : 'External Payment' }}
                  </div>
                  <div class="text-blue-600">
                    {{ paymentInfo 
                      ? `Order #${paymentInfo.orderNumber} - Amount and currency are locked` 
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
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '~/utils/useNotification'
import { web3PaymentService, type PaymentRequest, type TransactionStatus } from '~/utils/web3Payment'
import { paymentService } from '~/utils/paymentService'
import type { PaymentOrder, PaymentInfo, PaymentStatus } from '~/types/payment'
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
const paymentInfo = ref<PaymentInfo | null>(null)
const paymentStatus = ref<PaymentStatus | null>(null)
const planDetails = ref<any>(null) // 套餐详细信息
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
const isLoadingPaymentInfo = ref(false)
const isLoadingPlanDetails = ref(false)

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

// 轮询和超时管理
const statusPollingInterval = ref<NodeJS.Timeout | null>(null)
const paymentTimeoutTimer = ref<NodeJS.Timeout | null>(null)
const timeRemaining = ref(0) // 剩余时间（秒）

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
  const paymentId = route.query.paymentId as string
  const orderNo = route.query.orderNo as string
  
  if (paymentId) {
    // 从支付页面跳转，加载支付信息
    isExternalPayment.value = true
    isAmountLocked.value = true
    loadPaymentInfo(parseInt(paymentId))
    console.log('Payment parameters:', { paymentId, orderNo })
  } else {
    // 没有支付ID，重定向到产品页面
    router.push('/products')
  }
}

// 加载支付信息
const loadPaymentInfo = async (paymentId: number) => {
  isLoadingPaymentInfo.value = true
  try {
    console.log('Loading payment info:', paymentId)
    
    const result = await paymentService.getPaymentInfo(paymentId)
    
    if (result.success && result.paymentInfo) {
      console.log('Payment info loaded successfully:', result.paymentInfo)
      
      // 设置支付信息
      paymentInfo.value = result.paymentInfo
      
      // 设置支付参数（锁定状态）
      paymentAmount.value = result.paymentInfo.tokenAmount
      selectedCurrency.value = result.paymentInfo.tokenCurrency
      paymentDescription.value = `Payment for ${result.paymentInfo.planName} - Order #${result.paymentInfo.orderNumber}`
      
      // 加载套餐详细信息
      await loadPlanDetails(result.paymentInfo.planId)
      
      // 开始轮询支付状态
      startStatusPolling(paymentId)
      
      // 开始支付超时倒计时
      startPaymentTimeout(result.paymentInfo.expiresAt)
      
      console.log('Payment details set:', {
        amount: paymentAmount.value,
        currency: selectedCurrency.value,
        description: paymentDescription.value
      })
    } else {
      console.error('Failed to load payment info:', result.error)
      showPaymentError('Payment Not Found', result.error || 'Payment not found or invalid payment ID')
    }
  } catch (error) {
    console.error('Error loading payment info:', error)
    showPaymentError('Payment Load Error', 'Failed to load payment information. Please try again.')
  } finally {
    isLoadingPaymentInfo.value = false
  }
}

// 加载套餐详细信息
const loadPlanDetails = async (planId: number) => {
  isLoadingPlanDetails.value = true
  try {
    console.log('Loading plan details:', planId)
    
    const result = await paymentService.getPlans()
    
    if (result.success && result.plans) {
      // 查找对应的套餐
      const plan = result.plans.find((p: any) => p.planId === planId)
      if (plan) {
        planDetails.value = plan
        console.log('Plan details loaded successfully:', plan)
      } else {
        console.warn('Plan not found:', planId)
      }
    } else {
      console.error('Failed to load plans:', result.error)
    }
  } catch (error) {
    console.error('Error loading plan details:', error)
  } finally {
    isLoadingPlanDetails.value = false
  }
}

// 开始状态轮询
const startStatusPolling = (paymentId: number) => {
  // 清除现有的轮询
  if (statusPollingInterval.value) {
    clearInterval(statusPollingInterval.value)
  }
  
  // 每5秒轮询一次支付状态
  statusPollingInterval.value = setInterval(async () => {
    try {
      const result = await paymentService.getPaymentStatus(paymentId)
      if (result.success && result.paymentStatus) {
        paymentStatus.value = result.paymentStatus
        
        // 如果支付成功，停止轮询并跳转
        if (result.paymentStatus.status === 1) {
          stopStatusPolling()
          showPaymentSuccess('Payment completed successfully!')
          setTimeout(() => {
            router.push('/payment-success')
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Status polling error:', error)
    }
  }, 5000)
}

// 停止状态轮询
const stopStatusPolling = () => {
  if (statusPollingInterval.value) {
    clearInterval(statusPollingInterval.value)
    statusPollingInterval.value = null
  }
}

// 开始支付超时倒计时
const startPaymentTimeout = (expiresAt: string) => {
  const expireTime = new Date(expiresAt).getTime()
  const now = Date.now()
  const remaining = Math.max(0, Math.floor((expireTime - now) / 1000))
  
  timeRemaining.value = remaining
  
  if (remaining > 0) {
    paymentTimeoutTimer.value = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 0) {
        stopPaymentTimeout()
        showPaymentError('Payment Timeout', 'Payment has expired. Please create a new payment.')
        router.push('/products')
      }
    }, 1000)
  }
}

// 停止支付超时倒计时
const stopPaymentTimeout = () => {
  if (paymentTimeoutTimer.value) {
    clearInterval(paymentTimeoutTimer.value)
    paymentTimeoutTimer.value = null
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

// 格式化时间显示
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
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
        if (paymentInfo.value) {
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
  if (!isWalletConnected.value || !paymentAmount.value || !paymentInfo.value) return

  // 检查是否正在支付中
  if (isPaymentInProgress.value) {
    showPaymentWarning('Payment in Progress', 'Please wait for the current payment to complete before starting a new one.')
    return
  }

  console.log('Initiating payment...', {
    isWalletConnected: isWalletConnected.value,
    paymentAmount: paymentAmount.value,
    paymentInfo: paymentInfo.value
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

    // 构建支付请求
    const paymentRequest: PaymentRequest = {
      amount: paymentAmount.value,
      currency: selectedCurrency.value,
      recipientAddress: paymentInfo.value.recipientAddress, // 使用后端返回的收款地址
      description: paymentDescription.value,
      orderId: paymentInfo.value.orderId,
      chainId: paymentInfo.value.chainId
    }

    console.log('Payment request:', paymentRequest)

    // 处理支付
    const result = await web3PaymentService.processPayment(paymentRequest)

    if (result.success && result.transactionHash) {
      // 开始监听交易状态
      await watchTransactionStatus(result.transactionHash)
      
      // 验证支付
      await verifyPayment(result.transactionHash)
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

// 验证支付
const verifyPayment = async (txHash: string) => {
  if (!paymentInfo.value) return

  try {
    const result = await paymentService.verifyPayment({
      paymentId: paymentInfo.value.paymentId,
      txHash: txHash,
      fromAddress: walletAddress.value
    })

    if (result.success) {
      if (result.confirmed) {
        notify.success('Payment Successful', 'Your payment has been confirmed and processed!')
        // 停止轮询和超时
        stopStatusPolling()
        stopPaymentTimeout()
        // 跳转到成功页面
        setTimeout(() => {
          router.push('/payment-success')
        }, 2000)
      } else {
        notify.info('Payment Pending', `Transaction submitted. Waiting for ${result.requiredConfirmations - result.confirmations} more confirmations.`)
        // 轮询会继续检查状态
      }
    } else {
      notify.error('Payment Verification Failed', result.error || 'Failed to verify payment')
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    notify.error('Verification Error', 'Failed to verify payment. Please contact support.')
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

// Check if wallet is already connected
onMounted(async () => {
  try {
    // 处理 URL 参数
    handleUrlParams()

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

// 组件卸载时清理
onUnmounted(() => {
  console.log('Web3Payment component unmounted')
  
  // 清理轮询和定时器
  stopStatusPolling()
  stopPaymentTimeout()
})
</script>
