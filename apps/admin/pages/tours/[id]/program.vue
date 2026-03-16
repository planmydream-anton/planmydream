<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — Программа</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="soft" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="ghost" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/media`" variant="ghost" size="sm">Галерея</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="ghost" size="sm">SEO</UButton>
    </div>

    <div class="space-y-4">
      <!-- Highlights -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Ключевые достопримечательности</h3>
            <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="addHighlight">
              Добавить
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="(highlight, idx) in highlights"
            :key="idx"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-sm font-medium text-gray-500">Достопримечательность {{ idx + 1 }}</span>
              <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="error" @click="highlights.splice(idx, 1)" />
            </div>
            <div class="grid grid-cols-1 gap-3">
              <UInput v-model="highlight.title" placeholder="Название" />
              <UTextarea v-model="highlight.description" placeholder="Описание" :rows="2" />

              <!-- Image upload for highlight -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Изображение</label>
                <div v-if="highlight.imageUrl" class="relative inline-block mb-2">
                  <img
                    :src="highlight.imageUrl"
                    alt="Превью"
                    class="w-40 h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    @click="highlight.imageUrl = ''"
                  >
                    &times;
                  </button>
                </div>
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  :class="{ 'opacity-50 pointer-events-none': highlightUploading[idx] }"
                  @dragover.prevent="onDragOver($event)"
                  @dragleave="onDragLeave($event)"
                  @drop.prevent="onHighlightDrop($event, idx)"
                  @click="triggerHighlightFileInput(idx)"
                >
                  <input
                    :ref="(el) => { highlightFileInputs[idx] = el as HTMLInputElement }"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onHighlightFileChange($event, idx)"
                  />
                  <UIcon name="i-heroicons-cloud-arrow-up" class="text-2xl text-gray-400 mb-1" />
                  <p class="text-sm text-gray-500">
                    <template v-if="highlightUploading[idx]">Загрузка...</template>
                    <template v-else>Перетащите файл или нажмите для выбора</template>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="!highlights.length" class="text-sm text-gray-400 text-center py-4">
            Нет достопримечательностей. Нажмите «Добавить».
          </p>
        </div>
      </UCard>

      <!-- Program days -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Программа по дням</h3>
            <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="addProgramDay">
              Добавить день
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="(day, idx) in programDays"
            :key="idx"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-sm font-medium text-gray-500">День {{ day.day }}</span>
              <UButton icon="i-heroicons-trash" size="xs" variant="ghost" color="error" @click="programDays.splice(idx, 1)" />
            </div>
            <div class="grid grid-cols-1 gap-3">
              <div class="grid grid-cols-2 gap-3">
                <UInput v-model.number="day.day" type="number" placeholder="Номер дня" />
                <UInput v-model="day.title" placeholder="Заголовок дня" />
              </div>
              <UTextarea v-model="day.content" placeholder="Описание дня (поддерживается Markdown)" :rows="4" />

              <!-- Images for program day -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Фотографии дня (3-5 шт.)</label>

                <!-- Thumbnails of uploaded images -->
                <div v-if="day.images && day.images.length" class="flex flex-wrap gap-2 mb-2">
                  <div
                    v-for="(imgUrl, imgIdx) in day.images"
                    :key="imgIdx"
                    class="relative inline-block"
                  >
                    <img
                      :src="imgUrl"
                      alt="Фото дня"
                      class="w-28 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      @click="day.images!.splice(imgIdx, 1)"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <!-- Drop zone for day images -->
                <div
                  v-if="!day.images || day.images.length < 5"
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  :class="{ 'opacity-50 pointer-events-none': dayUploading[idx] }"
                  @dragover.prevent="onDragOver($event)"
                  @dragleave="onDragLeave($event)"
                  @drop.prevent="onDayDrop($event, idx)"
                  @click="triggerDayFileInput(idx)"
                >
                  <input
                    :ref="(el) => { dayFileInputs[idx] = el as HTMLInputElement }"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="onDayFileChange($event, idx)"
                  />
                  <UIcon name="i-heroicons-cloud-arrow-up" class="text-2xl text-gray-400 mb-1" />
                  <p class="text-sm text-gray-500">
                    <template v-if="dayUploading[idx]">Загрузка...</template>
                    <template v-else>
                      Перетащите фото или нажмите для выбора (ещё {{ 5 - (day.images?.length || 0) }} шт.)
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="!programDays.length" class="text-sm text-gray-400 text-center py-4">
            Нет программы. Нажмите «Добавить день».
          </p>
        </div>
      </UCard>

      <!-- Includes / Excludes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Что включено</h3>
              <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="addInclude">Добавить</UButton>
            </div>
          </template>

          <div class="space-y-3">
            <div v-for="(item, idx) in includeItems" :key="idx" class="flex gap-2 items-start">
              <USelect v-model="item.category" :items="categoryOptions" class="w-36 shrink-0" />
              <UInput v-model="item.text" placeholder="Описание" class="flex-1" />
              <UButton icon="i-heroicons-x-mark" size="xs" variant="ghost" color="error" @click="includeItems.splice(idx, 1)" />
            </div>
            <p v-if="!includeItems.length" class="text-sm text-gray-400 text-center py-2">Пусто</p>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Что НЕ включено</h3>
              <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="excludeItems.push('')">Добавить</UButton>
            </div>
          </template>

          <div class="space-y-3">
            <div v-for="(_, idx) in excludeItems" :key="idx" class="flex gap-2">
              <UInput v-model="excludeItems[idx]" placeholder="Описание" class="flex-1" />
              <UButton icon="i-heroicons-x-mark" size="xs" variant="ghost" color="error" @click="excludeItems.splice(idx, 1)" />
            </div>
            <p v-if="!excludeItems.length" class="text-sm text-gray-400 text-center py-2">Пусто</p>
          </div>
        </UCard>
      </div>

      <div class="flex justify-end">
        <UButton @click="saveAll" :loading="saving">Сохранить программу</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const saving = ref(false)

const { data: tour, refresh } = await useFetch<any>(`/api/admin/tours/${id}`)

const highlights = reactive<Array<{ title: string; description: string; imageUrl?: string }>>(
  tour.value?.highlights || []
)

const programDays = reactive<Array<{ day: number; title: string; content: string; images?: string[] }>>(
  (tour.value?.program || []).map((d: any) => ({
    ...d,
    images: d.images || [],
  }))
)

const includeItems = reactive<Array<{ category: string; text: string }>>(
  tour.value?.includes || []
)

const excludeItems = reactive<string[]>(
  tour.value?.excludes || []
)

const categoryOptions = [
  { label: 'Транспорт', value: 'transport' },
  { label: 'Проживание', value: 'accommodation' },
  { label: 'Питание', value: 'food' },
  { label: 'Экскурсии', value: 'sights' },
  { label: 'Сервисы', value: 'services' },
  { label: 'Другое', value: 'other' },
]

// Upload state
const highlightUploading = reactive<Record<number, boolean>>({})
const dayUploading = reactive<Record<number, boolean>>({})
const highlightFileInputs: Record<number, HTMLInputElement | null> = {}
const dayFileInputs: Record<number, HTMLInputElement | null> = {}

function addHighlight() {
  highlights.push({ title: '', description: '', imageUrl: '' })
}

function addProgramDay() {
  const nextDay = programDays.length > 0 ? Math.max(...programDays.map(d => d.day)) + 1 : 1
  programDays.push({ day: nextDay, title: '', content: '', images: [] })
}

function addInclude() {
  includeItems.push({ category: 'other', text: '' })
}

// --- File upload helper ---
async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await $fetch<{ url: string }>('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    })
    return res.url
  } catch (e: any) {
    toast.add({ title: 'Ошибка загрузки', description: e.data?.message || 'Не удалось загрузить файл', color: 'error' })
    return null
  }
}

// --- Drag & drop helpers ---
function onDragOver(event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  target.classList.add('border-primary-500', 'bg-gray-50', 'dark:bg-gray-800')
}

function onDragLeave(event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  target.classList.remove('border-primary-500', 'bg-gray-50', 'dark:bg-gray-800')
}

// --- Highlight image upload ---
function triggerHighlightFileInput(idx: number) {
  highlightFileInputs[idx]?.click()
}

async function uploadHighlightImage(file: File, idx: number) {
  if (!file.type.startsWith('image/')) return
  highlightUploading[idx] = true
  const url = await uploadFile(file)
  if (url) {
    highlights[idx].imageUrl = url
  }
  highlightUploading[idx] = false
}

function onHighlightFileChange(event: Event, idx: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) uploadHighlightImage(file, idx)
  input.value = ''
}

function onHighlightDrop(event: DragEvent, idx: number) {
  onDragLeave(event)
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadHighlightImage(file, idx)
}

// --- Day images upload ---
function triggerDayFileInput(idx: number) {
  dayFileInputs[idx]?.click()
}

async function uploadDayImages(files: File[], dayIdx: number) {
  const day = programDays[dayIdx]
  if (!day.images) day.images = []

  const remaining = 5 - day.images.length
  const filesToUpload = files.filter(f => f.type.startsWith('image/')).slice(0, remaining)
  if (!filesToUpload.length) return

  dayUploading[dayIdx] = true
  for (const file of filesToUpload) {
    const url = await uploadFile(file)
    if (url) {
      day.images.push(url)
    }
  }
  dayUploading[dayIdx] = false
}

function onDayFileChange(event: Event, dayIdx: number) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length) uploadDayImages(files, dayIdx)
  input.value = ''
}

function onDayDrop(event: DragEvent, dayIdx: number) {
  onDragLeave(event)
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length) uploadDayImages(files, dayIdx)
}

// --- Save ---
async function saveAll() {
  saving.value = true
  try {
    await $fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      body: {
        highlights: [...highlights],
        program: programDays.map(d => ({
          day: d.day,
          title: d.title,
          content: d.content,
          images: d.images || [],
        })),
        includes: [...includeItems],
        excludes: [...excludeItems],
      },
    })
    toast.add({ title: 'Программа сохранена', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message || 'Не удалось сохранить', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
