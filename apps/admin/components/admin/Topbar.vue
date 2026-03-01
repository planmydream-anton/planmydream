<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
    <!-- Left: burger + breadcrumb -->
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

    <!-- Right: user -->
    <div class="flex items-center gap-3">
      <UDropdownMenu
        :items="userMenuItems"
      >
        <UButton variant="ghost" color="neutral" class="gap-2">
          <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
          <span class="hidden sm:inline text-sm">{{ user?.name || user?.email }}</span>
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
  '/': 'Дашборд',
  '/tours': 'Туры',
  '/departures': 'Даты проведения',
  '/inquiries': 'Заявки',
  '/media': 'Медиа',
  '/team': 'Команда',
  '/reviews': 'Отзывы',
  '/faqs': 'FAQ',
  '/advantages': 'Преимущества',
  '/destinations': 'Направления',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path === '/' && route.path === '/') return title
    if (path !== '/' && route.path.startsWith(path)) return title
  }
  return 'PlanMyDream Admin'
})

const userMenuItems = computed(() => [
  [{
    label: user.value?.email || '',
    disabled: true,
  }],
  [{
    label: 'Выйти',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: () => logout(),
  }],
])
</script>
