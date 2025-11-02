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
  planType?: number // 套餐类型 (1=订阅, 0=一次性)
  status?: number // 套餐状态 (1=可用, 0=不可用)
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  duration?: string // 持续时间
  features?: string[] // 特色功能列表
}

// Backend plan response type
export interface PlanResponse {
  planId: number
  name: string
  description: string
  price: number
  pointsAmount: number
  planType?: number // 套餐类型 (1=订阅, 0=一次性)
  status?: number // 套餐状态 (1=可用, 0=不可用)
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  duration?: string // 持续时间
  features?: string[] // 特色功能列表
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

// 创建Web3支付请求
export interface CreateWeb3PaymentRequest {
  orderId: number
  currency: string
  tokenAmount: string
  chainId: number
}

// 创建Web3支付响应
export interface CreateWeb3PaymentResponse {
  success: boolean
  paymentId?: number
  paymentNumber?: string
  recipientAddress?: string
  tokenAmount?: string
  tokenCurrency?: string
  expiresAt?: string
  priceTTL?: number
  error?: string
}

// 支付信息
export interface PaymentInfo {
  paymentId: number
  orderId: number
  orderNumber: string
  planName: string
  fiatAmount: number
  currency: string
  tokenAmount: string
  tokenCurrency: string
  recipientAddress: string
  chainId: number
  status: number
  expiresAt: string
  priceTTL: number
}

// 支付状态
export interface PaymentStatus {
  paymentId: number
  status: number
  txHash?: string
  confirmations: number
  requiredConfirmations: number
}

// Stripe 创建 Checkout Session 请求
export interface CreateStripeCheckoutRequest {
  planId: number
  successUrl?: string
  cancelUrl?: string
}

// Stripe 创建 Checkout Session 响应
export interface CreateStripeCheckoutResponse {
  success: boolean
  sessionId?: string
  sessionUrl?: string
  error?: string
}

// Binance Pay 创建订单请求
export interface CreateBinancePayOrderRequest {
  planId: number
  returnUrl?: string
  cancelUrl?: string
}

// Binance Pay 创建订单响应
export interface CreateBinancePayOrderResponse {
  success: boolean
  prepayId?: string
  qrcodeLink?: string
  qrContent?: string
  checkoutUrl?: string
  deeplink?: string
  universalUrl?: string
  expireTime?: number
  error?: string
}

// Binance Pay 订单状态
export interface BinancePayOrderStatus {
  status: 'INITIAL' | 'PENDING' | 'PAID' | 'CANCELED' | 'ERROR' | 'REFUNDING' | 'REFUNDED' | 'EXPIRED'
  transactionId?: string
  transactTime?: number
}