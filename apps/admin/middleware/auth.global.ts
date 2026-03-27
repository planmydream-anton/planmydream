export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isOrganizer, isAdmin, fetchUser } = useAuth()

  // Public pages — no auth required
  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path)) {
    if (isAuthenticated.value) {
      return navigateTo(isOrganizer.value ? '/o/' : '/')
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

  // Role-based route protection
  const isOrganizerRoute = to.path.startsWith('/o/')
  const isAdminRoute = !isOrganizerRoute && to.path !== '/login' && to.path !== '/register'

  // Organizer trying to access admin pages → redirect to organizer dashboard
  if (isAdminRoute && isOrganizer.value) {
    return navigateTo('/o/')
  }

  // Admin/manager trying to access organizer pages → redirect to admin dashboard
  if (isOrganizerRoute && isAdmin.value) {
    return navigateTo('/')
  }
})
