<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle"
    :class="{ 'dark': isDark }"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} theme`"
    title="Toggle theme"
  >
    <span class="icon sun" v-show="isDark">☀️</span>
    <span class="icon moon" v-show="!isDark">🌙</span>
    <span class="label">{{ isDark ? 'Dark' : 'Light' }}</span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--overlay-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.theme-toggle:hover {
  background: var(--overlay-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-toggle:active {
  transform: translateY(0);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  animation: fadeIn 0.3s ease;
}

.label {
  font-size: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .label {
    display: none;
  }
  
  .theme-toggle {
    padding: 8px 12px;
  }
}
</style>

