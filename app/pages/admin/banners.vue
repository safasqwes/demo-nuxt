<template>
  <div class="banner-management">
    <div class="page-header">
      <h1 class="page-title">Banner Management</h1>
      <button @click="openAddModal" class="btn-primary">
        ➕ Add New Banner
      </button>
    </div>

    <!-- Banners Table -->
    <div class="table-container">
      <table class="banners-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Title</th>
            <th>Link</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in bannerStore.allBanners" :key="banner.id">
            <td>
              <img :src="banner.image" :alt="banner.title" class="banner-thumbnail" />
            </td>
            <td class="title-cell">{{ banner.title }}</td>
            <td class="link-cell">{{ banner.link || '-' }}</td>
            <td class="order-cell">{{ banner.order }}</td>
            <td>
              <span :class="['status-badge', { active: banner.active }]">
                {{ banner.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="openEditModal(banner)" class="btn-icon" title="Edit">
                ✏️
              </button>
              <button @click="toggleStatus(banner)" class="btn-icon" title="Toggle Status">
                {{ banner.active ? '🔒' : '✅' }}
              </button>
              <button @click="deleteBanner(banner)" class="btn-icon btn-danger" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="bannerStore.allBanners.length === 0" class="empty-state">
        <p>No banners found. Add your first banner!</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingBanner ? 'Edit Banner' : 'Add New Banner' }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="saveBanner" class="modal-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Enter banner title"
              required
            />
          </div>

          <div class="form-group">
            <label for="image">Image URL *</label>
            <input
              id="image"
              v-model="form.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
            />
            <div v-if="form.image" class="image-preview">
              <img :src="form.image" alt="Preview" />
            </div>
          </div>

          <div class="form-group">
            <label for="link">Link URL</label>
            <input
              id="link"
              v-model="form.link"
              type="text"
              placeholder="https://example.com or /about"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="order">Order *</label>
              <input
                id="order"
                v-model.number="form.order"
                type="number"
                min="1"
                max="100"
                required
              />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.active" type="checkbox" />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editingBanner ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Banner } from '~/stores/banner'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Banner Management - Admin - NovelHub',
})

const bannerStore = useBannerStore()

const showModal = ref(false)
const editingBanner = ref<Banner | null>(null)

const form = reactive({
  title: '',
  image: '',
  link: '',
  order: 1,
  active: true,
})

// Open add modal
const openAddModal = () => {
  editingBanner.value = null
  resetForm()
  showModal.value = true
}

// Open edit modal
const openEditModal = (banner: Banner) => {
  editingBanner.value = banner
  form.title = banner.title
  form.image = banner.image
  form.link = banner.link || ''
  form.order = banner.order
  form.active = banner.active
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingBanner.value = null
  resetForm()
}

// Reset form
const resetForm = () => {
  form.title = ''
  form.image = ''
  form.link = ''
  form.order = bannerStore.allBanners.length + 1
  form.active = true
}

// Save banner
const saveBanner = async () => {
  try {
    if (editingBanner.value) {
      // Update existing banner
      await bannerStore.updateBanner(editingBanner.value.id, {
        title: form.title,
        image: form.image,
        link: form.link || undefined,
        order: form.order,
        active: form.active,
      })
    } else {
      // Add new banner
      await bannerStore.addBanner({
        title: form.title,
        image: form.image,
        link: form.link || undefined,
        order: form.order,
        active: form.active,
      })
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save banner:', error)
  }
}

// Toggle banner status
const toggleStatus = async (banner: Banner) => {
  await bannerStore.toggleBannerStatus(banner.id)
}

// Delete banner
const deleteBanner = async (banner: Banner) => {
  if (confirm(`Are you sure you want to delete "${banner.title}"?`)) {
    await bannerStore.deleteBanner(banner.id)
  }
}

onMounted(() => {
  bannerStore.fetchBanners()
})
</script>

<style scoped>
.banner-management {
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  margin: 0;
  color: var(--text-primary);
}

.btn-primary {
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  padding: 12px 24px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: var(--bg-hover);
}

/* Table */
.table-container {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.banners-table {
  width: 100%;
  border-collapse: collapse;
}

.banners-table thead {
  background: var(--bg-tertiary);
}

.banners-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.banners-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.banners-table tr:last-child td {
  border-bottom: none;
}

.banner-thumbnail {
  width: 100px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.title-cell {
  font-weight: 600;
  color: var(--text-primary);
}

.link-cell {
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-cell {
  text-align: center;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
}

.status-badge.active {
  background: rgba(104, 211, 145, 0.2);
  color: var(--color-success);
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: var(--bg-hover);
  transform: scale(1.1);
}

.btn-danger:hover {
  background: rgba(252, 129, 129, 0.2);
  border-color: var(--color-error);
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-tertiary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.form-group input[type='text'],
.form-group input[type='url'],
.form-group input[type='number'] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--overlay-light);
}

.image-preview {
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-top: 30px;
}

.checkbox-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .table-container {
    overflow-x: auto;
  }

  .banners-table {
    min-width: 800px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>

