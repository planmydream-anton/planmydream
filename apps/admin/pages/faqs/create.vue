<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/faqs" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Новый FAQ</h1>
    </div>
    <UCard>
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Вопрос" name="question" required>
          <UTextarea v-model="state.question" :rows="2" class="w-full" />
        </UFormField>
        <UFormField label="Ответ" name="answer" required>
          <UTextarea v-model="state.answer" :rows="4" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Категория" name="category">
            <UInput v-model="state.category" placeholder="Общие, Бронирование..." class="w-full" />
          </UFormField>
          <UFormField label="Позиция" name="position">
            <UInput v-model.number="state.position" type="number" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/faqs" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Создать</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const toast = useToast()
const saving = ref(false)
const state = reactive({ question: '', answer: '', category: '', position: 0 })
async function onSubmit() {
  saving.value = true
  try { await $fetch('/api/admin/faqs', { method: 'POST', body: state }); toast.add({ title: 'FAQ создан', color: 'success' }); await navigateTo('/faqs') }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
  finally { saving.value = false }
}
</script>
