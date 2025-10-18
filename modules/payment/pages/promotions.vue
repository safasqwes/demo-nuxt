<template>
  <div class="promotions-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">促销活动</h1>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else class="space-y-8">
        <!-- 当前活动 -->
        <div>
          <h2 class="text-2xl font-semibold mb-6">当前活动</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="promotion in activePromotions" 
              :key="promotion.id"
              class="promotion-card bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div class="relative">
                <img 
                  :src="promotion.banner_image" 
                  :alt="promotion.title"
                  class="w-full h-48 object-cover"
                />
                <div class="absolute top-4 left-4">
                  <el-tag type="danger" size="large">{{ promotion.discount }}% OFF</el-tag>
                </div>
                <div class="absolute top-4 right-4">
                  <el-tag type="success" size="small">进行中</el-tag>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">{{ promotion.title }}</h3>
                <p class="text-gray-600 mb-4">{{ promotion.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span>活动时间:</span>
                    <span>{{ formatDateRange(promotion.start_time, promotion.end_time) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>适用套餐:</span>
                    <span>{{ promotion.applicable_plans.join(', ') }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>使用次数:</span>
                    <span>{{ promotion.usage_limit || '无限制' }}</span>
                  </div>
                </div>
                
                <el-button 
                  type="primary" 
                  class="w-full"
                  @click="usePromotion(promotion)"
                >
                  立即使用
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 即将开始的活动 -->
        <div v-if="upcomingPromotions.length > 0">
          <h2 class="text-2xl font-semibold mb-6">即将开始</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="promotion in upcomingPromotions" 
              :key="promotion.id"
              class="promotion-card bg-white rounded-lg shadow-md overflow-hidden opacity-75"
            >
              <div class="relative">
                <img 
                  :src="promotion.banner_image" 
                  :alt="promotion.title"
                  class="w-full h-48 object-cover"
                />
                <div class="absolute top-4 left-4">
                  <el-tag type="warning" size="large">{{ promotion.discount }}% OFF</el-tag>
                </div>
                <div class="absolute top-4 right-4">
                  <el-tag type="info" size="small">即将开始</el-tag>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">{{ promotion.title }}</h3>
                <p class="text-gray-600 mb-4">{{ promotion.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span>开始时间:</span>
                    <span>{{ formatDate(promotion.start_time) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>结束时间:</span>
                    <span>{{ formatDate(promotion.end_time) }}</span>
                  </div>
                </div>
                
                <el-button 
                  type="info" 
                  class="w-full"
                  disabled
                >
                  活动未开始
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 已结束的活动 -->
        <div v-if="expiredPromotions.length > 0">
          <h2 class="text-2xl font-semibold mb-6">已结束</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="promotion in expiredPromotions" 
              :key="promotion.id"
              class="promotion-card bg-white rounded-lg shadow-md overflow-hidden opacity-60"
            >
              <div class="relative">
                <img 
                  :src="promotion.banner_image" 
                  :alt="promotion.title"
                  class="w-full h-48 object-cover grayscale"
                />
                <div class="absolute top-4 left-4">
                  <el-tag type="info" size="large">{{ promotion.discount }}% OFF</el-tag>
                </div>
                <div class="absolute top-4 right-4">
                  <el-tag type="info" size="small">已结束</el-tag>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">{{ promotion.title }}</h3>
                <p class="text-gray-600 mb-4">{{ promotion.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between text-sm">
                    <span>活动时间:</span>
                    <span>{{ formatDateRange(promotion.start_time, promotion.end_time) }}</span>
                  </div>
                </div>
                
                <el-button 
                  type="info" 
                  class="w-full"
                  disabled
                >
                  活动已结束
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 定义促销活动类型
interface Promotion {
  id: number
  title: string
  description: string
  discount: number
  banner_image: string
  start_time: string
  end_time: string
  applicable_plans: string[]
  usage_limit?: number
  status: 'active' | 'upcoming' | 'expired'
}

const router = useRouter()
const loading = ref(false)
const promotions = ref<Promotion[]>([])

// 计算属性：当前活动
const activePromotions = computed(() => {
  return promotions.value.filter(p => p.status === 'active')
})

// 计算属性：即将开始的活动
const upcomingPromotions = computed(() => {
  return promotions.value.filter(p => p.status === 'upcoming')
})

// 计算属性：已结束的活动
const expiredPromotions = computed(() => {
  return promotions.value.filter(p => p.status === 'expired')
})

// 获取促销活动列表
const fetchPromotions = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取促销活动列表
    // const response = await $fetch('/api/promotions')
    // promotions.value = response.data
    
    // 模拟数据
    promotions.value = [
      {
        id: 1,
        title: '新用户专享',
        description: '首次购买享受8折优惠，限时3天',
        discount: 20,
        banner_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
        start_time: '2025-10-15T00:00:00Z',
        end_time: '2025-10-18T23:59:59Z',
        applicable_plans: ['基础套餐', '高级套餐'],
        usage_limit: 1,
        status: 'active'
      },
      {
        id: 2,
        title: '双十一大促销',
        description: '全场套餐5折优惠，错过再等一年',
        discount: 50,
        banner_image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=200&fit=crop',
        start_time: '2025-11-11T00:00:00Z',
        end_time: '2025-11-11T23:59:59Z',
        applicable_plans: ['所有套餐'],
        status: 'upcoming'
      },
      {
        id: 3,
        title: '国庆节特惠',
        description: '庆祝国庆，所有套餐7折优惠',
        discount: 30,
        banner_image: 'https://images.unsplash.com/photo-1506905925346-14b5e6d4a4c0?w=400&h=200&fit=crop',
        start_time: '2025-10-01T00:00:00Z',
        end_time: '2025-10-07T23:59:59Z',
        applicable_plans: ['所有套餐'],
        status: 'expired'
      }
    ]
  } catch (error) {
    ElMessage.error('获取促销活动失败')
  } finally {
    loading.value = false
  }
}

// 使用促销活动
const usePromotion = (promotion: Promotion) => {
  // TODO: 实现促销活动使用逻辑
  ElMessage.info('正在跳转到套餐选择页面...')
  router.push(`/pricing?promotion=${promotion.id}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期范围
const formatDateRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return `${start.toLocaleDateString('zh-CN')} - ${end.toLocaleDateString('zh-CN')}`
}

onMounted(() => {
  fetchPromotions()
})

// SEO
useHead({
  title: '促销活动 - NovelHub',
  meta: [
    { name: 'description', content: '查看最新的促销活动和优惠信息' }
  ]
})
</script>

<style scoped>
.promotions-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.promotion-card {
  transition: transform 0.2s ease;
}

.promotion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>

