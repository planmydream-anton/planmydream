<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/tours" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">{{ tour?.title }} — SEO</h1>
    </div>

    <!-- Sub-navigation -->
    <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
      <UButton :to="`/tours/${id}`" variant="ghost" size="sm">Основное</UButton>
      <UButton :to="`/tours/${id}/program`" variant="ghost" size="sm">Программа</UButton>
      <UButton :to="`/tours/${id}/departures`" variant="ghost" size="sm">Даты</UButton>
      <UButton :to="`/tours/${id}/media`" variant="ghost" size="sm">Медиа</UButton>
      <UButton :to="`/tours/${id}/seo`" variant="soft" size="sm">SEO</UButton>
    </div>

    <UCard v-if="tour">
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="SEO Title" name="seoTitle" hint="Рекомендуется до 60 символов">
          <UInput v-model="state.seoTitle" placeholder="Авторский тур в Китай | PlanMyDream" class="w-full" />
          <template #help>
            <span :class="state.seoTitle.length > 60 ? 'text-orange-500' : 'text-gray-400'">
              {{ state.seoTitle.length }} / 60
            </span>
          </template>
        </UFormField>

        <UFormField label="SEO Description" name="seoDescription" hint="Рекомендуется до 160 символов">
          <UTextarea v-model="state.seoDescription" :rows="3" class="w-full" />
          <template #help>
            <span :class="state.seoDescription.length > 160 ? 'text-orange-500' : 'text-gray-400'">
              {{ state.seoDescription.length }} / 160
            </span>
          </template>
        </UFormField>

        <UFormField label="SEO Keywords" name="seoKeywords">
          <UInput v-model="state.seoKeywords" placeholder="тур в китай, авторские туры, путешествие" class="w-full" />
        </UFormField>

        <UFormField label="OG Image URL" name="ogImageUrl">
          <UInput v-model="state.ogImageUrl" placeholder="https://..." class="w-full" />
        </UFormField>

        <div class="flex justify-end pt-4 border-t">
          <UButton type="submit" :loading="saving">Сохранить SEO</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const toast = useToast()
const saving = ref(false)

const { data: tour, refresh } = await useFetch<any>(`/api/admin/tours/${id}`)

const state = reactive({
  seoTitle: tour.value?.seoTitle || '',
  seoDescription: tour.value?.seoDescription || '',
  seoKeywords: tour.value?.seoKeywords || '',
  ogImageUrl: tour.value?.ogImageUrl || '',
})

async function onSubmit() {
  saving.value = true
  try {
    await $fetch(`/api/admin/tours/${id}`, { method: 'PUT', body: state })
    toast.add({ title: 'SEO сохранено', color: 'success' })
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
