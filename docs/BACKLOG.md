# Get High And Fly — Бэклог

## Статус фаз

| Фаза | Название | Статус |
|---|---|---|
| 0 | Фундамент (Astro, i18n, деплой) | ✅ |
| 1 | Наполнение (структура и контент) | ✅ |
| 2 | Дизайн | ✅ |
| 3 | Регистрация и бэкенд | ✅ |
| 4 | SEO, оптимизация, финальный деплой | ✅ |
| — | Полировка: дизайн, контент, медиа | ✅ 2026-09-05 |

Правило: не начинать следующую фазу без принятия текущей.
Каждая фаза заканчивается: коммит + пуш + полная документация + ожидание подтверждения.

---

## ✅ Фаза 0 — Фундамент (2026-09-04, коммит `234fda2`)

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

## ✅ Фаза 1 — Наполнение (2026-09-04, коммит `26447be`)

- [x] 9 секций лендинга: Hero, Intro, Disciplines, Spot, Partners, Volunteers, Archive, Registration, Footer
- [x] i18n en/ru/vi — все строки в `src/i18n/{en,ru,vi}.json`, нет хардкода в разметке
- [x] Content Collections: `src/content/seasons/*.json` — архив автогенерируется
- [x] Счётчик обратного отсчёта до даты соревнований (JS, с guard на TODO-даты)
- [x] Archive-табы: по одному на каждый сезон из коллекции
- [x] Форма регистрации — структура и поля (кнопка задизейблена до Фазы 3)
- [x] Все TODO-заглушки расставлены, ничего не хардкожено

---

## ✅ Фаза 2 — Дизайн Kite-Poster (2026-09-04, коммит `b1f97ca`)

- [x] Палитра: sand `#F5E9CC`, coral `#E8522A`, ocean `#1A5276`, dark `#1C2B3A`
- [x] Шрифты: Bebas Neue (display), Playfair Display (accent), Source Sans 3 (body), Courier New (mono numbers)
- [x] CSS-токены полностью переписаны в `src/styles/tokens.css`
- [x] Parallax hero: JS + `requestAnimationFrame`, `scrollY * 0.4`
- [x] Scroll-reveal: `IntersectionObserver` + `.reveal`/`.revealed` классы
- [x] Hover-микроанимации: карточки дисциплин `translateY(-4px)`, партнёры, форма
- [x] `prefers-reduced-motion`: все анимации отключены через media-query
- [x] Focus-ring: `:focus-visible { outline: 3px solid var(--color-accent) }`
- [x] Контраст ≥ 4.5:1
- [x] Monospace числа: обратный отсчёт, статы, высоты прыжков
- [x] Stripe-разделители coral/ocean между секциями
- [x] SVG декорации в hero (sunrays + kiter silhouette)
- [x] Мобильная адаптация: все секции

---

## ✅ Фаза 3 — Регистрация и бэкенд (2026-09-04, коммит `a425ce6`)

- [x] `server/` — Fastify + SQLite (better-sqlite3), Node.js ESM
- [x] `POST /api/register` — валидация, honeypot, time-check, rate-limit, лимиты мест, waitlist
- [x] `GET /api/slots` — счётчик мест, кэш 60 сек
- [x] `GET /health` — healthcheck
- [x] Telegram-уведомления (опционально)
- [x] Email-подтверждение на 3 языках (опционально)
- [x] `docker-compose.yml` — сервис `ghaf-api` + volume `ghaf_data`
- [x] `nginx.conf` — proxy `/api/ → api:3001`
- [x] `RegistrationSection.astro` — форма подключена к API, honeypot, счётчик мест
- [x] `src/pages/[lang]/privacy.astro` — политика конфиденциальности (en/ru/vi)
- [x] `server/.env.example` — шаблон конфига для VPS
- [x] Билд: ✅ 6 страниц, 0 ошибок

---

## ✅ Фаза 4 — SEO, оптимизация (2026-09-04, коммит `e630e83`)

