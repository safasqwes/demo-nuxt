<template>
  <div class="layout">
    <!-- Site Header with Navigation -->
    <header class="header" role="banner">
      <div class="container">
        <NuxtLink to="/" class="logo">📚 NovelHub</NuxtLink>
        <nav role="navigation" aria-label="Main navigation">
          <NuxtLink to="/" aria-label="Go to home page">Home</NuxtLink>
          <NuxtLink to="/about" aria-label="Learn about NovelHub">About</NuxtLink>
          
          <!-- Theme Toggle - Disabled for now -->
          
          <!-- User Menu -->
          <div v-if="userStore && userStore.isAuthenticated" class="user-menu">
            <button class="user-btn" @click="showUserMenu = !showUserMenu">
              <span class="user-avatar">{{ userInitials }}</span>
              <span class="user-name">{{ userStore.displayName }}</span>
              <span class="arrow">▼</span>
            </button>
            <div v-if="showUserMenu" class="dropdown">
              <NuxtLink to="/profile" @click="showUserMenu = false">
                👤 Profile
              </NuxtLink>
              <button @click="handleLogout">
                🚪 Logout
              </button>
            </div>
          </div>
          
          <!-- Auth Buttons -->
          <div v-else class="auth-buttons">
            <NuxtLink to="/auth/login" class="btn-login">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="btn-register">Sign Up</NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    
    <!-- Main Content Area -->
    <main class="main" role="main" id="main-content">
      <div class="container">
        <slot />
      </div>
    </main>
    
    <!-- Site Footer -->
    <footer class="footer" role="contentinfo">
      <div class="container">
        <p>© 2025 NovelHub - Your Gateway to Amazing Web Novels</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/composables/useNotification'

const userStore = useUserStore()
const { notify } = useNotification()
const router = useRouter()

const showUserMenu = ref(false)

// Initialize user store from localStorage
onMounted(() => {
  userStore.initFromStorage()
})

const userInitials = computed(() => {
  const name = userStore?.displayName || 'User'
  return name.substring(0, 2).toUpperCase()
})

const handleLogout = async () => {
  if (userStore) {
    await userStore.logout()
    showUserMenu.value = false
    notify.info('Goodbye', 'You have been logged out')
    router.push('/')
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 20px 0;
  box-shadow: var(--shadow-md);
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-inverse);
  text-decoration: none;
  margin-bottom: 15px;
  display: block;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 0.9;
}

.header nav {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.header nav a {
  color: var(--text-inverse);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  background: var(--overlay-light);
}

.header nav a:hover,
.header nav a.router-link-active {
  background: var(--overlay-medium);
  transform: translateY(-2px);
}

.main {
  flex: 1;
  padding: 40px 0;
  background: var(--bg-primary);
}

.footer {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.footer p {
  margin: 0;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--overlay-light);
  border: none;
  border-radius: 6px;
  color: var(--text-inverse);
  cursor: pointer;
  transition: all 0.3s;
}

.user-btn:hover {
  background: var(--overlay-medium);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--text-inverse);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.user-name {
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.user-menu .dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown a,
.dropdown button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 15px;
  text-align: left;
}

.dropdown a:hover,
.dropdown button:hover {
  background: var(--bg-hover);
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-login,
.btn-register {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-login {
  color: var(--text-inverse);
  background: var(--overlay-light);
}

.btn-login:hover {
  background: var(--overlay-medium);
}

.btn-register {
  color: var(--color-primary);
  background: var(--text-inverse);
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
  }

  .header nav {
    width: 100%;
  }

  .user-name {
    display: none;
  }
}
</style>

