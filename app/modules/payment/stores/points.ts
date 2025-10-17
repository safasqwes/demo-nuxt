/**
 * Points Store
 * Manages user points balance, history, and daily check-in
 */

import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/shared/config/api'

export interface PointsBalance {
  points: number
  fixed_points: number
  sub_points: number
  sub_points_left: number
  free_points: number
  claimed_days: number
  claimed_at: string
}

export interface PointsDetail {
  id: number
  points: number
  type: number // 0-消耗 1-增加
  func_type: number
  points_type: number // 0-免费积分 1-永久积分
  extra_data: string
  created_at: string
}

interface PointsState {
  balance: PointsBalance
  history: PointsDetail[]
  loading: boolean
  checkingIn: boolean
}

export const usePointsStore = defineStore('points', {
  state: (): PointsState => ({
    balance: {
      points: 0,
      fixed_points: 0,
      sub_points: 0,
      sub_points_left: 0,
      free_points: 0,
      claimed_days: 0,
      claimed_at: '1970-01-01T00:00:00Z',
    },
    history: [],
    loading: false,
    checkingIn: false,
  }),

  getters: {
    /**
     * Check if user can check in today
     */
    canCheckIn: (state): boolean => {
      const lastClaimed = new Date(state.balance.claimed_at)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      lastClaimed.setHours(0, 0, 0, 0)
      
      return lastClaimed.getTime() < today.getTime()
    },

    /**
     * Get daily check-in points based on consecutive days
     */
    dailyPoints: (state): number => {
      const days = state.balance.claimed_days
      if (days < 7) return 50
      if (days < 30) return 100
      return 200
    },

    /**
     * Get points history by type
     */
    getHistoryByType: (state) => (type: number): PointsDetail[] => {
      return state.history.filter(record => record.type === type)
    },

    /**
     * Get recent points history
     */
    recentHistory: (state): PointsDetail[] => {
      return state.history.slice(0, 10)
    },
  },

  actions: {
    /**
     * Fetch points balance
     */
    async fetchBalance() {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.USER.POINTS)
        
        if (response.code === 200) {
          this.balance = response.data || this.balance
          return { success: true }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch points balance' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch points balance'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch points history
     */
    async fetchHistory(page: number = 1, size: number = 20, type?: number) {
      this.loading = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.get(API_ENDPOINTS.USER.POINTS_DETAIL, {
          page,
          size,
          type,
        })
        
        if (response.code === 200) {
          this.history = response.data || []
          return { success: true, total: response.total || 0 }
        }
        
        return { success: false, message: response.msg || 'Failed to fetch points history' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to fetch points history'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    /**
     * Daily check-in
     */
    async dailyCheckIn() {
      if (!this.canCheckIn) {
        return { success: false, message: 'Already checked in today' }
      }

      this.checkingIn = true
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post(API_ENDPOINTS.USER.POINTS_CLAIM)
        
        if (response.code === 200) {
          // Update balance
          this.balance = response.data.balance || this.balance
          
          // Add to history
          if (response.data.history_record) {
            this.history.unshift(response.data.history_record)
          }
          
          return { 
            success: true, 
            points: response.data.points || this.dailyPoints,
            message: `Check-in successful! You earned ${response.data.points || this.dailyPoints} points.`
          }
        }
        
        return { success: false, message: response.msg || 'Check-in failed' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Check-in failed'
        return { success: false, message }
      } finally {
        this.checkingIn = false
      }
    },

    /**
     * Consume points (for unlocking chapters, etc.)
     */
    async consumePoints(points: number, funcType: number, extraData: string = '') {
      try {
        const { http } = await import('~/shared/utils/http')
        const response = await http.post('/api/user/points/consume', {
          points,
          func_type: funcType,
          extra_data: extraData,
        })
        
        if (response.code === 200) {
          // Update balance
          this.balance = response.data.balance || this.balance
          
          // Add to history
          if (response.data.history_record) {
            this.history.unshift(response.data.history_record)
          }
          
          return { success: true, message: 'Points consumed successfully' }
        }
        
        return { success: false, message: response.msg || 'Failed to consume points' }
      } catch (error: any) {
        const message = error.response?.data?.msg || error.message || 'Failed to consume points'
        return { success: false, message }
      }
    },

    /**
     * Check if user has enough points
     */
    hasEnoughPoints(requiredPoints: number): boolean {
      return this.balance.points >= requiredPoints
    },

    /**
     * Get points type text
     */
    getPointsTypeText(pointsType: number): string {
      return pointsType === 0 ? '免费积分' : '永久积分'
    },

    /**
     * Get function type text
     */
    getFunctionTypeText(funcType: number): string {
      const types: Record<number, string> = {
        1: '购买套餐',
        2: '每日签到',
        3: '解锁章节',
        4: '邀请好友',
        5: '完成任务',
        6: '系统赠送',
      }
      return types[funcType] || '其他'
    },

    /**
     * Initialize points data
     */
    async initialize() {
      await Promise.all([
        this.fetchBalance(),
        this.fetchHistory(),
      ])
    },
  },
})

