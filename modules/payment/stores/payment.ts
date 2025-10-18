/**
 * Payment Store
 * Manages payment plans, checkout sessions, and payment processing
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/shared/config/api'

export interface PaymentPlan {
  id: number
  plan_id: string
  price_id: string
  name: string
  description: string
  price: number
  currency: string
  points: number
  duration_days: number | null
  plan_type: number // 1-订阅 2-一次性购买
  features: string[]
  is_active: boolean
  is_popular?: boolean
}

export interface CheckoutSession {
  id: string
  url: string
  payment_intent_id?: string
  subscription_id?: string
}

interface PaymentState {
  plans: PaymentPlan[]
  loading: boolean
  selectedPlan: PaymentPlan | null
  checkoutSession: CheckoutSession | null
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    plans: [],
    loading: false,
    selectedPlan: null,
    checkoutSession: null,
  }),

  getters: {
    /**
     * Get active plans only
     */
    activePlans: (state): PaymentPlan[] => {
      return state.plans.filter(plan => plan.is_active)
    },

    /**
     * Get subscription plans
     */
    subscriptionPlans: (state): PaymentPlan[] => {
      return state.plans.filter(plan => plan.plan_type === 1 && plan.is_active)
    },

    /**
     * Get one-time purchase plans
     */
    oneTimePlans: (state): PaymentPlan[] => {
      return state.plans.filter(plan => plan.plan_type === 2 && plan.is_active)
    },

    /**
     * Get plan by ID
     */
    getPlanById: (state) => (id: number): PaymentPlan | undefined => {
      return state.plans.find(plan => plan.id === id)
    },

    /**
     * Get plan by plan_id
     */
    getPlanByPlanId: (state) => (planId: string): PaymentPlan | undefined => {
      return state.plans.find(plan => plan.plan_id === planId)
    },
  },

  actions: {
    /**
     * Fetch payment plans
     */
    async fetchPlans() {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.PAYMENT.PLANS)
        
        if (response.code === 200) {
          this.plans = response.data || []
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch plans' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch plans'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Create checkout session
     */
    async createCheckoutSession(planId: string, priceId: string, promotionId?: string) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.PAYMENT.CREATE_SESSION, {
          plan_id: planId,
          price_id: priceId,
          promotion_id: promotionId,
        })
        
        if (response.code === 200) {
          this.checkoutSession = response.data
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to create checkout session' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to create checkout session'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Get Stripe configuration
     */
    async getStripeConfig() {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.PAYMENT.STRIPE_CONFIG)
        
        if (response.code === 200) {
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to get Stripe config' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to get Stripe config'
        return { success: false, message }
      }
    },

    /**
     * Get PayPal configuration
     */
    async getPayPalConfig() {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.PAYMENT.PAYPAL_CONFIG)
        
        if (response.code === 200) {
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to get PayPal config' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to get PayPal config'
        return { success: false, message }
      }
    },

    /**
     * Set selected plan
     */
    setSelectedPlan(plan: PaymentPlan | null) {
      this.selectedPlan = plan
    },

    /**
     * Clear checkout session
     */
    clearCheckoutSession() {
      this.checkoutSession = null
    },

    /**
     * Initialize payment methods
     */
    async initializePayment() {
      // This will be called when the payment page loads
      // It can initialize Stripe Elements, PayPal buttons, etc.
      console.log('Initializing payment methods...')
    },
  },
})

