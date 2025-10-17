<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🔐 New Password</h1>
          <p>Enter your new password</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="password">New Password</label>
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
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
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

          <button type="submit" class="submit-btn" :disabled="loading || !token">
            <span v-if="loading">Resetting...</span>
            <span v-else>Reset Password</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            <NuxtLink to="/auth/login" class="link">Back to Login</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { http } from '~/shared/utils/http'

// SEO metadata
useHead({
  title: 'Reset Password - NovelHub',
  meta: [
    { name: 'description', content: 'Reset your NovelHub password' },
  ],
})

// State
const { notify } = useNotification()
const router = useRouter()
const route = useRoute()

const token = computed(() => route.query.token as string)

const form = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const showPassword = ref(false)

// Validation
const validateForm = (): boolean => {
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  return true
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return
  if (!token.value) {
    notify.error('Error', 'Invalid or missing reset token')
    return
  }

  loading.value = true

  try {
    const response = await http.post('/api/auth/reset-password', {
      token: token.value,
      password: form.password,
    })

    if (response.success) {
      notify.success('Success', 'Password reset successfully')
      await router.push('/auth/login')
    } else {
      notify.error('Error', response.message || 'Could not reset password')
    }
  } catch (error: any) {
    notify.error('Error', error.message || 'Something went wrong')
  } finally {
    loading.value = false
  }
}

// Check token on mount
onMounted(() => {
  if (!token.value) {
    notify.error('Invalid Link', 'Reset token is missing or invalid')
  }
})
</script>

<style scoped src="~/assets/css/auth-pages.css" />

