import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url).pathname;
const api=spawn(root+'backend/.venv/bin/uvicorn',['app.main:app','--host','127.0.0.1','--port','8000'],{cwd:root+'backend',stdio:'ignore'});
const browser=await chromium.launch();const folder='/tmp/tipcheck-routes';mkdirSync(folder,{recursive:true});
try {
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:8000/health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8000');await page.getByRole('heading',{name:'What would you like to check?'}).waitFor();await page.waitForTimeout(500);await page.screenshot({path:`${folder}/${width}-start.png`,fullPage:true});
  await page.getByRole('button',{name:/^A message/ }).click();await page.locator('#msg').fill('Invest 499 and I will give you 1500.');await page.getByRole('button',{name:'Check message',exact:true}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();assert.equal(await page.locator('.preflight-panel').count(),0);await page.waitForTimeout(500);await page.screenshot({path:`${folder}/${width}-result.png`,fullPage:true});
  await page.getByRole('button',{name:'Edit details',exact:true}).click();assert.equal(await page.locator('#msg').inputValue(),'Invest 499 and I will give you 1500.');await page.locator('#msg').fill('edited private draft');await page.goBack();await page.getByRole('heading',{name:'Look at the message'}).waitFor();assert.ok((await page.locator('[role="status"]').innerText()).includes('There is no result'));assert.equal(await page.locator('.result-panel').count(),0);
  await page.reload();assert.equal(await page.locator('#msg').inputValue(),'');assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  await page.goto('http://127.0.0.1:8000/#/check/result');await page.getByRole('heading',{name:'Look at the message'}).waitFor();assert.equal(await page.locator('.result-panel').count(),0);
  await page.goto('http://127.0.0.1:8000/#/does-not-exist');await page.getByRole('heading',{name:'What would you like to check?'}).waitFor();
  await page.getByRole('button',{name:'Before I pay',exact:false}).click();await page.waitForTimeout(500);await page.screenshot({path:`${folder}/${width}-message.png`,fullPage:true});await page.getByRole('button',{name:'Continue to payment context'}).click();await page.getByRole('heading',{name:'Payment context'}).waitFor();await page.locator('#pin_to_receive').selectOption('yes');await page.getByRole('button',{name:'Check payment context',exact:true}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();assert.equal(await page.locator('.preflight-score').innerText(),'60 / 100');
  await page.getByRole('button',{name:'Edit details',exact:true}).click();await page.locator('.language-control select').selectOption('hi');await page.waitForTimeout(500);await page.screenshot({path:`${folder}/${width}-context-hi.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);console.log(`${width}px: start/quick/guided/context-only, back/edit invalidation, refresh privacy, direct result protection, unknown routes, Hindi, no persistence/errors/overflow passed`);await page.close();
 }
}finally{await browser.close();api.kill();}
