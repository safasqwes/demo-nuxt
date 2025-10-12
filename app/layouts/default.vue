<template>
  <div class="layout">
    <!-- Site Header with Navigation -->
    <header class="header" role="banner">
      <div class="container">
        <NuxtLink to="/" class="logo">📚 NovelHub</NuxtLink>
        <nav role="navigation" aria-label="Main navigation">
          <NuxtLink to="/" aria-label="Go to home page">Home</NuxtLink>
          <NuxtLink to="/about" aria-label="Learn about NovelHub">About</NuxtLink>
          
          <!-- User Menu -->
          <div v-if="userStore.isAuthenticated" class="user-menu">
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
const userStore = useUserStore()
const { notify } = useNotification()
const router = useRouter()

const showUserMenu = ref(false)

const userInitials = computed(() => {
  const name = userStore.displayName
  return name.substring(0, 2).toUpperCase()
})

const handleLogout = async () => {
  await userStore.logout()
  showUserMenu.value = false
  notify.info('Goodbye', 'You have been logged out')
  router.push('/')
}

// Close dropdown when clicking outside
if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: white;
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
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
}

.header nav a:hover,
.header nav a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.main {
  flex: 1;
  padding: 40px 0;
}

.footer {
  background: #2d3748;
  color: white;
  padding: 20px 0;
  text-align: center;
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
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: #667eea;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  color: #2d3748;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 15px;
  text-align: left;
}

.dropdown a:hover,
.dropdown button:hover {
  background: #f7fafc;
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
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-register {
  color: #667eea;
  background: white;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

