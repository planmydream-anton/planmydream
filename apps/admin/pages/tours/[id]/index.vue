<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
        <h1 class="text-2xl font-bold">{{ tour?.title || 'Редактирование тура' }}</h1>
        <UBadge v-if="tour" :color="statusColors[tour.status]" variant="soft">
          {{ statusLabels[tour.status] }}
        </UBadge>
      </div>
      <div class="flex gap-2">
        <UButton
          v-if="tour?.status === 'draft'"
          icon="i-heroicons-arrow-up-tray"
          color="success"
          variant="soft"
          @click="publishTour"
        >
          Опубликовать
        </UButton>
        <UButton
          v-if="tour?.status === 'published'"
          icon="i-heroicons-arrow-down-tray"
          color="warning"
          variant="soft"
          @click="unpublishTour"
        >
          Снять с публикации
        </UButton>
      </div>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" :variant="isActive('index') ? 'soft' : 'ghost'" size="sm">
        Основное
      </UButton>
      <UButton :to="`/tours/${id}/program`" :variant="isActive('program') ? 'soft' : 'ghost'" size="sm">
        Программа
      </UButton>
      <UButton :to="`/tours/${id}/departures`" :variant="isActive('departures') ? 'soft' : 'ghost'" size="sm">
        Даты
      </UButton>
      <UButton :to="`/tours/${id}/media`" :variant="isActive('media') ? 'soft' : 'ghost'" size="sm">
        Медиа
      </UButton>
      <UButton :to="`/tours/${id}/seo`" :variant="isActive('seo') ? 'soft' : 'ghost'" size="sm">
        SEO
      </UButton>
    </div>

    <UCard v-if="tour">
      <UForm :state="state" @submit="onSubmit" class="space-y-6">
        <!-- Basic info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Название" name="title" required>
            <UInput v-model="state.title" class="w-full" />
          </UFormField>

          <UFormField label="Slug (URL)" name="slug" required>
            <UInput v-model="state.slug" class="w-full" />
          </UFormField>

          <UFormField label="Подзаголовок" name="subtitle">
            <UInput v-model="state.subtitle" class="w-full" />
          </UFormField>

          <UFormField label="Статус" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Короткое описание (tagline)" name="tagline">
          <UTextarea v-model="state.tagline" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Описание" name="description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" />
        </UFormField>

        <!-- Pricing -->
        <h3 class="text-lg font-semibold pt-4 border-t">Характеристики</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UFormField label="Цена от" name="priceFrom">
            <UInput v-model.number="state.priceFrom" type="number" class="w-full" />
          </UFormField>

          <UFormField label="Валюта" name="currency">
            <USelect v-model="state.currency" :items="currencyOptions" class="w-full" />
          </UFormField>

          <UFormField label="Скидка (%)" name="discountPercent">
            <UInput v-model.number="state.discountPercent" type="number" class="w-full" />
          </UFormField>

          <UFormField label="Длительность (дней)" name="durationDays">
            <UInput v-model.number="state.durationDays" type="number" class="w-full" />
          </UFormField>

          <UFormField label="Сложность маршрута" name="difficulty">
            <USelect v-model="state.difficulty" :items="difficultyOptions" class="w-full" />
          </UFormField>

          <UFormField label="Маршрут" name="route">
            <UInput v-model="state.route" class="w-full" />
          </UFormField>

          <UFormField label="Мин. человек" name="groupSizeMin">
            <UInput v-model.number="state.groupSizeMin" type="number" class="w-full" />
          </UFormField>

          <UFormField label="Макс. человек" name="groupSizeMax">
            <UInput v-model.number="state.groupSizeMax" type="number" class="w-full" />
          </UFormField>
        </div>

        <!-- Relations -->
        <h3 class="text-lg font-semibold pt-4 border-t">Связи</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Направление" name="destinationId">
            <USelect v-model="state.destinationId" :items="destinationOptions" class="w-full" />
          </UFormField>

          <UFormField label="Организатор" name="organizerId">
            <USelect v-model="state.organizerId" :items="organizerOptions" class="w-full" />
          </UFormField>
        </div>

        <!-- Additional info -->
        <h3 class="text-lg font-semibold pt-4 border-t">Дополнительная информация</h3>

        <UFormField label="Информация о погоде" name="weatherInfo">
          <UTextarea v-model="state.weatherInfo" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Порядок оплаты" name="paymentTerms">
          <UTextarea v-model="state.paymentTerms" :rows="3" class="w-full" />
        </UFormField>

        <UFormField label="Информация о проживании" name="accommodationInfo">
          <UTextarea v-model="state.accommodationInfo" :rows="3" class="w-full" />
        </UFormField>

        <UFormField label="Дополнительные услуги" name="additionalServices">
          <UTextarea v-model="state.additionalServices" :rows="3" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/tours" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Сохранить</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const saving = ref(false)

