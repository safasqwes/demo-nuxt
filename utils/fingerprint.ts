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
    try {
      const fingerprintData = JSON.parse(cached)
      // Check if cache is still valid (24 hours)
      const isExpired = Date.now() - fingerprintData.timestamp > 24 * 60 * 60 * 1000
      if (!isExpired && fingerprintData.hash) {
        return fingerprintData.hash
      }
    } catch (e) {
      // If parsing fails, continue with generation
    }
  }

  // Generate comprehensive fingerprint based on multiple browser properties
  const components = await generateFingerprintComponents()
  
  // Create hash from components with additional entropy
  const dataString = components.join('|')
  const timestamp = Date.now().toString()
  const randomSalt = Math.random().toString(36).substring(2, 15)
  const combinedData = `${dataString}|${timestamp}|${randomSalt}`
  
  const hash = await generateHash(combinedData)
  
  // Cache fingerprint with expiration
  const fingerprintData = {
    hash,
    timestamp: Date.now(),
    version: '2.0'
  }
  localStorage.setItem('browser_fingerprint', JSON.stringify(fingerprintData))
  
  return hash
}

/**
 * Generate comprehensive fingerprint components
 */
async function generateFingerprintComponents(): Promise<string[]> {
  const components: string[] = []
  
  // Basic navigator properties
  components.push(navigator.userAgent)
  components.push(navigator.language)
  components.push(navigator.languages?.join(',') || '')
  components.push(navigator.platform)
  components.push(navigator.cookieEnabled ? '1' : '0')
  components.push(navigator.doNotTrack || 'null')
  
  // Screen properties
  components.push(screen.width + 'x' + screen.height)
  components.push(screen.availWidth + 'x' + screen.availHeight)
  components.push(screen.colorDepth.toString())
  components.push(screen.pixelDepth.toString())
  components.push(screen.orientation?.type || 'unknown')
  
  // Window properties
  components.push(window.innerWidth + 'x' + window.innerHeight)
  components.push(window.outerWidth + 'x' + window.outerHeight)
  components.push(window.devicePixelRatio?.toString() || '1')
  
  // Timezone and date
  components.push(new Date().getTimezoneOffset().toString())
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
  
  // Hardware properties
  components.push(navigator.hardwareConcurrency?.toString() || '4')
  components.push((navigator as any).deviceMemory?.toString() || '8')
  components.push(navigator.maxTouchPoints?.toString() || '0')
  
  // WebGL fingerprint
  const webglFingerprint = await getWebGLFingerprint()
  components.push(webglFingerprint)
  
  // Canvas fingerprint
  const canvasFingerprint = await getCanvasFingerprint()
  components.push(canvasFingerprint)
  
  // Audio context fingerprint
  const audioFingerprint = await getAudioFingerprint()
  components.push(audioFingerprint)
  
  // Font detection
  const fontFingerprint = await getFontFingerprint()
  components.push(fontFingerprint)
  
  // Battery API (if available)
  const batteryFingerprint = await getBatteryFingerprint()
  components.push(batteryFingerprint)
  
  // Connection information
  const connectionFingerprint = getConnectionFingerprint()
  components.push(connectionFingerprint)
  
  // Storage capabilities
  const storageFingerprint = getStorageFingerprint()
  components.push(storageFingerprint)
  
  // Performance timing
  const performanceFingerprint = getPerformanceFingerprint()
  components.push(performanceFingerprint)
  
  return components
}

/**
 * Generate WebGL fingerprint
 */
async function getWebGLFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext
    
    if (!gl) return 'no-webgl'
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    
    return `${vendor}|${renderer}`
  } catch (e) {
    return 'webgl-error'
  }
}

/**
 * Generate Canvas fingerprint
 */
async function getCanvasFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return 'no-canvas'
    
    // Draw complex pattern
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.font = '11px Arial'
    ctx.fillText('Browser fingerprint test 🔒', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.font = '18px Arial'
    ctx.fillText('NovelHub', 4, 45)
    
    // Add some geometric shapes
    ctx.beginPath()
    ctx.arc(50, 50, 20, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.fill()
    
    return canvas.toDataURL()
  } catch (e) {
    return 'canvas-error'
  }
}

/**
 * Generate Audio context fingerprint
 */
async function getAudioFingerprint(): Promise<string> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const analyser = audioContext.createAnalyser()
    const gainNode = audioContext.createGain()
    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)
    
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(10000, audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    oscillator.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.start(0)
    
    const audioData = new Float32Array(analyser.frequencyBinCount)
    analyser.getFloatFrequencyData(audioData)
    
    oscillator.stop()
    audioContext.close()
    
    return Array.from(audioData).slice(0, 10).join(',')
  } catch (e) {
    return 'audio-error'
  }
}

/**
 * Generate Font fingerprint
 */
async function getFontFingerprint(): Promise<string> {
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Helvetica',
    'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma', 'Calibri'
  ]
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return 'no-canvas'
  
  ctx.font = '72px monospace'
  const baselineText = ctx.measureText('mmmmmmmmmmlli')
  const baselineWidth = baselineText.width
  
  const detectedFonts: string[] = []
  
  for (const font of testFonts) {
    ctx.font = `72px ${font}, monospace`
    const width = ctx.measureText('mmmmmmmmmmlli').width
    if (width !== baselineWidth) {
      detectedFonts.push(font)
    }
  }
  
  return detectedFonts.join(',')
}

/**
 * Generate Battery fingerprint
 */
async function getBatteryFingerprint(): Promise<string> {
  try {
    const battery = await (navigator as any).getBattery?.()
    if (!battery) return 'no-battery'
    
    return `${Math.round(battery.level * 100)}|${battery.charging}|${battery.chargingTime}|${battery.dischargingTime}`
  } catch (e) {
    return 'battery-error'
  }
}

/**
 * Generate Connection fingerprint
 */
function getConnectionFingerprint(): string {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (!connection) return 'no-connection'
  
  return `${connection.effectiveType || 'unknown'}|${connection.downlink || 'unknown'}|${connection.rtt || 'unknown'}`
}

/**
 * Generate Storage fingerprint
 */
function getStorageFingerprint(): string {
  const storage = {
    localStorage: typeof Storage !== 'undefined' ? '1' : '0',
    sessionStorage: typeof Storage !== 'undefined' ? '1' : '0',
    indexedDB: typeof indexedDB !== 'undefined' ? '1' : '0',
    webSQL: typeof (window as any).openDatabase !== 'undefined' ? '1' : '0'
  }
  
  return Object.values(storage).join('|')
}

/**
 * Generate Performance fingerprint
 */
function getPerformanceFingerprint(): string {
  try {
    const timing = performance.timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    return `${timing.loadEventEnd - timing.navigationStart}|${navigation?.loadEventEnd - navigation?.loadEventStart || '0'}`
  } catch (e) {
    return 'perf-error'
  }
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

