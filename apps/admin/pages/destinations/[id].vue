<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/destinations" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Редактирование: {{ item?.name }}</h1>
    </div>
    <UCard v-if="item">
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Название" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Slug" name="slug" required>
            <UInput v-model="state.slug" class="w-full" />
          </UFormField>
          <UFormField label="Страна" name="country">
            <UInput v-model="state.country" class="w-full" />
          </UFormField>
          <UFormField label="Статус" name="status">
            <USelect v-model="state.status" :items="[{label:'Черновик',value:'draft'},{label:'Опубликовано',value:'published'}]" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Описание" name="description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="URL обложки" name="coverImageUrl">
          <UInput v-model="state.coverImageUrl" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/destinations" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Сохранить</UButton>
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
const { data: item } = await useFetch<any>(`/api/admin/destinations/${id}`)
const state = reactive({
  name: item.value?.name || '', slug: item.value?.slug || '', country: item.value?.country || '',
  description: item.value?.description || '', coverImageUrl: item.value?.coverImageUrl || '',
  status: item.value?.status || 'draft', seoTitle: item.value?.seoTitle || '', seoDescription: item.value?.seoDescription || '',
})
async function onSubmit() {
  saving.value = true
  try { await $fetch(`/api/admin/destinations/${id}`, { method: 'PUT', body: state }); toast.add({ title: 'Сохранено', color: 'success' }) }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
  finally { saving.value = false }
}
</script>
