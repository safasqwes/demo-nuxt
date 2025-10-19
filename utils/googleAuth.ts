/**
 * Google Authentication Utility
 * 处理 Google 登录相关的所有逻辑，包括 FedCM 支持和备用方法
 */

import { ref } from 'vue'

// Google 登录状态类型
export type GoogleLoginStatus = 'idle' | 'connecting' | 'authenticating' | 'error'

// Google 登录状态管理
export const googleLoginStatus = ref<GoogleLoginStatus>('idle')
export const isGoogleLoginInProgress = ref(false)
export const fedcmSupported = ref(true) // 默认假设支持 FedCM

// Google Identity Services 加载状态
let googleScriptLoading = false
let googleScriptLoaded = false

// Google Identity Services 类型声明
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, config: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

/**
 * 检测 FedCM 支持
 */
export const checkFedcmSupport = () => {
  try {
    // 检查浏览器是否支持 FedCM
    if ('IdentityCredential' in window) {
      console.log('FedCM is supported')
      fedcmSupported.value = true
    } else {
      console.log('FedCM is not supported, will use fallback method')
      fedcmSupported.value = false
    }
  } catch (error) {
    console.warn('Error checking FedCM support:', error)
    fedcmSupported.value = false
  }
}

/**
 * 检测 FedCM 是否被禁用
 */
export const checkFedcmDisabled = (notify: any) => {
  // 监听 FedCM 相关错误
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('FedCM was disabled') || message.includes('FedCM get() rejects')) {
      console.log('FedCM is disabled, switching to fallback method')
      fedcmSupported.value = false
      notify.info('Login Method Changed', 'Switching to alternative login method due to browser settings.')
    }
    originalConsoleError.apply(console, args)
  }
}

/**
 * 加载 Google Identity Services 脚本
 */
export const loadGoogleIdentityServices = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      googleScriptLoaded = true
      resolve(true)
      return
    }
    
    if (googleScriptLoading) {
      // 如果正在加载，等待加载完成
      const checkLoaded = () => {
        if (window.google && window.google.accounts) {
          googleScriptLoaded = true
          resolve(true)
        } else if (!googleScriptLoading) {
          reject(new Error('Google Identity Services failed to load'))
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }
    
    googleScriptLoading = true
    
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      googleScriptLoading = false
      googleScriptLoaded = true
      resolve(true)
    }
    script.onerror = () => {
      googleScriptLoading = false
      reject(new Error('Failed to load Google Identity Services'))
    }
    document.head.appendChild(script)
  })
}

/**
 * 获取 Google 登录按钮文本
 */
export const getGoogleLoginButtonText = (userStoreLoading: boolean): string => {
  if (userStoreLoading) {
    return 'Signing in...'
  }
  
  switch (googleLoginStatus.value) {
    case 'connecting':
      return 'Connecting...'
    case 'authenticating':
      return 'Authenticating...'
    case 'error':
      return 'Retry Google Login'
    default:
      return 'Login with Google'
  }
}

/**
 * 备用登录方法 - 使用传统的弹窗方式
 */
