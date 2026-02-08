<template>
  <section class="py-16 md:py-24 bg-gradient-to-br from-orange-500 to-orange-600">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <!-- Left: Text -->
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Готов отправиться туда, где ещё не был?
            </h2>
            <p class="text-white/80 mb-6">
              Если у вас остались вопросы, то мы рады будем ответить, рассказать и помочь выбрать тур
            </p>
            
            <!-- Contact info -->
            <div class="space-y-4">
              <a 
                href="tel:+79315530887" 
                class="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +7 (931) 553 0887
              </a>
              <a 
                href="tel:+74951486416" 
                class="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +7 (495) 148 6416
              </a>
              <a 
                href="mailto:info@planmydream.ru" 
                class="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@planmydream.ru
              </a>
            </div>

            <!-- Social links -->
            <div class="flex gap-4 mt-6">
              <a 
                href="https://wa.me/79857325804" 
                target="_blank"
                class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/planmydream" 
                target="_blank"
                class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
              <a 
                href="https://vk.com/planmydream" 
                target="_blank"
                class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.003-1.49-1.139-1.744-1.139-.356 0-.458.102-.458.593v1.565c0 .422-.135.677-1.253.677-1.846 0-3.896-1.118-5.335-3.202-2.167-3.036-2.76-5.335-2.76-5.812 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.779.677.86 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .779.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.048.17.491-.085.745-.576.745z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="bg-white rounded-2xl p-6 md:p-8">
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ваше имя"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors"
                />
              </div>
              
              <div>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Телефон"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors"
                />
              </div>
              
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors"
                />
              </div>
              
              <div>
                <textarea
                  v-model="form.message"
                  placeholder="Комментарий"
                  rows="3"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-colors resize-none"
                />
              </div>

              <div class="flex items-start gap-2">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  required
                  id="consent"
                  class="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label for="consent" class="text-sm text-gray-600">
                  Я даю согласие на 
                  <NuxtLink to="/privacy" class="text-orange-500 hover:underline">обработку персональных данных</NuxtLink>
                  в соответствии с 
                  <NuxtLink to="/conf-policy" class="text-orange-500 hover:underline">политикой конфиденциальности</NuxtLink>
                </label>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
              </button>

              <!-- Success message -->
              <div v-if="isSuccess" class="text-green-600 text-center">
                ✓ Спасибо! Мы свяжемся с вами в ближайшее время.
              </div>

              <!-- Error message -->
              <div v-if="error" class="text-red-600 text-center text-sm">
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref('')

async function submitForm() {
  if (!form.consent) {
    error.value = 'Необходимо согласие на обработку данных'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    await $fetch('/api/inquiries', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        source: 'contact_form',
      },
    })

    isSuccess.value = true
    // Reset form
    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
    form.consent = false

    // Hide success message after 5 seconds
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  } catch (e) {
    error.value = 'Произошла ошибка. Попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
