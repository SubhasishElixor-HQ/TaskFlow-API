from functools import lru_cache
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "TaskFlow API"
    environment: str = "development"
    debug: bool = False
    database_url: str = "postgresql+psycopg://taskflow:taskflow_dev_only@localhost:5432/taskflow"
    jwt_secret_key: str = "CHANGE_ME_TO_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: list[str] = []
    password_min_length: int = 12

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore", case_sensitive=False)

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_secret(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError("JWT_SECRET_KEY must contain at least 32 characters")
        if value == "CHANGE_ME_TO_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS":
            # Permit local development only; production validation occurs below.
            return value
        return value

    def validate_production(self) -> None:
        if self.environment.lower() == "production":
            if self.debug:
                raise ValueError("DEBUG must be false in production")
            if self.jwt_secret_key == "CHANGE_ME_TO_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS":
                raise ValueError("Set a unique JWT_SECRET_KEY in production")
            if not self.database_url.startswith("postgresql+psycopg://"):
                raise ValueError("Production DATABASE_URL must use PostgreSQL with psycopg")

@lru_cache
def get_settings() -> Settings:
    result = Settings()
    result.validate_production()
    return result

settings = get_settings()
