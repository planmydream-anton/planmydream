<template>
  <nav
    ref="navRef"
    class="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm"
  >
    <div class="container mx-auto px-4">
      <!-- Scrollable row, hidden scrollbar on mobile -->
      <div
        ref="scrollContainerRef"
        class="flex items-center gap-1 overflow-x-auto scrollbar-hide"
        style="-ms-overflow-style: none; scrollbar-width: none;"
      >
        <a
          v-for="section in resolvedSections"
          :key="section.id"
          :href="`#${section.id}`"
          class="flex-shrink-0 relative px-4 py-4 text-sm font-medium transition-colors duration-150 whitespace-nowrap"
          :class="
            activeId === section.id
              ? 'text-orange-500'
              : 'text-neutral-500 hover:text-neutral-800'
          "
          @click.prevent="scrollToSection(section.id)"
        >
          {{ section.label }}
          <!-- Active indicator underline -->
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-200"
            :class="activeId === section.id ? 'bg-orange-500' : 'bg-transparent'"
          />
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface AnchorSection {
  id: string
  label: string
}

const props = defineProps<{
  sections?: AnchorSection[]
}>()

const defaultSections: AnchorSection[] = [
  { id: 'route', label: 'Маршрут' },
  { id: 'accommodation', label: 'Размещение' },
  { id: 'includes', label: 'Включено' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reviews', label: 'Отзывы' },
]

const resolvedSections = computed<AnchorSection[]>(() =>
  props.sections?.length ? props.sections : defaultSections,
)

const navRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const activeId = ref<string>(resolvedSections.value[0]?.id || '')

// Smooth scroll to section, accounting for sticky nav height
function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  const navHeight = navRef.value?.offsetHeight || 64
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8

  window.scrollTo({ top: targetTop, behavior: 'smooth' })
  activeId.value = id
}

// Scroll active anchor link into view in the nav bar
function scrollActiveIntoView(id: string) {
  const container = scrollContainerRef.value
  if (!container) return

  const anchor = container.querySelector<HTMLElement>(`[href="#${id}"]`)
  if (!anchor) return

  const containerRect = container.getBoundingClientRect()
  const anchorRect = anchor.getBoundingClientRect()

  const scrollLeft =
    container.scrollLeft +
    (anchorRect.left - containerRect.left) -
    containerRect.width / 2 +
    anchorRect.width / 2

  container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
}

// IntersectionObserver to track which section is visible
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  const navHeight = navRef.value?.offsetHeight || 64

  // Map to track ratios per section
  const ratioMap = new Map<string, number>()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id
        ratioMap.set(id, entry.intersectionRatio)
      }

      // Find the section with the highest intersection ratio that is visible
      let bestId = activeId.value
      let bestRatio = 0

      for (const [id, ratio] of ratioMap.entries()) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }

      // Fallback: if nothing visible, use the topmost section above viewport
      if (bestRatio === 0) {
        const sectionEls = resolvedSections.value
          .map((s) => document.getElementById(s.id))
          .filter(Boolean) as HTMLElement[]

        const above = sectionEls
          .filter((el) => el.getBoundingClientRect().top <= navHeight + 16)
          .pop()

        if (above) bestId = above.id
      }

      if (bestId !== activeId.value) {
        activeId.value = bestId
        scrollActiveIntoView(bestId)
      }
    },
    {
      rootMargin: `-${navHeight + 4}px 0px -40% 0px`,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    },
  )

  for (const section of resolvedSections.value) {
    const el = document.getElementById(section.id)
    if (el) observer.observe(el)
  }
}

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

// Re-setup if sections prop changes
watch(
  () => props.sections,
  () => {
    nextTick(() => setupObserver())
  },
)
</script>

<style scoped>
/* Hide scrollbar cross-browser */
div::-webkit-scrollbar {
  display: none;
}
</style>
