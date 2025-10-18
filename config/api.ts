/**
 * API Configuration
 * Centralized API endpoint management for the three modules
 */

// API Base URLs
const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// Payment API Keys
const STRIPE_PUBLIC_KEY = process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
const PAYPAL_CLIENT_ID = process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID || ''

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY: '/api/auth/verify',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },

  // User Module - Novels
  NOVELS: {
    LIST: '/api/novels',
    DETAIL: (id: number) => `/api/novels/${id}`,
    CHAPTERS: (id: number) => `/api/novels/${id}/chapters`,
    CHAPTER: (novelId: number, chapterId: number) => `/api/novels/${novelId}/chapters/${chapterId}`,
    SEARCH: '/api/novels/search',
    CATEGORIES: '/api/novels/categories'
  },

  // User Module - Bookshelf & Reading
  USER: {
    BOOKSHELF: '/api/user/bookshelf',
    ADD_TO_BOOKSHELF: (novelId: number) => `/api/user/bookshelf/${novelId}`,
    REMOVE_FROM_BOOKSHELF: (novelId: number) => `/api/user/bookshelf/${novelId}`,
    HISTORY: '/api/user/history',
    READING_PROGRESS: '/api/user/reading-progress',
    UNLOCK_CHAPTER: '/api/user/unlock-chapter',
    POINTS: '/api/user/points',
    POINTS_DETAIL: '/api/user/points/detail',
    POINTS_CLAIM: '/api/user/points/claim',
    SUBSCRIPTION: '/api/user/subscription'
  },

  // Payment Module
  PAYMENT: {
    PLANS: '/api/payment/plans',
    PLAN_DETAIL: (id: string) => `/api/payment/plans/${id}`,
    CREATE_SESSION: '/api/payment/create-session',
    WEBHOOK: '/api/payment/webhook',
    STRIPE_CONFIG: '/api/payment/stripe/config',
    PAYPAL_CONFIG: '/api/payment/paypal/config',
    ORDERS: '/api/payment/orders',
    ORDER_DETAIL: (orderId: string) => `/api/payment/orders/${orderId}`,
    SUBSCRIPTIONS: '/api/payment/subscriptions',
    CANCEL_SUBSCRIPTION: (subId: string) => `/api/payment/subscriptions/${subId}/cancel`,
  },

  // Orders
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id: number) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    CANCEL: (id: number) => `/api/orders/${id}/cancel`,
    REFUND: (id: number) => `/api/orders/${id}/refund`
  },

  // Subscription
  SUBSCRIPTION: {
    CANCEL: (id: string) => `/api/subscription/${id}/cancel`,
    PAUSE: (id: string) => `/api/subscription/${id}/pause`,
    RESUME: (id: string) => `/api/subscription/${id}/resume`,
    UPDATE_PAYMENT_METHOD: (id: string) => `/api/subscription/${id}/payment-method`
  },

  // Promotions
  PROMOTIONS: {
    LIST: '/api/promotions',
    DETAIL: (id: number) => `/api/promotions/${id}`,
    USE: (id: number) => `/api/promotions/${id}/use`
  },

  // Admin Module
  ADMIN: {
    LOGIN: '/api/admin/login',
    PROFILE: '/api/admin/profile',
    DASHBOARD: '/api/admin/dashboard',
    
    // User Management
    USERS: '/api/admin/users',
    USER_DETAIL: (id: number) => `/api/admin/users/${id}`,
    USER_UPDATE: (id: number) => `/api/admin/users/${id}`,
    USER_DISABLE: (id: number) => `/api/admin/users/${id}/disable`,
    USER_ENABLE: (id: number) => `/api/admin/users/${id}/enable`,
    
    // Novel Management
    NOVELS: '/api/admin/novels',
    NOVEL_CREATE: '/api/admin/novels',
    NOVEL_UPDATE: (id: number) => `/api/admin/novels/${id}`,
    NOVEL_DELETE: (id: number) => `/api/admin/novels/${id}`,
    NOVEL_CHAPTERS: (id: number) => `/api/admin/novels/${id}/chapters`,
    CHAPTER_CREATE: '/api/admin/chapters',
    CHAPTER_UPDATE: (id: number) => `/api/admin/chapters/${id}`,
    CHAPTER_DELETE: (id: number) => `/api/admin/chapters/${id}`,
    
    // Order Management
    ORDERS: '/api/admin/orders',
    ORDER_DETAIL: (id: number) => `/api/admin/orders/${id}`,
    ORDER_REFUND: (id: number) => `/api/admin/orders/${id}/refund`,
    
    // Plan Management
    PLANS: '/api/admin/plans',
    PLAN_CREATE: '/api/admin/plans',
    PLAN_UPDATE: (id: number) => `/api/admin/plans/${id}`,
    PLAN_DELETE: (id: number) => `/api/admin/plans/${id}`,
    
    // Banner Management
    BANNERS: '/api/admin/banners',
    BANNER_CREATE: '/api/admin/banners',
    BANNER_UPDATE: (id: number) => `/api/admin/banners/${id}`,
    BANNER_DELETE: (id: number) => `/api/admin/banners/${id}`,
    
    // Analytics
    ANALYTICS: {
      REVENUE: '/api/admin/analytics/revenue',
      USERS: '/api/admin/analytics/users',
      NOVELS: '/api/admin/analytics/novels',
      ORDERS: '/api/admin/analytics/orders',
      DASHBOARD: '/api/admin/analytics/dashboard'
    }
  }
}

// Payment Configuration
export const PAYMENT_CONFIG = {
  STRIPE: {
    PUBLIC_KEY: STRIPE_PUBLIC_KEY,
    CURRENCY: 'usd',
    COUNTRY: 'US'
  },
  PAYPAL: {
    CLIENT_ID: PAYPAL_CLIENT_ID,
    CURRENCY: 'USD',
    INTENT: 'capture'
  }
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

// Helper function to get API headers
export const getApiHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Helper function to get auth headers
export const getAuthHeaders = (token: string): Record<string, string> => {
  return {
    ...getApiHeaders(),
    'Authorization': `Bearer ${token}`
  }
}

export default {
  brand_id: 1,
  brand_name: 'NovelHub',
  apiConfig: {
    isHttpNeedFp: false,
    isHttpNeedToken: true
  }
}

