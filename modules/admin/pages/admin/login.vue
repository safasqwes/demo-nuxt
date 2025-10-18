<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔐 Admin Login</h1>
          <p>NovelHub Management System</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="Enter username"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="demo-credentials">
            <strong>Demo Credentials:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>admin123</code>
          </p>
          <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Admin Login - NovelHub',
  meta: [
    {
      name: 'description',
      content: 'Admin login page for NovelHub management system',
    },
  ],
})

const adminStore = useAdminStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const success = await adminStore.login(form.username, form.password)

    if (success) {
      // Redirect to admin dashboard
      router.push('/admin')
    } else {
      errorMessage.value = 'Invalid username or password'
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(() => {
  adminStore.checkAuth()
  if (adminStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  padding: 40px;
  border: 1px solid var(--border-color);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 32px;
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.login-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--overlay-light);
}

.error-message {
  padding: 12px;
  background: rgba(252, 129, 129, 0.1);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  color: var(--color-error);
  font-size: 14px;
  text-align: center;
}

.login-btn {
  padding: 14px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
}

.demo-credentials {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.demo-credentials strong {
  color: var(--text-primary);
}

.demo-credentials code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 28px;
  }
}
</style>

