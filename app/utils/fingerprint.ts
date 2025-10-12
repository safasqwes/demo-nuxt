/**
 * Browser Fingerprint Utilities
 */

/**
 * Generate browser fingerprint based on various browser properties
 */
export async function getFingerprint(): Promise<string> {
  if (!process.client) {
    return '817ddfb1-ea6c-4e07-b37d-3aa9281e4fb7'
  }

  // Check if fingerprint is already cached
  const cached = localStorage.getItem('browser_fingerprint')
  if (cached) {
    return cached
  }

  // Generate fingerprint based on browser properties
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 4,
    navigator.deviceMemory || 8,
  ]

  // Create hash from components
  const dataString = components.join('|')
  const hash = await generateHash(dataString)
  
  // Cache fingerprint
  localStorage.setItem('browser_fingerprint', hash)
  
  return hash
}

/**
 * Generate hash string
 */
async function generateHash(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex.substring(0, 32)
  }
  
  // Fallback for environments without crypto.subtle
  return btoa(data).replace(/=/g, '').substring(0, 32)
}

/**
 * Get MD5 hash of string (simplified version)
 */
export function getMd5ByString(str: string): string {
  // Simple hash function for demonstration
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32)
}