const { data: tour, refresh } = await useFetch<any>(`/api/admin/tours/${id}`)

const statusLabels: Record<string, string> = { draft: 'Черновик', published: 'Опубликовано', archived: 'Архив' }
const statusColors: Record<string, string> = { draft: 'neutral', published: 'success', archived: 'warning' }
const statusOptions = [
  { label: 'Черновик', value: 'draft' },
  { label: 'Опубликовано', value: 'published' },
  { label: 'Архив', value: 'archived' },
]
const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'RUB', value: 'RUB' },
]
const difficultyOptions = [
  { label: 'Лёгкий', value: 'easy' },
  { label: 'Средний', value: 'medium' },
  { label: 'Сложный', value: 'hard' },
  { label: 'Экстремальный', value: 'extreme' },
]

const state = reactive({
  title: tour.value?.title || '',
  slug: tour.value?.slug || '',
  subtitle: tour.value?.subtitle || '',
  tagline: tour.value?.tagline || '',
  description: tour.value?.description || '',
  priceFrom: tour.value?.priceFrom ? Number(tour.value.priceFrom) : undefined,
  currency: tour.value?.currency || 'USD',
  durationDays: tour.value?.durationDays || undefined,
  route: tour.value?.route || '',
  difficulty: tour.value?.difficulty || '',
  groupSizeMin: tour.value?.groupSizeMin || undefined,
  groupSizeMax: tour.value?.groupSizeMax || undefined,
  destinationId: tour.value?.destinationId || '',
  organizerId: tour.value?.organizerId || '',
  weatherInfo: tour.value?.weatherInfo || '',
  discountPercent: tour.value?.discountPercent || undefined,
  paymentTerms: tour.value?.paymentTerms || '',
  accommodationInfo: tour.value?.accommodationInfo || '',
  additionalServices: tour.value?.additionalServices || '',
  status: tour.value?.status || 'draft',
})

// Load destinations
const { data: destinationsData } = await useFetch('/api/admin/destinations')
const destinationOptions = computed(() => [
  { label: 'Не выбрано', value: '' },
  ...(destinationsData.value?.data || []).map((d: any) => ({ label: d.name, value: d.id })),
])

// Load team members
const { data: teamData } = await useFetch('/api/admin/team')
const organizerOptions = computed(() => [
  { label: 'Не выбрано', value: '' },
  ...(teamData.value?.data || []).map((t: any) => ({ label: `${t.name} — ${t.role}`, value: t.id })),
])

function isActive(section: string) {
  if (section === 'index') return route.path === `/tours/${id}`
  return route.path.endsWith(`/${section}`)
}

async function onSubmit() {
  saving.value = true
  try {
    const body: Record<string, any> = { ...state }
    if (!body.destinationId) body.destinationId = null
    if (!body.organizerId) body.organizerId = null

    await $fetch(`/api/admin/tours/${id}`, { method: 'PUT', body })
    toast.add({ title: 'Тур сохранён', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message || 'Не удалось сохранить', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function publishTour() {
  try {
    await $fetch(`/api/admin/tours/${id}`, { method: 'PUT', body: { status: 'published' } })
    toast.add({ title: 'Тур опубликован', color: 'success' })
    refresh()
    state.status = 'published'
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  }
}

async function unpublishTour() {
  try {
    await $fetch(`/api/admin/tours/${id}`, { method: 'PUT', body: { status: 'draft' } })
    toast.add({ title: 'Тур снят с публикации', color: 'success' })
    refresh()
    state.status = 'draft'
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  }
}
</script>
