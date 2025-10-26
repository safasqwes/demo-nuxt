<template>
  <div class="blog">
    <div class="hero-section">
      <h1>NovelHub Blog</h1>
      <p class="hero-subtitle">Stay updated with the latest news, features, and insights from the world of web novels</p>
    </div>
    
    <div class="content">
      <!-- Featured Article -->
      <section class="featured-article">
        <h2>🌟 Featured Article</h2>
        <div class="featured-card">
          <div class="featured-image">
            <div class="placeholder-image">📚</div>
          </div>
          <div class="featured-content">
            <div class="article-meta">
              <span class="category">Platform Updates</span>
              <span class="date">January 15, 2025</span>
            </div>
            <h3>Introducing NovelHub 2.0: Enhanced Reading Experience</h3>
            <p>
              We're excited to announce the launch of NovelHub 2.0, featuring improved performance, 
              new reading modes, and enhanced user interface. Discover what's new and how these 
              updates will transform your reading experience.
            </p>
            <a href="#" class="read-more">Read More →</a>
          </div>
        </div>
      </section>

      <!-- Blog Categories -->
      <section class="categories">
        <h2>📂 Categories</h2>
        <div class="category-grid">
          <div class="category-card">
            <div class="category-icon">🚀</div>
            <h3>Platform Updates</h3>
            <p>Latest features and improvements</p>
            <span class="post-count">12 posts</span>
          </div>
          <div class="category-card">
            <div class="category-icon">📖</div>
            <h3>Reading Tips</h3>
            <p>Enhance your reading experience</p>
            <span class="post-count">8 posts</span>
          </div>
          <div class="category-card">
            <div class="category-icon">✍️</div>
            <h3>Writing Guides</h3>
            <p>Tips for aspiring authors</p>
            <span class="post-count">15 posts</span>
          </div>
          <div class="category-card">
            <div class="category-icon">🌍</div>
            <h3>Community</h3>
            <p>Reader and author spotlights</p>
            <span class="post-count">20 posts</span>
          </div>
        </div>
      </section>

      <!-- Recent Posts -->
      <section class="recent-posts">
        <h2>📰 Recent Posts</h2>
        <div class="posts-grid">
          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">📱</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Platform Updates</span>
                <span class="date">January 12, 2025</span>
              </div>
              <h3>Mobile App Beta Now Available</h3>
              <p>Download our new mobile app and enjoy reading on the go with offline support and sync across devices.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>

          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">🎨</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Reading Tips</span>
                <span class="date">January 10, 2025</span>
              </div>
              <h3>Customizing Your Reading Experience</h3>
              <p>Learn how to personalize your reading settings, from font size to background themes, for the perfect reading environment.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>

          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">💡</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Writing Guides</span>
                <span class="date">January 8, 2025</span>
              </div>
              <h3>Getting Started as a Web Novel Author</h3>
              <p>A comprehensive guide for new authors on how to publish your first web novel and build an audience on NovelHub.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>

          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">🏆</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Community</span>
                <span class="date">January 5, 2025</span>
              </div>
              <h3>Author Spotlight: Rising Star of the Month</h3>
              <p>Meet this month's featured author and discover their journey from first-time writer to published web novelist.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>

          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">🔍</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Reading Tips</span>
                <span class="date">January 3, 2025</span>
              </div>
              <h3>Finding Your Next Favorite Novel</h3>
              <p>Discover effective strategies for finding new novels that match your reading preferences and expand your literary horizons.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>

          <article class="post-card">
            <div class="post-image">
              <div class="placeholder-image">🌐</div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="category">Platform Updates</span>
                <span class="date">December 30, 2024</span>
              </div>
              <h3>Year in Review: NovelHub's 2024 Achievements</h3>
              <p>Looking back at our biggest milestones, new features, and community growth throughout 2024.</p>
              <a href="#" class="read-more">Read More →</a>
            </div>
          </article>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="newsletter">
        <div class="newsletter-content">
          <h2>📧 Stay Updated</h2>
          <p>Subscribe to our newsletter and never miss the latest updates, new features, and exclusive content.</p>
          <form class="newsletter-form">
            <input type="email" placeholder="Enter your email address" class="email-input" />
            <button type="submit" class="subscribe-btn">Subscribe</button>
          </form>
          <p class="newsletter-note">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      <!-- Popular Tags -->
      <section class="popular-tags">
        <h2>🏷️ Popular Tags</h2>
        <div class="tags-container">
          <span class="tag">#webnovels</span>
          <span class="tag">#lightnovels</span>
          <span class="tag">#fantasy</span>
          <span class="tag">#romance</span>
          <span class="tag">#cultivation</span>
          <span class="tag">#scifi</span>
          <span class="tag">#writing</span>
          <span class="tag">#reading</span>
          <span class="tag">#authors</span>
          <span class="tag">#community</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page SEO metadata
useHead({
  title: 'Blog - NovelHub | Latest News & Insights',
  meta: [
    {
      name: 'description',
      content: 'Stay updated with the latest news, features, and insights from NovelHub. Read about platform updates, reading tips, writing guides, and community spotlights.',
    },
    {
      name: 'keywords',
      content: 'novelhub blog, web novel news, reading tips, writing guides, platform updates, author spotlights, community news',
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Blog - NovelHub | Latest News & Insights',
    },
    {
      property: 'og:description',
      content: 'Stay updated with NovelHub\'s latest news, features, and insights for web novel readers and authors.',
    },
    {
      property: 'og:url',
      content: 'https://novelhub.example.com/blog',
    },
    // Twitter
    {
      name: 'twitter:title',
      content: 'Blog - NovelHub',
    },
    {
      name: 'twitter:description',
      content: 'Latest news and insights from the NovelHub community.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://novelhub.example.com/blog',
    },
  ],
})
</script>

<style scoped>
.blog {
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 0;
}

.hero-section h1 {
  font-size: 48px;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* Featured Article */
.featured-article h2 {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.featured-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--text-inverse);
}

.featured-content h3 {
  font-size: 28px;
  margin: 0 0 15px 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.featured-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 16px;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.category {
  background: var(--primary-color);
  color: var(--text-inverse);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.date {
  color: var(--text-secondary);
  font-size: 14px;
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: var(--primary-dark);
}

/* Categories */
.categories h2 {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.category-icon {
  font-size: 40px;
  margin-bottom: 15px;
  display: block;
}

.category-card h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.category-card p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
  font-size: 14px;
}

.post-count {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

/* Recent Posts */
.recent-posts h2 {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.post-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-content {
  padding: 25px;
}

.post-content h3 {
  font-size: 20px;
  margin: 0 0 15px 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.post-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 14px;
}

/* Newsletter */
.newsletter {
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 60px 40px;
  border-radius: 16px;
  text-align: center;
}

.newsletter h2 {
  font-size: 36px;
  margin: 0 0 20px 0;
  color: var(--text-inverse);
}

.newsletter p {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-form {
  display: flex;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto 20px auto;
  flex-wrap: wrap;
}

.email-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  min-width: 250px;
}

.subscribe-btn {
  padding: 15px 30px;
  background: var(--text-inverse);
  color: var(--primary-color);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.newsletter-note {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

/* Popular Tags */
.popular-tags h2 {
  font-size: 32px;
  margin: 0 0 30px 0;
  color: var(--text-primary);
  text-align: center;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tag {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background: var(--primary-color);
  color: var(--text-inverse);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .featured-card {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .featured-content h3 {
    font-size: 24px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter {
    padding: 40px 20px;
  }
  
  .newsletter h2 {
    font-size: 28px;
  }
  
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
  
  .email-input {
    min-width: 100%;
  }
}
</style>
