// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Source directory for application code
  srcDir: 'app/',
  
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  
  // Element Plus configuration
  elementPlus: {
    /** Options */
    importStyle: 'css',
    themes: ['dark'],
  },
  
  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  
  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
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
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    backendApiUrl: process.env.BACKEND_API_URL || 'http://localhost:8080/api',
    // Public keys (exposed to client-side)
    public: {
      apiBase: '/api',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '819627263362-ov95e4dfdafddtrfuq837gh6q4jgo7tn.apps.googleusercontent.com',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Sitemap configuration (you can add @nuxtjs/sitemap module later)
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about'],
    },
    // Proxy API requests to backend server
    routeRules: {
      '/api/**': { 
        proxy: 'http://localhost:8080/api/**' 
      }
    }
  },
})

