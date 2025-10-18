/**
 * App Store - Application State Management
 * Manages global application state, settings, and UI state
 */

import { defineStore } from 'pinia'

interface AppState {
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'auto'
  locale: string
  
  // Loading states
  globalLoading: boolean
  
  // Notifications
  notifications: Notification[]
  
  // App settings
  settings: {
    itemsPerPage: number
    enableNotifications: boolean
    enableSounds: boolean
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

export const useAppStore = defineStore('app', {
  /**
   * State
   */
  state: (): AppState => ({
    sidebarOpen: true,
    theme: 'light',
    locale: 'en',
    globalLoading: false,
    notifications: [],
    settings: {
      itemsPerPage: 10,
      enableNotifications: true,
      enableSounds: true,
    },
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get unread notifications count
     */
    unreadNotificationsCount: (state) => state.notifications.length,

    /**
     * Get theme preference
     */
    isDarkMode: (state) => {
      if (state.theme === 'auto') {
        if (process.client) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
      }
      return state.theme === 'dark'
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Toggle sidebar
     */
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      this.persistSettings()
    },

    /**
     * Set theme
     */
    setTheme(theme: 'light' | 'dark' | 'auto') {
      this.theme = theme
      this.applyTheme()
      this.persistSettings()
    },

    /**
     * Apply theme to document
     */
    applyTheme() {
      if (!process.client) return

      const isDark = this.isDarkMode
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', this.theme)
    },

    /**
     * Set locale
     */
    setLocale(locale: string) {
      this.locale = locale
      this.persistSettings()
    },

    /**
     * Show global loading
     */
    showLoading() {
      this.globalLoading = true
    },

    /**
     * Hide global loading
     */
    hideLoading() {
      this.globalLoading = false
    },

    /**
     * Add notification
     */
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        duration: notification.duration || 5000,
        ...notification,
      }

      this.notifications.push(newNotification)

      // Auto remove after duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(newNotification.id)
        }, newNotification.duration)
      }

      return newNotification.id
    },

    /**
     * Remove notification
     */
    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * Clear all notifications
     */
    clearNotifications() {
      this.notifications = []
    },

    /**
     * Update settings
     */
    updateSettings(settings: Partial<AppState['settings']>) {
      this.settings = { ...this.settings, ...settings }
      this.persistSettings()
    },

    /**
     * Persist settings to localStorage
     */
    persistSettings() {
      if (!process.client) return

      const settings = {
        sidebarOpen: this.sidebarOpen,
        theme: this.theme,
        locale: this.locale,
        settings: this.settings,
      }

      localStorage.setItem('app_settings', JSON.stringify(settings))
    },

    /**
     * Load settings from localStorage
     */
    loadSettings() {
      if (!process.client) return

      const stored = localStorage.getItem('app_settings')
      if (stored) {
        try {
          const settings = JSON.parse(stored)
          this.sidebarOpen = settings.sidebarOpen ?? true
          this.theme = settings.theme ?? 'light'
          this.locale = settings.locale ?? 'en'
          this.settings = settings.settings ?? this.settings
          
          this.applyTheme()
        } catch (error) {
          console.error('Failed to load app settings:', error)
        }
      }
    },

    /**
     * Reset to defaults
     */
    resetSettings() {
      this.sidebarOpen = true
      this.theme = 'light'
      this.locale = 'en'
      this.settings = {
        itemsPerPage: 10,
        enableNotifications: true,
        enableSounds: true,
      }
      this.persistSettings()
      this.applyTheme()
    },
  },
})

