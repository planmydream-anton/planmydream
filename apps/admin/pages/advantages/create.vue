<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/advantages" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Новое преимущество</h1>
    </div>
    <UCard>
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Название" name="title" required>
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        <UFormField label="Описание" name="description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Иконка" name="icon">
            <UInput v-model="state.icon" placeholder="shield-check" class="w-full" />
          </UFormField>
          <UFormField label="Позиция" name="position">
            <UInput v-model.number="state.position" type="number" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/advantages" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Создать</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const toast = useToast()
const saving = ref(false)
const state = reactive({ title: '', description: '', icon: '', position: 0, isActive: true })
async function onSubmit() {
  saving.value = true
  try { await $fetch('/api/admin/advantages', { method: 'POST', body: state }); toast.add({ title: 'Создано', color: 'success' }); await navigateTo('/advantages') }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
  finally { saving.value = false }
}
</script>
