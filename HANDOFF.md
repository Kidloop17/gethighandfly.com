# Get High And Fly — HANDOFF
Обновлено: 2026-09-04

## Сейчас
**Фаза 0 — ЗАВЕРШЕНА.** Сайт в продакшне: https://gethighandfly.com

## Инфраструктура (зафиксировано)

| Параметр | Значение |
|---|---|
| Продакшн | https://gethighandfly.com |
| VPS | 180.93.3.75 (superbot@vps-okpizza-prod) |
| GitHub | github.com/Kidloop17/gethighandfly.com |
| Контейнер | `ghaf`, порт **8084** |
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
**Фаза 1 — Наполнение**: структура секций и черновой контент.

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
