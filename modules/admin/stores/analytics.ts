import { defineStore } from 'pinia'

interface RevenuePoint { date: string; amount: number }
interface UserPoint { date: string; count: number }

interface AnalyticsState {
  loading: boolean
  revenue: RevenuePoint[]
  userGrowth: UserPoint[]
}

export const useAdminAnalyticsStore = defineStore('admin-analytics', {
  state: (): AnalyticsState => ({
    loading: false,
    revenue: [],
    userGrowth: [],
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true
      try {
        // TODO: call /api/admin/analytics/dashboard
        this.revenue = [
          { date: '2025-10-10', amount: 320 },
          { date: '2025-10-11', amount: 540 },
        ]
        this.userGrowth = [
          { date: '2025-10-10', count: 45 },
          { date: '2025-10-11', count: 73 },
        ]
      } finally {
        this.loading = false
      }
    },
  },
})

