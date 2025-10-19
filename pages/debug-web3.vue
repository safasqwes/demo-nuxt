<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Web3 签名调试</h1>
      
      <div v-if="!walletStatus.isInstalled" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <div class="text-red-600 mr-3">⚠️</div>
          <div>
            <h3 class="text-red-800 font-medium">MetaMask 未安装</h3>
            <p class="text-red-600 text-sm">请先安装 MetaMask 浏览器扩展</p>
          </div>
        </div>
      </div>
      <div v-if="!walletStatus.isInstalled && !walletStatus.isUnlocked" class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <div class="text-orange-600 mr-3">🔒</div>
          <div>
            <h3 class="text-orange-800 font-medium">MetaMask 已锁定</h3>
            <p class="text-orange-600 text-sm">请先解锁 MetaMask 钱包（输入密码）后再连接</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">调试信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">钱包地址:</label>
            <input 
              v-model="walletAddress" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0x..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">测试消息:</label>
            <textarea 
              v-model="testMessage" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="输入测试消息..."
            ></textarea>
          </div>
          
          <div class="flex gap-4">
            <button 
              @click="connectWallet"
              :disabled="isConnecting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isConnecting ? '连接中...' : '连接钱包' }}
            </button>
            
            <button 
              @click="signMessage"
              :disabled="!isConnected || isSigning"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {{ isSigning ? '签名中...' : '签名消息' }}
            </button>
            
            <button 
              @click="verifySignature"
              :disabled="!signature || isVerifying"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {{ isVerifying ? '验签中...' : '验签测试' }}
            </button>
            
            <button 
              @click="testLogin"
              :disabled="!signature || isLoading"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {{ isLoading ? '测试中...' : '测试登录' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="debugInfo" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">调试结果</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-700">连接状态:</h3>
            <div class="flex items-center gap-2">
              <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
                {{ isConnected ? '✓ 已连接' : '✗ 未连接' }}
              </span>
              <span v-if="!isConnected" class="text-sm text-orange-600">
                (请确保 MetaMask 已解锁)
              </span>
            </div>
          </div>
          
          <div v-if="signature">
            <h3 class="font-medium text-gray-700">签名结果:</h3>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ signature }}</pre>
          </div>
          
          <div v-if="verificationResult">
            <h3 class="font-medium text-gray-700">验签结果:</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="font-medium">验证状态:</span>
                <span :class="verificationResult.isValid ? 'text-green-600' : 'text-red-600'">
                  {{ verificationResult.isValid ? '✓ 验证成功' : '✗ 验证失败' }}
                </span>
              </div>
              <div v-if="verificationResult.recoveredAddress">
                <span class="font-medium">恢复地址:</span>
                <span class="text-sm text-gray-600">{{ verificationResult.recoveredAddress }}</span>
              </div>
              <div v-if="verificationResult.addressMatch !== undefined">
                <span class="font-medium">地址匹配:</span>
                <span :class="verificationResult.addressMatch ? 'text-green-600' : 'text-red-600'">
                  {{ verificationResult.addressMatch ? '✓ 匹配' : '✗ 不匹配' }}
                </span>
              </div>
              <div v-if="verificationResult.error">
                <span class="font-medium text-red-600">错误信息:</span>
                <span class="text-sm text-red-600">{{ verificationResult.error }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="loginResult">
            <h3 class="font-medium text-gray-700">登录结果:</h3>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ JSON.stringify(loginResult, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ethers } from 'ethers'

interface VerificationResult {
  isValid: boolean
  recoveredAddress?: string
  addressMatch?: boolean
  originalAddress?: string
  message?: string
  signature?: string
  error?: string
}

interface LoginResult {
  error?: string
  [key: string]: any
}

const walletAddress = ref('')
const testMessage = ref('NovelHub登录\n地址: 0x1234567890123456789012345678901234567890\n时间: 1234567890')
const isConnected = ref(false)
const isConnecting = ref(false)
const isSigning = ref(false)
const isVerifying = ref(false)
const isLoading = ref(false)
const signature = ref('')
const verificationResult = ref<VerificationResult | null>(null)
const loginResult = ref<LoginResult | null>(null)
const debugInfo = ref(false)
const walletStatus = ref({ isInstalled: false, isUnlocked: false, accounts: [] })
let provider: any = undefined
let signer: any = undefined

const checkWalletStatus = async () => {
  if (process.server || !window.ethereum) {
    return { isInstalled: false, isUnlocked: false, accounts: [] }
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    })
    return {
      isInstalled: true,
      isUnlocked: accounts && accounts.length > 0,
      accounts: accounts || []
    }
  } catch (error) {
    console.error('检查钱包状态失败:', error)
    return { isInstalled: true, isUnlocked: false, accounts: [] }
  }
}

