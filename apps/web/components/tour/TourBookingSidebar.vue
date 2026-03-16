<template>
  <!-- Desktop: Sticky sidebar -->
  <div class="hidden lg:block self-start sticky top-24 max-h-[calc(100vh-120px)]">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Price row -->
      <div class="flex items-center divide-x divide-gray-200">
        <!-- Price -->
        <div class="flex-1 p-5">
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900">
              {{ formatPrice(tour.priceFrom) }}
            </span>
            <span v-if="tour.discountPercent" class="text-base text-gray-400 line-through">
              {{ formatPrice(originalPrice) }}
            </span>
          </div>
          <a href="#includes" class="text-emerald-500 text-xs font-medium hover:underline">Что включено</a>
        </div>

        <!-- Date -->
        <div v-if="nextDeparture" class="flex-1 p-5">
          <div class="text-base font-bold text-gray-900">
            {{ formatDateRange(nextDeparture.startDate, nextDeparture.endDate) }}
          </div>
          <div class="text-xs text-gray-500 mt-0.5">
            ({{ nextDeparture.spotsLeft }} {{ pluralize(nextDeparture.spotsLeft, 'место', 'места', 'мест') }})
          </div>
        </div>
      </div>

      <!-- Book button -->
      <div class="px-5 pb-5">
        <button
          @click="showDesktopForm = !showDesktopForm"
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-full font-semibold text-base transition-colors"
        >
          Забронировать
        </button>
        <p class="text-xs text-gray-400 text-center mt-2">Не требует оплаты сейчас</p>
      </div>

      <!-- Form (expandable) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[600px] opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="max-h-[600px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-show="showDesktopForm" class="overflow-hidden border-t border-gray-100">
          <div class="p-5">
            <!-- Departure select -->
            <div v-if="activeDepartures.length > 1" class="mb-4">
              <label class="text-sm text-gray-600 mb-1 block">Выберите дату</label>
              <select
                v-model="selectedDepartureId"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option v-for="dep in activeDepartures" :key="dep.id" :value="dep.id">
                  {{ formatDateRange(dep.startDate, dep.endDate) }} — {{ formatPrice(dep.price) }}
                </option>
              </select>
            </div>

            <form v-if="!isSuccess" @submit.prevent="handleSubmit" class="space-y-3">
              <input
                v-model="form.name"
                type="text"
                placeholder="Ваше имя"
                required
                class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="+7 (000) 000-00-00"
                required
                class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              <div class="flex items-start gap-2">
                <input
                  id="privacy-sidebar"
                  v-model="form.privacyAccepted"
                  type="checkbox"
                  required
                  class="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label for="privacy-sidebar" class="text-xs text-gray-500">
                  Согласие на <NuxtLink to="/privacy" class="text-emerald-500 hover:underline">обработку данных</NuxtLink>
                </label>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white py-3.5 rounded-full font-semibold transition-colors"
              >
                {{ isSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
              </button>
            </form>

            <!-- Success -->
            <div v-else class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <div class="text-emerald-700 font-medium">Заявка отправлена!</div>
              <div class="text-emerald-600 text-sm mt-1">Мы скоро свяжемся с вами</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <!-- Mobile: Fixed bottom bar -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 safe-area-bottom">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-baseline gap-1.5">
          <span class="text-xl font-extrabold text-gray-900">{{ formatPrice(tour.priceFrom) }}</span>
          <span v-if="tour.discountPercent" class="text-sm text-gray-400 line-through">{{ formatPrice(originalPrice) }}</span>
        </div>
        <div v-if="nextDeparture" class="text-xs text-gray-500">{{ formatDateRange(nextDeparture.startDate, nextDeparture.endDate) }}</div>
      </div>
      <button
        @click="showMobileForm = true"
        class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
      >
        Забронировать
      </button>
    </div>
  </div>

  <!-- Mobile: Modal form -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showMobileForm" class="lg:hidden fixed inset-0 z-[60] bg-black/50 flex items-end">
        <div class="w-full bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Забронировать</h3>
            <button @click="showMobileForm = false" class="p-1 text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Price in modal -->
          <div class="mb-4">
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-extrabold text-gray-900">{{ formatPrice(tour.priceFrom) }}</span>
              <span v-if="tour.discountPercent" class="text-base text-gray-400 line-through">{{ formatPrice(originalPrice) }}</span>
            </div>
          </div>

          <!-- Departure select in modal -->
          <div v-if="activeDepartures.length" class="mb-4">
            <select
              v-model="selectedDepartureId"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option v-for="dep in activeDepartures" :key="dep.id" :value="dep.id">
                {{ formatDateRange(dep.startDate, dep.endDate) }} — {{ formatPrice(dep.price) }}
              </option>
            </select>
          </div>

          <!-- Form in modal -->
          <form v-if="!isSuccess" @submit.prevent="handleSubmit" class="space-y-3">
            <input v-model="form.name" type="text" placeholder="Ваше имя" required class="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input v-model="form.phone" type="tel" placeholder="+7 (000) 000-00-00" required class="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input v-model="form.email" type="email" placeholder="Email" class="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />

            <div class="flex items-start gap-2">
              <input id="privacy-mobile" v-model="form.privacyAccepted" type="checkbox" required class="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              <label for="privacy-mobile" class="text-xs text-gray-500">
                Согласие на <NuxtLink to="/privacy" class="text-emerald-500 hover:underline">обработку данных</NuxtLink>
              </label>
            </div>

            <button type="submit" :disabled="isSubmitting" class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white py-3.5 rounded-full font-semibold transition-colors">
              {{ isSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
            </button>
          </form>

          <div v-else class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <div class="text-emerald-700 font-medium">Заявка отправлена!</div>
            <div class="text-emerald-600 text-sm mt-1">Мы скоро свяжемся с вами</div>
          </div>

          <p class="text-xs text-gray-400 text-center mt-3">Не требует оплаты сейчас</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Tour, Departure } from '~/types/tour'

const props = defineProps<{
  tour: Tour
  departures?: Departure[]
}>()

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '\u20AC',
  RUB: '\u20BD',
}

const showDesktopForm = ref(false)
const showMobileForm = ref(false)
const selectedDepartureId = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
})

