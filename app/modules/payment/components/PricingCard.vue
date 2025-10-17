<template>
  <div 
    class="pricing-card bg-white rounded-xl shadow-lg p-8 relative transition-all duration-300 hover:shadow-xl"
    :class="{ 'ring-2 ring-blue-500 scale-105': isPopular }"
  >
    <!-- 推荐标签 -->
    <div v-if="isPopular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
      <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
        最受欢迎
      </span>
    </div>
    
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
      <p class="text-gray-600 mb-4">{{ plan.description }}</p>
      
      <div class="mb-4">
        <span class="text-4xl font-bold text-blue-600">${{ (plan.price / 100).toFixed(2) }}</span>
        <span v-if="plan.plan_type === 1" class="text-gray-500">/月</span>
      </div>
      
      <div class="text-lg font-semibold text-green-600 mb-4">
        {{ plan.points.toLocaleString() }} 积分
      </div>
    </div>
    
    <ul class="space-y-3 mb-8">
      <li v-for="feature in plan.features" :key="feature" class="flex items-center">
        <el-icon class="text-green-500 mr-2"><Check /></el-icon>
        <span>{{ feature }}</span>
      </li>
    </ul>
    
    <el-button 
      type="primary" 
      size="large" 
      class="w-full"
      :loading="loading"
      @click="selectPlan"
    >
      {{ plan.plan_type === 1 ? '立即订阅' : '立即购买' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'

interface PaymentPlan {
  id: number
  plan_id: string
  price_id: string
  name: string
  description: string
  price: number
  currency: string
  points: number
  duration_days: number | null
  plan_type: number
  features: string[]
  is_popular?: boolean
}

interface Props {
  plan: PaymentPlan
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  select: [plan: PaymentPlan]
}>()

const isPopular = computed(() => props.plan.is_popular)

const selectPlan = () => {
  emit('select', props.plan)
}
</script>

<style scoped>
.pricing-card {
  transition: transform 0.2s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
}
</style>

