<template>
  <div class="space-y-6">
    <!-- Header with status and actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-arrow-left" variant="ghost" to="/o/tours" />
        <h2 class="text-lg font-semibold truncate max-w-md">{{ tour?.title || 'Загрузка...' }}</h2>
        <OrganizerTourStatusBadge v-if="tour" :status="tour.status" />
      </div>
      <div class="flex items-center gap-2">
        <UButton variant="soft" @click="saveDraft" :loading="saving" :disabled="!tour">
          Сохранить черновик
        </UButton>
        <UButton
          color="emerald"
          @click="submitForReview"
          :loading="submitting"
          :disabled="!tour || tour.status === 'pending_review'"
        >
          Отправить на модерацию
        </UButton>
      </div>
    </div>

    <!-- Rejection reason -->
    <UAlert
      v-if="tour?.status === 'rejected' && tour.rejectionReason"
      color="red"
      icon="i-heroicons-x-circle"
      title="Тур отклонён"
      :description="tour.rejectionReason"
    />

    <!-- Tab navigation -->
    <UTabs :items="tabs" v-model="activeTab" />

    <!-- Tab: Основное -->
    <div v-show="activeTab === 'basic'" class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">Основная информация</h3></template>
        <div class="space-y-4">
          <UFormField label="Название тура *">
            <UInput v-model="form.title" class="w-full" />
          </UFormField>

          <!-- Countries multi-select -->
          <UFormField label="Страны">
            <OrganizerSearchSelect
              :items="countryOptions"
              v-model="form.countries"
              placeholder="Выберите страны..."
              :multiple="true"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Язык">
              <USelect v-model="form.language" :items="languageOpts" class="w-full" />
            </UFormField>
            <UFormField label="Длительность (дней)">
              <UInput v-model.number="form.durationDays" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Сложность">
              <div class="flex items-center gap-1">
                <USelect v-model="form.difficulty" :items="difficultyOptions" class="w-full" />
                <UTooltip text="Лёгкий — прогулки до 5 км. Средний — до 15 км, перепад до 500 м. Сложный — треки, горы, физ. подготовка. Экстремальный — альпинизм, выживание.">
                  <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-gray-400 shrink-0 cursor-help" />
                </UTooltip>
              </div>
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Мин. группа">
              <UInput v-model.number="form.groupSizeMin" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Макс. группа">
              <UInput v-model.number="form.groupSizeMax" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Мин. возраст">
              <UInput v-model.number="form.minAge" type="number" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Маршрут">
            <UInput v-model="form.route" placeholder="Москва — Стамбул — Каппадокия" class="w-full" />
          </UFormField>
          <UFormField label="Описание">
            <UTextarea v-model="form.description" :rows="5" class="w-full" />
          </UFormField>
          <UFormField label="Короткое описание (tagline)">
            <UInput v-model="form.tagline" class="w-full" />
          </UFormField>
        </div>
      </UCard>

      <!-- Photos -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Фотографии</h3>
            <div>
              <input ref="photoInput" type="file" accept="image/*" multiple class="hidden" @change="uploadPhotos" />
              <UButton variant="soft" size="sm" icon="i-heroicons-photo" @click="photoInput?.click()" :loading="uploadingPhotos">
                Загрузить фото
              </UButton>
            </div>
          </div>
        </template>
        <div v-if="tourMedia.length" class="relative">
          <div v-if="uploadingPhotos" class="absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center rounded-lg">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div v-for="m in tourMedia" :key="m.tourMediaId" class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img :src="m.url" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <UButton icon="i-heroicons-trash" color="red" size="xs" @click="removeMedia(m.tourMediaId)" />
              </div>
              <UBadge v-if="m.isCover" color="emerald" variant="solid" size="xs" class="absolute top-1 left-1">Обложка</UBadge>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">Фотографии не загружены. Рекомендуется до 10 фото, максимум 20.</p>
      </UCard>

      <!-- Key impressions (rich) -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Ключевые впечатления (3-9)</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addKeyImpression" :disabled="form.keyImpressions.length >= 9" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="(imp, i) in form.keyImpressions" :key="i" class="p-4 border rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <UInput v-model="imp.title" placeholder="Название впечатления" class="w-full mr-3" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="sm" @click="form.keyImpressions.splice(i, 1)" />
            </div>
            <UTextarea v-model="imp.description" placeholder="Описание (необязательно)" :rows="2" class="w-full" />
            <OrganizerPhotoUploadGrid
              :images="imp.images || []"
              :max-count="2"
              folder="tour-impressions"
              @update:images="imp.images = $event"
            />
          </div>
          <p v-if="!form.keyImpressions.length" class="text-sm text-gray-500">Добавьте ключевые впечатления</p>
        </div>
      </UCard>

      <!-- Guides -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Гиды</h3>
        </template>
        <OrganizerGuideSelector
          :model-value="form.guides"
          @update:model-value="form.guides = $event"
        />
      </UCard>
    </div>

    <!-- Tab: Жильё -->
    <div v-show="activeTab === 'accommodation'" class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">Проживание</h3></template>
        <div class="space-y-4">
          <UFormField label="Уровень комфорта">
            <div class="flex items-center gap-1">
              <USelect v-model="form.comfortLevel" :items="comfortOptions" class="w-full" />
              <UTooltip text="Базовый — палатки, хостелы. Стандарт — 3* отели. Комфорт — 4* отели, удобства. Люкс — 5* отели, премиум.">
                <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-gray-400 shrink-0 cursor-help" />
              </UTooltip>
            </div>
          </UFormField>
          <UFormField label="Описание проживания">
            <UTextarea v-model="form.accommodationInfo" :rows="4" class="w-full" />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Места проживания</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="form.accommodations.push({ name: '', description: '', images: [], nights: null })" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="(acc, i) in form.accommodations" :key="i" class="p-4 border rounded-lg space-y-3">
            <div class="flex items-center justify-between gap-3">
              <UInput v-model="acc.name" placeholder="Название отеля / места" class="flex-1" />
              <UFormField label="Ночей" class="w-24">
                <UInput v-model.number="acc.nights" type="number" placeholder="0" class="w-full" />
              </UFormField>
              <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="sm" @click="form.accommodations.splice(i, 1)" />
            </div>
            <UTextarea v-model="acc.description" placeholder="Описание" :rows="2" class="w-full" />
            <OrganizerPhotoUploadGrid
              :images="acc.images || []"
              :max-count="5"
              folder="tour-accommodations"
              @update:images="acc.images = $event"
            />
          </div>
          <p v-if="!form.accommodations.length" class="text-sm text-gray-500">Места проживания не добавлены</p>
        </div>
      </UCard>
    </div>

    <!-- Tab: Цены и даты -->
    <div v-show="activeTab === 'prices'" class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">Цены</h3></template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Цена от">
              <UInput v-model.number="form.priceFrom" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Валюта">
              <USelect v-model="form.currency" :items="currencyOptions" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Условия оплаты">
            <UTextarea v-model="form.paymentTerms" :rows="3" class="w-full" />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">Даты проведения</h3></template>
        <p class="text-sm text-gray-500">Управление датами будет доступно после сохранения тура в разделе дат.</p>
      </UCard>
    </div>

    <!-- Tab: Программа -->
    <div v-show="activeTab === 'program'" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Программа по дням</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addProgramDay" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="(day, i) in form.program" :key="i" class="p-4 border rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-emerald-600">День {{ day.day }}</span>
              <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="xs" @click="form.program.splice(i, 1)" />
            </div>
            <UInput v-model="day.title" placeholder="Заголовок дня" class="w-full" />
            <UTextarea v-model="day.content" placeholder="Описание (поддерживается Markdown)" :rows="4" class="w-full" />
            <OrganizerPhotoUploadGrid
              :images="day.images || []"
              :max-count="5"
              folder="tour-program"
              @update:images="day.images = $event"
            />
          </div>
          <p v-if="!form.program.length" class="text-sm text-gray-500">Добавьте дни программы</p>
        </div>
      </UCard>
    </div>

    <!-- Tab: Условия и FAQ -->
    <div v-show="activeTab === 'terms'" class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">Что включено / не включено</h3></template>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium">Включено</p>
              <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="form.includes.push('')" />
            </div>
            <div class="space-y-2">
              <div v-for="(_, i) in form.includes" :key="i" class="flex items-center gap-2">
                <UInput v-model="form.includes[i]" placeholder="Что включено в стоимость..." class="w-full" />
                <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="sm" @click="form.includes.splice(i, 1)" />
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium">Не включено</p>
              <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="form.excludes.push('')" />
            </div>
            <div class="space-y-2">
              <div v-for="(_, i) in form.excludes" :key="i" class="flex items-center gap-2">
                <UInput v-model="form.excludes[i]" placeholder="Что не включено..." class="w-full" />
                <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="sm" @click="form.excludes.splice(i, 1)" />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">Страхование</h3></template>
        <USelect v-model="form.insurance" :items="insuranceOptions" class="w-full" />
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">Отмена бронирования</h3></template>
        <UTextarea v-model="form.cancellationConditions" :rows="3" class="w-full" placeholder="Условия отмены бронирования..." />
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">Список вещей</h3></template>
        <UTextarea v-model="form.packingList" :rows="4" class="w-full" placeholder="Что взять с собой..." />
      </UCard>

      <!-- FAQ -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Важно знать (FAQ)</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="form.faq.push({ question: '', answer: '' })" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="(item, i) in form.faq" :key="i" class="p-4 border rounded-lg space-y-2">
            <div class="flex items-center justify-between">
              <UInput v-model="item.question" placeholder="Вопрос" class="w-full mr-3" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="sm" @click="form.faq.splice(i, 1)" />
            </div>
            <UTextarea v-model="item.answer" placeholder="Ответ" :rows="2" class="w-full" />
          </div>
          <p v-if="!form.faq.length" class="text-sm text-gray-500">Добавьте вопросы и ответы</p>
        </div>
      </UCard>
    </div>

    <!-- Tab: Билеты -->
    <div v-show="activeTab === 'tickets'" class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">Рекомендации по путешествию</h3></template>
        <UTextarea v-model="form.travelRecommendations" :rows="4" class="w-full" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Информация о билетах</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addTicketInfo" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="(ticket, i) in form.ticketInfo" :key="i" class="p-4 border rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Маршрут {{ i + 1 }}</span>
              <UButton icon="i-heroicons-trash" variant="ghost" color="red" size="xs" @click="form.ticketInfo.splice(i, 1)" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <UFormField label="Город начала">
                <UInput v-model="ticket.startCity" placeholder="Откуда" class="w-full" />
              </UFormField>
              <UFormField label="Город окончания">
                <UInput v-model="ticket.endCity" placeholder="Куда" class="w-full" />
              </UFormField>
              <UFormField label="Вид транспорта">
                <USelect v-model="ticket.transportType" :items="transportOptions" class="w-full" />
              </UFormField>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p class="text-xs font-medium text-gray-500 mb-1">Время прибытия</p>
                <div class="flex items-center gap-2">
                  <UInput v-model="ticket.earliestArrivalTime" type="time" placeholder="Раннее" class="w-full" />
                  <span class="text-gray-400 text-xs">—</span>
                  <UInput v-model="ticket.latestArrivalTime" type="time" placeholder="Позднее" class="w-full" />
                </div>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 mb-1">Время отправления</p>
                <div class="flex items-center gap-2">
                  <UInput v-model="ticket.earliestDepartureTime" type="time" placeholder="Раннее" class="w-full" />
                  <span class="text-gray-400 text-xs">—</span>
                  <UInput v-model="ticket.latestDepartureTime" type="time" placeholder="Позднее" class="w-full" />
                </div>
              </div>
            </div>
          </div>
          <p v-if="!form.ticketInfo.length" class="text-sm text-gray-500">Информация о билетах не добавлена</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { languageOptions as langData } from '~/utils/data/languages'
