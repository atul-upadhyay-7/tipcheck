"""FastAPI entrypoint. Run from backend/: uvicorn app.main:app --reload"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import config
from .api.routes import router


def create_app() -> FastAPI:
    app = FastAPI(title="TipCheck API", version="0.2.0",
                  description="Educational red-flag check for financial messages. Not investment advice.")
    if config.CORS_ORIGINS:
        app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS,
                           allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
    app.include_router(router)
    return app


app = create_app()
