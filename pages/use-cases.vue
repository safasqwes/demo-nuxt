<template>
  <div class="use-cases">
    <div class="hero-section">
      <h1>{{ $t('useCases.hero.title') }}</h1>
      <p class="hero-subtitle">{{ $t('useCases.hero.subtitle') }}</p>
    </div>
    
    <div class="content">
      <!-- Readers Section -->
      <section class="use-case-section">
        <h2>{{ $t('useCases.readers.title') }}</h2>
        <div class="use-cases-grid">
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.readers.casual.icon') }}</div>
            <h3>{{ $t('useCases.readers.casual.title') }}</h3>
            <p>{{ $t('useCases.readers.casual.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.readers.casual.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.readers.binge.icon') }}</div>
            <h3>{{ $t('useCases.readers.binge.title') }}</h3>
            <p>{{ $t('useCases.readers.binge.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.readers.binge.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.readers.exploration.icon') }}</div>
            <h3>{{ $t('useCases.readers.exploration.title') }}</h3>
            <p>{{ $t('useCases.readers.exploration.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.readers.exploration.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Content Creators Section -->
      <section class="use-case-section">
        <h2>{{ $t('useCases.creators.title') }}</h2>
        <div class="use-cases-grid">
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.creators.authors.icon') }}</div>
            <h3>{{ $t('useCases.creators.authors.title') }}</h3>
            <p>{{ $t('useCases.creators.authors.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.creators.authors.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.creators.translators.icon') }}</div>
            <h3>{{ $t('useCases.creators.translators.title') }}</h3>
            <p>{{ $t('useCases.creators.translators.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.creators.translators.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.creators.illustrators.icon') }}</div>
            <h3>{{ $t('useCases.creators.illustrators.title') }}</h3>
            <p>{{ $t('useCases.creators.illustrators.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.creators.illustrators.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Educational Section -->
      <section class="use-case-section">
        <h2>{{ $t('useCases.education.title') }}</h2>
        <div class="use-cases-grid">
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.education.language.icon') }}</div>
            <h3>{{ $t('useCases.education.language.title') }}</h3>
            <p>{{ $t('useCases.education.language.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.education.language.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.education.research.icon') }}</div>
            <h3>{{ $t('useCases.education.research.title') }}</h3>
            <p>{{ $t('useCases.education.research.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.education.research.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.education.bookClubs.icon') }}</div>
            <h3>{{ $t('useCases.education.bookClubs.title') }}</h3>
            <p>{{ $t('useCases.education.bookClubs.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.education.bookClubs.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Business Section -->
      <section class="use-case-section">
        <h2>{{ $t('useCases.business.title') }}</h2>
        <div class="use-cases-grid">
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.business.corporate.icon') }}</div>
            <h3>{{ $t('useCases.business.corporate.title') }}</h3>
            <p>{{ $t('useCases.business.corporate.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.business.corporate.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.business.integration.icon') }}</div>
            <h3>{{ $t('useCases.business.integration.title') }}</h3>
            <p>{{ $t('useCases.business.integration.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.business.integration.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
          
          <div class="use-case-card">
            <div class="use-case-icon">{{ $t('useCases.business.marketResearch.icon') }}</div>
            <h3>{{ $t('useCases.business.marketResearch.title') }}</h3>
            <p>{{ $t('useCases.business.marketResearch.description') }}</p>
            <ul>
              <li v-for="(feature, index) in $tm('useCases.business.marketResearch.features')" :key="index">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Getting Started Section -->
      <section class="getting-started">
        <h2>{{ $t('useCases.cta.title') }}</h2>
        <p>{{ $t('useCases.cta.description') }}</p>
        <div class="cta-buttons">
          <NuxtLink to="/pricing" class="cta-button primary">
            {{ $t('useCases.cta.viewPricing') }}
          </NuxtLink>
          <NuxtLink to="/contact-us" class="cta-button secondary">
            {{ $t('useCases.cta.contactSales') }}
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page SEO metadata
const { t } = useI18n()
useHead({
  title: t('useCases.seo.title'),
  meta: [
    {
      name: 'description',
      content: t('useCases.seo.description'),
    },
    {
      name: 'keywords',
      content: t('useCases.seo.keywords'),
    },
    // Open Graph
    {
      property: 'og:title',
      content: t('useCases.seo.ogTitle'),
    },
    {
      property: 'og:description',
      content: t('useCases.seo.ogDescription'),
    },
    {
      property: 'og:url',
      content: t('useCases.seo.ogUrl'),
    },
    // Twitter
    {
      name: 'twitter:title',
      content: t('useCases.seo.twitterTitle'),
    },
    {
      name: 'twitter:description',
      content: t('useCases.seo.twitterDescription'),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: t('useCases.seo.canonical'),
    },
  ],
})
</script>

<style scoped>
.use-cases {
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 0;
}

.hero-section h1 {
  font-size: 48px;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.use-case-section {
  width: 100%;
}

.use-case-section h2 {
  font-size: 32px;
  margin: 0 0 40px 0;
  color: var(--text-primary);
  text-align: center;
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 15px;
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.use-case-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  text-align: center;
}

.use-case-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.use-case-icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.use-case-card h3 {
  font-size: 24px;
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.use-case-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 16px;
}

.use-case-card ul {
  text-align: left;
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
}

.use-case-card ul li {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
}

.getting-started {
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 60px 40px;
  border-radius: 16px;
  text-align: center;
  margin-top: 40px;
}

.getting-started h2 {
  font-size: 36px;
  margin: 0 0 20px 0;
  color: var(--text-inverse);
}

.getting-started p {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.cta-button.primary {
  background: var(--text-inverse);
  color: var(--primary-color);
  border-color: var(--text-inverse);
}

.cta-button.primary:hover {
  background: transparent;
  color: var(--text-inverse);
  border-color: var(--text-inverse);
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: var(--text-inverse);
  border-color: var(--text-inverse);
}

.cta-button.secondary:hover {
  background: var(--text-inverse);
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .use-case-section h2 {
    font-size: 28px;
  }
  
  .use-cases-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .use-case-card {
    padding: 25px;
  }
  
  .getting-started {
    padding: 40px 20px;
  }
  
  .getting-started h2 {
    font-size: 28px;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
