<template>
  <div class="web3-login">
    <!-- 未连接状态 -->
    <button 
      v-if="!isConnected"
      @click="handleConnect"
      :disabled="isConnecting"
      class="web3-login-btn"
    >
      <span v-if="isConnecting" class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        连接中...
      </span>
      <span v-else class="flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        🔗 连接钱包
      </span>
    </button>

    <!-- 已连接状态 -->
    <div v-else class="web3-connected">
      <div class="wallet-info">
        <div class="address-display">
          <span class="wallet-icon">🔗</span>
          <span class="address">{{ formattedAddress }}</span>
        </div>
        <button 
          @click="handleSignAndLogin"
          :disabled="isSigning || userStore.loading"
          class="sign-btn"
        >
          <span v-if="isSigning || userStore.loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ isSigning ? '签名中...' : '登录中...' }}
          </span>
          <span v-else>登录</span>
        </button>
      </div>
      
      <button 
        @click="handleDisconnect"
        class="disconnect-btn"
        title="断开连接"
      >
        ✕
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeb3 } from '~/composables/useWeb3'
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/composables/useNotification'

const { 
  isConnected, 
  address, 
  isConnecting, 
  isSigning, 
  error, 
  formattedAddress,
  connectWallet, 
  disconnectWallet, 
  signMessage,
  initWeb3 
} = useWeb3()

const userStore = useUserStore()
const { notify } = useNotification()

// 组件挂载时初始化Web3
onMounted(() => {
  initWeb3()
})

// 处理连接钱包
const handleConnect = async () => {
  const result = await connectWallet()
  
  if (!result.success) {
    notify.error('连接失败', result.message || '连接钱包失败')
  }
}

// 处理签名并登录
const handleSignAndLogin = async () => {
  if (!address.value) {
    notify.error('登录失败', '钱包地址不存在')
    return
  }

  try {
    // 1. 获取登录消息
    const messageResult = await userStore.getWeb3Message(address.value)
    if (!messageResult.success) {
      notify.error('获取登录消息失败', messageResult.message || '获取登录消息失败')
      return
    }

    const message = messageResult.message
    console.log('Web3登录消息:', message)

    // 2. 使用标准的 signer.signMessage(message) 签名消息
    // 确保 message 原样传输到后端
    const signResult = await signMessage(message)
    if (!signResult.success) {
      notify.error('签名失败', signResult.message || '签名失败')
      return
    }

    console.log('Web3签名结果:', signResult.signature)

    // 3. 调用Web3登录，确保 message 原样传输
    const loginResult = await userStore.web3Login(address.value, signResult.signature!, message)
    
    if (loginResult.success) {
      notify.success('登录成功', 'Web3钱包登录成功')
      // 可以触发父组件的登录成功事件
      emit('login-success')
    } else {
      notify.error('登录失败', loginResult.message || 'Web3登录失败')
    }
  } catch (err) {
    console.error('Web3登录错误:', err)
    notify.error('登录失败', '网络错误，请稍后重试')
  }
}

// 处理断开连接
const handleDisconnect = () => {
  disconnectWallet()
  notify.info('已断开', '钱包连接已断开')
}

// 定义事件
const emit = defineEmits<{
  'login-success': []
}>()
</script>

<style scoped>
.web3-login {
  @apply flex flex-col gap-2;
}

.web3-login-btn {
  @apply flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 border border-transparent rounded-lg text-white text-sm font-medium cursor-pointer transition-all shadow-sm hover:from-blue-600 hover:to-purple-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none;
}

.web3-connected {
  @apply flex items-center gap-2;
}

.wallet-info {
  @apply flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2;
}

.address-display {
  @apply flex items-center gap-2 text-sm text-gray-700;
}

.wallet-icon {
  @apply text-blue-500;
}

.address {
  @apply font-mono font-medium;
}

.sign-btn {
  @apply px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md cursor-pointer transition-all hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed;
}

.disconnect-btn {
  @apply w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 text-xs font-bold rounded-full cursor-pointer transition-all hover:bg-red-200 hover:text-red-700;
}

.error-message {
  @apply text-red-500 text-xs mt-1 px-2 py-1 bg-red-50 rounded;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .web3-login-btn {
    @apply px-3 py-2 text-xs;
  }
  
  .wallet-info {
    @apply px-2 py-1.5;
  }
  
  .address {
    @apply text-xs;
  }
  
  .sign-btn {
    @apply px-2 py-1 text-xs;
  }
}
</style>
