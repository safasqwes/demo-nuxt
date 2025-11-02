/**
 * Web3 网络配置
 * 支持多个区块链网络
 */

export interface NetworkConfig {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  explorerUrl: string
  isTestnet: boolean
}

// 支持的网络配置
export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  // ========== 主网 ==========
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    explorerUrl: 'https://etherscan.io',
    isTestnet: false
  },

  BSC: {
    chainId: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    isTestnet: false
  },

  POLYGON: {
    chainId: 137,
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    isTestnet: false
  },

  // ========== 测试网 ==========
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/your-api-key',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true
  },

  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    symbol: 'MATIC',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    isTestnet: true
  }
}

// Chain ID 常量
export const CHAIN_IDS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  SEPOLIA: 11155111,
  POLYGON_AMOY: 80002
} as const

/**
 * 根据 Chain ID 获取网络配置
 */
export function getNetworkConfig(chainId: number): NetworkConfig | undefined {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId)
}

/**
 * 检查是否为支持的网络
 */
export function isSupportedNetwork(chainId: number): boolean {
  return Object.values(SUPPORTED_NETWORKS).some(network => network.chainId === chainId)
}

/**
 * 检查是否为测试网
 */
export function isTestnet(chainId: number): boolean {
  const network = getNetworkConfig(chainId)
  return network?.isTestnet ?? false
}

/**
 * 获取所有主网
 */
export function getMainnets(): NetworkConfig[] {
  return Object.values(SUPPORTED_NETWORKS).filter(network => !network.isTestnet)
}

/**
 * 获取所有测试网
 */
export function getTestnets(): NetworkConfig[] {
  return Object.values(SUPPORTED_NETWORKS).filter(network => network.isTestnet)
}
