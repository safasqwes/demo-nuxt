<template>
  <div class="history-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">阅读历史</h1>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else-if="history.length === 0" class="text-center py-12">
        <el-empty description="还没有阅读记录">
          <el-button type="primary" @click="$router.push('/novels')">
            开始阅读
          </el-button>
        </el-empty>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="item in history" 
          :key="item.id"
          class="history-item bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex gap-4">
            <img 
              :src="item.novel.cover" 
              :alt="item.novel.title"
              class="w-16 h-20 object-cover rounded"
            />
            
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-lg">{{ item.novel.title }}</h3>
                <span class="text-sm text-gray-500">{{ formatDate(item.read_time) }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-2">{{ item.novel.author }}</p>
              
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>第{{ item.chapter.chapter_number }}章: {{ item.chapter.title }}</span>
                <span>阅读时长: {{ formatDuration(item.read_duration) }}</span>
                <span>进度: {{ item.read_progress }}%</span>
              </div>
              
              <div class="flex gap-2">
                <el-button 
                  type="primary" 
                  size="small"
                  @click="continueReading(item.novel.id, item.chapter.id)"
                >
                  继续阅读
                </el-button>
                <el-button 
                  size="small"
                  @click="viewNovel(item.novel.id)"
                >
                  小说详情
                </el-button>
                <el-button 
                  size="small"
                  @click="removeHistory(item.id)"
                >
                  删除记录
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="flex justify-center mt-8">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 定义历史记录类型
interface HistoryItem {
  id: number
  novel: {
    id: number
    title: string
    author: string
    cover: string
  }
  chapter: {
    id: number
    chapter_number: number
    title: string
  }
  read_time: string
  read_duration: number
  read_progress: number
}

const router = useRouter()
const loading = ref(false)
const history = ref<HistoryItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取阅读历史
const fetchHistory = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取阅读历史
    // const response = await $fetch('/api/user/history', {
    //   query: { page: currentPage.value, size: pageSize.value }
    // })
    // history.value = response.data
    // total.value = response.total
    
    // 模拟数据
    history.value = [
      {
        id: 1,
        novel: {
          id: 1,
          title: 'Martial Peak',
          author: 'Momo',
          cover: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=400&fit=crop'
        },
        chapter: {
          id: 15,
          chapter_number: 15,
          title: 'Chapter 15: A New Beginning'
        },
        read_time: '2025-10-15T10:30:00Z',
        read_duration: 1800, // 30分钟
        read_progress: 85
      },
      {
        id: 2,
        novel: {
          id: 2,
          title: 'Tales of Demons and Gods',
          author: 'Mad Snail',
          cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop'
        },
        chapter: {
          id: 8,
          chapter_number: 8,
          title: 'Chapter 8: The Journey Starts'
        },
        read_time: '2025-10-14T15:20:00Z',
        read_duration: 2400, // 40分钟
        read_progress: 100
      }
    ]
    total.value = 2
  } catch (error) {
    ElMessage.error('获取阅读历史失败')
  } finally {
    loading.value = false
  }
}

// 继续阅读
const continueReading = (novelId: number, chapterId: number) => {
  router.push(`/novel/${novelId}/chapter/${chapterId}`)
}

// 查看小说详情
const viewNovel = (novelId: number) => {
  router.push(`/novel/${novelId}`)
}

// 删除历史记录
const removeHistory = async (historyId: number) => {
  try {
    // TODO: 调用API删除历史记录
    // await $fetch(`/api/user/history/${historyId}`, { method: 'DELETE' })
    
    history.value = history.value.filter(item => item.id !== historyId)
    ElMessage.success('已删除记录')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchHistory()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 格式化时长
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

onMounted(() => {
  fetchHistory()
})

// SEO
useHead({
  title: '阅读历史 - NovelHub',
  meta: [
    { name: 'description', content: '查看您的阅读历史记录' }
  ]
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.history-item {
  transition: transform 0.2s ease;
}

.history-item:hover {
  transform: translateY(-1px);
}
</style>

