<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <UTabs :items="tabs" v-model="activeTab" />

    <!-- Tab: Основное -->
    <div v-if="activeTab === 'basic'" class="space-y-6">
      <!-- Photo upload -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Фото автора</h3>
        </template>
        <div class="flex items-center gap-4">
          <UAvatar :src="profile?.photoUrl || undefined" size="xl" />
          <div>
            <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="uploadPhoto" />
            <UButton variant="soft" @click="photoInput?.click()" :loading="uploadingPhoto">
              Загрузить фото
            </UButton>
            <p class="text-xs text-gray-500 mt-1">JPG, PNG. Рекомендуемый размер 200x200</p>
          </div>
        </div>
      </UCard>

      <!-- Personal info -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Личные данные</h3>
        </template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Имя *">
              <UInput v-model="form.firstName" class="w-full" />
            </UFormField>
            <UFormField label="Фамилия *">
              <UInput v-model="form.lastName" class="w-full" />
            </UFormField>
            <UFormField label="Отчество">
              <UInput v-model="form.patronymic" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="О себе (до 2000 символов)">
            <UTextarea v-model="form.aboutMe" :rows="4" :maxlength="2000" class="w-full" />
          </UFormField>
        </div>
      </UCard>

      <!-- Legal entity info -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Данные организатора</h3>
        </template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Страна регистрации">
              <OrganizerSearchSelect
                :items="countryOptions"
                v-model="form.country"
                placeholder="Выберите страну..."
              />
            </UFormField>
            <UFormField label="Организационно-правовая форма">
              <USelect v-model="form.legalForm" :items="legalForms" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="ИНН">
              <UInput v-model="form.inn" class="w-full" />
            </UFormField>
            <UFormField label="ОГРНИП">
              <UInput v-model="form.ogrnip" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Юридическое название">
              <UInput v-model="form.legalName" class="w-full" />
            </UFormField>
            <UFormField label="Краткое название">
              <UInput v-model="form.shortLegalName" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Юридический адрес">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <UInput v-model="legalAddress.country" placeholder="Страна" class="w-full" />
              <UInput v-model="legalAddress.region" placeholder="Регион" class="w-full" />
              <UInput v-model="legalAddress.city" placeholder="Город" class="w-full" />
              <UInput v-model="legalAddress.index" placeholder="Индекс" class="w-full" />
              <UInput v-model="legalAddress.street" placeholder="Улица, дом" class="w-full md:col-span-2" />
            </div>
          </UFormField>

          <UFormField label="Телефон юридического лица">
            <UInput v-model="form.legalPhone" class="w-full" />
          </UFormField>
        </div>
      </UCard>

      <!-- VAT rates -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Ставки НДС</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addVatRate">Добавить</UButton>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="(vat, i) in vatRates" :key="i" class="flex items-end gap-3">
            <UFormField label="Ставка, %">
              <UInput v-model.number="vat.rate" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Дата начала">
              <UInput v-model="vat.startDate" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Дата окончания">
              <UInput v-model="vat.endDate" type="date" class="w-full" />
            </UFormField>
            <UButton variant="ghost" color="red" icon="i-heroicons-trash" size="sm" @click="vatRates.splice(i, 1)" />
          </div>
          <p v-if="!vatRates.length" class="text-sm text-gray-500">Ставки НДС не указаны</p>
        </div>
      </UCard>
    </div>

    <!-- Tab: Контакты -->
    <div v-if="activeTab === 'contacts'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Контактные данные</h3>
        </template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Телефон">
              <UInput v-model="form.phone" placeholder="+7 (999) 123-45-67" class="w-full" />
            </UFormField>
            <UFormField label="Веб-сайт">
              <UInput v-model="form.websiteUrl" placeholder="https://example.com" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Email для связи *">
              <UInput v-model="form.emailContact" type="email" class="w-full" />
            </UFormField>
            <UFormField label="Email для документов">
              <UInput v-model="form.emailDocuments" type="email" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Дополнительные контакты">
            <UTextarea v-model="form.additionalContacts" :rows="3" class="w-full" placeholder="Мессенджеры, доп. телефоны..." />
          </UFormField>
        </div>
      </UCard>

      <!-- Social links -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Социальные сети</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addSocialLink">Добавить</UButton>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="(link, i) in socialLinks" :key="i" class="flex items-end gap-3">
            <UFormField label="Платформа" class="w-40">
              <USelect v-model="link.type" :items="socialTypes" class="w-full" />
            </UFormField>
            <UFormField label="URL" class="flex-1">
              <UInput v-model="link.url" placeholder="https://..." class="w-full" />
            </UFormField>
            <UButton variant="ghost" color="red" icon="i-heroicons-trash" size="sm" @click="socialLinks.splice(i, 1)" />
          </div>
          <p v-if="!socialLinks.length" class="text-sm text-gray-500">Социальные сети не добавлены</p>
        </div>
      </UCard>

      <!-- Review URLs -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Ссылки на отзывы</h3>
            <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="reviewUrls.push('')">Добавить</UButton>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="(_, i) in reviewUrls" :key="i" class="flex items-center gap-3">
            <UInput v-model="reviewUrls[i]" placeholder="https://tripadvisor.com/..." class="w-full" />
            <UButton variant="ghost" color="red" icon="i-heroicons-trash" size="sm" @click="reviewUrls.splice(i, 1)" />
          </div>
          <p v-if="!reviewUrls.length" class="text-sm text-gray-500">Ссылки на отзывы не добавлены</p>
        </div>
      </UCard>

      <!-- Work schedule -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">График работы</h3>
        </template>
        <div class="space-y-4">
          <UFormField label="Часовой пояс">
            <OrganizerSearchSelect
              :items="timezoneOptions"
              v-model="form.timezone"
              placeholder="Выберите часовой пояс..."
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium mb-2">Будние дни</p>
              <div class="flex items-center gap-2">
                <UInput v-model="schedule.weekdayStart" type="time" class="w-full" />
                <span class="text-gray-500">&mdash;</span>
                <UInput v-model="schedule.weekdayEnd" type="time" class="w-full" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium mb-2">Выходные дни</p>
              <div class="flex items-center gap-2">
                <UInput v-model="schedule.weekendStart" type="time" class="w-full" />
                <span class="text-gray-500">&mdash;</span>
                <UInput v-model="schedule.weekendEnd" type="time" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Tab: Политика отмены -->
    <div v-if="activeTab === 'cancellation'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Условия отмены бронирования</h3>
        </template>
        <div class="space-y-4">
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="cancellationPolicy.type" value="standard" class="accent-primary-500" />
              <span class="text-sm font-medium">Стандартные условия</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="cancellationPolicy.type" value="individual" class="accent-primary-500" />
              <span class="text-sm font-medium">Индивидуальные условия</span>
            </label>
          </div>

          <!-- Standard info -->
          <div v-if="cancellationPolicy.type === 'standard'" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              При стандартных условиях применяются общие правила платформы по отмене и возврату средств.
              Клиент может отменить бронирование бесплатно за 30 дней до начала тура.
            </p>
          </div>

          <!-- Individual penalties -->
          <div v-if="cancellationPolicy.type === 'individual'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">Штрафные санкции</h4>
              <UButton variant="soft" size="xs" icon="i-heroicons-plus" @click="addPenalty">Добавить</UButton>
            </div>

            <div class="space-y-3">
              <div v-for="(penalty, i) in cancellationPenalties" :key="i" class="flex items-end gap-3">
                <UFormField label="Размер штрафа" class="flex-1">
                  <UInput v-model="penalty.amount" placeholder="50%" class="w-full" />
                </UFormField>
                <UFormField label="Период аннуляции" class="flex-1">
                  <UInput v-model="penalty.period" placeholder="За 14-7 дней до начала" class="w-full" />
                </UFormField>
                <UButton variant="ghost" color="red" icon="i-heroicons-trash" size="sm" @click="cancellationPenalties.splice(i, 1)" />
              </div>
              <p v-if="!cancellationPenalties.length" class="text-sm text-gray-500">Штрафные санкции не указаны</p>
            </div>

            <UFormField label="Дополнительные условия">
              <UTextarea v-model="cancellationPolicy.additionalConditions" :rows="3" class="w-full" placeholder="Особые условия..." />
            </UFormField>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Tab: Гиды -->
    <div v-if="activeTab === 'guides'" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Мои гиды</h3>
            <UButton icon="i-heroicons-plus" size="sm" @click="openGuideModal()">Добавить гида</UButton>
          </div>
        </template>
        <div>
          <div v-if="loadingGuides" class="text-center py-8 text-gray-500">Загрузка...</div>
          <div v-else-if="!guidesList.length" class="text-center py-8 text-gray-500">
            Вы ещё не добавили гидов
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="guide in guidesList"
              :key="guide.id"
              class="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="relative group">
                <UAvatar :src="guide.photo || undefined" :alt="`${guide.firstName} ${guide.lastName}`" size="xl" />
                <label class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <UIcon name="i-heroicons-camera" class="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" class="hidden" @change="uploadGuidePhoto($event, guide.id)" />
                </label>
              </div>
              <div class="text-center">
                <div class="font-medium">{{ guide.firstName }} {{ guide.lastName }}</div>
                <div v-if="guide.bio" class="text-sm text-gray-500 mt-1 line-clamp-2">{{ guide.bio }}</div>
              </div>
              <div class="flex gap-2">
                <UButton variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openGuideModal(guide)">
                  Изменить
                </UButton>
                <UButton variant="ghost" color="red" size="xs" icon="i-heroicons-trash" @click="deleteGuide(guide.id)">
                  Удалить
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Guide modal -->
      <UModal v-model:open="guideModalOpen">
        <template #header>
          <h3 class="text-lg font-semibold">{{ editingGuide ? 'Редактировать гида' : 'Новый гид' }}</h3>
        </template>
        <template #body>
          <div class="p-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Имя *">
                <UInput v-model="guideForm.firstName" class="w-full" />
              </UFormField>
              <UFormField label="Фамилия *">
                <UInput v-model="guideForm.lastName" class="w-full" />
              </UFormField>
            </div>
            <UFormField label="О гиде">
              <UTextarea v-model="guideForm.bio" :rows="4" class="w-full" placeholder="Расскажите о гиде..." />
            </UFormField>
            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="guideModalOpen = false">Отмена</UButton>
              <UButton :loading="savingGuide" :disabled="!guideForm.firstName || !guideForm.lastName" @click="saveGuide">
                {{ editingGuide ? 'Сохранить' : 'Создать' }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>

    <!-- Save button (not on guides tab) -->
    <div v-if="activeTab !== 'guides'" class="flex justify-end">
      <UButton @click="saveProfile" :loading="saving" size="lg" color="emerald">
        Сохранить профиль
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { countryOptions } from '~/utils/data/countries'
import { timezoneOptions } from '~/utils/data/timezones'

definePageMeta({
  layout: 'organizer',
})

const toast = useToast()

const tabs = [
  { label: 'Основное', value: 'basic' },
  { label: 'Контакты', value: 'contacts' },
  { label: 'Политика отмены', value: 'cancellation' },
  { label: 'Гиды', value: 'guides' },
]
const activeTab = ref('basic')

const photoInput = ref<HTMLInputElement>()
const uploadingPhoto = ref(false)
const saving = ref(false)

// Fetch profile
const { data, refresh } = await useFetch('/api/organizer/profile')
const profile = computed(() => data.value?.profile)

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  patronymic: '',
  aboutMe: '',
  country: '',
  legalForm: '',
  inn: '',
  ogrnip: '',
  legalName: '',
  shortLegalName: '',
  legalPhone: '',
  phone: '',
  websiteUrl: '',
  emailContact: '',
  emailDocuments: '',
  additionalContacts: '',
  timezone: '',
})