const activeDepartures = computed(() =>
  (props.departures || []).filter(d => d.status === 'active' && d.spotsLeft > 0)
)

const nextDeparture = computed(() => activeDepartures.value[0])

watchEffect(() => {
  if (activeDepartures.value.length && !selectedDepartureId.value) {
    selectedDepartureId.value = activeDepartures.value[0].id
  }
})

const originalPrice = computed(() => {
  if (!props.tour.priceFrom || !props.tour.discountPercent) return 0
  return Math.round(Number(props.tour.priceFrom) / (1 - props.tour.discountPercent / 100))
})

function formatPrice(price: number | string | undefined): string {
  if (!price) return ''
  const num = Number(price)
  const symbol = currencySymbols[props.tour.currency] || props.tour.currency
  return `${symbol}${num.toLocaleString('ru-RU')}`
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const sDay = s.getDate()
  const eDay = e.getDate()
  const sMonth = s.toLocaleDateString('ru-RU', { month: 'long' })
  const eMonth = e.toLocaleDateString('ru-RU', { month: 'long' })
  const year = s.getFullYear()

  if (sMonth === eMonth) {
    return `${sDay} \u2014 ${eDay} ${sMonth} ${year}`
  }
  return `${sDay} ${s.toLocaleDateString('ru-RU', { month: 'short' })} \u2014 ${eDay} ${e.toLocaleDateString('ru-RU', { month: 'short' })} ${year}`
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

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
        departureId: selectedDepartureId.value || undefined,
        consent: true,
        source: 'booking_sidebar',
        pageUrl: window.location.href,
      },
    })

    isSuccess.value = true
    showMobileForm.value = false
    showDesktopForm.value = false
    form.name = ''
    form.phone = ''
    form.email = ''
    form.privacyAccepted = false

    setTimeout(() => { isSuccess.value = false }, 5000)
  } catch (error) {
    console.error('Submit failed:', error)
    alert('Произошла ошибка. Попробуйте позже.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>
