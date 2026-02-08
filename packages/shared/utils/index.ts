// Generate slug from title
export function generateSlug(text: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255);
}

// Format price with currency
export function formatPrice(price: number | string, currency: string = 'USD'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    EUR: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
    RUB: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }),
  };

  return formatters[currency]?.format(numPrice) || `${numPrice} ${currency}`;
}

// Format date range
export function formatDateRange(startDate: string | Date, endDate: string | Date, locale: string = 'ru-RU'): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleDateString(locale, { month: 'long' });
  const endMonth = end.toLocaleDateString(locale, { month: 'long' });
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth()) {
    return `${startDay} — ${endDay} ${endMonth} ${year}`;
  }
  
  return `${startDay} ${startMonth} — ${endDay} ${endMonth} ${year}`;
}

// Calculate days between dates
export function calculateDays(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Pluralize Russian words
export function pluralize(count: number, forms: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = count % 100 > 4 && count % 100 < 20 
    ? 2 
    : cases[Math.min(count % 10, 5)];
  return `${count} ${forms[index]}`;
}

// Usage: pluralize(5, ['день', 'дня', 'дней']) => "5 дней"
export const dayForms: [string, string, string] = ['день', 'дня', 'дней'];
export const spotForms: [string, string, string] = ['место', 'места', 'мест'];
export const personForms: [string, string, string] = ['человек', 'человека', 'человек'];

// Truncate text
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length).trim() + suffix;
}

// Generate image URL with resize parameters (for Uploadcare/imgproxy)
export function getImageUrl(
  baseUrl: string, 
  options: { width?: number; height?: number; fit?: 'cover' | 'contain' | 'fill' } = {}
): string {
  const { width, height, fit = 'cover' } = options;
  
  // For Uploadcare
  if (baseUrl.includes('ucarecdn.com')) {
    const transforms: string[] = [];
    if (width || height) {
      transforms.push(`resize/${width || ''}x${height || ''}`);
    }
    transforms.push('format/auto');
    transforms.push('quality/smart');
    return `${baseUrl}-/${transforms.join('/-/')}/`;
  }
  
  // For imgproxy or custom CDN
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('fit', fit);
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
}
