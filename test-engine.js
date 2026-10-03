var E = require('./engine.js'), fails = 0, n = 0;
function eq(a, b, m, t) { n++; t = t === undefined ? 1e-9 : t; if (!(Math.abs(a - b) <= t) && a !== b) { fails++; console.log('FAIL', m, a, b); } }
// Erlang B known values
eq(E.erlangB(1, 1), 0.5, 'B(1,1)'); eq(E.erlangB(2, 1), 0.2, 'B(2,1)'); eq(E.erlangB(0, 5), 1, 'B(0)'); eq(E.erlangB(10, 5), 0.01838, 'B(10,5)', 1e-4); eq(E.erlangB(5, 2), 0.03670, 'B(5,2)', 1e-4);
// Erlang C: C(1,0.5)=0.5 ; C(2,1)=1/3
eq(E.pWait(1, 0.5), 0.5, 'C(1,.5)'); eq(E.pWait(2, 1), 1 / 3, 'C(2,1)'); eq(E.pWait(2, 2), 1, 'C overload'); eq(E.pWait(3, 5), 1, 'C under');
// Calcoid worked example: 200 calls/60 min, AHT 180 s = 10 Erlangs; 14 agents, 20 s
var s = E.stats(14, 10, 180, 20);
eq(s.pWait, 0.174, 'pw 17.4%', 5e-4); eq(s.serviceLevel, 0.888, 'sl 88.8%', 5e-4); eq(s.occupancy, 0.7143, 'occ', 1e-4);
var p = E.plan(200, 60, 180, 80, 20, 30);
eq(p.load, 10, 'load'); eq(p.agents, 14, 'agents'); eq(p.roster, 20, 'roster'); eq(p.before.serviceLevel < 0.8 ? 1 : 0, 1, 'n-1 misses');
eq(p.before.serviceLevel, 0.7956, 'sl at 13', 1e-3);
// load examples from the same source
eq(E.plan(30, 15, 180, 80, 20, 0).load, 6, 'load 30/15/180'); eq(E.plan(20, 15, 120, 80, 20, 0).load, 8 / 3, 'load 2.67', 1e-9); eq(E.plan(60, 30, 240, 80, 20, 0).load, 8, 'load 8'); eq(E.plan(100, 60, 300, 80, 20, 0).load, 100 * 300 / 3600, 'load 8.33'); eq(E.plan(80, 60, 180, 80, 20, 0).load, 4, 'load 4');
eq(E.plan(100, 30, 300, 80, 20, 0).agents, 21, 'agents 100/30/300');
eq(E.stats(21, 100 * 300 / 1800, 300, 20).serviceLevel >= 0.8 ? 1 : 0, 1, 'meets');
eq(E.stats(20, 100 * 300 / 1800, 300, 20).serviceLevel < 0.8 ? 1 : 0, 1, 'one fewer misses');
// monotonic: more agents never worse
var prev = 0, ok = 1; for (var k = 11; k < 30; k++) { var x = E.stats(k, 10, 180, 20).serviceLevel; if (x < prev) ok = 0; prev = x; } eq(ok, 1, 'monotonic SL');
// stricter target needs more or equal agents
eq(E.plan(200, 60, 180, 95, 20, 0).agents >= E.plan(200, 60, 180, 80, 20, 0).agents ? 1 : 0, 1, 'stricter');
eq(E.plan(200, 60, 180, 80, 5, 0).agents >= E.plan(200, 60, 180, 80, 60, 0).agents ? 1 : 0, 1, 'tighter time');
// occupancy cap
var c = E.plan(200, 60, 180, 50, 60, 0, 70); eq(c.occupancy <= 0.7 ? 1 : 0, 1, 'occ cap'); eq(c.agents, 15, 'occ cap agents');
// ASA formula: C*AHT/(N-A)
eq(s.asa, s.pWait * 180 / 4, 'asa');
eq(E.stats(10, 10, 180, 20).serviceLevel, 0, 'saturated'); eq(E.stats(10, 10, 180, 20).asa, Infinity, 'asa inf');
// roster
eq(E.plan(200, 60, 180, 80, 20, 0).roster, 14, 'no shrink'); eq(E.plan(200, 60, 180, 80, 20, 50).roster, 28, '50% shrink');
// invalid
eq(E.plan(0, 60, 180, 80, 20, 0), null, 'calls0'); eq(E.plan(10, 0, 180, 80, 20, 0), null, 'interval0'); eq(E.plan(10, 60, 0, 80, 20, 0), null, 'aht0'); eq(E.plan(10, 60, 180, 100, 20, 0), null, 'sl100'); eq(E.plan(10, 60, 180, 80, -1, 0), null, 't<0'); eq(E.plan(10, 60, 180, 80, 20, 95), null, 'shrink95');
eq(E.plan(1, 60, 60, 80, 20, 0).agents, 1, 'tiny load');
eq(E.plan(200, 60, 180, 80, 20, 0).table.length >= 3 ? 1 : 0, 1, 'table');
console.log(n - fails + '/' + n + ' pass'); process.exit(fails ? 1 : 0);
