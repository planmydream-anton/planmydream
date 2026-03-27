<template>
  <div>
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold text-center">Регистрация организатора</h2>
        <p class="text-sm text-gray-500 text-center mt-1">Создайте аккаунт для управления турами</p>
      </template>

      <UForm :schema="registerOrganizerSchema" :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Имя" name="firstName">
            <UInput v-model="state.firstName" placeholder="Иван" class="w-full" />
          </UFormField>

          <UFormField label="Фамилия" name="lastName">
            <UInput v-model="state.lastName" placeholder="Иванов" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="ivan@example.com" icon="i-heroicons-envelope" class="w-full" />
        </UFormField>

        <UFormField label="Телефон" name="phone">
          <UInput v-model="state.phone" type="tel" placeholder="+7 (999) 123-45-67" icon="i-heroicons-phone" class="w-full" />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput v-model="state.password" type="password" placeholder="Минимум 8 символов" icon="i-heroicons-lock-closed" class="w-full" />
        </UFormField>

        <UFormField label="Подтвердите пароль" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" placeholder="Повторите пароль" icon="i-heroicons-lock-closed" class="w-full" />
        </UFormField>

        <div class="space-y-3">
          <UFormField name="consentOffer">
            <label class="flex items-start gap-2 cursor-pointer">
              <UCheckbox v-model="state.consentOffer" />
              <span class="text-sm text-gray-600">
                Принимаю условия <a href="#" class="text-emerald-600 hover:underline">Публичной оферты</a> и <a href="#" class="text-emerald-600 hover:underline">Договора организатора</a>
              </span>
            </label>
          </UFormField>

          <UFormField name="consentPrivacy">
            <label class="flex items-start gap-2 cursor-pointer">
              <UCheckbox v-model="state.consentPrivacy" />
              <span class="text-sm text-gray-600">
                Согласен на <a href="#" class="text-emerald-600 hover:underline">обработку персональных данных</a>
              </span>
            </label>
          </UFormField>
        </div>

        <UButton type="submit" block :loading="loading" size="lg" color="emerald">
          Зарегистрироваться
        </UButton>
      </UForm>

      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">
        {{ error }}
      </p>

      <template #footer>
        <p class="text-sm text-center text-gray-500">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="text-emerald-600 hover:underline font-medium">Войти</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { registerOrganizerSchema } from '@planmydream/shared/validators'

definePageMeta({
  layout: 'auth',
})

const { register } = useAuth()
const loading = ref(false)
const error = ref('')

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  consentOffer: false,
  consentPrivacy: false,
})

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    await register(state)
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>
