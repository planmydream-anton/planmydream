<template>
  <div class="space-y-6">
    <!-- View toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          :variant="viewMode === 'kanban' ? 'solid' : 'ghost'"
          icon="i-heroicons-view-columns"
          size="sm"
          @click="viewMode = 'kanban'"
        />
        <UButton
          :variant="viewMode === 'list' ? 'solid' : 'ghost'"
          icon="i-heroicons-list-bullet"
          size="sm"
          @click="viewMode = 'list'"
        />
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          placeholder="Поиск..."
          icon="i-heroicons-magnifying-glass"
          class="w-56"
          @update:model-value="debouncedRefresh"
        />
        <USelect
          v-if="viewMode === 'list'"
          v-model="statusFilter"
          :items="statusFilterOptions"
          class="w-48"
          @update:model-value="refresh"
        />
      </div>
    </div>

    <!-- Kanban view -->
    <div v-if="viewMode === 'kanban'" class="flex gap-4 overflow-x-auto pb-4">
      <div
        v-for="col in kanbanColumns"
        :key="col.status"
        class="flex-shrink-0 w-72"
      >
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium">{{ col.label }}</h3>
            <UBadge :color="col.color as any" variant="soft" size="xs">
              {{ getColumnItems(col.status).length }}
            </UBadge>
          </div>
          <div class="space-y-2">
            <NuxtLink
              v-for="item in getColumnItems(col.status)"
              :key="item.id"
              :to="`/o/inquiries/${item.id}`"
              class="block p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <p class="font-medium text-sm">{{ item.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.phone }}</p>
              <p v-if="item.tourTitle" class="text-xs text-emerald-600 mt-1 truncate">{{ item.tourTitle }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.createdAt) }}</p>
            </NuxtLink>
            <p v-if="!getColumnItems(col.status).length" class="text-xs text-gray-400 text-center py-4">Пусто</p>
          </div>
        </div>
      </div>
    </div>

    <!-- List view -->
    <UCard v-if="viewMode === 'list'">
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <NuxtLink
          v-for="item in inquiries?.data"
          :key="item.id"
          :to="`/o/inquiries/${item.id}`"
          class="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-4 px-4 transition-colors"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium text-sm">{{ item.name }}</p>
              <UBadge :color="getStatusColor(item.status) as any" variant="soft" size="xs">
                {{ getStatusLabel(item.status) }}
              </UBadge>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">{{ item.phone }} {{ item.email ? `/ ${item.email}` : '' }}</p>
            <p v-if="item.tourTitle" class="text-xs text-emerald-600 mt-0.5">{{ item.tourTitle }}</p>
          </div>
          <p class="text-xs text-gray-400 shrink-0 ml-4">{{ formatDate(item.createdAt) }}</p>
        </NuxtLink>
        <p v-if="!inquiries?.data?.length" class="text-center text-gray-500 py-8">Заявок пока нет</p>
      </div>
    </UCard>

    <!-- Pagination -->
    <div v-if="viewMode === 'list' && inquiries?.meta && inquiries.meta.totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="page"
        :total="inquiries.meta.total"
        :items-per-page="20"
        @update:model-value="refresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer',
})

const viewMode = ref<'kanban' | 'list'>('kanban')
const search = ref('')
const statusFilter = ref('all')
const page = ref(1)

const kanbanColumns = [
  { status: 'awaiting_confirmation', label: 'Ожидает подтверждения', color: 'amber' },
  { status: 'awaiting_prepayment', label: 'Ожидает предоплаты', color: 'blue' },
  { status: 'prepaid', label: 'Внесена предоплата', color: 'emerald' },
  { status: 'completed', label: 'Проведены', color: 'neutral' },
  { status: 'cancelled', label: 'Отменено', color: 'red' },
]

const statusFilterOptions = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Новая', value: 'new' },
  { label: 'Ожидает подтверждения', value: 'awaiting_confirmation' },
  { label: 'Ожидает предоплаты', value: 'awaiting_prepayment' },
  { label: 'Предоплачена', value: 'prepaid' },
  { label: 'Проведена', value: 'completed' },
  { label: 'Отменена', value: 'cancelled' },
]

const statusLabels: Record<string, string> = {
  new: 'Новая',
  processing: 'В работе',
  awaiting_confirmation: 'Ожидает подтверждения',
  awaiting_prepayment: 'Ожидает предоплаты',
  prepaid: 'Предоплачена',
  completed: 'Проведена',
  cancelled: 'Отменена',
}

const statusColorMap: Record<string, string> = {
  new: 'blue',
  processing: 'amber',
  awaiting_confirmation: 'amber',
  awaiting_prepayment: 'blue',
  prepaid: 'emerald',
  completed: 'neutral',
  cancelled: 'red',
}

// For kanban, fetch all without pagination
const { data: allInquiries, refresh: refreshAll } = await useFetch('/api/organizer/inquiries', {
  query: computed(() => ({
    search: search.value || undefined,
    pageSize: 100,
  })),
})

// For list, fetch with pagination and filters
const { data: inquiries, refresh } = await useFetch('/api/organizer/inquiries', {
  query: computed(() => ({
    status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    search: search.value || undefined,
    page: page.value,
    pageSize: 20,
  })),
})

function getColumnItems(status: string) {
  return (allInquiries.value?.data || []).filter((i: any) => i.status === status)
}

function getStatusLabel(status: string) {
  return statusLabels[status] || status
}

function getStatusColor(status: string) {
  return statusColorMap[status] || 'neutral'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedRefresh() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    refresh()
    refreshAll()
  }, 300)
}
</script>
