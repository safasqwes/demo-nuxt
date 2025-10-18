/**
 * Reading Store
 * Manages reading history, progress, and chapter unlocking
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/api'

export interface ReadingHistory {
  id: number
  novel: {
    id: number
    title: string
    author: string
    cover: string
  }
  chapter: {
    id: number
    chapter_number: number
    title: string
  }
  read_time: string
  read_duration: number
  read_progress: number
  device: string
}

export interface ReadingProgress {
  novel_id: number
  chapter_id: number
  progress: number
  last_position: number
  last_read_time: string
}

export interface UnlockedChapter {
  novel_id: number
  chapter_id: number
  unlocked_at: string
  unlock_type: 'free' | 'points' | 'subscription'
  points_cost?: number
}

interface ReadingState {
  history: ReadingHistory[]
  progress: Record<number, ReadingProgress> // novel_id -> progress
  unlockedChapters: UnlockedChapter[]
  loading: boolean
}

export const useReadingStore = defineStore('reading', {
  state: (): ReadingState => ({
    history: [],
    progress: {},
    unlockedChapters: [],
    loading: false,
  }),

  getters: {
    /**
     * Get recent reading history
     */
    recentHistory: (state): ReadingHistory[] => {
      return [...state.history]
        .sort((a, b) => new Date(b.read_time).getTime() - new Date(a.read_time).getTime())
        .slice(0, 10)
    },

    /**
     * Get reading history by novel
     */
    getHistoryByNovel: (state) => (novelId: number): ReadingHistory[] => {
      return state.history.filter(item => item.novel.id === novelId)
    },

    /**
     * Get reading progress for a novel
     */
    getNovelProgress: (state) => (novelId: number): ReadingProgress | null => {
      return state.progress[novelId] || null
    },

    /**
     * Get unlocked chapters for a novel
     */
    getUnlockedChapters: (state) => (novelId: number): UnlockedChapter[] => {
      return state.unlockedChapters.filter(item => item.novel_id === novelId)
    },

    /**
     * Check if chapter is unlocked
     */
    isChapterUnlocked: (state) => (novelId: number, chapterId: number): boolean => {
      return state.unlockedChapters.some(
        item => item.novel_id === novelId && item.chapter_id === chapterId
      )
    },

    /**
     * Get total reading time
     */
    totalReadingTime: (state): number => {
      return state.history.reduce((total, item) => total + item.read_duration, 0)
    },

    /**
     * Get reading statistics
     */
    readingStats: (state) => {
      const totalNovels = new Set(state.history.map(item => item.novel.id)).size
      const totalChapters = state.history.length
      const totalTime = state.totalReadingTime
      const avgSessionTime = totalChapters > 0 ? Math.round(totalTime / totalChapters) : 0
      
      return {
        totalNovels,
        totalChapters,
        totalTime,
        avgSessionTime,
        hoursRead: Math.round(totalTime / 3600 * 10) / 10,
      }
    },
  },

  actions: {
    /**
     * Fetch reading history
     */
    async fetchHistory(page: number = 1, size: number = 20) {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get(API_ENDPOINTS.USER.HISTORY, {
          page,
          size,
        })
        
        if (response.code === 200) {
          this.history = response.data || []
          return { success: true, total: response.total || 0 }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch reading history' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch reading history'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch reading progress
     */
    async fetchProgress() {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get(API_ENDPOINTS.USER.READING_PROGRESS)
        
        if (response.code === 200) {
          // Convert array to object for easier access
          const progressObj: Record<number, ReadingProgress> = {}
          response.data?.forEach((item: ReadingProgress) => {
            progressObj[item.novel_id] = item
          })
          this.progress = progressObj
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch reading progress' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch reading progress'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch unlocked chapters
     */
    async fetchUnlockedChapters() {
      this.loading = true
      try {
        const { http } = await import('~/utils/http')
        const response = await http.get('/api/user/unlocked-chapters')
        
        if (response.code === 200) {
          this.unlockedChapters = response.data || []
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch unlocked chapters' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch unlocked chapters'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Record reading session
     */
    async recordReading(novelId: number, chapterId: number, duration: number, progress: number = 100) {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.post('/api/user/reading/record', {
          novel_id: novelId,
          chapter_id: chapterId,
          duration,
          progress,
        })
        
        if (response.code === 200) {
          // Update local state
          const historyItem: ReadingHistory = {
            id: response.data.id,
            novel: response.data.novel,
            chapter: response.data.chapter,
            read_time: new Date().toISOString(),
            read_duration: duration,
            read_progress: progress,
            device: navigator.userAgent,
          }
          
          this.history.unshift(historyItem)
          
          // Update progress
          this.progress[novelId] = {
            novel_id: novelId,
            chapter_id: chapterId,
            progress,
            last_position: 0,
            last_read_time: new Date().toISOString(),
          }
          
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to record reading' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to record reading'
        return { success: false, message }
      }
    },

    /**
     * Unlock chapter with points
     */
    async unlockChapter(novelId: number, chapterId: number, pointsCost: number) {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.post(API_ENDPOINTS.USER.UNLOCK_CHAPTER, {
          novel_id: novelId,
          chapter_id: chapterId,
          points_cost: pointsCost,
        })
        
        if (response.code === 200) {
          // Add to unlocked chapters
          const unlockedChapter: UnlockedChapter = {
            novel_id: novelId,
            chapter_id: chapterId,
            unlocked_at: new Date().toISOString(),
            unlock_type: 'points',
            points_cost: pointsCost,
          }
          
          this.unlockedChapters.push(unlockedChapter)
          
          return { success: true, message: 'Chapter unlocked successfully' }
        }
        
        return { success: false, message: response.msg || 'Failed to unlock chapter' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to unlock chapter'
        return { success: false, message }
      }
    },

    /**
     * Update reading progress
     */
    async updateProgress(novelId: number, chapterId: number, progress: number, position: number = 0) {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.put(`/api/user/reading/progress/${novelId}`, {
          chapter_id: chapterId,
          progress,
          position,
        })
        
        if (response.code === 200) {
          // Update local state
          this.progress[novelId] = {
            novel_id: novelId,
            chapter_id: chapterId,
            progress,
            last_position: position,
            last_read_time: new Date().toISOString(),
          }
          
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to update progress' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to update progress'
        return { success: false, message }
      }
    },

    /**
     * Clear reading history
     */
    async clearHistory() {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.delete('/api/user/reading/history')
        
        if (response.code === 200) {
          this.history = []
          return { success: true, message: 'Reading history cleared' }
        }
        
        return { success: false, message: response.msg || 'Failed to clear history' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to clear history'
        return { success: false, message }
      }
    },

    /**
     * Remove history item
     */
    async removeHistoryItem(historyId: number) {
      try {
        const { http } = await import('~/utils/http')
        const response = await http.delete(`/api/user/reading/history/${historyId}`)
        
        if (response.code === 200) {
          this.history = this.history.filter(item => item.id !== historyId)
          return { success: true, message: 'History item removed' }
        }
        
        return { success: false, message: response.msg || 'Failed to remove history item' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to remove history item'
        return { success: false, message }
      }
    },

    /**
     * Format reading duration
     */
    formatDuration(seconds: number): string {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      } else {
        return `${minutes}分钟`
      }
    },

    /**
     * Initialize reading data
     */
    async initialize() {
      await Promise.all([
        this.fetchHistory(),
        this.fetchProgress(),
        this.fetchUnlockedChapters(),
      ])
    },

    /**
     * Clear all reading data
     */
    clearAll() {
      this.history = []
      this.progress = {}
      this.unlockedChapters = []
    },
  },
})

