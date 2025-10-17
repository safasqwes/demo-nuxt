/**
 * Stripe Plugin for Client-side
 * Initializes Stripe SDK and provides global access
 */

import { loadStripe } from '@stripe/stripe-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const stripePublishableKey = config.public.stripePublishableKey

  if (stripePublishableKey) {
    const stripe = await loadStripe(stripePublishableKey)
    
    return {
      provide: {
        stripe
      }
    }
  }
})

