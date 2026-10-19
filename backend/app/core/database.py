import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings, BACKEND_DIR

db_url = settings.DATABASE_URL
if db_url.startswith("sqlite:///"):
    path_part = db_url[len("sqlite:///"):]
    if not os.path.isabs(path_part) and not (len(path_part) > 2 and path_part[1] == ":"):
        clean_rel = path_part.removeprefix("./")
        abs_path = os.path.join(BACKEND_DIR, clean_rel).replace("\\", "/")
        db_url = f"sqlite:///{abs_path}"

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if db_url.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()