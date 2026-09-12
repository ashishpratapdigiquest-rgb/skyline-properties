# Skyline Properties — FastAPI Backend

## Run locally
```bash
cd skyline-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API will be live at http://localhost:8000
Interactive docs at http://localhost:8000/docs

## Endpoints
- `GET  /api/properties` — all properties (optional `?location=` and `?max_price=` filters)
- `GET  /api/properties/{id}` — single property
- `GET  /api/agents` — all agents
- `GET  /api/blog` — all blog posts
- `GET  /api/blog/{slug}` — single blog post
- `GET  /api/testimonials` — homeowner testimonials
- `POST /api/contact` — submit contact form `{ name, email, phone?, interest?, message }`
- `POST /api/newsletter` — subscribe `{ email }`

## Deploy free — Render.com
1. Push this folder to a GitHub repo (or a `backend/` folder in your main repo)
2. Go to render.com → New → Web Service → connect your repo
3. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy — you'll get a live URL like `https://skyline-backend.onrender.com`
5. Every `git push` auto-redeploys.

Put that URL into the frontend's `NEXT_PUBLIC_API_URL` environment variable.

## Deploy free — Railway.app
Same idea: New Project → Deploy from GitHub repo → Railway auto-detects Python and runs it.
Set the start command the same way if it doesn't auto-detect it.
