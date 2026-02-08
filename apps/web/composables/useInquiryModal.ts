// Composable для управления модальным окном заявки
interface InquiryModalState {
  isOpen: boolean
  tourId?: string
  tourTitle?: string
  departureId?: string
  departureDate?: string
}

const state = reactive<InquiryModalState>({
  isOpen: false,
  tourId: undefined,
  tourTitle: undefined,
  departureId: undefined,
  departureDate: undefined,
})

export function useInquiryModal() {
  function openModal(options?: {
    tourId?: string
    tourTitle?: string
    departureId?: string
    departureDate?: string
  }) {
    state.tourId = options?.tourId
    state.tourTitle = options?.tourTitle
    state.departureId = options?.departureId
    state.departureDate = options?.departureDate
    state.isOpen = true
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    state.isOpen = false
    state.tourId = undefined
    state.tourTitle = undefined
    state.departureId = undefined
    state.departureDate = undefined
    
    // Возвращаем скролл
    document.body.style.overflow = ''
  }

  return {
    isOpen: computed(() => state.isOpen),
    tourId: computed(() => state.tourId),
    tourTitle: computed(() => state.tourTitle),
    departureId: computed(() => state.departureId),
    departureDate: computed(() => state.departureDate),
    openModal,
    closeModal,
  }
}
