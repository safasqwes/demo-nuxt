/**
 * Web3 Composable
 * 提供Web3钱包连接和签名功能
 * 使用 ethers.js 进行更可靠的Web3操作
 */

import { ref, computed } from 'vue'
import { ethers } from 'ethers'

// 钱包连接状态
const isConnected = ref(false)
const address = ref('')
const walletType = ref('')
const isConnecting = ref(false)
const isSigning = ref(false)

// 错误状态
const error = ref('')

export const useWeb3 = () => {
  /**
   * 检查是否安装了MetaMask
   */
  const isMetaMaskInstalled = computed(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  })

  /**
   * 连接MetaMask钱包 - 使用 ethers.js
   */
  const connectWallet = async () => {
    if (!isMetaMaskInstalled.value) {
      error.value = '请先安装MetaMask钱包'
      return { success: false, message: error.value }
    }

    isConnecting.value = true
    error.value = ''

    try {
      // 使用 ethers.js 创建 provider
      const provider = new ethers.BrowserProvider(window.ethereum!)
      
      // 请求连接钱包
      const accounts = await provider.send('eth_requestAccounts', [])

      if (accounts && accounts.length > 0) {
        address.value = accounts[0]
        isConnected.value = true
        walletType.value = 'metamask'
        
        return { success: true, address: address.value }
      } else {
        error.value = '未获取到钱包地址'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.message || '连接钱包失败'
      return { success: false, message: error.value }
    } finally {
      isConnecting.value = false
    }
  }

  /**
   * 断开钱包连接
   */
  const disconnectWallet = () => {
    isConnected.value = false
    address.value = ''
    walletType.value = ''
    error.value = ''
  }

  /**
   * 签名消息 - 使用 ethers.js 的 signer.signMessage 方法
   */
  const signMessage = async (message: string) => {
    if (!isConnected.value || !address.value) {
      error.value = '请先连接钱包'
      return { success: false, message: error.value }
    }

    isSigning.value = true
    error.value = ''

    try {
      // 使用 ethers.js 创建 provider 和 signer
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()

      // 使用标准的 signer.signMessage 方法
      // ethers.js 会自动添加 EIP-191 前缀
      const signature = await signer.signMessage(message)
      console.log('signature', signature)

      return { success: true, signature }
    } catch (err: any) {
      if (err.code === 4001) {
        error.value = '用户取消了签名操作'
      } else {
        error.value = err.message || '签名失败'
      }
      return { success: false, message: error.value }
    } finally {
      isSigning.value = false
    }
  }

  /**
   * 获取钱包余额 - 使用 ethers.js
   */
  const getBalance = async () => {
    if (!isConnected.value || !address.value) {
      return { success: false, message: '请先连接钱包' }
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const balance = await provider.getBalance(address.value)

      // 将wei转换为ETH
      const balanceInEth = parseFloat(ethers.formatEther(balance))
      
      return { success: true, balance: balanceInEth }
    } catch (err: any) {
      return { success: false, message: err.message || '获取余额失败' }
    }
  }

  /**
   * 格式化地址显示
   */
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  /**
   * 监听账户变化
   */
  const setupAccountListener = () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        address.value = accounts[0] || ''
        isConnected.value = true
      } else {
        disconnectWallet()
      }
    })

    window.ethereum.on('chainChanged', () => {
      // 链变化时重新加载页面
      window.location.reload()
    })
  }

  /**
   * 初始化Web3 - 使用 ethers.js
   */
  const initWeb3 = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      // 使用 ethers.js 检查是否已经连接
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_accounts', [])

      if (accounts && accounts.length > 0) {
        address.value = accounts[0]
        isConnected.value = true
        walletType.value = 'metamask'
      }

      // 设置监听器
      setupAccountListener()
    } catch (err) {
      console.error('初始化Web3失败:', err)
    }
  }

  return {
    // 状态
    isConnected: readonly(isConnected),
    address: readonly(address),
    walletType: readonly(walletType),
    isConnecting: readonly(isConnecting),
    isSigning: readonly(isSigning),
    error: readonly(error),
    
    // 计算属性
    isMetaMaskInstalled,
    formattedAddress: computed(() => formatAddress(address.value)),
    
    // 方法
    connectWallet,
    disconnectWallet,
    signMessage,
    getBalance,
    formatAddress,
    initWeb3
  }
}

// 全局类型声明
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
