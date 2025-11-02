import { nextTick } from 'vue'

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
  // Load Google Identity Services library with retry mechanism
  const loadGoogleScript = (retries: number = 3, delay: number = 1000): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.google && window.google.accounts && window.google.accounts.id) {
        googleScriptLoaded = true
        resolve(true)
        return
      }
      
      // 如果正在加载，等待加载完成
      if (googleScriptLoading) {
        let checkCount = 0
        const maxChecks = 50 // 最多检查 5 秒 (50 * 100ms)
        const checkLoaded = () => {
          checkCount++
          if (window.google && window.google.accounts && window.google.accounts.id) {
            googleScriptLoading = false
            googleScriptLoaded = true
            resolve(true)
          } else if (!googleScriptLoading && checkCount >= maxChecks) {
            reject(new Error('Google Identity Services failed to load (timeout)'))
          } else if (checkCount < maxChecks) {
            setTimeout(checkLoaded, 100)
          } else {
            reject(new Error('Google Identity Services failed to load (timeout)'))
          }
        }
        checkLoaded()
        return
      }
      
      googleScriptLoading = true
      
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = false // 改为 false，确保脚本加载顺序
      // 不设置 crossOrigin，Google 脚本默认支持跨域，设置它可能导致 CORS 错误
      
      let timeoutId: NodeJS.Timeout | null = null
      
      script.onload = () => {
        if (timeoutId) clearTimeout(timeoutId)
        
        // 等待 Google API 真正初始化完成
        let checkCount = 0
        const checkGoogleReady = () => {
          if (window.google && window.google.accounts && window.google.accounts.id) {
            googleScriptLoading = false
            googleScriptLoaded = true
            resolve(true)
          } else if (checkCount < 20) {
            // 最多等待 2 秒 (20 * 100ms)
            checkCount++
            setTimeout(checkGoogleReady, 100)
          } else {
            googleScriptLoading = false
            reject(new Error('Google Identity Services loaded but API not available'))
          }
        }
        checkGoogleReady()
      }
      
      script.onerror = (error) => {
        if (timeoutId) clearTimeout(timeoutId)
        googleScriptLoading = false
        
        // 清理失败的脚本
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        
        // 重试逻辑
        if (retries > 0) {
          console.warn(`Failed to load Google Identity Services, retrying... (${retries} attempts left)`)
          setTimeout(() => {
            loadGoogleScript(retries - 1, delay).then(resolve).catch(reject)
          }, delay)
        } else {
          reject(new Error('Failed to load Google Identity Services after multiple attempts'))
        }
      }
      
      // 设置超时
      timeoutId = setTimeout(() => {
        script.onerror = null
        script.onload = null
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        googleScriptLoading = false
        
        if (retries > 0) {
          console.warn(`Google Identity Services script loading timeout, retrying... (${retries} attempts left)`)
          setTimeout(() => {
            loadGoogleScript(retries - 1, delay).then(resolve).catch(reject)
          }, delay)
        } else {
          reject(new Error('Failed to load Google Identity Services (timeout)'))
        }
      }, 10000) // 10 秒超时
      
      // 确保在 DOM 准备好后才添加脚本
      const head = document.head
      const body = document.body
      if (head) {
        head.appendChild(script)
      } else if (body) {
        // 如果 head 不存在，添加到 body
        body.appendChild(script)
      } else {
        // 等待 DOM 准备好
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            const headAfterLoad = document.head
            const bodyAfterLoad = document.body
            if (headAfterLoad) {
              headAfterLoad.appendChild(script)
            } else if (bodyAfterLoad) {
              bodyAfterLoad.appendChild(script)
            }
          })
        } else {
          const headAfterReady = document.head
          const bodyAfterReady = document.body
          if (headAfterReady) {
            headAfterReady.appendChild(script)
          } else if (bodyAfterReady) {
            bodyAfterReady.appendChild(script)
          }
        }
      }
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
      // 确保在客户端环境
      if (typeof window === 'undefined') {
        console.warn('Google Sign-In can only be initialized on client-side')
        return
      }
      
      // 加载 Google Identity Services 脚本
      await loadGoogleScript()
      
      // 等待一小段时间确保 Google API 完全初始化
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const config = useRuntimeConfig()
      const clientId = config.public.googleClientId
      
      if (!clientId) {
        console.error('Google Client ID is not configured!')
        console.error('Available config:', config.public)
        return
      }
      
      // 再次检查 Google API 是否可用
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            // 禁用 One Tap 提示，避免按钮文本自动变化
            itp_support: false,
            // 禁用使用 FedCM，使用传统的 renderButton 方式
            use_fedcm_for_prompt: false
          })
          // 只在开发环境显示日志
          if (import.meta.dev) {
            console.log('Google Sign-In initialized successfully')
          }
        } catch (initError) {
          console.error('Error initializing Google Sign-In:', initError)
          throw initError
        }
      } else {
        throw new Error('Google Identity Services API is not available after loading')
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error)
      // 不抛出错误，允许应用继续运行，但禁用 Google 登录功能
      googleScriptLoaded = false
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
        
        // 直接使用传统的 renderButton 方式，不使用 FedCM
        // FedCM 在某些浏览器环境中可能不稳定，使用传统方式更可靠
        handleGoogleLoginFallback(clientId, callback, notify)
        
        // 如果未来需要使用 FedCM，可以取消下面的注释并注释掉上面的代码
        /*
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
        */
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
        
        // 确保状态已经更新完成
        await nextTick()
        
        // 触发全局登录成功事件，通知所有组件更新状态
        if (typeof window !== 'undefined') {
          const { useUserStore } = await import('~/stores/user')
          const userStore = useUserStore()
          window.dispatchEvent(new CustomEvent('user-login-success', {
            detail: { user: userStore.userInfo }
          }))
          // 兼容旧的事件名
          window.dispatchEvent(new CustomEvent('login-success'))
        }
        
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
          
          // 确保状态完整更新
          userStore.setToken(result.data.token, result.data.refreshToken)
          userStore.setUserInfo(result.data.user)
          userStore.updateActivity()
          
          // 更新签到信息（如果有）
          if (result.data.claimInfo) {
            userStore.setClaimInfo(result.data.claimInfo)
          }
          
          // 触发全局登录成功事件，通知所有组件更新状态
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('user-login-success', {
              detail: { user: result.data.user }
            }))
            // 兼容旧的事件名
            window.dispatchEvent(new CustomEvent('login-success'))
          }
          
          // 确保状态已经更新完成
          await nextTick()
        } catch (error) {
          console.warn('Failed to update user store:', error)
        }
        
        // 不刷新页面，只更新菜单栏（菜单栏会响应式更新）
        // 菜单栏使用 userStore.isAuthenticated，会自动响应式更新
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
    
    // 清理容器内可能存在的旧 Google 按钮，避免重复渲染
    // 保留 button 元素（备用按钮）和容器本身的样式类
    const existingGoogleButtons = element.querySelectorAll('div[role="button"], iframe[title*="Sign"], iframe[title*="Google"], div[id^="google"], iframe[id^="google"]')
    existingGoogleButtons.forEach(btn => {
      // 确保不删除备用按钮（button 元素）
      if (btn.tagName !== 'BUTTON') {
        btn.remove()
      }
    })
    
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        // 合并默认配置和用户配置
        const defaultConfig = {
          theme: 'outline',
          size: 'large',
          text: 'signin_with', // 固定按钮文本：Sign in with Google
          shape: 'rectangular',
          logo_alignment: 'left',
          type: 'standard', // 使用标准类型，避免自动状态切换
          width: 200 // 默认宽度
        }
        
        const finalConfig = {
          ...defaultConfig,
          ...options // 用户配置会覆盖默认配置
        }
        
        window.google.accounts.id.renderButton(element, finalConfig)
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

  // Smart render function with retry mechanism and API loading check
  const renderGoogleButtonWithRetry = async (elementId: string, options: any = {}, maxRetries: number = 3, retryDelay: number = 100): Promise<boolean> => {
    // 首先确保 Google API 已加载
    if (!googleScriptLoaded && !googleScriptLoading) {
      try {
        await loadGoogleScript()
      } catch (error) {
        console.error('Failed to load Google Identity Services for button rendering:', error)
        return false
      }
    }
    
    // 如果正在加载，等待加载完成
    if (googleScriptLoading) {
      let waitCount = 0
      const maxWait = 50 // 最多等待 5 秒
      while (googleScriptLoading && waitCount < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 100))
        waitCount++
      }
      
      if (googleScriptLoading || !window.google || !window.google.accounts || !window.google.accounts.id) {
        console.error('Google Identity Services failed to load within timeout')
        return false
      }
    }
    
    const attemptRender = (attempt: number = 1): Promise<boolean> => {
      return new Promise((resolve) => {
        // 再次检查 API 是否可用
        if (!window.google || !window.google.accounts || !window.google.accounts.id) {
          if (attempt < maxRetries) {
            console.warn(`Google API not available on attempt ${attempt}, retrying in ${retryDelay}ms...`)
            setTimeout(() => {
              attemptRender(attempt + 1).then(resolve)
            }, retryDelay)
          } else {
            console.error(`Google API not available after ${maxRetries} attempts`)
            resolve(false)
          }
          return
        }
        
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
    
    // 不刷新页面，只更新菜单栏（菜单栏会响应式更新）
    // 菜单栏使用 userStore.isAuthenticated，会自动响应式更新
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

  /**
   * 自动渲染 Google 按钮（高级封装方法）
   * 自动处理初始化、环境检测、稳定检测等
   */
  const renderGoogleButtonAuto = async (
    elementId: string = 'google-signin-button',
    options: {
      onStateChange?: (state: string) => void
      onReady?: () => void
      onError?: (error: Error) => void
    } = {}
  ): Promise<{ success: boolean; state: string }> => {
    const { onStateChange, onReady, onError } = options
    
    try {
      // 检测移动端
      const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
      
      // 初始化
      onStateChange?.('initializing')
      await initializeGoogleSignIn()
      onStateChange?.('script_ready')
      
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const container = document.getElementById(elementId)
      if (!container) {
        const error = new Error('Button container not found')
        onError?.(error)
        return { success: false, state: 'error' }
      }
      
      // 渲染按钮
      onStateChange?.('rendering')
      const buttonConfig = {
        theme: 'outline',
        size: isMobile ? 'medium' : 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        type: 'standard',
        width: isMobile ? 180 : 200
      }
      
      const success = await renderGoogleButtonWithRetry(elementId, buttonConfig, 3, 100)
      if (!success) {
        const error = new Error('Failed to render button')
        onError?.(error)
        return { success: false, state: 'error' }
      }
      
      // 等待按钮稳定（简化版，使用工具函数）
      onStateChange?.('checking')
      const { waitForGoogleButtonStable } = await import('~/utils/googleButtonState')
      await waitForGoogleButtonStable(container, {
        maxAttempts: isMobile ? 50 : 30,
        delay: isMobile ? 150 : 100,
        requireStable: true,
        stableThreshold: 3,
        maxWaitTime: isMobile ? 5000 : 3000
      })
      
      // 检查是否成功渲染
      const div = container.querySelector('div[role="button"]') as HTMLElement
      const iframe = container.querySelector('iframe[title*="Sign"], iframe[title*="Google"]') as HTMLElement
      const isRendered = (div?.offsetParent !== null) || (iframe?.offsetParent !== null)
      
      if (isRendered) {
        onStateChange?.('rendered')
        await new Promise(resolve => setTimeout(resolve, 200))
        onReady?.()
        return { success: true, state: 'rendered' }
      } else {
        // 重试检测
        await new Promise(resolve => setTimeout(resolve, 500))
        const retryDiv = container.querySelector('div[role="button"]') as HTMLElement
        const retryIframe = container.querySelector('iframe[title*="Sign"], iframe[title*="Google"]') as HTMLElement
        const retryIsRendered = (retryDiv?.offsetParent !== null) || (retryIframe?.offsetParent !== null)
        
        if (retryIsRendered) {
          onStateChange?.('rendered')
          onReady?.()
          return { success: true, state: 'rendered' }
        } else {
          const error = new Error('Button not rendered after retry')
          onError?.(error)
          return { success: false, state: 'error' }
        }
      }
    } catch (error) {
      onError?.(error as Error)
      return { success: false, state: 'error' }
    }
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
        renderGoogleButtonAuto, // 新增：自动渲染方法
        
        // 状态管理
        googleLoginStatus: readonly(googleLoginStatus),
        isGoogleLoginInProgress: readonly(isGoogleLoginInProgress),
        fedcmSupported: readonly(fedcmSupported)
      }
    }
  }
})
