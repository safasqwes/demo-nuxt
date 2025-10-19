import { ethers } from 'ethers';

/**
 * Web3 认证工具类
 * 使用 ethers.js 进行钱包连接和消息签名
 */

/**
 * 请求登录挑战码
 */
async function requestLoginChallenge(walletAddress: string) {
    const { http } = await import('~/utils/http')
    
    const response = await http.get('/api/auth/web3/message', { 
        address: walletAddress 
    });
    
    if (response.code === 200) {
        return response.data.message;
    } else {
        throw new Error(response.msg || '获取挑战消息失败');
    }
}

/**
 * 使用钱包私钥对消息进行签名
 */
async function signMessage(message: string, provider: ethers.BrowserProvider) {
    try {
        // 获取签名者
        const signer = await provider.getSigner();
        
        // 对消息进行签名（ethers.js会自动添加EIP-191前缀）
        const signature = await signer.signMessage(message);
        return signature;
    } catch (error: any) {
        console.error('签名失败:', error);
        if (error.code === 4001) {
            throw new Error('用户取消了签名操作');
        }
        throw new Error('签名失败: ' + error.message);
    }
}

/**
 * 提交Web3登录请求
 */
async function submitWeb3Login(walletAddress: string, signature: string, message: string) {
    const { http } = await import('~/utils/http')
    
    const response = await http.post('/api/auth/web3/login', {
        address: walletAddress,
        signature: signature,
        message: message
    });
    
    return response;
}

/**
 * 检测并连接Web3钱包
 */
async function connectWallet(): Promise<{ provider: ethers.BrowserProvider; address: string }> {
    // 检测MetaMask或其他Web3钱包
    if (!window.ethereum) {
        throw new Error('请安装MetaMask或其他Web3钱包');
    }
    
    // 创建provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // 连接钱包
    const accounts = await provider.send('eth_requestAccounts', []);
    const walletAddress = accounts[0];
    
    if (!walletAddress) {
        throw new Error('未获取到钱包地址');
    }
    
    return { provider, address: walletAddress };
}

/**
 * 完整的Web3登录流程
 */
export async function web3Login() {
    try {
        // 1. 连接钱包
        const { provider, address: walletAddress } = await connectWallet();
        console.log('钱包地址:', walletAddress);
        
        // 2. 获取挑战消息
        const challengeMessage = await requestLoginChallenge(walletAddress);
        console.log('挑战消息:', challengeMessage);
        
        // 3. 用户签名
        const signature = await signMessage(challengeMessage, provider);
        console.log('签名结果:', signature);
        
        // 4. 提交登录
        const result = await submitWeb3Login(walletAddress, signature, challengeMessage);
        
        if (result.code === 200) {
            console.log('Web3登录成功!', result.data);
            
            // 存储认证信息
            const { token, refreshToken, user } = result.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(user));
            
            return { success: true, data: result.data };
        } else {
            throw new Error(result.msg || '登录失败');
        }
        
    } catch (error: any) {
        console.error('Web3登录失败:', error.message);
        return { success: false, message: error.message };
    }
}

/**
 * 检查钱包连接状态
 */
export async function checkWalletConnection(): Promise<boolean> {
    if (!window.ethereum) return false;
    
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        return accounts && accounts.length > 0;
    } catch (error) {
        return false;
    }
}

/**
 * 获取当前连接的钱包地址
 */
export async function getCurrentAddress(): Promise<string | null> {
    if (!window.ethereum) return null;
    
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        return accounts && accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
        return null;
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
