export default defineEventHandler(async (event) => {
  clearAuthCookie(event)
  return { success: true }
})
