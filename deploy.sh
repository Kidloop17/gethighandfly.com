#!/usr/bin/env bash
# Обновление на сервере: из каталога проекта — bash deploy.sh
# Не запускать через sudo: у root нет SSH-ключа для git@github.com.
set -euo pipefail
cd "$(dirname "$0")"

if [[ "${EUID:-0}" -eq 0 ]]; then
  echo "deploy.sh: не запускайте через sudo/root." >&2
  exit 1
fi

git pull
docker compose up -d --build
echo "OK"
