/**
 * Change Password API Endpoint
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
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: 'Current password and new password are required',
    })
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'New password must be at least 6 characters',
    })
  }

  // In production:
  // 1. Verify current password
  // 2. Hash new password
  // 3. Update in database

  return {
    success: true,
    message: 'Password changed successfully',
  }
})

