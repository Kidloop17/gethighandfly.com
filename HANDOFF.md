# Get High And Fly — HANDOFF
Обновлено: 2026-09-04

## Сейчас
Фаза 0 (Фундамент) — код готов и запушен в GitHub (`bd530f2`).
Docker+nginx схема (как kitemuine): контейнер `ghaf`, порт 8082, dist/ в git.
GitHub Actions: push → build → commit dist/ [skip ci] → push.
Сервер делает: `git pull && docker compose up -d --build`.

## Следующий шаг
Завершить Фазу 0: первый деплой на VPS (ручные шаги на сервере).

**Что нужно сделать на VPS (твой шаг):**
```bash
cd /var/www
git clone git@github.com:Kidloop17/gethighandfly.com.git ghaf
cd ghaf
docker compose up -d --build
```

**Host nginx** — создать vhost (по аналогии с kitemuine):
```nginx
server {
    listen 80;
    server_name example.com www.example.com;  # заменить на реальный домен
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name example.com www.example.com;
    # SSL от certbot
    location / {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Certbot:** `certbot --nginx -d example.com -d www.example.com`

**Блокирует:**
- Реальный домен (сейчас placeholder `example.com` в `astro.config.mjs`)
- DNS A-записи → IP VPS

Если деплой откладывается — можно начинать Фазу 1 параллельно.

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
- `astro.config.mjs` — заменить `https://example.com` на реальный домен
- `docker-compose.yml` — порт 8082; `APP_PORT` переменная для переопределения
