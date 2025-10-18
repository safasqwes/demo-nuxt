<template>
  <div></div>
</template>

<script setup lang="ts">
// Add JSON-LD structured data for better SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NovelHub',
        url: 'https://novelhub.example.com',
        description: 'Read web novels and light novels online. Access thousands of stories across fantasy, cultivation, sci-fi, romance, and more genres.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://novelhub.example.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          name: 'NovelHub',
          logo: {
            '@type': 'ImageObject',
            url: 'https://novelhub.example.com/logo.png',
          },
        },
      }),
    },
  ],
})
</script>

