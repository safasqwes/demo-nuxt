/**
 * Register API Endpoint
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  // Validate input
  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username, email, and password are required',
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters',
    })
  }

  // Demo: Check if user exists
  // In production, check database
  if (email === 'demo@novelhub.com') {
    throw createError({
      statusCode: 409,
      message: 'Email already exists',
    })
  }

  // Demo: Create user and generate tokens
  const token = `demo_token_${Date.now()}`
  const refreshToken = `demo_refresh_${Date.now()}`

  return {
    success: true,
    message: 'Registration successful',
    data: {
      token,
      refreshToken,
      user: {
        id: Math.floor(Math.random() * 1000),
        email,
        username,
        plan_name: 'free',
        avatar: '',
        created_at: new Date().toISOString(),
      },
    },
  }
})

