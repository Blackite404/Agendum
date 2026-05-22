"""
Configuration management using environment variables

Loads settings from environment-specific .env files in the env/ folder.
Priority: env/{ENVIRONMENT}.env > .env > Settings defaults
"""
from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
from pathlib import Path
import os


def get_env_file_path() -> Optional[str]:
    """
    Determine which .env file to use based on ENVIRONMENT variable.

    Returns:
        Path to the env file if it exists, None otherwise
    """
    # Get the project root directory (parent of app/)
    project_root = Path(__file__).parent.parent.parent

    # Check ENVIRONMENT variable (default to 'dev')
    #environment = os.getenv("ENVIRONMENT", "dev").lower()

    # Look for environment-specific file in env/ folder
    #env_file = project_root/ f".env.{environment}"
    #if env_file.exists():
    #    return str(env_file)

    # Fallback to .env in project root
    root_env_file = project_root / ".env"
    if root_env_file.exists():
        return str(root_env_file)

    # No env file found, will use defaults
    return None


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    APP_NAME: str = "Agendum"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "dev"  # dev, qa, prod

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "agendum"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "mammoth"
    DB_SCHEMA: str = "taskapp"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    LOG_MAX_BYTES: int = 10485760  # 10MB
    LOG_BACKUP_COUNT: int = 5

    # CORS
    # Allows localhost as well.
    CORS_ORIGINS: list = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5432",
        "http://127.0.0.1:5432"
    ]

    @property
    def database_url(self) -> str:
        """Construct database URL"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in env file


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.

    Loads settings from environment-specific .env file if it exists,
    otherwise uses Settings class defaults.
    """
    env_file = get_env_file_path()
    if env_file:
        return Settings(_env_file=env_file)
    return Settings()


settings = get_settings()
