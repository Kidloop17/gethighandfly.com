# Get High And Fly — HANDOFF
Обновлено: 2026-09-04

## Сейчас
**Фаза 4 — ЗАВЕРШЕНА.** `@astrojs/sitemap` (i18n), JSON-LD SportsEvent, OG-теги + Twitter Card,
og.svg 1200×630, robots.txt, manifest.json, font preload.
Билд: 6 страниц, 0 ошибок, sitemap-index.xml ✅. Ждём подтверждения владельца.

**Фаза 3 — ЗАВЕРШЕНА.** Fastify + SQLite бэкенд, POST /api/register, GET /api/slots,
антиспам (honeypot + time-check + rate-limit), Telegram-уведомления, email-подтверждение,
лист ожидания, privacy-страница на 3 языках, форма подключена.

**Фаза 2 — ЗАВЕРШЕНА.** Дизайн Kite-Poster: Bebas Neue + Playfair Display + Source Sans 3,
палитра sand/coral/ocean, parallax hero, scroll-reveal, hover-анимации, prefers-reduced-motion.

**Фаза 1 — ЗАВЕРШЕНА.** Все 9 секций на месте, i18n en/ru/vi, архив из коллекции.

**Фаза 0 — ЗАВЕРШЕНА.** Сайт в продакшне: https://gethighandfly.com

## Инфраструктура (зафиксировано)

| Параметр | Значение |
|---|---|
| Продакшн | https://gethighandfly.com |
| VPS | 180.93.3.75 (superbot@vps-okpizza-prod) |
| GitHub | github.com/Kidloop17/gethighandfly.com |
| Контейнер web | `ghaf`, порт **8084** |
| Контейнер api | `ghaf-api`, порт **3001** (внутренний) |
| Данные БД | Docker volume `ghaf_data` → `/data/registrations.db` |
| Конфиг API | `server/.env` на VPS (скопировать из `server/.env.example`) |
| nginx vhost | `/etc/nginx/sites-available/gethighandfly.com` |
| SSL | certbot (Let's Encrypt) |
| Деплой | `bash /var/www/gethighandfly/deploy.sh` |

## Цикл деплоя

```
Локально: npm run build → git add dist/ → git commit → git push
     ↓
GitHub Actions: build → commit dist/ [skip ci] → push
     ↓
На VPS: bash deploy.sh  →  git pull + docker compose up -d --build
```

Или полностью автоматически: достаточно `git push` — Actions сам соберёт и закоммитит dist/.
Потом `bash deploy.sh` на сервере подхватывает новый dist/.

## Следующий шаг
**Все 4 фазы завершены.** Сайт готов к финальному деплою и наполнению реальными данными от владельца.

Остаётся от владельца (см. список ниже):
- Точные даты 2027, spot name/coords, hero-видео, лимиты мест
- Конвертировать `public/og.svg` → `public/og.png` (для Twitter/Facebook превью)
- Запустить Lighthouse после деплоя Фазы 4 на VPS

## Деплой Фазы 3 на VPS (первый раз)
После `git push` и `bash deploy.sh`:
```bash
cp server/.env.example server/.env
# Заполнить server/.env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SMTP_*
docker compose up -d --build
```
Volume `ghaf_data` создаётся автоматически, БД инициализируется при первом запуске.

## Нужно от владельца (для Фазы 1)
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

## Ловушки
- Вьетнамский и русский текст длиннее английского на 20–30% — макет должен это держать.
  Проверять на строке «Đường bờ biển · Ветер · Big Air» при выборе шрифтов.
- `prefixDefaultLocale: true` → английская версия на `/en/`, корень `/` — только редирект nginx.
  Не ломать canonical-ссылки и sitemap на это.
- Бэкенд (`/server/`) — отдельный процесс, не часть Astro-сборки. Не тянуть server-код в src/.
- Счётчик мест (`GET /api/slots`) — кэш 60 сек. Не делать прямые запросы к SQLite из фронта.
- dist/ коммитится в git — перед пушем всегда делать `npm run build`.
