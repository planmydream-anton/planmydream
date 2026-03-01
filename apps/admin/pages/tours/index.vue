<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Туры</h1>
      <UButton to="/tours/create" icon="i-heroicons-plus">
        Создать тур
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <UInput
        v-model="search"
        placeholder="Поиск по названию..."
        icon="i-heroicons-magnifying-glass"
        class="w-64"
        @update:model-value="debouncedRefresh"
      />
      <USelect
        v-model="statusFilter"
        :items="statusOptions"
        placeholder="Все статусы"
        class="w-40"
        @update:model-value="refresh"
      />
    </div>

    <!-- Table -->
    <UCard>
      <UTable
        :data="data?.data || []"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #status-cell="{ row }">
          <UBadge
            :color="statusColors[row.original.status] || 'neutral'"
            variant="soft"
          >
            {{ statusLabels[row.original.status] || row.original.status }}
          </UBadge>
        </template>

        <template #priceFrom-cell="{ row }">
          <span v-if="row.original.priceFrom">
            {{ Number(row.original.priceFrom).toLocaleString() }} {{ row.original.currency }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template #durationDays-cell="{ row }">
          {{ row.original.durationDays ? `${row.original.durationDays} дн.` : '—' }}
        </template>

        <template #createdAt-cell="{ row }">
          {{ new Date(row.original.createdAt).toLocaleDateString('ru-RU') }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton
              :to="`/tours/${row.original.id}`"
              icon="i-heroicons-pencil"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="error"
              size="xs"
              @click="deleteTour(row.original)"
            />
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div v-if="data?.meta" class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
        <span class="text-sm text-gray-500">
          Всего: {{ data.meta.total }}
        </span>
        <UPagination
          v-if="data.meta.totalPages > 1"
          v-model="page"
          :total="data.meta.total"
          :items-per-page="20"
          @update:model-value="refresh"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const search = ref('')
const statusFilter = ref('')
const page = ref(1)

const statusOptions = [
  { label: 'Все статусы', value: '' },
  { label: 'Опубликовано', value: 'published' },
  { label: 'Черновик', value: 'draft' },
  { label: 'Архив', value: 'archived' },
]

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  published: 'Опубликовано',
  archived: 'Архив',
}

const statusColors: Record<string, string> = {
  draft: 'neutral',
  published: 'success',
  archived: 'warning',
}

const columns = [
  { accessorKey: 'title', header: 'Название' },
  { accessorKey: 'status', header: 'Статус' },
  { accessorKey: 'priceFrom', header: 'Цена' },
  { accessorKey: 'durationDays', header: 'Дней' },
  { accessorKey: 'destinationName', header: 'Направление' },
  { accessorKey: 'organizerName', header: 'Организатор' },
  { accessorKey: 'createdAt', header: 'Создан' },
  { accessorKey: 'actions', header: '' },
]

const { data, status, refresh } = await useFetch('/api/admin/tours', {
  query: computed(() => ({
    page: page.value,
    pageSize: 20,
    status: statusFilter.value || undefined,
    search: search.value || undefined,
  })),
})

const debouncedRefresh = useDebounceFn(() => {
  page.value = 1
  refresh()
}, 300)

const toast = useToast()

async function deleteTour(tour: any) {
  if (!confirm(`Удалить тур "${tour.title}"?`)) return

  try {
    await $fetch(`/api/admin/tours/${tour.id}`, { method: 'DELETE' })
    toast.add({ title: 'Тур удалён', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message || 'Не удалось удалить', color: 'error' })
  }
}
</script>
