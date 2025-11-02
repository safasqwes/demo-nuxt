/**
 * Google 登录按钮状态管理工具
 * 用于检测浏览器环境、按钮状态等
 */

/**
 * 按钮渲染状态枚举
 */
export enum GoogleButtonState {
  // 初始化阶段
  INITIALIZING = 'initializing',           // 正在初始化（检查用户状态、加载脚本）
  CHECKING_GOOGLE_ACCOUNT = 'checking',   // 正在检测可用的 Google 账号
  ACCOUNT_DETECTED = 'detected',          // 已检测到可用账号
  
  // 渲染阶段
  SCRIPT_LOADING = 'script_loading',      // Google 脚本加载中
  SCRIPT_READY = 'script_ready',          // Google 脚本已就绪
  RENDERING = 'rendering',                // 正在渲染按钮
  RENDERED = 'rendered',                  // 按钮渲染完成
  
  // 错误状态
  ERROR = 'error',                        // 初始化或渲染失败
  UNSUPPORTED = 'unsupported',            // 浏览器不支持
  
  // 最终状态
  HIDDEN = 'hidden',                      // 已登录，按钮隐藏
}

/**
 * 浏览器环境类型
 */
export enum BrowserEnvironment {
  DESKTOP = 'desktop',     // 桌面端
  MOBILE = 'mobile',        // 移动端
  TABLET = 'tablet',       // 平板
}

/**
 * 检测浏览器环境类型
 */
export function detectBrowserEnvironment(): BrowserEnvironment {
  if (typeof window === 'undefined') return BrowserEnvironment.DESKTOP
  
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent)
  
  if (isTablet) return BrowserEnvironment.TABLET
  if (isMobile) return BrowserEnvironment.MOBILE
  return BrowserEnvironment.DESKTOP
}

/**
 * 检测是否支持触摸屏
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检测是否为移动设备（简化的检测）
 */
export function isMobileDevice(): boolean {
  const env = detectBrowserEnvironment()
  return env === BrowserEnvironment.MOBILE || env === BrowserEnvironment.TABLET
}

/**
 * 检测 Google Identity Services 是否可用
 */
export function checkGoogleServicesAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window.google && window.google.accounts && window.google.accounts.id)
}

/**
 * 检测 Google 按钮是否可见且稳定
 * @param container 按钮容器元素
 * @param options 检测选项
 * @returns Promise<void>
 */
export function waitForGoogleButtonStable(
  container: HTMLElement,
  options: {
    maxAttempts?: number
    delay?: number
    requireStable?: boolean
    stableThreshold?: number
    maxWaitTime?: number
  } = {}
): Promise<void> {
  const {
    maxAttempts = 30,
    delay = 100,
    requireStable = true,
    stableThreshold = 3,
    maxWaitTime = 3000
  } = options
  
  return new Promise((resolve) => {
    let attempts = 0
    let lastText = ''
    let stableCount = 0
    const startTime = Date.now()
    
    const checkStable = () => {
      attempts++
      
      // 超时检查
      const elapsed = Date.now() - startTime
      if (elapsed >= maxWaitTime) {
        resolve() // 超时也 resolve，避免阻塞
        return
      }
      
      // 尝试多种选择器，因为 Google 按钮的结构可能不同
      const googleButton = container.querySelector('div[role="button"]') as HTMLElement ||
                          container.querySelector('iframe[title*="Sign"]') as HTMLElement ||
                          container.querySelector('iframe[title*="Google"]') as HTMLElement
      
      if (googleButton) {
        const rect = googleButton.getBoundingClientRect()
        const hasSize = rect.width > 0 && rect.height > 0
        const isVisible = googleButton.offsetParent !== null
        const currentText = googleButton.textContent?.trim() || ''
        
        // 对于 iframe，检查其尺寸
        const iframeVisible = googleButton.tagName === 'IFRAME' ? hasSize : (hasSize && isVisible)
        
        if (iframeVisible) {
          if (requireStable && currentText.length > 0) {
            // 需要文本稳定
            if (currentText === lastText) {
              stableCount++
              if (stableCount >= stableThreshold) {
                // 按钮稳定，再等待一小段时间确保完全渲染
                setTimeout(() => resolve(), 150)
                return
              }
            } else {
              // 文本变化了，重置计数器
              stableCount = 0
              lastText = currentText
            }
          } else if (googleButton.tagName === 'IFRAME') {
            // iframe 按钮，只要可见即可
            setTimeout(() => resolve(), 200)
            return
          } else {
            // 只需要可见即可，或者不需要稳定检测
            setTimeout(() => resolve(), 100)
            return
          }
        }
      }
      
      // 继续检测
      if (attempts < maxAttempts) {
        setTimeout(checkStable, delay)
      } else {
        // 达到最大尝试次数，也 resolve（可能按钮已经渲染但检测失败）
        resolve()
      }
    }
    
    checkStable()
  })
}

/**
 * 检测 Google 按钮是否真正可见
 * @param container 按钮容器元素
 * @param maxAttempts 最大尝试次数
 * @param delay 检测间隔（毫秒）
 * @returns Promise<void>
 */
export function waitForGoogleButtonVisible(
  container: HTMLElement,
  maxAttempts: number = 20,
  delay: number = 50
): Promise<void> {
  return waitForGoogleButtonStable(container, {
    maxAttempts,
    delay,
    requireStable: false
  })
}

