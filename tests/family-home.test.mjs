import test from 'node:test';
import assert from 'node:assert/strict';
import {familySummary} from '../assets/family-home.js';
const block={id:'a',day:'Martes',startTime:'08:00',type:'comida',title:'Desayuno',for:['anderson','damaris']};
const base={todayDayName:'Martes',todayISO:'2026-10-20',blocks:[block],checks:{},weekChecks:{}};
test('a proposed moment is never presented as completed',()=>{const s=familySummary(base);assert.equal(s.done,0);assert.equal(s.history.length,0);assert.match(s.evidence,/no hay suficiente/)});
test('one participation does not complete the family moment',()=>{const s=familySummary({...base,checks:{a:['anderson']}});assert.equal(s.done,0);assert.deepEqual(s.history[0].members,['anderson']);assert.equal(s.history[0].complete,false)});
test('all assigned participants complete the shared moment',()=>{const s=familySummary({...base,checks:{a:['anderson','damaris']}});assert.equal(s.done,1);assert.equal(s.next,undefined)});
test('routine suggestions need prior records on at least two days',()=>{const s=familySummary({...base,weekChecks:{'2026-10-18':{a:['anderson']},'2026-10-19':{a:['damaris']},'2026-10-21':{a:['anderson']}}});assert.match(s.suggestion,/2 días/);assert.match(s.suggestion,/2 momentos/)});
