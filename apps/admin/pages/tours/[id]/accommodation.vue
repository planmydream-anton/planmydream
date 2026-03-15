<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — Размещение</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="ghost" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="ghost" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/accommodation`" variant="soft" size="sm">Размещение</UButton>
      <UButton :to="`/tours/${id}/media`" variant="ghost" size="sm">Медиа</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="ghost" size="sm">SEO</UButton>
    </div>

    <div class="space-y-4">
      <div
        v-for="(acc, idx) in accommodations"
        :key="idx"
      >
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Размещение {{ idx + 1 }}</h3>
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                variant="ghost"
                color="error"
                @click="accommodations.splice(idx, 1)"
              />
            </div>
          </template>

          <div class="space-y-4">
            <!-- Name -->
            <UFormField label="Название">
              <UInput v-model="acc.name" placeholder="Название отеля / жилья" class="w-full" />
            </UFormField>

            <!-- Description -->
            <UFormField label="Описание">
              <UTextarea v-model="acc.description" placeholder="Описание размещения" :rows="3" class="w-full" />
            </UFormField>

            <!-- Images -->
            <UFormField label="Изображения">
              <div class="space-y-2">
                <div
                  v-for="(_, imgIdx) in acc.images"
                  :key="imgIdx"
                  class="flex gap-2 items-center"
                >
                  <UInput
                    v-model="acc.images[imgIdx]"
                    placeholder="https://..."
                    class="flex-1"
                  />
                  <UButton
                    icon="i-heroicons-x-mark"
                    size="xs"
                    variant="ghost"
                    color="error"
                    @click="acc.images.splice(imgIdx, 1)"
                  />
                </div>

                <!-- Thumbnails -->
                <div v-if="acc.images.some(u => u)" class="flex flex-wrap gap-2 mt-2">
                  <template v-for="(url, imgIdx) in acc.images" :key="imgIdx">
                    <img
                      v-if="url"
                      :src="url"
                      :alt="`Фото ${imgIdx + 1}`"
                      class="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                      @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                    />
                  </template>
                </div>

                <UButton
                  icon="i-heroicons-plus"
                  size="xs"
                  variant="soft"
                  @click="acc.images.push('')"
                >
                  Добавить изображение
                </UButton>
              </div>
            </UFormField>

            <!-- Video URL -->
            <UFormField label="Видео URL (необязательно)">
              <UInput
                v-model="acc.videoUrl"
                placeholder="https://youtube.com/..."
                class="w-full"
              />
            </UFormField>
          </div>
        </UCard>
      </div>

      <p v-if="!accommodations.length" class="text-sm text-gray-400 text-center py-8">
        Нет вариантов размещения. Нажмите «Добавить размещение».
      </p>

      <div class="flex items-center justify-between pt-2">
        <UButton
          icon="i-heroicons-plus"
          variant="soft"
          @click="addAccommodation"
        >
          Добавить размещение
        </UButton>

        <UButton :loading="saving" @click="saveAll">
          Сохранить размещение
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Accommodation {
  name: string
  description: string
  images: string[]
  videoUrl?: string
}

const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const saving = ref(false)

const { data: tour, refresh } = await useFetch<any>(`/api/admin/tours/${id}`)

const accommodations = reactive<Accommodation[]>(
  (tour.value?.accommodations || []).map((a: Accommodation) => ({
    ...a,
    images: a.images || [],
    videoUrl: a.videoUrl || '',
  }))
)

function addAccommodation() {
  accommodations.push({ name: '', description: '', images: [], videoUrl: '' })
}

async function saveAll() {
  saving.value = true
  try {
    await $fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      body: {
        accommodations: accommodations.map(a => ({
          name: a.name,
          description: a.description,
          images: a.images.filter(u => u.trim() !== ''),
          ...(a.videoUrl?.trim() ? { videoUrl: a.videoUrl.trim() } : {}),
        })),
      },
    })
    toast.add({ title: 'Размещение сохранено', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message || 'Не удалось сохранить', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
