export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const backendUrl = config.backendApiUrl || 'http://localhost:8080/api'
    
    // Get auth token from headers
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }
    
    const response = await $fetch(`${backendUrl}/user/points/claim`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to claim daily points'
    })
  }
})
