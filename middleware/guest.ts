/**
 * Guest Middleware
 * Redirects authenticated users away from guest-only pages
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // If user is already authenticated, redirect to home
  if (userStore.isAuthenticated) {
    return navigateTo('/')
  }
})

