# Fix MongoDB Connection (ECONNREFUSED 127.0.0.1:27017)

## Why signup/login fails

The backend stores users in **MongoDB**. Error `ECONNREFUSED 127.0.0.1:27017` means **nothing is listening on port 27017** — MongoDB is not installed, not started, or `.env` points to the wrong host.

MemoryNest uses **`MONGODB_URI`** in `backend/.env` (also accepts **`MONGO_URI`**).

---

## Option A — MongoDB Atlas (recommended, no local install)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → free cluster.
2. **Database Access** → Add user + password.
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
4. **Database** → Connect → Drivers → copy URI, e.g.  
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/memorynest`
5. Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/memorynest?retryWrites=true&w=majority
```

6. Test & seed:

```powershell
cd backend
npm run check-db
npm run seed
```

---

## Option B — Docker (local MongoDB)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```powershell
cd memorynest
docker compose up -d
cd backend
npm run check-db
npm run seed
```

Keep `MONGODB_URI=mongodb://127.0.0.1:27017/memorynest` in `backend/.env`.

---

## Option C — Install MongoDB on Windows

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Install as a **Windows Service**.
3. Start service:

```powershell
net start MongoDB
```

4. Test:

```powershell
cd backend
npm run check-db
npm run seed
```

---

## Run the full project

```powershell
cd memorynest
npm run dev
```

- Frontend: http://localhost:5173  
- API health: http://localhost:5000/api/health → should show `"database": "connected"`

Then **Sign up** at http://localhost:5173/signup