const legalAddress = reactive({
  index: '',
  country: '',
  region: '',
  city: '',
  street: '',
})

const schedule = reactive({
  weekdayStart: '',
  weekdayEnd: '',
  weekendStart: '',
  weekendEnd: '',
})

const vatRates = reactive<Array<{ rate: number; startDate: string; endDate: string }>>([])
const reviewUrls = reactive<string[]>([])

interface SocialLink {
  type: string
  url: string
}
const socialLinks = reactive<SocialLink[]>([])

const socialTypes = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'ВКонтакте', value: 'vk' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Другое', value: 'other' },
]

// Cancellation policy
const cancellationPolicy = reactive({
  type: 'standard' as 'standard' | 'individual',
  additionalConditions: '',
})
const cancellationPenalties = reactive<Array<{ amount: string; period: string }>>([])

const legalForms = [
  { label: 'Выберите...', value: 'none' },
  { label: 'ИП', value: 'ip' },
  { label: 'ООО', value: 'ooo' },
  { label: 'Самозанятый', value: 'self_employed' },
]

// Guides
interface GuideData {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  bio: string | null
}

const guidesList = ref<GuideData[]>([])
const loadingGuides = ref(false)
const guideModalOpen = ref(false)
const editingGuide = ref<string | null>(null)
const savingGuide = ref(false)
const guideForm = reactive({
  firstName: '',
  lastName: '',
  bio: '',
})

