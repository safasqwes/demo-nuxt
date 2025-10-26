<template>
  <div class="terms-of-service">
    <div class="terms-card">
      <h1>{{ $t('terms.title') }}</h1>
      <p class="last-updated">{{ $t('terms.lastUpdated', { date: lastUpdated }) }}</p>
      
      <div class="content">
        <section>
          <h2>{{ $t('terms.sections.acceptance.title') }}</h2>
          <p>
            {{ $t('terms.sections.acceptance.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.description.title') }}</h2>
          <p>
            {{ $t('terms.sections.description.content') }}
          </p>
          <ul>
            <li v-for="feature in $t('terms.sections.description.features')" :key="feature">{{ feature }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('terms.sections.userAccounts.title') }}</h2>
          <h3>{{ $t('terms.sections.userAccounts.accountCreation.title') }}</h3>
          <p>
            {{ $t('terms.sections.userAccounts.accountCreation.content') }}
          </p>
          <ul>
            <li v-for="requirement in $t('terms.sections.userAccounts.accountCreation.requirements')" :key="requirement">{{ requirement }}</li>
          </ul>
          
          <h3>{{ $t('terms.sections.userAccounts.accountTermination.title') }}</h3>
          <p>
            {{ $t('terms.sections.userAccounts.accountTermination.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.acceptableUse.title') }}</h2>
          <h3>{{ $t('terms.sections.acceptableUse.permittedUses.title') }}</h3>
          <p>{{ $t('terms.sections.acceptableUse.permittedUses.content') }}</p>
          <ul>
            <li v-for="use in $t('terms.sections.acceptableUse.permittedUses.uses')" :key="use">{{ use }}</li>
          </ul>
          
          <h3>{{ $t('terms.sections.acceptableUse.prohibitedUses.title') }}</h3>
          <p>{{ $t('terms.sections.acceptableUse.prohibitedUses.content') }}</p>
          <ul>
            <li v-for="prohibition in $t('terms.sections.acceptableUse.prohibitedUses.prohibitions')" :key="prohibition">{{ prohibition }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('terms.sections.intellectualProperty.title') }}</h2>
          <h3>{{ $t('terms.sections.intellectualProperty.ourContent.title') }}</h3>
          <p>
            {{ $t('terms.sections.intellectualProperty.ourContent.content') }}
          </p>
          
          <h3>{{ $t('terms.sections.intellectualProperty.userContent.title') }}</h3>
          <p>
            {{ $t('terms.sections.intellectualProperty.userContent.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.paymentTerms.title') }}</h2>
          <h3>{{ $t('terms.sections.paymentTerms.pricingBilling.title') }}</h3>
          <p>
            {{ $t('terms.sections.paymentTerms.pricingBilling.content') }}
          </p>
          
          <h3>{{ $t('terms.sections.paymentTerms.refunds.title') }}</h3>
          <p>
            {{ $t('terms.sections.paymentTerms.refunds.content') }}
          </p>
          
          <h3>{{ $t('terms.sections.paymentTerms.paymentMethods.title') }}</h3>
          <p>
            {{ $t('terms.sections.paymentTerms.paymentMethods.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.privacy.title') }}</h2>
          <p>
            {{ $t('terms.sections.privacy.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.disclaimers.title') }}</h2>
          <h3>{{ $t('terms.sections.disclaimers.serviceAvailability.title') }}</h3>
          <p>
            {{ $t('terms.sections.disclaimers.serviceAvailability.content') }}
          </p>
          
          <h3>{{ $t('terms.sections.disclaimers.contentAccuracy.title') }}</h3>
          <p>
            {{ $t('terms.sections.disclaimers.contentAccuracy.content') }}
          </p>
          
          <h3>{{ $t('terms.sections.disclaimers.limitationLiability.title') }}</h3>
          <p>
            {{ $t('terms.sections.disclaimers.limitationLiability.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.indemnification.title') }}</h2>
          <p>
            {{ $t('terms.sections.indemnification.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.governingLaw.title') }}</h2>
          <p>
            {{ $t('terms.sections.governingLaw.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.changesToTerms.title') }}</h2>
          <p>
            {{ $t('terms.sections.changesToTerms.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.severability.title') }}</h2>
          <p>
            {{ $t('terms.sections.severability.content') }}
          </p>
        </section>

        <section>
          <h2>{{ $t('terms.sections.contactInfo.title') }}</h2>
          <p>
            {{ $t('terms.sections.contactInfo.content') }}
          </p>
          <div class="contact-info">
            <p><strong>{{ $t('terms.sections.contactInfo.email') }}</strong> {{ $t('terms.sections.contactInfo.emailValue') }}</p>
            <p><strong>{{ $t('terms.sections.contactInfo.address') }}</strong> {{ $t('terms.sections.contactInfo.addressValue') }}</p>
            <p><strong>{{ $t('terms.sections.contactInfo.phone') }}</strong> {{ $t('terms.sections.contactInfo.phoneValue') }}</p>
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
  title: t('terms.seo.title'),
  meta: [
    {
      name: 'description',
      content: t('terms.seo.description'),
    },
    {
      name: 'keywords',
      content: t('terms.seo.keywords'),
    },
    // Open Graph
    {
      property: 'og:title',
      content: t('terms.seo.ogTitle'),
    },
    {
      property: 'og:description',
      content: t('terms.seo.ogDescription'),
    },
    {
      property: 'og:url',
      content: t('terms.seo.ogUrl'),
    },
    // Twitter
    {
      name: 'twitter:title',
      content: t('terms.seo.twitterTitle'),
    },
    {
      name: 'twitter:description',
      content: t('terms.seo.twitterDescription'),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: t('terms.seo.canonical'),
    },
  ],
})

// Component data
const lastUpdated = 'January 1, 2025'
</script>

<style scoped>
.terms-of-service {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.terms-card {
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
  .terms-card {
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
