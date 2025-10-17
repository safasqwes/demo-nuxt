<template>
  <div class="chapter-reader">
    <!-- 阅读器头部 -->
    <div class="reader-header bg-white shadow-sm p-4 mb-4 rounded-lg">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <el-button @click="goBack" size="small">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <h1 class="text-xl font-semibold">{{ chapter?.title }}</h1>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- 字体大小控制 -->
          <el-button-group>
            <el-button size="small" @click="decreaseFontSize">A-</el-button>
            <el-button size="small" @click="resetFontSize">A</el-button>
            <el-button size="small" @click="increaseFontSize">A+</el-button>
          </el-button-group>
          
          <!-- 主题切换 -->
          <el-button size="small" @click="toggleTheme">
            <el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
          </el-button>
          
          <!-- 设置 -->
          <el-button size="small" @click="showSettings = true">
            <el-icon><Setting /></el-icon>
          </el-button>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="mt-4">
        <el-progress 
          :percentage="readingProgress" 
          :show-text="false"
          stroke-width="4"
        />
        <div class="flex justify-between text-sm text-gray-500 mt-1">
          <span>{{ Math.round(readingProgress) }}%</span>
          <span>{{ currentPosition }}/{{ totalLength }}</span>
        </div>
      </div>
    </div>

    <!-- 阅读内容 -->
    <div 
      class="reader-content bg-white rounded-lg shadow-sm p-8 mb-4"
      :class="[
        `text-${fontSize}`,
        isDark ? 'dark-theme' : 'light-theme'
      ]"
      @scroll="handleScroll"
      ref="contentRef"
    >
      <div v-if="loading" class="text-center py-12">
        <el-loading />
      </div>
      
      <div v-else-if="!chapter" class="text-center py-12 text-gray-500">
        章节不存在
      </div>
      
      <div v-else class="prose max-w-none">
        <div v-html="formattedContent"></div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="reader-navigation flex justify-between">
      <el-button 
        :disabled="!hasPrevious"
        @click="goToPrevious"
      >
        <el-icon><ArrowLeft /></el-icon>
        上一章
      </el-button>
      
      <el-button 
        :disabled="!hasNext"
        @click="goToNext"
      >
        下一章
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog v-model="showSettings" title="阅读设置" width="400px">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">字体大小</label>
          <el-slider 
            v-model="fontSizeValue" 
            :min="12" 
            :max="24" 
            :step="2"
            @change="updateFontSize"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">行间距</label>
          <el-slider 
            v-model="lineHeight" 
            :min="1.2" 
            :max="2.0" 
            :step="0.1"
            @change="updateLineHeight"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">主题</label>
          <el-radio-group v-model="theme" @change="updateTheme">
            <el-radio label="light">浅色</el-radio>
            <el-radio label="dark">深色</el-radio>
            <el-radio label="sepia">护眼</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ArrowLeft, ArrowRight, Moon, Sunny, Setting } from '@element-plus/icons-vue'

interface Chapter {
  id: number
  novelId: number
  chapterNumber: number
  title: string
  content: string
  publishedAt: string
  wordCount: number
}

interface Props {
  chapter: Chapter | null
  loading?: boolean
  hasPrevious?: boolean
  hasNext?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasPrevious: false,
  hasNext: false
})

const emit = defineEmits<{
  back: []
  previous: []
  next: []
  progress: [progress: number]
}>()

const contentRef = ref<HTMLElement>()
const showSettings = ref(false)
const fontSizeValue = ref(16)
const lineHeight = ref(1.6)
const theme = ref('light')
const currentPosition = ref(0)
const totalLength = ref(0)

const fontSize = computed(() => {
  const sizes = {
    12: 'xs',
    14: 'sm', 
    16: 'base',
    18: 'lg',
    20: 'xl',
    22: '2xl',
    24: '3xl'
  }
  return sizes[fontSizeValue.value as keyof typeof sizes] || 'base'
})

const isDark = computed(() => theme.value === 'dark')

const readingProgress = computed(() => {
  if (totalLength.value === 0) return 0
  return Math.min((currentPosition.value / totalLength.value) * 100, 100)
})

const formattedContent = computed(() => {
  if (!props.chapter?.content) return ''
  
  // 简单的段落格式化
  return props.chapter.content
    .split('\n')
    .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
    .join('')
})

const handleScroll = () => {
  if (!contentRef.value) return
  
  const element = contentRef.value
  const scrollTop = element.scrollTop
  const scrollHeight = element.scrollHeight - element.clientHeight
  
  currentPosition.value = scrollTop
  totalLength.value = scrollHeight
  
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  emit('progress', progress)
}

const goBack = () => {
  emit('back')
}

const goToPrevious = () => {
  emit('previous')
}

const goToNext = () => {
  emit('next')
}

const decreaseFontSize = () => {
  if (fontSizeValue.value > 12) {
    fontSizeValue.value -= 2
    updateFontSize()
  }
}

const increaseFontSize = () => {
  if (fontSizeValue.value < 24) {
    fontSizeValue.value += 2
    updateFontSize()
  }
}

const resetFontSize = () => {
  fontSizeValue.value = 16
  updateFontSize()
}

const updateFontSize = () => {
  if (contentRef.value) {
    contentRef.value.style.fontSize = `${fontSizeValue.value}px`
  }
}

const updateLineHeight = () => {
  if (contentRef.value) {
    contentRef.value.style.lineHeight = lineHeight.value.toString()
  }
}

const updateTheme = () => {
  // 主题切换逻辑
  if (contentRef.value) {
    contentRef.value.className = contentRef.value.className
      .replace(/theme-\w+/g, '')
      .trim() + ` theme-${theme.value}`
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  updateTheme()
}

watch(() => props.chapter, () => {
  nextTick(() => {
    currentPosition.value = 0
    totalLength.value = 0
  })
})
</script>

<style scoped>
.reader-content {
  min-height: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.light-theme {
  background-color: #ffffff;
  color: #333333;
}

.dark-theme {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

.theme-sepia {
  background-color: #f4f1ea;
  color: #5c4b37;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>

