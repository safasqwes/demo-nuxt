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
  [key: string]: any
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
        const { http } = await import('~/shared/utils/http')
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
     * Register action
     * @param username - 用户名
     * @param email - 邮箱
     * @param password - 密码
     */
    async register(username: string, email: string, password: string) {
      this.loading = true
      try {
        // Call register API - 对接后端 /api/auth/register
        const { http } = await import('~/shared/utils/http')
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
     * Logout action
     */
    async logout() {
      try {
        // Call logout API if needed
        if (this.token) {
          const { http } = await import('~/shared/utils/http')
          console.log('Sending logout request with fingerprint...')
          await http.post('/api/auth/logout', {}, { not_show_error: true })
          console.log('Logout request successful')
        }
      } catch (error) {
        console.error('Logout API error:', error)
        // Still clear auth even if API call fails
      } finally {
        this.clearAuth()
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
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_info')
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
        const { http } = await import('~/shared/utils/http')
        const response = await http.post('/api/auth/refresh', {
          refreshToken: this.refreshToken,
        })

        if (response.code === 200) {
          this.setToken(response.accessToken, response.refreshToken)
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
        const { http } = await import('~/shared/utils/http')
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
        const { http } = await import('~/shared/utils/http')
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
        const { http } = await import('~/shared/utils/http')
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
     * Initialize from localStorage
     */
    initFromStorage() {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('auth_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userInfo = localStorage.getItem('user_info')

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
        const { http } = await import('~/shared/utils/http')
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
  },
})

