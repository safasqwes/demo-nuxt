<template>
  <div class="search-page">
    <h1 class="page-title">Search Results</h1>

    <!-- Search Bar -->
    <SearchBar />

    <!-- Search Query Info -->
    <div v-if="searchQuery" class="search-info">
      <p>
        Showing results for: <strong>"{{ searchQuery }}"</strong>
        <span class="result-count">({{ novelStore.searchResults.length }} novels found)</span>
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="novelStore.loading" class="loading">
      <p>Searching...</p>
    </div>

    <!-- Search Results -->
    <div v-else-if="novelStore.searchResults.length > 0" class="search-results">
      <div
        v-for="novel in novelStore.searchResults"
        :key="novel.id"
        class="novel-card"
      >
        <NuxtLink :to="`/novel/${novel.id}`" class="novel-link">
          <img :src="novel.cover" :alt="novel.title" class="novel-cover" />
          <div class="novel-info">
            <h3 class="novel-title">{{ novel.title }}</h3>
            <p class="novel-author">By {{ novel.author }}</p>
            <p class="novel-description">{{ truncateText(novel.description, 150) }}</p>
            <div class="novel-meta">
              <span class="genre-tag">{{ novel.genre }}</span>
              <span class="status-badge" :class="novel.status">
                {{ novel.status }}
              </span>
              <span class="rating">⭐ {{ novel.rating }}</span>
            </div>
            <div class="novel-stats">
              <span>📖 {{ novel.totalChapters }} chapters</span>
              <span>👁️ {{ formatViews(novel.totalViews) }}</span>
              <span>💖 {{ formatBookmarks(novel.totalBookmarks) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !novelStore.loading" class="no-results">
      <p class="no-results-icon">🔍</p>
      <h2>No novels found</h2>
      <p>Try different keywords or browse our popular novels below</p>
      
      <div class="suggestions">
        <h3>Popular Novels</h3>
        <div class="suggestion-list">
          <NuxtLink
            v-for="novel in popularNovels"
            :key="novel.id"
            :to="`/novel/${novel.id}`"
            class="suggestion-card"
          >
            <img :src="novel.cover" :alt="novel.title" />
            <span>{{ novel.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="initial-state">
      <p class="search-icon">🔎</p>
      <h2>Start your search</h2>
      <p>Enter keywords to find your favorite novels</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Search - NovelHub',
  meta: [
    {
      name: 'description',
      content: 'Search for novels, authors, and genres on NovelHub',
    },
  ],
})

const route = useRoute()
const novelStore = useNovelStore()

const searchQuery = ref('')

// Popular novels for suggestions
const popularNovels = computed(() => {
  return novelStore.monthlyRanking.slice(0, 6)
})

// Watch for query parameter changes
watch(
  () => route.query.q,
  async (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery
      await novelStore.searchNovels(newQuery)
    }
  },
  { immediate: true }
)

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return String(views)
}

const formatBookmarks = (bookmarks: number): string => {
  if (bookmarks >= 1000000) {
    return `${(bookmarks / 1000000).toFixed(1)}M`
  } else if (bookmarks >= 1000) {
    return `${(bookmarks / 1000).toFixed(1)}K`
  }
  return String(bookmarks)
}
</script>

<style scoped>
.search-page {
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

.page-title {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
}

.search-info {
  margin-bottom: 30px;
  text-align: center;
}

.search-info p {
  font-size: 16px;
  color: var(--text-secondary);
}

.search-info strong {
  color: var(--text-primary);
  font-size: 18px;
}

.result-count {
  margin-left: 10px;
  color: var(--color-primary);
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

/* Search Results */
.search-results {
  display: grid;
  gap: 20px;
}

.novel-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s;
}

.novel-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.novel-link {
  display: flex;
  gap: 20px;
  padding: 20px;
  text-decoration: none;
}

.novel-cover {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.novel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.novel-title {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 600;
}

.novel-author {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.novel-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.novel-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.genre-tag {
  padding: 4px 12px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
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

.rating {
  color: var(--color-accent);
  font-weight: 600;
}

.novel-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--text-tertiary);
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.no-results h2 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.suggestions {
  max-width: 800px;
  margin: 0 auto;
}

.suggestions h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.suggestion-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.3s;
}

.suggestion-card:hover {
  transform: scale(1.05);
}

.suggestion-card img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.suggestion-card span {
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Initial State */
.initial-state {
  text-align: center;
  padding: 80px 20px;
}

.search-icon {
  font-size: 100px;
  margin-bottom: 20px;
}

.initial-state h2 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.initial-state p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .novel-link {
    flex-direction: column;
  }

  .novel-cover {
    width: 100%;
    height: auto;
    aspect-ratio: 3/2;
  }

  .novel-title {
    font-size: 20px;
  }

  .novel-stats {
    flex-wrap: wrap;
  }

  .suggestion-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>

