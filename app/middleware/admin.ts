/**
 * Admin Authentication Middleware
 * Protects admin routes from unauthorized access
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const adminStore = useAdminStore()
  
  // Check authentication status
  adminStore.checkAuth()

  // If not authenticated, redirect to admin login
  if (!adminStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
})

