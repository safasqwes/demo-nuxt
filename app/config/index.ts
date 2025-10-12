/**
 * Application Configuration
 */

export default {
  // Brand configuration
  brand_id: 1,
  brand_name: 'NovelHub',
  
  // API configuration
  apiConfig: {
    isHttpNeedFp: true,      // Enable fingerprint protection
    isHttpNeedToken: true,   // Enable token authentication
  },
  
  // API base URL
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
}

