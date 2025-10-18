export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { planId, successUrl, cancelUrl } = body

  if (!planId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Plan ID is required'
    })
  }

  try {
    const config = useRuntimeConfig()
    const backendUrl = config.backendApiUrl || 'http://localhost:8080/api'
    
    const response = await $fetch(`${backendUrl}/payment/checkout`, {
      method: 'POST',
      body: {
        planId,
        successUrl: successUrl || `${config.public.baseUrl}/payment/success`,
        cancelUrl: cancelUrl || `${config.public.baseUrl}/payment/cancel`
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create checkout session'
    })
  }
})
