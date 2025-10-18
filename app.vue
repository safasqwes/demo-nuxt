<template>
  <div id="app">
    <!-- Main application layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Theme system is disabled for now
// Uncomment the following lines to enable theme switching:
// const { initTheme } = useTheme()
// onMounted(() => {
//   initTheme()
// })
</script>

<style>

/* Global styles for the NovelHub application */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

