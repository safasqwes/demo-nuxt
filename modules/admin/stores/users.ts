import { defineStore } from 'pinia'

interface AdminUser {
  id: number
  username: string
  email: string
  status: number
  created_at: string
}

interface AdminUsersState {
  loading: boolean
  items: AdminUser[]
  total: number
}

export const useAdminUserStore = defineStore('admin-users', {
  state: (): AdminUsersState => ({
    loading: false,
    items: [],
    total: 0,
  }),

  actions: {
    async fetchUsers(page = 1, size = 20) {
      this.loading = true
      try {
        // TODO: call /api/admin/users
        this.items = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
  },
})

