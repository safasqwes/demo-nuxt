<template>
  <div class="banner-carousel" v-if="activeBanners.length > 0">
    <div class="carousel-container">
      <!-- Banner Items -->
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          v-for="banner in activeBanners"
          :key="banner.id"
          class="carousel-item"
        >
          <component :is="banner.link ? 'a' : 'div'" 
            :href="banner.link" 
            :class="{ 'has-link': banner.link }"
          >
            <img :src="banner.image" :alt="banner.title" loading="lazy" />
            <div class="banner-overlay">
              <h2 class="banner-title">{{ banner.title }}</h2>
            </div>
          </component>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="activeBanners.length > 1"
        class="carousel-btn prev"
        @click="prev"
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        v-if="activeBanners.length > 1"
        class="carousel-btn next"
        @click="next"
        aria-label="Next banner"
      >
        ›
      </button>

      <!-- Indicators -->
      <div v-if="activeBanners.length > 1" class="carousel-indicators">
        <button
          v-for="(banner, index) in activeBanners"
          :key="banner.id"
          :class="{ active: currentIndex === index }"
          @click="goTo(index)"
          :aria-label="`Go to banner ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBannerStore } from '~/stores/banner'

const bannerStore = useBannerStore()
const activeBanners = computed(() => bannerStore.activeBanners)

const currentIndex = ref(0)
const autoPlayInterval = ref<NodeJS.Timeout | null>(null)

// Auto play
const startAutoPlay = () => {
  if (activeBanners.value.length <= 1) return
  
  autoPlayInterval.value = setInterval(() => {
    next()
  }, 5000) // Change banner every 5 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

// Navigation
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length
}

const prev = () => {
  currentIndex.value =
    currentIndex.value === 0
      ? activeBanners.value.length - 1
      : currentIndex.value - 1
}

const goTo = (index: number) => {
  currentIndex.value = index
  stopAutoPlay()
  startAutoPlay()
}

// Lifecycle
onMounted(() => {
  bannerStore.fetchBanners()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// Pause on hover
const handleMouseEnter = () => {
  stopAutoPlay()
}

const handleMouseLeave = () => {
  startAutoPlay()
}

if (process.client) {
  watch(activeBanners, () => {
    if (currentIndex.value >= activeBanners.value.length) {
      currentIndex.value = 0
    }
  })
}
</script>

<style scoped>
.banner-carousel {
  width: 100%;
  margin-bottom: 40px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item a,
.carousel-item > div {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item a.has-link {
  cursor: pointer;
  text-decoration: none;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 40px;
  display: flex;
  align-items: flex-end;
}

.banner-title {
  color: white;
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Navigation Buttons */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  font-size: 48px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

/* Indicators */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.carousel-indicators button.active {
  background: white;
  transform: scale(1.2);
}

.carousel-indicators button:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-container {
    height: 250px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-overlay {
    padding: 20px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 32px;
  }

  .carousel-btn.prev {
    left: 10px;
  }

  .carousel-btn.next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 200px;
  }

  .banner-title {
    font-size: 18px;
  }

  .carousel-btn {
    width: 30px;
    height: 30px;
    font-size: 24px;
  }
}
</style>

