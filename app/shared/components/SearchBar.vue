<template>
  <div class="search-bar">
    <form @submit.prevent="handleSearch" class="search-form">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for novels, authors, or genres..."
        class="search-input"
        @focus="showSuggestions = true"
        @blur="handleBlur"
      />
      <button type="submit" class="search-button">
        🔍 Search
      </button>
    </form>

    <!-- Search Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <NuxtLink
        v-for="novel in suggestions"
        :key="novel.id"
        :to="`/novel/${novel.id}`"
        class="suggestion-item"
        @mousedown.prevent="goToNovel(novel.id)"
      >
        <img :src="novel.cover" :alt="novel.title" class="suggestion-cover" />
        <div class="suggestion-info">
          <h4>{{ novel.title }}</h4>
          <p>{{ novel.author }} • {{ novel.genre }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const novelStore = useNovelStore()
const router = useRouter()

const searchQuery = ref('')
const showSuggestions = ref(false)

const suggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  return novelStore.novels
    .filter(
      (novel) =>
        novel.title.toLowerCase().includes(query) ||
        novel.author.toLowerCase().includes(query) ||
        novel.genre.toLowerCase().includes(query)
    )
    .slice(0, 5)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    showSuggestions.value = false
  }
}

const goToNovel = (id: number) => {
  router.push(`/novel/${id}`)
  showSuggestions.value = false
  searchQuery.value = ''
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 40px;
}

.search-form {
  display: flex;
  gap: 12px;
  background: var(--bg-card);
  padding: 8px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.search-form:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-button {
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Suggestions Dropdown */
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 100;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  transition: background 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: var(--bg-hover);
}

.suggestion-cover {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  min-width: 0;
}

.suggestion-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    gap: 8px;
  }

  .search-button {
    width: 100%;
  }
}
</style>

