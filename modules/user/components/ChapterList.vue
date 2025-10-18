<template>
  <div class="chapter-list">
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-lg font-semibold">章节列表</h3>
      <div class="flex gap-2">
        <el-input
          v-model="searchQuery"
          placeholder="搜索章节"
          size="small"
          clearable
          class="w-48"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="sortBy" size="small" class="w-32">
          <el-option label="正序" value="asc" />
          <el-option label="倒序" value="desc" />
        </el-select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <el-loading />
    </div>

    <div v-else-if="filteredChapters.length === 0" class="text-center py-8 text-gray-500">
      暂无章节
    </div>

    <div v-else class="space-y-2">
      <div 
        v-for="chapter in paginatedChapters" 
        :key="chapter.id"
        class="chapter-item bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        :class="{ 'border-l-4 border-blue-500': isCurrentChapter(chapter.id) }"
        @click="selectChapter(chapter)"
      >
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium">{{ chapter.title }}</span>
              <el-tag v-if="chapter.isVip" type="warning" size="small">VIP</el-tag>
              <el-tag v-if="chapter.price > 0" type="info" size="small">
                {{ chapter.price }} 积分
              </el-tag>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatDate(chapter.publishedAt) }} · {{ chapter.wordCount }} 字
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <div v-if="isUnlocked(chapter.id)" class="text-green-600">
              <el-icon><Check /></el-icon>
            </div>
            <div v-else-if="chapter.isVip" class="text-orange-600">
              <el-icon><Lock /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredChapters.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Check, Lock } from '@element-plus/icons-vue'

interface Chapter {
  id: number
  novelId: number
  chapterNumber: number
  title: string
  content: string
  publishedAt: string
  wordCount: number
  isVip?: boolean
  price?: number
}

interface Props {
  chapters: Chapter[]
  currentChapterId?: number
  unlockedChapters?: number[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  unlockedChapters: () => []
})

const emit = defineEmits<{
  select: [chapter: Chapter]
}>()

const searchQuery = ref('')
const sortBy = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = ref(20)

const filteredChapters = computed(() => {
  let filtered = [...props.chapters]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chapter => 
      chapter.title.toLowerCase().includes(query)
    )
  }
  
  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'asc') {
      return a.chapterNumber - b.chapterNumber
    } else {
      return b.chapterNumber - a.chapterNumber
    }
  })
  
  return filtered
})

const paginatedChapters = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredChapters.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredChapters.value.length / pageSize.value)
})

const isCurrentChapter = (chapterId: number) => {
  return props.currentChapterId === chapterId
}

const isUnlocked = (chapterId: number) => {
  return props.unlockedChapters.includes(chapterId)
}

const selectChapter = (chapter: Chapter) => {
  emit('select', chapter)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.chapter-item {
  transition: all 0.2s ease;
}

.chapter-item:hover {
  transform: translateX(4px);
}
</style>

