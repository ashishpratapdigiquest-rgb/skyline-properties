"""
Database-backed storage (PostgreSQL via Supabase), designed as a drop-in
replacement for local JSON files.

Why this approach: instead of rewriting every endpoint to use an ORM model
per table, each "file" (properties.json, agents.json, etc.) is stored as a
single JSONB row keyed by its filename. This keeps every existing endpoint
in main.py completely unchanged — they still call load_json()/save_json()
exactly as before. Only the storage backend changes, which makes this a
much lower-risk migration.

On first read of a key that doesn't exist in the DB yet, it auto-seeds from
the local JSON file shipped in the repo (so existing data isn't lost).

Falls back to plain local JSON files automatically if DATABASE_URL isn't
set, so local development without Postgres still works exactly as before.
"""
import os
import json
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL")
USE_DATABASE = bool(DATABASE_URL)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

Base = declarative_base()


class DataStore(Base):
    __tablename__ = "data_store"
    key = Column(String, primary_key=True)
    value = Column(JSONB)


engine = None
SessionLocal = None

if USE_DATABASE:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)  # creates data_store table if it doesn't exist yet


def _default_for(filename):
    """Empty-state default for a dataset that has never been written yet."""
    return {} if filename == "settings.json" else []


def load_json(filename):
    key = filename.replace(".json", "")

    if not USE_DATABASE:
        path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(path):
            return _default_for(filename)
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    db = SessionLocal()
    try:
        row = db.query(DataStore).filter(DataStore.key == key).first()
        if row is not None:
            return row.value

        # First time this key is read: seed from the local JSON file
        # shipped in the repo (if present), so existing data carries over.
        local_path = os.path.join(DATA_DIR, filename)
        if os.path.exists(local_path):
            with open(local_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = _default_for(filename)

        db.add(DataStore(key=key, value=data))
        db.commit()
        return data
    finally:
        db.close()


def save_json(filename, data):
    key = filename.replace(".json", "")

    if not USE_DATABASE:
        with open(os.path.join(DATA_DIR, filename), "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return

    db = SessionLocal()
    try:
        row = db.query(DataStore).filter(DataStore.key == key).first()
        if row is not None:
            row.value = data
        else:
            row = DataStore(key=key, value=data)
            db.add(row)
        db.commit()
    finally:
        db.close()
