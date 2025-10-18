<template>
  <div v-if="novel && chapter" class="chapter-page">
    <!-- Chapter Header -->
    <div class="chapter-header">
      <NuxtLink :to="`/novel/${novel.id}`" class="back-link">
        ← Back to {{ novel.title }}
      </NuxtLink>
      
      <h1 class="chapter-title">{{ chapter.title }}</h1>
      
      <div class="chapter-meta">
        <span>📖 {{ chapter.wordCount }} words</span>
        <span>📅 {{ formatDate(chapter.publishedAt) }}</span>
      </div>
    </div>

    <!-- Reading Settings -->
    <div class="reading-settings">
      <div class="settings-group">
        <label>Font Size:</label>
        <div class="font-size-controls">
          <button @click="decreaseFontSize">A-</button>
          <span>{{ fontSize }}px</span>
          <button @click="increaseFontSize">A+</button>
        </div>
      </div>

      <div class="settings-group">
        <label>Background:</label>
        <div class="bg-controls">
          <button
            v-for="bg in backgrounds"
            :key="bg.name"
            @click="currentBg = bg.name"
            :class="{ active: currentBg === bg.name }"
            :style="{ background: bg.color }"
            :title="bg.name"
          />
        </div>
      </div>

      <div class="settings-group">
        <label>Width:</label>
        <select v-model="contentWidth">
          <option value="narrow">Narrow</option>
          <option value="medium">Medium</option>
          <option value="wide">Wide</option>
          <option value="full">Full</option>
        </select>
      </div>
    </div>

    <!-- Chapter Content -->
    <div
      class="chapter-content"
      :class="[`bg-${currentBg}`, `width-${contentWidth}`]"
      :style="{ fontSize: `${fontSize}px` }"
    >
      <div class="content-inner" v-html="formattedContent"></div>
    </div>

    <!-- Chapter Navigation -->
    <div class="chapter-navigation">
      <NuxtLink
        v-if="previousChapter"
        :to="`/novel/${novel.id}/chapter/${previousChapter.id}`"
        class="nav-btn prev"
      >
        ← Previous Chapter
      </NuxtLink>
      <button v-else class="nav-btn prev disabled" disabled>
        ← Previous Chapter
      </button>

      <NuxtLink :to="`/novel/${novel.id}`" class="nav-btn chapter-list">
        📚 Chapter List
      </NuxtLink>

      <NuxtLink
        v-if="nextChapter"
        :to="`/novel/${novel.id}/chapter/${nextChapter.id}`"
        class="nav-btn next"
      >
        Next Chapter →
      </NuxtLink>
      <button v-else class="nav-btn next disabled" disabled>
        Next Chapter →
      </button>
    </div>

    <!-- Quick Navigation Sidebar -->
    <div class="quick-nav">
      <button @click="scrollToTop" class="quick-nav-btn" title="Scroll to Top">
        ⬆️
      </button>
      <button @click="scrollToBottom" class="quick-nav-btn" title="Scroll to Bottom">
        ⬇️
      </button>
      <button @click="toggleSettings" class="quick-nav-btn" title="Settings">
        ⚙️
      </button>
    </div>
  </div>

  <div v-else class="loading-page">
    <p>Loading chapter...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const novelStore = useNovelStore()

const novelId = computed(() => Number(route.params.id))
const chapterId = computed(() => Number(route.params.chapterId))

const novel = computed(() => novelStore.getNovelById(novelId.value))
const chapters = computed(() => novelStore.getNovelChapters(novelId.value))

const chapter = computed(() => {
  return chapters.value.find((c) => c.id === chapterId.value)
})

const currentChapterIndex = computed(() => {
  return chapters.value.findIndex((c) => c.id === chapterId.value)
})

const previousChapter = computed(() => {
  if (currentChapterIndex.value > 0) {
    return chapters.value[currentChapterIndex.value - 1]
  }
  return null
})

const nextChapter = computed(() => {
  if (currentChapterIndex.value < chapters.value.length - 1) {
    return chapters.value[currentChapterIndex.value + 1]
  }
  return null
})

// Reading settings
const fontSize = ref(18)
const currentBg = ref('sepia')
const contentWidth = ref('medium')
const showSettings = ref(false)

const backgrounds = [
  { name: 'white', color: '#ffffff' },
  { name: 'sepia', color: '#f4ecd8' },
  { name: 'light', color: '#e8e8e8' },
  { name: 'dark', color: '#2d2d2d' },
  { name: 'black', color: '#1a1a1a' },
]

