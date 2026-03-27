<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
    <!-- Left: burger + title -->
    <div class="flex items-center gap-3">
      <UButton
        icon="i-heroicons-bars-3"
        variant="ghost"
        color="neutral"
        class="lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      />
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ pageTitle }}
      </h2>
    </div>

    <!-- Right: verification banners + user menu -->
    <div class="flex items-center gap-3">
      <!-- Verification status -->
      <UBadge
        v-if="user?.organizerProfile && !user.organizerProfile.emailVerified"
        color="amber"
        variant="soft"
        size="sm"
        class="hidden sm:flex"
      >
        Email не подтверждён
      </UBadge>

      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" color="neutral" class="gap-2">
          <UAvatar
            v-if="user?.organizerProfile?.photoUrl"
            :src="user.organizerProfile.photoUrl"
            size="xs"
          />
          <UIcon v-else name="i-heroicons-user-circle" class="w-6 h-6" />
          <span class="hidden sm:inline text-sm">{{ user?.organizerProfile?.firstName || user?.name || user?.email }}</span>
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebarOpen = useState('sidebarOpen', () => false)
const { user, logout } = useAuth()
const route = useRoute()

const pageTitles: Record<string, string> = {
  '/o/': 'Дашборд',
  '/o/tours': 'Мои туры',
  '/o/inquiries': 'Заявки',
  '/o/profile': 'Профиль',
  '/o/profile/security': 'Безопасность',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path === '/o/' && (route.path === '/o/' || route.path === '/o')) return title
    if (path !== '/o/' && route.path.startsWith(path)) return title
  }
  return 'Кабинет организатора'
})

const userMenuItems = computed(() => [
  [{
    label: user.value?.email || '',
    disabled: true,
  }],
  [{
    label: 'Профиль',
    icon: 'i-heroicons-user',
    onSelect: () => navigateTo('/o/profile'),
  }, {
    label: 'Безопасность',
    icon: 'i-heroicons-cog-6-tooth',
    onSelect: () => navigateTo('/o/profile/security'),
  }],
  [{
    label: 'Выйти',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: () => logout(),
  }],
])
</script>
