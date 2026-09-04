# Get High And Fly — HANDOFF
Обновлено: 2026-09-04

## Сейчас
Фаза 0 (Фундамент) — не начата. Документация обновлена по финальному CLAUDE.md:
стек пересмотрен (нет Tailwind, нет Docker/nginx → Caddy + rsync + GitHub Actions),
добавлен бэкенд Fastify + SQLite как отдельный сервис, Content Collections вместо Website Factory.

## Следующий шаг
Начать Фазу 0:
1. `npm create astro@latest` — TypeScript strict, minimal template
2. Настроить структуру папок по `docs/ARCHITECTURE.md`
3. Добавить i18n-конфиг в `astro.config.mjs` (locales: en/ru/vi, prefixDefaultLocale: true)
4. Написать `src/i18n/utils.ts` (useTranslations, getLangFromUrl)
5. Настроить redirect на / через Caddy (Accept-Language → 302) + cookie для ручного выбора
6. hreflang + x-default в BaseLayout
7. Self-hosted шрифты, reset CSS
8. Первый деплой пустой страницы

Критерий готовности Фазы 0: `/en/`, `/ru/`, `/vi/` открываются, редирект работает, деплой проходит.

## Нужно от владельца (блокирует работу)
- [ ] Точные даты сезона 2027
- [ ] Название и координаты спота
- [ ] Видео для hero-секции и секции спота (WebM + MP4)
- [ ] Список дисциплин (только big air или ещё?)
- [ ] Размер стартового взноса и что входит
- [ ] Лимит мест по категориям (pro-men, pro-women, amateur, junior)
- [ ] Данные прошлых сезонов: годы, победители, кол-во участников, фото
- [ ] Логотипы партнёров + их тиры
- [ ] Контакты, соцсети, Telegram-канал
- [ ] Логотип GHAF в векторе
- [ ] Адрес VPS и данные для GitHub Actions rsync (для деплоя Фазы 0)

## Ловушки
- Вьетнамский и русский текст длиннее английского на 20–30% — макет должен это держать.
  Проверять на строке «Đường bờ biển · Ветер · Big Air» при выборе шрифтов.
- `prefixDefaultLocale: true` → английская версия на `/en/`, корень `/` — только редирект.
  Не ломать canonical-ссылки и sitemap на это.
- Бэкенд (`/server/`) — отдельный процесс, не часть Astro-сборки. Не тянуть server-код в src/.
- Счётчик мест (`GET /api/slots`) — кэш 60 сек. Не делать прямые запросы к SQLite из фронта.

## Файлы в работе
- пока нет (Фаза 0 не начата)
