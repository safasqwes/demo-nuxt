/**
 * Theme Management Composable
 * Handles theme switching between light and dark modes with persistence
 */

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'novelhub-theme'

export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'dark')

  // Initialize theme from localStorage or default to dark
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      theme.value = savedTheme || 'dark'
      applyTheme(theme.value)
    }
  }

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    }
  }

  // Set theme and persist
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme(newTheme)
    
    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Check if current theme is dark
  const isDark = computed(() => theme.value === 'dark')

  return {
    theme: readonly(theme),
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}

