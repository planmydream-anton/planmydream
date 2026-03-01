<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Заявки</h1>
    <div class="flex gap-2 mb-4">
      <UButton v-for="opt in statusOpts" :key="opt.value" :variant="statusFilter === opt.value ? 'solid' : 'ghost'" size="sm" @click="statusFilter = opt.value; refresh()">{{ opt.label }}</UButton>
    </div>
    <UCard>
      <UTable :data="items" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="sColors[row.original.status] || 'neutral'" variant="soft">{{ sLabels[row.original.status] || row.original.status }}</UBadge>
        </template>
        <template #createdAt-cell="{ row }">{{ new Date(row.original.createdAt).toLocaleDateString('ru-RU') }}</template>
        <template #actions-cell="{ row }">
          <UButton :to="`/inquiries/${row.original.id}`" icon="i-heroicons-eye" variant="ghost" size="xs" />
        </template>
      </UTable>
      <div v-if="data?.meta?.totalPages > 1" class="flex justify-center pt-4 border-t mt-4">
        <UPagination v-model="page" :total="data.meta.total" :items-per-page="20" @update:model-value="refresh" />
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const statusFilter = ref('')
const page = ref(1)
const statusOpts = [{label:'Все',value:''},{label:'Новые',value:'new'},{label:'В работе',value:'processing'},{label:'Завершено',value:'completed'},{label:'Спам',value:'spam'}]
const sLabels: Record<string,string> = {new:'Новая',processing:'В работе',completed:'Завершена',spam:'Спам'}
const sColors: Record<string,string> = {new:'info',processing:'warning',completed:'success',spam:'error'}
const columns = [
  {accessorKey:'name',header:'Имя'},{accessorKey:'phone',header:'Телефон'},{accessorKey:'email',header:'Email'},
  {accessorKey:'tourTitle',header:'Тур'},{accessorKey:'source',header:'Источник'},{accessorKey:'status',header:'Статус'},
  {accessorKey:'createdAt',header:'Дата'},{accessorKey:'actions',header:''},
]
const { data, refresh } = await useFetch<any>('/api/admin/inquiries', {
  query: computed(() => ({ page: page.value, pageSize: 20, status: statusFilter.value || undefined })),
})
const items = computed(() => data.value?.data || [])
</script>
