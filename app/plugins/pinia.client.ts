/**
 * Pinia Client Plugin
 * Initialize stores from localStorage on client side
 */

export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  // Initialize user store from localStorage
  userStore.initFromStorage()

  // Initialize app store from localStorage
  appStore.loadSettings()

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
})

