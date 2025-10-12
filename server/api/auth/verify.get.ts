/**
 * Verify Token API Endpoint
 */

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No token provided',
    })
  }

  // In production: Verify JWT token

  return {
    success: true,
    message: 'Token is valid',
  }
})

