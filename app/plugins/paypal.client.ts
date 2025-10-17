/**
 * PayPal Plugin for Client-side
 * Initializes PayPal SDK and provides global access
 */

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const paypalClientId = config.public.paypalClientId

  if (paypalClientId && process.client) {
    // Load PayPal SDK dynamically
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`
    script.async = true
    
    return new Promise((resolve) => {
      script.onload = () => {
        resolve({
          provide: {
            paypal: (window as any).paypal
          }
        })
      }
      document.head.appendChild(script)
    })
  }
})

