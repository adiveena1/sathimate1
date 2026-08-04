# Sathimate — Hostinger VPS Deployment Guide

## Pehle ye samajh lo (zaroori)

**Shared hosting / Web hosting plan se ye app nahi chalegi.**
Sathimate mein 10 API routes (`src/app/api/...`), `middleware.ts`, aur server-side
rendering hai. Shared hosting sirf PHP + static files chalati hai — wahan Node.js
process 24x7 nahi chal sakta.

**Isliye: Hostinger VPS (KVM plan) lena hai.**
- KVM 1 (1 vCPU / 4 GB RAM) — minimum, start ke liye theek hai
- KVM 2 (2 vCPU / 8 GB RAM) — build server par hi karna ho to ye lo, kyunki
  Next.js build 1 vCPU par slow hota hai
- OS template: **Ubuntu 22.04** (ya "Ubuntu 22.04 with Node.js" template)

---

## Step 1 — VPS setup

SSH se login karo (Hostinger panel → VPS → SSH details):

```bash
ssh root@YOUR_VPS_IP
```

Basic setup:

```bash
apt update && apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx

# PM2 (app ko background mein chalata hai + reboot par auto start)
npm install -g pm2

# firewall
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable

node -v   # v20.x aana chahiye
```

---

## Step 2 — Code server par lao

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/adiveena1/YOUR_REPO.git sathimate
cd sathimate
mkdir -p /var/log/sathimate
```

---

## Step 3 — Environment variables

```bash
cp .env.example .env.production
nano .env.production
```

Sab values bhar do. `FIREBASE_SERVICE_ACCOUNT_BASE64` ke liye:

1. Firebase Console → Project Settings → Service Accounts → Generate new private key
2. JSON download hoga. Apne laptop par:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
   ```
3. Jo lambi string aayi, wo `.env.production` mein paste kar do.

```bash
chmod 600 .env.production   # sirf root padh sake
```

> **Note:** pehle `/api/nearby` mein `admin.initializeApp()` bina credentials ke tha —
> wo sirf Google ke apne hosting par kaam karta hai. VPS par crash hota. Ab
> `src/lib/firebase-admin.ts` env se credentials leta hai, isliye ye fix ho gaya.

---

## Step 4 — Build + start

```bash
npm ci
npm run build

# standalone build mein ye copy karna zaroori hai warna CSS/images 404 denge
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.production .next/standalone/.env.production

pm2 start ecosystem.config.js
pm2 save
pm2 startup      # jo command output aaye, use copy-paste karke run karo
```

Check karo: `curl http://127.0.0.1:3000` — HTML aana chahiye.

---

## Step 5 — Nginx + domain

```bash
cp deploy/nginx-sathimate.conf /etc/nginx/sites-available/sathimate
ln -s /etc/nginx/sites-available/sathimate /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

**DNS:** jahan se sathimate.com domain liya hai (Hostinger hi hai to hPanel → DNS Zone):
- `A` record: `@` → tumhara VPS IP
- `A` record: `www` → tumhara VPS IP

DNS propagate hone mein 15 min – 2 ghante lagte hain.

**SSL (free, Let's Encrypt):**

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d sathimate.com -d www.sathimate.com
```

Auto-renew already set ho jata hai.

---

## Step 6 — Firebase side par 2 cheezein

1. **Authorized domains:** Firebase Console → Authentication → Settings →
   Authorized domains → `sathimate.com` add karo. Ye nahi kiya to Google login
   fail hoga.
2. **Firestore rules deploy:** `npm run rules:deploy` (laptop se, `npx firebase-tools login` ke baad).

Firestore aur Auth Firebase par hi rahenge — sirf hosting Hostinger par shift ho rahi hai.

---

## Step 7 — Aage ke updates

Code change karne ke baad, server par bas:

```bash
cd /var/www/sathimate && bash deploy/deploy.sh
```

---

## Play Store ke liye

`capacitor.config.ts` mein `server.url = https://sathimate.com` set hai — matlab
Android app ek WebView hai jo live site kholta hai.

Iska matlab:
- **Hosting change karne se naya AAB banane ki zaroorat nahi**, jab tak domain
  wahi (`sathimate.com`) rehta hai. Bas DNS naye server par point karna hai.
- **Lekin VPS down = app down.** Firebase Hosting ka global CDN tha, VPS ek hi
  machine hai Delhi/Singapore region mein. PM2 + Nginx ke saath uptime theek
  rehta hai, par monitoring laga lena (Hostinger ka built-in ya UptimeRobot).
- **Play Store policy ka dhyan:** pure WebView wrapper apps "Minimum Functionality"
  policy ke under reject ho sakti hain. Bachne ke liye kam se kam kuch native
  cheez add karo — splash screen, offline error page, aur push notifications
  (`@capacitor/push-notifications`). Ye reject hone ka sabse common reason hai
  first-time publishers ke liye.

---

## Jo hata diya gaya (aur kyun)

| Hataya | Kyun |
|---|---|
| `netlify.toml` | Netlify config — use nahi ho raha tha, aur uska SPA redirect rule Next.js ke liye galat tha |
| `push-env.js` | Vercel CLI script — isme Firebase keys hardcoded padi thi |
| `.github/workflows/` (5 files) | Firebase Hosting + nextjs deploy pipelines, ab relevant nahi |
| `firebase.json` ka `hosting` block | Firebase Hosting ab use nahi ho rahi (firestore/database rules rakhe hain) |
| `functions/`, `sathi/` | Firebase Functions folders — src mein kahin import nahi ho rahe the, aur build tod rahe the |
| `dataconnect/`, `src/dataconnect-*generated/` | Data Connect generated SDK — poore codebase mein ek bhi import nahi tha |
| `src/ai/` | `genkit.ts` mein sirf `export const ai = null` tha, dead code |
| `build_dist/`, `*.log` | purane build artifacts repo mein pade the |
| `sathimate-release.aab` (3 MB) | build output — git mein nahi hona chahiye |
| `.idx/`, `.agents/` (892 KB) | Firebase Studio / agent skill docs, app se koi lena-dena nahi |
| `public/index.html`, `public/404.html` | Firebase Hosting ke placeholder pages, Next routes se clash karte hain |
| `deploy` npm script, `firebase-tools` dep | `firebase deploy --only hosting` ab nahi chahiye |

**Firebase (Auth + Firestore) hataya nahi hai** — wo tumhara backend hai, hosting
nahi. Detail neeche.
