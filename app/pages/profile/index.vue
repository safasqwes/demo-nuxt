<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <h1>Personal Center</h1>
        <p>Manage your account and preferences</p>
      </div>

      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="Avatar" />
            <span v-else>{{ avatarInitials }}</span>
          </div>
          <button class="change-avatar-btn" @click="handleAvatarChange">
            📷 Change Photo
          </button>
        </div>

        <div class="profile-info">
          <h2>{{ userStore.displayName }}</h2>
          <p class="email">{{ userStore.userEmail }}</p>
          <div class="plan-badge" :class="planClass">
            {{ userStore.userPlan }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="content-section">
          <h3>Profile Information</h3>
          <form @submit.prevent="handleUpdateProfile" class="profile-form">
            <div class="form-group">
              <label>Username</label>
              <input
                v-model="profileForm.username"
                type="text"
                placeholder="Your username"
                :disabled="profileLoading"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                placeholder="your@email.com"
                :disabled="profileLoading"
              />
            </div>

            <div class="form-group">
              <label>Bio</label>
              <textarea
                v-model="profileForm.bio"
                rows="4"
                placeholder="Tell us about yourself..."
                :disabled="profileLoading"
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="profileLoading">
              {{ profileLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="content-section">
          <h3>Change Password</h3>
          <form @submit.prevent="handleChangePassword" class="password-form">
            <div class="form-group">
              <label>Current Password</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="Enter current password"
                :disabled="passwordLoading"
              />
            </div>

            <div class="form-group">
              <label>New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="At least 6 characters"
                :disabled="passwordLoading"
              />
            </div>

            <div class="form-group">
              <label>Confirm New Password</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                :disabled="passwordLoading"
              />
            </div>

            <button type="submit" class="submit-btn" :disabled="passwordLoading">
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>
          </form>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="content-section">
          <h3>Preferences</h3>
          <div class="preferences-grid">
            <div class="preference-item">
              <div class="preference-info">
                <strong>Theme</strong>
                <p>Choose your preferred color theme</p>
              </div>
              <select v-model="appStore.theme" @change="appStore.setTheme(appStore.theme)">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <strong>Notifications</strong>
                <p>Receive updates and alerts</p>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="appStore.settings.enableNotifications"
                  @change="appStore.updateSettings({ enableNotifications: $event.target.checked })"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <strong>Sound Effects</strong>
                <p>Play sounds for actions</p>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="appStore.settings.enableSounds"
                  @change="appStore.updateSettings({ enableSounds: $event.target.checked })"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <strong>Items Per Page</strong>
                <p>Number of items to display</p>
              </div>
              <select
                v-model="appStore.settings.itemsPerPage"
                @change="appStore.updateSettings({ itemsPerPage: parseInt($event.target.value) })"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Account Tab -->
        <div v-if="activeTab === 'account'" class="content-section">
          <h3>Account Management</h3>
          
          <div class="account-info">
            <div class="info-item">
              <strong>Member Since</strong>
              <p>{{ memberSince }}</p>
            </div>
            <div class="info-item">
              <strong>Account Status</strong>
              <p><span class="status-badge active">Active</span></p>
            </div>
            <div class="info-item">
              <strong>Subscription Plan</strong>
              <p>{{ userStore.userPlan }}</p>
            </div>
          </div>

          <div class="danger-zone">
            <h4>Danger Zone</h4>
            <button class="danger-btn" @click="handleDeleteAccount">
              Delete Account
            </button>
            <p class="danger-warning">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth', // Will create this middleware
})

// SEO metadata
useHead({
  title: 'Profile - NovelHub',
  meta: [
    { name: 'description', content: 'Manage your NovelHub profile and settings' },
  ],
})

// Stores
const userStore = useUserStore()
const appStore = useAppStore()
const { notify } = useNotification()
const router = useRouter()

// Tabs
const activeTab = ref('profile')
const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  { id: 'account', label: 'Account', icon: '📊' },
]

// Profile form
const profileForm = reactive({
  username: userStore.userInfo?.username || '',
  email: userStore.userInfo?.email || '',
  bio: userStore.userInfo?.bio || '',
})

