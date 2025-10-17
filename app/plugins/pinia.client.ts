/**
 * Pinia Client Plugin
 * Initialize stores from localStorage on client side
 */

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.client) {
    // Wait for stores to be available
    nextTick(() => {
      try {
        const userStore = useUserStore()
        
        // Initialize user store from localStorage
        userStore.initFromStorage()

        // Auto-refresh token before expiry
        if (userStore.isAuthenticated) {
          // Check authentication periodically (every 5 minutes)
          setInterval(() => {
            if (userStore.isSessionValid) {
              userStore.updateActivity()
            } else {
              userStore.refreshAuthToken()
            }
          }, 5 * 60 * 1000)
        }
      } catch (error) {
        console.warn('Failed to initialize stores:', error)
      }
    })
  }
})

