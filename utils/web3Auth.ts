import { ref } from 'vue'
import { ethers } from 'ethers'
import { useWeb3 } from './useWeb3'

/**
 * Web3 认证工具类
 * 专注于Web3登录和认证功能
 */

// 认证状态管理
const isAuthenticating = ref(false)
const authError = ref('')

export const useWeb3Auth = () => {
  const { connectWallet, signMessage: baseSignMessage } = useWeb3()

  /**
   * 请求登录挑战码
   */
  const requestLoginChallenge = async (walletAddress: string) => {
    const { http } = await import('~/utils/http')
    
    const response = await http.get('/api/auth/web3/message', { 
      address: walletAddress 
    })
    
    if (response.code === 200) {
      return response.data.message
    } else {
      throw new Error(response.msg || '获取挑战消息失败')
    }
  }

  /**
   * 使用钱包对认证消息进行签名
   */
  const signAuthMessage = async (message: string) => {
    try {
      return await baseSignMessage(message)
    } catch (error: any) {
      console.error('认证签名失败:', error)
      if (error.code === 4001) {
        throw new Error('用户取消了签名操作')
      }
      throw new Error('签名失败: ' + error.message)
    }
  }

  /**
   * 提交Web3登录请求
   */
  const submitWeb3Login = async (walletAddress: string, signature: string, message: string) => {
    const { http } = await import('~/utils/http')
    
    const response = await http.post('/api/auth/web3/login', {
      address: walletAddress,
      signature: signature,
      message: message
    })
    
    return response
  }

  /**
   * 完整的Web3登录流程
   */
  const web3Login = async () => {
    isAuthenticating.value = true
    authError.value = ''

    try {
      // 1. 连接钱包
      const connectResult = await connectWallet()
      if (!connectResult.success) {
        throw new Error(connectResult.message || '连接钱包失败')
      }

      const walletAddress = connectResult.address!
      console.log('钱包地址:', walletAddress)
      
      // 2. 获取挑战消息
      const challengeMessage = await requestLoginChallenge(walletAddress)
      console.log('挑战消息:', challengeMessage)
      
      // 3. 用户签名
      const signResult = await signAuthMessage(challengeMessage)
      if (!signResult.success) {
        throw new Error(signResult.message || '签名失败')
      }
      
      console.log('签名结果:', signResult.signature)
      
      // 4. 提交登录
      const result = await submitWeb3Login(walletAddress, signResult.signature!, challengeMessage)
      
      if (result.code === 200) {
        console.log('Web3登录成功!', result.data)
        
        // 存储认证信息
        const { token, refreshToken, user } = result.data
        localStorage.setItem('authToken', token)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('userInfo', JSON.stringify(user))
        
        return { success: true, data: result.data }
      } else {
        throw new Error(result.msg || '登录失败')
      }
      
    } catch (error: any) {
      console.error('Web3登录失败:', error.message)
      authError.value = error.message
      return { success: false, message: error.message }
    } finally {
      isAuthenticating.value = false
    }
  }

  /**
   * 重置认证状态
   */
  const resetAuthState = () => {
    isAuthenticating.value = false
    authError.value = ''
  }

  return {
    // 状态
    isAuthenticating: readonly(isAuthenticating),
    authError: readonly(authError),
    
    // 方法
    web3Login,
    requestLoginChallenge,
    signAuthMessage,
    submitWeb3Login,
    resetAuthState
  }
}

// 导出便捷函数（向后兼容）
export const web3Login = async () => {
  const { web3Login: login } = useWeb3Auth()
  return await login()
}
