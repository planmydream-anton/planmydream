<template>
  <div class="space-y-6">
    <!-- Email verification banner -->
    <UAlert
      v-if="user?.organizerProfile && !user.organizerProfile.emailVerified"
      color="amber"
      icon="i-heroicons-exclamation-triangle"
      title="Email не подтверждён"
      description="Подтвердите ваш email для полного доступа к функциям платформы."
    />

    <!-- Verification cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" :class="user?.organizerProfile?.identityVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
            <UIcon :name="user?.organizerProfile?.identityVerified ? 'i-heroicons-check-circle' : 'i-heroicons-identification'" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-sm">Верификация личности</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ user?.organizerProfile?.identityVerified ? 'Личность подтверждена' : 'Загрузите документы для подтверждения' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" :class="user?.organizerProfile?.dataVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
            <UIcon :name="user?.organizerProfile?.dataVerified ? 'i-heroicons-check-circle' : 'i-heroicons-document-check'" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-sm">Проверка данных</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ user?.organizerProfile?.dataVerified ? 'Данные проверены' : 'Заполните профиль для проверки' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
            <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-sm">Поддержка</p>
            <p class="text-xs text-gray-500 mt-0.5">Свяжитесь с нами при возникновении вопросов</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
        </div>
      </UCard>
    </div>

    <!-- Quick actions -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Быстрые действия</h3>
      </template>
      <div class="flex flex-wrap gap-3">
        <UButton to="/o/tours" variant="soft" color="emerald" icon="i-heroicons-map">
          Мои туры
        </UButton>
        <UButton to="/o/inquiries" variant="soft" icon="i-heroicons-inbox">
          Заявки
        </UButton>
        <UButton to="/o/profile" variant="soft" icon="i-heroicons-user">
          Заполнить профиль
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer',
})

const { user } = useAuth()

const { data: statsData } = await useFetch('/api/organizer/stats')

const stats = computed(() => [
  { label: 'Всего туров', value: statsData.value?.totalTours ?? 0 },
  { label: 'Опубликовано', value: statsData.value?.publishedTours ?? 0 },
  { label: 'На модерации', value: statsData.value?.pendingTours ?? 0 },
  { label: 'Заявок', value: statsData.value?.totalInquiries ?? 0 },
])
</script>