onMounted(async () => {
  if (process.client) {
    walletStatus.value = await checkWalletStatus()
    console.log('钱包状态:', walletStatus.value)
  }
})

const connectWallet = async () => {
  if (!window.ethereum) {
    alert('请安装MetaMask钱包')
    return
  }

  isConnecting.value = true
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    })
    
    if (!accounts || accounts.length === 0) {
      alert('MetaMask 钱包已锁定，请先解锁钱包（输入密码）后再试')
      return
    }
    
    const connectedAccounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    })
    
    if (connectedAccounts && connectedAccounts.length > 0) {
      walletAddress.value = connectedAccounts[0]
      
      provider = new ethers.BrowserProvider(window.ethereum as any)
      signer = await provider.getSigner()
      
      isConnected.value = true
      debugInfo.value = true
      walletStatus.value = await checkWalletStatus()
      console.log('钱包连接成功，地址:', walletAddress.value)
    }
  } catch (error) {
    console.error('连接钱包失败:', error)
    const errorMessage = (error as Error).message
    if (errorMessage.includes('User rejected')) {
      alert('用户取消了连接请求')
    } else if (errorMessage.includes('User denied')) {
      alert('用户拒绝了连接请求')
    } else if (errorMessage.includes('locked') || errorMessage.includes('not unlocked')) {
      alert('MetaMask 钱包已锁定，请先解锁钱包（输入密码）后再试')
    } else {
      alert('连接钱包失败: ' + errorMessage)
    }
  } finally {
    isConnecting.value = false
  }
}

const signMessage = async () => {
  if (!isConnected.value || !walletAddress.value || !signer) {
    alert('请先连接钱包')
    return
  }

  console.log('钱包地址:', walletAddress.value)
  console.log('签名消息:', testMessage.value)
  
  if (!window.ethereum) {
    alert('MetaMask 不可用')
    return
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    })
    
    if (!accounts || accounts.length === 0) {
      alert('MetaMask 钱包已锁定，请先解锁钱包（输入密码）后再试')
      return
    }
    
    if (accounts[0].toLowerCase() !== walletAddress.value.toLowerCase()) {
      alert('钱包账户已切换，请重新连接钱包')
      isConnected.value = false
      return
    }
  } catch (error) {
    console.error('检查钱包状态失败:', error)
    alert('检查钱包状态失败，请确保 MetaMask 已解锁')
    return
  }
  
  isSigning.value = true
  try {
    console.log('开始签名...')
    
    const sig = await signer.signMessage(testMessage.value)
    signature.value = sig
    console.log('签名成功，结果:', sig)
  } catch (error) {
    console.error('签名失败:', error)
    const errorMessage = (error as Error).message
    if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
      alert('用户取消了签名操作')
    } else if (errorMessage.includes('not connected')) {
      alert('钱包未连接，请重新连接')
    } else if (errorMessage.includes('locked') || errorMessage.includes('not unlocked')) {
      alert('MetaMask 钱包已锁定，请先解锁钱包（输入密码）后再试')
    } else {
      alert('签名失败: ' + errorMessage)
    }
  } finally {
    isSigning.value = false
  }
}

const verifySignature = async () => {
  if (!signature.value || !walletAddress.value || !testMessage.value) {
    alert('请先签名消息')
    return
  }

  isVerifying.value = true
  try {
    const recoveredAddress = ethers.verifyMessage(testMessage.value, signature.value)
    
    const addressMatch = recoveredAddress.toLowerCase() === walletAddress.value.toLowerCase()
    
    verificationResult.value = {
      isValid: true,
      recoveredAddress: recoveredAddress,
      addressMatch: addressMatch,
      originalAddress: walletAddress.value,
      message: testMessage.value,
      signature: signature.value
    }
    
    console.log('验签结果:', verificationResult.value)
  } catch (error) {
    console.error('验签失败:', error)
    verificationResult.value = {
      isValid: false,
      error: (error as Error).message,
      message: testMessage.value,
      signature: signature.value
    }
  } finally {
    isVerifying.value = false
  }
}

const testLogin = async () => {
  if (!signature.value || !walletAddress.value) {
    alert('请先签名消息')
    return
  }

  isLoading.value = true
  try {
    const { http } = await import('~/utils/http')
    
    const response = await http.post('/api/auth/web3/login', {
      address: walletAddress.value,
      signature: signature.value,
      message: testMessage.value
    })
    
    loginResult.value = response
    console.log('登录结果:', response)
  } catch (error) {
    console.error('登录失败:', error)
    loginResult.value = { error: (error as Error).message }
  } finally {
    isLoading.value = false
  }
}
</script>
