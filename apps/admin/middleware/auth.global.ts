export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth()

  // Don't protect login page
  if (to.path === '/login') {
    if (isAuthenticated.value) {
      return navigateTo('/')
    }
    return
  }

  // Try to restore session
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
