<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-900 to-gray-50">
    <!-- Site Header with Navigation -->
    <header class="bg-gradient-to-r from-green-800 to-green-900 text-white py-5 shadow-lg" role="banner">
      <div class="max-w-6xl mx-auto px-5 flex flex-row justify-between items-center gap-2">
        <!-- Logo with link to home -->
        <NuxtLink to="/" class="flex items-center gap-3 text-white no-underline transition-opacity hover:opacity-90">
          <!-- SVG Logo -->
          <img src="/logo.svg" alt="NovelHub Logo" class="w-10 h-10 md:w-12 md:h-12" />
          <!-- Website name - hidden on mobile, visible on desktop -->
          <span class="text-2xl md:text-3xl font-bold hidden md:block">NovelHub</span>
        </NuxtLink>
        
        <!-- Navigation Links - Desktop -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/" class="text-white hover:text-green-200 transition-colors">Home</NuxtLink>
          <NuxtLink to="/pricing" class="text-white hover:text-green-200 transition-colors">Pricing</NuxtLink>
          <NuxtLink to="/payment-products" class="text-white hover:text-green-200 transition-colors">Buy Content</NuxtLink>
          <NuxtLink to="/web3-payment" class="text-white hover:text-green-200 transition-colors">Web3 Pay</NuxtLink>
        </nav>
        
        <!-- Mobile Menu Button -->
        <button 
          class="md:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
          @click="toggleMobileMenu"
          aria-label="Toggle mobile menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <!-- User Menu / Auth Buttons (aligned to the right) -->
        <div class="flex items-center gap-2">
          <!-- Coins Display (when logged in) -->
          <div v-if="userStore && userStore.isAuthenticated" class="flex items-center gap-3 mr-2">
            <!-- Gold Coins -->
            <div class="flex items-center gap-1 bg-yellow-100 bg-opacity-20 px-2 py-1 rounded-md">
              <CurrencyDollarIcon class="w-4 h-4 text-yellow-500" />
              <span class="font-semibold text-sm">{{ userStore.goldCoins }}</span>
            </div>
            
            <!-- Silver Coins -->
            <div class="flex items-center gap-1 bg-secondary-100 bg-opacity-20 px-2 py-1 rounded-md">
              <CurrencyDollarIcon class="w-4 h-4 text-secondary-200" />
              <span class="font-semibold text-sm">{{ userStore.silverCoins }}</span>
            </div>
          </div>
          
          <!-- User Menu (when logged in) -->
          <div v-if="userStore && userStore.isAuthenticated" class="relative user-menu">
            <button 
              class="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-4 md:py-2 bg-white bg-opacity-20 border-0 rounded-md text-white cursor-pointer transition-all hover:bg-opacity-30 hover:shadow-primary"
              @click="toggleUserMenu"
            >
              <img 
                v-if="userStore.userInfo?.avatar" 
                :src="userStore.userInfo.avatar" 
                :alt="userStore.displayName"
                class="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 border-gray-300"
              />
              <span 
                v-if="!(userStore && userStore.isAuthenticated)"
                class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs md:text-sm"
              >
                {{ userInitials }}
              </span>
              <span class="font-semibold max-w-20 md:max-w-30 overflow-hidden text-ellipsis whitespace-nowrap hidden sm:block text-sm md:text-base">
                {{ userStore.displayName }}
              </span>
              <span class="text-xs transition-transform hidden sm:block">▼</span>
            </button>
            <div 
              v-if="showUserMenu" 
              class="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-primary-lg border border-primary-200 min-w-48 z-[9999] overflow-hidden"
            >
              <button 
                @click="handleDailyClaim"
                :disabled="userStore.claimLoading || userStore.hasClaimedToday"
                class="flex items-center gap-2 w-full px-4 py-3 bg-none border-0 text-gray-700 no-underline cursor-pointer transition-colors text-left hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="userStore.claimLoading">⏳</span>
                <span v-if="userStore.hasClaimedToday">✅</span>
                <span v-if="!userStore.hasClaimedToday">🎁</span>
                <span>{{ userStore.hasClaimedToday ? 'Claimed Today' : 'Daily Claim' }}</span>
                <span v-if="!userStore.hasClaimedToday && userStore.claimInfo" class="text-xs text-success-600 ml-auto">
                  +{{ userStore.claimInfo.todayPoints }}
                </span>
              </button>
              <button 
                @click="handleShowPointsHistory"
                class="flex items-center gap-2 w-full px-4 py-3 bg-none border-0 text-gray-700 no-underline cursor-pointer transition-colors text-left hover:bg-primary-50"
              >
                💰 Points History
              </button>
              <button 
                @click="handleLogout"
                class="flex items-center gap-2 w-full px-4 py-3 bg-none border-0 text-gray-700 no-underline cursor-pointer transition-colors text-left hover:bg-primary-50"
              >
                🚪 Logout
              </button>
            </div>
          </div>
          
          <!-- Auth Buttons (when not logged in) -->
          <div v-if="!(userStore && userStore.isAuthenticated)" class="flex gap-2">
            <!-- Google 登录按钮容器 -->
            <div id="google-signin-button" class="flex items-center gap-0 md:gap-2">
              <!-- 当插件未加载时显示备用按钮 -->
              <button 
                v-if="!googleAuthReady"
                class="flex items-center gap-0 md:gap-2 px-2 py-2 md:px-4 md:py-2.5 bg-white border border-primary-300 rounded-lg text-gray-700 text-xs md:text-sm font-medium cursor-pointer transition-all shadow-sm hover:bg-primary-50 hover:border-primary-400 hover:shadow-primary hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="userStore.loading"
                @click="() => handleGoogleLoginFallback(useRuntimeConfig().public.googleClientId, (response) => console.log('Fallback login:', response), notify)"
              >
                <svg class="flex-shrink-0" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="hidden md:inline">
                  {{ userStore.loading ? 'Signing in...' : 'Login with Google' }}
                </span>
              </button>
            </div>
            
            <!-- Web3登录组件 -->
            <!-- <Web3Login @login-success="handleWeb3LoginSuccess" /> -->
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden bg-green-800 border-t border-green-700">
        <div class="px-5 py-4 space-y-3">
          <NuxtLink 
            to="/" 
            class="block text-white hover:text-green-200 transition-colors py-2"
            @click="closeMobileMenu"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/pricing" 
            class="block text-white hover:text-green-200 transition-colors py-2"
            @click="closeMobileMenu"
          >
            Pricing
          </NuxtLink>
          <NuxtLink 
            to="/payment-products" 
            class="block text-white hover:text-green-200 transition-colors py-2"
            @click="closeMobileMenu"
          >
            Buy Content
          </NuxtLink>
          <NuxtLink 
            to="/web3-payment" 
            class="block text-white hover:text-green-200 transition-colors py-2"
            @click="closeMobileMenu"
          >
            Web3 Pay
          </NuxtLink>
        </div>
      </div>
    </header>
    
    <!-- Main Content Area -->
    <main class="flex-1 py-10 bg-gradient-to-br from-green-50 to-gray-50" role="main" id="main-content">
      <div class="max-w-6xl mx-auto px-5">
        <slot />
      </div>
    </main>
    
    <!-- Site Footer -->
    <AppFooter />

    <!-- Points History Modal -->
    <PointsHistoryModal 
      :show="showPointsModal" 
      @close="handleClosePointsModal" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/composables/useNotification'
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { 
  handleGoogleLoginFallback
} from '~/utils/googleAuth'


