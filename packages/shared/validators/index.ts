import { z } from 'zod';

// Inquiry form validation
export const inquirySchema = z.object({
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя слишком длинное'),
  
  phone: z.string()
    .min(10, 'Введите корректный номер телефона')
    .max(20, 'Номер телефона слишком длинный')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Некорректный формат номера'),
  
  email: z.string()
    .email('Введите корректный email')
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .max(2000, 'Сообщение слишком длинное')
    .optional(),
  
  tourId: z.string().uuid().optional(),
  departureId: z.string().uuid().optional(),
  
  // UTM parameters
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  pageUrl: z.string().url().max(1000).optional(),
  
  // Consent
  consent: z.boolean().refine(val => val === true, {
    message: 'Необходимо согласие на обработку персональных данных',
  }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// Tour validation for admin
export const tourSchema = z.object({
  slug: z.string()
    .min(3, 'Slug должен содержать минимум 3 символа')
    .max(255)
    .regex(/^[a-z0-9\-]+$/, 'Slug может содержать только латинские буквы, цифры и дефисы'),
  
  title: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(500),
  
  subtitle: z.string().max(500).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  
  priceFrom: z.number().positive().optional(),
  currency: z.enum(['USD', 'EUR', 'RUB']).default('USD'),
  durationDays: z.number().int().positive().optional(),
  route: z.string().max(1000).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'extreme']).optional(),
  groupSizeMin: z.number().int().positive().optional(),
  groupSizeMax: z.number().int().positive().optional(),
  
  destinationId: z.string().uuid().optional(),
  organizerId: z.string().uuid().optional(),
  weatherInfo: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),

  // SEO
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  seoKeywords: z.string().max(500).optional(),
});

export type TourInput = z.infer<typeof tourSchema>;

// Departure validation
export const departureSchema = z.object({
  tourId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты: YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты: YYYY-MM-DD'),
  price: z.number().positive('Цена должна быть положительной'),
  spotsTotal: z.number().int().nonnegative().optional(),
  status: z.enum(['active', 'sold_out', 'cancelled']).default('active'),
  notes: z.string().optional(),
});

export type DepartureInput = z.infer<typeof departureSchema>;

// Auth validation
export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export type LoginInput = z.infer<typeof loginSchema>;
