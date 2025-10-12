<template>
  <div class="about">
    <div class="about-card">
      <h2>About NovelHub</h2>
      
      <div class="content">
        <section>
          <h3>🎯 What is NovelHub?</h3>
          <p>
            NovelHub is a modern web novel platform built with cutting-edge technology. 
            We provide readers with access to thousands of web novels, light novels, and serialized 
            fiction from around the world. Our mission is to connect readers with amazing stories 
            through a fast, beautiful, and user-friendly reading experience.
          </p>
        </section>
        
        <section>
          <h3>✨ Platform Features</h3>
          <ul>
            <li>📚 Extensive library of web novels and light novels</li>
            <li>🌍 Multi-language support and translations</li>
            <li>⚡ Lightning-fast page loads with SSG technology</li>
            <li>📱 Responsive design for all devices</li>
            <li>🔖 Bookmark and reading progress tracking</li>
            <li>🎨 Customizable reading experience</li>
          </ul>
        </section>
        
        <section>
          <h3>📚 Popular Genres</h3>
          <div class="links">
            <a href="#" rel="noopener">
              ⚔️ Fantasy
            </a>
            <a href="#" rel="noopener">
              🔮 Cultivation
            </a>
            <a href="#" rel="noopener">
              💼 Contemporary
            </a>
            <a href="#" rel="noopener">
              🚀 Sci-Fi
            </a>
            <a href="#" rel="noopener">
              💕 Romance
            </a>
            <a href="#" rel="noopener">
              🎮 Game World
            </a>
          </div>
        </section>
        
        <section class="tech-stack">
          <h3>🛠️ Technology Stack</h3>
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-icon">⚡</span>
              <span>Vue {{ vueVersion }}</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">🚀</span>
              <span>Nuxt {{ nuxtVersion }}</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">📘</span>
              <span>TypeScript</span>
            </div>
            <div class="tech-item">
              <span class="tech-icon">🎨</span>
              <span>Vite</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page SEO metadata
useHead({
  title: 'About Us - NovelHub | Web Novel Reading Platform',
  meta: [
    {
      name: 'description',
      content: 'Learn about NovelHub, a modern web novel platform built with cutting-edge technology. Discover our mission to connect readers with amazing stories from around the world.',
    },
    {
      name: 'keywords',
      content: 'about novelhub, web novel platform, light novel site, online reading platform, novel genres, fantasy, cultivation, sci-fi, romance',
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'About Us - NovelHub | Web Novel Platform',
    },
    {
      property: 'og:description',
      content: 'Modern web novel platform connecting readers with amazing stories worldwide. Fast, beautiful, and user-friendly.',
    },
    {
      property: 'og:url',
      content: 'https://novelhub.example.com/about',
    },
    // Twitter
    {
      name: 'twitter:title',
      content: 'About Us - NovelHub',
    },
    {
      name: 'twitter:description',
      content: 'Learn about NovelHub, your gateway to web novels and light novels.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://novelhub.example.com/about',
    },
  ],
})

// Component data
const nuxtVersion = '4.1.3'
const vueVersion = '3.5.13'
</script>

<style scoped>
.about {
  width: 100%;
}

.about-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 36px;
  margin: 0 0 30px 0;
  color: #2d3748;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

section {
  padding: 20px;
  border-radius: 8px;
  background: #f7fafc;
}

section h3 {
  margin: 0 0 15px 0;
  color: #2d3748;
  font-size: 22px;
}

section p {
  margin: 0;
  color: #4a5568;
  line-height: 1.8;
  font-size: 16px;
}

ul {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
}

ul li {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 16px;
}

.links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.links a {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: bold;
}

.links a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.tech-stack {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tech-stack h3 {
  color: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.tech-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.tech-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.tech-icon {
  display: block;
  font-size: 32px;
  margin-bottom: 10px;
}
</style>

