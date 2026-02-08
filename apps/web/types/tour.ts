// Типы для туров

export interface Tour {
  id: string
  slug: string
  title: string
  subtitle?: string
  tagline?: string
  description?: string
  
  // Цена и характеристики
  priceFrom: number | string
  currency: string
  durationDays: number
  difficulty?: 'easy' | 'medium' | 'hard' | 'extreme'
  groupSizeMin?: number
  groupSizeMax?: number
  route?: string
  discountPercent?: number
  isFeatured?: number
  
  // Медиа (для обратной совместимости)
  coverImage?: MediaItem
  gallery?: MediaItem[]
  ogImageUrl?: string
  
  // Контент (JSON из БД)
  highlights?: TourHighlightDB[]
  program?: TourProgramDayDB[]
  includes?: TourIncludeItemDB[]
  excludes?: string[]
  
  // Дополнительная информация
  paymentTerms?: string
  accommodationInfo?: string
  additionalServices?: string
  
  // Даты
  departures?: Departure[]
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  
  // Связи
  destinationId?: string
  destination?: Destination
  
  // Статус
  status: 'draft' | 'published' | 'archived'
  position?: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Типы для JSON полей из БД
export interface TourHighlightDB {
  title: string
  description: string
  imageUrl?: string
}

export interface TourProgramDayDB {
  day: number
  title: string
  content: string
}

export interface TourIncludeItemDB {
  category: 'transport' | 'accommodation' | 'food' | 'sights' | 'services' | 'other'
  text: string
}

// Типы для компонентов (с id)
export interface TourHighlight {
  id: string
  title: string
  description: string
  image?: MediaItem
  order: number
}

export interface TourProgramDay {
  id: string
  day: number
  title: string
  content: string
  images?: MediaItem[]
}

export interface TourIncludeItem {
  id: string
  text: string
  category?: string
}

export interface TourExtra {
  id: string
  title: string
  description: string
  price?: number
}

export interface TourHotel {
  id: string
  name: string
  stars: number
  description?: string
  image?: MediaItem
}

export interface Departure {
  id: string
  tourId: string
  startDate: string
  endDate: string
  price: number
  spotsTotal: number
  spotsBooked: number
  spotsLeft: number
  status: 'active' | 'sold_out' | 'cancelled'
  notes?: string
}

export interface MediaItem {
  id: string
  url: string
  filename: string
  type: 'image' | 'video'
  mimeType?: string
  width?: number
  height?: number
  altText?: string
  caption?: string
  videoProvider?: 'youtube' | 'vimeo' | 'local'
  videoId?: string
}

export interface Destination {
  id: string
  slug: string
  name: string
  country?: string
  description?: string
  coverImage?: MediaItem
}

// Типы для отзывов
export interface Review {
  id: string
  tourId?: string
  authorName: string
  authorPhoto?: MediaItem
  rating: number
  text: string
  travelDate?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// Типы для заявок
export interface Inquiry {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  tourId?: string
  departureId?: string
  source: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  pageUrl?: string
  status: 'new' | 'processing' | 'completed' | 'spam'
  amocrmLeadId?: number
  createdAt: string
}

// Типы для FAQ
export interface FaqItem {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  tourId?: string
  destinationId?: string
}

// Типы для статей
export interface Article {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  coverImage?: MediaItem
  category: 'blog' | 'news' | 'guide'
  tags?: string[]
  seo?: {
    title?: string
    description?: string
  }
  status: 'draft' | 'published'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
