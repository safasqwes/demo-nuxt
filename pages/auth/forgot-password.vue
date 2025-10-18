<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🔑 Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="auth-form">
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

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading">Sending...</span>
            <span v-else">Send Reset Link</span>
          </button>
        </form>

        <div v-else class="success-message">
          <div class="success-icon">✅</div>
          <h3>Check Your Email</h3>
          <p>
            We've sent a password reset link to <strong>{{ form.email }}</strong>
          </p>
          <p>Please check your inbox and follow the instructions.</p>
          <button @click="resetForm" class="submit-btn">
            Send Another Link
          </button>
        </div>

        <div class="auth-footer">
          <p>
            Remember your password?
            <NuxtLink to="/auth/login" class="link">Back to Login</NuxtLink>
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
  title: 'Forgot Password - NovelHub',
  meta: [
    { name: 'description', content: 'Reset your NovelHub password' },
  ],
})

// State
const { notify } = useNotification()

const form = reactive({
  email: '',
})

const errors = reactive({
  email: '',
})

const loading = ref(false)
const emailSent = ref(false)

// Validation
const validateForm = (): boolean => {
  errors.email = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
    return false
  }

  return true
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const response = await http.post('/api/auth/forgot-password', {
      email: form.email,
    })

    if (response.success) {
      emailSent.value = true
      notify.success('Email Sent', 'Check your inbox for reset instructions')
    } else {
      notify.error('Error', response.message || 'Could not send reset email')
    }
  } catch (error: any) {
    notify.error('Error', error.message || 'Something went wrong')
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  emailSent.value = false
  form.email = ''
}
</script>

<style scoped src="~/assets/css/auth-pages.css" />
<style scoped>
.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.success-message h3 {
  color: #2d3748;
  margin: 0 0 16px 0;
  font-size: 24px;
}

.success-message p {
  color: #4a5568;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.success-message strong {
  color: #667eea;
}

.success-message .submit-btn {
  margin-top: 24px;
}
</style>

