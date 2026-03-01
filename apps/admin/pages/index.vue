<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Дашборд</h1>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-4">
          <div :class="['p-3 rounded-lg', stat.bg]">
            <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.color" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Быстрые действия</h3>
        </template>
        <div class="space-y-2">
          <UButton to="/tours/create" block variant="soft" icon="i-heroicons-plus">
            Создать тур
          </UButton>
          <UButton to="/team/create" block variant="soft" icon="i-heroicons-user-plus">
            Добавить организатора
          </UButton>
          <UButton to="/inquiries" block variant="soft" icon="i-heroicons-inbox">
            Просмотреть заявки
          </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">Туры</h3>
        </template>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Опубликовано</span>
            <span class="font-medium">{{ data?.tours?.published || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Черновики</span>
            <span class="font-medium">{{ data?.tours?.draft || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Предстоящих дат</span>
            <span class="font-medium">{{ data?.departures?.upcoming || 0 }}</span>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">Заявки</h3>
        </template>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Всего</span>
            <span class="font-medium">{{ data?.inquiries?.total || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Новых</span>
            <UBadge v-if="data?.inquiries?.new" color="error" variant="soft">
              {{ data.inquiries.new }}
            </UBadge>
            <span v-else class="font-medium">0</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/admin/stats')

const stats = computed(() => [
  {
    label: 'Туров',
    value: data.value?.tours?.total || 0,
    icon: 'i-heroicons-map',
    bg: 'bg-blue-50 dark:bg-blue-950',
    color: 'text-blue-500',
  },
  {
    label: 'Новых заявок',
    value: data.value?.inquiries?.new || 0,
    icon: 'i-heroicons-inbox',
    bg: 'bg-orange-50 dark:bg-orange-950',
    color: 'text-orange-500',
  },
  {
    label: 'Предстоящих дат',
    value: data.value?.departures?.upcoming || 0,
    icon: 'i-heroicons-calendar-days',
    bg: 'bg-green-50 dark:bg-green-950',
    color: 'text-green-500',
  },
  {
    label: 'Организаторов',
    value: data.value?.team?.total || 0,
    icon: 'i-heroicons-users',
    bg: 'bg-purple-50 dark:bg-purple-950',
    color: 'text-purple-500',
  },
])
</script>
