export const useNotification = () => {
  const notify = {
    info: (title: string, message: string) => {
      // Simple browser notification for now
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, { body: message })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(title, { body: message })
            }
          })
        }
      }
      // Fallback to console for development
      console.log(`[${title}] ${message}`)
    },
    success: (title: string, message: string) => {
      console.log(`✅ [${title}] ${message}`)
    },
    error: (title: string, message: string) => {
      console.error(`❌ [${title}] ${message}`)
    },
    warning: (title: string, message: string) => {
      console.warn(`⚠️ [${title}] ${message}`)
    }
  }

  return { notify }
}
