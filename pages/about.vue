<template>
  <div class="about">
    <div class="about-card">
      <h2>{{ $t('about.title') }}</h2>
      
      <div class="content">
        <section>
          <h3>{{ $t('about.whatIsNovelHub') }}</h3>
          <p>
            {{ $t('about.description') }}
          </p>
        </section>
        
        <section>
          <h3>{{ $t('about.platformFeatures') }}</h3>
          <ul>
            <li>{{ $t('about.features.library') }}</li>
            <li>{{ $t('about.features.multilang') }}</li>
            <li>{{ $t('about.features.performance') }}</li>
            <li>{{ $t('about.features.responsive') }}</li>
            <li>{{ $t('about.features.bookmark') }}</li>
            <li>{{ $t('about.features.customizable') }}</li>
          </ul>
        </section>
        
        <section>
          <h3>{{ $t('about.popularGenres') }}</h3>
          <div class="links">
            <a href="#" rel="noopener">
              {{ $t('about.genres.fantasy') }}
            </a>
            <a href="#" rel="noopener">
              {{ $t('about.genres.cultivation') }}
            </a>
            <a href="#" rel="noopener">
              {{ $t('about.genres.contemporary') }}
            </a>
            <a href="#" rel="noopener">
              {{ $t('about.genres.scifi') }}
            </a>
            <a href="#" rel="noopener">
              {{ $t('about.genres.romance') }}
            </a>
            <a href="#" rel="noopener">
              {{ $t('about.genres.gameworld') }}
            </a>
          </div>
        </section>
        
        <section class="tech-stack">
          <h3>{{ $t('about.techStack') }}</h3>
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-icon">⚡</span>
              <span>Vue {{ vueVersion }}</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">🚀</span>
              <span>Nuxt {{ nuxtVersion }}</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">📘</span>
              <span>TypeScript</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">🎨</span>
              <span>Vite</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page SEO metadata
const { t } = useI18n()
useHead({
  title: t('about.seo.title'),
  meta: [
    {
      name: 'description',
      content: t('about.seo.description'),
    },
    {
      name: 'keywords',
      content: t('about.seo.keywords'),
    },
    // Open Graph
    {
      property: 'og:title',
      content: t('about.seo.ogTitle'),
    },
    {
      property: 'og:description',
      content: t('about.seo.ogDescription'),
    },
    {
      property: 'og:url',
      content: t('about.seo.ogUrl'),
    },
    // Twitter
    {
      name: 'twitter:title',
      content: t('about.seo.twitterTitle'),
    },
    {
      name: 'twitter:description',
      content: t('about.seo.twitterDescription'),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: t('about.seo.canonical'),
    },
  ],
})

// Component data
const nuxtVersion = '4.1.3'
const vueVersion = '3.5.13'
</script>

<style scoped>
.about {
  width: 100%;
}

.about-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

h2 {
  font-size: 36px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

section {
  padding: 20px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

section h3 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 22px;
}

section p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 16px;
}

ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
}

ul li {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 16px;
}

.links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.links a {
  display: inline-block;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: var(--text-inverse);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: bold;
}

.links a:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tech-stack {
  background: var(--gradient-primary);
  color: var(--text-inverse);
}

.tech-stack h3 {
  color: var(--text-inverse);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.tech-item {
  background: var(--overlay-light);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.tech-item:hover {
  background: var(--overlay-medium);
  transform: scale(1.05);
}

.tech-icon {
  display: block;
  font-size: 32px;
  margin-bottom: 10px;
}
</style>

