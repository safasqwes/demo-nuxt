import type { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  VerifyPaymentRequest, 
  VerifyPaymentResponse,
  PaymentOrder,
  PriceInfo,
  TokenConfig
} from '~/types/payment'
import { http } from './http'

// 支持的代币配置
const SUPPORTED_TOKENS: TokenConfig[] = [
  {
    symbol: 'MATIC',
    name: 'Polygon',
    address: '0x0000000000000000000000000000000000000000', // Native token
    decimals: 18,
    chainId: 137,
    isNative: true
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon USDT
    decimals: 6,
    chainId: 137,
    isNative: false
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon USDC
    decimals: 6,
    chainId: 137,
    isNative: false
  }
]

export class PaymentService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '/api/web3-payment'
  }

  // 获取支持的产品列表
  async getProducts(): Promise<{ success: boolean; products?: any[]; error?: string }> {
    try {
      const response = await http.get(`${this.baseUrl}/plans`)
      return { success: true, products: response.data }
    } catch (error: any) {
      console.error('Get products error:', error)
      return { success: false, error: error.message || 'Failed to fetch products' }
    }
  }

  // 获取代币价格信息
  async getTokenPrice(currency: string, fiatAmount: number): Promise<{ success: boolean; priceInfo?: PriceInfo; error?: string }> {
    try {
      const response = await http.post(`${this.baseUrl}/price`, {
        currency,
        fiatAmount
      })
      return { success: true, priceInfo: response.data.priceInfo }
    } catch (error: any) {
      console.error('Get token price error:', error)
      return { success: false, error: error.message || 'Failed to get token price' }
    }
  }

  // 创建支付订单
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await http.post(`${this.baseUrl}/orders`, request)
      return { success: true, order: response.data.order }
    } catch (error: any) {
      console.error('Create order error:', error)
      return { success: false, error: error.message || 'Failed to create order' }
    }
  }

  // 验证支付
  async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await http.post(`${this.baseUrl}/verify`, request)
      return { success: true, ...response.data }
    } catch (error: any) {
      console.error('Verify payment error:', error)
      return { 
        success: false, 
        confirmed: false,
        confirmations: 0,
        requiredConfirmations: 0,
        error: error.message || 'Failed to verify payment' 
      }
    }
  }

  // 获取订单状态
  async getOrderStatus(orderId: number): Promise<{ success: boolean; order?: PaymentOrder; error?: string }> {
    try {
      const response = await http.get(`${this.baseUrl}/orders/${orderId}`)
      return { success: true, order: response.data.order }
    } catch (error: any) {
      console.error('Get order status error:', error)
      return { success: false, error: error.message || 'Failed to get order status' }
    }
  }

  // 获取用户订单历史
  async getOrderHistory(): Promise<{ success: boolean; orders?: PaymentOrder[]; error?: string }> {
    try {
      const response = await http.get(`${this.baseUrl}/orders`)
      return { success: true, orders: response.data }
    } catch (error: any) {
      console.error('Get order history error:', error)
      return { success: false, error: error.message || 'Failed to get order history' }
    }
  }

  // 获取支持的代币列表
  getSupportedTokens(): TokenConfig[] {
    return SUPPORTED_TOKENS
  }

  // 根据代币符号获取配置
  getTokenConfig(symbol: string): TokenConfig | undefined {
    return SUPPORTED_TOKENS.find(token => token.symbol === symbol)
  }
}

// 创建单例实例的工厂函数
let _paymentService: PaymentService | null = null

export const getPaymentService = (): PaymentService => {
  if (!_paymentService) {
    // 使用默认的 baseUrl，避免在模块顶层调用 useRuntimeConfig
    // 注意：这里使用 /api/web3-payment 作为默认值，因为这是 Web3 支付的具体端点
    _paymentService = new PaymentService('/api/web3-payment')
  }
  return _paymentService
}

// 为了向后兼容，导出一个代理对象
export const paymentService = new Proxy({} as any, {
  get(target, prop) {
    const service = getPaymentService()
    if (typeof service[prop as keyof PaymentService] === 'function') {
      return service[prop as keyof PaymentService].bind(service)
    }
    return service[prop as keyof PaymentService]
  }
})
