<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Направления</h1>
      <UButton to="/destinations/create" icon="i-heroicons-plus">Добавить</UButton>
    </div>
    <UCard>
      <UTable :data="items" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="row.original.status === 'published' ? 'success' : 'neutral'" variant="soft">
            {{ row.original.status === 'published' ? 'Опубликовано' : 'Черновик' }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton :to="`/destinations/${row.original.id}`" icon="i-heroicons-pencil" variant="ghost" size="xs" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="xs" @click="deleteItem(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const toast = useToast()
const { data, refresh } = await useFetch<any>('/api/admin/destinations')
const items = computed(() => data.value?.data || [])
const columns = [
  { accessorKey: 'name', header: 'Название' },
  { accessorKey: 'country', header: 'Страна' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'status', header: 'Статус' },
  { accessorKey: 'actions', header: '' },
]
async function deleteItem(item: any) {
  if (!confirm(`Удалить "${item.name}"?`)) return
  try { await $fetch(`/api/admin/destinations/${item.id}`, { method: 'DELETE' }); toast.add({ title: 'Удалено', color: 'success' }); refresh() }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
}
</script>
