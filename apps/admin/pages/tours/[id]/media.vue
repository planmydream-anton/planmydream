<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — Галерея</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="ghost" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="ghost" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/media`" variant="soft" size="sm">Галерея</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="ghost" size="sm">SEO</UButton>
    </div>

    <!-- Cover image -->
    <UCard class="mb-4">
      <template #header>
        <h3 class="font-semibold">Обложка тура</h3>
      </template>

      <div v-if="coverImage" class="flex items-start gap-4">
        <img :src="coverImage.url" :alt="coverImage.altText || 'Обложка'" class="w-40 h-28 object-cover rounded-lg" />
        <div class="flex-1">
          <p class="text-sm text-gray-600">{{ coverImage.filename }}</p>
          <UButton size="xs" variant="ghost" color="error" class="mt-2" @click="removeCover">Убрать обложку</UButton>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">Обложка не выбрана. Загрузите фото и нажмите ★ чтобы сделать обложкой.</p>
    </UCard>

    <!-- Upload area -->
    <UCard class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Фотографии тура</h3>
          <span class="text-sm text-gray-500">{{ galleryImages.length }} фото</span>
        </div>
      </template>

      <!-- Drag and drop upload -->
      <div
        class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer mb-4"
        :class="isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 dark:border-gray-700'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="fileInput?.click()"
      >
        <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <p class="text-gray-600">Перетащите файлы сюда или <span class="text-green-500 font-medium">нажмите для загрузки</span></p>
        <p class="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Максимум 10 МБ на файл</p>
        <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileSelect" />
      </div>

      <!-- Upload progress -->
      <div v-if="uploading" class="mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <div class="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Загрузка {{ uploadProgress }}/{{ uploadTotal }}...
        </div>
      </div>

      <!-- Gallery grid -->
      <div v-if="galleryImages.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          v-for="(img, idx) in galleryImages"
          :key="img.id"
          class="relative group rounded-lg overflow-hidden aspect-[4/3] bg-gray-100"
        >
          <img :src="img.url" :alt="img.altText || ''" class="w-full h-full object-cover" />
          <!-- Overlay with actions -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-yellow-500 hover:text-yellow-600"
              title="Сделать обложкой"
              @click="setCover(img)"
            >★</button>
            <button
              class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-600"
              title="Удалить"
              @click="removeFromGallery(img)"
            >✕</button>
          </div>
          <!-- Position badge -->
          <div class="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
            {{ idx + 1 }}
          </div>
        </div>
      </div>

      <p v-else class="text-sm text-gray-400 text-center py-4">Нет фотографий. Загрузите через форму выше.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()

const { data: tour } = await useFetch<any>(`/api/admin/tours/${id}`)

const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadTotal = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

// Fetch tour media
const { data: mediaData, refresh: refreshMedia } = await useFetch<any[]>(`/api/admin/tours/${id}/media`)

const coverImage = computed(() => (mediaData.value || []).find((m: any) => m.isCover))
const galleryImages = computed(() => (mediaData.value || []).filter((m: any) => !m.isCover))

async function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'))
  if (files.length) await uploadFiles(files)
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length) uploadFiles(files)
  input.value = ''
}

async function uploadFiles(files: File[]) {
  uploading.value = true
  uploadProgress.value = 0
  uploadTotal.value = files.length

  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploaded = await $fetch<any>('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })

      // Link to tour
      await $fetch(`/api/admin/tours/${id}/media`, {
        method: 'POST',
        body: {
          mediaId: uploaded.id,
          isCover: false,
        },
      })

      uploadProgress.value++
    } catch (err) {
      console.error('Upload failed:', err)
      toast.add({ title: `Ошибка загрузки ${file.name}`, color: 'error' })
    }
  }

  uploading.value = false
  refreshMedia()
  toast.add({ title: `Загружено ${uploadProgress.value} фото`, color: 'success' })
}

async function setCover(img: any) {
  try {
    await $fetch(`/api/admin/tours/${id}/media/set-cover`, {
      method: 'POST',
      body: { mediaId: img.mediaId || img.id },
    })
    refreshMedia()
    toast.add({ title: 'Обложка обновлена', color: 'success' })
  } catch {
    toast.add({ title: 'Ошибка', color: 'error' })
  }
}

async function removeCover() {
  if (!coverImage.value) return
  try {
    await $fetch(`/api/admin/tours/${id}/media/set-cover`, {
      method: 'POST',
      body: { mediaId: coverImage.value.mediaId || coverImage.value.id, remove: true },
    })
    refreshMedia()
  } catch {
    toast.add({ title: 'Ошибка', color: 'error' })
  }
}

async function removeFromGallery(img: any) {
  try {
    await $fetch(`/api/admin/tours/${id}/media`, {
      method: 'DELETE',
      body: { mediaId: img.mediaId || img.id },
    })
    refreshMedia()
  } catch {
    toast.add({ title: 'Ошибка удаления', color: 'error' })
  }
}
</script>