const userStore = useUserStore()
const { notify } = useNotification()
const router = useRouter()
const { $googleAuth } = useNuxtApp()

const showUserMenu = ref(false)
const googleAuthReady = ref(false)
const showPointsModal = ref(false)
const showMobileMenu = ref(false)

// Initialize user store from localStorage
onMounted(() => {
  userStore.initFromStorage()
})

const userInitials = computed(() => {
  const name = userStore?.displayName || 'User'
  return name.substring(0, 2).toUpperCase()
})

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Daily claim handler
const handleDailyClaim = async () => {
  if (!userStore.isAuthenticated) return
  
  try {
    const result = await userStore.claimDailyPoints()
    
    if (result.success) {
      const data = result.data
      notify.success('Claim Successful!', `Earned ${data.points} silver coins, ${data.streakDays} days streak`)
      showUserMenu.value = false
    } else {
      // 检查是否是已领取状态
      if (result.alreadyClaimed) {
        notify.info('Already Claimed Today', result.message || 'You have already claimed silver coins today')
      } else {
        notify.error('Claim Failed', result.message || 'Claim failed, please try again later')
      }
    }
  } catch (error) {
    console.error('Daily claim error:', error)
    notify.error('Claim Failed', 'Network error, please try again later')
  }
}

// Points History Methods
const handleShowPointsHistory = async () => {
  showUserMenu.value = false
  showPointsModal.value = true
}

const handleLogout = async () => {
  if (!userStore) return
  
  try {
    // 关闭用户菜单
    showUserMenu.value = false
    
    // 清理积分历史相关状态
    showPointsModal.value = false
    
    // 清理 Google 登录状态
    $googleAuth.signOut()
    
    // 调用用户 store 的 logout 方法
    await userStore.logout()
    
    // 显示登出成功消息
    notify.info('Goodbye', 'You have been logged out')
    
    // 跳转到首页
    await router.push('/')
    
    // 清理浏览器历史记录（可选）
    // window.history.replaceState({}, '', '/')
    
  } catch (error) {
    console.error('Logout error:', error)
    // 即使出错也要清理本地状态
    if (userStore) {
      userStore.clearAuth()
    }
    notify.error('Logout Error', 'An error occurred during logout')
    await router.push('/')
  }
}

// Web3登录成功处理
const handleWeb3LoginSuccess = () => {
  // Web3登录成功后的处理逻辑
  console.log('Web3登录成功')
  // 可以在这里添加其他登录成功后的逻辑
}

const handleClosePointsModal = () => {
  showPointsModal.value = false
}

// Close dropdown when clicking outside
onMounted(async () => {
  // 初始化 Google 登录插件
  try {
    await $googleAuth.initialize()
    googleAuthReady.value = true
    
    // 渲染 Google 登录按钮
    nextTick(async () => {
      const success = await $googleAuth.renderButtonWithRetry('google-signin-button', {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }, 3, 100)
      
      if (!success) {
        console.error('Failed to render Google button after all retries')
      }
    })
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error)
    googleAuthReady.value = false
  }
  
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
})
</script>


