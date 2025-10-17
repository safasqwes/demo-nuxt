import { defineStore } from 'pinia'

interface AdminNovel {
  id: number
  novel_name: string
  author: string
  status: number
  publish_status: number
  created_at: string
}

interface AdminNovelsState {
  loading: boolean
  items: AdminNovel[]
  total: number
}

export const useAdminNovelStore = defineStore('admin-novels', {
  state: (): AdminNovelsState => ({
    loading: false,
    items: [],
    total: 0,
  }),

  actions: {
    async fetchNovels(page = 1, size = 20) {
      this.loading = true
      try {
        // TODO: call /api/admin/novels
        this.items = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
  },
})

