import type { CreateStripeCheckoutRequest, CreateStripeCheckoutResponse } from '~/types/payment'
import { http } from './http'

export class StripeService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '/api/stripe'
  }

  /**
   * 创建 Stripe Checkout Session
   * @param request - 创建请求参数
   * @returns Checkout Session 信息
   */
  async createCheckoutSession(request: CreateStripeCheckoutRequest): Promise<CreateStripeCheckoutResponse> {
    try {
      const response = await http.post(`${this.baseUrl}/create-checkout-session`, request)
      return {
        success: true,
        sessionId: response.data.sessionId,
        sessionUrl: response.data.sessionUrl
      }
    } catch (error: any) {
      console.error('Create Stripe checkout session error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create checkout session'
      }
    }
  }

  /**
   * 跳转到 Stripe Checkout 页面
   * @param sessionUrl - Stripe Checkout Session URL
   */
  redirectToCheckout(sessionUrl: string) {
    window.location.href = sessionUrl
  }
}

// 创建单例实例
let _stripeService: StripeService | null = null

export const getStripeService = (): StripeService => {
  if (!_stripeService) {
    _stripeService = new StripeService('/api/stripe')
  }
  return _stripeService
}

// 导出代理对象供外部使用
export const stripeService = new Proxy({} as any, {
  get(target, prop) {
    const service = getStripeService()
    if (typeof service[prop as keyof StripeService] === 'function') {
      return service[prop as keyof StripeService].bind(service)
    }
    return service[prop as keyof StripeService]
  }
})
