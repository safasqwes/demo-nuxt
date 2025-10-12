/**
 * Login API Endpoint
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Validate input
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  // Demo: Simulate authentication
  // In production, verify against database
  if (email === 'demo@novelhub.com' && password === 'password') {
    // Generate tokens (in production, use JWT)
    const token = `demo_token_${Date.now()}`
    const refreshToken = `demo_refresh_${Date.now()}`

    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: 1,
          email: 'demo@novelhub.com',
          username: 'DemoUser',
          plan_name: 'premium',
          avatar: '',
          created_at: '2024-01-01T00:00:00.000Z',
        },
      },
    }
  }

  // Invalid credentials
  throw createError({
    statusCode: 401,
    message: 'Invalid email or password',
  })
})

