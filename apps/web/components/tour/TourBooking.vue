<template>
  <section id="booking" class="py-16 md:py-24 bg-zinc-900">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 md:p-12 border border-white/10">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- Left: Price & Dates -->
            <div>
              <div class="text-orange-400 font-medium mb-2">Стоимость тура</div>
              <div class="text-5xl md:text-6xl font-bold text-white mb-4">
                ${{ tour.priceFrom?.toLocaleString() }}
              </div>
              <div class="text-white/60 mb-6">
                Длительность: {{ tour.durationDays }} {{ pluralize(tour.durationDays, 'день', 'дня', 'дней') }}
              </div>

              <!-- Departures -->
              <div v-if="departures?.length" class="space-y-3">
                <div class="text-white font-medium mb-2">Ближайшие даты:</div>
                <div 
                  v-for="departure in departures.slice(0, 3)" 
                  :key="departure.id"
                  class="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                >
                  <div>
                    <div class="text-white font-medium">
                      {{ formatDateRange(departure.startDate, departure.endDate) }}
                    </div>
                    <div class="text-white/50 text-sm">
                      {{ departure.spotsLeft }} {{ pluralize(departure.spotsLeft, 'место', 'места', 'мест') }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-white font-bold">${{ departure.price.toLocaleString() }}</div>
                    <span 
                      v-if="departure.status === 'sold_out'"
                      class="text-red-400 text-sm"
                    >
                      Мест нет
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Form -->
            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 class="text-xl font-bold text-white mb-2">
                Забронировать место
              </h3>
              <p class="text-white/60 text-sm mb-6">
                Оставьте заявку и мы свяжемся с вами
              </p>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ваше имя"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />
                
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Телефон"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />
                
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                />

                <div class="flex items-start gap-3">
                  <input 
                    id="privacy-booking" 
                    v-model="form.privacyAccepted"
                    type="checkbox" 
                    required
                    class="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                  />
                  <label for="privacy-booking" class="text-white/60 text-sm">
                    Я даю согласие на 
                    <NuxtLink to="/privacy" class="text-orange-400 hover:underline">обработку персональных данных</NuxtLink>
                  </label>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-4 rounded-xl font-medium transition-colors"
                >
                  {{ isSubmitting ? 'Отправляем...' : 'Хочу в тур' }}
                </button>
              </form>

              <!-- Success -->
              <div v-if="isSuccess" class="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div class="text-green-400 font-medium">Заявка отправлена!</div>
                <div class="text-white/60 text-sm">Мы скоро свяжемся с вами</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Tour, Departure } from '~/types/tour'

const props = defineProps<{
  tour: Tour
  departures?: Departure[]
}>()

const form = reactive({
  name: '',
  phone: '',
  email: '',
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
        tourId: props.tour.id,
        source: 'booking_form',
        pageUrl: window.location.href,
      },
    })
    
    isSuccess.value = true
    form.name = ''
    form.phone = ''
    form.email = ''
    form.privacyAccepted = false
    
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Failed to submit:', error)
    alert('Произошла ошибка. Попробуйте позже.')
  } finally {
    isSubmitting.value = false
  }
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const month = startDate.toLocaleDateString('ru-RU', { month: 'short' })
  const year = startDate.getFullYear()
  
  return `${startDay}–${endDay} ${month} ${year}`
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
</script>
