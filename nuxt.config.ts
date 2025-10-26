// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  devtools: { 
    enabled: true,
    // 减少实验性功能警告
    experimental: {
      timeline: false
    }
  },
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
  },

  // Vue configuration
  vue: {
    compilerOptions: {
      // 减少开发环境警告
      isCustomElement: (tag) => false
    }
  },

  // Vite configuration
  vite: {
    plugins: [
      tsconfigPaths()
    ]
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
    exposeConfig: false,
    viewer: true,
    config: {
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue"
      ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            // 护眼暗绿色主题色板
            primary: {
              50: '#f0f9f0',
              100: '#dcf2dc',
              200: '#bce5bc',
              300: '#8dd18d',
              400: '#5bb85b',
              500: '#3a9d3a', // 主色调
              600: '#2d7d2d',
              700: '#256325',
              800: '#215021',
              900: '#1e421e',
              950: '#0d240d'
            },
            // 辅助色彩
            secondary: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
              950: '#020617'
            },
            // 成功色（基于主题色）
            success: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
              950: '#052e16'
            },
            // 警告色
            warning: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
              950: '#451a03'
            },
            // 错误色
            error: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
              950: '#450a0a'
            },
            // 信息色
            info: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              950: '#172554'
            }
          },
          // 自定义字体
          fontFamily: {
            sans: [
              'Inter',
              '-apple-system',
              'BlinkMacSystemFont',
              'Segoe UI',
              'Roboto',
              'Oxygen',
              'Ubuntu',
              'Cantarell',
              'system-ui',
              'sans-serif'
            ],
            mono: ['JetBrains Mono', 'monospace']
          },
          // 自定义间距
          spacing: {
            '128': '32rem',
            '144': '36rem',
          },
          // 自定义圆角
          borderRadius: {
            '4xl': '2rem',
          },
          // 自定义阴影
          boxShadow: {
            'primary': '0 4px 14px 0 rgba(58, 157, 58, 0.15)',
            'primary-lg': '0 10px 25px 0 rgba(58, 157, 58, 0.2)',
            'primary-xl': '0 20px 40px 0 rgba(58, 157, 58, 0.25)'
          },
          // 自定义渐变
          backgroundImage: {
            'gradient-primary': 'linear-gradient(135deg, #3a9d3a 0%, #2d7d2d 100%)',
            'gradient-primary-light': 'linear-gradient(135deg, #5bb85b 0%, #3a9d3a 100%)',
            'gradient-primary-dark': 'linear-gradient(135deg, #256325 0%, #1e421e 100%)'
          }
        }
      },
      plugins: []
    }
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

