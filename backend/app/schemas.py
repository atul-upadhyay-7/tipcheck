"""Request and response models for the public API."""
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from .config import MAX_TEXT_LENGTH, MIN_TEXT_LENGTH


class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=MIN_TEXT_LENGTH, max_length=MAX_TEXT_LENGTH)

    @field_validator("text")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if len(v.strip()) < MIN_TEXT_LENGTH:
            raise ValueError(f"Enter a message with at least {MIN_TEXT_LENGTH} characters.")
        return v


class Flag(BaseModel):
    id: str
    phrase: str
    weight: int
    en: str
    hi: str
    source: str


class AnalyzeResponse(BaseModel):
    label: str
    mode: str
    model_scores: Optional[dict[str, float]] = None
    risk_score: int
    risk_level: str
    flags: list[Flag]
    context_warning: bool
    links: list[str]
    verification_status: str
    note: str


class HealthResponse(BaseModel):
    ok: bool
    mode: str
