// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Source directory for application code
  srcDir: 'app/',
  
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  
  // Pinia state management
  modules: ['@pinia/nuxt'],
  
  css: ['~/assets/css/main.css'],
  
  // SEO Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'NovelHub - Read Web Novels & Light Novels Online',
      meta: [
        { name: 'description', content: 'NovelHub is your gateway to thousands of web novels and light novels. Read fantasy, cultivation, sci-fi, romance, and more genres from authors around the world.' },
        { name: 'keywords', content: 'web novels, light novels, online novels, fantasy novels, cultivation novels, sci-fi novels, romance novels, read novels online, free novels' },
        { name: 'author', content: 'NovelHub' },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'NovelHub' },
        { property: 'og:title', content: 'NovelHub - Read Web Novels & Light Novels Online' },
        { property: 'og:description', content: 'Your gateway to thousands of web novels and light novels. Read fantasy, cultivation, sci-fi, romance, and more.' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:locale', content: 'en_US' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'NovelHub - Read Web Novels & Light Novels Online' },
        { name: 'twitter:description', content: 'Your gateway to thousands of web novels and light novels from around the world.' },
        { name: 'twitter:image', content: '/twitter-image.jpg' },
        
        // Mobile
        { name: 'theme-color', content: '#667eea' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://novelhub.example.com' },
      ],
    },
  },
  
  // Enable SSG for better SEO
  ssr: true,
  
  // Sitemap configuration (you can add @nuxtjs/sitemap module later)
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about'],
    },
  },
})