export const handleGoogleLoginFallback = async (
  clientId: string,
  callback: (response: any) => void,
  notify: any
) => {
  try {
    googleLoginStatus.value = 'connecting'
    
    // 清理之前的备用按钮
    const existingButton = document.getElementById('google-signin-button-fallback')
    if (existingButton) {
      existingButton.remove()
    }
    
    // 创建一个隐藏的按钮来触发 Google 登录
    const button = document.createElement('div')
    button.id = 'google-signin-button-fallback'
    button.style.display = 'none'
    button.style.position = 'absolute'
    button.style.left = '-9999px'
    document.body.appendChild(button)
    
    // 使用 renderButton 方法
    if (window.google && window.google.accounts) {
      const googleId = window.google.accounts.id as any
      
      // 重新初始化以确保使用正确的配置
      googleId.initialize({
        client_id: clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      
      googleId.renderButton(button, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        width: 200
      })
      
      // 等待按钮渲染完成
      setTimeout(() => {
        const googleButton = button.querySelector('div[role="button"]') as HTMLElement
        if (googleButton) {
          console.log('Using fallback Google login method')
          googleButton.click()
        } else {
          console.error('Google fallback button not rendered')
          googleLoginStatus.value = 'error'
          isGoogleLoginInProgress.value = false
          notify.error('Login Error', 'Unable to initialize Google login. Please check your browser settings and try again.')
        }
      }, 500)
    } else {
      throw new Error('Google services not available')
    }
  } catch (error) {
    console.error('Google fallback login failed:', error)
    googleLoginStatus.value = 'error'
    isGoogleLoginInProgress.value = false
    notify.error('Login Error', 'Google login is not available. Please check your browser settings and try again.')
  }
}

/**
 * 主要的 Google 登录处理函数
 */
export const handleGoogleLogin = async (
  clientId: string,
  callback: (response: any) => void,
  notify: any
) => {
  // 防止重复点击
  if (isGoogleLoginInProgress.value) {
    console.log('Google login already in progress, ignoring click')
    return
  }
  
  let timeoutId: NodeJS.Timeout | null = null
  
  try {
    isGoogleLoginInProgress.value = true
    googleLoginStatus.value = 'connecting'
    
    // 设置超时机制，防止状态卡住
    timeoutId = setTimeout(() => {
      if (isGoogleLoginInProgress.value && googleLoginStatus.value === 'connecting') {
        console.warn('Google login timeout, resetting state')
        googleLoginStatus.value = 'error'
        isGoogleLoginInProgress.value = false
        notify.error('Login Timeout', 'Google login took too long. Please try again.')
      }
    }, 30000) // 30秒超时
    
    // Load Google Identity Services
    await loadGoogleIdentityServices()
    
    // Initialize Google Sign-In
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      
      // 根据 FedCM 支持情况选择登录方法
      if (fedcmSupported.value) {
        // 使用 FedCM 兼容方式
        try {
          const googleId = window.google.accounts.id as any
          
          if (googleId.prompt) {
            // 使用新的 prompt 方法，支持 FedCM
            googleId.prompt((notification: any) => {
              console.log('Google login notification:', notification)
              
              if (notification.isNotDisplayed()) {
                console.log('Google login prompt not displayed')
                googleLoginStatus.value = 'error'
                isGoogleLoginInProgress.value = false
                notify.error('Login Error', 'Google login popup was blocked. Please check your browser settings and try again.')
              } else if (notification.isSkippedMoment()) {
                console.log('Google login prompt skipped')
                googleLoginStatus.value = 'idle'
                isGoogleLoginInProgress.value = false
              } else if (notification.isDismissedMoment()) {
                console.log('Google login prompt dismissed')
                googleLoginStatus.value = 'idle'
                isGoogleLoginInProgress.value = false
              }
            })
          } else {
            // 降级到旧方法
            googleId.prompt()
          }
        } catch (error) {
          console.warn('FedCM method failed, trying fallback:', error)
          
          // 检查是否是 FedCM 被禁用的错误
          const errorMessage = error instanceof Error ? error.message : String(error)
          if (errorMessage && (errorMessage.includes('FedCM was disabled') || errorMessage.includes('NetworkError'))) {
            console.log('FedCM is disabled, switching to fallback method')
            fedcmSupported.value = false
            notify.info('Login Method Changed', 'Switching to alternative login method due to browser settings.')
          }
          
          // 如果 FedCM 方法失败，尝试备用方法
          handleGoogleLoginFallback(clientId, callback, notify)
        }
      } else {
        // 直接使用备用方法
        console.log('Using fallback method due to FedCM not supported or disabled')
        handleGoogleLoginFallback(clientId, callback, notify)
      }
    } else {
      googleLoginStatus.value = 'error'
      isGoogleLoginInProgress.value = false
      notify.error('Login Error', 'Google services not available. Please refresh the page.')
    }
  } catch (error) {
    console.error('Google login error:', error)
    googleLoginStatus.value = 'error'
    isGoogleLoginInProgress.value = false
    notify.error('Login Failed', 'Failed to initialize Google login')
  } finally {
    // 清理超时定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Google 登录回调处理函数
 */
export const handleGoogleCallback = async (
  response: any,
  userStoreLogin: (credential: string) => Promise<any>,
  notify: any,
  onSuccess?: () => void
) => {
  try {
    // 更新状态为正在认证
    googleLoginStatus.value = 'authenticating'
    
    if (!response || !response.credential) {
      console.error('No credential received from Google')
      googleLoginStatus.value = 'error'
      isGoogleLoginInProgress.value = false
      notify.error('Login Failed', 'No credential received from Google')
      return
    }
    
    const result = await userStoreLogin(response.credential)
    
    if (result.success) {
      // 登录成功，重置状态
      googleLoginStatus.value = 'idle'
      isGoogleLoginInProgress.value = false
      notify.success('Welcome!', 'Successfully logged in with Google')
      onSuccess?.()
    } else {
      // 登录失败，设置为错误状态
      googleLoginStatus.value = 'error'
      isGoogleLoginInProgress.value = false
      notify.error('Login Failed', result.message || 'Google login failed')
    }
  } catch (error) {
    console.error('Google login callback error:', error)
    googleLoginStatus.value = 'error'
    isGoogleLoginInProgress.value = false
    notify.error('Login Failed', 'An error occurred during login')
  }
}

/**
 * 清理 Google 实例
 */
export const cleanupGoogleInstance = () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      // 清理 Google 实例 - 使用类型断言避免 TypeScript 错误
      const googleId = window.google.accounts.id as any
      if (googleId.disableAutoSelect) {
        googleId.disableAutoSelect()
      }
    } catch (error) {
      console.warn('Error cleaning up Google instance:', error)
    }
  }
  
  // 清理备用按钮
  const existingButton = document.getElementById('google-signin-button-fallback')
  if (existingButton) {
    existingButton.remove()
  }
}

/**
 * 重置 Google 登录状态
 */
export const resetGoogleLoginState = () => {
  isGoogleLoginInProgress.value = false
  googleLoginStatus.value = 'idle'
}
