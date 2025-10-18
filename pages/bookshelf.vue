<template>
  <div class="bookshelf-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">我的书架</h1>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else-if="bookshelf.length === 0" class="text-center py-12">
        <el-empty description="书架空空如也，快去收藏一些小说吧！">
          <el-button type="primary" @click="$router.push('/novels')">
            去发现小说
          </el-button>
        </el-empty>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in bookshelf" 
          :key="item.id"
          class="bookshelf-item bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="relative">
            <img 
              :src="item.novel.cover" 
              :alt="item.novel.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2">
              <el-button 
                type="danger" 
                size="small" 
                circle
                @click="removeFromBookshelf(item.novel.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ item.novel.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ item.novel.author }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>进度: {{ item.read_progress }}%</span>
              <span>{{ formatDate(item.last_read_time) }}</span>
            </div>
            
            <div class="flex gap-2">
              <el-button 
                type="primary" 
                size="small" 
                @click="continueReading(item.novel.id, item.last_read_chapter_id)"
                class="flex-1"
              >
                继续阅读
              </el-button>
              <el-button 
                size="small" 
                @click="viewNovel(item.novel.id)"
              >
                详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

// 定义书架项类型
interface BookshelfItem {
  id: number
  novel: {
    id: number
    title: string
    author: string
    cover: string
  }
  last_read_chapter_id: number | null
  last_read_time: string
  read_progress: number
}

const router = useRouter()
const loading = ref(false)
const bookshelf = ref<BookshelfItem[]>([])

// 获取书架数据
const fetchBookshelf = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取书架数据
    // const response = await $fetch('/api/user/bookshelf')
    // bookshelf.value = response.data
    
    // 模拟数据
    bookshelf.value = [
      {
        id: 1,
        novel: {
          id: 1,
          title: 'Martial Peak',
          author: 'Momo',
          cover: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=400&fit=crop'
        },
        last_read_chapter_id: 15,
        last_read_time: '2025-10-15T10:30:00Z',
        read_progress: 45
      }
    ]
  } catch (error) {
    ElMessage.error('获取书架数据失败')
  } finally {
    loading.value = false
  }
}

// 从书架移除
const removeFromBookshelf = async (novelId: number) => {
  try {
    // TODO: 调用API移除书架
    // await $fetch(`/api/user/bookshelf/${novelId}`, { method: 'DELETE' })
    
    bookshelf.value = bookshelf.value.filter(item => item.novel.id !== novelId)
    ElMessage.success('已从书架移除')
  } catch (error) {
    ElMessage.error('移除失败')
  }
}

// 继续阅读
const continueReading = (novelId: number, chapterId: number | null) => {
  if (chapterId) {
    router.push(`/novel/${novelId}/chapter/${chapterId}`)
  } else {
    router.push(`/novel/${novelId}`)
  }
}

// 查看小说详情
const viewNovel = (novelId: number) => {
  router.push(`/novel/${novelId}`)
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

onMounted(() => {
  fetchBookshelf()
})

// SEO
useHead({
  title: '我的书架 - NovelHub',
  meta: [
    { name: 'description', content: '管理您收藏的小说，继续您的阅读之旅' }
  ]
})
</script>

<style scoped>
.bookshelf-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.bookshelf-item {
  transition: transform 0.2s ease;
}

.bookshelf-item:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

