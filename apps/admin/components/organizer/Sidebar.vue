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
      'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200 flex flex-col',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <NuxtLink to="/o/" class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">PlanMyDream</span>
        <UBadge color="emerald" variant="soft" size="xs">Организатор</UBadge>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="[
          isActive(item.to)
            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
            : item.disabled
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
        :tabindex="item.disabled ? -1 : 0"
        @click.prevent="item.disabled ? null : (sidebarOpen = false)"
      >
        <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        {{ item.label }}
        <UBadge v-if="item.disabled" color="neutral" variant="soft" size="xs" class="ml-auto">Скоро</UBadge>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-800">
      <div class="px-3 text-xs text-gray-400 space-y-1">
        <NuxtLink to="/o/profile" class="block hover:text-gray-600">Профиль организатора</NuxtLink>
        <NuxtLink to="/o/profile/security" class="block hover:text-gray-600">Настройки безопасности</NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = useState('sidebarOpen', () => false)

const navigation = [
  { label: 'Дашборд', to: '/o/', icon: 'i-heroicons-home', disabled: false },
  { label: 'Туры', to: '/o/tours', icon: 'i-heroicons-map', disabled: false },
  { label: 'Заявки', to: '/o/inquiries', icon: 'i-heroicons-inbox', disabled: false },
  { label: 'Сообщения', to: '/o/messages', icon: 'i-heroicons-chat-bubble-left-right', disabled: true },
  { label: 'Отзывы', to: '/o/reviews', icon: 'i-heroicons-star', disabled: true },
  { label: 'Платежи', to: '/o/payments', icon: 'i-heroicons-banknotes', disabled: true },
]

function isActive(path: string) {
  if (path === '/o/') return route.path === '/o/' || route.path === '/o'
  return route.path.startsWith(path)
}
</script>
