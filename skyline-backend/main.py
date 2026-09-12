"""
Unique Property — FastAPI backend
Serves properties, agents, blog posts, and accepts contact form submissions.
Run locally:  uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import json
import os
from datetime import datetime

app = FastAPI(title="Unique Property API", version="1.0.0")

# Allow the Next.js frontend (local dev + deployed) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your real frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CONTACT_LOG = os.path.join(DATA_DIR, "contact_submissions.json")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f:
        return json.load(f)


# ---------- Schemas ----------
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    interest: Optional[str] = "Buying a property"
    message: str


class NewsletterSignup(BaseModel):
    email: EmailStr


# ---------- Routes ----------
@app.get("/")
def root():
    return {"status": "ok", "service": "Unique Property API"}


@app.get("/api/properties")
def get_properties(location: Optional[str] = None, max_price: Optional[float] = None):
    properties = load_json("properties.json")
    if location:
        properties = [p for p in properties if location.lower() in p["location"].lower()]
    if max_price:
        properties = [p for p in properties if p["price"] <= max_price]
    return properties


@app.get("/api/properties/{property_id}")
def get_property(property_id: int):
    properties = load_json("properties.json")
    for p in properties:
        if p["id"] == property_id:
            return p
    raise HTTPException(status_code=404, detail="Property not found")


@app.get("/api/agents")
def get_agents():
    return load_json("agents.json")


@app.get("/api/blog")
def get_blog_posts():
    return load_json("blog.json")


@app.get("/api/blog/{slug}")
def get_blog_post(slug: str):
    posts = load_json("blog.json")
    for post in posts:
        if post["slug"] == slug:
            return post
    raise HTTPException(status_code=404, detail="Post not found")


@app.get("/api/testimonials")
def get_testimonials():
    return load_json("testimonials.json")


@app.post("/api/contact")
def submit_contact(payload: ContactMessage):
    os.makedirs(DATA_DIR, exist_ok=True)
    entries = []
    if os.path.exists(CONTACT_LOG):
        with open(CONTACT_LOG, "r", encoding="utf-8") as f:
            try:
                entries = json.load(f)
            except json.JSONDecodeError:
                entries = []
    entry = payload.dict()
    entry["received_at"] = datetime.utcnow().isoformat()
    entries.append(entry)
    with open(CONTACT_LOG, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)
    return {"success": True, "message": "Thanks! A Unique Property agent will reach out shortly."}


@app.post("/api/newsletter")
def subscribe_newsletter(payload: NewsletterSignup):
    # In production, push this to an email provider (Mailchimp, Resend, etc.)
    return {"success": True, "message": f"Subscribed {payload.email} successfully."}
