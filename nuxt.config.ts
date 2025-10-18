// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
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

  // Vite configuration
  vite: {
    plugins: [
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url))
      }
    }
  },
  
  // Element Plus configuration
  elementPlus: {
    /** Options */
    importStyle: 'css',
    themes: ['dark'],
  },
  
  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
      ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              950: '#082f49',
            },
            secondary: {
              50: '#faf5ff',
              100: '#f3e8ff',
              200: '#e9d5ff',
              300: '#d8b4fe',
              400: '#c084fc',
              500: '#a855f7',
              600: '#9333ea',
              700: '#7e22ce',
              800: '#6b21a8',
              900: '#581c87',
              950: '#3b0764',
            },
          },
          fontFamily: {
            sans: [
              '-apple-system',
              'BlinkMacSystemFont',
              'Segoe UI',
              'Roboto',
              'Oxygen',
              'Ubuntu',
              'Cantarell',
              'sans-serif',
            ],
          },
          spacing: {
            '128': '32rem',
            '144': '36rem',
          },
          borderRadius: {
            '4xl': '2rem',
          },
        },
      },
      plugins: [],
    },
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
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '819627263362-ov95e4dfdafddtrfuq837gh6q4jgo7tn.apps.googleusercontent.com',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
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

