# Get High And Fly — HANDOFF
Обновлено: 2026-09-05

## Текущее состояние

**Все 4 фазы завершены + пост-релизная полировка (2026-09-05).**
Сайт наполнен реальными данными, редизайн Ocean Fury, медиа-контент подключён.
Билд: 6 страниц, 0 ошибок ✅. Готов к деплою на VPS.

## Что сделано в сессии 2026-09-05

| Коммит | Что сделано |
|---|---|
| `90a2fe5` | Ocean Fury редизайн — тёмная палитра (#050D1A / #FF2020 / #0099FF), Bebas Neue → Oswald |
| `2f63005` `aa9a34d` | Фикс docker-compose: web стартует без api (статика независима) |
| `523e2be` | Реальные данные: даты 30–31 янв 2027, спот Kitenam/Malibu/Mui Ne, взносы 500K₫/300K₫, архив 2024–2026 (выдуманные победители) |
| `66b9556` | Instagram kitenam в футере |
| `831baef` | Шрифт заголовков: Bebas Neue → Oswald (кириллица) |
| `f2d63d5` | Hero: CC0 фото (Pexels, Sergio Hurtado) вместо SVG-силуэта |
| `69bae48` | Hero: Oswald для дат/спота + высота 100svh → 88svh |
| `e512a51` | Партнёры: реальные логотипы (Kitenam, Blue Shell, Extremelab, Airush) на белых карточках |
| `144edeb` | Видео: Instagram (self-hosted MP4) в Intro; YouTube embed в Spot; лого крупнее |

## Инфраструктура

| Параметр | Значение |
|---|---|
| Продакшн | https://gethighandfly.com |
| VPS | 180.93.3.75 (superbot@…) |
| GitHub | github.com/Kidloop17/gethighandfly.com |
| Контейнер web | `ghaf`, порт **8084** |
| Контейнер api | `ghaf-api`, порт **3001** (внутренний) |
| Данные БД | Docker volume `ghaf_data` → `/data/registrations.db` |
| Конфиг API | `server/.env` на VPS (скопировать из `server/.env.example`) |
| Caddy / nginx | vhost на gethighandfly.com, авто-HTTPS |
| Деплой | `bash /var/www/gethighandfly/deploy.sh` (git pull + docker compose up) |

## Цикл деплоя

```
1. Локально:  npm run build → git add dist/ → git commit → git push
2. На VPS:    bash /var/www/gethighandfly/deploy.sh
```

Деплоить нужно вручную с VPS — SSH с этой машины timeout (порт 22 закрыт снаружи).

## Файловая структура медиа-контента

```
public/
  img/
    hero.jpg          — CC0 фото герою (Pexels, Sergio Hurtado, ID 14762616)
  video/
    ghaf-highlight.mp4 — Instagram-видео (скачано yt-dlp, 21MB, preload="none")
  partners/
    kitenam.png
    blueshell.png
    extremelab.png
    Airush.png
```

## Что осталось сделать (следующая сессия)

### Срочное / простое
- [ ] **Деплой на VPS** — `bash deploy.sh` после `git pull` (SSH с сервера Марфы не проходит, делать вручную)
- [ ] **OG-картинка PNG** — сейчас `public/og.svg`, Twitter/Facebook требует PNG: `rsvg-convert -w 1200 -h 630 public/og.svg > public/og.png`
- [ ] **Карта спота** — заглушка `TODO: Map embed` в SpotSection; добавить Google Maps iframe
- [ ] **Ссылки партнёров** — логотипы есть, URL партнёров нет (кроме Kitenam = vietnam-kitesurfing.com)
- [ ] **Правила соревнований** — `footer.rules` ведёт на `#`, нужен PDF или отдельная страница

### Контент от владельца
- [ ] Остальные логотипы партнёров (если будут добавлены позже)
- [ ] Реальные победители и фото для архива 2024–2026 (пока выдуманные)
- [ ] Логотип GHAF в SVG-векторе
- [ ] Результаты Lighthouse после деплоя (baseline)

### Будущие фазы
- [ ] **Telegram-бот** — уведомления и ответы на вопросы (последняя фаза, подтверждено)
- [ ] **Галерея** — PhotoSwipe, реальные фото с соревнований

## Ловушки (не забыть)

- `prefixDefaultLocale: true` → `/en/`, `/ru/`, `/vi/`. Корень `/` — только редирект.
- `dist/` коммитится в git (исключение: VPS делает `git pull` без build-шага).
- Бэкенд (`/server/`) — отдельный процесс, не часть Astro-сборки.
- Барло Condensed (`--font-accent`) — нет кириллицы. В hero исправлено на Oswald. Если добавлять новые элементы с кириллицей — не использовать `--font-accent`.
- Архив 2024–2026: данные `src/content/seasons/2024.json` и т.д. — **выдуманные победители**. Заменить реальными когда будут.
- Видео герою (`ghaf-highlight.mp4`) весит 21MB — `preload="none"`, не автовоспроизведение.
