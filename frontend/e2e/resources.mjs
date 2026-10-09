import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url).pathname;
const api=spawn(root+'backend/.venv/bin/uvicorn',['app.main:app','--host','127.0.0.1','--port','8000'],{cwd:root+'backend',stdio:'ignore'});
const browser=await chromium.launch();const folder='/tmp/tipcheck-stage3';mkdirSync(folder,{recursive:true});
try {
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:8000/health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[],sent=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')sent.push(r);});
  const shot=async name=>{await page.waitForTimeout(450);await page.screenshot({path:`${folder}/${width}-${name}.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);};
  await page.goto('http://127.0.0.1:8000');await page.getByRole('link',{name:'Already paid or shared details? Get urgent help'}).click();await page.getByRole('heading',{name:'Urgent help',exact:true}).waitFor();assert.equal(await page.getByRole('link',{name:'Call 1930',exact:true}).getAttribute('href'),'tel:1930');assert.equal(await page.getByRole('link',{name:'National Cyber Crime Reporting Portal',exact:true}).getAttribute('href'),'https://cybercrime.gov.in/');
  for(const route of ['help','about','learn']){
   await page.goto(`http://127.0.0.1:8000/#/${route}`);await page.locator('h1').waitFor();await page.locator('.language-control select').selectOption('en');await shot(route);await page.locator('.language-control select').selectOption('hi');await shot(route+'-hi');
  }
  assert.equal(sent.length,0);await page.locator('.language-control select').selectOption('en');await page.getByRole('button',{name:'Try the literacy coach',exact:true}).click();
  for(let i=0;i<3;i++){await page.locator('.coach-options button').nth(1).click();await page.getByRole('status').waitFor();await page.getByRole('button',{name:i===2?'Finish practice':'Next question',exact:true}).click();}await page.getByRole('heading',{name:'Pause. Question. Verify.'}).waitFor();assert.equal(sent.length,0);
  await page.goto('http://127.0.0.1:8000/#/check/actions');await page.getByRole('heading',{name:'Look at the message'}).waitFor();assert.equal(await page.locator('.action-plan').count(),0);
  await page.goto('http://127.0.0.1:8000');await page.getByRole('button',{name:/^Before I pay/}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();for(let i=0;i<6;i++){await page.locator('input[type="radio"]').first().waitFor();await page.getByRole('button',{name:'Continue',exact:true}).click();}await page.getByRole('button',{name:'Send details and analyse'}).click();await page.getByRole('heading',{name:'Your check result'}).waitFor();await page.getByRole('link',{name:'What to do next',exact:true}).click();await page.getByRole('heading',{name:'Your action plan'}).waitFor();await shot('actions');await page.locator('.language-control select').selectOption('hi');await page.getByRole('button',{name:'किसी भरोसेमंद व्यक्ति के लिए नोट बनाएं'}).click();await shot('actions-hi');assert.equal(sent.length,1);
  await page.reload();await page.getByRole('heading',{name:'Look at the message'}).waitFor();assert.equal(await page.locator('.action-plan').count(),0);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.deepEqual(errors,[]);console.log(`${width}px: urgent/help/about/learn EN+HI, offline practice, official links, action separation/direct/refresh guards and no extra disclosure passed`);await page.close();
 }
}finally{await browser.close();api.kill();}
