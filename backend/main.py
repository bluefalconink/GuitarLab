"""
GuitarLab - FastAPI Application Entry Point
"""
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routes.chat import router as chat_router
from routes.upload import router as upload_router
from routes.health import router as health_router
from rag.knowledge_store import KnowledgeStore

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("guitar_setup_buddy")


# ---------------------------------------------------------------------------
# Lifespan — startup / shutdown hooks
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: ensure upload dir exists, load RAG knowledge base."""
    logger.info("🎸 Guitar Setup Buddy starting up …")

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info("Upload directory ready: %s", settings.UPLOAD_DIR)

    # Initialize RAG knowledge store
    try:
        knowledge_store = KnowledgeStore()
        knowledge_store.load_knowledge_base()
        app.state.knowledge_store = knowledge_store
        logger.info("RAG knowledge base loaded successfully")
    except Exception as e:
        logger.error("Failed to load knowledge base: %s", e)
        app.state.knowledge_store = None

    yield  # ← application runs here

    logger.info("🎸 Guitar Setup Buddy shutting down …")


# ---------------------------------------------------------------------------
# Create FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-driven guitar setup guidance with Master Luthier and Tone & Electrical Guru agents",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Static files — serve uploaded images
# ---------------------------------------------------------------------------
uploads_path = Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(upload_router, prefix="/api", tags=["Upload"])

logger.info(
    "%s v%s initialised — routes registered",
    settings.APP_NAME,
    settings.APP_VERSION,
)
