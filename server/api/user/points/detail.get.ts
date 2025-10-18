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
    
    const query = getQuery(event)
    const { pageIndex = 1, pageSize = 10, type, pointsType } = query
    
    const response = await $fetch(`${backendUrl}/user/points/detail`, {
      query: {
        pageIndex,
        pageSize,
        type,
        pointsType
      },
      headers: {
        'Authorization': authHeader
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch points detail'
    })
  }
})
