<template>
  <div class="points-balance">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ balance.points.toLocaleString() }}</div>
        <div class="text-gray-600">总积分</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl font-bold text-green-600 mb-2">{{ balance.fixed_points.toLocaleString() }}</div>
        <div class="text-gray-600">永久积分</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl font-bold text-purple-600 mb-2">{{ balance.sub_points_left.toLocaleString() }}</div>
        <div class="text-gray-600">订阅积分</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl font-bold text-orange-600 mb-2">{{ balance.free_points.toLocaleString() }}</div>
        <div class="text-gray-600">免费积分</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PointsBalance {
  points: number
  fixed_points: number
  sub_points: number
  sub_points_left: number
  free_points: number
  claimed_days: number
  claimed_at: string
}

interface Props {
  balance: PointsBalance
}

defineProps<Props>()
</script>

