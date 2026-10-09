import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contactNote, remainingSeconds, EMPTY_CONTEXT} from '../src/preflight.js';
import {analyzeMessage} from '../src/api/client.js';
test('preflight request carries context to distinct endpoint', async t => {
 t.mock.method(globalThis, 'fetch', async (url,options) => {assert.equal(url,'/api/preflight'); assert.deepEqual(JSON.parse(options.body), {text:'',...EMPTY_CONTEXT,pin_to_receive:'yes'}); return {ok:true,json: async () => ({label:'uncertain',mode:'rules-only',risk_score:0,risk_level:'none_detected',flags:[],links:[],context_warning:false,verification_status:'not_verified',preflight:{score:60,level:'high',components:{message:0,context:60,url:0},signals:[],unknown_context:[],message_provided:false,reputation_status:'not_connected',payment_control:'none',url_checks:[]}})};});
 assert.equal((await analyzeMessage('',{context:{...EMPTY_CONTEXT,pin_to_receive:'yes'}})).preflight.score,60);
});
test('deadline counts elapsed wall time, cannot go negative', () => {assert.equal(remainingSeconds(30000,0),30); assert.equal(remainingSeconds(30000,1000),29); assert.equal(remainingSeconds(30000,30500),0);});
test('contact note leaves sensitive context out and marks score as uncertain', () => {
 for (const lang of ['en','hi']) {const note=contactNote({score:60,text:'SECRET',name:'PRIVATE',amount:123456},lang);assert.ok(note.includes('60'));assert.ok(!/SECRET|PRIVATE|123456/.test(note));}
 assert.match(contactNote({score:60},'en'),/not proof of fraud/);
});
