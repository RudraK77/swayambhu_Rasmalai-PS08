import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixtures,classify,canonical,affected,assets} from './engine';
test('approved risky changes remain high risk',()=>assert.equal(classify(fixtures[1]),'High risk'));
test('missing approval remains unknown and requires review',()=>{assert.equal(fixtures[5].auth,'Unknown');assert.equal(classify(fixtures[5]),'Review required')});
test('safe approved change and legitimate variation are expected',()=>{assert.equal(classify(fixtures[2]),'Expected change');assert.equal(classify(fixtures[3]),'Expected change')});
test('coordinated drift survives majority peer agreement',()=>{assert.equal(classify(fixtures[4]),'High risk');assert.equal(assets.filter(a=>affected(fixtures[4],a.name)).length,7)});
test('incomplete evidence, unknown risk and unexplained outliers require review',()=>{for(const delta of [{complete:false},{risk:'Unknown' as const},{anomaly:true}])assert.equal(classify({...fixtures[2],...delta}),'Review required')});
test('canonical key order is invariant',()=>assert.equal(canonical({b:2,a:{z:0,c:1}}),canonical({a:{c:1,z:0},b:2})));
