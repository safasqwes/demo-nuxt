/** @type {import('tailwindcss').Config} */
export default {
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
      // 自定义字体（合并了 nuxt.config.ts 中的配置）
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
      // 自定义间距（从 nuxt.config.ts 合并）
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // 自定义圆角（从 nuxt.config.ts 合并）
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
