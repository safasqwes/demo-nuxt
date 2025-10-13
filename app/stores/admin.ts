/**
 * Admin Store
 * Manages admin authentication and authorization
 */

import { defineStore } from 'pinia'

interface AdminState {
  isAuthenticated: boolean
  adminUser: {
    username: string
    email: string
  } | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    isAuthenticated: false,
    adminUser: null,
  }),

  getters: {
    isAdmin: (state) => state.isAuthenticated,
    currentAdmin: (state) => state.adminUser,
  },

  actions: {
    /**
     * Admin login
     */
    async login(username: string, password: string) {
      // Mock authentication - replace with actual API call
      if (username === 'admin' && password === 'admin123') {
        this.isAuthenticated = true
        this.adminUser = {
          username: 'admin',
          email: 'admin@novelhub.com',
        }

        // Store in localStorage
        if (process.client) {
          localStorage.setItem('admin_token', 'mock_admin_token')
        }

        return true
      }

      return false
    },

    /**
     * Admin logout
     */
    logout() {
      this.isAuthenticated = false
      this.adminUser = null

      if (process.client) {
        localStorage.removeItem('admin_token')
      }
    },

    /**
     * Check admin authentication
     */
    checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('admin_token')
        if (token === 'mock_admin_token') {
          this.isAuthenticated = true
          this.adminUser = {
            username: 'admin',
            email: 'admin@novelhub.com',
          }
        }
      }
    },
  },
})

