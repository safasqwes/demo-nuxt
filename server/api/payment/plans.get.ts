export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const backendUrl = config.backendApiUrl || 'http://localhost:8080/api'
    
    const response = await $fetch(`${backendUrl}/payment/plans`)
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch payment plans'
    })
  }
})
