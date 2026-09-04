# Get High And Fly — Архитектура

> Текущее состояние. История решений — в `docs/DECISIONS.md`.

## Карта директорий

```
/
├── astro.config.mjs
├── src/
│   ├── content/
│   │   ├── config.ts            # схемы коллекций (zod)
│   │   ├── seasons/             # 2024.json, 2025.json, 2026.json, 2027.json
│   │   ├── categories/          # категории участников
│   │   ├── partners/            # партнёры и спонсоры
│   │   ├── volunteers/          # волонтёры
│   │   └── spot/                # ru.md, en.md, vi.md
│   ├── i18n/
│   │   ├── ru.json  en.json  vi.json
│   │   └── utils.ts             # useTranslations(lang), getLangFromUrl(url)
│   ├── components/
│   │   ├── sections/            # Hero, Intro, Categories, Spot, Partners,
│   │   │                        # Volunteers, Archive, Register, Footer
│   │   └── ui/                  # Button, LangSwitcher, Countdown, Gallery
│   ├── layouts/Base.astro
│   ├── pages/[lang]/index.astro
│   └── styles/tokens.css        # все цвета, шрифты, отступы — только здесь
├── public/                      # видео, favicon, манифест, статика
├── dist/                        # артефакт сборки (gitignored)
└── server/                      # бэкенд форм (Фаза 3, отдельный npm-проект)
    ├── package.json
    ├── index.ts                 # Fastify app
    ├── routes/register.ts
    ├── routes/slots.ts
    ├── db.ts                    # better-sqlite3
    └── ghaf.service             # systemd unit
```

## i18n-роутинг

```
astro.config.mjs:
  i18n:
    locales: ['en', 'ru', 'vi']
    defaultLocale: 'en'
    routing: { prefixDefaultLocale: true }
```

- `/en/` — английская версия (default locale, с префиксом)
- `/ru/` — русская версия
- `/vi/` — вьетнамская версия
- `/` — Caddy: редирект 302 по `Accept-Language` → нужный префикс
  - Ручной выбор языка (LangSwitcher) → cookie `lang` → Caddy проверяет cookie перед редиректом

## Поток данных (build-time)

```
src/content/seasons/*.json
src/content/categories/*.json
src/content/spot/*.md
        │
   Astro Content Collections (zod-валидация)
        │
   [lang]/index.astro → секции → компоненты
        │
   astro build → dist/ (чистая статика)
        │
   GitHub Actions: rsync dist/ → VPS /var/www/ghaf/
        │
   Caddy: serve + HTTPS + Brotli + кэш-заголовки
```

## Поток данных (runtime: форма регистрации)

```
Browser → POST /api/register
                │
          Caddy proxy /api/* → server:3001
                │
          Fastify: zod validate → better-sqlite3 → 200/409
                │
          → Telegram webhook (организаторам)
          → Email (участнику, 3 языка)
```

## Astro Islands (клиентский JS)

| Компонент | Причина Island |
|-----------|---------------|
| `Countdown.astro` | Таймер, обновляется каждую секунду |
| `Archive.astro` | Переключение табов без перезагрузки |
| `Gallery.astro` | PhotoSwipe — требует DOM |
| `Register.astro` | Форма + валидация + запрос к API |
| `LangSwitcher.astro` | Устанавливает cookie при ручном выборе |

Всё остальное — чистый Astro, нуль клиентского JS.

## Внешние интеграции

| Сервис | Назначение | Точка отказа |
|--------|-----------|--------------|
| Windguru / Windy iframe | Виджет ветра | Lazy-load; при недоступности — скрытый |
| Telegram Bot API | Уведомления организаторов | Не блокирует ответ клиенту |
| SMTP / email-сервис | Подтверждение участнику | TODO: выбрать сервис |
| GitHub Actions | CI/CD: build → rsync | — |

## Инварианты системы

- `src/styles/tokens.css` — единственный источник CSS-переменных. Не дублировать значения.
- `src/i18n/*.json` — единственный источник UI-текстов. Удаление `ru.json` не ломает сборку.
- `server/` — изолированный npm-проект. Не импортировать из `src/`.
- Контент в `src/content/` валидируется zod-схемой при сборке. Невалидный JSON — ошибка сборки.
- Добавление нового сезона = новый файл `seasons/YEAR.json`, не правки кода.
