<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/team" icon="i-heroicons-arrow-left" variant="ghost" />
      <h1 class="text-2xl font-bold">Редактирование: {{ item?.name }}</h1>
    </div>
    <UCard v-if="item">
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="Имя" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Роль" name="role" required>
            <UInput v-model="state.role" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Описание" name="bio">
          <UTextarea v-model="state.bio" :rows="4" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="URL фото" name="photoUrl">
            <UInput v-model="state.photoUrl" class="w-full" />
          </UFormField>
          <UFormField label="Позиция" name="position">
            <UInput v-model.number="state.position" type="number" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton to="/team" variant="ghost">Отмена</UButton>
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

const { data: item } = await useFetch<any>(`/api/admin/team/${id}`)

const state = reactive({
  name: item.value?.name || '', role: item.value?.role || '', bio: item.value?.bio || '',
  photoUrl: item.value?.photoUrl || '', position: item.value?.position || 0,
  isActive: !!item.value?.isActive,
})

async function onSubmit() {
  saving.value = true
  try {
    await $fetch(`/api/admin/team/${id}`, { method: 'PUT', body: state })
    toast.add({ title: 'Сохранено', color: 'success' })
  } catch (e: any) {
    toast.add({ title: 'Ошибка', description: e.data?.message, color: 'error' })
  } finally { saving.value = false }
}
</script>
