/**
 * Order Store
 * Manages user orders and order history
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/shared/config/api'

export interface Order {
  id: number
  order_id: string
  plan_name: string
  amount: number
  currency: string
  points: number
  status: number // 0-待支付 1-已支付 2-已取消 3-已退款
  subscription_id?: string
  payment_intent_id?: string
  created_at: string
  updated_at: string
  period_start?: number
  period_end?: number
  card_number?: string
  extra_data?: any
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  total: number
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    total: 0,
  }),

  getters: {
    /**
     * Get orders by status
     */
    getOrdersByStatus: (state) => (status: number): Order[] => {
      return state.orders.filter(order => order.status === status)
    },

    /**
     * Get pending orders
     */
    pendingOrders: (state): Order[] => {
      return state.orders.filter(order => order.status === 0)
    },

    /**
     * Get completed orders
     */
    completedOrders: (state): Order[] => {
      return state.orders.filter(order => order.status === 1)
    },

    /**
     * Get cancelled orders
     */
    cancelledOrders: (state): Order[] => {
      return state.orders.filter(order => order.status === 2)
    },

    /**
     * Get refunded orders
     */
    refundedOrders: (state): Order[] => {
      return state.orders.filter(order => order.status === 3)
    },

    /**
     * Get order by ID
     */
    getOrderById: (state) => (id: number): Order | undefined => {
      return state.orders.find(order => order.id === id)
    },

    /**
     * Get order by order_id
     */
    getOrderByOrderId: (state) => (orderId: string): Order | undefined => {
      return state.orders.find(order => order.order_id === orderId)
    },

    /**
     * Get subscription orders
     */
    subscriptionOrders: (state): Order[] => {
      return state.orders.filter(order => order.subscription_id)
    },
  },

  actions: {
    /**
     * Fetch orders list
     */
    async fetchOrders(page: number = 1, size: number = 20, filters: any = {}) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.ORDERS.LIST, {
          page,
          size,
          ...filters,
        })
        
        if (response.code === 200) {
          this.orders = response.data || []
          this.total = response.total || 0
          return { success: true, total: this.total }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch orders' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch orders'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch order details
     */
    async fetchOrderDetail(orderId: number) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.ORDERS.DETAIL(orderId))
        
        if (response.code === 200) {
          this.currentOrder = response.data
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch order details' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch order details'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Create order
     */
    async createOrder(planId: string, priceId: string, promotionId?: string) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.ORDERS.CREATE, {
          plan_id: planId,
          price_id: priceId,
          promotion_id: promotionId,
        })
        
        if (response.code === 200) {
          this.currentOrder = response.data
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to create order' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to create order'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Cancel order
     */
    async cancelOrder(orderId: number) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.ORDERS.CANCEL(orderId))
        
        if (response.code === 200) {
          // Update order in list
          const orderIndex = this.orders.findIndex(order => order.id === orderId)
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = 2 // Cancelled
          }
          
          return { success: true, message: 'Order cancelled successfully' }
        }
        
        return { success: false, message: response.msg || 'Failed to cancel order' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to cancel order'
        return { success: false, message }
      }
    },

    /**
     * Request refund
     */
    async requestRefund(orderId: number, reason?: string) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.ORDERS.REFUND(orderId), {
          reason,
        })
        
        if (response.code === 200) {
          // Update order in list
          const orderIndex = this.orders.findIndex(order => order.id === orderId)
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = 3 // Refunded
          }
          
          return { success: true, message: 'Refund requested successfully' }
        }
        
        return { success: false, message: response.msg || 'Failed to request refund' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to request refund'
        return { success: false, message }
      }
    },

    /**
     * Get status text
     */
    getStatusText(status: number): string {
      const statusTexts: Record<number, string> = {
        0: '待支付',
        1: '已支付',
        2: '已取消',
        3: '已退款',
      }
      return statusTexts[status] || '未知'
    },

    /**
     * Get status type for UI
     */
    getStatusType(status: number): string {
      const statusTypes: Record<number, string> = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger',
      }
      return statusTypes[status] || 'info'
    },

    /**
     * Get payment method text
     */
    getPaymentMethodText(paymentIntentId?: string): string {
      if (!paymentIntentId) return '未知'
      // This could be enhanced to detect actual payment method
      return '信用卡'
    },

    /**
     * Format order amount
     */
    formatAmount(amount: number, currency: string = 'usd'): string {
      const symbol = currency === 'usd' ? '$' : '¥'
      return `${symbol}${(amount / 100).toFixed(2)}`
    },

    /**
     * Set current order
     */
    setCurrentOrder(order: Order | null) {
      this.currentOrder = order
    },

    /**
     * Clear current order
     */
    clearCurrentOrder() {
      this.currentOrder = null
    },
  },
})

