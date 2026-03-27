<template>
  <div class="space-y-6 max-w-2xl">
    <!-- Change password -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Смена пароля</h3>
      </template>
      <div class="space-y-4">
        <UFormField label="Текущий пароль">
          <UInput v-model="passwordForm.currentPassword" type="password" class="w-full" />
        </UFormField>
        <UFormField label="Новый пароль">
          <UInput v-model="passwordForm.newPassword" type="password" class="w-full" />
        </UFormField>
        <UFormField label="Подтвердите новый пароль">
          <UInput v-model="passwordForm.confirmPassword" type="password" class="w-full" />
        </UFormField>
        <UButton @click="changePassword" :loading="changingPassword" color="emerald">
          Сменить пароль
        </UButton>
      </div>
    </UCard>

    <!-- Notifications -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Уведомления</h3>
      </template>
      <div class="space-y-4">
        <label class="flex items-center justify-between">
          <div>
            <p class="font-medium text-sm">Уведомления о заявках</p>
            <p class="text-xs text-gray-500">Получать уведомления при поступлении новых заявок</p>
          </div>
          <UToggle v-model="notifications.inquiries" @update:model-value="saveNotifications" />
        </label>
        <label class="flex items-center justify-between">
          <div>
            <p class="font-medium text-sm">Уведомления об акциях</p>
            <p class="text-xs text-gray-500">Получать информацию о промоакциях платформы</p>
          </div>
          <UToggle v-model="notifications.promotions" @update:model-value="saveNotifications" />
        </label>
      </div>
    </UCard>

    <!-- Messenger integrations -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Мессенджеры</h3>
      </template>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-blue-600 text-sm font-bold">T</span>
            </div>
            <div>
              <p class="font-medium text-sm">Telegram</p>
              <p class="text-xs text-gray-500">{{ profile?.telegramChatId ? 'Подключён' : 'Не подключён' }}</p>
            </div>
          </div>
          <UButton variant="soft" size="xs" disabled>Подключить</UButton>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-blue-600 text-sm font-bold">VK</span>
            </div>
            <div>
              <p class="font-medium text-sm">ВКонтакте</p>
              <p class="text-xs text-gray-500">{{ profile?.vkId ? 'Подключён' : 'Не подключён' }}</p>
            </div>
          </div>
          <UButton variant="soft" size="xs" disabled>Подключить</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'organizer',
})

const toast = useToast()

const { data } = await useFetch('/api/organizer/profile')
const profile = computed(() => data.value?.profile)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)

const notifications = reactive({
  inquiries: true,
  promotions: false,
})

watch(profile, (p) => {
  if (!p) return
  notifications.inquiries = p.notifyInquiries
  notifications.promotions = p.notifyPromotions
}, { immediate: true })

async function changePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({ title: 'Пароли не совпадают', color: 'error' })
    return
  }
  if (passwordForm.newPassword.length < 8) {
    toast.add({ title: 'Пароль должен быть минимум 8 символов', color: 'error' })
    return
  }

  changingPassword.value = true
  try {
    await $fetch('/api/organizer/profile/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    })
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    toast.add({ title: 'Пароль изменён', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Ошибка смены пароля', color: 'error' })
  } finally {
    changingPassword.value = false
  }
}

async function saveNotifications() {
  try {
    await $fetch('/api/organizer/profile', {
      method: 'PUT',
      body: {
        notifyInquiries: notifications.inquiries,
        notifyPromotions: notifications.promotions,
      },
    })
  } catch {
    // silently fail
  }
}
</script>
