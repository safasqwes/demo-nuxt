export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { idToken } = body

  console.log('Received Google login request:', { idToken: idToken ? 'present' : 'missing' })

  if (!idToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Google ID Token is required'
    })
  }

  try {
    const config = useRuntimeConfig()
    const backendUrl = config.backendApiUrl || 'http://localhost:8080/api'
    
    console.log('Calling backend:', `${backendUrl}/auth/google/login`)
    
    const response = await $fetch(`${backendUrl}/auth/google/login`, {
      method: 'POST',
      body: {
        idToken
      }
    })

    console.log('Backend response:', response)
    return response
  } catch (error: any) {
    console.error('Backend API error:', error)
    console.error('Error details:', {
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      data: error.data
    })
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Google login failed'
    })
  }
})
