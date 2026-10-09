"""Bound incoming bodies and avoid caching private analysis. No user history."""
from starlette.responses import JSONResponse

MAX_BODY_BYTES = 16384


class SafetyMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)

        async def safe_send(message):
            if message['type'] == 'http.response.start':
                headers = list(message.get('headers', []))
                headers.extend([(b'x-content-type-options', b'nosniff'),
                                (b'referrer-policy', b'no-referrer'),
                                (b'x-frame-options', b'DENY')])
                if scope['path'].startswith(('/api/', '/analyze', '/preflight')):
                    headers.append((b'cache-control', b'no-store'))
                message = {**message, 'headers': headers}
            await send(message)

        body = b''
        if scope['method'] == 'POST':
            while True:
                message = await receive()
                if message['type'] == 'http.disconnect':
                    return
                body += message.get('body', b'')
                if len(body) > MAX_BODY_BYTES:
                    return await JSONResponse({'detail': 'Request too large.'}, status_code=413)(scope, receive, safe_send)
                if not message.get('more_body', False):
                    break
        delivered = False

        async def replay():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {'type': 'http.request', 'body': body, 'more_body': False}
            return await receive()

        await self.app(scope, replay if scope['method'] == 'POST' else receive, safe_send)
