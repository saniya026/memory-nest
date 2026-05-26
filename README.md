# MemoryNest ✨

Turn your memories into beautiful digital stories. Full-stack eCommerce platform for personalized memory page designs.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Context API, Axios, Framer Motion |
| Backend | Node.js, Express.js, JWT |
| Database | MongoDB (Mongoose) |
| Storage | Cloudinary |
| Payments | Razorpay |

## Features

- **Auth**: Signup, login, forgot/reset password, JWT, profile
- **Homepage**: Hero, services, portfolio, testimonials, pricing, contact
- **Orders**: Multi-photo upload, captions, occasion, theme, instructions
- **Payments**: Razorpay (+ demo mode without keys)
- **User dashboard**: Orders, status tracking, design download
- **Admin dashboard**: Users, orders, status, design upload, services, pricing
- **UI**: Pastel scrapbook theme, dark/light mode, mobile app layout + desktop site

## Project Structure

```
memorynest/
├── backend/
│   ├── config/          # DB, Cloudinary
│   ├── controllers/     # Auth, orders, payments, content
│   ├── middleware/      # JWT, upload, errors
│   ├── models/          # User, Order, Payment, Service, Testimonial, Pricing
│   ├── routes/
│   ├── scripts/seed.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/         # Axios instance
│       ├── context/     # Auth, Cart, Theme
│       ├── components/  # Layout, home sections
│       └── pages/       # All routes
└── package.json         # Root scripts
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI
- (Optional) Cloudinary account for image uploads
- (Optional) Razorpay test/live keys for payments
- (Optional) SMTP for forgot-password emails

## Setup Instructions

### 1. Clone & install

```bash
cd memorynest
npm run install:all
```

### 2. Backend environment

```bash
cd backend
copy .env.example .env    # Windows
# cp .env.example .env    # Mac/Linux
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/memorynest
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173

# Optional — required for real image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional — live Razorpay (demo checkout works without these)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Optional — password reset emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

### 3. Seed database

```bash
npm run seed
```

Default admin: `admin@memorynest.com` / `Admin@123456`

### 4. Frontend environment

```bash
cd ../frontend
copy .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run development

From project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## User Flow

1. Browse **Home** → **Products** → customize (photos, occasion, theme)
2. **Add to cart** → **Checkout** → pay (Razorpay or demo)
3. **Dashboard → Orders** — track status, download when completed

## Admin Flow

1. Login as admin
2. **Admin → Orders** — update status, upload completed design
3. **Admin → Services / Pricing** — manage catalog

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Signup |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/orders` | Create order (multipart) |
| GET | `/api/orders/my` | User orders |
| POST | `/api/payments/create-order` | Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/services` | List services |
| GET | `/api/pricing` | Pricing plans |

## Mobile vs Desktop UI

- **Mobile (< md)**: App bar, bottom nav (Home, Products, Cart, Profile), vertical product list
- **Desktop (≥ md)**: Top navbar, product grid (3–4 columns), dashboard sidebar

## Production Build

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Serve `frontend/dist` via nginx or set `CLIENT_URL` to your production domain.

## Deploy to Vercel

See **[VERCEL.md](./VERCEL.md)** for full steps.

1. Push to GitHub → import on [vercel.com/new](https://vercel.com/new)
2. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your `*.vercel.app` URL)
3. Run `npm run seed` once against MongoDB Atlas
4. Deploy — frontend + API run on one domain (`/api/*`)

Do not set `VITE_API_URL` on Vercel (uses same-origin `/api`).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection failed | Start MongoDB service or use Atlas URI |
| Image upload fails | Add Cloudinary credentials to `.env` |
| Payment popup missing | Add Razorpay keys or use demo mode (auto) |
| CORS errors | Set `CLIENT_URL` in backend `.env` |

---

Made with 💕 for preserving memories.
