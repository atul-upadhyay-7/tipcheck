import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.preflight import inspect_urls

client = TestClient(app)


def check(**kwargs):
    r = client.post('/api/preflight', json=kwargs)
    assert r.status_code == 200, r.text
    return r.json()['preflight']


def test_unknowns_are_not_safe():
    p = check()
    assert p['score'] == 0
    assert len(p['unknown_context']) == 6
    assert not p['message_provided']
    assert p['reputation_status'] == 'not_connected'
    assert p['payment_control'] == 'none'
    assert p['recommendation'] == 'verify_before_paying'


@pytest.mark.parametrize('field', ['pin_to_receive', 'remote_access'])
def test_harmful_context_can_warn_without_a_message(field):
    p = check(**{field: 'yes'})
    assert p['level'] == 'high'
    assert p['components']['context'] == 60
    assert p['recommendation'] == 'stop_and_verify'


def test_first_payment_alone_not_suspicious():
    assert check(first_payment='yes')['score'] == 0
    assert check(first_payment='yes', unusual_amount='yes')['score'] == 15


def test_name_match_polarity():
    assert check(name_match='yes')['score'] == 0
    assert check(name_match='no')['score'] == 35


def test_fusion_and_cap():
    p = check(text='Invest 499 and I will give you 1500.', name_match='no', pressure='yes')
    assert p['components'] == {'message': 60, 'context': 55, 'url': 0}
    assert p['score'] == 100
    p = check(name_match='no', pressure='yes', remote_access='yes')
    assert p['components']['context'] == 60


def test_negative_answers_do_not_lower_message_flags():
    p = check(text='Guaranteed returns. Double your money.', name_match='yes', pressure='no')
    assert p['score'] == p['components']['message']
    assert p['score'] >= 50


@pytest.mark.parametrize('text,hint', [
    ('https://bank.test@evil.test/path', 'embedded_credentials'),
    ('http://127.0.0.1/admin', 'ip_address'),
    ('https://bit.ly/example', 'shortened_link'),
    ('https://xn--bank-scam.test/path', 'internationalized_domain'),
    ('https://example.test:bad/path', 'malformed_link'),
    ('https://[broken', 'malformed_link'),
    ('https://example.test/app.apk', 'android_download'),
    ('www.bit.ly/example', 'shortened_link'),
])
def test_url_hints(text, hint):
    urls = inspect_urls(text)
    assert hint in urls[0]['hints']


def test_hosts_use_actual_destination_without_opening():
    p = check(text='See https://bank.test@evil.test/private?token=SECRET')
    assert p['url_checks'][0]['host'] == 'evil.test'
    assert 'SECRET' not in str(p)
    assert p['components']['url'] == 10


def test_normal_https_is_unverified_not_safe():
    p = check(text='Visit https://example.test/shop')
    assert p['url_checks'][0]['hints'] == []
    assert p['reputation_status'] == 'not_connected'
    assert p['score'] == 0


def test_repeated_urls_are_not_multiple_penalties():
    p = check(text='http://127.0.0.1 ' * 20)
    assert len(p['url_checks']) == 5
    assert p['components']['url'] == 10


@pytest.mark.parametrize('body', [{'pressure': 'maybe'}, {'text': 'PRIVATE' * 400}, {'remote_access': True}])
def test_strict_values_and_private_error_handling(body):
    r = client.post('/api/preflight', json=body)
    assert r.status_code == 422
    assert 'PRIVATE' not in r.text
    assert all('input' not in e for e in r.json()['detail'])


def test_correlated_content_context_does_not_double_count():
    p = check(text='Enter your UPI PIN to receive money.', pin_to_receive='yes')
    assert p['components']['message'] == 60
    assert p['components']['context'] == 0
    assert p['score'] == 60
    assert p['signals'][0]['weight'] == 0


def test_private_url_never_fetches(monkeypatch):
    import socket
    def forbidden(*args, **kwargs):
        raise AssertionError('network access attempted')
    monkeypatch.setattr(socket, 'getaddrinfo', forbidden)
    p = check(text='http://169.254.169.254/latest/meta-data/')
    assert p['url_checks'][0]['host'] == '169.254.169.254'
