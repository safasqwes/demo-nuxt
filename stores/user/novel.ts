/**
 * Novel Store
 * Manages novel data, rankings, and user interactions
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/api'

export interface Novel {
  id: number
  title: string
  author: string
  cover: string
  description: string
  genre: string
  status: 'ongoing' | 'completed' | 'hiatus'
  totalChapters: number
  totalViews: number
  monthlyViews: number
  totalBookmarks: number
  rating: number
  lastUpdated: string
  tags: string[]
}

export interface Chapter {
  id: number
  novelId: number
  chapterNumber: number
  title: string
  content: string
  publishedAt: string
  wordCount: number
}

export interface Comment {
  id: number
  novelId: number
  userId: number
  username: string
  avatar: string
  content: string
  rating: number
  createdAt: string
}

interface NovelState {
  novels: Novel[]
  chapters: Record<number, Chapter[]>
  comments: Record<number, Comment[]>
  loading: boolean
  searchResults: Novel[]
}

export const useNovelStore = defineStore('novel', {
  state: (): NovelState => ({
    novels: [
      {
        id: 1,
        title: 'Martial Peak',
        author: 'Momo',
        cover: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=400&fit=crop',
        description: 'The journey to the martial peak is a lonely, solitary and long one. In the face of adversity, you must survive and remain unyielding. Only then can you break through and continue on your journey to become the strongest.',
        genre: 'Cultivation',
        status: 'ongoing',
        totalChapters: 3000,
        totalViews: 15000000,
        monthlyViews: 850000,
        totalBookmarks: 125000,
        rating: 4.5,
        lastUpdated: '2025-10-12T10:00:00.000Z',
        tags: ['Cultivation', 'Action', 'Adventure', 'Martial Arts'],
      },
      {
        id: 2,
        title: 'Tales of Demons and Gods',
        author: 'Mad Snail',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
        description: 'Killed by a Sage Emperor and reborn as his 13 year old self, Nie Li was given a second chance at life. A second chance to change everything, save his loved ones and his beloved city.',
        genre: 'Fantasy',
        status: 'ongoing',
        totalChapters: 500,
        totalViews: 12000000,
        monthlyViews: 720000,
        totalBookmarks: 98000,
        rating: 4.7,
        lastUpdated: '2025-10-11T15:30:00.000Z',
        tags: ['Fantasy', 'Reincarnation', 'Magic', 'Adventure'],
      },
      {
        id: 3,
        title: 'Solo Leveling',
        author: 'Chugong',
        cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop',
        description: 'E-rank hunter Jinwoo Sung has no money, no talent, and no prospects to improve his lot in life. When he enters a hidden double dungeon one fateful day, he\'s granted a rare ability: the power to level up in strength.',
        genre: 'Action',
        status: 'completed',
        totalChapters: 270,
        totalViews: 25000000,
        monthlyViews: 1200000,
        totalBookmarks: 250000,
        rating: 4.9,
        lastUpdated: '2025-10-10T08:00:00.000Z',
        tags: ['Action', 'Leveling', 'Dungeon', 'Modern'],
      },
      {
        id: 4,
        title: 'Reverend Insanity',
        author: 'Gu Zhen Ren',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
        description: 'Humans are clever in tens of thousands of ways, Gu are the true refined essences of Heaven and Earth. The Three Temples are unrighteous, the demon is reborn.',
        genre: 'Cultivation',
        status: 'hiatus',
        totalChapters: 2334,
        totalViews: 8000000,
        monthlyViews: 450000,
        totalBookmarks: 85000,
        rating: 4.6,
        lastUpdated: '2025-09-15T12:00:00.000Z',
        tags: ['Cultivation', 'Dark', 'Scheming', 'Reincarnation'],
      },
      {
        id: 5,
        title: 'Lord of the Mysteries',
        author: 'Cuttlefish That Loves Diving',
        cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop',
        description: 'In the waves of steam and machinery, who could achieve extraordinary? In the fogs of history and darkness, who was whispering? I woke up from the realm of mysteries and opened my eyes to the world.',
        genre: 'Mystery',
        status: 'completed',
        totalChapters: 1394,
        totalViews: 18000000,
        monthlyViews: 980000,
        totalBookmarks: 180000,
        rating: 4.8,
        lastUpdated: '2025-10-09T20:00:00.000Z',
        tags: ['Mystery', 'Supernatural', 'Steampunk', 'Thriller'],
      },
      {
        id: 6,
        title: 'A Will Eternal',
        author: 'Er Gen',
        cover: 'https://images.unsplash.com/photo-1509043759401-136742328bb3?w=300&h=400&fit=crop',
        description: 'One will to create oceans. One will to summon the mulberry fields. One will to slaughter countless devils. One will to eradicate innumerable immortals.',
        genre: 'Cultivation',
        status: 'completed',
        totalChapters: 1314,
        totalViews: 10000000,
        monthlyViews: 520000,
        totalBookmarks: 95000,
        rating: 4.4,
        lastUpdated: '2025-10-08T14:00:00.000Z',
        tags: ['Cultivation', 'Comedy', 'Adventure', 'Xianxia'],
      },
      {
        id: 7,
        title: 'The Beginning After The End',
        author: 'TurtleMe',
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop',
        description: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power.',
        genre: 'Fantasy',
        status: 'ongoing',
        totalChapters: 450,
        totalViews: 14000000,
        monthlyViews: 820000,
        totalBookmarks: 145000,
        rating: 4.7,
        lastUpdated: '2025-10-13T09:00:00.000Z',
        tags: ['Fantasy', 'Reincarnation', 'Magic', 'Academy'],
      },
      {
        id: 8,
        title: 'Overgeared',
        author: 'Park Saenal',
        cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop',
        description: 'Shin Youngwoo has had an unfortunate life and is now stuck carrying bricks on construction sites. He even had to do labor in the VR game, Satisfy!',
        genre: 'Game',
        status: 'ongoing',
        totalChapters: 1800,
        totalViews: 11000000,
        monthlyViews: 650000,
        totalBookmarks: 110000,
        rating: 4.5,
        lastUpdated: '2025-10-12T16:00:00.000Z',
        tags: ['Game', 'VR', 'Leveling', 'Crafting'],
      },
    ],
    chapters: {},
    comments: {},
    loading: false,
    searchResults: [],
  }),

  getters: {
    /**
     * Get novels sorted by monthly views
     */
    monthlyRanking: (state): Novel[] => {
      return [...state.novels]
        .sort((a, b) => b.monthlyViews - a.monthlyViews)
        .slice(0, 10)
    },

    /**
     * Get novels sorted by bookmarks
     */
    bookmarkRanking: (state): Novel[] => {
      return [...state.novels]
        .sort((a, b) => b.totalBookmarks - a.totalBookmarks)
        .slice(0, 10)
    },

    /**
     * Get novel by ID
     */
    getNovelById: (state) => (id: number): Novel | undefined => {
      return state.novels.find((novel) => novel.id === id)
    },

    /**
     * Get chapters for a novel
     */
    getNovelChapters: (state) => (novelId: number): Chapter[] => {
      return state.chapters[novelId] || []
    },

    /**
     * Get comments for a novel
     */
    getNovelComments: (state) => (novelId: number): Comment[] => {
      return state.comments[novelId] || []
    },
  },

  actions: {
    /**
     * Fetch novels list
     */
    async fetchNovels(filters: any = {}) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.NOVELS.LIST, filters)
        
        if (response.code === 200) {
          this.novels = response.data || []
          return { success: true, total: response.total || 0 }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch novels' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch novels'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch novel details
     */
    async fetchNovelDetail(novelId: number) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.NOVELS.DETAIL(novelId))
        
        if (response.code === 200) {
          // Update or add novel to the list
          const novelIndex = this.novels.findIndex(novel => novel.id === novelId)
          if (novelIndex !== -1) {
            this.novels[novelIndex] = response.data
          } else {
            this.novels.push(response.data)
          }
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch novel details' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch novel details'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch chapter content
     */
    async fetchChapterContent(novelId: number, chapterId: number) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.NOVELS.CHAPTER(novelId, chapterId))
        
        if (response.code === 200) {
          return { success: true, data: response.data }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch chapter content' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch chapter content'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Search novels
     */
    async searchNovels(query: string, filters: any = {}) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.NOVELS.SEARCH, {
          q: query,
          ...filters,
        })
        
        if (response.code === 200) {
          this.searchResults = response.data || []
          return { success: true, total: response.total || 0 }
        }
        
        return { success: false, message: response.msg || 'Search failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Search failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch novel chapters
     */
    async fetchChapters(novelId: number) {
      if (this.chapters[novelId]) return // Already loaded

      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.NOVELS.CHAPTERS(novelId))
        
        if (response.code === 200) {
          this.chapters[novelId] = response.data || []
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch chapters' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch chapters'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch novel comments
     */
    async fetchComments(novelId: number) {
      if (this.comments[novelId]) return // Already loaded

      this.loading = true
      try {
        // Mock comments
        const mockComments: Comment[] = [
          {
            id: 1,
            novelId,
            userId: 1,
            username: 'NovelFan123',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'This is absolutely amazing! The plot development is incredible and the characters are so well written. Can\'t wait for the next chapter!',
            rating: 5,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 2,
            novelId,
            userId: 2,
            username: 'ReadingAddict',
            avatar: 'https://i.pravatar.cc/150?img=2',
            content: 'Great story! The world-building is top-notch. Highly recommend to anyone who loves this genre.',
            rating: 5,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 3,
            novelId,
            userId: 3,
            username: 'BookWorm99',
            avatar: 'https://i.pravatar.cc/150?img=3',
            content: 'Good read overall, but the pacing could be better in some parts. Still enjoying it though!',
            rating: 4,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
        ]

        this.comments[novelId] = mockComments
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Helper: Generate chapter title
     */
    getChapterTitle(chapterNum: number): string {
      const titles = [
        'A New Beginning',
        'The Journey Starts',
        'First Challenge',
        'Hidden Dangers',
        'Unexpected Ally',
        'Breaking Through',
        'The Tournament',
        'Dark Secrets',
        'Power Awakening',
        'Final Confrontation',
      ]
      return titles[chapterNum % titles.length]
    },

    /**
     * Helper: Generate mock content
     */
    generateMockContent(chapterNum: number): string {
      return `Chapter ${chapterNum} Content\n\n` +
        'The sun rose slowly over the distant mountains, casting long shadows across the valley below. ' +
        'Our protagonist stood at the edge of the cliff, contemplating the journey ahead.\n\n' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n' +
        'The path forward was treacherous, filled with unknown dangers and hidden opportunities. ' +
        'But there was no turning back now. The decision had been made, and the adventure was about to begin...\n\n' +
        '[This is mock content for demonstration purposes. In a real application, this would be replaced with actual chapter content.]'
    },
  },
})

