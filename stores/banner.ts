/**
 * Banner Store
 * Manages banner carousel data for homepage
 */

import { defineStore } from 'pinia'

export interface Banner {
  id: number
  title: string
  image: string
  link?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

interface BannerState {
  banners: Banner[]
  loading: boolean
}

export const useBannerStore = defineStore('banner', {
  state: (): BannerState => ({
    banners: [
      {
        id: 1,
        title: 'Welcome to NovelHub',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
        link: '/about',
        order: 1,
        active: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        title: 'Discover Amazing Stories',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop',
        link: '#',
        order: 2,
        active: true,
        createdAt: '2025-01-02T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
      },
      {
        id: 3,
        title: 'Read Anytime, Anywhere',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
        link: '#',
        order: 3,
        active: true,
        createdAt: '2025-01-03T00:00:00.000Z',
        updatedAt: '2025-01-03T00:00:00.000Z',
      },
    ],
    loading: false,
  }),

  getters: {
    /**
     * Get active banners sorted by order
     */
    activeBanners: (state): Banner[] => {
      return state.banners
        .filter((banner) => banner.active)
        .sort((a, b) => a.order - b.order)
    },

    /**
     * Get all banners sorted by order
     */
    allBanners: (state): Banner[] => {
      return [...state.banners].sort((a, b) => a.order - b.order)
    },

    /**
     * Get banner by ID
     */
    getBannerById: (state) => (id: number): Banner | undefined => {
      return state.banners.find((banner) => banner.id === id)
    },
  },

  actions: {
    /**
     * Fetch all banners
     */
    async fetchBanners() {
      this.loading = true
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        // In production, replace with actual API call
        // const response = await http.get('/api/banners')
        // this.banners = response.data
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add new banner
     */
    async addBanner(banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) {
      const newBanner: Banner = {
        ...banner,
        id: Math.max(...this.banners.map((b) => b.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.banners.push(newBanner)

      // In production, replace with actual API call
      // await http.post('/api/banners', banner)
      return newBanner
    },

    /**
     * Update banner
     */
    async updateBanner(id: number, updates: Partial<Banner>) {
      const index = this.banners.findIndex((b) => b.id === id)
      if (index !== -1) {
        this.banners[index] = {
          ...this.banners[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }

      // In production, replace with actual API call
      // await http.put(`/api/banners/${id}`, updates)
    },

    /**
     * Delete banner
     */
    async deleteBanner(id: number) {
      const index = this.banners.findIndex((b) => b.id === id)
      if (index !== -1) {
        this.banners.splice(index, 1)
      }

      // In production, replace with actual API call
      // await http.delete(`/api/banners/${id}`)
    },

    /**
     * Toggle banner active status
     */
    async toggleBannerStatus(id: number) {
      const banner = this.banners.find((b) => b.id === id)
      if (banner) {
        banner.active = !banner.active
        banner.updatedAt = new Date().toISOString()
      }
    },

    /**
     * Reorder banners
     */
    async reorderBanners(bannerIds: number[]) {
      bannerIds.forEach((id, index) => {
        const banner = this.banners.find((b) => b.id === id)
        if (banner) {
          banner.order = index + 1
          banner.updatedAt = new Date().toISOString()
        }
      })
    },
  },
})

