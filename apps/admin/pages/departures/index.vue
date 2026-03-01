<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Все даты проведения</h1>
    <UCard>
      <UTable :data="items" :columns="columns">
        <template #startDate-cell="{ row }">{{ new Date(row.original.startDate).toLocaleDateString('ru-RU') }}</template>
        <template #endDate-cell="{ row }">{{ new Date(row.original.endDate).toLocaleDateString('ru-RU') }}</template>
        <template #price-cell="{ row }">{{ Number(row.original.price).toLocaleString() }}</template>
        <template #spotsTotal-cell="{ row }">{{ row.original.spotsBooked || 0 }} / {{ row.original.spotsTotal || '∞' }}</template>
        <template #status-cell="{ row }">
          <UBadge :color="{active:'success',sold_out:'warning',cancelled:'error'}[row.original.status] || 'neutral'" variant="soft">
            {{ {active:'Активная',sold_out:'Продано',cancelled:'Отменена'}[row.original.status] || row.original.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const { data } = await useFetch<any>('/api/admin/departures')
const items = computed(() => data.value?.data || [])
const columns = [
  {accessorKey:'tourTitle',header:'Тур'},{accessorKey:'startDate',header:'Начало'},{accessorKey:'endDate',header:'Конец'},
  {accessorKey:'price',header:'Цена'},{accessorKey:'spotsTotal',header:'Места'},{accessorKey:'status',header:'Статус'},
]
</script>
