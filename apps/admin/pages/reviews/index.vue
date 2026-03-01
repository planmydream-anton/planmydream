<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Отзывы</h1>
    <div class="flex gap-2 mb-4">
      <UButton v-for="opt in statusOptions" :key="opt.value" :variant="statusFilter === opt.value ? 'solid' : 'ghost'" size="sm" @click="statusFilter = opt.value; refresh()">
        {{ opt.label }}
      </UButton>
    </div>
    <UCard>
      <UTable :data="items" :columns="columns">
        <template #rating-cell="{ row }">
          <span class="text-yellow-500">{{ '★'.repeat(row.original.rating) }}</span>
        </template>
        <template #text-cell="{ row }">
          <span class="text-sm line-clamp-2">{{ row.original.text }}</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="reviewStatusColors[row.original.status]" variant="soft">{{ reviewStatusLabels[row.original.status] }}</UBadge>
        </template>
        <template #createdAt-cell="{ row }">
          {{ new Date(row.original.createdAt).toLocaleDateString('ru-RU') }}
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status !== 'approved'" icon="i-heroicons-check" variant="ghost" color="success" size="xs" @click="updateStatus(row.original, 'approved')" />
            <UButton v-if="row.original.status !== 'rejected'" icon="i-heroicons-x-mark" variant="ghost" color="error" size="xs" @click="updateStatus(row.original, 'rejected')" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="xs" @click="deleteReview(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const statusFilter = ref('')
const statusOptions = [
  { label: 'Все', value: '' }, { label: 'На модерации', value: 'pending' },
  { label: 'Одобрено', value: 'approved' }, { label: 'Отклонено', value: 'rejected' },
]
const reviewStatusLabels: Record<string, string> = { pending: 'На модерации', approved: 'Одобрено', rejected: 'Отклонено' }
const reviewStatusColors: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'error' }

const columns = [
  { accessorKey: 'authorName', header: 'Автор' },
  { accessorKey: 'rating', header: 'Рейтинг' },
  { accessorKey: 'text', header: 'Текст' },
  { accessorKey: 'tourTitle', header: 'Тур' },
  { accessorKey: 'status', header: 'Статус' },
  { accessorKey: 'createdAt', header: 'Дата' },
  { accessorKey: 'actions', header: '' },
]

const { data, refresh } = await useFetch<any>('/api/admin/reviews', {
  query: computed(() => ({ status: statusFilter.value || undefined })),
})
const items = computed(() => data.value?.data || [])

async function updateStatus(review: any, status: string) {
  try {
    await $fetch(`/api/admin/reviews/${review.id}`, { method: 'PUT', body: { status } })
    toast.add({ title: `Отзыв ${status === 'approved' ? 'одобрен' : 'отклонён'}`, color: 'success' })
    refresh()
  } catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
}

async function deleteReview(review: any) {
  if (!confirm('Удалить отзыв?')) return
  try {
    await $fetch(`/api/admin/reviews/${review.id}`, { method: 'DELETE' })
    toast.add({ title: 'Удалено', color: 'success' })
    refresh()
  } catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
}
</script>
