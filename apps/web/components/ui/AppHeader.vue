<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Plan My Dream"
            class="h-8 md:h-10 w-auto"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-8">
          <NuxtLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Phone numbers -->
        <div class="hidden md:flex items-center gap-6">
          <div class="text-right">
            <a href="tel:+79315530887" class="flex items-center gap-1.5 text-gray-900 text-sm font-medium hover:text-emerald-600 transition-colors">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (931) 553 08 87
            </a>
            <a href="tel:+74951486416" class="flex items-center gap-1.5 text-gray-500 text-xs hover:text-emerald-600 transition-colors mt-0.5">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (495) 148 64 16
            </a>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden text-gray-700 p-2"
          aria-label="Меню"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-white border-t border-gray-100 shadow-lg"
      >
        <nav class="container mx-auto px-4 py-4 space-y-3">
          <NuxtLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="block text-gray-700 hover:text-gray-900 py-2 text-base"
            @click="isMobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>

          <div class="pt-4 border-t border-gray-100 space-y-2">
            <a href="tel:+79315530887" class="flex items-center gap-2 text-gray-900 text-base">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (931) 553 08 87
            </a>
            <a href="tel:+74951486416" class="flex items-center gap-2 text-gray-500 text-base">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (495) 148 64 16
            </a>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Актуальные туры', href: '/tours' },
  { label: 'Преимущества', href: '/#advantages' },
  { label: 'Отзывы', href: '/reviews' },
  { label: 'О нас', href: '/about' },
  { label: 'Фотоотчеты', href: '/memories' },
  { label: 'FAQ', href: '/faq' },
]

const { openModal } = useInquiryModal()

function openInquiryModal() {
  isMobileMenuOpen.value = false
  openModal()
}

// Закрываем мобильное меню при изменении роута
const route = useRoute()
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>