const profileLoading = ref(false)

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordLoading = ref(false)

// Computed
const avatarInitials = computed(() => {
  const name = userStore.displayName
  return name.substring(0, 2).toUpperCase()
})

const planClass = computed(() => {
  const plan = userStore.userPlan.toLowerCase()
  if (plan === 'premium' || plan === 'pro') return 'premium'
  return 'free'
})

const memberSince = computed(() => {
  const date = userStore.userInfo?.created_at
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Handlers
const handleAvatarChange = () => {
  notify.info('Coming Soon', 'Avatar upload feature will be available soon')
}

const handleUpdateProfile = async () => {
  profileLoading.value = true

  try {
    const result = await userStore.updateProfile(profileForm)
    
    if (result.success) {
      notify.success('Success', 'Profile updated successfully')
    } else {
      notify.error('Error', result.message || 'Could not update profile')
    }
  } catch (error: any) {
    notify.error('Error', error.message || 'Something went wrong')
  } finally {
    profileLoading.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.currentPassword) {
    notify.error('Error', 'Current password is required')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    notify.error('Error', 'New password must be at least 6 characters')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    notify.error('Error', 'Passwords do not match')
    return
  }

  passwordLoading.value = true

  try {
    // 使用 userStore 的 changePassword 方法对接后端
    const result = await userStore.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    )

    if (result.success) {
      notify.success('Success', result.message || 'Password changed successfully')
      
      // Reset form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      notify.error('Error', result.message || 'Could not change password')
    }
  } catch (error: any) {
    notify.error('Error', error.message || 'Something went wrong')
  } finally {
    passwordLoading.value = false
  }
}

const handleDeleteAccount = async () => {
  const confirmed = confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  )
  
  if (!confirmed) return

  try {
    // 注意：后端暂未实现删除账号接口，此处为预留功能
    notify.info('Coming Soon', 'Account deletion feature will be available soon')
    
    // const { http } = await import('~/utils/http')
    // const response = await http.delete('/user/account')
    // 
    // if (response.success) {
    //   notify.success('Account Deleted', 'Your account has been deleted')
    //   await userStore.logout()
    //   router.push('/')
    // }
  } catch (error: any) {
    notify.error('Error', error.message || 'Could not delete account')
  }
}

// Check authentication and load profile
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  // Fetch latest profile data from backend
  await userStore.fetchProfile()
  
  // Update form with latest data
  profileForm.username = userStore.userInfo?.username || ''
  profileForm.email = userStore.userInfo?.email || ''
  profileForm.bio = userStore.userInfo?.bio || ''
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f7fafc;
  padding: 40px 20px;
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 32px;
}

.profile-header h1 {
  font-size: 32px;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.profile-header p {
  color: #718096;
  margin: 0;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 32px;
  align-items: center;
  margin-bottom: 24px;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  overflow: hidden;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-btn {
  padding: 8px 16px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.change-avatar-btn:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 28px;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.profile-info .email {
  color: #718096;
  margin: 0 0 16px 0;
}

.plan-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.plan-badge.free {
  background: #e2e8f0;
  color: #4a5568;
}

.plan-badge.premium {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
  color: white;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s;
}

.tab:hover {
  border-color: #cbd5e0;
}

.tab.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section h3 {
  font-size: 24px;
  color: #2d3748;
  margin: 0 0 24px 0;
}

.profile-form,
.password-form {
  max-width: 600px;
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
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preferences-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
}

.preference-info strong {
  display: block;
  color: #2d3748;
  margin-bottom: 4px;
}

.preference-info p {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.preference-item select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: 0.4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.account-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.info-item strong {
  display: block;
  color: #718096;
  font-size: 14px;
  margin-bottom: 8px;
}

.info-item p {
  color: #2d3748;
  font-size: 16px;
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.danger-zone {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid #e2e8f0;
}

.danger-zone h4 {
  color: #e53e3e;
  margin: 0 0 16px 0;
}

.danger-btn {
  padding: 10px 20px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.danger-btn:hover {
  background: #c53030;
}

.danger-warning {
  color: #718096;
  font-size: 14px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .tab {
    flex-shrink: 0;
  }
}
</style>

