<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/inquiries" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Заявка от {{ item?.name }}</h1>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" v-if="item">
      <UCard>
        <template #header><h3 class="font-semibold">Контакт</h3></template>
        <dl class="space-y-3 text-sm">
          <div><dt class="text-gray-500">Имя</dt><dd class="font-medium">{{ item.name }}</dd></div>
          <div><dt class="text-gray-500">Телефон</dt><dd class="font-medium">{{ item.phone }}</dd></div>
          <div><dt class="text-gray-500">Email</dt><dd class="font-medium">{{ item.email || '—' }}</dd></div>
          <div><dt class="text-gray-500">Сообщение</dt><dd>{{ item.message || '—' }}</dd></div>
          <div><dt class="text-gray-500">Тур</dt><dd>{{ item.tourTitle || '—' }}</dd></div>
          <div><dt class="text-gray-500">Дата</dt><dd>{{ new Date(item.createdAt).toLocaleString('ru-RU') }}</dd></div>
        </dl>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">Статус и источник</h3></template>
        <div class="space-y-4">
          <UFormField label="Статус">
            <USelect v-model="status" :items="statusOpts" class="w-full" @update:model-value="updateStatus" />
          </UFormField>
          <dl class="space-y-3 text-sm">
            <div><dt class="text-gray-500">Источник</dt><dd>{{ item.source || '—' }}</dd></div>
            <div><dt class="text-gray-500">UTM Source</dt><dd>{{ item.utmSource || '—' }}</dd></div>
            <div><dt class="text-gray-500">UTM Medium</dt><dd>{{ item.utmMedium || '—' }}</dd></div>
            <div><dt class="text-gray-500">UTM Campaign</dt><dd>{{ item.utmCampaign || '—' }}</dd></div>
            <div><dt class="text-gray-500">Страница</dt><dd class="break-all">{{ item.pageUrl || '—' }}</dd></div>
          </dl>
        </div>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const { data: item, refresh } = await useFetch<any>(`/api/admin/inquiries/${id}`)
const status = ref(item.value?.status || 'new')
const statusOpts = [{label:'Новая',value:'new'},{label:'В работе',value:'processing'},{label:'Завершена',value:'completed'},{label:'Спам',value:'spam'}]
async function updateStatus(val: string) {
  try { await $fetch(`/api/admin/inquiries/${id}`, { method: 'PUT', body: { status: val } }); toast.add({ title: 'Статус обновлён', color: 'success' }); refresh() }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
}
</script>
