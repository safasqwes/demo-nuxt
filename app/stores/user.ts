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
      if (process.client) {
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
      if (process.client) {
        localStorage.setItem('user_info', JSON.stringify(info))
      }
    },

    /**
     * Login action
     */
    async login(email: string, password: string) {
      this.loading = true
      try {
        // Call login API
        const { http } = await import('~/utils/http')
        const response = await http.post('/auth/login', { email, password })
        
        if (response.success) {
          this.setToken(response.data.token, response.data.refreshToken)
          this.setUserInfo(response.data.user)
          this.updateActivity()
          return { success: true }
        }
        
        return { success: false, message: response.message }
      } catch (error: any) {
        return { success: false, message: error.message }
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
          const { http } = await import('~/utils/http')
          await http.post('/auth/logout', {}, { not_show_error: true })
        }
      } catch (error) {
        console.error('Logout API error:', error)
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
      if (process.client) {
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
        const { http } = await import('~/utils/http')
        const response = await http.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        })

        if (response.success) {
          this.setToken(response.data.token, response.data.refreshToken)
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
        const response = await http.put('/user/profile', data)
        
        if (response.success) {
          this.setUserInfo({ ...this.userInfo, ...response.data.user })
          return { success: true }
        }
        
        return { success: false, message: response.message }
      } catch (error: any) {
        return { success: false, message: error.message }
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
      if (!process.client) return

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
     * Check authentication status
     */
    async checkAuth() {
      if (!this.token) return false

      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/auth/verify', {}, { not_show_error: true })
        
        if (response.success) {
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

