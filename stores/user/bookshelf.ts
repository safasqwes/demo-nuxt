/**
 * Bookshelf Store
 * Manages user's bookshelf (favorite novels) and reading progress
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/api'

export interface BookshelfItem {
  id: number
  novel: {
    id: number
    title: string
    author: string
    cover: string
    status: string
    total_chapters: number
  }
  last_read_chapter_id: number | null
  last_read_time: string
  read_progress: number
  sort_order: number
  is_top: boolean
  created_at: string
  updated_at: string
}

interface BookshelfState {
  items: BookshelfItem[]
  loading: boolean
}

export const useBookshelfStore = defineStore('bookshelf', {
  state: (): BookshelfState => ({
    items: [],
    loading: false,
  }),

  getters: {
    /**
     * Get bookshelf items sorted by last read time
     */
    sortedItems: (state): BookshelfItem[] => {
      return [...state.items].sort((a, b) => {
        // Top items first
        if (a.is_top && !b.is_top) return -1
        if (!a.is_top && b.is_top) return 1
        
        // Then by last read time
        return new Date(b.last_read_time).getTime() - new Date(a.last_read_time).getTime()
      })
    },

    /**
     * Get recently read items
     */
    recentlyRead: (state): BookshelfItem[] => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      return state.items.filter(item => 
        new Date(item.last_read_time) > oneWeekAgo
      ).sort((a, b) => 
        new Date(b.last_read_time).getTime() - new Date(a.last_read_time).getTime()
      )
    },

    /**
     * Get items by reading progress
     */
    getItemsByProgress: (state) => (minProgress: number, maxProgress: number = 100): BookshelfItem[] => {
      return state.items.filter(item => 
        item.read_progress >= minProgress && item.read_progress <= maxProgress
      )
    },

    /**
     * Get unfinished items (progress < 100%)
     */
    unfinishedItems: (state): BookshelfItem[] => {
      return state.items.filter(item => item.read_progress < 100)
    },

    /**
     * Get completed items (progress = 100%)
     */
    completedItems: (state): BookshelfItem[] => {
      return state.items.filter(item => item.read_progress === 100)
    },

    /**
     * Check if novel is in bookshelf
     */
    isInBookshelf: (state) => (novelId: number): boolean => {
      return state.items.some(item => item.novel.id === novelId)
    },

    /**
     * Get bookshelf item by novel ID
     */
    getItemByNovelId: (state) => (novelId: number): BookshelfItem | undefined => {
      return state.items.find(item => item.novel.id === novelId)
    },
  },

  actions: {
    /**
     * Fetch bookshelf items
     */
    async fetchBookshelf() {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.USER.BOOKSHELF)
        
        if (response.code === 200) {
          this.items = response.data || []
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch bookshelf' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch bookshelf'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Add novel to bookshelf
     */
    async addToBookshelf(novelId: number) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.USER.ADD_TO_BOOKSHELF(novelId))
        
        if (response.code === 200) {
          // Add to local state
          if (response.data) {
            this.items.push(response.data)
          }
          return { success: true, message: 'Added to bookshelf' }
        }
        
        return { success: false, message: response.msg || 'Failed to add to bookshelf' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to add to bookshelf'
        return { success: false, message }
      }
    },

    /**
     * Remove novel from bookshelf
     */
    async removeFromBookshelf(novelId: number) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.delete(API_ENDPOINTS.USER.REMOVE_FROM_BOOKSHELF(novelId))
        
        if (response.code === 200) {
          // Remove from local state
          this.items = this.items.filter(item => item.novel.id !== novelId)
          return { success: true, message: 'Removed from bookshelf' }
        }
        
        return { success: false, message: response.msg || 'Failed to remove from bookshelf' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to remove from bookshelf'
        return { success: false, message }
      }
    },

    /**
     * Toggle bookshelf status
     */
    async toggleBookshelf(novelId: number) {
      const isInBookshelf = this.isInBookshelf(novelId)
      
      if (isInBookshelf) {
        return await this.removeFromBookshelf(novelId)
      } else {
        return await this.addToBookshelf(novelId)
      }
    },

    /**
     * Update reading progress
     */
    async updateReadingProgress(novelId: number, chapterId: number, progress: number) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.put(`/api/user/bookshelf/${novelId}/progress`, {
          chapter_id: chapterId,
          progress,
        })
        
        if (response.code === 200) {
          // Update local state
          const item = this.items.find(item => item.novel.id === novelId)
          if (item) {
            item.last_read_chapter_id = chapterId
            item.read_progress = progress
            item.last_read_time = new Date().toISOString()
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
     * Set item as top
     */
    async setTop(novelId: number, isTop: boolean) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.put(`/api/user/bookshelf/${novelId}/top`, {
          is_top: isTop,
        })
        
        if (response.code === 200) {
          // Update local state
          const item = this.items.find(item => item.novel.id === novelId)
          if (item) {
            item.is_top = isTop
          }
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to update top status' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to update top status'
        return { success: false, message }
      }
    },

    /**
     * Update sort order
     */
    async updateSortOrder(novelId: number, sortOrder: number) {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.put(`/api/user/bookshelf/${novelId}/sort`, {
          sort_order: sortOrder,
        })
        
        if (response.code === 200) {
          // Update local state
          const item = this.items.find(item => item.novel.id === novelId)
          if (item) {
            item.sort_order = sortOrder
          }
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to update sort order' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to update sort order'
        return { success: false, message }
      }
    },

    /**
     * Clear bookshelf
     */
    clearBookshelf() {
      this.items = []
    },

    /**
     * Get reading statistics
     */
    getReadingStats() {
      const total = this.items.length
      const completed = this.completedItems.length
      const unfinished = this.unfinishedItems.length
      const recentlyRead = this.recentlyRead.length
      
      return {
        total,
        completed,
        unfinished,
        recentlyRead,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    },
  },
})

