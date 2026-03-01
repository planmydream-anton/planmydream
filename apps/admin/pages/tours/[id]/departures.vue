<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — Даты</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="ghost" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="soft" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/media`" variant="ghost" size="sm">Медиа</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="ghost" size="sm">SEO</UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Даты проведения</h3>
          <UButton icon="i-heroicons-plus" size="sm" @click="showAddForm = true">
            Добавить дату
          </UButton>
        </div>
      </template>

      <!-- Add form -->
      <div v-if="showAddForm" class="p-4 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 class="font-medium mb-3">Новая дата</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <UFormField label="Дата начала">
            <UInput v-model="newDeparture.startDate" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Дата окончания">
            <UInput v-model="newDeparture.endDate" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Цена">
            <UInput v-model.number="newDeparture.price" type="number" class="w-full" />
          </UFormField>
          <UFormField label="Всего мест">
            <UInput v-model.number="newDeparture.spotsTotal" type="number" class="w-full" />
          </UFormField>
          <UFormField label="Статус">
            <USelect v-model="newDeparture.status" :items="departureStatusOptions" class="w-full" />
          </UFormField>
          <UFormField label="Заметки">
            <UInput v-model="newDeparture.notes" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-2 mt-3">
          <UButton @click="createDeparture" :loading="saving">Добавить</UButton>
          <UButton variant="ghost" @click="showAddForm = false">Отмена</UButton>
        </div>
      </div>

      <!-- Table -->
      <UTable :data="departuresList" :columns="columns">
        <template #startDate-cell="{ row }">
          {{ formatDate(row.original.startDate) }}
        </template>
        <template #endDate-cell="{ row }">
          {{ formatDate(row.original.endDate) }}
        </template>
        <template #price-cell="{ row }">
          {{ Number(row.original.price).toLocaleString() }}
        </template>
        <template #spotsTotal-cell="{ row }">
          {{ row.original.spotsBooked || 0 }} / {{ row.original.spotsTotal || '∞' }}
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="depStatusColors[row.original.status]" variant="soft">
            {{ depStatusLabels[row.original.status] }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="xs" @click="deleteDeparture(row.original)" />
        </template>
      </UTable>

      <p v-if="!departuresList.length" class="text-sm text-gray-400 text-center py-8">
        Нет дат проведения
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const saving = ref(false)
const showAddForm = ref(false)

const { data: tour } = await useFetch<any>(`/api/admin/tours/${id}`)
const { data: departuresData, refresh } = await useFetch<any>('/api/admin/departures', {
  query: { tourId: id },
})

const departuresList = computed(() => departuresData.value?.data || [])

const newDeparture = reactive({
  startDate: '',
  endDate: '',
  price: 0,
  spotsTotal: 10,
  status: 'active',
  notes: '',
})

const departureStatusOptions = [
  { label: 'Активная', value: 'active' },
  { label: 'Продано', value: 'sold_out' },
  { label: 'Отменена', value: 'cancelled' },
]

const depStatusLabels: Record<string, string> = {
  active: 'Активная',
  sold_out: 'Продано',
  cancelled: 'Отменена',
}

const depStatusColors: Record<string, string> = {
  active: 'success',
  sold_out: 'warning',
  cancelled: 'error',
}

const columns = [
  { accessorKey: 'startDate', header: 'Начало' },
  { accessorKey: 'endDate', header: 'Конец' },
  { accessorKey: 'price', header: 'Цена' },
  { accessorKey: 'spotsTotal', header: 'Места' },
  { accessorKey: 'status', header: 'Статус' },
  { accessorKey: 'actions', header: '' },
]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU')
}

async function createDeparture() {
  saving.value = true
  try {
    await $fetch('/api/admin/departures', {
      method: 'POST',
      body: { ...newDeparture, tourId: id },
    })
    toast.add({ title: 'Дата добавлена', color: 'success' })
    showAddForm.value = false
    Object.assign(newDeparture, { startDate: '', endDate: '', price: 0, spotsTotal: 10, status: 'active', notes: '' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function deleteDeparture(dep: any) {
  if (!confirm('Удалить эту дату?')) return
  try {
    await $fetch(`/api/admin/departures/${dep.id}`, { method: 'DELETE' })
    toast.add({ title: 'Дата удалена', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  }
}
</script>
