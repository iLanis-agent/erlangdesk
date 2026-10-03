(function (root) {
  // Erlang C: probability of waiting, via the stable Erlang B recursion
  function erlangB(n, a) { var b = 1; for (var k = 1; k <= n; k++) b = a * b / (k + a * b); return b; }
  function pWait(n, a) {
    if (n <= a) return 1;
    var b = erlangB(n, a);
    return n * b / (n - a * (1 - b));
  }
  function stats(n, a, aht, t) {
    var pw = pWait(n, a);
    var sl = n <= a ? 0 : 1 - pw * Math.exp(-(n - a) * t / aht);
    var asa = n <= a ? Infinity : pw * aht / (n - a);
    return { agents: n, pWait: pw, serviceLevel: sl, asa: asa, occupancy: Math.min(1, a / n) };
  }
  // calls in intervalMin minutes, aht seconds, target slPct % answered within t seconds, shrinkage % of paid time off the phones
  function plan(calls, intervalMin, aht, slPct, t, shrinkPct, maxOcc) {
    if (!(calls > 0) || !(intervalMin > 0) || !(aht > 0) || !(slPct > 0 && slPct < 100) || !(t >= 0) || !(shrinkPct >= 0 && shrinkPct < 90)) return null;
    var a = calls * aht / (intervalMin * 60);
    var target = slPct / 100, n = Math.floor(a) + 1, guard = 0;
    var s = stats(n, a, aht, t);
    while ((s.serviceLevel < target || (maxOcc && s.occupancy > maxOcc / 100)) && guard++ < 5000) { n++; s = stats(n, a, aht, t); }
    s.load = a; s.target = target;
    s.roster = Math.ceil(n / (1 - shrinkPct / 100));
    s.before = stats(n - 1, a, aht, t);
    s.table = [];
    for (var k = Math.max(Math.floor(a) + 1, n - 2); k <= n + 2; k++) s.table.push(stats(k, a, aht, t));
    return s;
  }
  var api = { erlangB: erlangB, pWait: pWait, stats: stats, plan: plan };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ErlangDesk = api;
})(typeof window !== 'undefined' ? window : this);
