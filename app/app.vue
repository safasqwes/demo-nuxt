<template>
  <div id="app">
    <!-- Main application layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Initialize theme system - disabled for now
// const { initTheme } = useTheme()

// Apply theme on mount
onMounted(() => {
  // initTheme()
})
</script>

<style>
/* Import theme variables */
@import '@/assets/css/theme.css';
@import '@/assets/css/main.css';

/* Global styles for the NovelHub application */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

