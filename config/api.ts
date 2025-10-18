/**
 * API Configuration
 */

export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com/api' 
    : 'http://localhost:8080/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
}
