"""FastAPI entrypoint. Run from backend/: uvicorn app.main:app --reload"""
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from . import config
from .api.routes import router


def create_app() -> FastAPI:
    app = FastAPI(title="TipCheck API", version="0.2.0",
                  description="Educational red-flag check for financial messages. Not investment advice.")
    @app.exception_handler(RequestValidationError)
    async def validation_error(_request: Request, exc: RequestValidationError):
        # Pydantic's default errors echo rejected input, which may contain private text.
        errors = [{"loc": list(error["loc"]), "msg": error["msg"], "type": error["type"]}
                  for error in exc.errors()]
        return JSONResponse(status_code=422, content={"detail": errors})

    if config.CORS_ORIGINS:
        app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS,
                           allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
    app.include_router(router)  # Existing local/dev endpoints remain compatible.
    app.include_router(router, prefix="/api", include_in_schema=False)
    if config.FRONTEND_DIST.is_dir():
        # Mount last: /api and /docs must never be swallowed by static handling.
        app.mount("/", StaticFiles(directory=config.FRONTEND_DIST, html=True), name="frontend")
    return app


app = create_app()
