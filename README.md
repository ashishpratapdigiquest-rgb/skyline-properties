# Skyline Properties — Full Stack (Next.js + Tailwind + FastAPI)

```
skyline-properties/
├── skyline-frontend/    Next.js 14 (App Router) + Tailwind CSS
└── skyline-backend/     FastAPI (Python)
```

## 1. Run locally

**Backend (Terminal 1):**
```bash
cd skyline-backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd skyline-frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Open http://localhost:3000 — properties, agents, blog, and the contact form are all served live from FastAPI at http://localhost:8000.

If the backend isn't running, the frontend automatically falls back to built-in seed data so it still renders.

## 2. Push to GitHub

```bash
cd skyline-properties     # the folder containing both skyline-frontend/ and skyline-backend/
git init
git add .
git commit -m "Initial commit: Skyline Properties (Next.js + Tailwind + FastAPI)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

After this, every future change is just:
```bash
git add .
git commit -m "describe your change"
git push
```

## 3. Deploy — both live and free

### Frontend → Vercel
1. vercel.com → Sign in with GitHub → "Add New Project"
2. Select your repo, set **Root Directory** to `skyline-frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your backend's live URL (from step below)
4. Deploy — you get a live URL like `https://skyline-properties.vercel.app`
5. Every `git push` auto-redeploys.

### Backend → Render
1. render.com → New → Web Service → connect your repo
2. Set **Root Directory** to `skyline-backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy — you get a live URL like `https://skyline-backend.onrender.com`
6. Every `git push` auto-redeploys.

**Important:** once the backend is live, go back to your Vercel project → Settings → Environment Variables,
set `NEXT_PUBLIC_API_URL` to the Render URL, and redeploy the frontend so it talks to the live backend
instead of localhost.

## Notes
- Render's free tier sleeps after inactivity — the first request after idle can take ~30s to wake up.
- Contact form submissions are stored in `skyline-backend/data/contact_submissions.json`. For production,
  swap this for a real database (Postgres via Supabase/Neon, both free tiers available).