const formattedContent = computed(() => {
  if (!chapter.value) return ''
  return chapter.value.content.replace(/\n/g, '<br><br>')
})

// SEO
useHead({
  title: computed(() => 
    chapter.value && novel.value
      ? `${chapter.value.title} - ${novel.value.title} - NovelHub`
      : 'Loading...'
  ),
})

// Load chapters if not loaded
onMounted(async () => {
  if (chapters.value.length === 0) {
    await novelStore.fetchChapters(novelId.value)
  }
  
  // Load reading settings from localStorage
  if (process.client) {
    const savedSettings = localStorage.getItem('reading-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      fontSize.value = settings.fontSize || 18
      currentBg.value = settings.background || 'sepia'
      contentWidth.value = settings.width || 'medium'
    }
  }
})

// Save settings
watch([fontSize, currentBg, contentWidth], () => {
  if (process.client) {
    localStorage.setItem(
      'reading-settings',
      JSON.stringify({
        fontSize: fontSize.value,
        background: currentBg.value,
        width: contentWidth.value,
      })
    )
  }
})

// Font size controls
const increaseFontSize = () => {
  if (fontSize.value < 32) {
    fontSize.value += 2
  }
}

const decreaseFontSize = () => {
  if (fontSize.value > 12) {
    fontSize.value -= 2
  }
}

// Scroll controls
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

// Keyboard navigation
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && previousChapter.value) {
      router.push(`/novel/${novelId.value}/chapter/${previousChapter.value.id}`)
    } else if (e.key === 'ArrowRight' && nextChapter.value) {
      router.push(`/novel/${novelId.value}/chapter/${nextChapter.value.id}`)
    }
  }

  document.addEventListener('keydown', handleKeyPress)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
  })
})

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.chapter-page {
  max-width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Chapter Header */
.chapter-header {
  background: var(--bg-card);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 30px;
  text-align: center;
}

.back-link {
  display: inline-block;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--color-primary-dark);
}

.chapter-title {
  margin: 0 0 15px 0;
  font-size: 28px;
  color: var(--text-primary);
}

.chapter-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Reading Settings */
.reading-settings {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.settings-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-group label {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.font-size-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.font-size-controls button {
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.font-size-controls button:hover {
  background: var(--bg-hover);
}

.font-size-controls span {
  min-width: 50px;
  text-align: center;
  color: var(--text-primary);
  font-weight: 600;
}

.bg-controls {
  display: flex;
  gap: 8px;
}

.bg-controls button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s;
}

.bg-controls button.active {
  border-color: var(--color-primary);
  border-width: 3px;
  transform: scale(1.1);
}

.bg-controls button:hover {
  transform: scale(1.15);
}

.settings-group select {
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}

/* Chapter Content */
.chapter-content {
  padding: 50px 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  transition: all 0.3s;
}

.chapter-content.bg-white {
  background: #ffffff;
  color: #333333;
}

.chapter-content.bg-sepia {
  background: #f4ecd8;
  color: #5c4a3a;
}

.chapter-content.bg-light {
  background: #e8e8e8;
  color: #333333;
}

.chapter-content.bg-dark {
  background: #2d2d2d;
  color: #e0e0e0;
}

.chapter-content.bg-black {
  background: #1a1a1a;
  color: #d0d0d0;
}

.content-inner {
  margin: 0 auto;
  line-height: 2;
  text-align: justify;
}

.chapter-content.width-narrow .content-inner {
  max-width: 600px;
}

.chapter-content.width-medium .content-inner {
  max-width: 800px;
}

.chapter-content.width-wide .content-inner {
  max-width: 1000px;
}

.chapter-content.width-full .content-inner {
  max-width: 100%;
}

/* Chapter Navigation */
.chapter-navigation {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.nav-btn {
  padding: 14px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.nav-btn:hover:not(.disabled) {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nav-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.chapter-list {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

/* Quick Navigation */
.quick-nav {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.quick-nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;
}

.quick-nav-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

.loading-page {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .chapter-header {
    padding: 20px;
  }

  .chapter-title {
    font-size: 22px;
  }

  .reading-settings {
    padding: 15px;
    gap: 15px;
  }

  .settings-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .chapter-content {
    padding: 30px 20px;
  }

  .chapter-navigation {
    grid-template-columns: 1fr;
  }

  .nav-btn.prev {
    order: 1;
  }

  .nav-btn.chapter-list {
    order: 2;
  }

  .nav-btn.next {
    order: 3;
  }

  .quick-nav {
    right: 15px;
    bottom: 15px;
  }

  .quick-nav-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}
</style>

