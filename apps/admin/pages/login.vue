<template>
  <div>
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold text-center">Вход в панель управления</h2>
      </template>

      <UForm :schema="loginSchema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="admin@planmydream.ru" icon="i-heroicons-envelope" class="w-full" />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput v-model="state.password" type="password" placeholder="Введите пароль" icon="i-heroicons-lock-closed" class="w-full" />
        </UFormField>

        <UButton type="submit" block :loading="loading" size="lg">
          Войти
        </UButton>
      </UForm>

      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">
        {{ error }}
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { loginSchema } from '@planmydream/shared/validators'

definePageMeta({
  layout: 'auth',
})

const { login } = useAuth()
const loading = ref(false)
const error = ref('')

const state = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    await login(state.email, state.password)
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Ошибка авторизации'
  } finally {
    loading.value = false
  }
}
</script>