import { countryOptions } from '~/utils/data/countries'

definePageMeta({
  layout: 'organizer',
})

const route = useRoute()
const toast = useToast()
const tourId = route.params.id as string

const activeTab = ref('basic')
const saving = ref(false)
const submitting = ref(false)
const uploadingPhotos = ref(false)
const photoInput = ref<HTMLInputElement>()

const tabs = [
  { label: 'Основное', value: 'basic' },
  { label: 'Жильё', value: 'accommodation' },
  { label: 'Цены и даты', value: 'prices' },
  { label: 'Программа', value: 'program' },
  { label: 'Условия', value: 'terms' },
  { label: 'Билеты', value: 'tickets' },
]

const languageOpts = langData

const difficultyOptions = [
  { label: 'Выберите...', value: 'none' },
  { label: 'Лёгкий', value: 'easy' },
  { label: 'Средний', value: 'medium' },
  { label: 'Сложный', value: 'hard' },
  { label: 'Экстремальный', value: 'extreme' },
]

const comfortOptions = [
  { label: 'Выберите...', value: 'none' },
  { label: 'Базовый', value: 'basic' },
  { label: 'Стандарт', value: 'standard' },
  { label: 'Комфорт', value: 'comfort' },
  { label: 'Люкс', value: 'luxury' },
]

