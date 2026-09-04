# gethighandfly — Архитектура

> Описывает **текущее** (планируемое) состояние. История решений — в DECISIONS.md.

## Карта директорий

```
gethighandfly/
├── src/
│   ├── components/       # Astro/TSX компоненты (Header, Footer, Gallery, …)
│   ├── layouts/          # BaseLayout.astro — обёртка для всех страниц
│   ├── pages/            # маршруты: index.astro, register.astro, results.astro, …
│   ├── i18n/             # переводы: ui.ts — единственный источник копи
│   └── styles/           # глобальные стили (если нужны помимо Tailwind)
├── public/               # статика: robots.txt, favicon, og-images
├── dist/                 # артефакт сборки (gitignored)
├── scripts/              # вспомогательные скрипты (generate-og, …)
├── Dockerfile            # nginx:alpine, копирует dist/
├── nginx.conf            # конфиг сервера
├── docker-compose.yml    # production-запуск
├── astro.config.ts
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Поток данных

```
Website Factory scripts
        │
        ▼
   src/content/ или src/pages/ (Markdown / .astro)
        │
   astro build
        │
        ▼
      dist/  ──── Docker (nginx:alpine) ──── HTTPS (nginx proxy хоста)
```

## Регистрация участников (не реализовано, ожидает ADR-002)

Два возможных варианта:
1. **Внешний сервис** (Tally / Google Forms) — embed в статичную страницу.
   Нет бэкенда, нет API. Минус: ограниченный брендинг.
2. **Astro SSR** (`output: 'server'`) + API endpoint `/api/register.ts`.
   Нужен node/Bun adapter, хранение данных (TODO: БД или spreadsheet?).

До принятия ADR-002: страница-заглушка `/register` с TODO.

## Внешние интеграции

| Сервис | Назначение | Точка отказа |
|--------|-----------|--------------|
| TODO: фото-хостинг | Галерея | TODO |
| YouTube / Vimeo | Видео (embed) | Недоступность CDN |
| TODO: email-сервис | Подтверждение регистрации | TODO |
| `@astrojs/sitemap` | SEO-карта | нет (buildtime) |

## Инварианты системы

- `dist/` не хранит состояние — только статика; при деплое всегда пересобирается
- `src/i18n/ui.ts` — единственный источник всех текстов; не хардкодить строки в компонентах
- Конфиг Astro: `trailingSlash: 'always'` (как у kitemuine — для nginx совместимости)
