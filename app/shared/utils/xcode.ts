/**
 * Encryption and Signing Utilities
 */

/**
 * Generate sign for regular requests
 */
export function signx() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  
  // Generate secret key
  const secret_key = btoa(`${timestamp}-${random}`).substring(0, 32)
  
  // Generate AES secret (for fp1 encryption)
  const aesSecret = btoa(`aes-${timestamp}-${random}`).substring(0, 32)
  
  return {
    secret_key,
    aesSecret,
    timestamp,
  }
}

/**
 * Generate sign for upload requests
 */
export function signux() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  
  const secret_key = btoa(`upload-${timestamp}`).substring(0, 32)
  const sign = btoa(`${secret_key}-${random}`).substring(0, 32)
  
  return {
    secret_key,
    sign,
  }
}

/**
 * AES encryption (simplified)
 */
export function aseEncrypt(text: string, key: string): string {
  // Simple XOR encryption for demonstration
  // In production, use a proper crypto library like crypto-js
  let encrypted = ''
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    encrypted += String.fromCharCode(charCode)
  }
  return btoa(encrypted)
}

/**
 * AES decryption (simplified)
 */
export function aseDecrypt(encrypted: string, key: string): string {
  const text = atob(encrypted)
  let decrypted = ''
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    decrypted += String.fromCharCode(charCode)
  }
  return decrypted
}

export default {
  signx,
  signux,
  aseEncrypt,
  aseDecrypt,
}

