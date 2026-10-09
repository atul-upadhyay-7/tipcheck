"""Request and response models for the public API."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .config import MAX_TEXT_LENGTH, MIN_TEXT_LENGTH


class AnalyzeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
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

Answer = Literal['yes', 'no', 'unknown']


class PreflightRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    text: str = Field(default='', max_length=MAX_TEXT_LENGTH)
    first_payment: Answer = 'unknown'
    name_match: Answer = 'unknown'
    unusual_amount: Answer = 'unknown'
    pressure: Answer = 'unknown'
    pin_to_receive: Answer = 'unknown'
    remote_access: Answer = 'unknown'


class ContextSignal(BaseModel):
    id: str
    weight: int
    en: str
    hi: str
    source: str


class URLCheck(BaseModel):
    host: str
    hints: list[str]
    status: Literal['structure_only']


class PreflightDetails(BaseModel):
    score: int
    level: str
    components: dict[str, int]
    signals: list[ContextSignal]
    url_checks: list[URLCheck]
    unknown_context: list[str]
    message_provided: bool
    reputation_status: Literal['not_connected']
    recommendation: str
    payment_control: Literal['none']
    score_version: str


class PreflightResponse(AnalyzeResponse):
    preflight: PreflightDetails
