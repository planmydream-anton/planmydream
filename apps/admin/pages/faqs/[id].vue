<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/faqs" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Редактирование FAQ</h1>
    </div>
    <UCard v-if="item">
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Вопрос" name="question" required>
          <UTextarea v-model="state.question" :rows="2" class="w-full" />
        </UFormField>
        <UFormField label="Ответ" name="answer" required>
          <UTextarea v-model="state.answer" :rows="4" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Категория" name="category">
            <UInput v-model="state.category" class="w-full" />
          </UFormField>
          <UFormField label="Позиция" name="position">
            <UInput v-model.number="state.position" type="number" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/faqs" variant="ghost">Отмена</UButton>
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
const { data: item } = await useFetch<any>(`/api/admin/faqs/${id}`)
const state = reactive({
  question: item.value?.question || '', answer: item.value?.answer || '',
  category: item.value?.category || '', position: item.value?.position || 0,
})
async function onSubmit() {
  saving.value = true
  try { await $fetch(`/api/admin/faqs/${id}`, { method: 'PUT', body: state }); toast.add({ title: 'Сохранено', color: 'success' }) }
  catch (e: any) { toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' }) }
  finally { saving.value = false }
}
</script>
