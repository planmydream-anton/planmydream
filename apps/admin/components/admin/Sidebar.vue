<template>
  <!-- Mobile overlay -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="sidebarOpen = false"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">PlanMyDream</span>
        <UBadge color="primary" variant="soft" size="xs">Admin</UBadge>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        @click="sidebarOpen = false"
      >
        <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        {{ item.label }}
      </NuxtLink>

      <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
        <p class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Контент</p>
        <NuxtLink
          v-for="item in contentNavigation"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          @click="sidebarOpen = false"
        >
          <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = useState('sidebarOpen', () => false)

const navigation = [
  { label: 'Дашборд', to: '/', icon: 'i-heroicons-home' },
  { label: 'Туры', to: '/tours', icon: 'i-heroicons-map' },
  { label: 'Даты', to: '/departures', icon: 'i-heroicons-calendar-days' },
  { label: 'Заявки', to: '/inquiries', icon: 'i-heroicons-inbox' },
  { label: 'Медиа', to: '/media', icon: 'i-heroicons-photo' },
]

const contentNavigation = [
  { label: 'Команда', to: '/team', icon: 'i-heroicons-users' },
  { label: 'Отзывы', to: '/reviews', icon: 'i-heroicons-star' },
  { label: 'FAQ', to: '/faqs', icon: 'i-heroicons-question-mark-circle' },
  { label: 'Преимущества', to: '/advantages', icon: 'i-heroicons-check-badge' },
  { label: 'Направления', to: '/destinations', icon: 'i-heroicons-globe-alt' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
