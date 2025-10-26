<template>
  <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Login Required</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-2">Please log in to continue with your purchase</p>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <!-- Google Login Button -->
        <div v-if="loginModalType === 'google' || loginModalType === 'both'" class="mb-4">
          <button
            @click="handleGoogleLogin"
            :disabled="isGoogleLoggingIn"
            class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg v-if="!isGoogleLoggingIn" class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <svg v-else class="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ isGoogleLoggingIn ? 'Signing in...' : 'Continue with Google' }}</span>
          </button>
        </div>

        <!-- Web3 Login Button -->
        <div v-if="loginModalType === 'web3' || loginModalType === 'both'" class="mb-4">
          <button
            @click="handleWeb3Login"
            :disabled="isWeb3LoggingIn"
            class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg v-if="!isWeb3LoggingIn" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg v-else class="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{{ isWeb3LoggingIn ? 'Connecting...' : 'Connect Wallet' }}</span>
          </button>
        </div>

        <!-- Divider -->
        <div v-if="loginModalType === 'both'" class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <!-- Cancel Button -->
        <button
          @click="cancelLogin"
          class="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showLoginModal, loginModalType, handleGoogleLoginAction, handleWeb3LoginAction, cancelLogin, closeLoginModal } from '~/utils/verifLogin'
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/utils/useNotification'

const userStore = useUserStore()
const { notify } = useNotification()

// 登录状态
const isGoogleLoggingIn = ref(false)
const isWeb3LoggingIn = ref(false)

// 处理 Google 登录
const handleGoogleLogin = async () => {
  isGoogleLoggingIn.value = true
  try {
    await handleGoogleLoginAction()
  } catch (error) {
    console.error('Google login error:', error)
    notify.error('Login Failed', 'Google login failed. Please try again.')
  } finally {
    isGoogleLoggingIn.value = false
  }
}

// 处理 Web3 登录
const handleWeb3Login = async () => {
  isWeb3LoggingIn.value = true
  try {
    await handleWeb3LoginAction()
    // Web3 登录需要用户手动操作，这里只是提示
    notify.info('Web3 Login', 'Please use the Web3 login component to connect your wallet')
  } catch (error) {
    console.error('Web3 login error:', error)
    notify.error('Login Failed', 'Web3 login failed. Please try again.')
  } finally {
    isWeb3LoggingIn.value = false
  }
}

// 取消登录
const cancelLoginAction = () => {
  cancelLogin()
}

// 关闭弹窗
const closeModal = () => {
  closeLoginModal()
}

// 监听登录状态变化
watch(() => userStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && showLoginModal.value) {
    // 用户已登录，关闭弹窗并触发成功事件
    showLoginModal.value = false
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('login-success'))
    }
  }
})
</script>

<style scoped>
/* 确保弹窗在最顶层 */
.fixed {
  z-index: 9999;
}
</style>
