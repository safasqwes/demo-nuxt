<template>
  <div class="privacy-policy">
    <div class="privacy-card">
      <h1>{{ $t('privacy.title') }}</h1>
      <p class="last-updated">{{ $t('privacy.lastUpdated', { date: lastUpdated }) }}</p>
      
      <div class="content">
        <section>
          <h2>{{ $t('privacy.sections.introduction.title') }}</h2>
          <p>
            {{ $t('privacy.sections.introduction.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.informationCollection.title') }}</h2>
          <h3>{{ $t('privacy.sections.informationCollection.personalInfo.title') }}</h3>
          <p>{{ $t('privacy.sections.informationCollection.personalInfo.content') }}</p>
          <ul>
            <li v-for="activity in $t('privacy.sections.informationCollection.personalInfo.activities')" :key="activity">{{ activity }}</li>
          </ul>
          
          <h3>{{ $t('privacy.sections.informationCollection.autoCollected.title') }}</h3>
          <p>{{ $t('privacy.sections.informationCollection.autoCollected.content') }}</p>
          <ul>
            <li v-for="data in $t('privacy.sections.informationCollection.autoCollected.data')" :key="data">{{ data }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.informationUse.title') }}</h2>
          <p>{{ $t('privacy.sections.informationUse.content') }}</p>
          <ul>
            <li v-for="purpose in $t('privacy.sections.informationUse.purposes')" :key="purpose">{{ purpose }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.informationSharing.title') }}</h2>
          <p>{{ $t('privacy.sections.informationSharing.content') }}</p>
          <ul>
            <li v-for="exception in $t('privacy.sections.informationSharing.exceptions')" :key="exception">{{ exception }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.dataSecurity.title') }}</h2>
          <p>
            {{ $t('privacy.sections.dataSecurity.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.cookies.title') }}</h2>
          <p>
            {{ $t('privacy.sections.cookies.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.thirdParty.title') }}</h2>
          <p>
            {{ $t('privacy.sections.thirdParty.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.yourRights.title') }}</h2>
          <p>{{ $t('privacy.sections.yourRights.content') }}</p>
          <ul>
            <li v-for="right in $t('privacy.sections.yourRights.rights')" :key="right">{{ right }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.dataRetention.title') }}</h2>
          <p>
            {{ $t('privacy.sections.dataRetention.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.childrenPrivacy.title') }}</h2>
          <p>
            {{ $t('privacy.sections.childrenPrivacy.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.policyChanges.title') }}</h2>
          <p>
            {{ $t('privacy.sections.policyChanges.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.sections.contactUs.title') }}</h2>
          <p>
            {{ $t('privacy.sections.contactUs.content') }}
          </p>
          <div class="contact-info">
            <p><strong>{{ $t('privacy.sections.contactUs.email') }}</strong> {{ $t('privacy.sections.contactUs.emailValue') }}</p>
            <p><strong>{{ $t('privacy.sections.contactUs.address') }}</strong> {{ $t('privacy.sections.contactUs.addressValue') }}</p>
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
  title: t('privacy.seo.title'),
  meta: [
    {
      name: 'description',
      content: t('privacy.seo.description'),
    },
    {
      name: 'keywords',
      content: t('privacy.seo.keywords'),
    },
    // Open Graph
    {
      property: 'og:title',
      content: t('privacy.seo.ogTitle'),
    },
    {
      property: 'og:description',
      content: t('privacy.seo.ogDescription'),
    },
    {
      property: 'og:url',
      content: t('privacy.seo.ogUrl'),
    },
    // Twitter
    {
      name: 'twitter:title',
      content: t('privacy.seo.twitterTitle'),
    },
    {
      name: 'twitter:description',
      content: t('privacy.seo.twitterDescription'),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: t('privacy.seo.canonical'),
    },
  ],
})

// Component data
const lastUpdated = 'January 1, 2025'
</script>

<style scoped>
.privacy-policy {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.privacy-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

h1 {
  font-size: 36px;
  margin: 0 0 10px 0;
  color: var(--text-primary);
  text-align: center;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.last-updated {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 40px;
  font-size: 14px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

section {
  padding: 25px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

section h2 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 24px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
}

section h3 {
  margin: 20px 0 10px 0;
  color: var(--text-primary);
  font-size: 18px;
}

section p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 16px;
}

ul {
  margin: 0 0 15px 0;
  padding-left: 20px;
  color: var(--text-secondary);
}

ul li {
  margin-bottom: 8px;
  line-height: 1.6;
  font-size: 16px;
}

.contact-info {
  background: var(--bg-primary);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
}

.contact-info p {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.contact-info p:last-child {
  margin-bottom: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .privacy-card {
    padding: 20px;
  }
  
  h1 {
    font-size: 28px;
  }
  
  section h2 {
    font-size: 20px;
  }
  
  section {
    padding: 20px;
  }
}
</style>
