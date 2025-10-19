// 支付相关类型定义

export interface PaymentOrder {
  orderId: string
  recipientAddress: string
  currency: string
  fiatAmount: number
  tokenAmount: string
  priceTTL: number // 价格锁定时间戳
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  createdAt: string
  expiresAt: string
  description: string
  userId?: string
}

export interface CreateOrderRequest {
  currency: string
  fiatAmount: number
  description: string
  productType: 'chapter' | 'subscription' | 'coins'
  productId?: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: PaymentOrder
  error?: string
}

export interface VerifyPaymentRequest {
  orderId: string
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
