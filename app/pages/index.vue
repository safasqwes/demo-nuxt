<template>
  <div class="home">
    <!-- Banner Carousel -->
    <BannerCarousel />
    
    <!-- Search Bar -->
    <SearchBar />
    
    <!-- Rankings Section -->
    <div class="rankings-section">
      <RankingList
        title="📊 Monthly Reading Ranking"
        icon="🔥"
        :novels="novelStore.monthlyRanking"
        type="monthly"
      />
      <RankingList
        title="💖 Bookmark Ranking"
        icon="⭐"
        :novels="novelStore.bookmarkRanking"
        type="bookmark"
      />
    </div>
    
    <div class="welcome-card">
      <h2>Welcome to NovelHub!</h2>
      <p class="version">Powered by Nuxt {{ nuxtVersion }}</p>
      
      <div class="features">
        <div class="feature-card">
          <div class="icon">📖</div>
          <h3>Vast Library</h3>
          <p>Access thousands of web novels across various genres and languages</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">🌍</div>
          <h3>Global Content</h3>
          <p>Discover stories from authors around the world, translated for you</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>Fast Reading</h3>
          <p>Lightning-fast page loads and smooth reading experience</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">📱</div>
          <h3>Read Anywhere</h3>
          <p>Responsive design works perfectly on desktop, tablet, and mobile</p>
        </div>
      </div>
      
      <div class="counter-demo">
        <h3>Reading Progress Demo</h3>
        <p class="count">{{ count }}</p>
        <div class="buttons">
          <button @click="increment">Next Chapter +</button>
          <button @click="decrement">Previous -</button>
          <button @click="reset">Reset</button>
        </div>
      </div>

      <div class="api-demo">
        <h3>🔒 API Request Demo (with Fingerprint)</h3>
        <p class="demo-desc">Test API request with automatic fingerprint protection</p>
        <button @click="testApi" :disabled="loading" class="test-btn">
          {{ loading ? 'Loading...' : 'Fetch Novels' }}
        </button>
        
        <div v-if="novels.length > 0" class="novels-list">
          <h4>📚 Novel List ({{ novels.length }} items)</h4>
          <div v-for="novel in novels" :key="novel.id" class="novel-card">
            <div class="novel-header">
              <strong>{{ novel.title }}</strong>
              <span class="rating">⭐ {{ novel.rating }}</span>
            </div>
            <p class="author">By {{ novel.author }} • {{ novel.genre }}</p>
            <p class="chapters">{{ novel.chapters }} chapters • {{ novel.status }}</p>
          </div>
          <div class="fingerprint-info">
            <p>✅ Request sent with fingerprint protection</p>
            <p>📝 Headers: fp, fp1, x-guide automatically added</p>
          </div>
        </div>

        <div v-if="apiError" class="api-error">
          <p>❌ {{ apiError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page SEO metadata
useHead({
  title: 'Home - NovelHub | Read Web Novels & Light Novels',
  meta: [
    {
      name: 'description',
      content: 'Welcome to NovelHub! Discover thousands of web novels across fantasy, cultivation, sci-fi, romance, and more. Lightning-fast reading experience with responsive design.',
    },
    {
      name: 'keywords',
      content: 'web novels home, light novels, online reading, fantasy novels, cultivation stories, novel library',
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Home - NovelHub | Read Web Novels Online',
    },
    {
      property: 'og:description',
      content: 'Discover thousands of web novels across various genres. Fast, beautiful, and user-friendly reading experience.',
    },
    {
      property: 'og:url',
      content: 'https://novelhub.example.com/',
    },
    // Twitter
    {
      name: 'twitter:title',
      content: 'Home - NovelHub | Read Web Novels Online',
    },
    {
      name: 'twitter:description',
      content: 'Discover thousands of web novels across various genres.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://novelhub.example.com/',
    },
  ],
})

// Stores
const novelStore = useNovelStore()

// Component state
const nuxtVersion = '4.1.3'
const count = ref(1)
const loading = ref(false)
const novels = ref<any[]>([])
const apiError = ref('')

// Event handlers for reading progress demo
const increment = () => {
  count.value++
}

const decrement = () => {
  if (count.value > 1) {
    count.value--
  }
}

const reset = () => {
  count.value = 1
}

// API demo - fetch novels with fingerprint protection
const testApi = async () => {
  loading.value = true
  apiError.value = ''
  novels.value = []
  
  try {
    const { http } = await import('~/utils/http')
    const response = await http.get('/novels')
    
    if (response.success) {
      novels.value = response.data.novels
      console.log('✅ API Response:', response)
      console.log('🔒 Fingerprints validated on server')
    }
  } catch (error: any) {
    apiError.value = error.message || 'Request failed'
    console.error('❌ API Error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

/* Rankings Section */
.rankings-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.welcome-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

h2 {
  font-size: 36px;
  margin: 0 0 10px 0;
  color: var(--text-primary);
  text-align: center;
}

.version {
  text-align: center;
  color: var(--color-primary);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: var(--gradient-secondary);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
  font-size: 20px;
}

.feature-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.counter-demo {
  background: var(--gradient-primary);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  color: var(--text-inverse);
}

.counter-demo h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
}

.count {
  font-size: 72px;
  font-weight: bold;
  margin: 20px 0;
  text-shadow: 2px 2px 4px var(--overlay-dark);
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 12px 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: var(--text-inverse);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

button:active {
  transform: translateY(0);
}

.api-demo {
  margin-top: 30px;
  padding: 30px;
  background: var(--gradient-primary);
  border-radius: 10px;
  color: var(--text-inverse);
}

.api-demo h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.demo-desc {
  margin-bottom: 20px;
  opacity: 0.9;
}

.test-btn {
  background: var(--text-inverse);
  color: var(--color-primary);
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.test-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.novels-list {
  margin-top: 25px;
  background: var(--bg-card);
  padding: 20px;
  border-radius: 8px;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.novels-list h4 {
  margin: 0 0 15px 0;
  color: var(--color-primary);
}

.novel-card {
  padding: 15px;
  margin-bottom: 10px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
}

.novel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.novel-header strong {
  color: var(--text-primary);
  font-size: 16px;
}

.rating {
  color: var(--color-accent);
  font-size: 14px;
}

.author {
  margin: 5px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.chapters {
  margin: 5px 0;
  color: var(--text-tertiary);
  font-size: 13px;
}

.fingerprint-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid var(--border-color);
}

.fingerprint-info p {
  margin: 5px 0;
  color: var(--color-success);
  font-size: 13px;
  font-weight: 600;
}

.api-error {
  margin-top: 20px;
  padding: 15px;
  background: var(--overlay-light);
  border-radius: 6px;
  border-left: 3px solid var(--color-error);
}

.api-error p {
  margin: 0;
  color: var(--text-inverse);
}

@media (max-width: 768px) {
  .rankings-section {
    grid-template-columns: 1fr;
  }
}
</style>

