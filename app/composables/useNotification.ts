/**
 * Notification Composable
 * Convenient wrapper for app store notifications
 */

export const useNotification = () => {
  const appStore = useAppStore()

  const notify = {
    /**
     * Success notification
     */
    success: (title: string, message: string, duration = 3000) => {
      return appStore.addNotification({
        type: 'success',
        title,
        message,
        duration,
      })
    },

    /**
     * Error notification
     */
    error: (title: string, message: string, duration = 5000) => {
      return appStore.addNotification({
        type: 'error',
        title,
        message,
        duration,
      })
    },

    /**
     * Warning notification
     */
    warning: (title: string, message: string, duration = 4000) => {
      return appStore.addNotification({
        type: 'warning',
        title,
        message,
        duration,
      })
    },

    /**
     * Info notification
     */
    info: (title: string, message: string, duration = 3000) => {
      return appStore.addNotification({
        type: 'info',
        title,
        message,
        duration,
      })
    },
  }

  return {
    notify,
    notifications: computed(() => appStore.notifications),
    clear: () => appStore.clearNotifications(),
    remove: (id: string) => appStore.removeNotification(id),
  }
}

