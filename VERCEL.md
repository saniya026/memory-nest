# Deploy MemoryNest to Vercel

## One-click deploy

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. **Root Directory**: leave as `.` (project root `memorynest`).
4. Vercel reads `vercel.json` automatically — no extra build settings needed.

## Environment variables (Vercel Dashboard → Settings → Environment Variables)

| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/memorynest` |
| `JWT_SECRET` | Yes | long random string |
| `CLIENT_URL` | Yes | `https://your-app.vercel.app` |
| `JWT_EXPIRE` | No | `7d` |
| `CLOUDINARY_CLOUD_NAME` | For uploads | |
| `CLOUDINARY_API_KEY` | For uploads | |
| `CLOUDINARY_API_SECRET` | For uploads | |
| `RAZORPAY_KEY_ID` | For live pay | |
| `RAZORPAY_KEY_SECRET` | For live pay | |
| `SMTP_HOST` | For reset email | |
| `SMTP_USER` | For reset email | |
| `SMTP_PASS` | For reset email | |
| `ADMIN_EMAIL` | Seed only | `admin@memorynest.com` |
| `ADMIN_PASSWORD` | Seed only | |

**Important:** Set `CLIENT_URL` to your production URL (e.g. `https://memorynest.vercel.app`) so CORS and password-reset links work.

Do **not** set `VITE_API_URL` on Vercel — the frontend uses `/api` on the same domain.

## Seed production database (once)

From your machine with `MONGODB_URI` pointing to Atlas:

```bash
cd backend
# copy Atlas URI into .env
npm run seed
```

## Deploy via CLI

```bash
npm i -g vercel
cd memorynest
vercel
vercel --prod
```

Add env vars: `vercel env add MONGODB_URI` (repeat for each).

## Architecture on Vercel

- **Static**: `frontend/dist` (React SPA)
- **Serverless**: `api/index.js` → Express backend at `/api/*`
- **SPA routing**: all non-API routes → `index.html`

## Limits

- Serverless payload ~4.5 MB (Hobby) — keep photo uploads small or use Cloudinary direct upload later.
- Function timeout: 30s (configured in `vercel.json`).
- Use **MongoDB Atlas** (not local MongoDB).

## Razorpay in production

1. Add live/test keys in Vercel env.
2. In Razorpay dashboard, whitelist your Vercel domain for checkout.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API 500 | Check `MONGODB_URI` and Atlas IP allowlist (`0.0.0.0/0`) |
| CORS error | Set `CLIENT_URL` to exact Vercel URL |
| 404 on refresh | `vercel.json` rewrites should include SPA fallback |
| Login works locally only | Redeploy after env changes |
