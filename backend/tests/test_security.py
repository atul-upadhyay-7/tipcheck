"""Fictional hostile requests only. These tests are not a penetration audit."""
import pytest
from fastapi.testclient import TestClient

from app.main import create_app

client = TestClient(create_app())


@pytest.mark.parametrize('path', ['/analyze', '/api/analyze', '/preflight', '/api/preflight'])
def test_private_response_is_not_cacheable(path):
    response = client.post(path, json={'text': 'ordinary fictional message'})
    assert response.status_code == 200
    assert response.headers['cache-control'] == 'no-store'
    assert response.headers['x-content-type-options'] == 'nosniff'
    assert response.headers['referrer-policy'] == 'no-referrer'
    assert response.headers['x-frame-options'] == 'DENY'


@pytest.mark.parametrize('path', ['/api/analyze', '/api/preflight'])
def test_oversize_json_is_bounded_without_echo(path):
    marker = 'fictional-private-marker'
    response = client.post(path, content=marker * 2000, headers={'Content-Type': 'application/json'})
    assert response.status_code == 413
    assert marker not in response.text
    assert response.headers['cache-control'] == 'no-store'


@pytest.mark.parametrize('extra', ['recipient_name', 'bank_account', 'otp', 'future_instruction'])
def test_unknown_fields_are_rejected_not_silently_collected(extra):
    marker = 'fictional-secret'
    response = client.post('/api/preflight', json={'text': '', extra: marker})
    assert response.status_code == 422
    assert marker not in response.text


@pytest.mark.parametrize('text', [None, 42, [], {}])
def test_text_types_are_strict_and_errors_are_private(text):
    response = client.post('/api/analyze', json={'text': text})
    assert response.status_code == 422
    assert all('input' not in item for item in response.json()['detail'])


def test_chunked_body_is_bounded():
    response = client.post('/api/preflight', content=iter([b'x' * 9000, b'y' * 9000]))
    assert response.status_code == 413


def test_cors_does_not_grant_unknown_site():
    response = client.options('/api/preflight', headers={'Origin': 'https://attacker.invalid', 'Access-Control-Request-Method': 'POST'})
    assert 'access-control-allow-origin' not in response.headers
