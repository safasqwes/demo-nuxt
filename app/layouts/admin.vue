<template>
  <div class="admin-layout">
    <!-- Admin Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="logo">📚 NovelHub Admin</h1>
        </div>
        <div class="header-right">
          <span class="admin-name">👤 {{ adminStore.currentAdmin?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Admin Sidebar -->
    <aside class="admin-sidebar">
      <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item">
          <span class="icon">📊</span>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/banners" class="nav-item">
          <span class="icon">🖼️</span>
          Banners
        </NuxtLink>
        <NuxtLink to="/" class="nav-item" target="_blank">
          <span class="icon">🏠</span>
          View Site
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const router = useRouter()

const handleLogout = () => {
  adminStore.logout()
  router.push('/admin/login')
}

// Check authentication on mount
onMounted(() => {
  adminStore.checkAuth()
  if (!adminStore.isAuthenticated) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    'header header'
    'sidebar main';
  background: var(--bg-primary);
}

/* Header */
.admin-header {
  grid-area: header;
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 30px;
}

.header-left .logo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.admin-name {
  font-size: 14px;
  font-weight: 600;
}

.logout-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Sidebar */
.admin-sidebar {
  grid-area: sidebar;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: 20px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: var(--bg-hover);
  border-left-color: var(--color-primary);
}

.nav-item.router-link-active {
  background: var(--bg-hover);
  border-left-color: var(--color-primary);
  color: var(--color-primary);
}

.nav-item .icon {
  font-size: 20px;
}

/* Main Content */
.admin-main {
  grid-area: main;
  padding: 30px;
  overflow-y: auto;
  background: var(--bg-primary);
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 60px auto 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'main';
  }

  .admin-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 0;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 10px;
  }

  .nav-item {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .nav-item:hover,
  .nav-item.router-link-active {
    border-left-color: transparent;
    border-bottom-color: var(--color-primary);
  }

  .admin-main {
    padding: 20px;
  }

  .admin-name {
    display: none;
  }
}
</style>

