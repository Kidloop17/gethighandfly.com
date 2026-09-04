# Get High And Fly — Бэклог

## Статус фаз

| Фаза | Название | Статус |
|---|---|---|
| 0 | Фундамент (Astro, i18n, деплой) | ✅ |
| 1 | Наполнение (структура и контент) | ⬜ |
| 2 | Дизайн | ⬜ |
| 3 | Регистрация и бэкенд | ⬜ |
| 4 | SEO, оптимизация, финальный деплой | ⬜ |

Правило: не начинать следующую фазу без принятия текущей.
Каждая фаза заканчивается коротким отчётом и ожиданием подтверждения.

---

## ✅ Фаза 0 — Фундамент (2026-09-04)

- [x] Astro v7.3.1, TypeScript strict, minimal template
- [x] Структура папок по `docs/ARCHITECTURE.md`
- [x] i18n в `astro.config.mjs`: locales `[en, ru, vi]`, `prefixDefaultLocale: true`
- [x] `src/i18n/utils.ts`: `useTranslations(lang)`, `getLangFromUrl(url)`
- [x] nginx редирект `/` → локаль по Accept-Language + cookie `lang` (внутри контейнера)
- [x] `hreflang` + `x-default` в `layouts/Base.astro`
- [x] Reset CSS + CSS-токены в `src/styles/tokens.css`
- [x] Docker + nginx (порт 8084), `deploy.sh`
- [x] GitHub Actions: push → build → commit dist/ [skip ci] → push
- [x] Первый деплой: **https://gethighandfly.com** — открывается ✅

---

## Дальше

**Фаза 1 — Наполнение** (структура и контент, без финального дизайна)
9 секций лендинга с реальной структурой данных и черновым текстом:
Hero, Вступление, Дисциплины, Спот, Партнёры, Волонтёры, Архив, Регистрация (вёрстка), Футер.
Критерий: все секции на месте, переключение языков меняет весь текст,
новый файл сезона добавляет вкладку в архив.

**Фаза 2 — Дизайн**
Предложить 3 направления с палитрой, шрифтами, сигнатурным элементом.
Дождаться выбора — не начинать верстать до него.
Направления для рассмотрения: Data-brutal, Kite-poster, Локальный колорит.
Обязательно: parallax hero, scroll-reveal, hover-микроанимации, зерно/текстура,
monospacе числа, `prefers-reduced-motion`, focus-ring, контраст ≥ 4.5:1.
Критерий: дизайн принят на всех трёх языках, мобильный + десктоп.

**Фаза 3 — Регистрация и бэкенд** (`/server/`)
Fastify + SQLite, POST /api/register, GET /api/slots (кэш 60 сек),
антиспам (honeypot + rate limit + time check), Telegram-уведомления,
email-подтверждение на 3 языках, лист ожидания, systemd-юнит, cron-бэкап.
Персональные данные: минимум необходимого, политика конфиденциальности на 3 языках.

**Фаза 4 — SEO, оптимизация, финальный деплой**
`@astrojs/sitemap` с локалями, `schema.org SportsEvent` JSON-LD на каждом языке,
уникальные title/description/OG на каждую локаль, OG-картинки,
все изображения через `<Image>` → AVIF + WebP, lazy-load галереи и виджета ветра,
robots.txt, favicon-набор, manifest.json, Lighthouse ≥ 95 на мобильном.

---

## ✅ Сделано

### Документация (2026-09-04, коммит `225ef3d`)
Инициализирована документация по DOC_STANDARD. Обновлена по финальному CLAUDE.md:
стек пересмотрен (Caddy + rsync + GitHub Actions, Fastify + SQLite, CSS vars без Tailwind).
ADR 001–005 зафиксированы.
