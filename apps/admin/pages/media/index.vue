<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Медиа-библиотека</h1>
      <div class="flex gap-2">
        <USelect v-model="filterType" :items="typeOptions" class="w-40" />
        <UButton icon="i-heroicons-arrow-up-tray" label="Загрузить" @click="triggerUpload" />
      </div>
    </div>

    <!-- Upload area -->
    <input ref="fileInput" type="file" multiple accept="image/*,video/*" class="hidden" @change="handleFiles" />

    <UCard v-if="uploading" class="mb-6">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-primary" />
        <span>Загрузка {{ uploadProgress }} из {{ uploadTotal }}...</span>
      </div>
    </UCard>

    <!-- Drop zone when empty -->
    <div
      v-if="!items?.length && !loading"
      class="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-primary transition-colors"
      @click="triggerUpload"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-primary bg-primary/5': dragOver }"
    >
      <UIcon name="i-heroicons-cloud-arrow-up" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-600 mb-2">Перетащите файлы сюда</h3>
      <p class="text-gray-400">или нажмите для выбора файлов</p>
      <p class="text-sm text-gray-400 mt-2">Поддерживаемые форматы: JPG, PNG, WebP, MP4</p>
    </div>

    <!-- Media grid -->
    <div v-else-if="items?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <!-- Upload button card -->
      <div
        class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        @click="triggerUpload"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        :class="{ 'border-primary bg-primary/5': dragOver }"
      >
        <UIcon name="i-heroicons-plus" class="w-8 h-8 text-gray-400" />
        <span class="text-xs text-gray-400 mt-1">Загрузить</span>
      </div>

      <!-- Media items -->
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
        @click="selectItem(item)"
      >
        <img
          v-if="item.type === 'image'"
          :src="item.url"
          :alt="item.altText || item.filename"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <UIcon name="i-heroicons-film" class="w-12 h-12 text-gray-400" />
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
          <div class="w-full p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p class="text-white text-xs truncate">{{ item.originalFilename || item.filename }}</p>
            <p class="text-white/70 text-xs">{{ formatSize(item.sizeBytes) }}</p>
          </div>
        </div>

        <!-- Delete button -->
        <button
          class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1"
          @click.stop="deleteItem(item)"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- Selected item modal -->
    <UModal v-model:open="showDetail">
      <template #content>
        <div v-if="selectedItem" class="p-6">
          <img
            v-if="selectedItem.type === 'image'"
            :src="selectedItem.url"
            class="w-full max-h-96 object-contain rounded-lg mb-4"
          />
          <div class="space-y-2">
            <p class="font-medium">{{ selectedItem.originalFilename }}</p>
            <p class="text-sm text-gray-500">{{ selectedItem.mimeType }} · {{ formatSize(selectedItem.sizeBytes) }}</p>
            <div class="flex items-center gap-2">
              <UInput :model-value="selectedItem.url" readonly class="flex-1" />
              <UButton icon="i-heroicons-clipboard" variant="outline" @click="copyUrl(selectedItem.url)" />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="outline" label="Закрыть" @click="showDetail = false" />
            <UButton color="error" label="Удалить" @click="deleteItem(selectedItem); showDetail = false" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadTotal = ref(0)
const dragOver = ref(false)
const filterType = ref('all')
const showDetail = ref(false)
const selectedItem = ref<any>(null)
const loading = ref(false)
const items = ref<any[]>([])

const typeOptions = [
  { label: 'Все файлы', value: 'all' },
  { label: 'Изображения', value: 'image' },
  { label: 'Видео', value: 'video' },
]

async function fetchMedia() {
  loading.value = true
  try {
    const data = await $fetch('/api/admin/media', {
      params: { type: filterType.value }
    })
    items.value = data as any[]
  } catch (e) {
    console.error('Failed to fetch media:', e)
  } finally {
    loading.value = false
  }
}

watch(filterType, () => fetchMedia())
onMounted(() => fetchMedia())

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    await uploadFiles(Array.from(input.files))
    input.value = ''
  }
}

async function handleDrop(e: DragEvent) {
  dragOver.value = false
  if (e.dataTransfer?.files?.length) {
    await uploadFiles(Array.from(e.dataTransfer.files))
  }
}

async function uploadFiles(files: File[]) {
  uploading.value = true
  uploadTotal.value = files.length
  uploadProgress.value = 0

  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      await $fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })
      uploadProgress.value++
    } catch (e) {
      console.error('Upload failed:', file.name, e)
    }
  }

  uploading.value = false
  await fetchMedia()
}

function selectItem(item: any) {
  selectedItem.value = item
  showDetail.value = true
}

async function deleteItem(item: any) {
  if (!confirm(`Удалить ${item.originalFilename || item.filename}?`)) return
  try {
    await $fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' })
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (e) {
    console.error('Delete failed:', e)
  }
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
}

function formatSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>
