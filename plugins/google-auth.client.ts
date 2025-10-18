export default defineNuxtPlugin(() => {
  // Load Google Identity Services library
  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve(window.google)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Initialize Google Sign-In
  const initializeGoogleSignIn = async () => {
    try {
      await loadGoogleScript()
      
      const config = useRuntimeConfig()
      const clientId = config.public.googleClientId
      
      console.log('Google Client ID:', clientId) // Debug log
      
      if (!clientId) {
        console.error('Google Client ID is not configured!')
        return
      }
      
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })
        console.log('Google Sign-In initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error)
    }
  }

  // Handle Google credential response
  const handleCredentialResponse = async (response: any) => {
    console.log('Google credential response received:', response)
    
    try {
      console.log('Sending credential to backend for verification...')
      
      // 直接发送credential到后端，让后端使用client-secret验证
      const { http } = await import('~/shared/utils/http')
      const result = await http.post('/api/auth/google/login', {
        credential: response.credential
      })

      console.log('Backend API response:', result)

      if (result.code === 200 && result.data?.success) {
        // Store tokens and user info in cookies
        const token = useCookie('auth-token')
        const refreshToken = useCookie('auth-refresh-token')
        const user = useCookie('user')
        
        token.value = result.data.token
        refreshToken.value = result.data.refreshToken
        user.value = JSON.stringify(result.data.user)
        
        // Also update the user store
        try {
          const { useUserStore } = await import('~/shared/stores/user')
          const userStore = useUserStore()
          userStore.setToken(result.data.token, result.data.refreshToken)
          userStore.setUserInfo(result.data.user)
          userStore.updateActivity()
        } catch (error) {
          console.warn('Failed to update user store:', error)
        }
        
        console.log('Login successful, redirecting to home...')
        // Redirect to home page
        await navigateTo('/')
      } else {
        throw new Error(result.message || 'Google login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      // Show error message to user
      alert('Google login failed. Please try again.')
    }
  }


  // Render Google Sign-In button
  const renderGoogleSignInButton = (elementId: string, options: any = {}) => {
    console.log('Rendering Google Sign-In button in element:', elementId)
    
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found:', elementId)
      return
    }
    
    if (window.google) {
      console.log('Rendering Google button...')
      window.google.accounts.id.renderButton(
        element,
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          ...options
        }
      )
      console.log('Google button rendered successfully')
    } else {
      console.error('Google API not loaded')
    }
  }

  // Sign out
  const signOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
    
    // Clear stored tokens
    const token = useCookie('auth-token')
    const refreshToken = useCookie('auth-refresh-token')
    const user = useCookie('user')
    
    token.value = null
    refreshToken.value = null
    user.value = null
    
    // Redirect to login
    navigateTo('/auth/login')
  }

  // Provide methods globally
  return {
    provide: {
      googleAuth: {
        initialize: initializeGoogleSignIn,
        renderButton: renderGoogleSignInButton,
        signOut
      }
    }
  }
})
