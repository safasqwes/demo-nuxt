<template>
  <div class="admin-dashboard">
    <h1 class="page-title">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-content">
          <h3>Total Banners</h3>
          <p class="stat-number">{{ bannerStore.allBanners.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Active Banners</h3>
          <p class="stat-number">{{ bannerStore.activeBanners.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Total Users</h3>
          <p class="stat-number">1,234</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>Total Novels</h3>
          <p class="stat-number">5</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <NuxtLink to="/admin/banners" class="action-card">
          <span class="action-icon">🖼️</span>
          <span class="action-title">Manage Banners</span>
          <span class="action-desc">Add, edit, or remove homepage banners</span>
        </NuxtLink>

        <a href="/" target="_blank" class="action-card">
          <span class="action-icon">🏠</span>
          <span class="action-title">View Website</span>
          <span class="action-desc">Open the main website in a new tab</span>
        </a>
      </div>
    </div>

    <!-- Recent Banners -->
    <div class="recent-section">
      <h2>Recent Banners</h2>
      <div class="recent-banners">
        <div
          v-for="banner in recentBanners"
          :key="banner.id"
          class="banner-preview"
        >
          <img :src="banner.image" :alt="banner.title" />
          <div class="banner-info">
            <h4>{{ banner.title }}</h4>
            <span :class="['status', { active: banner.active }]">
              {{ banner.active ? '✓ Active' : '✗ Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Dashboard - Admin - NovelHub',
})

const bannerStore = useBannerStore()

const recentBanners = computed(() => {
  return bannerStore.allBanners.slice(0, 3)
})

onMounted(() => {
  bannerStore.fetchBanners()
})
</script>

<style scoped>
.admin-dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--bg-card);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 48px;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
  color: var(--text-primary);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: var(--gradient-primary);
  padding: 30px;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.action-icon {
  font-size: 40px;
}

.action-title {
  font-size: 20px;
  font-weight: bold;
}

.action-desc {
  font-size: 14px;
  opacity: 0.9;
}

/* Recent Banners */
.recent-section {
  margin-bottom: 40px;
}

.recent-section h2 {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.recent-banners {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.banner-preview {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.banner-preview:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.banner-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.banner-info {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-info h4 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
}

.status.active {
  background: rgba(104, 211, 145, 0.2);
  color: var(--color-success);
}

@media (max-width: 768px) {
  .stats-grid,
  .actions-grid,
  .recent-banners {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>

