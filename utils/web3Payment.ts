import { ethers } from 'ethers'
import type { TokenConfig } from '~/types/payment'

// 支持的代币合约地址 (Polygon网络)
const TOKEN_ADDRESSES = {
  MATIC: '0x0000000000000000000000000000000000000000', // MATIC 使用零地址
  USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon USDT
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon USDC
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'  // Polygon DAI
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
  orderId?: string
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
        const balance = await contract.balanceOf(address)
        const decimals = await contract.decimals()
        
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
      if (!this.signer) {
        return { success: false, error: 'Wallet not connected' }
      }

      const recipientAddress = payment.recipientAddress
      const amount = payment.amount

      if (payment.currency === 'MATIC' || payment.currency === 'ETH') {
        // Native token 支付
        const tx = await this.signer.sendTransaction({
          to: recipientAddress,
          value: ethers.parseEther(amount)
        })

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
        const decimals = await contract.decimals()
        const amountWei = ethers.parseUnits(amount, decimals)

        // 执行转账
        const tx = await contract.transfer(recipientAddress, amountWei)

        return { 
          success: true, 
          transactionHash: tx.hash 
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      return { 
        success: false, 
        error: error.message || 'Payment failed' 
      }
    }
  }

  // 估算Gas费用
  async estimateGasFee(currency: string, amount: string, recipientAddress: string): Promise<{ gasFee: string; error?: string }> {
    try {
      if (!this.provider || !this.signer) {
        return { gasFee: '0', error: 'Wallet not connected' }
      }

      if (currency === 'MATIC' || currency === 'ETH') {
        const gasEstimate = await this.provider.estimateGas({
          to: recipientAddress,
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
        const decimals = await contract.decimals()
        const amountWei = ethers.parseUnits(amount, decimals)

        const gasEstimate = await contract.transfer.estimateGas(recipientAddress, amountWei)
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

  // 切换网络 (如果需要)
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
export type { PaymentRequest, PaymentResult }
