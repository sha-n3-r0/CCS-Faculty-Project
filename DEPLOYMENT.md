# Deployment Guide (Railway + Vercel)

This project is a Laravel app (with Inertia + Vite).  
Recommended architecture:

- Railway: runs Laravel backend + database
- Vercel: optional frontend domain/proxy that forwards traffic to Railway

## 1) Railway deployment

This repository includes:

- `railway.json` for deploy/start behavior
- `nixpacks.toml` for install/build/start phases

### Required Railway environment variables

Set these in Railway service variables:

- `APP_NAME=CCS`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=<generate with php artisan key:generate --show>`
- `APP_URL=https://<your-railway-domain>.up.railway.app`
- `DB_CONNECTION=mysql`
- `DB_HOST=<from Railway MySQL plugin>`
- `DB_PORT=<from Railway MySQL plugin>`
- `DB_DATABASE=<from Railway MySQL plugin>`
- `DB_USERNAME=<from Railway MySQL plugin>`
- `DB_PASSWORD=<from Railway MySQL plugin>`
- `SESSION_DRIVER=file`
- `CACHE_STORE=file`
- `QUEUE_CONNECTION=sync`

### Post-deploy migration command

Use:

`php artisan migrate --force`

Do not use `php artisan migrate:reset` in production deploys.

## 2) Vercel deployment

This repository includes `vercel.json` configured as a reverse proxy.

Before deploying to Vercel, edit `vercel.json` and replace:

`https://your-railway-domain.up.railway.app`

with your real Railway public URL.

Then deploy to Vercel normally. Vercel will forward all routes to Railway.

## 3) First-time checklist

1. Deploy Railway service and confirm app boots.
2. Run `php artisan migrate --force` once.
3. Open Railway URL and test login/dashboard routes.
4. Update `vercel.json` destination and deploy Vercel.
5. Test Vercel URL to confirm requests are proxied to Railway.
