from fastapi.testclient import TestClient
from main import app
c=TestClient(app)
assert c.get('/health').json()['ok']
r=c.post('/analyze',json={'text':'Guaranteed returns! Double your money. Join VIP, limited seats, pay first.'}).json()
assert r['risk_level']=='high' and r['label']=='promotion'
r=c.post('/analyze',json={'text':'Beware of guaranteed returns. Never transfer money to an unknown person.'}).json()
assert r['risk_score']==0 and r['context_warning']
assert c.post('/analyze',json={'text':'x'}).status_code==422
assert c.post('/analyze',json={'text':' '*8}).status_code==422
assert c.post('/analyze',json={'text':'x'*2001}).status_code==422
print('5 backend smoke assertions passed; not model validation.')
