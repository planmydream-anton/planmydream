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
      <UButton :to="`/tours/${id}/media`" variant="ghost" size="sm">Медиа</UButton>
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
              <UInput v-model="highlight.imageUrl" placeholder="URL изображения" />
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

const programDays = reactive<Array<{ day: number; title: string; content: string }>>(
  tour.value?.program || []
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

function addHighlight() {
  highlights.push({ title: '', description: '', imageUrl: '' })
}

function addProgramDay() {
  const nextDay = programDays.length > 0 ? Math.max(...programDays.map(d => d.day)) + 1 : 1
  programDays.push({ day: nextDay, title: '', content: '' })
}

function addInclude() {
  includeItems.push({ category: 'other', text: '' })
}

async function saveAll() {
  saving.value = true
  try {
    await $fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      body: {
        highlights: [...highlights],
        program: [...programDays],
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
