<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to NovelHub</h1>
        <p class="hero-subtitle">Discover thousands of amazing web novels and light novels</p>
        <div class="hero-search">
          <input type="text" placeholder="Search for novels..." class="search-input" />
          <button class="search-btn">Search</button>
        </div>
      </div>
    </section>
    
    <!-- Featured Novels Section -->
    <section class="featured">
      <h2>Featured Novels</h2>
      <p>Coming soon...</p>
    </section>
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
</script>

