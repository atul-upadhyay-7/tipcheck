import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routeFromHash,routeNeedsResult} from '../src/router.js';
test('only known routes, no query string or input is read from URL',()=>{assert.equal(routeFromHash('#/check/message'),'/check/message');assert.equal(routeFromHash('#/check/result?text=SECRET'),'/');assert.equal(routeFromHash('#/unknown'),'/');assert.equal(routeFromHash(''),'/');});
test('result route requires current evidence',()=>{assert.equal(routeNeedsResult('/check/result'),true);assert.equal(routeNeedsResult('/check/message'),false);});
import {QUESTIONS,nextQuestion} from '../src/questions.js';
test('six unique question pages and ordered review transition',()=>{assert.equal(new Set(QUESTIONS.map(q=>q.route)).size,6);for(let i=0;i<6;i++){assert.equal(routeFromHash('#'+QUESTIONS[i].route),QUESTIONS[i].route);assert.equal(nextQuestion(QUESTIONS[i].route),QUESTIONS[i+1]?.route || '/check/review');}assert.equal(routeFromHash('#/check/context'),'/check/recipient');});
test('public resource routes and evidence guard for actions',()=>{for(const r of ['/learn','/help','/about','/check/actions'])assert.equal(routeFromHash('#'+r),r);assert.equal(routeNeedsResult('/check/actions'),true);assert.equal(routeNeedsResult('/help'),false);});
