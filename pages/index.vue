<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.hero.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.hero.subtitle') }}</p>
        <div class="hero-search">
          <input type="text" :placeholder="$t('home.search.placeholder')" class="search-input" />
          <button class="search-btn">{{ $t('home.search.button') }}</button>
        </div>
      </div>
    </section>
    
    <!-- Featured Novels Section -->
    <section class="featured">
      <h2>{{ $t('home.featured.title') }}</h2>
      <p>{{ $t('home.featured.comingSoon') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">

// Page SEO metadata
useHead({
  title: () => $t('home.seo.title'),
  meta: [
    {
      name: 'description',
      content: () => $t('home.seo.description'),
    },
    {
      name: 'keywords',
      content: () => $t('home.seo.keywords'),
    },
    // Open Graph
    {
      property: 'og:title',
      content: () => $t('home.seo.ogTitle'),
    },
    {
      property: 'og:description',
      content: () => $t('home.seo.ogDescription'),
    },
    {
      property: 'og:url',
      content: 'https://novelhub.example.com/',
    },
    // Twitter
    {
      name: 'twitter:title',
      content: () => $t('home.seo.twitterTitle'),
    },
    {
      name: 'twitter:description',
      content: () => $t('home.seo.twitterDescription'),
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
const { useUserStore } = await import('~/stores/user')
const userStore = useUserStore()

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
    const response = await http.get('/api/novels')
    
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

// Initialize user store on mount
onMounted(() => {
  userStore.initFromStorage()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-search {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.search-btn {
  padding: 0.75rem 2rem;
  background: white;
  color: #10b981;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.featured {
  padding: 4rem 0;
  text-align: center;
  background: #f9fafb;
}

.featured h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.featured p {
  font-size: 1.125rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-search {
    flex-direction: column;
  }
  
  .featured h2 {
    font-size: 2rem;
  }
}
</style>

