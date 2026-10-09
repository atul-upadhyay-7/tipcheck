// Built bundle + actual FastAPI. Install playwright separately; no app dependency.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url).pathname;
const api=spawn(root+'backend/.venv/bin/uvicorn',['app.main:app','--host','127.0.0.1','--port','8000'],{cwd:root+'backend',stdio:'ignore'});
const browser=await chromium.launch();const folder='/tmp/tipcheck-stage2';mkdirSync(folder,{recursive:true});
const keys=['first_payment','name_match','unusual_amount','pressure','pin_to_receive','remote_access'];
const names=['recipient','name','amount','pressure','pin','access'];
try {
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:8000/health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];const sent=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')sent.push(r);});
  const shot=async name=>{await page.waitForTimeout(450);await page.screenshot({path:`${folder}/${width}-${name}.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);};
  await page.goto('http://127.0.0.1:8000');await page.getByRole('button',{name:/^A message/}).click();await page.locator('#msg').fill('Invest 499 and I will give you 1500.');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('heading',{name:'Review before analysis'}).waitFor();assert.equal(sent.length,0);await page.getByRole('button',{name:'Send details and analyse',exact:true}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();assert.equal(await page.locator('.preflight-panel').count(),0);assert.equal(sent.length,1);
  await page.getByRole('button',{name:'Edit details',exact:true}).click();await page.getByRole('button',{name:'Edit message',exact:true}).click();await page.locator('#msg').fill('Edited draft');await page.getByRole('button',{name:'Return to review',exact:true}).click();assert.equal(await page.locator('.review-message').innerText(),'Edited draft');await page.reload();assert.equal(await page.locator('.review-message').innerText(),'No message provided');assert.equal(await page.getByRole('button',{name:'Send details and analyse'}).isDisabled(),true);
  await page.goto('http://127.0.0.1:8000/#/check/result');await page.getByRole('heading',{name:'Look at the message'}).waitFor();assert.equal(await page.locator('.result-panel').count(),0);
  await page.goto('http://127.0.0.1:8000/#/does-not-exist');await page.getByRole('button',{name:/^Before I pay/}).click();await page.locator('#msg').fill('Invest 499 and I will give you 1500. Visit https://bank.test@evil.test.');await page.getByRole('button',{name:'Continue',exact:true}).click();
  const before=sent.length;
  for(let i=0;i<6;i++){
   await page.waitForURL(`**/#/check/${names[i]}`);await page.locator('input[type="radio"]').first().waitFor();assert.equal(await page.locator('input[type="radio"]').count(),3);assert.equal(await page.locator(`input[name="${keys[i]}"][value="unknown"]`).isChecked(),true);
   if([1,3,4,5].includes(i))await page.locator(`input[name="${keys[i]}"][value="${i===1?'no':'yes'}"]`).check();
   if(i>=4)await page.getByRole('alert').waitFor();
   await shot(names[i]);assert.equal(sent.length,before);await page.getByRole('button',{name:'Continue',exact:true}).click();
  }
  await page.getByRole('heading',{name:'Review before analysis'}).waitFor();assert.equal(sent.length,before);assert.equal(await page.locator('.review-list > div').count(),7);await shot('review');
  await page.getByRole('button',{name:/^Change: Are you being pressured/}).click();await page.locator('input[value="no"]').check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('heading',{name:'Review before analysis'}).waitFor();assert.equal(sent.length,before);
  await page.getByRole('button',{name:'Send details and analyse',exact:true}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();assert.equal(sent.length,before+1);assert.equal(JSON.parse(sent.at(-1).postData()).pressure,'no');assert.equal(await page.locator('.preflight-score').innerText(),'100 / 100');await shot('result');
  assert.equal(await page.locator('.pause-actions').count(),0);assert.equal(await page.locator('.literacy-coach').count(),0);await page.getByRole('link',{name:'What to do next',exact:true}).click();await page.getByRole('heading',{name:'Your action plan'}).waitFor();await shot('actions');await page.getByRole('button',{name:'Prepare a note for someone you trust'}).click();assert.ok(!(await page.getByRole('textbox',{name:'Trusted-contact note'}).inputValue()).includes('evil.test'));
  if(width===390){await page.getByRole('button',{name:'Take a 30-second pause',exact:true}).click();await page.getByRole('button',{name:'Pause finished, not a safety check',exact:true}).waitFor({timeout:35000});}
  await page.getByRole('link',{name:'Back to result',exact:true}).click();await page.getByRole('button',{name:'Edit details',exact:true}).click();await page.locator('.language-control select').selectOption('hi');await shot('review-hi');
  for(let i=0;i<6;i++){
   await page.locator('.review-list > div').nth(i+1).getByRole('button').click();await page.waitForURL(`**/#/check/${names[i]}`);await page.locator('input[type="radio"]').first().waitFor();await shot(`${names[i]}-hi`);await page.getByRole('button',{name:'आगे',exact:true}).click();await page.getByRole('heading',{name:'जांच से पहले विवरण की समीक्षा'}).waitFor();
  }
  await page.locator('.language-control select').selectOption('en');
  // Leaving an in-flight review cancels result acceptance; no stale private result.
  await page.route('**/api/preflight',async route=>{await new Promise(r=>setTimeout(r,200));await route.continue();});await page.getByRole('button',{name:'Send details and analyse'}).click();await page.getByRole('button',{name:'Edit message'}).click();await page.locator('#msg').fill('Changed during request');await page.waitForTimeout(500);assert.equal(await page.locator('.preflight-panel').count(),0);await page.unroute('**/api/preflight');await page.getByRole('button',{name:'Return to review'}).click();
  await page.route('**/api/preflight',r=>r.fulfill({status:503,body:'unavailable'}));await page.getByRole('button',{name:'Send details and analyse'}).click();await page.getByRole('alert').waitFor();assert.equal(await page.locator('.preflight-panel').count(),0);await page.unroute('**/api/preflight');
  // Direct question/refresh gives only unknown local state, context-only remains usable.
  await page.goto('http://127.0.0.1:8000/#/check/access');await page.reload();await page.locator('input[type="radio"]').first().waitFor();await page.locator('input[value="yes"]').check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('heading',{name:'Review before analysis'}).waitFor();assert.equal(await page.locator('.review-list > div').count(),7);assert.equal(await page.locator('.review-message').innerText(),'No message provided');await page.getByRole('button',{name:'Send details and analyse'}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();assert.equal(await page.locator('.preflight-score').innerText(),'60 / 100');
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.deepEqual(errors,[]);console.log(`${width}px: quick/guided, six pages + Hindi, unknown defaults, review/edit, zero POST before explicit submit, privacy/refresh/direct routes, fusion/note, stale response/error passed`);await page.close();
 }
}finally{await browser.close();api.kill();}
