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


SORT_OPTIONS = {
    "latest": lambda p: p.get("createdAt", ""),
    "price_asc": lambda p: p.get("price", 0),
    "price_desc": lambda p: -p.get("price", 0),
    "featured": lambda p: (0 if p.get("featured") else 1, -p.get("views", 0)),
    "most_viewed": lambda p: -p.get("views", 0),
}


@app.get("/api/properties")
def get_properties(
    q: Optional[str] = None,
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    purpose: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    beds: Optional[int] = None,
    baths: Optional[int] = None,
    min_area: Optional[float] = None,
    max_area: Optional[float] = None,
    featured: Optional[bool] = None,
    sort: str = "latest",
    page: int = 1,
    limit: int = 9,
):
    """
    Filterable, sortable, paginated property listing.
    Returns { items, total, page, limit, totalPages } so the frontend
    can render pagination controls without an extra request.
    """
    properties = load_json("properties.json")

    if q:
        needle = q.lower()
        properties = [
            p for p in properties
            if needle in p["title"].lower()
            or needle in p.get("city", "").lower()
            or needle in p.get("area", "").lower()
            or needle in p.get("description", "").lower()
        ]
    if city:
        properties = [p for p in properties if city.lower() in p.get("city", "").lower()]
    if property_type:
        properties = [p for p in properties if p.get("propertyType", "").lower() == property_type.lower()]
    if purpose:
        properties = [p for p in properties if p.get("purpose", "").lower() == purpose.lower()]
    if min_price is not None:
        properties = [p for p in properties if p["price"] >= min_price]
    if max_price is not None:
        properties = [p for p in properties if p["price"] <= max_price]
    if beds is not None:
        properties = [p for p in properties if p.get("beds", 0) >= beds]
    if baths is not None:
        properties = [p for p in properties if p.get("baths", 0) >= baths]
    if min_area is not None:
        properties = [p for p in properties if p.get("areaSqft", 0) >= min_area]
    if max_area is not None:
        properties = [p for p in properties if p.get("areaSqft", 0) <= max_area]
    if featured is not None:
        properties = [p for p in properties if bool(p.get("featured")) == featured]

    sort_key = SORT_OPTIONS.get(sort, SORT_OPTIONS["latest"])
    reverse = sort == "latest"  # newest first; other sorts encode direction in the key itself
    properties = sorted(properties, key=sort_key, reverse=reverse)

    total = len(properties)
    limit = max(1, min(limit, 50))
    page = max(1, page)
    total_pages = max(1, (total + limit - 1) // limit)
    start = (page - 1) * limit
    items = properties[start:start + limit]

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": total_pages,
    }


@app.get("/api/properties/featured")
def get_featured_properties(limit: int = 3):
    properties = load_json("properties.json")
    featured = [p for p in properties if p.get("featured")]
    return featured[:limit]


@app.get("/api/properties/latest")
def get_latest_properties(limit: int = 6):
    properties = load_json("properties.json")
    properties = sorted(properties, key=lambda p: p.get("createdAt", ""), reverse=True)
    return properties[:limit]


@app.get("/api/property-types")
def get_property_types():
    properties = load_json("properties.json")
    types = sorted({p["propertyType"] for p in properties if p.get("propertyType")})
    return types


@app.get("/api/locations")
def get_locations():
    properties = load_json("properties.json")
    cities = sorted({p["city"] for p in properties if p.get("city")})
    return cities


@app.get("/api/properties/{slug_or_id}")
def get_property(slug_or_id: str):
    properties = load_json("properties.json")
    for p in properties:
        if p.get("slug") == slug_or_id or str(p["id"]) == slug_or_id:
            return p
    raise HTTPException(status_code=404, detail="Property not found")


@app.get("/api/properties/{slug_or_id}/similar")
def get_similar_properties(slug_or_id: str, limit: int = 3):
    properties = load_json("properties.json")
    current = next(
        (p for p in properties if p.get("slug") == slug_or_id or str(p["id"]) == slug_or_id),
        None,
    )
    if not current:
        raise HTTPException(status_code=404, detail="Property not found")

    others = [p for p in properties if p["id"] != current["id"]]
    others.sort(
        key=lambda p: (
            p.get("propertyType") != current.get("propertyType"),
            p.get("city") != current.get("city"),
            abs(p.get("price", 0) - current.get("price", 0)),
        )
    )
    return others[:limit]


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
