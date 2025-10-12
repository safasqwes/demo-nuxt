/**
 * Update Profile API Endpoint
 */

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const { username, email, bio } = body

  // In production: Update user in database

  return {
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: 1,
        username: username || 'DemoUser',
        email: email || 'demo@novelhub.com',
        bio: bio || '',
        plan_name: 'premium',
        avatar: '',
        created_at: '2024-01-01T00:00:00.000Z',
      },
    },
  }
})

