<script setup lang="ts">
interface Guide {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
  bio?: string | null
}

interface TourGuide {
  name: string
  photo?: string
  bio?: string
  guideId?: string
}

const props = defineProps<{
  modelValue: TourGuide[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TourGuide[]]
}>()

const showModal = ref(false)
const activeTab = ref('select')
const guides = ref<Guide[]>([])
const loadingGuides = ref(false)

// New guide form
const newGuide = reactive({
  firstName: '',
  lastName: '',
  bio: '',
})
const creatingGuide = ref(false)

async function loadGuides() {
  loadingGuides.value = true
  try {
    const data = await $fetch<{ guides: Guide[] }>('/api/organizer/guides')
    guides.value = data.guides
  }
  catch (e) {
    console.error('Error loading guides:', e)
  }
  loadingGuides.value = false
}

function openModal() {
  showModal.value = true
  loadGuides()
}

function selectGuide(guide: Guide) {
  const exists = props.modelValue.some(g => g.guideId === guide.id)
  if (exists) return

  const updated = [...props.modelValue, {
    name: `${guide.firstName} ${guide.lastName}`,
    photo: guide.photo || undefined,
    bio: guide.bio || undefined,
    guideId: guide.id,
  }]
  emit('update:modelValue', updated)
  showModal.value = false
}

async function createAndSelect() {
  if (!newGuide.firstName || !newGuide.lastName) return

  creatingGuide.value = true
  try {
    const data = await $fetch<{ guide: Guide }>('/api/organizer/guides', {
      method: 'POST',
      body: {
        firstName: newGuide.firstName,
        lastName: newGuide.lastName,
        bio: newGuide.bio || null,
      },
    })

    const guide = data.guide
    const updated = [...props.modelValue, {
      name: `${guide.firstName} ${guide.lastName}`,
      photo: guide.photo || undefined,
      bio: guide.bio || undefined,
      guideId: guide.id,
    }]
    emit('update:modelValue', updated)

    newGuide.firstName = ''
    newGuide.lastName = ''
    newGuide.bio = ''
    showModal.value = false
  }
  catch (e) {
    console.error('Error creating guide:', e)
  }
  creatingGuide.value = false
}

function removeGuide(index: number) {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

function isAlreadySelected(guideId: string) {
  return props.modelValue.some(g => g.guideId === guideId)
}
</script>

<template>
  <div>
    <!-- Current guides list -->
    <div v-if="modelValue.length" class="space-y-2 mb-3">
      <div
        v-for="(guide, idx) in modelValue"
        :key="idx"
        class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <UAvatar
          :src="guide.photo"
          :alt="guide.name"
          size="sm"
        />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm truncate">{{ guide.name }}</div>
          <div v-if="guide.bio" class="text-xs text-gray-500 truncate">{{ guide.bio }}</div>
        </div>
        <UButton
          icon="i-heroicons-trash"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="removeGuide(idx)"
        />
      </div>
    </div>

    <UButton
      icon="i-heroicons-plus"
      variant="outline"
      size="sm"
      @click="openModal"
    >
      Добавить гида
    </UButton>

    <!-- Modal -->
    <UModal v-model:open="showModal">
      <template #header>
        <h3 class="text-lg font-semibold">Добавить гида</h3>
      </template>
      <template #body>
        <div class="p-4">
          <!-- Tab switcher -->
          <div class="flex gap-2 mb-4">
            <UButton
              :variant="activeTab === 'select' ? 'solid' : 'outline'"
              size="sm"
              @click="activeTab = 'select'"
            >
              Выбрать из списка
            </UButton>
            <UButton
              :variant="activeTab === 'create' ? 'solid' : 'outline'"
              size="sm"
              @click="activeTab = 'create'"
            >
              Создать нового
            </UButton>
          </div>

          <!-- Select tab -->
          <div v-if="activeTab === 'select'">
            <div v-if="loadingGuides" class="text-center py-8 text-gray-500">
              Загрузка...
            </div>
            <div v-else-if="!guides.length" class="text-center py-8 text-gray-500">
              Нет сохранённых гидов. Создайте нового.
            </div>
            <div v-else class="space-y-2 max-h-64 overflow-auto">
              <button
                v-for="guide in guides"
                :key="guide.id"
                type="button"
                class="flex w-full items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                :disabled="isAlreadySelected(guide.id)"
                @click="selectGuide(guide)"
              >
                <UAvatar
                  :src="guide.photo"
                  :alt="`${guide.firstName} ${guide.lastName}`"
                  size="sm"
                />
                <div class="flex-1 text-left min-w-0">
                  <div class="font-medium text-sm">{{ guide.firstName }} {{ guide.lastName }}</div>
                  <div v-if="guide.bio" class="text-xs text-gray-500 truncate">{{ guide.bio }}</div>
                </div>
                <UBadge v-if="isAlreadySelected(guide.id)" color="neutral" variant="subtle" size="xs">
                  Добавлен
                </UBadge>
              </button>
            </div>
          </div>

          <!-- Create tab -->
          <div v-if="activeTab === 'create'" class="space-y-3">
            <UFormField label="Имя">
              <UInput v-model="newGuide.firstName" placeholder="Имя гида" />
            </UFormField>
            <UFormField label="Фамилия">
              <UInput v-model="newGuide.lastName" placeholder="Фамилия гида" />
            </UFormField>
            <UFormField label="О гиде">
              <UTextarea v-model="newGuide.bio" placeholder="Коротко о гиде" :rows="3" />
            </UFormField>
            <UButton
              :loading="creatingGuide"
              :disabled="!newGuide.firstName || !newGuide.lastName"
              @click="createAndSelect"
            >
              Создать и добавить
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
