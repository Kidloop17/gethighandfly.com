# Get High And Fly — Бэклог

## Статус фаз

| Фаза | Название | Статус |
|---|---|---|
| 0 | Фундамент (Astro, i18n, деплой) | ✅ |
| 1 | Наполнение (структура и контент) | ✅ |
| 2 | Дизайн | ✅ |
| 3 | Регистрация и бэкенд | ✅ |
| 4 | SEO, оптимизация, финальный деплой | ⬜ |

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
- [x] Контраст ≥ 4.5:1 (dark `#1C2B3A` на sand `#F5E9CC` ≈ 12:1)
- [x] Monospace числа: обратный отсчёт, статы, высоты прыжков
- [x] Stripe-разделители coral/ocean между секциями
- [x] SVG декорации в hero (sunrays + kiter silhouette 15% opacity)
- [x] Мобильная адаптация: все секции, nav скрывает текстовые ссылки на < 600px

---

## ✅ Фаза 3 — Регистрация и бэкенд (2026-09-04, коммит `a425ce6`)

- [x] `server/` — Fastify + SQLite (better-sqlite3), Node.js ESM
- [x] `POST /api/register` — регистрация участника
  - Валидация всех полей (тип, длина, формат email, допустимые значения)
  - Антиспам: honeypot (`website`), time-check (< 3 сек), rate-limit 5 req/15min/IP
  - Лимиты мест по категориям через env `SLOTS_PRO_MEN/WOMEN/AMATEUR/JUNIOR`
  - Дубль email → 409
  - Статус `pending` или `waitlist` (если мест нет)
  - `crypto.randomUUID()` для confirmation_token
- [x] `GET /api/slots` — счётчик мест, кэш 60 сек
- [x] `GET /health` — healthcheck
- [x] Telegram-уведомления (опционально, через TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
- [x] Email-подтверждение на 3 языках (опционально, через SMTP_*)
- [x] `docker-compose.yml` — добавлен сервис `ghaf-api` + volume `ghaf_data`
- [x] `nginx.conf` — proxy `/api/ → api:3001`
- [x] `RegistrationSection.astro` — форма подключена к API
  - Honeypot поле `.hp { display: none }`
  - `_formOpenedAt` hidden input
  - Fetch к `/api/register`, success/error/waitlist UI
  - Счётчик мест загружается с `/api/slots`
- [x] `2027.json` → `status: "registration-open"` (форма открыта)
- [x] `src/pages/[lang]/privacy.astro` — политика конфиденциальности (en/ru/vi)
- [x] Footer → реальная ссылка на `/{lang}/privacy/`
- [x] i18n: добавлены строки `registration.submitting/success/waitlistSuccess/duplicateEmail/error`, `privacy.*`
- [x] `server/.env.example` — шаблон конфига для VPS
- [x] Билд: ✅ 6 страниц, 0 ошибок

### Деплой Фазы 3 на VPS (первый раз)
```bash
# После git push + bash deploy.sh на VPS:
cp server/.env.example server/.env
# Заполнить server/.env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SMTP_*
docker compose up -d --build
```

---

## Дальше

**Фаза 4 — SEO, оптимизация, финальный деплой**
- `@astrojs/sitemap` с локалями
- `schema.org SportsEvent` JSON-LD на каждом языке
- Уникальные title/description/OG на каждую локаль, OG-картинки
- Все изображения через `<Image>` → AVIF + WebP
- Lazy-load галереи и виджета ветра
- robots.txt, favicon-набор, manifest.json
- Lighthouse ≥ 95 на мобильном

---

## Документация (2026-09-04, коммит `225ef3d`)
Инициализирована документация по DOC_STANDARD. Обновлена по финальному CLAUDE.md:
стек пересмотрен (Caddy + rsync + GitHub Actions, Fastify + SQLite, CSS vars без Tailwind).
ADR 001–005 зафиксированы.
