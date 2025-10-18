<template>
  <div class="novels-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">小说列表</h1>
      
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <el-input
              v-model="searchQuery"
              placeholder="搜索小说名称、作者或标签"
              @keyup.enter="searchNovels"
            >
              <template #append>
                <el-button @click="searchNovels">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">分类:</label>
            <el-select v-model="filters.category" placeholder="全部分类" clearable>
              <el-option label="全部分类" value="" />
              <el-option label="玄幻" value="fantasy" />
              <el-option label="都市" value="urban" />
              <el-option label="历史" value="history" />
              <el-option label="科幻" value="sci-fi" />
            </el-select>
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">状态:</label>
            <el-select v-model="filters.status" placeholder="全部状态" clearable>
              <el-option label="全部状态" value="" />
              <el-option label="连载中" value="ongoing" />
              <el-option label="已完结" value="completed" />
              <el-option label="已停更" value="hiatus" />
            </el-select>
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">排序:</label>
            <el-select v-model="filters.sort" placeholder="默认排序">
              <el-option label="默认排序" value="default" />
              <el-option label="最新更新" value="updated" />
              <el-option label="最多收藏" value="bookmarks" />
              <el-option label="最高评分" value="rating" />
            </el-select>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <el-loading />
      </div>
      
      <div v-else-if="novels.length === 0" class="text-center py-12">
        <el-empty description="没有找到相关小说">
          <el-button type="primary" @click="resetFilters">
            重置筛选
          </el-button>
        </el-empty>
      </div>
      
      <div v-else>
        <!-- 小说网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <NovelCard
            v-for="novel in novels" 
            :key="novel.id"
            :novel="novel"
            @view="viewNovel"
            @start-reading="startReading"
            @toggle-bookmark="toggleBookmark"
          />
        </div>
        
        <!-- 分页 -->
        <div class="flex justify-center">
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Star, Collection } from '@element-plus/icons-vue'

// 定义小说类型
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
}

const router = useRouter()
const loading = ref(false)
const novels = ref<Novel[]>([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const searchQuery = ref('')

const filters = ref({
  category: '',
  status: '',
  sort: 'default'
})

// 获取小说列表
const fetchNovels = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取小说列表
    // const response = await $fetch('/api/novels', {
    //   query: {
    //     page: currentPage.value,
    //     size: pageSize.value,
    //     search: searchQuery.value,
    //     category: filters.value.category,
    //     status: filters.value.status,
    //     sort: filters.value.sort
    //   }
    // })
    // novels.value = response.data
    // total.value = response.total
    
    // 模拟数据
    novels.value = [
      {
        id: 1,
        title: 'Martial Peak',
        author: 'Momo',
        cover: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=400&fit=crop',
        description: 'The journey to the martial peak is a lonely, solitary and long one. In the face of adversity, you must survive and remain unyielding.',
        genre: 'Cultivation',
        status: 'ongoing',
        totalChapters: 3000,
        totalViews: 15000000,
        monthlyViews: 850000,
        totalBookmarks: 125000,
        rating: 4.5,
        lastUpdated: '2025-10-12T10:00:00.000Z',
        tags: ['Cultivation', 'Action', 'Adventure', 'Martial Arts']
      },
      {
        id: 2,
        title: 'Tales of Demons and Gods',
        author: 'Mad Snail',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
        description: 'Killed by a Sage Emperor and reborn as his 13 year old self, Nie Li was given a second chance at life.',
        genre: 'Fantasy',
        status: 'ongoing',
        totalChapters: 500,
        totalViews: 12000000,
        monthlyViews: 720000,
        totalBookmarks: 98000,
        rating: 4.7,
        lastUpdated: '2025-10-11T15:30:00.000Z',
        tags: ['Fantasy', 'Reincarnation', 'Magic', 'Adventure']
      }
    ]
    total.value = 2
  } catch (error) {
    ElMessage.error('获取小说列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索小说
const searchNovels = () => {
  currentPage.value = 1
  fetchNovels()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    category: '',
    status: '',
    sort: 'default'
  }
  currentPage.value = 1
  fetchNovels()
}

// 查看小说详情
const viewNovel = (novelId: number) => {
  router.push(`/novel/${novelId}`)
}

// 开始阅读
const startReading = (novelId: number) => {
  router.push(`/novel/${novelId}/chapter/1`)
}

// 切换收藏
const toggleBookmark = async (novelId: number) => {
  try {
    // TODO: 调用API切换收藏状态
    // await $fetch(`/api/user/bookshelf/${novelId}`, { method: 'POST' })
    
    ElMessage.success('已添加到书架')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchNovels()
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    'ongoing': 'success',
    'completed': 'info',
    'hiatus': 'warning'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'ongoing': '连载中',
    'completed': '已完结',
    'hiatus': '已停更'
  }
  return texts[status] || '未知'
}

// 监听筛选条件变化
watch([() => filters.value.category, () => filters.value.status, () => filters.value.sort], () => {
  currentPage.value = 1
  fetchNovels()
})

onMounted(() => {
  fetchNovels()
})

// SEO
useHead({
  title: '小说列表 - NovelHub',
  meta: [
    { name: 'description', content: '浏览和发现精彩的小说内容' }
  ]
})
</script>

<style scoped>
.novels-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

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

