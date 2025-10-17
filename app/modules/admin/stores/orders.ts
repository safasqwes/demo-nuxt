import { defineStore } from 'pinia'

interface AdminOrder {
  id: number
  order_id: string
  user_id: number
  plan_name: string
  amount: number
  status: number
  created_at: string
}

interface AdminOrdersState {
  loading: boolean
  items: AdminOrder[]
  total: number
}

export const useAdminOrderStore = defineStore('admin-orders', {
  state: (): AdminOrdersState => ({
    loading: false,
    items: [],
    total: 0,
  }),

  actions: {
    async fetchOrders(page = 1, size = 20) {
      this.loading = true
      try {
        // TODO: call /api/admin/orders
        this.items = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
  },
})

