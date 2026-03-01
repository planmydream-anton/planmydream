<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/team" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Добавить организатора</h1>
    </div>
    <UCard>
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Имя" name="name" required>
            <UInput v-model="state.name" placeholder="Антон Иванов" class="w-full" />
          </UFormField>
          <UFormField label="Роль" name="role" required>
            <UInput v-model="state.role" placeholder="Автор туров" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Описание" name="bio">
          <UTextarea v-model="state.bio" :rows="4" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="URL фото" name="photoUrl">
            <UInput v-model="state.photoUrl" placeholder="https://..." class="w-full" />
          </UFormField>
          <UFormField label="Позиция" name="position">
            <UInput v-model.number="state.position" type="number" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/team" variant="ghost">Отмена</UButton>
          <UButton type="submit" :loading="saving">Создать</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const saving = ref(false)
const state = reactive({ name: '', role: '', bio: '', photoUrl: '', position: 0, isActive: true })

async function onSubmit() {
  saving.value = true
  try {
    await $fetch('/api/admin/team', { method: 'POST', body: state })
    toast.add({ title: 'Организатор создан', color: 'success' })
    await navigateTo('/team')
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  } finally { saving.value = false }
}
</script>
