<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" variant="ghost" to="/o/inquiries" />
      <h2 class="text-lg font-semibold">Заявка от {{ inquiry?.name }}</h2>
      <UBadge v-if="inquiry" :color="getStatusColor(inquiry.status) as any" variant="soft">
        {{ getStatusLabel(inquiry.status) }}
      </UBadge>
    </div>

    <div v-if="inquiry" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Contact info -->
      <UCard>
        <template #header><h3 class="font-semibold">Контакт</h3></template>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Имя</span>
            <span class="font-medium">{{ inquiry.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Телефон</span>
            <a :href="`tel:${inquiry.phone}`" class="font-medium text-emerald-600">{{ inquiry.phone }}</a>
          </div>
          <div v-if="inquiry.email" class="flex justify-between">
            <span class="text-gray-500">Email</span>
            <a :href="`mailto:${inquiry.email}`" class="font-medium text-emerald-600">{{ inquiry.email }}</a>
          </div>
          <div v-if="inquiry.tourTitle" class="flex justify-between">
            <span class="text-gray-500">Тур</span>
            <span class="font-medium">{{ inquiry.tourTitle }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Дата</span>
            <span>{{ formatDate(inquiry.createdAt) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Status change -->
      <UCard>
        <template #header><h3 class="font-semibold">Статус</h3></template>
        <div class="space-y-3">
          <USelect
            v-model="newStatus"
            :items="statusOptions"
            class="w-full"
          />
          <UButton
            @click="updateStatus"
            :loading="updating"
            :disabled="newStatus === inquiry.status"
            color="emerald"
            block
          >
            Обновить статус
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Message -->
    <UCard v-if="inquiry?.message">
      <template #header><h3 class="font-semibold">Сообщение</h3></template>
      <p class="text-sm whitespace-pre-wrap">{{ inquiry.message }}</p>
    </UCard>

    <!-- UTM info -->
    <UCard v-if="inquiry?.utmSource || inquiry?.pageUrl">
      <template #header><h3 class="font-semibold">Источник</h3></template>
      <div class="space-y-2 text-sm">
        <div v-if="inquiry.utmSource" class="flex justify-between">
          <span class="text-gray-500">UTM Source</span>
          <span>{{ inquiry.utmSource }}</span>
        </div>
        <div v-if="inquiry.utmMedium" class="flex justify-between">
          <span class="text-gray-500">UTM Medium</span>
          <span>{{ inquiry.utmMedium }}</span>
        </div>
        <div v-if="inquiry.utmCampaign" class="flex justify-between">
          <span class="text-gray-500">UTM Campaign</span>
          <span>{{ inquiry.utmCampaign }}</span>
        </div>
        <div v-if="inquiry.pageUrl" class="flex justify-between">
          <span class="text-gray-500">Страница</span>
          <span class="truncate max-w-xs">{{ inquiry.pageUrl }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer',
})

const route = useRoute()
const toast = useToast()
const inquiryId = route.params.id as string

const updating = ref(false)

const { data: inquiry, refresh } = await useFetch(`/api/organizer/inquiries/${inquiryId}`)

const newStatus = ref(inquiry.value?.status || 'awaiting_confirmation')

watch(inquiry, (v) => {
  if (v) newStatus.value = v.status
})

const statusOptions = [
  { label: 'Ожидает подтверждения', value: 'awaiting_confirmation' },
  { label: 'Ожидает предоплаты', value: 'awaiting_prepayment' },
  { label: 'Внесена предоплата', value: 'prepaid' },
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
  awaiting_confirmation: 'amber',
  awaiting_prepayment: 'blue',
  prepaid: 'emerald',
  completed: 'neutral',
  cancelled: 'red',
}

function getStatusLabel(status: string) {
  return statusLabels[status] || status
}

function getStatusColor(status: string) {
  return statusColorMap[status] || 'neutral'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function updateStatus() {
  updating.value = true
  try {
    await $fetch(`/api/organizer/inquiries/${inquiryId}`, {
      method: 'PUT',
      body: { status: newStatus.value },
    })
    await refresh()
    toast.add({ title: 'Статус обновлён', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  } finally {
    updating.value = false
  }
}
</script>
