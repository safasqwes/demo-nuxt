/**
 * 登录验证工具函数
 * 提供统一的登录状态检测和登录弹窗功能
 */

import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/utils/useNotification'
// Google Auth functions are now available via $googleAuth plugin

// 登录弹窗状态管理
export const showLoginModal = ref(false)
export const loginModalType = ref<'google' | 'web3' | 'both'>('both')

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isUserLoggedIn = (): boolean => {
  const userStore = useUserStore()
  return userStore.isAuthenticated && !!userStore.token
}

/**
 * 验证登录状态，如果未登录则显示登录弹窗
 * @param {Object} options - 配置选项
 * @param {string} options.message - 提示消息
 * @param {Function} options.onSuccess - 登录成功回调
 * @param {Function} options.onCancel - 取消登录回调
 * @param {'google' | 'web3' | 'both'} options.loginType - 登录方式类型
 * @returns {Promise<boolean>} 是否已登录（登录成功或之前已登录）
 */
export const verifLogin = async (options: {
  message?: string
  onSuccess?: () => void
  onCancel?: () => void
  loginType?: 'google' | 'web3' | 'both'
} = {}): Promise<boolean> => {
  const { 
    message = 'Please log in to continue', 
    onSuccess, 
    onCancel,
    loginType = 'both'
  } = options

  const userStore = useUserStore()
  const { notify } = useNotification()

  // 如果已经登录，直接返回 true
  if (isUserLoggedIn()) {
    return true
  }

  // 显示登录提示
  notify.info('Login Required', message)

  // 设置登录弹窗类型
  loginModalType.value = loginType

  // 显示登录弹窗
  showLoginModal.value = true

  // 返回一个 Promise，等待用户登录或取消
  return new Promise((resolve) => {
    let resolved = false

    // 监听登录成功事件
    const handleLoginSuccess = () => {
      if (resolved) return
      resolved = true
      showLoginModal.value = false
      onSuccess?.()
      cleanup()
      resolve(true)
    }

    // 监听取消登录事件
    const handleLoginCancel = () => {
      if (resolved) return
      resolved = true
      showLoginModal.value = false
      onCancel?.()
      cleanup()
      resolve(false)
    }

    // 监听弹窗关闭事件
    const handleModalClose = () => {
      if (resolved) return
      resolved = true
      showLoginModal.value = false
      onCancel?.()
      cleanup()
      resolve(false)
    }

    // 清理事件监听器
    const cleanup = () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('login-success', handleLoginSuccess)
        window.removeEventListener('login-cancel', handleLoginCancel)
        window.removeEventListener('login-modal-close', handleModalClose)
      }
    }

    // 将事件监听器添加到全局事件总线
    if (typeof window !== 'undefined') {
      window.addEventListener('login-success', handleLoginSuccess)
      window.addEventListener('login-cancel', handleLoginCancel)
      window.addEventListener('login-modal-close', handleModalClose)
    }

    // 设置超时清理
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        showLoginModal.value = false
        cleanup()
        resolve(false)
      }
    }, 300000) // 5分钟超时
  })
}

/**
 * 处理 Google 登录
 */
export const handleGoogleLoginAction = async () => {
  const userStore = useUserStore()
  const { notify } = useNotification()
  const { $googleAuth } = useNuxtApp()

  try {
    // 获取 Google Client ID（从 Nuxt 运行时配置中获取）
    const config = useRuntimeConfig()
    const clientId = config.public.googleClientId

    // 处理 Google 登录（使用传统的 renderButton 方式，不使用 FedCM）
    await $googleAuth.handleGoogleLogin(clientId, (response: any) => {
      $googleAuth.handleGoogleCallback(response, userStore.googleLogin, notify, () => {
        // 登录成功，触发全局事件
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('login-success'))
        }
      })
    }, notify)
  } catch (error) {
    console.error('Google login error:', error)
    notify.error('Login Failed', 'Google login failed. Please try again.')
  }
}

/**
 * 处理 Web3 登录
 */
export const handleWeb3LoginAction = async () => {
  const { notify } = useNotification()

  try {
    // 这里可以集成 Web3 登录逻辑
    // 由于 Web3Login 组件已经处理了登录逻辑，这里主要是触发登录流程
    notify.info('Web3 Login', 'Please use the Web3 login button to connect your wallet')
    
    // 可以在这里添加 Web3 登录的具体实现
    // 或者让用户手动点击 Web3 登录按钮
  } catch (error) {
    console.error('Web3 login error:', error)
    notify.error('Login Failed', 'Web3 login failed. Please try again.')
  }
}

/**
 * 取消登录
 */
export const cancelLogin = () => {
  showLoginModal.value = false
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('login-cancel'))
  }
}

/**
 * 关闭登录弹窗
 */
export const closeLoginModal = () => {
  showLoginModal.value = false
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('login-modal-close'))
  }
}
