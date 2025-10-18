<template>
  <div class="daily-checkin bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">每日签到</h2>
      <el-tag v-if="!canCheckIn" type="success">今日已签到</el-tag>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
          <el-icon class="text-white text-2xl"><Gift /></el-icon>
        </div>
        <div class="text-sm text-gray-600">连续签到 {{ claimedDays }} 天</div>
      </div>
      
      <div class="flex-1">
        <div class="text-sm text-gray-600 mb-2">
          今日可获得积分: <span class="font-semibold text-orange-600">+{{ dailyPoints }}</span>
        </div>
        <div class="text-xs text-gray-500">连续签到可获得更多积分奖励</div>
      </div>
      
      <el-button 
        type="primary" 
        size="large"
        :disabled="!canCheckIn"
        :loading="checkingIn"
        @click="handleCheckIn"
      >
        {{ canCheckIn ? '立即签到' : '今日已签到' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Gift } from '@element-plus/icons-vue'

interface Props {
  claimedDays: number
  lastClaimedAt: string
  checkingIn: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  checkIn: []
}>()

const canCheckIn = computed(() => {
  const lastClaimed = new Date(props.lastClaimedAt)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  lastClaimed.setHours(0, 0, 0, 0)
  
  return lastClaimed.getTime() < today.getTime()
})

const dailyPoints = computed(() => {
  const days = props.claimedDays
  if (days < 7) return 50
  if (days < 30) return 100
  return 200
})

const handleCheckIn = () => {
  if (canCheckIn.value) {
    emit('checkIn')
  }
}
</script>

