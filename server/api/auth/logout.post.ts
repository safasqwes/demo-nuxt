/**
 * Logout API Endpoint
 */

export default defineEventHandler(async (event) => {
  // In production, invalidate the token in database/cache
  
  return {
    success: true,
    message: 'Logged out successfully',
  }
})

