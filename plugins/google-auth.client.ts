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

export default defineNuxtPlugin(() => {
  // Load Google Identity Services library
  const loadGoogleScript = (): Promise<boolean> => {
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
   * 检测 FedCM 支持
   */
  const checkFedcmSupport = () => {
    try {
      // 检查浏览器是否支持 FedCM
      if ('IdentityCredential' in window) {
        fedcmSupported.value = true
      } else {
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
  const checkFedcmDisabled = (notify: any) => {
    // 监听 FedCM 相关错误
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('FedCM was disabled') || message.includes('FedCM get() rejects')) {
        fedcmSupported.value = false
        notify.info('Login Method Changed', 'Switching to alternative login method due to browser settings.')
      }
      originalConsoleError.apply(console, args)
    }
  }

  // Initialize Google Sign-In
  const initializeGoogleSignIn = async () => {
    try {
      await loadGoogleScript()
      
      const config = useRuntimeConfig()
      const clientId = config.public.googleClientId
      
      
      if (!clientId) {
        console.error('Google Client ID is not configured!')
        console.error('Available config:', config.public)
        return
      }
      
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error)
    }
  }

  /**
   * 备用登录方法 - 使用传统的弹窗方式
   */
  const handleGoogleLoginFallback = async (
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
  const handleGoogleLogin = async (
    clientId: string,
    callback: (response: any) => void,
    notify: any
  ) => {
    // 防止重复点击
    if (isGoogleLoginInProgress.value) {
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
      await loadGoogleScript()
      
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
                if (notification.isNotDisplayed()) {
                  googleLoginStatus.value = 'error'
                  isGoogleLoginInProgress.value = false
                  notify.error('Login Error', 'Google login popup was blocked. Please check your browser settings and try again.')
                } else if (notification.isSkippedMoment()) {
                  googleLoginStatus.value = 'idle'
                  isGoogleLoginInProgress.value = false
                } else if (notification.isDismissedMoment()) {
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
              fedcmSupported.value = false
              notify.info('Login Method Changed', 'Switching to alternative login method due to browser settings.')
            }
            
            // 如果 FedCM 方法失败，尝试备用方法
            handleGoogleLoginFallback(clientId, callback, notify)
          }
        } else {
          // 直接使用备用方法
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
  const handleGoogleCallback = async (
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

  // Handle Google credential response (legacy method for plugin compatibility)
  const handleCredentialResponse = async (response: any) => {
    
    try {
      
      // 直接发送credential到后端，让后端使用client-secret验证
      const { http } = await import('~/utils/http')
      const result = await http.post('/api/auth/google/login', {
        credential: response.credential
      })


      if (result.code === 200 && result.data?.success) {
        // Store tokens and user info in cookies
        const token = useCookie('auth-token')
        const refreshToken = useCookie('auth-refresh-token')
        const user = useCookie('user')
        
        token.value = result.data.token
        refreshToken.value = result.data.refreshToken
        user.value = JSON.stringify(result.data.user)
        
        // Also update the user store
        try {
          const { useUserStore } = await import('~/stores/user')
          const userStore = useUserStore()
          userStore.setToken(result.data.token, result.data.refreshToken)
          userStore.setUserInfo(result.data.user)
          userStore.updateActivity()
        } catch (error) {
          console.warn('Failed to update user store:', error)
        }
        
        // Redirect to home page
        await navigateTo('/')
      } else {
        throw new Error(result.message || 'Google login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      // Show error message to user
      alert('Google login failed. Please try again.')
    }
  }


  // Render Google Sign-In button
  const renderGoogleSignInButton = (elementId: string, options: any = {}) => {
    
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found:', elementId)
      return false
    }
    
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.renderButton(
          element,
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            ...options
          }
        )
        return true
      } catch (error) {
        console.error('Error rendering Google button:', error)
        return false
      }
    } else {
      console.error('Google API not loaded')
      return false
    }
  }

  // Smart render function with retry mechanism
  const renderGoogleButtonWithRetry = (elementId: string, options: any = {}, maxRetries: number = 3, retryDelay: number = 100) => {
    const attemptRender = (attempt: number = 1): Promise<boolean> => {
      return new Promise((resolve) => {
        const success = renderGoogleSignInButton(elementId, options)
        
        if (success) {
          resolve(true)
        } else if (attempt < maxRetries) {
          console.warn(`Failed to render Google button on attempt ${attempt}, retrying in ${retryDelay}ms...`)
          setTimeout(() => {
            attemptRender(attempt + 1).then(resolve)
          }, retryDelay)
        } else {
          console.error(`Failed to render Google button after ${maxRetries} attempts`)
          resolve(false)
        }
      })
    }

    return attemptRender()
  }

  // Sign out
  const signOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
    
    // Clear stored tokens
    const token = useCookie('auth-token')
    const refreshToken = useCookie('auth-refresh-token')
    const user = useCookie('user')
    
    token.value = null
    refreshToken.value = null
    user.value = null
    
    // Redirect to login
    navigateTo('/auth/login')
  }

  /**
   * 清理 Google 实例
   */
  const cleanupGoogleInstance = () => {
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
  const resetGoogleLoginState = () => {
    isGoogleLoginInProgress.value = false
    googleLoginStatus.value = 'idle'
  }

  // Provide methods globally
  return {
    provide: {
      googleAuth: {
        // 基础功能
        initialize: initializeGoogleSignIn,
        renderButton: renderGoogleSignInButton,
        renderButtonWithRetry: renderGoogleButtonWithRetry,
        signOut,
        
        // 高级功能
        handleGoogleLogin,
        handleGoogleCallback,
        handleGoogleLoginFallback,
        checkFedcmSupport,
        checkFedcmDisabled,
        cleanupGoogleInstance,
        resetGoogleLoginState,
        
        // 状态管理
        googleLoginStatus: readonly(googleLoginStatus),
        isGoogleLoginInProgress: readonly(isGoogleLoginInProgress),
        fedcmSupported: readonly(fedcmSupported)
      }
    }
  }
})
