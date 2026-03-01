interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    await navigateTo('/')
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    user.value = null
    await navigateTo('/login')
  }

  async function fetchUser() {
    try {
      const data = await $fetch<{ user: AuthUser }>('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
