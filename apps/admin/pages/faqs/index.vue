<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">FAQ</h1>
      <UButton to="/faqs/create" icon="i-heroicons-plus">Добавить</UButton>
    </div>
    <UCard>
      <UTable :data="items" :columns="columns">
        <template #question-cell="{ row }">
          <span class="line-clamp-1">{{ row.original.question }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton :to="`/faqs/${row.original.id}`" icon="i-heroicons-pencil" variant="ghost" size="xs" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="xs" @click="deleteItem(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const toast = useToast()
const { data, refresh } = await useFetch<any>('/api/admin/faqs')
const items = computed(() => data.value?.data || [])
const columns = [
  { accessorKey: 'question', header: 'Вопрос' },
  { accessorKey: 'category', header: 'Категория' },
  { accessorKey: 'position', header: 'Позиция' },
  { accessorKey: 'actions', header: '' },
]
async function deleteItem(item: any) {
  if (!confirm('Удалить?')) return
  try { await $fetch(`/api/admin/faqs/${item.id}`, { method: 'DELETE' }); toast.add({ title: 'Удалено', color: 'success' }); refresh() }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
}
</script>
