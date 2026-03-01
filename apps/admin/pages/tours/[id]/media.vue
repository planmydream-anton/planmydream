<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — Медиа</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="ghost" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="ghost" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/media`" variant="soft" size="sm">Медиа</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="ghost" size="sm">SEO</UButton>
    </div>

    <UCard>
      <template #header>
        <h3 class="font-semibold">Галерея тура</h3>
      </template>

      <p class="text-sm text-gray-500 mb-4">
        Управление медиа-файлами будет доступно после настройки Vercel Blob хранилища.
        Добавьте переменную <code>BLOB_READ_WRITE_TOKEN</code> в Vercel.
      </p>

      <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p class="text-gray-500">Перетащите файлы сюда или нажмите для загрузки</p>
        <UButton class="mt-3" variant="soft" disabled>
          Загрузить файлы
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: tour } = await useFetch<any>(`/api/admin/tours/${id}`)
</script>
