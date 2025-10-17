<template>
  <div class="about-page">
    <div class="container">
      <h1 class="page-title">About NovelHub</h1>
      
      <div class="content">
        <p class="lead">
          Welcome to NovelHub, your gateway to amazing web novels and stories from around the world.
        </p>
        
        <div class="features">
          <h2>Features</h2>
          <ul>
            <li>📚 Extensive collection of web novels</li>
            <li>🔍 Advanced search and filtering</li>
            <li>📖 Personalized reading experience</li>
            <li>⭐ Rating and review system</li>
            <li>📱 Mobile-friendly design</li>
          </ul>
        </div>
        
        <div class="mission">
          <h2>Our Mission</h2>
          <p>
            We believe that great stories should be accessible to everyone. 
            NovelHub brings together the best web novels and provides a platform 
            for readers to discover, read, and share their favorite stories.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'About - NovelHub',
  meta: [
    { name: 'description', content: 'Learn about NovelHub, your gateway to amazing web novels and stories.' }
  ]
})
</script>

<style scoped>
.about-page {
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.content {
  line-height: 1.6;
}

.lead {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-secondary);
}

.features, .mission {
  margin-bottom: 2rem;
}

.features h2, .mission h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.mission p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}
</style>
