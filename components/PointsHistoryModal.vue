<template>
  <!-- Points History Modal -->
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="handleClose"
  >
    <div 
      class="bg-white rounded-lg shadow-primary-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-primary-200">
        <h3 class="text-xl font-semibold text-gray-900">Points History</h3>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-primary-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 flex-1 overflow-y-auto">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="ml-2 text-gray-600">Loading...</span>
        </div>

        <!-- Points List -->
        <div v-if="!loading && pointsHistory.length > 0" class="space-y-1">
          <div 
            v-for="(point, index) in pointsHistory" 
            :key="index"
            class="grid grid-cols-4 gap-4 px-3 py-2 bg-gray-50 rounded hover:bg-primary-50 transition-colors items-center"
          >
            <!-- Icon & Description (Left) -->
            <div class="text-left flex items-center gap-2">
              <div class="text-lg">
                {{ getPointsIcon(point.pointsType) }}
              </div>
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ point.description || 'Points Change' }}
              </p>
            </div>
            
            <!-- Points Type (Center-Left) -->
            <div class="text-left">
              <span class="text-xs text-gray-500">
                {{ getPointsTypeName(point.pointsType) }}
              </span>
            </div>
            
            <!-- Points (Center-Right) -->
            <div class="text-left">
              <span 
                :class="point.points > 0 ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-semibold"
              >
                {{ point.points > 0 ? '+' : '' }}{{ point.points }}
              </span>
            </div>
            
            <!-- Created At (Right) -->
            <div class="text-right">
              <p class="text-xs text-gray-500">
                {{ formatDate(point.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && pointsHistory.length == 0" class="text-center py-8">
          <div class="text-gray-400 text-4xl mb-2">💰</div>
          <p class="text-gray-500">No points history records</p>
        </div>

        <!-- Pagination -->
        <div v-if="pointsHistory.length > 0" class="flex items-center justify-between mt-6 pt-4 border-t border-primary-200">
          <button 
            @click="loadPreviousPage"
            :disabled="currentPage === 1 || loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ currentPage }}
          </span>
          <button 
            @click="loadNextPage"
            :disabled="!hasNextPage || loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/stores/user'
import { useNotification } from '~/utils/useNotification'
import { http } from '~/utils/http'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Composables
const userStore = useUserStore()
const { notify } = useNotification()

// State
const pointsHistory = ref<Array<{
  id: number
  points: number
  pointsType: number
  description: string
  createdAt: string
}>>([])
const loading = ref(false)
const currentPage = ref(1)
const hasNextPage = ref(false)

// Watch for modal show/hide
watch(() => props.show, (newValue) => {
  if (newValue) {
    currentPage.value = 1
    loadPointsHistory()
  } else {
    // Reset state when modal closes
    pointsHistory.value = []
    currentPage.value = 1
    hasNextPage.value = false
  }
})

// Methods
const handleClose = () => {
  emit('close')
}

const loadPointsHistory = async () => {
  if (!userStore.isAuthenticated) return
  
  loading.value = true
  try {
    // 使用http工具调用积分历史API（自动处理指纹校验、token等）
    const response = await http.get<{
      code: number
      msg: string
      data: {
        data: Array<{
          id: number
          userId: number
          points: number
          type: number
          funcType: number
          pointsType: number
          taskId: string
          isApi: number
          extraData: string
          createdAt: string
          updatedAt: string
        }>
        currentPage: number
        pageSize: number
        totalPages: number
        totalRecords: number
        hasNext: boolean
        hasPrevious: boolean
        goldCoins: number
        silverCoins: number
      }
    }>('/api/user/points/history', {
      page: currentPage.value,
      size: 10
    })
    
    if (response.code === 200 && response.data) {
      // 转换数据格式以匹配前端显示
      pointsHistory.value = response.data.data.map(item => ({
        id: item.id,
        points: item.points,
        pointsType: item.pointsType,
        description: item.extraData || getPointsDescription(item.type, item.funcType, item.pointsType),
        createdAt: item.createdAt
      }))
      
      // 同步更新金币银币数量
      if (response.data.goldCoins !== undefined && response.data.silverCoins !== undefined) {
        userStore.setUserInfo({
          ...userStore.userInfo,
          goldCoins: response.data.goldCoins,
          silverCoins: response.data.silverCoins
        })
      }
      
      hasNextPage.value = response.data.hasNext
    } else {
      throw new Error(response.msg || 'Failed to load points history')
    }
  } catch (error) {
    console.error('Failed to load points history:', error)
    // 如果API调用失败，显示空数据
    pointsHistory.value = []
    hasNextPage.value = false
    notify.error('Load Failed', 'Unable to load points history, please try again later')
  } finally {
    loading.value = false
  }
}

const loadNextPage = async () => {
  if (hasNextPage.value && !loading.value) {
    currentPage.value++
    await loadPointsHistory()
  }
}

const loadPreviousPage = async () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--
    await loadPointsHistory()
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // 如果是今天，只显示时间
  if (diffDays === 0) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 如果超过1天，显示完整年月日时分
  if (diffDays >= 1) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 其他情况显示月日
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

// 根据积分类型生成描述
const getPointsDescription = (type: number, funcType: number, pointsType: number): string => {
  // type: 0=消费, 1=增加
  // funcType: 0=支付, 1=任务等
  // pointsType: 0=免费, 1=固定, 2=订阅
  
  if (type === 1) { // 增加积分
    switch (funcType) {
      case 0: // 支付
        return 'Purchase Points'
      case 1: // 任务
        return 'Task Reward'
      case 2: // 签到
        return 'Daily Check-in'
      case 3: // 分享
        return 'Share Reward'
      case 4: // 评论
        return 'Comment Reward'
      case 5: // 邀请
        return 'Invite Friends'
      case 6: // 系统
        return 'System Reward'
      default:
        return 'Points Added'
    }
  } else { // 消费积分
    switch (funcType) {
      case 0: // 阅读
        return 'Read Novel'
      case 1: // 下载
        return 'Download Content'
      case 2: // 购买
        return 'Purchase Service'
      case 3: // 兑换
        return 'Points Exchange'
      default:
        return 'Points Spent'
    }
  }
}

// 根据积分类型获取图标
const getPointsIcon = (pointsType: number): string => {
  switch (pointsType) {
    case 0: // 免费积分（银币）
      return '🥈'
    case 1: // 固定积分（金币）
      return '💰'
    case 2: // 订阅积分
      return '💎'
    default:
      return '🪙'
  }
}

// 根据积分类型获取名称
const getPointsTypeName = (pointsType: number): string => {
  switch (pointsType) {
    case 0: // 免费积分（银币）
      return 'Silver'
    case 1: // 固定积分（金币）
      return 'Gold'
    case 2: // 订阅积分
      return 'Diamond'
    default:
      return 'Points'
  }
}
</script>
