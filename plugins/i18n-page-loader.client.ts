export default defineNuxtPlugin(async () => {
  const { $i18n } = useNuxtApp()
  const route = useRoute()
  
  const languageFiles = import.meta.glob('~/i18n/locales/**/*.json')

  const loadPageTranslations = async (locale: string) => {
    try {
      // 加载路由对应语言（基础文件已经由 @nuxtjs/i18n 自动加载）
      const folder = resolveLocaleFolder(route.path)
      if (folder) { // 加载所有页面的翻译文件
        const pageKey = `/i18n/locales/${folder}/${locale}.json`
        if (languageFiles[pageKey]) {
          const module = await languageFiles[pageKey]() as { default: any }
          $i18n.mergeLocaleMessage(locale, module.default)
          // 只在开发环境显示日志
          if (import.meta.dev) {
            console.log(`[i18n] Loaded translations for ${folder}/${locale}`)
          }
        } else {
          console.warn(`[i18n] Translation file not found: ${pageKey}`)
        }
      }
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}`, error)
    }
  }

  function resolveLocaleFolder(routePath: string): string | null {
    const parts = routePath.split('/').filter(Boolean)
    const localeCodes = ['en', 'zh']

    // 如果 URL 有语言前缀（例如 /en/feature/...）
    if (localeCodes.includes(parts[0] as string)) parts.shift()

    // 首页特殊处理 - 必须在其他条件之前
    if (parts.length === 0) return 'home'
    
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`   // 如 feature/videoswap
    if (parts.length === 1) return `${parts[0]}`        // 如 /products
    return null
  }

  // 监听路由变化
  watch(() => route.path, async () => {
    const currentLocale = $i18n.locale.value
    await loadPageTranslations(currentLocale)
  }, { immediate: true })

  // 监听语言变化
  watch(() => $i18n.locale.value, async (newLocale) => {
    await loadPageTranslations(newLocale)
  })
})
