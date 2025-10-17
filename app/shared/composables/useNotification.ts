/**
 * Notification Composable
 * Simple notification system using console and alerts
 */

export const useNotification = () => {
  const notify = {
    /**
     * Success notification
     */
    success: (title: string, message: string, duration = 3000) => {
      console.log(`✅ ${title}: ${message}`)
      // In a real app, you would show a toast notification here
    },

    /**
     * Error notification
     */
    error: (title: string, message: string, duration = 5000) => {
      console.error(`❌ ${title}: ${message}`)
      // In a real app, you would show a toast notification here
    },

    /**
     * Warning notification
     */
    warning: (title: string, message: string, duration = 4000) => {
      console.warn(`⚠️ ${title}: ${message}`)
      // In a real app, you would show a toast notification here
    },

    /**
     * Info notification
     */
    info: (title: string, message: string, duration = 3000) => {
      console.info(`ℹ️ ${title}: ${message}`)
      // In a real app, you would show a toast notification here
    },
  }

  return {
    notify,
    notifications: ref([]),
    clear: () => {},
    remove: (id: string) => {},
  }
}

