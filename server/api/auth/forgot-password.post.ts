/**
 * Forgot Password API Endpoint
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required',
    })
  }

  // In production:
  // 1. Check if user exists
  // 2. Generate reset token
  // 3. Send email with reset link

  console.log(`[Demo] Password reset email would be sent to: ${email}`)

  return {
    success: true,
    message: 'Password reset email sent',
  }
})

