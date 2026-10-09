from fastapi import APIRouter

from ..schemas import AnalyzeRequest, AnalyzeResponse, HealthResponse, PreflightRequest, PreflightResponse
from ..services import analyzer, model, preflight

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health():
    return {"ok": True, "mode": model.mode()}


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    # Never log req.text: users may paste private messages.
    return analyzer.analyze(req.text)


@router.post('/preflight', response_model=PreflightResponse)
def preflight_check(req: PreflightRequest):
    return preflight.check(req)
