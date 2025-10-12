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
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              required
              :disabled="loading"
            />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
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

          <button type="button" class="google-btn" @click="handleGoogleLogin" :disabled="loading">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"></path>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"></path>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"></path>
              <path fill="#EA4335" d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.581C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.582 9 3.582z"></path>
            </svg>
            Continue with Google
          </button>
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
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)

// Validation
const validateForm = (): boolean => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
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
    const result = await userStore.login(form.email, form.password)

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
const handleGoogleLogin = () => {
  notify.info('Coming Soon', 'Google login will be available soon')
}

// Check if already logged in
onMounted(() => {
  if (userStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped src="~/assets/css/auth-pages.css" />

