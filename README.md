# Plan My Dream — Платформа для туров

Современная платформа для организации авторских туров с публичным сайтом и админкой.

## Стек технологий

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Image Optimization**: Nuxt Image
- **Deployment**: Vercel (рекомендуется)

## Структура проекта

```
planmydream/
├── apps/
│   ├── web/              # Публичный сайт (SSR/ISR)
│   └── admin/            # Админка (SPA)
├── packages/
│   ├── database/         # Drizzle схемы и миграции
│   └── shared/           # Общие типы и утилиты
├── server/
│   └── api/              # API endpoints (Nuxt Server Routes)
└── docker-compose.yml    # PostgreSQL для локальной разработки
```

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установить pnpm, если не установлен
npm install -g pnpm

# Установить зависимости
pnpm install
```

### 2. Настройка окружения

```bash
# Скопировать .env.example
cp .env.example .env

# Отредактировать .env
nano .env
```

Минимальные переменные:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/planmydream
AUTH_SECRET=your-super-secret-key-min-32-characters
```

### 3. Запуск базы данных

```bash
# Запустить PostgreSQL в Docker
docker-compose up -d postgres

# Применить миграции
pnpm db:push

# Загрузить тестовые данные
pnpm db:seed
```

### 4. Запуск разработки

```bash
# Запустить все приложения
pnpm dev

# Или только публичный сайт
pnpm dev:web

# Или только админку
pnpm dev:admin
```

Сайт будет доступен:
- **Публичный сайт**: http://localhost:3000
- **Админка**: http://localhost:3001 (после настройки)

## Команды

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск всех приложений в режиме разработки |
| `pnpm dev:web` | Запуск только публичного сайта |
| `pnpm dev:admin` | Запуск только админки |
| `pnpm build` | Сборка для production |
| `pnpm db:generate` | Генерация миграций |
| `pnpm db:push` | Применение миграций |
| `pnpm db:studio` | Открыть Drizzle Studio |
| `pnpm db:seed` | Загрузить тестовые данные |

## Деплой на Vercel

### 1. Подключить репозиторий

```bash
# Установить Vercel CLI
npm install -g vercel

# Залогиниться
vercel login

# Связать проект
vercel link
```

### 2. Настроить переменные окружения

В Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your-production-database-url
AUTH_SECRET=your-production-secret
NUXT_PUBLIC_SITE_URL=https://planmydream.ru
```

### 3. Деплой

```bash
# Production деплой
vercel --prod
```

## База данных

### Схема

Основные таблицы:
- `tours` — туры
- `departures` — даты выезда
- `destinations` — направления
- `media` — медиафайлы
- `tour_media` — связь туров и медиа
- `reviews` — отзывы
- `inquiries` — заявки
- `users` — пользователи админки
- `articles` — статьи блога
- `faqs` — FAQ

### Drizzle Studio

```bash
pnpm db:studio
```

Откроет веб-интерфейс для просмотра и редактирования данных.

## API Endpoints

### Публичные

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/tours` | Список туров |
| GET | `/api/tours/:slug` | Тур по slug |
| GET | `/api/destinations` | Список направлений |
| POST | `/api/inquiries` | Создать заявку |

### Админские (требуют авторизации)

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/login` | Авторизация |
| GET | `/api/admin/tours` | Список туров (с черновиками) |
| POST | `/api/admin/tours` | Создать тур |
| PUT | `/api/admin/tours/:id` | Обновить тур |
| DELETE | `/api/admin/tours/:id` | Удалить тур |

## Интеграции

### amoCRM

Для интеграции с amoCRM добавить переменные:

```
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_CLIENT_ID=your-client-id
AMOCRM_CLIENT_SECRET=your-client-secret
AMOCRM_REDIRECT_URI=https://your-domain.com/api/webhooks/amocrm
```

### Telegram уведомления

```
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

## Производительность

Сайт оптимизирован для максимальных Core Web Vitals:

- **ISR**: Страницы обновляются в фоне, пользователи получают кешированные версии
- **Image Optimization**: Автоматическая конвертация в WebP/AVIF
- **Code Splitting**: Каждая страница загружает только нужный код
- **Preloading**: Критические ресурсы загружаются заранее

## Лицензия

Проприетарная лицензия. Все права защищены.
