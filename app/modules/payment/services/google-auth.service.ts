export interface GoogleAuthResponse {
  success: boolean
  data?: {
    token: string
    refreshToken: string
    user: {
      id: number
      username: string
      email: string
      nickname: string
      avatar: string
      status: number
    }
  }
  message?: string
}

export const useGoogleAuthService = () => {
  const loginWithGoogle = async (idToken: string): Promise<GoogleAuthResponse> => {
    try {
      const { http } = await import('~/shared/utils/http')
      const response = await http.post<GoogleAuthResponse>('/api/auth/google/login', {
        idToken
      })

      return response
    } catch (error: any) {
      console.error('Google login error:', error)
      return {
        success: false,
        message: error.data?.message || 'Google login failed'
      }
    }
  }

  const signOut = () => {
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

  return {
    loginWithGoogle,
    signOut
  }
}
