<template>
  <div class="ranking-list">
    <div class="ranking-header">
      <h3 class="ranking-title">
        <span class="icon">{{ icon }}</span>
        {{ title }}
      </h3>
    </div>

    <div class="ranking-items">
      <NuxtLink
        v-for="(novel, index) in novels"
        :key="novel.id"
        :to="`/novel/${novel.id}`"
        class="ranking-item"
      >
        <div class="rank-number" :class="`rank-${index + 1}`">
          {{ index + 1 }}
        </div>
        <img :src="novel.cover" :alt="novel.title" class="novel-cover" />
        <div class="novel-info">
          <h4 class="novel-title">{{ novel.title }}</h4>
          <p class="novel-author">{{ novel.author }}</p>
          <div class="novel-stats">
            <span class="stat">
              {{ type === 'monthly' ? formatViews(novel.monthlyViews) : formatBookmarks(novel.totalBookmarks) }}
            </span>
            <span class="rating">⭐ {{ novel.rating }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Novel } from '~/stores/novel'

interface Props {
  title: string
  icon: string
  novels: Novel[]
  type: 'monthly' | 'bookmark'
}

const props = defineProps<Props>()

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`
  }
  return `${views} views`
}

const formatBookmarks = (bookmarks: number): string => {
  if (bookmarks >= 1000000) {
    return `${(bookmarks / 1000000).toFixed(1)}M bookmarks`
  } else if (bookmarks >= 1000) {
    return `${(bookmarks / 1000).toFixed(1)}K bookmarks`
  }
  return `${bookmarks} bookmarks`
}
</script>

<style scoped>
.ranking-list {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.ranking-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
}

.ranking-title {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.ranking-title .icon {
  font-size: 24px;
}

.ranking-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-secondary);
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.ranking-item:hover {
  background: var(--bg-hover);
  transform: translateX(5px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.rank-number.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8b4513;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.rank-number.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #666;
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
}

.rank-number.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
}

.novel-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.novel-info {
  flex: 1;
  min-width: 0;
}

.novel-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.stat {
  color: var(--color-primary);
  font-weight: 600;
}

.rating {
  color: var(--color-accent);
  font-weight: 600;
}

@media (max-width: 768px) {
  .ranking-list {
    padding: 16px;
  }

  .novel-cover {
    width: 50px;
    height: 65px;
  }

  .novel-title {
    font-size: 14px;
  }

  .novel-author {
    font-size: 12px;
  }
}
</style>

