<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/destinations" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Новое направление</h1>
    </div>
    <UCard>
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Название" name="name" required>
            <UInput v-model="state.name" placeholder="Китай" class="w-full" @blur="generateSlug" />
          </UFormField>
          <UFormField label="Slug" name="slug" required>
            <UInput v-model="state.slug" placeholder="china" class="w-full" />
          </UFormField>
          <UFormField label="Страна" name="country">
            <UInput v-model="state.country" placeholder="Китай" class="w-full" />
          </UFormField>
          <UFormField label="Статус" name="status">
            <USelect v-model="state.status" :items="[{label:'Черновик',value:'draft'},{label:'Опубликовано',value:'published'}]" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Описание" name="description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="URL обложки" name="coverImageUrl">
          <UInput v-model="state.coverImageUrl" placeholder="https://..." class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/destinations" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Создать</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const toast = useToast()
const saving = ref(false)
const state = reactive({ name: '', slug: '', country: '', description: '', coverImageUrl: '', status: 'draft', seoTitle: '', seoDescription: '' })
function generateSlug() {
  if (state.slug) return
  state.slug = state.name.toLowerCase().replace(/[^a-z0-9а-яё]+/g, '-').replace(/^-|-$/g, '')
}
async function onSubmit() {
  saving.value = true
  try { await $fetch('/api/admin/destinations', { method: 'POST', body: state }); toast.add({ title: 'Создано', color: 'success' }); await navigateTo('/destinations') }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
  finally { saving.value = false }
}
</script>
