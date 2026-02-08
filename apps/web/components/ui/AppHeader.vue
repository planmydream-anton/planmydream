<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
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
            class="text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Phone numbers + CTA -->
        <div class="hidden md:flex items-center gap-6">
          <div class="text-right">
            <a href="tel:+79315530887" class="block text-white text-sm hover:text-orange-400 transition-colors">
              +7 (931) 553-08-87
            </a>
            <a href="tel:+74951486416" class="block text-white/70 text-xs hover:text-orange-400 transition-colors">
              +7 (495) 148-64-16
            </a>
          </div>
          
          <button 
            @click="openInquiryModal"
            class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Связаться
          </button>
        </div>

        <!-- Mobile menu button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden text-white p-2"
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
        class="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
      >
        <nav class="container mx-auto px-4 py-4 space-y-3">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.href"
            :to="item.href"
            class="block text-white/80 hover:text-white py-2 text-base"
            @click="isMobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          
          <div class="pt-4 border-t border-white/10 space-y-2">
            <a href="tel:+79315530887" class="block text-white text-base">
              +7 (931) 553-08-87
            </a>
            <button 
              @click="openInquiryModal"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-medium transition-colors"
            >
              Связаться
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Туры', href: '/tours' },
  { label: 'Направления', href: '/destinations' },
  { label: 'О нас', href: '/about' },
  { label: 'Отзывы', href: '/reviews' },
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
