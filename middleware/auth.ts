/**
 * Authentication Middleware
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    // Redirect to login with return URL
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }

  // Check session validity
  if (!userStore.isSessionValid) {
    // Try to refresh token
    userStore.refreshAuthToken()
  }
})