// Load guides when tab changes
watch(activeTab, async (tab) => {
  if (tab === 'guides') {
    await loadGuidesList()
  }
}, { immediate: true })

async function loadGuidesList() {
  loadingGuides.value = true
  try {
    const data = await $fetch<{ guides: GuideData[] }>('/api/organizer/guides')
    guidesList.value = data.guides
  }
  catch {
    // ignore
  }
  loadingGuides.value = false
}

function openGuideModal(guide?: GuideData) {
  if (guide) {
    editingGuide.value = guide.id
    guideForm.firstName = guide.firstName
    guideForm.lastName = guide.lastName
    guideForm.bio = guide.bio || ''
  }
  else {
    editingGuide.value = null
    guideForm.firstName = ''
    guideForm.lastName = ''
    guideForm.bio = ''
  }
  guideModalOpen.value = true
}

async function saveGuide() {
  savingGuide.value = true
  try {
    if (editingGuide.value) {
      await $fetch(`/api/organizer/guides/${editingGuide.value}`, {
        method: 'PUT',
        body: guideForm,
      })
      toast.add({ title: 'Гид обновлён', color: 'success' })
    }
    else {
      await $fetch('/api/organizer/guides', {
        method: 'POST',
        body: guideForm,
      })
      toast.add({ title: 'Гид создан', color: 'success' })
    }
    guideModalOpen.value = false
    await loadGuidesList()
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  }
  savingGuide.value = false
}

