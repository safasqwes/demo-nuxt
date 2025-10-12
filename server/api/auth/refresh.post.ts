/**
 * Refresh Token API Endpoint
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { refreshToken } = body

  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      message: 'Refresh token is required',
    })
  }

  // In production: Verify refresh token and generate new tokens

  const newToken = `demo_token_${Date.now()}`
  const newRefreshToken = `demo_refresh_${Date.now()}`

  return {
    success: true,
    data: {
      token: newToken,
      refreshToken: newRefreshToken,
    },
  }
})

