"""
Skyline Properties — FastAPI backend
Serves properties, agents, blog posts, and accepts contact form submissions.
Run locally:  uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import json
import os
import requests
from datetime import datetime, timedelta
from database import load_json, save_json
import jwt
from passlib.context import CryptContext

JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-production")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_token(user_id: int, email: str) -> str:
    payload = {"user_id": user_id, "email": email, "exp": datetime.utcnow() + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def get_current_user(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

app = FastAPI(title="Skyline Properties API", version="1.0.0")

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "changeme")

# ---------- Email (Brevo — free tier, 300 emails/day forever) ----------
BREVO_API_KEY = os.environ.get("BREVO_API_KEY")  # set this in Render env vars
BREVO_FROM_EMAIL = os.environ.get("BREVO_FROM_EMAIL", "no-reply@example.com")
BREVO_FROM_NAME = os.environ.get("BREVO_FROM_NAME", "Skyline Properties")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")  # where new-lead notifications go
SITE_URL = os.environ.get("SITE_URL", "https://skyline-properties-iota.vercel.app")


def send_email(to_email: str, subject: str, html_content: str):
    """
    Sends an email via Brevo's REST API. Silently no-ops (logs only) if
    BREVO_API_KEY isn't configured yet, so the rest of the app keeps working
    even before email is set up.
    """
    if not BREVO_API_KEY or not to_email:
        print(f"[email skipped — no BREVO_API_KEY or recipient] to={to_email} subject={subject}")
        return False
    try:
        resp = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json={
                "sender": {"name": BREVO_FROM_NAME, "email": BREVO_FROM_EMAIL},
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": html_content,
            },
            timeout=10,
        )
        return resp.status_code in (200, 201)
    except Exception as e:
        print(f"[email failed] {e}")
        return False


def require_admin(x_admin_key: Optional[str] = Header(default=None)):
    if not x_admin_key or x_admin_key != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid or missing admin key")
    return True

# Allow the Next.js frontend (local dev + deployed) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your real frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def slugify(text):
    import re
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug


# ---------- Schemas ----------
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    interest: Optional[str] = "Buying a property"
    message: str


class NewsletterSignup(BaseModel):
    email: EmailStr


class PropertyAlert(BaseModel):
    name: str
    phone: str
    email: EmailStr
    purpose: Optional[str] = None
    city: Optional[str] = "Gorakhpur"
    area: Optional[str] = None
    property_type: Optional[str] = None
    max_budget: Optional[float] = None


class BlogPostIn(BaseModel):
    title: str
    excerpt: str
    content: str
    image: Optional[str] = None
    author: Optional[str] = "Skyline Properties Team"


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    author: Optional[str] = None


class CommentIn(BaseModel):
    name: str
    email: EmailStr
    comment: str


class AgentIn(BaseModel):
    name: str
    role: str
    phone: str
    rating: int = 5
    photo: Optional[str] = None


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    rating: Optional[int] = None
    photo: Optional[str] = None


class TestimonialIn(BaseModel):
    name: str
    rating: int = 5
    quote: str
    photo: Optional[str] = None


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    rating: Optional[int] = None
    quote: Optional[str] = None
    photo: Optional[str] = None


class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_image: Optional[str] = None
    phone_number: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class PropertyIn(BaseModel):
    title: str
    purpose: str = "sale"  # "sale" | "rent"
    propertyType: str
    status: Optional[str] = "Ready to Move"
    city: str
    area: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price: float
    priceDisplay: Optional[str] = None
    rentDisplay: Optional[str] = None
    beds: Optional[int] = 0
    baths: Optional[int] = 0
    areaSqft: Optional[float] = None
    floor: Optional[str] = None
    tag: Optional[str] = None
    featured: Optional[bool] = False
    verified: Optional[bool] = False
    description: Optional[str] = ""
    amenities: Optional[list] = []
    images: Optional[list] = []


class PropertyUpdate(PropertyIn):
    title: Optional[str] = None
    propertyType: Optional[str] = None
    city: Optional[str] = None
    price: Optional[float] = None


# ---------- Routes ----------
@app.get("/")
def root():
    return {"status": "ok", "service": "Skyline Properties API"}


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
    area: Optional[str] = None,
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
    if area:
        properties = [p for p in properties if area.lower() in p.get("area", "").lower()]
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


@app.get("/api/areas")
def get_areas():
    properties = load_json("properties.json")
    areas = sorted({p["area"] for p in properties if p.get("area")})
    return areas


@app.get("/api/properties/{slug_or_id}")
def get_property(slug_or_id: str):
    properties = load_json("properties.json")
    for i, p in enumerate(properties):
        if p.get("slug") == slug_or_id or str(p["id"]) == slug_or_id:
            p["views"] = p.get("views", 0) + 1
            properties[i] = p
            save_json("properties.json", properties)
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


@app.post("/api/agents")
def create_agent(payload: AgentIn, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    agents = load_json("agents.json")
    new_id = max([a["id"] for a in agents], default=0) + 1
    record = payload.dict()
    record["id"] = new_id
    if not record.get("photo"):
        record["photo"] = "https://randomuser.me/api/portraits/lego/1.jpg"
    agents.append(record)
    save_json("agents.json", agents)
    return record


@app.put("/api/agents/{agent_id}")
def update_agent(agent_id: int, payload: AgentUpdate, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    agents = load_json("agents.json")
    for i, a in enumerate(agents):
        if a["id"] == agent_id:
            updates = {k: v for k, v in payload.dict().items() if v is not None}
            agents[i] = {**a, **updates}
            save_json("agents.json", agents)
            return agents[i]
    raise HTTPException(status_code=404, detail="Agent not found")


@app.delete("/api/agents/{agent_id}")
def delete_agent(agent_id: int, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    agents = load_json("agents.json")
    filtered = [a for a in agents if a["id"] != agent_id]
    if len(filtered) == len(agents):
        raise HTTPException(status_code=404, detail="Agent not found")
    save_json("agents.json", filtered)
    return {"success": True}


# ---------- Admin (protected via X-Admin-Key header) ----------
@app.get("/api/admin/verify")
def check_admin_key(x_admin_key: Optional[str] = Header(default=None)):
    if not x_admin_key or x_admin_key != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin key")
    return {"success": True}


@app.post("/api/properties")
def create_property(payload: PropertyIn, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    properties = load_json("properties.json")
    new_id = max([p["id"] for p in properties], default=0) + 1
    base_slug = slugify(f"{payload.title}-{payload.city}")
    slug = base_slug
    existing_slugs = {p["slug"] for p in properties}
    suffix = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    record = payload.dict()
    record["id"] = new_id
    record["slug"] = slug
    record["createdAt"] = datetime.utcnow().strftime("%Y-%m-%d")
    record["views"] = 0
    if not record.get("priceDisplay"):
        record["priceDisplay"] = f"₹{record['price']:,.0f}"

    properties.append(record)
    save_json("properties.json", properties)
    notify_matching_alerts(record)
    return record


def notify_matching_alerts(property_record: dict):
    """
    Checks saved property alerts against a newly created listing and emails
    anyone whose saved criteria (purpose/area/type/budget) match. Runs
    best-effort — a slow/failed email never blocks property creation.
    """
    alerts = load_json("property_alerts.json")
    if not alerts:
        return

    for alert in alerts:
        if alert.get("purpose") and alert["purpose"] != property_record.get("purpose"):
            continue
        if alert.get("area") and alert["area"].lower() != (property_record.get("area") or "").lower():
            continue
        if alert.get("property_type") and alert["property_type"] != property_record.get("propertyType"):
            continue
        if alert.get("max_budget") and property_record.get("price", 0) > alert["max_budget"]:
            continue

        property_url = f"{SITE_URL}/properties/{property_record.get('slug')}"
        send_email(
            alert.get("email"),
            f"Naya Matching Property: {property_record.get('title')}",
            f"""
            <p>Namaste {alert.get('name', '')},</p>
            <p>Aapke saved alert se match karti hui ek nayi property list hui hai:</p>
            <h3>{property_record.get('title')}</h3>
            <p>{property_record.get('area', '')}, {property_record.get('city', '')} — {property_record.get('priceDisplay', '')}</p>
            <p><a href="{property_url}">Poori details yahan dekhein →</a></p>
            <p>— Skyline Properties, Gorakhpur</p>
            """,
        )


@app.put("/api/properties/{slug_or_id}")
def update_property(slug_or_id: str, payload: PropertyUpdate, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    properties = load_json("properties.json")
    for i, p in enumerate(properties):
        if p.get("slug") == slug_or_id or str(p["id"]) == slug_or_id:
            updates = {k: v for k, v in payload.dict().items() if v is not None}
            properties[i] = {**p, **updates}
            save_json("properties.json", properties)
            return properties[i]
    raise HTTPException(status_code=404, detail="Property not found")


@app.delete("/api/properties/{slug_or_id}")
def delete_property(slug_or_id: str, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    properties = load_json("properties.json")
    filtered = [p for p in properties if not (p.get("slug") == slug_or_id or str(p["id"]) == slug_or_id)]
    if len(filtered) == len(properties):
        raise HTTPException(status_code=404, detail="Property not found")
    save_json("properties.json", filtered)
    return {"success": True}


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


@app.post("/api/blog")
def create_blog_post(payload: BlogPostIn, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    posts = load_json("blog.json")
    new_id = max([p["id"] for p in posts], default=0) + 1
    base_slug = slugify(payload.title)
    slug = base_slug
    existing_slugs = {p["slug"] for p in posts}
    suffix = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    record = payload.dict()
    record["id"] = new_id
    record["slug"] = slug
    record["date"] = datetime.utcnow().strftime("%b %d, %Y")
    if not record.get("image"):
        record["image"] = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80"

    posts.insert(0, record)  # newest first
    save_json("blog.json", posts)
    return record


@app.put("/api/blog/{slug}")
def update_blog_post(slug: str, payload: BlogPostUpdate, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    posts = load_json("blog.json")
    for i, p in enumerate(posts):
        if p.get("slug") == slug:
            updates = {k: v for k, v in payload.dict().items() if v is not None}
            posts[i] = {**p, **updates}
            save_json("blog.json", posts)
            return posts[i]
    raise HTTPException(status_code=404, detail="Post not found")


@app.delete("/api/blog/{slug}")
def delete_blog_post(slug: str, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    posts = load_json("blog.json")
    filtered = [p for p in posts if p.get("slug") != slug]
    if len(filtered) == len(posts):
        raise HTTPException(status_code=404, detail="Post not found")
    save_json("blog.json", filtered)
    # Also clean up comments belonging to the deleted post
    comments = load_json("comments.json")
    save_json("comments.json", [c for c in comments if c.get("blog_slug") != slug])
    return {"success": True}


# ---------- Blog comments (require admin approval before showing publicly) ----------
@app.get("/api/blog/{slug}/comments")
def get_approved_comments(slug: str):
    comments = load_json("comments.json")
    return [c for c in comments if c.get("blog_slug") == slug and c.get("approved")]


@app.post("/api/blog/{slug}/comments")
def submit_comment(slug: str, payload: CommentIn):
    posts = load_json("blog.json")
    if not any(p["slug"] == slug for p in posts):
        raise HTTPException(status_code=404, detail="Post not found")

    comments = load_json("comments.json")
    new_id = max([c["id"] for c in comments], default=0) + 1
    comment = {
        "id": new_id,
        "blog_slug": slug,
        "name": payload.name,
        "email": payload.email,
        "comment": payload.comment,
        "created_at": datetime.utcnow().isoformat(),
        "approved": False,
    }
    comments.append(comment)
    save_json("comments.json", comments)
    return {"success": True, "message": "Comment submit ho gaya! Admin approve karne ke baad website par dikhega."}


@app.get("/api/admin/leads")
def get_all_leads(x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    contact_submissions = load_json("contact_submissions.json")
    property_alerts = load_json("property_alerts.json")

    leads = []
    for c in contact_submissions:
        leads.append({
            "type": "Contact Form",
            "name": c.get("name"),
            "contact": c.get("email"),
            "detail": c.get("message", ""),
            "date": c.get("received_at"),
        })
    for a in property_alerts:
        leads.append({
            "type": "Property Alert",
            "name": a.get("name"),
            "contact": f"{a.get('phone', '')} / {a.get('email', '')}",
            "detail": f"Purpose: {a.get('purpose', 'any')} • Area: {a.get('area', 'any')} • Type: {a.get('property_type', 'any')} • Budget: {a.get('max_budget', 'n/a')}",
            "date": a.get("created_at"),
        })
    leads.sort(key=lambda l: l.get("date") or "", reverse=True)
    return leads


@app.get("/api/admin/analytics")
def get_analytics(x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)

    properties = load_json("properties.json")
    agents = load_json("agents.json")
    blog_posts = load_json("blog.json")
    testimonials = load_json("testimonials.json")
    comments = load_json("comments.json")
    users = load_json("users.json")
    contact_submissions = load_json("contact_submissions.json")
    property_alerts = load_json("property_alerts.json")

    # Property type breakdown
    type_counts = {}
    for p in properties:
        t = p.get("propertyType", "Other")
        type_counts[t] = type_counts.get(t, 0) + 1

    # Sale vs rent breakdown
    purpose_counts = {"sale": 0, "rent": 0}
    for p in properties:
        purpose = p.get("purpose", "sale")
        purpose_counts[purpose] = purpose_counts.get(purpose, 0) + 1

    # Top 5 most-viewed properties
    top_properties = sorted(properties, key=lambda p: p.get("views", 0), reverse=True)[:5]
    top_properties = [{"title": p["title"], "slug": p["slug"], "views": p.get("views", 0)} for p in top_properties]

    # Recent leads (contact submissions + property alerts), newest first
    leads = []
    for c in contact_submissions:
        leads.append({
            "type": "Contact Form",
            "name": c.get("name"),
            "contact": c.get("email"),
            "detail": c.get("message", "")[:80],
            "date": c.get("received_at"),
        })
    for a in property_alerts:
        leads.append({
            "type": "Property Alert",
            "name": a.get("name"),
            "contact": a.get("phone") or a.get("email"),
            "detail": f"{a.get('purpose', 'any')} • {a.get('area', 'any area')} • budget: {a.get('max_budget', 'n/a')}",
            "date": a.get("created_at"),
        })
    leads.sort(key=lambda l: l.get("date") or "", reverse=True)

    return {
        "counts": {
            "properties": len(properties),
            "agents": len(agents),
            "blog_posts": len(blog_posts),
            "testimonials": len(testimonials),
            "pending_comments": len([c for c in comments if not c.get("approved")]),
            "approved_comments": len([c for c in comments if c.get("approved")]),
            "registered_users": len(users),
            "total_leads": len(contact_submissions) + len(property_alerts),
        },
        "type_counts": type_counts,
        "purpose_counts": purpose_counts,
        "top_properties": top_properties,
        "recent_leads": leads[:10],
    }


@app.get("/api/admin/comments")
def list_all_comments(status: Optional[str] = None, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    comments = load_json("comments.json")
    if status == "pending":
        comments = [c for c in comments if not c.get("approved")]
    elif status == "approved":
        comments = [c for c in comments if c.get("approved")]
    return sorted(comments, key=lambda c: c.get("created_at", ""), reverse=True)


@app.put("/api/admin/comments/{comment_id}/approve")
def approve_comment(comment_id: int, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    comments = load_json("comments.json")
    for c in comments:
        if c["id"] == comment_id:
            c["approved"] = True
            save_json("comments.json", comments)
            return c
    raise HTTPException(status_code=404, detail="Comment not found")


@app.delete("/api/admin/comments/{comment_id}")
def delete_comment(comment_id: int, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    comments = load_json("comments.json")
    filtered = [c for c in comments if c["id"] != comment_id]
    if len(filtered) == len(comments):
        raise HTTPException(status_code=404, detail="Comment not found")
    save_json("comments.json", filtered)
    return {"success": True}


# ---------- Auth ----------
@app.post("/api/auth/register")
def register(payload: UserRegister):
    users = load_json("users.json")
    if any(u["email"].lower() == payload.email.lower() for u in users):
        raise HTTPException(status_code=400, detail="Is email se pehle se ek account bana hua hai")

    new_id = max([u["id"] for u in users], default=0) + 1
    user = {
        "id": new_id,
        "name": payload.name,
        "email": payload.email,
        "password_hash": pwd_context.hash(payload.password),
        "created_at": datetime.utcnow().isoformat(),
    }
    users.append(user)
    save_json("users.json", users)

    token = create_token(new_id, payload.email)
    return {"token": token, "user": {"id": new_id, "name": payload.name, "email": payload.email}}


@app.post("/api/auth/login")
def login(payload: UserLogin):
    users = load_json("users.json")
    user = next((u for u in users if u["email"].lower() == payload.email.lower()), None)
    if not user or not pwd_context.verify(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ya password galat hai")

    token = create_token(user["id"], user["email"])
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}


@app.get("/api/auth/me")
def get_me(current=Depends(get_current_user)):
    users = load_json("users.json")
    user = next((u for u in users if u["id"] == current["user_id"]), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


@app.post("/api/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    users = load_json("users.json")
    user = next((u for u in users if u["email"].lower() == payload.email.lower()), None)

    # Always return the same success message whether or not the email is
    # registered — this avoids leaking which emails have accounts.
    if user:
        reset_payload = {
            "user_id": user["id"],
            "email": user["email"],
            "purpose": "reset",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(reset_payload, JWT_SECRET, algorithm="HS256")
        reset_link = f"{SITE_URL}/reset-password?token={token}"
        send_email(
            user["email"],
            "Password Reset — Skyline Properties",
            f"""
            <p>Namaste {user['name']},</p>
            <p>Aapne apna password reset karne ki request ki hai. Neeche diye gaye link par click karke naya password set karein:</p>
            <p><a href="{reset_link}">Password Reset Karein →</a></p>
            <p style="color:#6b7a90;font-size:13px;">Ye link 1 ghante ke liye valid hai. Agar aapne ye request nahi ki, to is email ko ignore kar dein — aapka password nahi badlega.</p>
            <p>— Skyline Properties, Gorakhpur</p>
            """,
        )

    return {"success": True, "message": "Agar ye email registered hai, to reset link bhej diya gaya hai. Apna inbox check karein."}


@app.post("/api/auth/reset-password")
def reset_password(payload: ResetPasswordRequest):
    try:
        decoded = jwt.decode(payload.token, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Reset link invalid ya expire ho chuka hai. Dobara try karein.")

    if decoded.get("purpose") != "reset":
        raise HTTPException(status_code=400, detail="Invalid reset link")

    users = load_json("users.json")
    user = next((u for u in users if u["id"] == decoded["user_id"]), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["password_hash"] = pwd_context.hash(payload.new_password)
    save_json("users.json", users)
    return {"success": True, "message": "Password successfully reset ho gaya! Ab naye password se login karein."}


# ---------- Favorites (requires login) ----------
@app.get("/api/favorites")
def get_favorites(current=Depends(get_current_user)):
    favorites = load_json("favorites.json")
    my_slugs = {f["slug"] for f in favorites if f["user_id"] == current["user_id"]}
    properties = load_json("properties.json")
    return [p for p in properties if p["slug"] in my_slugs]


@app.post("/api/favorites/{slug}")
def add_favorite(slug: str, current=Depends(get_current_user)):
    properties = load_json("properties.json")
    if not any(p["slug"] == slug for p in properties):
        raise HTTPException(status_code=404, detail="Property not found")

    favorites = load_json("favorites.json")
    if not any(f["user_id"] == current["user_id"] and f["slug"] == slug for f in favorites):
        favorites.append({"user_id": current["user_id"], "slug": slug, "created_at": datetime.utcnow().isoformat()})
        save_json("favorites.json", favorites)
    return {"success": True}


@app.delete("/api/favorites/{slug}")
def remove_favorite(slug: str, current=Depends(get_current_user)):
    favorites = load_json("favorites.json")
    favorites = [f for f in favorites if not (f["user_id"] == current["user_id"] and f["slug"] == slug)]
    save_json("favorites.json", favorites)
    return {"success": True}


@app.get("/api/settings")
def get_settings():
    return load_json("settings.json")


@app.put("/api/settings")
def update_settings(payload: SiteSettingsUpdate, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    settings = load_json("settings.json")
    updates = {k: v for k, v in payload.dict().items() if v is not None}
    settings = {**settings, **updates}
    save_json("settings.json", settings)
    return settings


@app.get("/api/testimonials")
def get_testimonials():
    return load_json("testimonials.json")


@app.post("/api/testimonials")
def create_testimonial(payload: TestimonialIn, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    testimonials = load_json("testimonials.json")
    new_id = max([t["id"] for t in testimonials], default=0) + 1
    record = payload.dict()
    record["id"] = new_id
    if not record.get("photo"):
        record["photo"] = "https://randomuser.me/api/portraits/lego/2.jpg"
    testimonials.append(record)
    save_json("testimonials.json", testimonials)
    return record


@app.put("/api/testimonials/{testimonial_id}")
def update_testimonial(testimonial_id: int, payload: TestimonialUpdate, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    testimonials = load_json("testimonials.json")
    for i, t in enumerate(testimonials):
        if t["id"] == testimonial_id:
            updates = {k: v for k, v in payload.dict().items() if v is not None}
            testimonials[i] = {**t, **updates}
            save_json("testimonials.json", testimonials)
            return testimonials[i]
    raise HTTPException(status_code=404, detail="Testimonial not found")


@app.delete("/api/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: int, x_admin_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_key)
    testimonials = load_json("testimonials.json")
    filtered = [t for t in testimonials if t["id"] != testimonial_id]
    if len(filtered) == len(testimonials):
        raise HTTPException(status_code=404, detail="Testimonial not found")
    save_json("testimonials.json", filtered)
    return {"success": True}


@app.post("/api/contact")
def submit_contact(payload: ContactMessage):
    entries = load_json("contact_submissions.json")
    entry = payload.dict()
    entry["received_at"] = datetime.utcnow().isoformat()
    entries.append(entry)
    save_json("contact_submissions.json", entries)
    return {"success": True, "message": "Thanks! A Skyline agent will reach out shortly."}


@app.post("/api/newsletter")
def subscribe_newsletter(payload: NewsletterSignup):
    # In production, push this to an email provider (Mailchimp, Resend, etc.)
    return {"success": True, "message": f"Subscribed {payload.email} successfully."}


@app.post("/api/property-alerts")
def create_property_alert(payload: PropertyAlert):
    """
    Captures a buyer's search criteria so the team can follow up when a
    matching property is listed. NOTE: matching-property emails go out
    automatically (see notify_matching_alerts below) once Brevo is
    configured — but there's no scheduled re-check job, so alerts only
    fire at the moment a new property is created via the admin panel.
    """
    entries = load_json("property_alerts.json")
    entry = payload.dict()
    entry["created_at"] = datetime.utcnow().isoformat()
    entries.append(entry)
    save_json("property_alerts.json", entries)

    # Confirmation email to the buyer (best-effort — doesn't block the response)
    send_email(
        payload.email,
        "Aapka Property Alert Set Ho Gaya — Skyline Properties",
        f"""
        <p>Namaste {payload.name},</p>
        <p>Aapka property alert successfully save ho gaya hai:</p>
        <ul>
          <li><b>Purpose:</b> {payload.purpose or 'Any'}</li>
          <li><b>Area:</b> {payload.area or 'Koi bhi'}</li>
          <li><b>Property Type:</b> {payload.property_type or 'Koi bhi'}</li>
          <li><b>Max Budget:</b> {f"₹{payload.max_budget:,.0f}" if payload.max_budget else 'Not specified'}</li>
        </ul>
        <p>Jaise hi koi matching property list hoti hai, aapko turant email milegi.</p>
        <p>— Skyline Properties, Gorakhpur</p>
        """,
    )

    # Notify admin/owner of the new lead
    if ADMIN_EMAIL:
        send_email(
            ADMIN_EMAIL,
            f"Naya Property Alert Lead: {payload.name}",
            f"""
            <p>Naya lead aaya hai:</p>
            <ul>
              <li><b>Name:</b> {payload.name}</li>
              <li><b>Phone:</b> {payload.phone}</li>
              <li><b>Email:</b> {payload.email}</li>
              <li><b>Purpose:</b> {payload.purpose or 'Any'}</li>
              <li><b>Area:</b> {payload.area or 'Any'}</li>
              <li><b>Type:</b> {payload.property_type or 'Any'}</li>
              <li><b>Budget:</b> {f"₹{payload.max_budget:,.0f}" if payload.max_budget else 'Not specified'}</li>
            </ul>
            """,
        )

    return {"success": True, "message": "Alert saved! Hum matching property milte hi aapko email karenge."}
