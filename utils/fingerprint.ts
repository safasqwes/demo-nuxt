/**
 * Browser Fingerprint Utilities
 * Using FingerprintJS for better performance and reliability
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs'

// FingerprintJS instance cache
let fpPromise: Promise<any> | null = null

/**
 * Initialize FingerprintJS
 */
function initFingerprint() {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }
  return fpPromise
}

/**
 * Generate browser fingerprint using FingerprintJS
 * @returns {Promise<string>} Fingerprint hash
 */
export async function getFingerprint(): Promise<string> {
  // Server-side: return a default value
  if (!process.client) {
    return '817ddfb1-ea6c-4e07-b37d-3aa9281e4fb7'
  }

  try {
    // Check cache first (24 hours validity)
    const cached = localStorage.getItem('browser_fingerprint')
    if (cached) {
      try {
        const fingerprintData = JSON.parse(cached)
        const isExpired = Date.now() - fingerprintData.timestamp > 24 * 60 * 60 * 1000
        
        if (!isExpired && fingerprintData.hash) {
          return fingerprintData.hash
        }
      } catch (e) {
        // If parsing fails, continue with generation
        console.warn('Failed to parse cached fingerprint:', e)
      }
    }

    // Generate new fingerprint using FingerprintJS
    const fp = await initFingerprint()
    const result = await fp.get()
    
    // Get the visitor ID (this is the fingerprint)
    const visitorId = result.visitorId
    
    // Cache the fingerprint with metadata
    const fingerprintData = {
      hash: visitorId,
      timestamp: Date.now(),
      version: '3.0-fpjs',
      confidence: result.confidence?.score || 1.0
    }
    
    localStorage.setItem('browser_fingerprint', JSON.stringify(fingerprintData))
    
    return visitorId
  } catch (error) {
    console.error('Failed to generate fingerprint:', error)
    
    // Fallback: generate a simple fingerprint
    return generateFallbackFingerprint()
  }
}

/**
 * Get detailed fingerprint components (for debugging/logging)
 * @returns {Promise<object>} Detailed fingerprint components
 */
export async function getFingerprintDetails(): Promise<any> {
  if (!process.client) {
    return { visitorId: '817ddfb1-ea6c-4e07-b37d-3aa9281e4fb7', components: {} }
  }

  try {
    const fp = await initFingerprint()
    const result = await fp.get()
    
    return {
      visitorId: result.visitorId,
      confidence: result.confidence,
      components: result.components,
      version: result.version
    }
  } catch (error) {
    console.error('Failed to get fingerprint details:', error)
    return { visitorId: generateFallbackFingerprint(), components: {} }
  }
}

/**
 * Fallback fingerprint generation (simple version)
 * Used when FingerprintJS fails
 */
function generateFallbackFingerprint(): string {
  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 4,
      navigator.maxTouchPoints || 0,
    ].join('|')
    
    return simpleHash(components)
  } catch (e) {
    // Ultimate fallback: random UUID-like string
    return generateUUID()
  }
}

/**
 * Simple hash function for fallback
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32)
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Get MD5-like hash of string (for backward compatibility)
 * Note: This is a simple hash, not actual MD5
 * @param {string} str - String to hash
 * @returns {string} Hash string
 */
export function getMd5ByString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32)
}

/**
 * Clear cached fingerprint (useful for testing)
 */
export function clearFingerprintCache(): void {
  if (process.client) {
    localStorage.removeItem('browser_fingerprint')
  }
}

/**
 * Check if fingerprint is cached
 */
export function hasCachedFingerprint(): boolean {
  if (!process.client) return false
  
  const cached = localStorage.getItem('browser_fingerprint')
  if (!cached) return false
  
  try {
    const data = JSON.parse(cached)
    const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000
    return !isExpired
  } catch {
    return false
  }
}
