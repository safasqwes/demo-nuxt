<template>
  <div 
    class="novel-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
    @click="viewNovel"
  >
    <div class="relative">
      <img 
        :src="novel.cover" 
        :alt="novel.title"
        class="w-full h-64 object-cover"
      />
      <div class="absolute top-2 right-2">
        <el-tag 
          :type="getStatusType(novel.status)"
          size="small"
        >
          {{ getStatusText(novel.status) }}
        </el-tag>
      </div>
      <div v-if="isVip" class="absolute top-2 left-2">
        <el-tag type="warning" size="small">VIP</el-tag>
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ novel.title }}</h3>
      <p class="text-gray-600 text-sm mb-2">{{ novel.author }}</p>
      
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span>{{ novel.totalChapters }} 章</span>
        <span>{{ novel.totalViews.toLocaleString() }} 阅读</span>
        <div class="flex items-center">
          <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
          {{ novel.rating }}
        </div>
      </div>
      
      <p class="text-sm text-gray-600 line-clamp-3 mb-4">{{ novel.description }}</p>
      
      <div class="flex flex-wrap gap-1 mb-4">
        <el-tag 
          v-for="tag in novel.tags.slice(0, 3)" 
          :key="tag"
          size="small"
          type="info"
        >
          {{ tag }}
        </el-tag>
      </div>
      
      <div class="flex gap-2">
        <el-button 
          type="primary" 
          size="small" 
          class="flex-1"
          @click.stop="startReading"
        >
          开始阅读
        </el-button>
        <el-button 
          size="small"
          @click.stop="toggleBookmark"
        >
          <el-icon><Bookmark /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, Bookmark } from '@element-plus/icons-vue'

interface Novel {
  id: number
  title: string
  author: string
  cover: string
  description: string
  genre: string
  status: 'ongoing' | 'completed' | 'hiatus'
  totalChapters: number
  totalViews: number
  monthlyViews: number
  totalBookmarks: number
  rating: number
  lastUpdated: string
  tags: string[]
  isVip?: boolean
}

interface Props {
  novel: Novel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [novel: Novel]
  read: [novel: Novel]
  bookmark: [novel: Novel]
}>()

const isVip = computed(() => props.novel.isVip)

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    'ongoing': 'success',
    'completed': 'info',
    'hiatus': 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'ongoing': '连载中',
    'completed': '已完结',
    'hiatus': '已停更'
  }
  return texts[status] || '未知'
}

const viewNovel = () => {
  emit('view', props.novel)
}

const startReading = () => {
  emit('read', props.novel)
}

const toggleBookmark = () => {
  emit('bookmark', props.novel)
}
</script>

<style scoped>
.novel-card {
  transition: transform 0.2s ease;
}

.novel-card:hover {
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

