// Run after npm ci and npm install --no-save --package-lock=false playwright.
// Installs no code in the application bundle. Uses an actual local FastAPI server.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
const root = new URL('../../', import.meta.url).pathname;
const api = spawn(root+'backend/.venv/bin/uvicorn',['app.main:app','--host','127.0.0.1','--port','8000'],{cwd:root+'backend',stdio:'ignore'});
const ui = spawn('npm',['run','dev','--','--host','127.0.0.1','--port','5173'],{cwd:root+'frontend',stdio:'ignore'});
const browser = await chromium.launch();
const folder = process.env.EVIDENCE_DIR || '/tmp/tipcheck-evidence'; mkdirSync(folder,{recursive:true});
try {
 for (let i=0;i<100;i++) {try { if((await fetch('http://127.0.0.1:5173')).ok && (await fetch('http://127.0.0.1:8000/health')).ok) break;} catch {} await new Promise(r=>setTimeout(r,100));}
 for (const [name,viewport] of [['desktop',{width:1440,height:1050}],['mobile',{width:390,height:844}]]) {
  const page = await browser.newPage({viewport}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.E2E_URL || 'http://127.0.0.1:5173'); await page.locator('.payment-context summary').click();
  await page.locator('#msg').fill('Invest 499 and I will give you 1500. Visit https://bank.test@evil.test.');
  await page.locator('#name_match').selectOption('no'); await page.locator('#pressure').selectOption('yes');
  await page.getByRole('button',{name:'Check payment context',exact:true}).click();
  await page.getByRole('heading',{name:'Stop and verify independently'}).waitFor();
  assert.equal(await page.locator('.preflight-score').innerText(),'100 / 100');
  assert.equal(await page.locator('.url-host').innerText(),'evil.test');
  await page.waitForTimeout(500);
  await page.locator('.preflight-panel').screenshot({path:`${folder}/${name}-detail.png`});
  await page.screenshot({path:`${folder}/${name}-result.png`,fullPage:true});
  await page.getByRole('button',{name:'Take a 30-second pause',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:/Pause: /}).isDisabled(),true);
  await page.getByRole('button',{name:'Prepare a note for someone you trust'}).click();
  const note = await page.getByRole('textbox',{name:'Trusted-contact note'}).inputValue(); assert.match(note,/100\/100/);assert.ok(!note.includes('evil.test'));
  // Actual elapsed timer, not a mocked response or clock.
  await page.getByRole('button',{name:'Pause finished, not a safety check',exact:true}).waitFor({timeout:35000});
  await page.locator('#pressure').selectOption('no'); assert.equal(await page.locator('.preflight-panel').count(),0);
  await page.locator('#msg').fill(''); await page.locator('#name_match').selectOption('unknown');
  await page.getByRole('button',{name:'Check payment context',exact:true}).click();
  await page.getByRole('heading',{name:'Verify before paying'}).waitFor();assert.equal(await page.locator('.preflight-score').innerText(),'0 / 100');
  assert.ok((await page.locator('.preflight-panel').innerText()).includes('No message was provided.'));
  await page.locator('.language-control select').selectOption('hi');
  await page.getByRole('heading',{name:'भुगतान से पहले जांच करें'}).waitFor();
  await page.waitForTimeout(500);
  await page.screenshot({path:`${folder}/${name}-hindi.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#pin_to_receive').selectOption('yes');
  await page.getByRole('button',{name:'भुगतान की स्थिति जांचें',exact:true}).click();
  await page.getByRole('heading',{name:'रुकें और अलग से जांच करें'}).waitFor();assert.equal(await page.locator('.preflight-score').innerText(),'60 / 100');
  // A stale delayed result must not overwrite an edited input.
  await page.locator('.language-control select').selectOption('en');
  await page.route('**/api/preflight',async route=>{await new Promise(r=>setTimeout(r,200)); await route.continue();});
  await page.getByRole('button',{name:'Check payment context',exact:true}).click(); await page.locator('#msg').fill('changed during request'); await page.waitForTimeout(450); assert.equal(await page.locator('.preflight-panel').count(),0);await page.unroute('**/api/preflight');
  // HTTP failure is an error, never a zero-risk result.
  await page.route('**/api/preflight',r=>r.fulfill({status:503,body:'unavailable'}));await page.getByRole('button',{name:'Check payment context',exact:true}).click();await page.locator('[role="alert"]').waitFor();assert.equal(await page.locator('.preflight-panel').count(),0);await page.unroute('**/api/preflight');
  assert.deepEqual(errors,[]);console.log(`${name}: fusion, actual pause, note privacy, edit invalidation, bilingual empty/context-only, overflow, stale response, HTTP error passed`);await page.close();
 }
} finally {await browser.close();api.kill();ui.kill();}
