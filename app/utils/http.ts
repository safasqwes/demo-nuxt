/**
 * HTTP Request Utility with Axios
 * Based on the original axios configuration with fingerprint protection
 */

import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import Swal from 'sweetalert2'
import $config from '../config'
import xcode from './xcode'
import { getFingerprint, getMd5ByString } from './fingerprint'

// Extended config type to include custom options
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  not_show_error?: boolean
}

// Initialize fingerprint
let fp = '817ddfb1-ea6c-4e07-b37d-3aa9281e4fb7'
if (typeof window !== 'undefined') {
  getFingerprint().then((res) => {
    fp = res as string
  })
}

// Origin from
const origin_from = getMd5ByString($config.brand_name)

// Create axios instance
const instance = axios.create({
  baseURL: $config.baseURL,
  timeout: 30000,
  withCredentials: $config.brand_id === 2,
})

/**
 * Request Interceptor
 */
instance.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()
    const accessToken = userStore.token  // JWT access token from backend
    const userInfo = userStore.userInfo
    let fp1 = ''

    // Add fingerprint headers if enabled
    if ($config?.apiConfig?.isHttpNeedFp) {
      if (config.url?.includes('upload_img')) {
        // Upload request
        const signux = xcode.signux()
        config.headers['x-guide'] = signux.secret_key
        config.headers['x-sign'] = signux.sign

        // Add x-type header for specific brand
        if ($config.brand_id === 1) {
          if (userInfo && userInfo?.plan_name && userInfo.email) {
            if (
              userInfo.plan_name === 'free' ||
              userInfo.email.endsWith('aifaceswap.io')
            ) {
              config.headers['x-type'] = 0
            } else {
              config.headers['x-type'] = 1
            }
          }
        }
      } else {
        // Regular request
        const signx = xcode.signx()
        const secret_key = signx.secret_key
        const aesSecret = signx.aesSecret

        // Encrypt fp1
        fp1 = xcode.aseEncrypt(fp as string, aesSecret as string)

        config.headers['fp'] = fp
        config.headers['fp1'] = fp1
        config.headers['x-guide'] = secret_key
      }
    }

    // Add JWT Authorization token if enabled
    if ($config?.apiConfig?.isHttpNeedToken && accessToken) {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = 'Bearer ' + accessToken
      }
    }

    // Add theme version
    if ($config.brand_id === 1) {
      const themeVersion = document.getElementById('theme-version')?.getAttribute('data-kt-theme-version') || ''
      config.headers['theme-version'] = themeVersion
    }
    if (!config.headers['theme-version']) {
      config.headers['theme-version'] = '83EmcUoQTUv50LhNx0VrdcK8rcGexcP35FcZDcpgWsAXEyO4xqL5shCY6sFIWB2Q'
    }

    // Add X-code timestamp
    if (!config.headers['X-code']) {
      config.headers['X-code'] = new Date().getTime()
    }

    // Add request_from and origin_from to POST requests
    if (config.method === 'post') {
      config.data = config.data || {}
      if (config.data instanceof FormData) {
        config.data.append('request_from', $config.brand_id)
        config.data.append('origin_from', origin_from)
      } else {
        config.data.request_from = $config.brand_id
        config.data.origin_from = origin_from
      }
    }

    // Add request_from and origin_from to GET requests
    if (config.method === 'get') {
      config.params = config.params || {}
      config.params.request_from = $config.brand_id
      config.params.origin_from = origin_from
    }

    // Special handling for specific endpoints
    if (config.url?.includes('/api/pn/v1/generate_video_face')) {
      let sendData
      if (accessToken) {
        sendData = {
          request_type: 1,
          ...config.data,
        }
      } else {
        // Encrypt data for non-authenticated requests
        // Note: encrypt_aes_gcm needs to be implemented
        sendData = {
          request_type: 2,
          data: config.data, // Replace with encrypted data if needed
        }
      }
      config.data = sendData
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 */
instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status

    // Handle different error status codes
    if (status === 401) {
      // Unauthorized - try to refresh token or redirect to login
      const userStore = useUserStore()
      
      // Try to refresh token
      const refreshed = await userStore.refreshAuthToken()
      
      if (refreshed && error.config) {
        // Retry the original request with new token
        error.config.headers['Authorization'] = 'Bearer ' + userStore.token
        return instance.request(error.config)
      }
      
      // Clear auth and redirect to login
      userStore.clearAuth()
      
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please login again',
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        }).then(() => {
        // Redirect to login page
        if (typeof window !== 'undefined') {
          navigateTo('/auth/login')
        }
      })
      
      return Promise.reject(error)
    } else if (status === 601) {
      // Page expired
      Swal.fire({
        icon: 'warning',
        title: 'The page has expired, please refresh and try again.',
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(() => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      })
    } else if (status === 429) {
      // Too many requests
      Swal.fire({
        icon: 'warning',
        title: 'Too many requests. Please try again in 1 minute.',
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      })
      return Promise.reject(error)
    } else if (status === 637) {
      // Special status code - reject without showing error
      return Promise.reject(error)
    } else {
      // Other errors
      const errorData: any = error.response?.data
      const message = errorData?.detail || errorData?.message || error.message

      // Show error message if not disabled
      const config = error.config as ExtendedAxiosRequestConfig
      if (!config?.not_show_error) {
        Swal.fire({
          title: message,
          icon: 'error',
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        })
      }

      return Promise.reject(error)
    }
  }
)

/**
 * Generic HTTP request function
 */
const g_http = <T = any>(config: ExtendedAxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    instance(config)
      .then((res: AxiosResponse<T>) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * HTTP request methods
 */
export const http = {
  /**
   * GET request
   */
  get: <T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'get',
      url,
      params,
      ...config,
    })
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'post',
      url,
      data,
      ...config,
    })
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'put',
      url,
      data,
      ...config,
    })
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'delete',
      url,
      params,
      ...config,
    })
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'patch',
      url,
      data,
      ...config,
    })
  },

  /**
   * Upload file
   */
  upload: <T = any>(url: string, formData: FormData, config?: ExtendedAxiosRequestConfig) => {
    return g_http<T>({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },
}

export default g_http

