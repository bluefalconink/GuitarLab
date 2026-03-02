"""
GuitarLab - Backend Configuration
Loads environment variables and provides app-wide settings.
"""
import os
from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Keys
    GEMINI_API_KEY: str = ""

    # App Config
    APP_NAME: str = "Guitar Setup Buddy"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # File Uploads
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]
    UPLOAD_DIR: str = str(Path(__file__).parent / "uploads")

    # Database
    DATABASE_URL: str = "sqlite:///./guitar_setup_buddy.db"

    # AI Model
    AI_MODEL: str = "gemini-2.5-flash"
    MAX_TOKENS: int = 4096

    # RAG
    CHROMA_PERSIST_DIR: str = str(Path(__file__).parent / "data" / "chroma")
    KNOWLEDGE_BASE_PATH: str = str(
        Path(__file__).parent.parent / "electronics_knowledge_base.json"
    )

    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")
        env_file_encoding = "utf-8"


settings = Settings()
