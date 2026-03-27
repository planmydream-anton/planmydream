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
              <UInput v-model="form.country" class="w-full" />
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

    <!-- Tab: Контакты и график -->
    <div v-if="activeTab === 'contacts'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Контактные данные</h3>
        </template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Email для связи *">
              <UInput v-model="form.emailContact" type="email" class="w-full" />
            </UFormField>
            <UFormField label="Email для документов">
              <UInput v-model="form.emailDocuments" type="email" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Дополнительные контакты">
            <UTextarea v-model="form.additionalContacts" :rows="3" class="w-full" placeholder="Телефон, мессенджеры, социальные сети..." />
          </UFormField>
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
            <UInput v-model="form.timezone" placeholder="Europe/Moscow" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium mb-2">Будние дни</p>
              <div class="flex items-center gap-2">
                <UInput v-model="schedule.weekdayStart" type="time" class="w-full" />
                <span class="text-gray-500">—</span>
                <UInput v-model="schedule.weekdayEnd" type="time" class="w-full" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium mb-2">Выходные дни</p>
              <div class="flex items-center gap-2">
                <UInput v-model="schedule.weekendStart" type="time" class="w-full" />
                <span class="text-gray-500">—</span>
                <UInput v-model="schedule.weekendEnd" type="time" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Save button -->
    <div class="flex justify-end">
      <UButton @click="saveProfile" :loading="saving" size="lg" color="emerald">
        Сохранить профиль
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer',
})

const toast = useToast()

const tabs = [
  { label: 'Основное', value: 'basic' },
  { label: 'Контакты и график', value: 'contacts' },
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

const legalForms = [
  { label: 'Выберите...', value: 'none' },
  { label: 'ИП', value: 'ip' },
  { label: 'ООО', value: 'ooo' },
  { label: 'Самозанятый', value: 'self_employed' },
]

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
    emailContact: p.emailContact || '',
    emailDocuments: p.emailDocuments || '',
    additionalContacts: p.additionalContacts || '',
    timezone: p.timezone || '',
  })
  if (p.legalAddress) Object.assign(legalAddress, p.legalAddress)
  if (p.workSchedule) Object.assign(schedule, p.workSchedule)
  if (p.vatRates) vatRates.splice(0, vatRates.length, ...p.vatRates)
  if (p.reviewUrls) reviewUrls.splice(0, reviewUrls.length, ...p.reviewUrls)
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
    const result = await $fetch<{ url: string }>('/api/organizer/profile/upload-photo', {
      method: 'POST',
      body: formData,
    })
    await refresh()
    toast.add({ title: 'Фото загружено', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка загрузки', color: 'error' })
  } finally {
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
      },
    })
    await refresh()
    toast.add({ title: 'Профиль сохранён', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка сохранения', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
