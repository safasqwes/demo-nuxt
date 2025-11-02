/**
 * Google 登录按钮 Composable（简化版）
 * 使用 google-auth.client.ts 提供的 renderGoogleButtonAuto 方法
 */
import { ref, nextTick, watch, computed } from 'vue'
import { GoogleButtonState, isMobileDevice } from '~/utils/googleButtonState'
import { useUserStore } from '~/stores/user'
import { useNuxtApp } from '#app'

export const useGoogleButton = () => {
  const userStore = useUserStore()
  const { $googleAuth } = useNuxtApp()
  
  // 状态管理
  const state = ref<GoogleButtonState>(GoogleButtonState.INITIALIZING)
  const isReady = ref(false)
  const isMobile = ref(false)
  const isMounted = ref(false)
  
  // 计算属性
  const shouldShow = computed(() => 
    isMounted.value && !userStore.isAuthenticated && state.value !== GoogleButtonState.HIDDEN
  )
  
  const containerStyle = computed(() => ({
    minWidth: isMobile.value ? '180px' : '200px',
    minHeight: isMobile.value ? '38px' : '40px',
    width: isMobile.value ? '180px' : '200px',
    height: isMobile.value ? '38px' : '40px'
  }))
  
  /**
   * 检测浏览器环境
   */
  const detectEnvironment = () => {
    if (typeof window === 'undefined') return
    isMobile.value = isMobileDevice()
  }
  
  /**
   * 渲染 Google 按钮（使用插件的高级方法）
   */
  const render = async () => {
    detectEnvironment()
    
    const result = await $googleAuth.renderGoogleButtonAuto('google-signin-button', {
      onStateChange: (newState) => {
        // 映射状态
        const stateMap: Record<string, GoogleButtonState> = {
          'initializing': GoogleButtonState.INITIALIZING,
          'script_ready': GoogleButtonState.SCRIPT_READY,
          'rendering': GoogleButtonState.RENDERING,
          'checking': GoogleButtonState.CHECKING_GOOGLE_ACCOUNT,
          'rendered': GoogleButtonState.RENDERED,
          'error': GoogleButtonState.ERROR
        }
        state.value = stateMap[newState] || GoogleButtonState.INITIALIZING
      },
      onReady: () => {
        isReady.value = true
      },
      onError: (error) => {
        console.error('Google button rendering error:', error)
        state.value = GoogleButtonState.ERROR
        isReady.value = false
      }
    })
    
    if (!result.success) {
      state.value = GoogleButtonState.ERROR
      isReady.value = false
    }
  }
  
  /**
   * 清理 Google 按钮
   */
  const cleanup = async () => {
    state.value = GoogleButtonState.HIDDEN
    isReady.value = false
    await nextTick()
    
    const container = document.getElementById('google-signin-button')
    if (container) {
      const googleElements = container.querySelectorAll(
        'div[role="button"], iframe[title*="Sign"], iframe[title*="Google"], div[id^="google"], iframe[id^="google"]'
      )
      googleElements.forEach(el => {
        if (el.tagName !== 'BUTTON') {
          el.remove()
        }
      })
    }
    
    $googleAuth.cleanupGoogleInstance()
    await nextTick()
  }
  
  /**
   * 初始化 - 在组件挂载时调用
   */
  const init = async () => {
    if (typeof window === 'undefined') return
    
    isMounted.value = true
    
    if (!userStore.isAuthenticated) {
      await render()
    } else {
      state.value = GoogleButtonState.HIDDEN
    }
  }
  
  /**
   * 监听登录状态变化
   */
  const watchAuthState = () => {
    watch(() => userStore.isAuthenticated, async (isAuthenticated, wasAuthenticated) => {
      if (!isMounted.value) return
      
      if (isAuthenticated && !wasAuthenticated) {
        await cleanup()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('user-auth-state-changed', {
            detail: { isAuthenticated: true, user: userStore.userInfo }
          }))
        }
      } else if (!isAuthenticated && wasAuthenticated) {
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const container = document.getElementById('google-signin-button')
        if (container && !isReady.value) {
          await render()
        }
        
        await nextTick()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('user-auth-state-changed', {
            detail: { isAuthenticated: false }
          }))
        }
      }
    })
  }
  
  return {
    // 状态
    state: computed(() => state.value),
    isReady: computed(() => isReady.value),
    isMobile: computed(() => isMobile.value),
    isMounted: computed(() => isMounted.value),
    shouldShow,
    containerStyle,
    
    // 方法
    render,
    cleanup,
    init,
    watchAuthState
  }
}

