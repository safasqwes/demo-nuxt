<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>📚 Join NovelHub</h1>
          <p>Create your account to start reading</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="Choose a username"
              required
              :disabled="loading"
            />
            <span v-if="errors.username" class="error">{{ errors.username }}</span>
          </div>

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
                placeholder="At least 6 characters"
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
            <div class="password-strength">
              <div class="strength-bar" :class="passwordStrengthClass">
                <div class="strength-fill"></div>
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Re-enter your password"
              required
              :disabled="loading"
            />
            <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-group">
            <label class="checkbox">
              <input v-model="form.acceptTerms" type="checkbox" required />
              <span>
                I agree to the <a href="/terms" class="link" target="_blank">Terms of Service</a> and
                <a href="/privacy" class="link" target="_blank">Privacy Policy</a>
              </span>
            </label>
            <span v-if="errors.terms" class="error">{{ errors.terms }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || !form.acceptTerms">
            <span v-if="loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <button type="button" class="google-btn" @click="handleGoogleSignup" :disabled="loading">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"></path>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"></path>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"></path>
              <path fill="#EA4335" d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.581C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.582 9 3.582z"></path>
            </svg>
            Sign up with Google
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <NuxtLink to="/auth/login" class="link">Login</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { http } from '~/utils/http'

// SEO metadata
useHead({
  title: 'Register - NovelHub',
  meta: [
    { name: 'description', content: 'Create your NovelHub account to start reading web novels' },
  ],
})

// State
const userStore = useUserStore()
const { notify } = useNotification()
const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const loading = ref(false)
const showPassword = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 10) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength <= 1) return 'weak'
  if (strength <= 2) return 'fair'
  if (strength <= 3) return 'good'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength <= 1) return 'Weak'
  if (strength <= 2) return 'Fair'
  if (strength <= 3) return 'Good'
  return 'Strong'
})

// Validation
const validateForm = (): boolean => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.terms = ''

  if (!form.username || form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return false
  }

  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores'
    return false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
    return false
  }

  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  if (!form.acceptTerms) {
    errors.terms = 'You must accept the terms and conditions'
    return false
  }

  return true
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const response = await http.post('/auth/register', {
      username: form.username,
      email: form.email,
      password: form.password,
    })

    if (response.success) {
      // Auto login after registration
      userStore.setToken(response.data.token, response.data.refreshToken)
      userStore.setUserInfo(response.data.user)
      
      notify.success('Welcome!', 'Account created successfully')
      await router.push('/')
    } else {
      notify.error('Registration Failed', response.message || 'Could not create account')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    notify.error('Error', message)
  } finally {
    loading.value = false
  }
}

// Google signup handler
const handleGoogleSignup = () => {
  notify.info('Coming Soon', 'Google sign-up will be available soon')
}

// Check if already logged in
onMounted(() => {
  if (userStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped src="~/assets/css/auth-pages.css" />
<style scoped>
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  width: 0%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-bar.weak .strength-fill {
  width: 25%;
  background: #f56565;
}

.strength-bar.fair .strength-fill {
  width: 50%;
  background: #ed8936;
}

.strength-bar.good .strength-fill {
  width: 75%;
  background: #48bb78;
}

.strength-bar.strong .strength-fill {
  width: 100%;
  background: #38a169;
}

.strength-text {
  font-size: 12px;
  color: #718096;
}

.form-group .checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.form-group .checkbox input {
  margin-top: 2px;
  flex-shrink: 0;
}

.form-group .checkbox span {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
}
</style>