const currencyOptions = [
  { label: 'RUB', value: 'RUB' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
]

const insuranceOptions = [
  { label: 'Выберите...', value: 'none' },
  { label: 'Включена в стоимость', value: 'included' },
  { label: 'Не включена', value: 'not_included' },
  { label: 'Обязательна, не включена в стоимость', value: 'mandatory_not_included' },
]

const transportOptions = [
  { label: 'Самолёт', value: 'plane' },
  { label: 'Поезд', value: 'train' },
  { label: 'Автобус', value: 'bus' },
  { label: 'Автомобиль', value: 'car' },
  { label: 'Паром', value: 'ferry' },
  { label: 'Другое', value: 'other' },
]

// Types
interface KeyImpression {
  title: string
  description: string
  images: string[]
}

interface TourGuide {
  name: string
  photo?: string
  bio?: string
  guideId?: string
}

interface Accommodation {
  name: string
  description: string
  images: string[]
  nights: number | null
}

interface ProgramDay {
  day: number
  title: string
  content: string
  images: string[]
}

interface FaqItem {
  question: string
  answer: string
}

interface TicketInfo {
  startCity: string
  endCity: string
  transportType: string
  earliestArrivalTime: string
  latestArrivalTime: string
  earliestDepartureTime: string
  latestDepartureTime: string
}

// Fetch tour data
const { data: tour, refresh: refreshTour } = await useFetch(`/api/organizer/tours/${tourId}`)

// Fetch media
const { data: tourMedia, refresh: refreshMedia } = await useFetch(`/api/organizer/tours/${tourId}/media`, {
  default: () => [] as any[],
})

// Form state
const form = reactive({
  title: '',
  tagline: '',
  description: '',
  language: '',
  durationDays: null as number | null,
  difficulty: '',
  groupSizeMin: null as number | null,
  groupSizeMax: null as number | null,
  minAge: null as number | null,
  route: '',
  priceFrom: null as number | null,
  currency: 'RUB',
  paymentTerms: '',
  comfortLevel: '',
  accommodationInfo: '',
  insurance: '',
  cancellationConditions: '',
  packingList: '',
  travelRecommendations: '',
  generalTouristComment: '',
  countries: [] as string[],
  keyImpressions: [] as KeyImpression[],
  guides: [] as TourGuide[],
  accommodations: [] as Accommodation[],
  program: [] as ProgramDay[],
  includes: [] as string[],
  excludes: [] as string[],
  faq: [] as FaqItem[],
  ticketInfo: [] as TicketInfo[],
})

// Populate form from fetched data
watch(tour, (t: any) => {
  if (!t) return
  form.title = t.title || ''
  form.tagline = t.tagline || ''
  form.description = t.description || ''
  form.language = t.language || ''
  form.durationDays = t.durationDays
  form.difficulty = t.difficulty || ''
  form.groupSizeMin = t.groupSizeMin
  form.groupSizeMax = t.groupSizeMax
  form.minAge = t.minAge
  form.route = t.route || ''
  form.priceFrom = t.priceFrom ? Number(t.priceFrom) : null
  form.currency = t.currency || 'RUB'
  form.paymentTerms = t.paymentTerms || ''
  form.comfortLevel = t.comfortLevel || ''
  form.accommodationInfo = t.accommodationInfo || ''
  form.insurance = t.insurance || ''
  form.cancellationConditions = t.cancellationPolicy?.conditions || ''
  form.packingList = t.packingList || ''
  form.travelRecommendations = t.travelRecommendations || ''
  form.generalTouristComment = t.generalTouristComment || ''
  form.countries = t.countries || []

  // Key impressions — handle legacy string[] and new object[]
  if (t.keyImpressions && t.keyImpressions.length) {
    if (typeof t.keyImpressions[0] === 'string') {
      form.keyImpressions = t.keyImpressions.map((s: string) => ({ title: s, description: '', images: [] }))
    }
    else {
      form.keyImpressions = t.keyImpressions.map((imp: any) => ({
        title: imp.title || '',
        description: imp.description || '',
        images: imp.images || [],
      }))
    }
  }
  else {
    form.keyImpressions = []
  }

  form.guides = t.guides || []

  // Accommodations — add nights
  form.accommodations = (t.accommodations || []).map((a: any) => ({
    name: a.name || '',
    description: a.description || '',
    images: a.images || [],
    nights: a.nights ?? null,
  }))

  // Program — add images
  form.program = (t.program || []).map((d: any) => ({
    day: d.day,
    title: d.title || '',
    content: d.content || '',
    images: d.images || [],
  }))

  // Includes — handle legacy {category, text} and new string[]
  if (t.includes && t.includes.length) {
    if (typeof t.includes[0] === 'string') {
      form.includes = t.includes
    }
    else {
      form.includes = t.includes.map((i: any) => i.text || '')
    }
  }
  else {
    form.includes = []
  }

  form.excludes = t.excludes || []
  form.faq = t.faq || []

  // Ticket info — handle legacy cities and new ticketInfo
  if (t.ticketInfo) {
    form.ticketInfo = t.ticketInfo
  }
  else {
    form.ticketInfo = []
  }
}, { immediate: true })

function addKeyImpression() {
  form.keyImpressions.push({ title: '', description: '', images: [] })
}

function addProgramDay() {
  const nextDay = form.program.length ? Math.max(...form.program.map(d => d.day)) + 1 : 1
  form.program.push({ day: nextDay, title: '', content: '', images: [] })
}

function addTicketInfo() {
  form.ticketInfo.push({
    startCity: '',
    endCity: '',
    transportType: 'plane',
    earliestArrivalTime: '',
    latestArrivalTime: '',
    earliestDepartureTime: '',
    latestDepartureTime: '',
  })
}

function getFormBody() {
  return {
    title: form.title,
    tagline: form.tagline || null,
    description: form.description || null,
    language: form.language || null,
    durationDays: form.durationDays,
    difficulty: form.difficulty || null,
    groupSizeMin: form.groupSizeMin,
    groupSizeMax: form.groupSizeMax,
    minAge: form.minAge,
    route: form.route || null,
    priceFrom: form.priceFrom,
    currency: form.currency,
    paymentTerms: form.paymentTerms || null,
    comfortLevel: form.comfortLevel || null,
    accommodationInfo: form.accommodationInfo || null,
    insurance: form.insurance || null,
    cancellationPolicy: form.cancellationConditions ? { useTemplate: false, conditions: form.cancellationConditions } : null,
    packingList: form.packingList || null,
    travelRecommendations: form.travelRecommendations || null,
    generalTouristComment: form.generalTouristComment || null,
    countries: form.countries.length ? form.countries : null,
    keyImpressions: form.keyImpressions.filter(imp => imp.title),
    guides: form.guides.filter(g => g.name),
    accommodations: form.accommodations.filter(a => a.name),
    program: form.program.filter(d => d.title || d.content),
    includes: form.includes.filter(Boolean),
    excludes: form.excludes.filter(Boolean),
    faq: form.faq.filter(f => f.question || f.answer),
    ticketInfo: form.ticketInfo.filter(t => t.startCity || t.endCity),
  }
}

async function saveDraft() {
  saving.value = true
  try {
    await $fetch(`/api/organizer/tours/${tourId}`, {
      method: 'PUT',
      body: { ...getFormBody(), status: 'draft' },
    })
    await refreshTour()
    toast.add({ title: 'Черновик сохранён', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка сохранения', color: 'error' })
  }
  finally {
    saving.value = false
  }
}

async function submitForReview() {
  submitting.value = true
  try {
    await $fetch(`/api/organizer/tours/${tourId}`, {
      method: 'PUT',
      body: { ...getFormBody(), status: 'pending_review' },
    })
    await refreshTour()
    toast.add({ title: 'Тур отправлен на модерацию', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  }
  finally {
    submitting.value = false
  }
}

async function uploadPhotos(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  uploadingPhotos.value = true
  try {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await $fetch(`/api/organizer/tours/${tourId}/media`, {
        method: 'POST',
        body: formData,
      })
    }
    await refreshMedia()
    toast.add({ title: `${files.length} фото загружено`, color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка загрузки', color: 'error' })
  }
  finally {
    uploadingPhotos.value = false
    input.value = ''
  }
}

async function removeMedia(tourMediaId: string) {
  try {
    await $fetch(`/api/organizer/tours/${tourId}/media`, {
      method: 'DELETE',
      body: { tourMediaId },
    })
    await refreshMedia()
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка удаления', color: 'error' })
  }
}
</script>
