import { ethers } from 'ethers'
import type { TokenConfig } from '~/types/payment'

// 支持的代币合约地址 (Polygon Mumbai Testnet)
const TOKEN_ADDRESSES = {
  MATIC: '0x0000000000000000000000000000000000000000', // MATIC 使用零地址
  USDT: '0xBD21A10F619BE90d6066c941b04e340BbF10D416', // Mumbai USDT
  USDC: '0x0FA8781a83E46826621b3BC0EaA8B9B3875C2eB0', // Mumbai USDC
  DAI: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'   // Mumbai DAI
}

// ERC20 ABI (简化版，只包含转账功能)
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
]

export interface PaymentRequest {
  amount: string
  currency: string
  recipientAddress: string
  description?: string
  orderId?: number
}

export interface PaymentResult {
  success: boolean
  transactionHash?: string
  error?: string
}

export class Web3PaymentService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  // 连接钱包
  async connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask or Web3 wallet not found' }
      }

      // 请求账户访问
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length === 0) {
        return { success: false, error: 'No accounts found' }
      }

      // 创建provider和signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // 自动切换到Polygon Mumbai测试网络
      const networkSwitch = await this.switchToPolygonMumbai()
      if (!networkSwitch.success) {
        console.warn('Failed to switch to Polygon Mumbai:', networkSwitch.error)
        // 不阻止连接，只是警告
      }

      return { 
        success: true, 
        address: accounts[0] 
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to connect wallet' 
      }
    }
  }

  // 检查钱包连接状态
  async checkConnection(): Promise<{ connected: boolean; address?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { connected: false }
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      
      if (accounts.length > 0) {
        if (!this.provider) {
          this.provider = new ethers.BrowserProvider(window.ethereum)
          this.signer = await this.provider.getSigner()
        }
        return { connected: true, address: accounts[0] }
      }

      return { connected: false }
    } catch (error) {
      console.error('Connection check error:', error)
      return { connected: false }
    }
  }

  // 获取代币余额
  async getTokenBalance(currency: string, address: string): Promise<{ balance: string; error?: string }> {
    try {
      if (!this.provider) {
        return { balance: '0', error: 'Wallet not connected' }
      }

      if (currency === 'MATIC' || currency === 'ETH') {
        const balance = await this.provider.getBalance(address)
        return { balance: ethers.formatEther(balance) }
      } else {
        const tokenAddress = TOKEN_ADDRESSES[currency as keyof typeof TOKEN_ADDRESSES]
        if (!tokenAddress) {
          return { balance: '0', error: 'Unsupported currency' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
        const balance = await (contract as any).balanceOf(address)
        const decimals = await (contract as any).decimals()
        
        return { balance: ethers.formatUnits(balance, decimals) }
      }
    } catch (error: any) {
      console.error('Balance check error:', error)
      return { balance: '0', error: error.message || 'Failed to get balance' }
    }
  }

  // 处理支付
  async processPayment(payment: PaymentRequest): Promise<PaymentResult> {
    try {
      console.log('Processing payment:', payment)
      
      if (!this.signer) {
        console.error('Wallet not connected - no signer available')
        return { success: false, error: 'Wallet not connected' }
      }

      const recipientAddress = payment.recipientAddress
      const amount = payment.amount
      
      // 使用ethers.js正确格式化地址，确保校验和正确
      const formattedAddress = ethers.getAddress(recipientAddress)
      
      console.log('Payment details:', { 
        originalAddress: recipientAddress, 
        formattedAddress, 
        amount, 
        currency: payment.currency 
      })

      // 检查余额是否足够
      const balanceCheck = await this.checkBalance(payment.currency, amount)
      if (!balanceCheck.sufficient) {
        return { 
          success: false, 
          error: `Insufficient ${payment.currency} balance. You have ${balanceCheck.balance} ${payment.currency}, but need ${amount} ${payment.currency} plus gas fees.` 
        }
      }

      if (payment.currency === 'MATIC' || payment.currency === 'ETH') {
        // Native token 支付
        console.log('Sending native token transaction...')
        const tx = await this.signer.sendTransaction({
          to: formattedAddress,
          value: ethers.parseEther(amount)
        })
        console.log('Transaction sent:', tx.hash)

        return { 
          success: true, 
          transactionHash: tx.hash 
        }
      } else {
        // ERC20 代币支付
        const tokenAddress = TOKEN_ADDRESSES[payment.currency as keyof typeof TOKEN_ADDRESSES]
        if (!tokenAddress) {
          return { success: false, error: 'Unsupported currency' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)
        
        // 获取代币精度
        const decimals = await (contract as any).decimals()
        const amountWei = ethers.parseUnits(amount, decimals)

        // 执行转账
        const tx = await (contract as any).transfer(formattedAddress, amountWei)

        return { 
          success: true, 
          transactionHash: tx.hash 
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      
      // 处理特定错误类型
      if (error.code === 'INSUFFICIENT_FUNDS') {
        return { 
          success: false, 
          error: 'Insufficient funds. Please check your wallet balance and ensure you have enough tokens to cover the transaction amount and gas fees.' 
        }
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return { 
          success: false, 
          error: 'Unable to estimate gas. The transaction may fail. Please check the recipient address and try again.' 
        }
      } else if (error.code === 'ACTION_REJECTED') {
        return { 
          success: false, 
          error: 'Transaction was rejected by user.' 
        }
      } else if (error.message && error.message.includes('insufficient funds')) {
        return { 
          success: false, 
          error: 'Insufficient funds. Please check your wallet balance.' 
        }
      }
      
      return { 
        success: false, 
        error: error.message || 'Payment failed' 
      }
    }
  }

  // 获取钱包余额
  async getBalance(currency: string, address: string): Promise<{ balance: string; error?: string }> {
    try {
      if (!this.provider) {
        return { balance: '0', error: 'Provider not available' }
      }

      if (currency === 'MATIC' || currency === 'ETH') {
        const balance = await this.provider.getBalance(address)
        return { balance: ethers.formatEther(balance) }
      } else {
        // ERC20 代币余额
        const tokenAddress = TOKEN_ADDRESSES[currency as keyof typeof TOKEN_ADDRESSES]
        if (!tokenAddress) {
          return { balance: '0', error: 'Unsupported currency' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
        const balance = await (contract as any).balanceOf(address)
        const decimals = await (contract as any).decimals()
        
        return { balance: ethers.formatUnits(balance, decimals) }
      }
    } catch (error: any) {
      console.error('Balance check error:', error)
      return { balance: '0', error: error.message || 'Failed to get balance' }
    }
  }

  // 检查余额是否足够支付
  async checkBalance(currency: string, amount: string): Promise<{ sufficient: boolean; balance: string; error?: string }> {
    try {
      if (!this.signer) {
        return { sufficient: false, balance: '0', error: 'Wallet not connected' }
      }

      const address = await this.signer.getAddress()
      const balanceResult = await this.getBalance(currency, address)
      
      if (balanceResult.error) {
        return { sufficient: false, balance: '0', error: balanceResult.error }
      }

      const balance = parseFloat(balanceResult.balance)
      const requiredAmount = parseFloat(amount)
      
      // 对于native token，需要额外考虑gas费用
      if (currency === 'MATIC' || currency === 'ETH') {
        // 估算gas费用
        const gasEstimate = await this.estimateGasFee(currency, amount, address)
        const gasFee = parseFloat(gasEstimate.gasFee || '0')
        const totalRequired = requiredAmount + gasFee
        
        return {
          sufficient: balance >= totalRequired,
          balance: balanceResult.balance
        }
      } else {
        // 对于ERC20代币，只需要检查代币余额
        return {
          sufficient: balance >= requiredAmount,
          balance: balanceResult.balance
        }
      }
    } catch (error: any) {
      console.error('Balance check error:', error)
      return { sufficient: false, balance: '0', error: error.message || 'Failed to check balance' }
    }
  }

  // 估算Gas费用
  async estimateGasFee(currency: string, amount: string, recipientAddress: string): Promise<{ gasFee: string; error?: string }> {
    try {
      if (!this.provider || !this.signer) {
        return { gasFee: '0', error: 'Wallet not connected' }
      }

      // 使用ethers.js正确格式化地址，确保校验和正确
      const formattedAddress = ethers.getAddress(recipientAddress)

      if (currency === 'MATIC' || currency === 'ETH') {
        const gasEstimate = await this.provider.estimateGas({
          to: formattedAddress,
          value: ethers.parseEther(amount)
        })
        
        const gasPrice = await this.provider.getFeeData()
        const gasFee = gasEstimate * (gasPrice.gasPrice || 0n)
        
        return { gasFee: ethers.formatEther(gasFee) }
      } else {
        // ERC20 代币的Gas估算
        const tokenAddress = TOKEN_ADDRESSES[currency as keyof typeof TOKEN_ADDRESSES]
        if (!tokenAddress) {
          return { gasFee: '0', error: 'Unsupported currency' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)
        const decimals = await (contract as any).decimals()
        const amountWei = ethers.parseUnits(amount, decimals)

        const gasEstimate = await (contract as any).transfer.estimateGas(formattedAddress, amountWei)
        const gasPrice = await this.provider.getFeeData()
        const gasFee = gasEstimate * (gasPrice.gasPrice || 0n)
        
        return { gasFee: ethers.formatEther(gasFee) }
      }
    } catch (error: any) {
      console.error('Gas estimation error:', error)
      return { gasFee: '0', error: error.message || 'Failed to estimate gas' }
    }
  }

  // 获取网络信息
  async getNetworkInfo(): Promise<{ chainId: number; name: string; error?: string }> {
    try {
      if (!this.provider) {
        return { chainId: 0, name: 'Unknown', error: 'Wallet not connected' }
      }

      const network = await this.provider.getNetwork()
      return { 
        chainId: Number(network.chainId), 
        name: network.name || 'Unknown' 
      }
    } catch (error: any) {
      console.error('Network info error:', error)
      return { chainId: 0, name: 'Unknown', error: error.message || 'Failed to get network info' }
    }
  }

  // 切换到Polygon Mumbai测试网络
  async switchToPolygonMumbai(): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask not found' }
      }

      // 尝试切换到Polygon Mumbai测试网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }] // Polygon Mumbai Testnet
      })

      return { success: true }
    } catch (error: any) {
      console.error('Network switch error:', error)
      
      // 如果网络不存在，添加网络
      if (error.code === 4902) {
        return await this.addPolygonMumbaiNetwork()
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to switch network' 
      }
    }
  }

  // 添加Polygon Mumbai测试网络
  async addPolygonMumbaiNetwork(): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask not found' }
      }
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13881',
          chainName: 'Polygon Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com']
        }]
      })

      return { success: true }
    } catch (error: any) {
      console.error('Add network error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to add network' 
      }
    }
  }

  // 切换网络 (通用方法)
  async switchNetwork(chainId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask not found' }
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })

      return { success: true }
    } catch (error: any) {
      console.error('Network switch error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to switch network' 
      }
    }
  }
}

// 创建单例实例
export const web3PaymentService = new Web3PaymentService()

// 导出类型
export type { PaymentRequest as Web3PaymentRequest, PaymentResult as Web3PaymentResult }
