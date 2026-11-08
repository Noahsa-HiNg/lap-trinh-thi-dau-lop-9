/* Widget "Cái túi": nhập đồ vật (w v) và sức chứa W,
   điền bảng dp[i][j] (0/1 hoặc không giới hạn) cả bảng hoặc từng ô, rồi truy vết các vật được chọn. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 8;
  var MAX_W = 30;
  var MAX_V = 1000;

  function parseItems(str) {
    var groups = String(str || '').split(/[;\n]+/).map(function (g) { return g.trim(); })
      .filter(function (g) { return g.length > 0; });
    if (groups.length === 0) return { err: 'Cần ít nhất một đồ vật, ví dụ "1 1; 3 4".' };
    if (groups.length > MAX_N) return { err: 'Tối đa ' + MAX_N + ' đồ vật.' };
    var items = [];
    for (var k = 0; k < groups.length; k++) {
      var p = groups[k].split(/[\s,]+/).filter(function (t) { return t.length > 0; });
      if (p.length !== 2 || !/^\d+$/.test(p[0]) || !/^\d+$/.test(p[1])) {
        return { err: 'Vật thứ ' + (k + 1) + ' ("' + groups[k] + '") phải gồm đúng hai số nguyên: khối lượng và giá trị.' };
      }
      var w = parseInt(p[0], 10), v = parseInt(p[1], 10);
      if (w < 1 || w > MAX_W) return { err: 'Khối lượng vật ' + (k + 1) + ' phải từ 1 đến ' + MAX_W + '.' };
      if (v > MAX_V) return { err: 'Giá trị vật ' + (k + 1) + ' phải từ 0 đến ' + MAX_V + '.' };
      items.push({ w: w, v: v });
    }
    return { items: items };
  }

  function solve(items, W, unb) {
    var n = items.length, dp = [], i, j;
    dp.push([]);
    for (j = 0; j <= W; j++) dp[0].push(0);
    for (i = 1; i <= n; i++) {
      var row = [], w = items[i - 1].w, v = items[i - 1].v;
      for (j = 0; j <= W; j++) {
        var best = dp[i - 1][j];
        if (j >= w) {
          var take = (unb ? row[j - w] : dp[i - 1][j - w]) + v;
          if (take > best) best = take;
        }
        row.push(best);
      }
      dp.push(row);
    }
    // truy vết
    var path = {}, chosen = [];
    i = n; j = W;
    path[i + ',' + j] = true;
    while (i > 0) {
      if (dp[i][j] === dp[i - 1][j]) {
        i--;
      } else {
        chosen.push(i);
        j -= items[i - 1].w;
        if (!unb) i--;
      }
      path[i + ',' + j] = true;
    }
    chosen.reverse();
    return { dp: dp, path: path, chosen: chosen };
  }

  window.CP.mount('#viz-knapsack', function (root) {
    var inItems = root.querySelector('#kn-items');
    var inW = root.querySelector('#kn-w');
    var inUnb = root.querySelector('#kn-unb');
    var view = root.querySelector('.kn-view');
    var out = root.querySelector('.out');
    var btnAll = root.querySelector('[data-act="all"]');
    var btnStep = root.querySelector('[data-act="step"]');
    if (!view || !out) return;

    var state = null; // { key, d, res, pos } pos = số ô đã tính (không kể hàng 0)

    function say(text) { out.textContent = text; }

    function read() {
      var pi = parseItems(inItems ? inItems.value : '');
      if (pi.err) return { err: pi.err };
      var ws = String(inW ? inW.value : '').trim();
      if (!/^\d+$/.test(ws)) return { err: 'Sức chứa W phải là số nguyên từ 0 đến ' + MAX_W + '.' };
      var W = parseInt(ws, 10);
      if (W > MAX_W) return { err: 'Sức chứa W phải là số nguyên từ 0 đến ' + MAX_W + '.' };
      var unb = !!(inUnb && inUnb.checked);
      return { items: pi.items, W: W, unb: unb, key: JSON.stringify([pi.items, W, unb]) };
    }

    // upto: số ô đã điền (theo thứ tự hàng 1 trái sang phải, rồi hàng 2…); -1 = cả bảng + truy vết
    function draw(d, res, upto) {
      var n = d.items.length, W = d.W, total = n * (W + 1);
      var full = upto < 0 || upto >= total;
      var cur = null, src = {};
      if (!full && upto > 0) {
        var ci = Math.floor((upto - 1) / (W + 1)) + 1, cj = (upto - 1) % (W + 1);
        cur = ci + ',' + cj;
        src[(ci - 1) + ',' + cj] = true;
        var w = d.items[ci - 1].w;
        if (cj >= w) src[(d.unb ? ci : ci - 1) + ',' + (cj - w)] = true;
      }
      view.textContent = '';
      var t = document.createElement('table');
      t.className = 'dp-table';
      var thead = document.createElement('thead'), hr = document.createElement('tr');
      var h0 = document.createElement('th');
      h0.className = 'row-h';
      h0.textContent = 'i (w, v)';
      hr.appendChild(h0);
      for (var j = 0; j <= W; j++) {
        var th = document.createElement('th');
        th.textContent = String(j);
        hr.appendChild(th);
      }
      thead.appendChild(hr);
      t.appendChild(thead);
      var tb = document.createElement('tbody');
      for (var i = 0; i <= n; i++) {
        var tr = document.createElement('tr');
        var rh = document.createElement('th');
        rh.className = 'row-h';
        rh.textContent = i === 0 ? '0' : i + ' (' + d.items[i - 1].w + ', ' + d.items[i - 1].v + ')';
        tr.appendChild(rh);
        for (j = 0; j <= W; j++) {
          var td = document.createElement('td');
          var idx = i === 0 ? 0 : (i - 1) * (W + 1) + j + 1;
          var known = i === 0 || full || idx <= upto;
          td.textContent = known ? String(res.dp[i][j]) : '·';
          var k = i + ',' + j;
          if (full) {
            if (res.path[k]) td.className = 'is-ok';
          } else if (k === cur) {
            td.className = 'is-active';
          } else if (src[k]) {
            td.className = 'is-cmp';
          } else if (!known) {
            td.className = 'is-dim';
          }
          tr.appendChild(td);
        }
        tb.appendChild(tr);
      }
      t.appendChild(tb);
      view.appendChild(t);
    }

    function summary(d, res) {
      var n = d.items.length, W = d.W;
      var best = res.dp[n][W];
      if (res.chosen.length === 0) return 'Đáp án dp[' + n + '][' + W + '] = ' + best + ': không lấy vật nào (không vật nào vừa túi hoặc mọi giá trị bằng 0).';
      var cnt = {}, tw = 0;
      res.chosen.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; tw += d.items[x - 1].w; });
      var parts = Object.keys(cnt).map(function (x) { return 'vật ' + x + (cnt[x] > 1 ? ' × ' + cnt[x] : ''); });
      return 'Đáp án dp[' + n + '][' + W + '] = ' + best + '. Truy vết (ô xanh): lấy ' + parts.join(', ') +
        '; tổng khối lượng ' + tw + ' ≤ ' + W + '.' + (d.unb ? ' Chế độ không giới hạn: một vật có thể được lấy nhiều lần.' : '');
    }

    function explainCell(d, res, upto) {
      var W = d.W;
      var i = Math.floor((upto - 1) / (W + 1)) + 1, j = (upto - 1) % (W + 1);
      var it = d.items[i - 1], dp = res.dp;
      var s = 'Ô dp[' + i + '][' + j + ']: không chọn = dp[' + (i - 1) + '][' + j + '] = ' + dp[i - 1][j];
      if (j >= it.w) {
        var ri = d.unb ? i : i - 1;
        var take = dp[ri][j - it.w] + it.v;
        s += '; chọn = dp[' + ri + '][' + (j - it.w) + '] + ' + it.v + ' = ' + take;
      } else {
        s += '; không chọn được vì j = ' + j + ' < w = ' + it.w;
      }
      return s + '. Lấy ' + dp[i][j] + '.';
    }

    function runAll() {
      var d = read();
      if (d.err) { say(d.err); return; }
      var res = solve(d.items, d.W, d.unb);
      state = { key: d.key, d: d, res: res, pos: -1 };
      draw(d, res, -1);
      say(summary(d, res));
    }

    function step() {
      var d = read();
      if (d.err) { say(d.err); return; }
      if (!state || state.key !== d.key || state.pos < 0) {
        state = { key: d.key, d: d, res: solve(d.items, d.W, d.unb), pos: 0 };
      }
      var total = d.items.length * (d.W + 1);
      state.pos++;
      if (state.pos > total) {
        draw(state.d, state.res, -1);
        say(summary(state.d, state.res) + ' Bấm “Từng ô” lần nữa để làm lại từ đầu.');
        state.pos = -1;
        return;
      }
      draw(state.d, state.res, state.pos);
      say(explainCell(state.d, state.res, state.pos) + ' (ô ' + state.pos + '/' + total + ')');
    }

    if (btnAll) btnAll.addEventListener('click', runAll);
    if (btnStep) btnStep.addEventListener('click', step);
    [inItems, inW, inUnb].forEach(function (el) {
      if (el) el.addEventListener('change', function () { state = null; });
    });
    if (inItems) inItems.addEventListener('keydown', function (e) { if (e.key === 'Enter') runAll(); });
    if (inW) inW.addEventListener('keydown', function (e) { if (e.key === 'Enter') runAll(); });
    runAll();
  });
})();
