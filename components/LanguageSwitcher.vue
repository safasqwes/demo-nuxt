<template>
  <div class="relative">
    <button @click="toggleDropdown" 
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>
      <span>{{ currentLocale?.name || 'Language' }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div v-if="isOpen" 
         class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
      <div class="py-1">
        <button v-for="locale in availableLocales" 
                :key="locale.code"
                @click="switchLanguage(locale.code)"
                :class="[
                  'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2',
                  locale.code === currentLocale?.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                ]">
          <span class="text-lg">{{ getFlag(locale.code) }}</span>
          <span>{{ locale.name }}</span>
          <svg v-if="locale.code === currentLocale?.code" 
               class="w-4 h-4 ml-auto text-indigo-600" 
               fill="currentColor" 
               viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const { $i18n } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const isOpen = ref(false)

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value) || locales.value[0]
})

const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = async (newLocale: string) => {
  try {
    // 使用 Nuxt i18n 的 setLocale 方法（会自动保存到 cookie）
    await $i18n.setLocale(newLocale as 'en' | 'zh')
    isOpen.value = false
    
    // 刷新当前页面以应用新的语言
    await router.push(route.path)
  } catch (error) {
    console.error('[LanguageSwitcher] Failed to switch language:', error)
  }
}

const getFlag = (code: string) => {
  const flags: Record<string, string> = {
    'en': '🇺🇸',
    'zh': '🇨🇳',
    'ja': '🇯🇵',
    'ko': '🇰🇷'
  }
  return flags[code] || '🌐'
}

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      isOpen.value = false
    }
  })
})
</script>

<style scoped>
/* 自定义样式 */
</style>
