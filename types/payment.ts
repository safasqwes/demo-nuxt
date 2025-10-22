// 支付相关类型定义

export interface PaymentOrder {
  orderId: number
  orderNumber: string
  userId: number
  planId: number
  planName: string
  amount: number // 金额（分）
  currency: string
  points: number // 积分
  status: number // 0-待支付 1-已支付 2-已取消 3-已过期 4-已退款
  orderType: number // 1-订阅 2-一次性购买
  createdAt: string
  updatedAt: string
  payments?: PaymentDTO[]
}

export interface PaymentDTO {
  paymentId: number
  orderId: number
  userId: number
  paymentNumber: string
  paymentMethod: string
  amount: number
  currency: string
  status: number
  expiresAt?: string
  paidAt?: string
  createdAt: string
  // Stripe 相关字段
  stripeSessionId?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePaymentIntentId?: string
  // Web3 相关字段
  txHash?: string
  fromAddress?: string
  toAddress?: string
  tokenAmount?: string
  tokenCurrency?: string
  chainId?: number
  blockNumber?: number
  confirmations?: number
  priceTtl?: number
}

export interface CreateOrderRequest {
  planId: number
  description: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: PaymentOrder
  error?: string
}

export interface VerifyPaymentRequest {
  paymentId: number
  txHash: string
  fromAddress: string
}

export interface VerifyPaymentResponse {
  success: boolean
  confirmed: boolean
  confirmations: number
  requiredConfirmations: number
  error?: string
}

export interface PaymentProduct {
  id: string
  type: 'chapter' | 'subscription' | 'coins'
  name: string
  description: string
  fiatPrice: number
  currency: string
  tokenAmount: string
  priceTTL: number
  points: number
}

// Backend plan response type
export interface PlanResponse {
  planId: number
  name: string
  description: string
  price: number
  points: number
}

// 支持的代币配置
export interface TokenConfig {
  symbol: string
  name: string
  address: string
  decimals: number
  chainId: number
  isNative: boolean
}

// 链上交易状态
export interface TransactionStatus {
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  blockNumber?: number
  gasUsed?: string
  gasPrice?: string
}

// 价格信息
export interface PriceInfo {
  currency: string
  fiatAmount: number
  tokenAmount: string
  priceTTL: number
  exchangeRate: number
}
