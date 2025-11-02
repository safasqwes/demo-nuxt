/**
 * User Store - Pinia State Management
 * Manages user authentication, profile, and session data
 */

import { defineStore } from 'pinia'

interface UserInfo {
  id?: number
  email?: string
  username?: string
  avatar?: string
  plan_name?: string
  created_at?: string
  goldCoins?: number
  silverCoins?: number
  walletAddress?: string
  walletType?: string
  [key: string]: any
}

interface ClaimInfo {
  streakDays: number
  hasClaimedToday: boolean
  todayPoints: number
  nextDayPoints: number
  lastUpdate?: number // 最后更新时间戳
}

interface UserState {
  // Authentication
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  
  // User information
  userInfo: UserInfo | null
  
  // Loading states
  loading: boolean
  
  // Session
  lastActivity: number
  
  // Daily claim
  claimInfo: ClaimInfo | null
  claimLoading: boolean
}

export const useUserStore = defineStore('user', {
  /**
   * State
   */
  state: (): UserState => ({
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    userInfo: null,
    loading: false,
    lastActivity: Date.now(),
    claimInfo: null,
    claimLoading: false,
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get user ID
     */
    userId: (state) => state.userInfo?.id,

    /**
     * Get user email
     */
    userEmail: (state) => state.userInfo?.email,

    /**
     * Get user plan
     */
    userPlan: (state) => state.userInfo?.plan_name || 'free',

    /**
     * Check if user is premium
     */
    isPremium: (state) => {
      return state.userInfo?.plan_name && state.userInfo.plan_name !== 'free'
    },

    /**
     * Get user display name
     */
    displayName: (state) => {
      return state.userInfo?.username || state.userInfo?.email?.split('@')[0] || 'Guest'
    },

    /**
     * Get user gold coins (金币)
     */
    goldCoins: (state) => {
      return state.userInfo?.goldCoins || 0
    },

    /**
     * Get user silver coins (银币)
     */
    silverCoins: (state) => {
      return state.userInfo?.silverCoins || 0
    },

    /**
     * Check if user has claimed today
     */
    hasClaimedToday: (state) => {
      return state.claimInfo?.hasClaimedToday || false
    },

    /**
     * Get streak days
     */
    streakDays: (state) => {
      return state.claimInfo?.streakDays || 0
    },

    /**
     * Check session validity (30 minutes)
     */
    isSessionValid: (state) => {
      const thirtyMinutes = 30 * 60 * 1000
      return Date.now() - state.lastActivity < thirtyMinutes
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Set authentication token
     */
    setToken(token: string, refreshToken?: string) {
      this.token = token
      if (refreshToken) {
        this.refreshToken = refreshToken
      }
      this.isAuthenticated = true
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
      }
    },

    /**
     * Set user information
     */
    setUserInfo(info: UserInfo) {
      this.userInfo = info
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_info', JSON.stringify(info))
        // 同时保存 claimInfo
        if (this.claimInfo) {
          localStorage.setItem('claim_info', JSON.stringify(this.claimInfo))
        }
      }
    },

    /**
     * Set claim information
     */
    setClaimInfo(info: ClaimInfo) {
      // 添加时间戳
      const claimInfoWithTimestamp = {
        ...info,
        lastUpdate: Date.now()
      }
      this.claimInfo = claimInfoWithTimestamp
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('claim_info', JSON.stringify(claimInfoWithTimestamp))
      }
    },

    /**
     * Login action
     * @param username - 用户名或邮箱
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loading = true
      try {
        // Call login API - 对接后端 /api/auth/login
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/login', { 
          username, 
          password 
        })
        
        // 后端返回格式：{ code: 200, msg: "Login successful", user: {...}, accessToken: "...", refreshToken: "..." }
        if (response.code === 200) {
          this.setToken(response.accessToken, response.refreshToken)
          this.setUserInfo(response.user)
          this.updateActivity()
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Login failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Login failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Google Login action
     * @param credential - Google credential from Google Identity Services
     */
    async googleLogin(credential: string) {
      this.loading = true
      try {
        // Call Google login API - 对接后端 /api/auth/google/login
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/google/login', { 
          credential 
        })
        
        // 后端返回格式：{ code: 200, msg: "Google login successful", data: { success: true, user: {...}, token: "...", refreshToken: "...", claimInfo: {...} } }
        if (response.code === 200) {
          const data = response.data
          
          // 确保状态完整更新
          this.setToken(data.token, data.refreshToken)
          this.setUserInfo(data.user)
          this.updateActivity()
          
          // 更新签到信息
          if (data.claimInfo) {
            this.setClaimInfo(data.claimInfo)
          }
          
          // 如果后端返回了用户积分信息，也要更新
          if (data.user) {
            // 确保用户信息中的积分信息也更新
            if (data.user.goldCoins !== undefined) {
              this.userInfo = { ...this.userInfo, ...data.user }
              this.setUserInfo(this.userInfo)
            }
          }
          
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Google login failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Google login failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Register action
     * @param username - 用户名
     * @param email - 邮箱
     * @param password - 密码
     */
    async register(username: string, email: string, password: string) {
      this.loading = true
      try {
        // Call register API - 对接后端 /api/auth/register
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/register', { 
          username, 
          email, 
          password 
        })
        
        if (response.code === 200) {
          this.setToken(response.accessToken, response.refreshToken)
          this.setUserInfo(response.user)
          this.updateActivity()
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Registration failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Registration failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout action - 调用服务端logout接口
     */
    async logout() {
      this.loading = true
      try {
        // 调用服务端logout接口
        const { http } = await import('~/utils/http')
        console.log('Calling server logout API...')
        
        const response = await http.post('/api/auth/logout', {}, { 
          not_show_error: true // 不显示错误提示，避免影响用户体验
        })
        
        // 检查服务端响应
        if (response && response.code === 200) {
          console.log('Logout successful on server')
        } else {
          console.warn('Server logout response:', response)
        }
        
      } catch (error) {
        console.error('Server logout API error:', error)
        // 即使服务端调用失败，也要清除本地认证信息
      } finally {
        // 无论服务端调用是否成功，都要清除本地认证信息
        this.clearAuth()
        this.loading = false
      }
    },

    /**
     * Clear authentication data
     */
    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.userInfo = null
      this.claimInfo = null
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_info')
        localStorage.removeItem('claim_info')
      }
    },

    /**
     * Refresh token
     */
    async refreshAuthToken() {
      if (!this.refreshToken) {
        this.clearAuth()
        return false
      }

      try {
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/refresh', {
          refreshToken: this.refreshToken,
        })

        if (response.code === 200) {
          // 后端返回格式：{ code: 200, data: { token: "...", refreshToken: "..." } }
          const data = response.data
          this.setToken(data.token, data.refreshToken)
          return true
        }

        this.clearAuth()
        return false
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    /**
     * Update user profile
     */
    async updateProfile(data: Partial<UserInfo>) {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.put('/api/auth/profile', data)
        
        if (response.code === 200) {
          const userData = response.user || response.data?.user || response.data || response
          this.setUserInfo({ ...this.userInfo, ...userData })
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Update failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Update failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Get user profile from backend
     */
    async fetchProfile() {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/api/auth/profile')
        
        if (response.code === 200) {
          const userData = response.user || response.data?.user || response.data || response
          this.setUserInfo(userData)
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch profile' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to fetch profile'
        return { success: false, message }
      }
    },

    /**
     * Change password
     */
    async changePassword(oldPassword: string, newPassword: string) {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/change-password', {
          oldPassword,
          newPassword,
        })
        
        if (response.code === 200) {
          return { success: true, message: 'Password changed successfully' }
        }
        
        return { success: false, message: response.msg || 'Failed to change password' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to change password'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Update last activity timestamp
     */
    updateActivity() {
      this.lastActivity = Date.now()
    },

    /**
     * Check if claim info is expired (crossed day)
     */
    isClaimInfoExpired(claimInfo: ClaimInfo | null) {
      if (!claimInfo) return true
      
      // 检查是否跨天了
      const today = new Date().toDateString()
      const lastUpdate = new Date(claimInfo.lastUpdate || 0).toDateString()
      return today !== lastUpdate
    },

    /**
     * Initialize from localStorage
     */
    initFromStorage() {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('auth_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userInfo = localStorage.getItem('user_info')
      const claimInfo = localStorage.getItem('claim_info')

      if (token) {
        this.token = token
        this.isAuthenticated = true
      }

      if (refreshToken) {
        this.refreshToken = refreshToken
      }

      if (userInfo) {
        try {
          this.userInfo = JSON.parse(userInfo)
        } catch (error) {
          console.error('Failed to parse user info:', error)
        }
      }

      if (claimInfo) {
        try {
          const parsedClaimInfo = JSON.parse(claimInfo)
          // 检查 claimInfo 是否过期（跨天了）
          if (this.isClaimInfoExpired(parsedClaimInfo)) {
            // 如果过期了，清除本地存储的 claimInfo
            localStorage.removeItem('claim_info')
            this.claimInfo = null
          } else {
            this.claimInfo = parsedClaimInfo
          }
        } catch (error) {
          console.error('Failed to parse claim info:', error)
          localStorage.removeItem('claim_info')
        }
      }

      // Check session validity
      if (this.isAuthenticated && !this.isSessionValid) {
        this.refreshAuthToken()
      }
    },

    /**
     * Check authentication status by fetching profile
     */
    async checkAuth() {
      if (!this.token) return false

      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/api/auth/profile', {}, { not_show_error: true })
        
        if (response.code === 200) {
          this.updateActivity()
          return true
        }

        this.clearAuth()
        return false
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    /**
     * Get daily claim info
     */
    async fetchClaimInfo() {
      if (!this.isAuthenticated) return { success: false, message: 'Not authenticated' }

      this.claimLoading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/api/user/points')
        
        if (response.code === 200) {
          // 后端返回的数据结构包含 userPoint 和 claimInfo
          const data = response.data
          if (data.claimInfo) {
            this.setClaimInfo(data.claimInfo)
          }
          // 更新用户积分信息
          if (data.userPoint && this.userInfo) {
            this.userInfo.goldCoins = data.userPoint.fixedPoints || 0
            this.userInfo.silverCoins = data.userPoint.freePoints || 0
            this.setUserInfo(this.userInfo)
          }
          return { success: true, data: data.claimInfo }
        }
        
        return { success: false, message: response.msg || 'Failed to get claim info' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to get claim info'
        return { success: false, message }
      } finally {
        this.claimLoading = false
      }
    },

    /**
     * Claim daily free points
     */
    async claimDailyPoints() {
      if (!this.isAuthenticated) return { success: false, message: 'Not authenticated' }

      this.claimLoading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/user/points/claim-free-points')
        
        if (response.code === 200) {
          // 更新签到信息
          this.setClaimInfo(response.data)
          
          // 更新用户信息中的银币数量
          if (this.userInfo) {
            this.userInfo.silverCoins = (this.userInfo.silverCoins || 0) + (response.data.points || 0)
            this.setUserInfo(this.userInfo)
          }
          
          return { success: true, data: response.data }
        }
        
        // 检查是否是"今天已经领取过银币了"的错误
        if (response.code === 500 && response.msg === '今天已经领取过银币了') {
          // 更新签到状态为已领取
          const currentClaimInfo = this.claimInfo || {
            streakDays: 0,
            hasClaimedToday: false,
            todayPoints: 0,
            nextDayPoints: 0
          }
          
          // 设置为已领取状态
          const updatedClaimInfo = {
            ...currentClaimInfo,
            hasClaimedToday: true
          }
          this.setClaimInfo(updatedClaimInfo)
          
          return { success: false, message: response.msg, alreadyClaimed: true }
        }
        
        return { success: false, message: response.msg || 'Failed to claim points' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to claim points'
        
        // 检查是否是"今天已经领取过银币了"的错误
        if (error.response?.data?.msg === '今天已经领取过银币了') {
          // 更新签到状态为已领取
          const currentClaimInfo = this.claimInfo || {
            streakDays: 0,
            hasClaimedToday: false,
            todayPoints: 0,
            nextDayPoints: 0
          }
          
          // 设置为已领取状态
          const updatedClaimInfo = {
            ...currentClaimInfo,
            hasClaimedToday: true
          }
          this.setClaimInfo(updatedClaimInfo)
          
          return { success: false, message, alreadyClaimed: true }
        }
        
        return { success: false, message }
      } finally {
        this.claimLoading = false
      }
    },

    /**
     * Web3登录
     * @param address 钱包地址
     * @param signature 签名
     * @param message 原始消息
     */
    async web3Login(address: string, signature: string, message: string) {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/auth/web3/login', {
          address,
          signature,
          message
        })
        
        if (response.code === 200) {
          const data = response.data
          
          // 确保状态完整更新
          this.setToken(data.token, data.refreshToken)
          this.setUserInfo(data.user)
          this.updateActivity()
          
          // 更新签到信息
          if (data.claimInfo) {
            this.setClaimInfo(data.claimInfo)
          }
          
          // 如果后端返回了用户积分信息，也要更新
          if (data.user) {
            // 确保用户信息中的积分信息也更新
            if (data.user.goldCoins !== undefined || data.user.silverCoins !== undefined) {
              this.userInfo = { ...this.userInfo, ...data.user }
              this.setUserInfo(this.userInfo)
            }
          }
          
          // 触发全局登录成功事件
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('user-login-success', {
              detail: { user: data.user }
            }))
            window.dispatchEvent(new CustomEvent('login-success'))
          }
          
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Web3 login failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Web3 login failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取Web3登录消息
     * @param address 钱包地址
     */
    async getWeb3Message(address: string) {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/api/auth/web3/message', { address })
        
        if (response.code === 200) {
          return { success: true, message: response.data.message }
        }
        
        return { success: false, message: response.msg || 'Failed to get message' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to get message'
        return { success: false, message }
      }
    },
  },
})

