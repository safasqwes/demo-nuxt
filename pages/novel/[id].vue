<template>
  <div v-if="novel" class="novel-detail">
    <!-- Novel Header -->
    <div class="novel-header">
      <img :src="novel.cover" :alt="novel.title" class="novel-cover-large" />
      <div class="novel-header-info">
        <h1 class="novel-title">{{ novel.title }}</h1>
        <p class="novel-author">By {{ novel.author }}</p>
        
        <div class="novel-tags">
          <span v-for="tag in novel.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="novel-stats-grid">
          <div class="stat-item">
            <div class="stat-label">Rating</div>
            <div class="stat-value">⭐ {{ novel.rating }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Status</div>
            <div class="stat-value status-badge" :class="novel.status">
              {{ novel.status }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Chapters</div>
            <div class="stat-value">{{ novel.totalChapters }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Views</div>
            <div class="stat-value">{{ formatNumber(novel.totalViews) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Bookmarks</div>
            <div class="stat-value">{{ formatNumber(novel.totalBookmarks) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Last Updated</div>
            <div class="stat-value">{{ formatDate(novel.lastUpdated) }}</div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="startReading">
            📖 Start Reading
          </button>
          <button class="btn-secondary" @click="toggleBookmark">
            {{ isBookmarked ? '💖 Bookmarked' : '🤍 Add to Bookshelf' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Novel Description -->
    <div class="content-section">
      <h2 class="section-title">📝 Description</h2>
      <div class="description-box">
        <p>{{ novel.description }}</p>
      </div>
    </div>

    <!-- Latest Chapters -->
    <div class="content-section">
      <ChapterList
        :novel-id="novel.id"
        :chapters="novelStore.chapters"
        :loading="novelStore.loading"
        :current-chapter-id="currentChapterId"
        @chapter-select="selectChapter"
      />
    </div>

    <!-- Reader Comments -->
    <div class="content-section">
      <h2 class="section-title">💬 Reader Comments ({{ comments.length }})</h2>
      
      <div class="comment-form">
        <h3>Leave a Comment</h3>
        <textarea
          v-model="newComment"
          placeholder="Share your thoughts about this novel..."
          rows="4"
        ></textarea>
        <div class="comment-form-footer">
          <div class="rating-input">
            <label>Your Rating:</label>
            <div class="stars">
              <button
                v-for="star in 5"
                :key="star"
                @click="newRating = star"
                class="star-btn"
                :class="{ active: star <= newRating }"
              >
                {{ star <= newRating ? '⭐' : '☆' }}
              </button>
            </div>
          </div>
          <button @click="submitComment" class="btn-primary">Submit Comment</button>
        </div>
      </div>

      <div v-if="novelStore.loading" class="loading">Loading comments...</div>
      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <img :src="comment.avatar" :alt="comment.username" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-username">{{ comment.username }}</span>
              <span class="comment-rating">{{ '⭐'.repeat(comment.rating) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-page">
    <p>Loading novel details...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const novelStore = useNovelStore()

const novelId = computed(() => Number(route.params.id))
const novel = computed(() => novelStore.getNovelById(novelId.value))

const showAllChapters = ref(false)
const isBookmarked = ref(false)
const newComment = ref('')
const newRating = ref(5)

const chapters = computed(() => novelStore.getNovelChapters(novelId.value))
const comments = computed(() => novelStore.getNovelComments(novelId.value))

const displayedChapters = computed(() => {
  if (showAllChapters.value) {
    return chapters.value
  }
  return chapters.value.slice(0, 10)
})

// SEO
useHead({
  title: computed(() => novel.value ? `${novel.value.title} - NovelHub` : 'Loading...'),
  meta: [
    {
      name: 'description',
      content: computed(() => novel.value?.description || ''),
    },
  ],
})

// Load data
onMounted(async () => {
  if (novel.value) {
    await Promise.all([
      novelStore.fetchChapters(novelId.value),
      novelStore.fetchComments(novelId.value),
    ])
  }
})

// Actions
const startReading = () => {
  if (chapters.value.length > 0) {
    router.push(`/novel/${novelId.value}/chapter/${chapters.value[0].id}`)
  }
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  // In production, save to backend
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  // In production, send to backend
  console.log('Comment submitted:', { comment: newComment.value, rating: newRating.value })
  
  // Reset form
  newComment.value = ''
  newRating.value = 5
}

// Formatters
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return String(num)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  
  return date.toLocaleDateString()
}
</script>

<style scoped>
.novel-detail {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Novel Header */
.novel-header {
  display: flex;
  gap: 40px;
  background: var(--bg-card);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  margin-bottom: 30px;
}

.novel-cover-large {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  flex-shrink: 0;
}

.novel-header-info {
  flex: 1;
}

.novel-title {
  margin: 0 0 10px 0;
  font-size: 36px;
  color: var(--text-primary);
}

.novel-author {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-secondary);
}

.novel-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.tag {
  padding: 6px 14px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.novel-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px !important;
  text-transform: capitalize;
}

.status-badge.ongoing {
  background: rgba(104, 211, 145, 0.2);
  color: var(--color-success);
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.2);
  color: var(--color-info);
}

.status-badge.hiatus {
  background: rgba(246, 173, 85, 0.2);
  color: var(--color-warning);
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-hover);
}

/* Content Sections */
.content-section {
  background: var(--bg-card);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: var(--text-primary);
}

.toggle-btn {
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background: var(--bg-hover);
}

.description-box {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Chapters List */
.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.chapter-item:hover {
  background: var(--bg-hover);
  border-color: var(--color-primary);
  transform: translateX(5px);
}

.chapter-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.chapter-number {
  font-weight: 600;
  color: var(--color-primary);
}

.chapter-title {
  color: var(--text-primary);
}

.chapter-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* Comments */
.comment-form {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.comment-form h3 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.comment-form textarea {
  width: 100%;
  padding: 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-input label {
  color: var(--text-secondary);
  font-size: 14px;
}

.stars {
  display: flex;
  gap: 5px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.star-btn:hover {
  transform: scale(1.2);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-username {
  font-weight: 600;
  color: var(--text-primary);
}

.comment-rating {
  color: var(--color-accent);
}

.comment-text {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.comment-date {
  font-size: 12px;
  color: var(--text-tertiary);
}

.loading,
.loading-page {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .novel-header {
    flex-direction: column;
    padding: 20px;
  }

  .novel-cover-large {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
  }

  .novel-title {
    font-size: 28px;
  }

  .novel-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .content-section {
    padding: 20px;
  }

  .chapter-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .comment-form-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

