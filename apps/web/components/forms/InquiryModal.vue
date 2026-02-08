<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <!-- Modal -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isOpen"
          class="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <!-- Close button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Закрыть"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-2">
              {{ tourTitle ? 'Заявка на тур' : 'Оставить заявку' }}
            </h2>
            <p class="text-white/60 mb-6">
              {{ tourTitle 
                ? `Тур: ${tourTitle}` 
                : 'Мы свяжемся с вами и ответим на все вопросы' 
              }}
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ваше имя"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              
              <div>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Телефон"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <textarea
                  v-model="form.message"
                  placeholder="Комментарий (необязательно)"
                  rows="3"
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div class="flex items-start gap-3">
                <input 
                  id="privacy" 
                  v-model="form.privacyAccepted"
                  type="checkbox" 
                  required
                  class="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                />
                <label for="privacy" class="text-white/60 text-sm">
                  Я даю согласие на 
                  <NuxtLink to="/privacy" class="text-orange-400 hover:underline">обработку персональных данных</NuxtLink>
                </label>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ isSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
              </button>
            </form>

            <!-- Success message -->
            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <div 
                v-if="isSuccess" 
                class="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-8 text-center"
              >
                <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Заявка отправлена!</h3>
                <p class="text-white/60 mb-6">Мы свяжемся с вами в ближайшее время</p>
                <button 
                  @click="closeModal"
                  class="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOpen, tourId, tourTitle, departureId, closeModal } = useInquiryModal()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  privacyAccepted: false,
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

async function handleSubmit() {
  if (!form.privacyAccepted) return
  
  isSubmitting.value = true
  
  try {
    await $fetch('/api/inquiries', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message || undefined,
        tourId: tourId.value,
        departureId: departureId.value,
        source: 'modal',
        pageUrl: window.location.href,
      },
    })
    
    isSuccess.value = true
    
    // Сбрасываем форму
    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
    form.privacyAccepted = false
    
    // Закрываем через 3 секунды
    setTimeout(() => {
      closeModal()
      isSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to submit inquiry:', error)
    alert('Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.')
  } finally {
    isSubmitting.value = false
  }
}

// Закрытие по Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      closeModal()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