async function deleteGuide(id: string) {
  if (!confirm('Удалить этого гида?')) return
  try {
    await $fetch(`/api/organizer/guides/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Гид удалён', color: 'success' })
    await loadGuidesList()
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  }
}

async function uploadGuidePhoto(e: Event, guideId: string) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  try {
    await $fetch(`/api/organizer/guides/${guideId}/upload-photo`, {
      method: 'POST',
      body: formData,
    })
    toast.add({ title: 'Фото загружено', color: 'success' })
    await loadGuidesList()
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка', color: 'error' })
  }
  input.value = ''
}

function addSocialLink() {
  socialLinks.push({ type: 'instagram', url: '' })
}

function addPenalty() {
  cancellationPenalties.push({ amount: '', period: '' })
}

// Populate form from fetched data
watch(profile, (p) => {
  if (!p) return
  Object.assign(form, {
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    patronymic: p.patronymic || '',
    aboutMe: p.aboutMe || '',
    country: p.country || '',
    legalForm: p.legalForm || '',
    inn: p.inn || '',
    ogrnip: p.ogrnip || '',
    legalName: p.legalName || '',
    shortLegalName: p.shortLegalName || '',
    legalPhone: p.legalPhone || '',
    phone: p.phone || '',
    websiteUrl: p.websiteUrl || '',
    emailContact: p.emailContact || '',
    emailDocuments: p.emailDocuments || '',
    additionalContacts: p.additionalContacts || '',
    timezone: p.timezone || '',
  })
  if (p.legalAddress) Object.assign(legalAddress, p.legalAddress)
  if (p.workSchedule) Object.assign(schedule, p.workSchedule)
  if (p.vatRates) vatRates.splice(0, vatRates.length, ...p.vatRates)
  if (p.reviewUrls) reviewUrls.splice(0, reviewUrls.length, ...p.reviewUrls)
  if (p.socialLinks) socialLinks.splice(0, socialLinks.length, ...p.socialLinks)
  if (p.cancellationPolicyTemplate) {
    cancellationPolicy.type = p.cancellationPolicyTemplate.type || 'standard'
    cancellationPolicy.additionalConditions = p.cancellationPolicyTemplate.additionalConditions || ''
    if (p.cancellationPolicyTemplate.penalties) {
      cancellationPenalties.splice(0, cancellationPenalties.length, ...p.cancellationPolicyTemplate.penalties)
    }
  }
}, { immediate: true })

function addVatRate() {
  vatRates.push({ rate: 0, startDate: '', endDate: '' })
}

async function uploadPhoto(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingPhoto.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await $fetch<{ url: string }>('/api/organizer/profile/upload-photo', {
      method: 'POST',
      body: formData,
    })
    await refresh()
    toast.add({ title: 'Фото загружено', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка загрузки', color: 'error' })
  }
  finally {
    uploadingPhoto.value = false
    input.value = ''
  }
}

async function saveProfile() {
  saving.value = true
  try {
    await $fetch('/api/organizer/profile', {
      method: 'PUT',
      body: {
        ...form,
        legalAddress,
        workSchedule: schedule,
        vatRates: vatRates.filter(v => v.rate || v.startDate),
        reviewUrls: reviewUrls.filter(Boolean),
        socialLinks: socialLinks.filter(l => l.url),
        cancellationPolicyTemplate: {
          type: cancellationPolicy.type,
          penalties: cancellationPolicy.type === 'individual' ? cancellationPenalties.filter(p => p.amount || p.period) : [],
          additionalConditions: cancellationPolicy.additionalConditions || undefined,
        },
      },
    })
    await refresh()
    toast.add({ title: 'Профиль сохранён', color: 'success' })
  }
  catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка сохранения', color: 'error' })
  }
  finally {
    saving.value = false
  }
}
</script>
