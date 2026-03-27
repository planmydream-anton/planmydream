interface OrganizerProfile {
  firstName: string
  lastName: string
  photoUrl: string | null
  emailVerified: boolean
  identityVerified: boolean
  dataVerified: boolean
}

interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
  organizerProfile?: OrganizerProfile
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  consentOffer: boolean
  consentPrivacy: boolean
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isOrganizer = computed(() => user.value?.role === 'organizer')
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'manager')

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    await navigateTo(data.user.role === 'organizer' ? '/o/' : '/')
  }

  async function register(registerData: RegisterData) {
    const data = await $fetch<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: registerData,
    })
    user.value = data.user
    await navigateTo('/o/')
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
    isOrganizer,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
  }
}
