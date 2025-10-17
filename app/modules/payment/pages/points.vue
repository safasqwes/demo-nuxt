<template>
  <div class="points-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">积分中心</h1>
      
      <!-- 积分概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ pointsBalance.points.toLocaleString() }}</div>
          <div class="text-gray-600">总积分</div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ pointsBalance.fixed_points.toLocaleString() }}</div>
          <div class="text-gray-600">永久积分</div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ pointsBalance.sub_points_left.toLocaleString() }}</div>
          <div class="text-gray-600">订阅积分</div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ pointsBalance.free_points.toLocaleString() }}</div>
          <div class="text-gray-600">免费积分</div>
        </div>
      </div>
      
      <!-- 每日签到 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">每日签到</h2>
          <el-tag v-if="!canCheckIn" type="success">今日已签到</el-tag>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
              <el-icon class="text-white text-2xl"><Present /></el-icon>
            </div>
            <div class="text-sm text-gray-600">连续签到 {{ pointsBalance.claimed_days }} 天</div>
          </div>
          
          <div class="flex-1">
            <div class="text-sm text-gray-600 mb-2">今日可获得积分: <span class="font-semibold text-orange-600">+{{ getDailyPoints() }}</span></div>
            <div class="text-xs text-gray-500">连续签到可获得更多积分奖励</div>
          </div>
          
          <el-button 
            type="primary" 
            size="large"
            :disabled="!canCheckIn"
            :loading="checkingIn"
            @click="dailyCheckIn"
          >
            {{ canCheckIn ? '立即签到' : '今日已签到' }}
          </el-button>
        </div>
      </div>
      
      <!-- 积分明细 -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">积分明细</h2>
            <div class="flex gap-2">
              <el-select v-model="filters.type" placeholder="类型筛选" clearable>
                <el-option label="全部" value="" />
                <el-option label="获得积分" value="1" />
                <el-option label="消耗积分" value="0" />
              </el-select>
              <el-button @click="fetchPointsHistory">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <el-loading />
        </div>
        
        <div v-else-if="pointsHistory.length === 0" class="text-center py-12">
          <el-empty description="暂无积分记录" />
        </div>
        
        <div v-else class="divide-y">
          <div 
            v-for="record in pointsHistory" 
            :key="record.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <el-icon 
                    :class="record.type === 1 ? 'text-green-500' : 'text-red-500'"
                  >
                    <component :is="record.type === 1 ? 'Plus' : 'Minus'" />
                  </el-icon>
                  <span class="font-medium">{{ record.extra_data || getTypeText(record.func_type) }}</span>
                </div>
                <div class="text-sm text-gray-500">{{ formatDate(record.created_at) }}</div>
              </div>
              
              <div class="text-right">
                <div 
                  class="text-lg font-semibold"
                  :class="record.type === 1 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ record.type === 1 ? '+' : '-' }}{{ record.points.toLocaleString() }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ record.points_type === 0 ? '免费积分' : '永久积分' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="p-6 border-t">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Present, Refresh, Plus, Minus } from '@element-plus/icons-vue'

// 定义积分余额类型
interface PointsBalance {
  points: number
  fixed_points: number
  sub_points: number
  sub_points_left: number
  free_points: number
  claimed_days: number
  claimed_at: string
}

// 定义积分明细类型
interface PointsDetail {
  id: number
  points: number
  type: number // 0-消耗 1-增加
  func_type: number
  points_type: number // 0-免费积分 1-永久积分
  extra_data: string
  created_at: string
}

const loading = ref(false)
const checkingIn = ref(false)
const pointsBalance = ref<PointsBalance>({
  points: 0,
  fixed_points: 0,
  sub_points: 0,
  sub_points_left: 0,
  free_points: 0,
  claimed_days: 0,
  claimed_at: '1970-01-01T00:00:00Z'
})

const pointsHistory = ref<PointsDetail[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filters = ref({
  type: ''
})

// 是否可以签到
const canCheckIn = computed(() => {
  const lastClaimed = new Date(pointsBalance.value.claimed_at)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  lastClaimed.setHours(0, 0, 0, 0)
  
  return lastClaimed.getTime() < today.getTime()
})

// 获取积分余额
const fetchPointsBalance = async () => {
  try {
    // TODO: 调用API获取积分余额
    // const response = await $fetch('/api/user/points')
    // pointsBalance.value = response.data
    
    // 模拟数据
    pointsBalance.value = {
      points: 1250,
      fixed_points: 1000,
      sub_points: 500,
      sub_points_left: 250,
      free_points: 0,
      claimed_days: 5,
      claimed_at: '2025-10-15T08:00:00Z'
    }
  } catch (error) {
    ElMessage.error('获取积分余额失败')
  }
}

// 获取积分明细
const fetchPointsHistory = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取积分明细
    // const response = await $fetch('/api/user/points/detail', {
    //   query: {
    //     page: currentPage.value,
    //     size: pageSize.value,
    //     type: filters.value.type
    //   }
    // })
    // pointsHistory.value = response.data
    // total.value = response.total
    
    // 模拟数据
    pointsHistory.value = [
      {
        id: 1,
        points: 100,
        type: 1,
        func_type: 1,
        points_type: 1,
        extra_data: '购买高级套餐',
        created_at: '2025-10-15T10:30:00Z'
      },
      {
        id: 2,
        points: 50,
        type: 1,
        func_type: 2,
        points_type: 0,
        extra_data: '每日签到',
        created_at: '2025-10-15T08:00:00Z'
      },
      {
        id: 3,
        points: 20,
        type: 0,
        func_type: 3,
        points_type: 1,
        extra_data: '解锁VIP章节',
        created_at: '2025-10-14T15:20:00Z'
      }
    ]
    total.value = 3
  } catch (error) {
    ElMessage.error('获取积分明细失败')
  } finally {
    loading.value = false
  }
}

// 每日签到
const dailyCheckIn = async () => {
  if (!canCheckIn.value) return
  
  checkingIn.value = true
  try {
    // TODO: 调用API进行签到
    // const response = await $fetch('/api/user/points/claim', { method: 'POST' })
    // pointsBalance.value = response.data
    
    const dailyPoints = getDailyPoints()
    pointsBalance.value.points += dailyPoints
    pointsBalance.value.free_points += dailyPoints
    pointsBalance.value.claimed_days += 1
    pointsBalance.value.claimed_at = new Date().toISOString()
    
    ElMessage.success(`签到成功！获得 ${dailyPoints} 积分`)
    
    // 刷新积分明细
    fetchPointsHistory()
  } catch (error) {
    ElMessage.error('签到失败')
  } finally {
    checkingIn.value = false
  }
}

// 获取每日签到积分
const getDailyPoints = () => {
  const days = pointsBalance.value.claimed_days
  if (days < 7) return 50
  if (days < 30) return 100
  return 200
}

// 获取类型文本
const getTypeText = (funcType: number) => {
  const types = {
    1: '购买套餐',
    2: '每日签到',
    3: '解锁章节',
    4: '邀请好友',
    5: '完成任务'
  }
  return types[funcType] || '其他'
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchPointsHistory()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchPointsBalance()
  fetchPointsHistory()
})

// SEO
useHead({
  title: '积分中心 - NovelHub',
  meta: [
    { name: 'description', content: '管理您的积分余额，查看积分明细和使用记录' }
  ]
})
</script>

<style scoped>
.points-page {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>

