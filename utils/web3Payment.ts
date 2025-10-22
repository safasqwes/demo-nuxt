import { ethers } from 'ethers'
import type { TokenConfig } from '~/types/payment'

// 网络配置
const NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Ethereum Sepolia Testnet',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    faucetUrl: 'https://sepoliafaucet.com/'
  },
  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
    faucetUrl: 'https://faucet.polygon.technology/'
  }
}

// 支持的代币合约地址配置
const TOKEN_ADDRESSES = {
  [NETWORKS.SEPOLIA.chainId]: {
    ETH: '0x0000000000000000000000000000000000000000', // ETH 使用零地址
    USDT: '0x7169D38820dfd117C3FA1f22a697dba58d90BA06', // Sepolia USDT
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // Sepolia USDC
    DAI: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357'   // Sepolia DAI
  },
  [NETWORKS.POLYGON_AMOY.chainId]: {
    MATIC: '0x0000000000000000000000000000000000000000', // MATIC 使用零地址
    USDT: '0xBD21A10F619BE90d6066c941b04e340BbF10D416', // Amoy USDT
    USDC: '0x0FA8781a83E46826621b3BC0EaA8B9B3875C2eB0', // Amoy USDC
    DAI: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'   // Amoy DAI
  }
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

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  blockNumber?: number
  gasUsed?: string
  gasPrice?: string
}

