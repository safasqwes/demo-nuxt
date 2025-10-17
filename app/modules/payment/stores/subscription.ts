import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/shared/config/api'
import { http } from '~/shared/utils/http'

interface Subscription {
  id: string
  user_id: number
  plan_id: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at: string | null
  created_at: string
  updated_at: string
  plan: {
    id: string
    name: string
    price: number
    currency: string
    interval: 'month' | 'year'
  }
}

interface SubscriptionState {
  subscriptions: Subscription[]
  currentSubscription: Subscription | null
  loading: boolean
  error: string | null
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    subscriptions: [],
    currentSubscription: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasActiveSubscription: (state) => {
      return state.currentSubscription?.status === 'active'
    },

    isSubscriptionExpiring: (state) => {
      if (!state.currentSubscription) return false
      const endDate = new Date(state.currentSubscription.current_period_end)
      const now = new Date()
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    },

    subscriptionDaysLeft: (state) => {
      if (!state.currentSubscription) return 0
      const endDate = new Date(state.currentSubscription.current_period_end)
      const now = new Date()
      return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    },
  },

  actions: {
    /**
     * 获取用户订阅列表
     */
    async fetchSubscriptions() {
      this.loading = true
      this.error = null
      try {
        const response = await http.get(API_ENDPOINTS.PAYMENT.SUBSCRIPTIONS)
        if (response.code === 200) {
          this.subscriptions = response.data || []
          // 设置当前活跃订阅
          this.currentSubscription = this.subscriptions.find(sub => sub.status === 'active') || null
          return { success: true }
        }
        this.error = response.msg || 'Failed to fetch subscriptions'
        return { success: false, message: this.error }
      } catch (err: any) {
        this.error = err.response?.data?.msg || err.message || 'Failed to fetch subscriptions'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取当前订阅详情
     */
    async fetchCurrentSubscription() {
      this.loading = true
      try {
        const response = await http.get(`${API_ENDPOINTS.PAYMENT.SUBSCRIPTIONS}/current`)
        if (response.code === 200) {
          this.currentSubscription = response.data
          return { success: true }
        }
        return { success: false, message: response.msg || 'Failed to fetch current subscription' }
      } catch (err: any) {
        const message = err.response?.data?.msg || err.message || 'Failed to fetch current subscription'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * 取消订阅
     */
    async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
      this.loading = true
      try {
        const response = await http.post(API_ENDPOINTS.PAYMENT.CANCEL_SUBSCRIPTION(subscriptionId), {
          cancel_at_period_end: cancelAtPeriodEnd
        })
        if (response.code === 200) {
          // 更新本地状态
          const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
          if (subscription) {
            subscription.cancel_at_period_end = cancelAtPeriodEnd
            if (!cancelAtPeriodEnd) {
              subscription.status = 'cancelled'
              subscription.cancelled_at = new Date().toISOString()
            }
          }
          if (this.currentSubscription?.id === subscriptionId) {
            this.currentSubscription = { ...this.currentSubscription, ...subscription }
          }
          return { success: true }
        }
        return { success: false, message: response.msg || 'Failed to cancel subscription' }
      } catch (err: any) {
        const message = err.response?.data?.msg || err.message || 'Failed to cancel subscription'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * 恢复订阅
     */
    async resumeSubscription(subscriptionId: string) {
      this.loading = true
      try {
        const response = await http.post(`${API_ENDPOINTS.PAYMENT.SUBSCRIPTIONS}/${subscriptionId}/resume`)
        if (response.code === 200) {
          // 更新本地状态
          const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
          if (subscription) {
            subscription.cancel_at_period_end = false
            subscription.status = 'active'
            subscription.cancelled_at = null
          }
          if (this.currentSubscription?.id === subscriptionId) {
            this.currentSubscription = { ...this.currentSubscription, ...subscription }
          }
          return { success: true }
        }
        return { success: false, message: response.msg || 'Failed to resume subscription' }
      } catch (err: any) {
        const message = err.response?.data?.msg || err.message || 'Failed to resume subscription'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * 更新订阅计划
     */
    async updateSubscription(subscriptionId: string, newPlanId: string) {
      this.loading = true
      try {
        const response = await http.post(`${API_ENDPOINTS.PAYMENT.SUBSCRIPTIONS}/${subscriptionId}/update`, {
          plan_id: newPlanId
        })
        if (response.code === 200) {
          // 重新获取订阅列表
          await this.fetchSubscriptions()
          return { success: true }
        }
        return { success: false, message: response.msg || 'Failed to update subscription' }
      } catch (err: any) {
        const message = err.response?.data?.msg || err.message || 'Failed to update subscription'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取订阅使用情况
     */
    async fetchSubscriptionUsage(subscriptionId: string) {
      try {
        const response = await http.get(`${API_ENDPOINTS.PAYMENT.SUBSCRIPTIONS}/${subscriptionId}/usage`)
        if (response.code === 200) {
          return { success: true, data: response.data }
        }
        return { success: false, message: response.msg || 'Failed to fetch subscription usage' }
      } catch (err: any) {
        const message = err.response?.data?.msg || err.message || 'Failed to fetch subscription usage'
        return { success: false, message }
      }
    },

    /**
     * 清除错误状态
     */
    clearError() {
      this.error = null
    },

    /**
     * 重置状态
     */
    reset() {
      this.subscriptions = []
      this.currentSubscription = null
      this.loading = false
      this.error = null
    },
  },
})
