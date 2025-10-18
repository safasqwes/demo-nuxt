/**
 * Authentication Token Composable
 */

export default function useAuthToken() {
  // Token state
  const id_token = useState<string | null>('auth_token', () => {
    if (process.client) {
      return localStorage.getItem('id_token')
    }
    return null
  })

  // User info state
  const userInfo = useState<any>('user_info', () => {
    if (process.client) {
      const stored = localStorage.getItem('user_info')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  /**
   * Set token
   */
  const setToken = (token: string) => {
    id_token.value = token
    if (process.client) {
      localStorage.setItem('id_token', token)
    }
  }

  /**
   * Set user info
   */
  const setUserInfo = (info: any) => {
    userInfo.value = info
    if (process.client) {
      localStorage.setItem('user_info', JSON.stringify(info))
    }
  }

  /**
   * Clear token and user info
   */
  const clearToken = () => {
    id_token.value = null
    userInfo.value = null
    if (process.client) {
      localStorage.removeItem('id_token')
      localStorage.removeItem('user_info')
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!id_token.value)

  return {
    id_token,
    userInfo,
    setToken,
    setUserInfo,
    clearToken,
    isAuthenticated,
  }
}

