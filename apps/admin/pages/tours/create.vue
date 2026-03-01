<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Создание тура</h1>
    </div>

    <UCard>
      <UForm :state="state" @submit="onSubmit" class="space-y-6">
        <!-- Basic info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Название" name="title" required>
            <UInput v-model="state.title" placeholder="Авторский тур в Китай" class="w-full" @blur="generateSlug" />
          </UFormField>

          <UFormField label="Slug (URL)" name="slug" required>
            <UInput v-model="state.slug" placeholder="avtorskiy-tur-v-kitay" class="w-full" />
          </UFormField>

          <UFormField label="Подзаголовок" name="subtitle">
            <UInput v-model="state.subtitle" placeholder="10 дней в Поднебесной" class="w-full" />
          </UFormField>

          <UFormField label="Статус" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Короткое описание (tagline)" name="tagline">
          <UTextarea v-model="state.tagline" placeholder="Описание для hero-секции" :rows="2" class="w-full" />
        </UFormField>

        <UFormField label="Описание" name="description">
          <UTextarea v-model="state.description" placeholder="Описание для карточки тура" :rows="3" class="w-full" />
        </UFormField>

        <!-- Pricing & details -->
        <h3 class="text-lg font-semibold pt-4 border-t">Характеристики</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UFormField label="Цена от" name="priceFrom">
            <UInput v-model.number="state.priceFrom" type="number" placeholder="1742" class="w-full" />
          </UFormField>

          <UFormField label="Валюта" name="currency">
            <USelect v-model="state.currency" :items="currencyOptions" class="w-full" />
          </UFormField>

          <UFormField label="Скидка (%)" name="discountPercent">
            <UInput v-model.number="state.discountPercent" type="number" placeholder="0" class="w-full" />
          </UFormField>

          <UFormField label="Длительность (дней)" name="durationDays">
            <UInput v-model.number="state.durationDays" type="number" placeholder="10" class="w-full" />
          </UFormField>

          <UFormField label="Сложность" name="difficulty">
            <USelect v-model="state.difficulty" :items="difficultyOptions" class="w-full" />
          </UFormField>

          <UFormField label="Маршрут" name="route">
            <UInput v-model="state.route" placeholder="Шанхай — Чжанцзяцзе — Фэнхуан" class="w-full" />
          </UFormField>

          <UFormField label="Мин. человек" name="groupSizeMin">
            <UInput v-model.number="state.groupSizeMin" type="number" placeholder="8" class="w-full" />
          </UFormField>

          <UFormField label="Макс. человек" name="groupSizeMax">
            <UInput v-model.number="state.groupSizeMax" type="number" placeholder="16" class="w-full" />
          </UFormField>
        </div>

        <!-- Relations -->
        <h3 class="text-lg font-semibold pt-4 border-t">Связи</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Направление" name="destinationId">
            <USelect
              v-model="state.destinationId"
              :items="destinationOptions"
              placeholder="Выберите направление"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Организатор" name="organizerId">
            <USelect
              v-model="state.organizerId"
              :items="organizerOptions"
              placeholder="Выберите организатора"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Weather -->
        <UFormField label="Информация о погоде" name="weatherInfo">
          <UTextarea v-model="state.weatherInfo" placeholder="Средняя температура 20-25°C, сезон дождей в июне..." :rows="2" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/tours" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Создать тур</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const saving = ref(false)

const state = reactive({
  title: '',
  slug: '',
  subtitle: '',
  tagline: '',
  description: '',
  priceFrom: undefined as number | undefined,
  currency: 'USD',
  durationDays: undefined as number | undefined,
  route: '',
  difficulty: '',
  groupSizeMin: undefined as number | undefined,
  groupSizeMax: undefined as number | undefined,
  destinationId: '',
  organizerId: '',
  weatherInfo: '',
  discountPercent: undefined as number | undefined,
  status: 'draft',
})

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

// Load destinations
const { data: destinationsData } = await useFetch('/api/admin/destinations')
const destinationOptions = computed(() => [
  { label: 'Не выбрано', value: '' },
  ...(destinationsData.value?.data || []).map((d: any) => ({
    label: d.name,
    value: d.id,
  })),
])

// Load team members (organizers)
const { data: teamData } = await useFetch('/api/admin/team')
const organizerOptions = computed(() => [
  { label: 'Не выбрано', value: '' },
  ...(teamData.value?.data || []).map((t: any) => ({
    label: `${t.name} — ${t.role}`,
    value: t.id,
  })),
])

function generateSlug() {
  if (state.slug) return
  state.slug = state.title
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function onSubmit() {
  saving.value = true
  try {
    const body: Record<string, any> = { ...state }
    if (!body.destinationId) delete body.destinationId
    if (!body.organizerId) delete body.organizerId

    const created = await $fetch<any>('/api/admin/tours', {
      method: 'POST',
      body,
    })
    toast.add({ title: 'Тур создан', color: 'success' })
    await navigateTo(`/tours/${created.id}`)
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message || 'Не удалось создать тур', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
