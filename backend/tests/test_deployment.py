"""Single-origin production routing must work without the Vite dev proxy."""
from fastapi.testclient import TestClient

from app import config
from app.main import create_app


def test_api_alias_works_without_frontend(monkeypatch, tmp_path):
    monkeypatch.setattr(config, "FRONTEND_DIST", tmp_path / "missing")
    client = TestClient(create_app())
    assert client.get("/api/health").json()["ok"] is True
    assert client.post("/api/analyze", json={"text": "Join VIP for guaranteed returns"}).json()["label"] == "promotion"
    assert client.get("/health").status_code == 200


def test_static_frontend_does_not_swallow_api_or_docs(monkeypatch, tmp_path):
    (tmp_path / "index.html").write_text("<h1>TipCheck test build</h1>")
    assets = tmp_path / "assets"
    assets.mkdir()
    (assets / "test.js").write_text("console.log('test')")
    monkeypatch.setattr(config, "FRONTEND_DIST", tmp_path)
    client = TestClient(create_app())
    assert "TipCheck test build" in client.get("/").text
    assert client.get("/assets/test.js").status_code == 200
    assert client.get("/api/health").json()["ok"] is True
    assert client.get("/api/missing").status_code == 404
    assert client.get("/docs").status_code == 200