export class Web3PaymentService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private currentNetwork: number | null = null
  private transactionListeners: Map<string, (status: TransactionStatus) => void> = new Map()

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

      // 获取当前网络信息
      const network = await this.provider.getNetwork()
      this.currentNetwork = Number(network.chainId)

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
        // 获取当前网络信息
        const network = await this.provider.getNetwork()
        this.currentNetwork = Number(network.chainId)
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
      if (!this.provider || !this.currentNetwork) {
        return { balance: '0', error: 'Wallet not connected' }
      }

      const networkTokens = TOKEN_ADDRESSES[this.currentNetwork as keyof typeof TOKEN_ADDRESSES]
      if (!networkTokens) {
        return { balance: '0', error: 'Unsupported network' }
      }

      // 检查是否为原生代币
      const isNativeToken = currency === 'ETH' || currency === 'MATIC'
      if (isNativeToken) {
        const balance = await this.provider.getBalance(address)
        return { balance: ethers.formatEther(balance) }
      } else {
        const tokenAddress = networkTokens[currency as keyof typeof networkTokens]
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          return { balance: '0', error: 'Unsupported currency for current network' }
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
      // console.log('Processing payment:', payment)
      
      if (!this.signer) {
        console.error('Wallet not connected - no signer available')
        return { success: false, error: 'Wallet not connected' }
      }

      const recipientAddress = payment.recipientAddress
      const amount = payment.amount
      
      // 安全地格式化地址，处理校验和问题
      let formattedAddress: string
      try {
        formattedAddress = ethers.getAddress(recipientAddress)
      } catch (error) {
        // 如果校验和失败，使用 toLowerCase 格式
        formattedAddress = recipientAddress.toLowerCase()
      }
      
      // console.log('Payment details:', { 
      //   originalAddress: recipientAddress, 
      //   formattedAddress, 
      //   amount, 
      //   currency: payment.currency 
      // })

      // 检查余额是否足够
      const balanceCheck = await this.checkBalance(payment.currency, amount)
      if (!balanceCheck.sufficient) {
        return { 
          success: false, 
          error: `Insufficient ${payment.currency} balance. You have ${balanceCheck.balance} ${payment.currency}, but need ${amount} ${payment.currency} plus gas fees.` 
        }
      }

      const networkTokens = TOKEN_ADDRESSES[this.currentNetwork as keyof typeof TOKEN_ADDRESSES]
      if (!networkTokens) {
        return { success: false, error: 'Unsupported network' }
      }

      // 检查是否为原生代币
      const isNativeToken = payment.currency === 'ETH' || payment.currency === 'MATIC'
      if (isNativeToken) {
        // Native token 支付
        console.log('Sending native token transaction...')
        const tx = await this.signer.sendTransaction({
          to: formattedAddress,
          value: ethers.parseEther(amount.toString())
        })
        console.log('Transaction sent:', tx.hash)

        return { 
          success: true, 
          transactionHash: tx.hash 
        }
      } else {
        // ERC20 代币支付
        const tokenAddress = networkTokens[payment.currency as keyof typeof networkTokens]
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          return { success: false, error: 'Unsupported currency for current network' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)
        
        // 获取代币精度
        const decimals = await (contract as any).decimals()
        const amountWei = ethers.parseUnits(amount.toString(), decimals)

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

      const networkTokens = TOKEN_ADDRESSES[this.currentNetwork as keyof typeof TOKEN_ADDRESSES]
      if (!networkTokens) {
        return { balance: '0', error: 'Unsupported network' }
      }

      // 检查是否为原生代币
      const isNativeToken = currency === 'ETH' || currency === 'MATIC'
      if (isNativeToken) {
        const balance = await this.provider.getBalance(address)
        return { balance: ethers.formatEther(balance) }
      } else {
        // ERC20 代币余额
        const tokenAddress = networkTokens[currency as keyof typeof networkTokens]
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          return { balance: '0', error: 'Unsupported currency for current network' }
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
      const isNativeToken = currency === 'ETH' || currency === 'MATIC'
      if (isNativeToken) {
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

      // 安全地格式化地址，处理校验和问题
      let formattedAddress: string
      try {
        formattedAddress = ethers.getAddress(recipientAddress)
      } catch (error) {
        // 如果校验和失败，使用 toLowerCase 格式
        formattedAddress = recipientAddress.toLowerCase()
      }

      const networkTokens = TOKEN_ADDRESSES[this.currentNetwork as keyof typeof TOKEN_ADDRESSES]
      if (!networkTokens) {
        return { gasFee: '0', error: 'Unsupported network' }
      }

      const isNativeToken = currency === 'ETH' || currency === 'MATIC'
      if (isNativeToken) {
        const gasEstimate = await this.provider.estimateGas({
          to: formattedAddress,
          value: ethers.parseEther(amount.toString())
        })
        
        const gasPrice = await this.provider.getFeeData()
        const gasFee = gasEstimate * (gasPrice.gasPrice || 0n)
        
        return { gasFee: ethers.formatEther(gasFee) }
      } else {
        // ERC20 代币的Gas估算
        const tokenAddress = networkTokens[currency as keyof typeof networkTokens]
        if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
          return { gasFee: '0', error: 'Unsupported currency for current network' }
        }

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)
        const decimals = await (contract as any).decimals()
        const amountWei = ethers.parseUnits(amount.toString(), decimals)

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

  // 切换到指定网络
  async switchToNetwork(networkKey: keyof typeof NETWORKS): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask not found' }
      }

      const network = NETWORKS[networkKey]
      const chainId = `0x${network.chainId.toString(16)}`

      // 尝试切换到指定网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      })

      // 更新当前网络
      this.currentNetwork = network.chainId

      return { success: true }
    } catch (error: any) {
      console.error('Network switch error:', error)
      
      // 如果网络不存在，添加网络
      if (error.code === 4902) {
        return await this.addNetwork(networkKey)
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to switch network' 
      }
    }
  }

  // 切换到Ethereum Sepolia测试网络
  async switchToSepolia(): Promise<{ success: boolean; error?: string }> {
    return await this.switchToNetwork('SEPOLIA')
  }

  // 切换到Polygon Amoy测试网络
  async switchToPolygonAmoy(): Promise<{ success: boolean; error?: string }> {
    return await this.switchToNetwork('POLYGON_AMOY')
  }

  // 添加指定网络
  async addNetwork(networkKey: keyof typeof NETWORKS): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: 'MetaMask not found' }
      }
      
      const network = NETWORKS[networkKey]
      const chainId = `0x${network.chainId.toString(16)}`
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId,
          chainName: network.name,
          nativeCurrency: network.nativeCurrency,
          rpcUrls: network.rpcUrls,
          blockExplorerUrls: network.blockExplorerUrls
        }]
      })

      // 更新当前网络
      this.currentNetwork = network.chainId

      return { success: true }
    } catch (error: any) {
      console.error('Add network error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to add network' 
      }
    }
  }

  // 添加Ethereum Sepolia测试网络
  async addSepoliaNetwork(): Promise<{ success: boolean; error?: string }> {
    return await this.addNetwork('SEPOLIA')
  }

  // 添加Polygon Amoy测试网络
  async addPolygonAmoyNetwork(): Promise<{ success: boolean; error?: string }> {
    return await this.addNetwork('POLYGON_AMOY')
  }

  // 获取支持的网络列表
  getSupportedNetworks() {
    return Object.entries(NETWORKS).map(([key, network]) => ({
      key: key as keyof typeof NETWORKS,
      ...network
    }))
  }

  // 获取当前网络支持代币
  getSupportedTokens() {
    if (!this.currentNetwork) return []
    
    const networkTokens = TOKEN_ADDRESSES[this.currentNetwork as keyof typeof TOKEN_ADDRESSES]
    if (!networkTokens) return []
    
    return Object.keys(networkTokens).map(symbol => ({
      symbol,
      name: symbol === 'ETH' ? 'Ethereum' : 
            symbol === 'MATIC' ? 'Polygon' :
            symbol === 'USDT' ? 'Tether USD' :
            symbol === 'USDC' ? 'USD Coin' :
            symbol === 'DAI' ? 'Dai Stablecoin' : symbol
    }))
  }

  // 监听交易状态
  async watchTransaction(txHash: string, onStatusUpdate: (status: TransactionStatus) => void): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not available')
    }

    // 存储监听器
    this.transactionListeners.set(txHash, onStatusUpdate)

    try {
      // 等待交易被挖矿
      const receipt = await this.provider.waitForTransaction(txHash, 1, 60000) // 等待1个确认，最多60秒

      if (receipt) {
        if (receipt.status === 1) {
          // 交易成功
          onStatusUpdate({
            hash: txHash,
            status: 'confirmed',
            confirmations: Number(receipt.confirmations) || 1,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed?.toString(),
            gasPrice: receipt.gasPrice?.toString()
          })
        } else {
          // 交易失败
          onStatusUpdate({
            hash: txHash,
            status: 'failed',
            confirmations: Number(receipt.confirmations) || 0,
            blockNumber: receipt.blockNumber
          })
        }
      } else {
        // 交易超时
        onStatusUpdate({
          hash: txHash,
          status: 'failed',
          confirmations: 0
        })
      }
    } catch (error) {
      console.error('Transaction watch error:', error)
      onStatusUpdate({
        hash: txHash,
        status: 'failed',
        confirmations: 0
      })
    } finally {
      // 清理监听器
      this.transactionListeners.delete(txHash)
    }
  }

  // 获取交易状态
  async getTransactionStatus(txHash: string): Promise<TransactionStatus> {
    if (!this.provider) {
      throw new Error('Provider not available')
    }

    try {
      const tx = await this.provider.getTransaction(txHash)
      const receipt = await this.provider.getTransactionReceipt(txHash)

      if (!tx) {
        return {
          hash: txHash,
          status: 'failed',
          confirmations: 0
        }
      }

      if (receipt) {
        return {
          hash: txHash,
          status: receipt.status === 1 ? 'confirmed' : 'failed',
          confirmations: Number(receipt.confirmations) || 0,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed?.toString(),
          gasPrice: receipt.gasPrice?.toString()
        }
      } else {
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0
        }
      }
    } catch (error) {
      console.error('Get transaction status error:', error)
      return {
        hash: txHash,
        status: 'failed',
        confirmations: 0
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
