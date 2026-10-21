const assert=require('node:assert/strict');
const {Game,VERSION,SAVE_KEY}=require('../engine.js');
let checked=0;function test(name,fn){fn();checked++;console.log('PASS '+name)}

test('ordinary routes expose true profile odds while hiding drawn outcomes',()=>{
 let totals={coast:{battle:0,event:0,cache:0},open:{battle:0,event:0,cache:0},land:{battle:0,event:0,cache:0}};
 for(let i=0;i<500;i++){let g=new Game('odds-'+i),before=JSON.stringify(g.s),view=g.visibleMap();assert.equal(JSON.stringify(g.s),before);for(const n of g.s.map.flat().filter(n=>n.type==='passage'))totals[n.profile][n.outcome]++;assert.ok(view.flat().every(n=>n.outcome===undefined&&n.eventId===undefined&&n.enemies===undefined));for(const n of view.flat().filter(n=>n.type==='passage')){let info=g.routeInfo(n);assert.ok(info.risk.length>12);assert.ok(!/%/.test(info.risk));assert.ok(!/%/.test(info.reward));}}
 for(const [profile,weights] of Object.entries({coast:[30,45,25],open:[60,25,15],land:[40,35,25]})){let counts=totals[profile],total=Object.values(counts).reduce((a,b)=>a+b,0);assert.ok(total>150,profile);for(const [i,key] of ['battle','event','cache'].entries())assert.ok(Math.abs(counts[key]/total*100-weights[i])<8,profile+' '+key+' '+JSON.stringify(counts));}
});

test('land cache grants one reward, opens finite camp, and never rerolls on restore',()=>{
 let g=new Game('land-cache'),n=g.s.map[0].find(n=>!n.sea);assert.ok(n);n.type='passage';n.profile='land';n.outcome='cache';delete n.eventId;delete n.enemies;let food=g.s.food;g.startRoute(n.id);g.s.route.incidentChecked=true;g.advance();assert.equal(g.s.phase,'island');assert.equal(g.s.island.node,n.id);assert.equal(g.s.island.gathers,2);assert.ok(g.s.food>=food);assert.equal(g.s.lastVictory.source,'航路发现');let history=g.s.lootHistory.length,saved=Game.restore(g.s);saved.visibleMap();assert.equal(saved.s.lootHistory.length,history);assert.deepEqual(saved.s.rng,g.s.rng);assert.equal(saved.s.phase,'island');
});

test('land event resolves into camp; safe city has no voyage incident',()=>{
 let g=new Game('land-event'),n=g.s.map[0].find(n=>!n.sea);n.type='passage';n.profile='land';n.outcome='event';n.eventId='fruit';delete n.enemies;g.startRoute(n.id);g.advance();assert.equal(g.s.phase,'event');g.dispatch('event',{choice:'leave'});assert.equal(g.s.phase,'island');assert.equal(g.s.island.node,n.id);
 let city=g.s.map[2].find(n=>n.type==='city'),parent=g.s.map[1].find(n=>n.next.includes(city.id));g.s.layer=2;g.s.currentNode=parent.id;g.s.phase='map';g.s.food=40;g.startRoute(city.id);g.roll=()=>1;g.advance();assert.equal(g.s.phase,'city');assert.equal(g.s.event,null);
});

test('new save slot rejects old map state while preserving its export source',()=>{
 let g=new Game('new-slot');assert.equal(g.s.version,VERSION);assert.equal(SAVE_KEY,'ithaca-expedition-v5');assert.throws(()=>Game.restore({...g.s,version:'0.4-expedition.2'}));
});

console.log(checked+' probability route checks passed');
