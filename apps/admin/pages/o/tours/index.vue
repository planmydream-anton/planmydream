<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UTabs :items="tabItems" v-model="activeTab" />
      </div>
      <UButton color="emerald" icon="i-heroicons-plus" @click="createTour">
        Добавить тур
      </UButton>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-4">
      <UInput
        v-model="search"
        placeholder="Поиск по названию..."
        icon="i-heroicons-magnifying-glass"
        class="w-full max-w-sm"
        @update:model-value="debouncedRefresh"
      />
      <USelect
        v-model="statusFilter"
        :items="statusOptions"
        class="w-48"
        @update:model-value="refresh"
      />
    </div>

    <!-- Tours list -->
    <UCard v-if="tours?.data?.length">
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="tour in tours.data"
          :key="tour.id"
          class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
          <div class="flex-1 min-w-0">
            <NuxtLink :to="`/o/tours/${tour.id}`" class="font-medium text-sm hover:text-emerald-600 truncate block">
              {{ tour.title }}
            </NuxtLink>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span v-if="tour.destinationName">{{ tour.destinationName }}</span>
              <span v-if="tour.durationDays">{{ tour.durationDays }} дн.</span>
              <span v-if="tour.priceFrom">от {{ tour.priceFrom }} {{ tour.currency }}</span>
            </div>
            <p v-if="tour.status === 'rejected' && tour.rejectionReason" class="text-xs text-red-500 mt-1">
              Причина: {{ tour.rejectionReason }}
            </p>
          </div>
          <div class="flex items-center gap-3 ml-4">
            <OrganizerTourStatusBadge :status="tour.status" />
            <UDropdownMenu :items="getTourActions(tour)">
              <UButton icon="i-heroicons-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
            </UDropdownMenu>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Empty state -->
    <UCard v-else-if="!pending">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-map" class="w-12 h-12 text-gray-300 mx-auto" />
        <p class="mt-2 text-gray-500">{{ activeTab === 'archived' ? 'Нет архивных туров' : 'У вас пока нет туров' }}</p>
        <UButton v-if="activeTab !== 'archived'" class="mt-4" color="emerald" @click="createTour">
          Создать первый тур
        </UButton>
      </div>
    </UCard>

    <!-- Pagination -->
    <div v-if="tours?.meta && tours.meta.totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="page"
        :total="tours.meta.total"
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

const toast = useToast()
const router = useRouter()

const activeTab = ref('active')
const search = ref('')
const statusFilter = ref('all')
const page = ref(1)

const tabItems = [
  { label: 'Активные', value: 'active' },
  { label: 'В архиве', value: 'archived' },
]

const statusOptions = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Черновик', value: 'draft' },
  { label: 'На модерации', value: 'pending_review' },
  { label: 'Опубликован', value: 'published' },
  { label: 'Отклонён', value: 'rejected' },
]

const { data: tours, pending, refresh } = await useFetch('/api/organizer/tours', {
  query: computed(() => ({
    tab: activeTab.value,
    status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    search: search.value || undefined,
    page: page.value,
    pageSize: 20,
  })),
})

watch(activeTab, () => {
  page.value = 1
  refresh()
})

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedRefresh() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 300)
}

async function createTour() {
  try {
    const tour = await $fetch<{ id: string }>('/api/organizer/tours', {
      method: 'POST',
      body: { title: 'Новый тур' },
    })
    await router.push(`/o/tours/${tour.id}`)
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка создания тура', color: 'error' })
  }
}

function getTourActions(tour: any) {
  const actions: any[][] = [[
    {
      label: 'Редактировать',
      icon: 'i-heroicons-pencil',
      onSelect: () => router.push(`/o/tours/${tour.id}`),
    },
  ]]

  if (tour.status === 'draft') {
    actions[0].push({
      label: 'Удалить',
      icon: 'i-heroicons-trash',
      onSelect: () => deleteTour(tour.id),
    })
  }

  if (tour.status !== 'archived' && tour.status !== 'draft') {
    actions.push([{
      label: 'В архив',
      icon: 'i-heroicons-archive-box',
      onSelect: () => archiveTour(tour.id),
    }])
  }

  return actions
}

async function deleteTour(id: string) {
  try {
    await $fetch(`/api/organizer/tours/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Тур удалён', color: 'success' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка удаления', color: 'error' })
  }
}

async function archiveTour(id: string) {
  try {
    await $fetch(`/api/organizer/tours/${id}`, {
      method: 'PUT',
      body: { status: 'archived' },
    })
    toast.add({ title: 'Тур перемещён в архив', color: 'success' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  }
}
</script>
