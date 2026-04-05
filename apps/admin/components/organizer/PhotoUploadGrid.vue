<script setup lang="ts">
const props = withDefaults(defineProps<{
  images: string[]
  maxCount?: number
  uploadUrl?: string
  folder?: string
}>(), {
  maxCount: 5,
  uploadUrl: '/api/organizer/upload',
  folder: 'organizer-media',
})

const emit = defineEmits<{
  'update:images': [images: string[]]
}>()

const uploading = ref(false)

async function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  uploading.value = true
  const newImages = [...props.images]

  for (const file of Array.from(input.files)) {
    if (newImages.length >= props.maxCount) break

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', props.folder)

    try {
      const data = await $fetch<{ url: string }>(props.uploadUrl, {
        method: 'POST',
        body: formData,
      })
      newImages.push(data.url)
    }
    catch (e) {
      console.error('Upload error:', e)
    }
  }

  emit('update:images', newImages)
  uploading.value = false
  input.value = ''
}

function removeImage(index: number) {
  const newImages = [...props.images]
  newImages.splice(index, 1)
  emit('update:images', newImages)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="(url, idx) in images"
      :key="url"
      class="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <img :src="url" class="w-full h-full object-cover" alt="">
      <button
        type="button"
        class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
        @click="removeImage(idx)"
      >
        <UIcon name="i-heroicons-trash" class="w-5 h-5 text-white" />
      </button>
    </div>

    <label
      v-if="images.length < maxCount"
      class="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 transition-colors cursor-pointer"
    >
      <UIcon v-if="!uploading" name="i-heroicons-plus" class="w-6 h-6 text-gray-400" />
      <UIcon v-else name="i-heroicons-arrow-path" class="w-6 h-6 text-gray-400 animate-spin" />
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFileSelect"
      >
    </label>
  </div>
</template>
