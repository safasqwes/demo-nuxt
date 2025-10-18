<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>📚 Welcome to NovelHub</h1>
          <p>Login to access your library</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="Enter your username or email"
              required
              :disabled="loading"
            />
            <span v-if="errors.username" class="error">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox">
              <input v-model="form.remember" type="checkbox" />
              <span>Remember me</span>
            </label>
            <NuxtLink to="/auth/forgot-password" class="link">
              Forgot password?
            </NuxtLink>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <div id="google-signin-button" class="google-btn-container">
            <!-- Google Sign-In button will be rendered here -->
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <NuxtLink to="/auth/register" class="link">Sign up</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
// useNotification is auto-imported by Nuxt

// SEO metadata
useHead({
  title: 'Login - NovelHub',
  meta: [
    { name: 'description', content: 'Login to your NovelHub account to access your novel library' },
  ],
})

// State
const userStore = useUserStore()
const { notify } = useNotification()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const errors = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)

// Validation
const validateForm = (): boolean => {
  errors.username = ''
  errors.password = ''

  if (!form.username) {
    errors.username = 'Username or email is required'
    return false
  }

  if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  return true
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const result = await userStore.login(form.username, form.password)

    if (result.success) {
      notify.success('Welcome!', 'Login successful')
      
      // Redirect to home or intended page
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
    } else {
      notify.error('Login Failed', result.message || 'Invalid credentials')
    }
  } catch (error: any) {
    notify.error('Error', error.message || 'Something went wrong')
  } finally {
    loading.value = false
  }
}

// Google login handler
const handleGoogleLogin = async () => {
  try {
    loading.value = true
    const { $googleAuth } = useNuxtApp()
    
    // Initialize Google Sign-In if not already done
    await $googleAuth.initialize()
    
    // Render the button
    $googleAuth.renderButton('google-signin-button')
    
    notify.info('Google Sign-In', 'Click the Google button above to sign in')
  } catch (error: any) {
    notify.error('Error', 'Failed to initialize Google Sign-In')
  } finally {
    loading.value = false
  }
}

// Check if already logged in and initialize Google Sign-In
onMounted(async () => {
  if (userStore.isAuthenticated) {
    router.push('/')
    return
  }

  // Initialize Google Sign-In with delay to ensure DOM is ready
  setTimeout(async () => {
    try {
      const { $googleAuth } = useNuxtApp()
      console.log('Initializing Google Sign-In...')
      await $googleAuth.initialize()
      console.log('Rendering Google button...')
      $googleAuth.renderButton('google-signin-button')
      console.log('Google Sign-In initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error)
    }
  }, 1000) // 1 second delay
})
</script>

<style scoped src="~/assets/css/auth-pages.css" />

