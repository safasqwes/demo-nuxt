import type {
  CreateBinancePayOrderRequest,
  CreateBinancePayOrderResponse,
  BinancePayOrderStatus
} from '~/types/payment'
import { http } from './http'

/**
 * Binance Pay 支付服务
 */
export class BinancePayService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '/api/binance-pay'
  }

  /**
   * 创建 Binance Pay 订单
   * @param request 创建订单请求
   * @returns 订单信息（包含二维码链接）
   */
  async createOrder(request: CreateBinancePayOrderRequest): Promise<CreateBinancePayOrderResponse> {
    try {
      const response = await http.post(`${this.baseUrl}/create-order`, request)
      return {
        success: true,
        prepayId: response.data.prepayId,
        qrcodeLink: response.data.qrcodeLink,
        qrContent: response.data.qrContent,
        checkoutUrl: response.data.checkoutUrl,
        deeplink: response.data.deeplink,
        universalUrl: response.data.universalUrl,
        expireTime: response.data.expireTime
      }
    } catch (error: any) {
      console.error('Create Binance Pay order error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create Binance Pay order'
      }
    }
  }

  /**
   * 查询 Binance Pay 订单状态
   * @param prepayId Binance Pay 订单 ID
   * @returns 订单状态
   */
  async queryOrderStatus(prepayId: string): Promise<{ success: boolean; status?: BinancePayOrderStatus; error?: string }> {
    try {
      const response = await http.get(`${this.baseUrl}/order-status/${prepayId}`)
      return {
        success: true,
        status: response.data.status
      }
    } catch (error: any) {
      console.error('Query Binance Pay order status error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to query order status'
      }
    }
  }

  /**
   * 打开二维码支付页面（新窗口）
   * @param qrcodeLink 二维码链接
   */
  openQRCodePage(qrcodeLink: string) {
    window.open(qrcodeLink, '_blank', 'width=400,height=600')
  }

  /**
   * 生成二维码（使用第三方库或 API）
   * @param qrContent 二维码内容
   * @returns 二维码 Data URL
   */
  async generateQRCode(qrContent: string): Promise<string> {
    // 使用 QRCode.js 或其他库生成二维码
    // 这里返回一个示例 Data URL
    // 实际项目中需要安装 qrcode 库: npm install qrcode
    try {
      // 动态导入 qrcode 库（如果已安装）
      const QRCode = await import('qrcode')
      return await QRCode.toDataURL(qrContent)
    } catch (error) {
      console.error('Generate QR code error:', error)
      // 如果没有安装 qrcode 库，返回在线 QR Code API
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}`
    }
  }
}

// 创建单例实例
let _binancePayService: BinancePayService | null = null

export const getBinancePayService = (): BinancePayService => {
  if (!_binancePayService) {
    _binancePayService = new BinancePayService('/api/binance-pay')
  }
  return _binancePayService
}

// 导出代理对象供外部使用
export const binancePayService = new Proxy({} as any, {
  get(target, prop) {
    const service = getBinancePayService()
    if (typeof service[prop as keyof BinancePayService] === 'function') {
      return service[prop as keyof BinancePayService].bind(service)
    }
    return service[prop as keyof BinancePayService]
  }
})
