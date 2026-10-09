import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routeFromHash,routeNeedsResult} from '../src/router.js';
test('only known routes, no query string or input is read from URL',()=>{assert.equal(routeFromHash('#/check/message'),'/check/message');assert.equal(routeFromHash('#/check/result?text=SECRET'),'/');assert.equal(routeFromHash('#/unknown'),'/');assert.equal(routeFromHash(''),'/');});
test('result route requires current evidence',()=>{assert.equal(routeNeedsResult('/check/result'),true);assert.equal(routeNeedsResult('/check/message'),false);});
