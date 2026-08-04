#!/usr/bin/env bash
# Sathimate — Hostinger VPS deploy script
# Server par run karo: bash deploy/deploy.sh
set -euo pipefail

APP_DIR="/var/www/sathimate"
BRANCH="${1:-main}"

cd "$APP_DIR"

echo "==> Pulling latest code ($BRANCH)"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

# Standalone build mein static aur public folder alag se copy karne padte hain.
# Ye Next.js ka documented behaviour hai — bhoolne par CSS/images 404 dete hain.
echo "==> Copying static + public into standalone"
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.production .next/standalone/.env.production 2>/dev/null || true

# Uploads folder project ke bahar hai, isliye deploy isse chhoota nahi
echo "==> Ensuring uploads dir"
mkdir -p /var/www/sathimate-uploads
chown -R www-data:www-data /var/www/sathimate-uploads

echo "==> Restarting PM2"
pm2 reload sathimate --update-env || pm2 start ecosystem.config.js
pm2 save

echo "==> Done. Live: https://sathimate.com"