- [x] `@astrojs/sitemap` с i18n-локалями → `sitemap-index.xml`
- [x] `schema.org SportsEvent` JSON-LD в `Base.astro`
- [x] OG-мета-теги + Twitter Card
- [x] `public/og.svg` — OG-картинка 1200×630
- [x] `public/robots.txt`
- [x] `public/manifest.json` — PWA manifest
- [x] Font preload + dns-prefetch
- [x] Билд: 6 страниц, 0 ошибок ✅

---

## ✅ Полировка дизайна и контента (2026-09-05, коммит `144edeb`)

### Редизайн Ocean Fury
- [x] Полная смена палитры: тёмный океан `#050D1A` / неон-красный `#FF2020` / электро-синий `#0099FF`
- [x] Шрифт заголовков: Bebas Neue (нет кириллицы) → **Oswald** (полная кириллица + Latin Extended)
- [x] `hero-label` и `hero-spot` также переведены на Oswald (Barlow Condensed без кириллицы)
- [x] Hero: высота `100svh` → `88svh`, padding и margins сжаты
- [x] Hero: SVG-силуэт заменён на CC0 фото (Pexels, Sergio Hurtado, ID 14762616)

### Реальный контент
- [x] Даты: 30–31 января 2027 (предварительно) — en/ru/vi
- [x] Спот: Kitenam · Malibu Beach · Mui Ne — описание, ветровые условия
- [x] Взносы: PRO 500 000₫, остальные 300 000₫ — per-category i18n ключи
- [x] Лимиты: Pro Men 20, Pro Women 10, Amateur 25, Junior 15
- [x] Архив: сезоны 2024, 2025, 2026 (выдуманные данные для демо)
- [x] Контакты: +84 778 005 495 Telegram, Instagram @kitenam

### Медиа
- [x] `public/img/hero.jpg` — CC0 фото (кайтер, инвертированный трик, Pexels)
- [x] `public/video/ghaf-highlight.mp4` — Instagram видео (self-hosted, 21MB, `preload="none"`)
- [x] Intro: видео справа от текста (колонка 260px)
- [x] Spot: YouTube iframe `16:9` вместо заглушки (ID: quwFXz3c0kA)

### Партнёры
- [x] `public/partners/kitenam.png` — Kitenam Vietnam Kite Surf Club
- [x] `public/partners/blueshell.png` — Blue Shell Resort
- [x] `public/partners/extremelab.png` — Extremelab
- [x] `public/partners/Airush.png` — Airush Kiteboarding
- [x] Секция партнёров: один ряд, белые карточки, тир-система убрана

### Деплой
- [x] `docker-compose.yml`: `env_file: required: false` (api стартует без .env)
- [x] web сервис без `depends_on: api` (статика независима от API)

---

## Следующие задачи (приоритет)

### Быстро (< 1 ч)
- [ ] Деплой на VPS: `bash /var/www/gethighandfly/deploy.sh`
- [ ] OG PNG: `rsvg-convert -w 1200 -h 630 public/og.svg > public/og.png`
- [ ] Карта спота: Google Maps iframe вместо заглушки в SpotSection
- [ ] Ссылки партнёров: добавить URL к логотипам (Blue Shell, Extremelab, Airush)
- [ ] Ссылка "Правила соревнований" в футере (`footer.rules` → `#`)

### Контент (от владельца)
- [ ] Победители и фото архива 2024–2026 (сейчас выдуманные)
- [ ] Дополнительные логотипы партнёров
- [ ] SVG-логотип GHAF
- [ ] Правила соревнований (PDF или страница)

### Будущие фазы
- [ ] **Telegram-бот** — уведомления, ответы на вопросы (последняя фаза)
- [ ] **Галерея** — PhotoSwipe, реальные фото с соревнований 2024–2026
- [ ] **Lighthouse** — замер после деплоя (baseline для оптимизации)
