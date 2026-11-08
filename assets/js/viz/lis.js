/* Widget "Dãy con tăng dài nhất":
   nhập dãy, chọn loại (tăng chặt / không giảm / giảm chặt), chạy từng bước
   quy hoạch động O(n²) (dp, par) song song với mảng tails O(n log n), cuối cùng tô một dãy đáp án. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 30;
  var MAX_ABS = 1e9;

  var MODES = {
    inc: { name: 'tăng chặt', sign: '<', ok: function (x, y) { return x < y; } },
    nondec: { name: 'không giảm', sign: '≤', ok: function (x, y) { return x <= y; } },
    dec: { name: 'giảm chặt', sign: '>', ok: function (x, y) { return x > y; } }
  };

  function parseList(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Hãy nhập ít nhất một số nguyên.' };
    if (parts.length > MAX_N) return { err: 'Chỉ nhận tối đa ' + MAX_N + ' số để hình còn đọc được.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^[+-]?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên.' };
      var v = parseInt(parts[i], 10);
      if (!isFinite(v) || Math.abs(v) > MAX_ABS) return { err: 'Mỗi số phải có trị tuyệt đối không quá 10⁹.' };
      a.push(v);
    }
    return { a: a };
  }

  // Tìm vị trí đầu tiên trong mảng tăng arr có arr[k] >= x (strict = true) hoặc > x (strict = false)
  function bound(arr, x, strict) {
    var lo = 0, hi = arr.length;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (strict ? arr[mid] < x : arr[mid] <= x) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  function compute(a, modeKey) {
    var m = MODES[modeKey] || MODES.inc;
    var n = a.length, dp = [], par = [], i, j;
    for (i = 0; i < n; i++) {
      dp.push(1); par.push(-1);
      for (j = 0; j < i; j++) {
        if (m.ok(a[j], a[i]) && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; par[i] = j; }
      }
    }
    // tails: giảm chặt thì đổi dấu; không giảm thì dùng upper_bound
    var key = [], shown = [], hist = [];
    for (i = 0; i < n; i++) {
      var x = modeKey === 'dec' ? -a[i] : a[i];
      var k = bound(key, x, modeKey !== 'nondec');
      var before = shown.slice();
      var appended = k === key.length;
      if (appended) { key.push(x); shown.push(a[i]); } else { key[k] = x; shown[k] = a[i]; }
      hist.push({ k: k, appended: appended, before: before, after: shown.slice() });
    }
    var best = 0;
    for (i = 1; i < n; i++) if (dp[i] > dp[best]) best = i;
    var path = [];
    for (i = best; i !== -1; i = par[i]) path.push(i);
    path.reverse();
    return { m: m, dp: dp, par: par, hist: hist, best: best, path: path };
  }

  function makeCell(text, idx, cls, ptr) {
    var s = document.createElement('span');
    s.className = 'cell' + (cls ? ' ' + cls : '');
    s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    s.textContent = text;
    return s;
  }

  function makeRow(label) {
    var row = document.createElement('div');
    row.className = 'arr';
    var lb = document.createElement('span');
    lb.className = 'arr-label';
    lb.textContent = label;
    row.appendChild(lb);
    return row;
  }

  window.CP.mount('#viz-lis', function (root) {
    var input = root.querySelector('#lis-input');
    var modeSel = root.querySelector('#lis-mode');
    var btnRun = root.querySelector('[data-act="run"]');
    var btnAll = root.querySelector('[data-act="all"]');
    var view = root.querySelector('.lis-view');
    var out = root.querySelector('.out');
    var token = 0;

    function draw(a, r, upto, done) {
      if (!view) return;
      view.textContent = '';
      var onPath = {};
      if (done) r.path.forEach(function (p) { onPath[p] = true; });
      var cand = {};
      if (!done && upto >= 0) {
        for (var j = 0; j < upto; j++) if (r.m.ok(a[j], a[upto])) cand[j] = true;
      }
      var ra = makeRow('a'), rd = makeRow('dp'), rp = makeRow('par');
      for (var i = 0; i < a.length; i++) {
        var cls = '', ptr = '';
        if (done) cls = onPath[i] ? 'is-ok' : 'is-dim';
        else if (i === upto) { cls = 'is-active'; ptr = 'i'; }
        else if (i > upto) cls = 'is-dim';
        else if (i === r.par[upto]) { cls = 'is-ok'; ptr = 'j'; }
        else if (cand[i]) cls = 'is-cmp';
        ra.appendChild(makeCell(String(a[i]), i, cls, ptr));
        var known = done || i <= upto;
        rd.appendChild(makeCell(known ? String(r.dp[i]) : '?', i, known ? (done ? (onPath[i] ? 'is-ok' : '') : (i === upto ? 'is-active' : (i === r.par[upto] ? 'is-ok' : ''))) : 'is-dim'));
        rp.appendChild(makeCell(known ? String(r.par[i]) : '?', i, known ? (done && onPath[i] ? 'is-ok' : '') : 'is-dim'));
      }
      view.appendChild(ra); view.appendChild(rd); view.appendChild(rp);
      var h = r.hist[done ? a.length - 1 : upto];
      var rt = makeRow('tails');
      if (h) {
        h.after.forEach(function (v, k) {
          var c = '';
          if (!done && k === h.k) c = h.appended ? 'is-ok' : 'is-active';
          rt.appendChild(makeCell(String(v), k, c));
        });
      }
      view.appendChild(rt);
    }

    function explain(a, r, i) {
      var cands = [];
      for (var j = 0; j < i; j++) if (r.m.ok(a[j], a[i])) cands.push(j);
      var s = 'Bước ' + (i + 1) + '/' + a.length + ': a[' + i + '] = ' + a[i] + '.\n';
      if (cands.length === 0) s += 'QHĐ: không có j < ' + i + ' nào thỏa a[j] ' + r.m.sign + ' ' + a[i] + ', nên dp[' + i + '] = 1.\n';
      else s += 'QHĐ: các j thỏa a[j] ' + r.m.sign + ' ' + a[i] + ' là ' + cands.join(', ') + '; tốt nhất j = ' + r.par[i] + ' (dp ' + r.dp[r.par[i]] + '), nên dp[' + i + '] = ' + r.dp[i] + '.\n';
      var h = r.hist[i];
      if (h.appended) s += 'tails: nối ' + a[i] + ' vào cuối, độ dài thành ' + h.after.length + '.';
      else s += 'tails: thay tails[' + h.k + '] = ' + h.before[h.k] + ' bằng ' + a[i] + ', độ dài vẫn là ' + h.after.length + '.';
      return s;
    }

    function finalText(a, r) {
      var vals = r.path.map(function (p) { return a[p]; });
      var h = r.hist[a.length - 1];
      var same = h.after.length === vals.length && h.after.every(function (v, k) { return v === vals[k]; });
      return 'Dãy con ' + r.m.name + ' dài nhất có độ dài ' + r.dp[r.best] + ' (bằng số ô của tails: ' + h.after.length + ').\n' +
        'Truy vết từ i = ' + r.best + ' theo par: chỉ số ' + r.path.join(', ') + ', giá trị ' + vals.join(', ') + '.\n' +
        'tails cuối = (' + h.after.join(', ') + ')' + (same ? ', lần này trùng với dãy vừa truy vết.' : ', khác dãy vừa truy vết.') +
        '\nNhớ: tails chỉ bảo đảm đúng độ dài, có lúc nó không phải dãy con (thử 3 4 5 1).';
    }

    function run(animate) {
      var my = ++token;
      var p = parseList(input ? input.value : '');
      if (p.err) { if (view) view.textContent = ''; if (out) out.textContent = p.err; return; }
      var a = p.a;
      var mode = modeSel && MODES[modeSel.value] ? modeSel.value : 'inc';
      var r = compute(a, mode);
      if (!animate || window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        draw(a, r, a.length - 1, true);
        if (out) out.textContent = finalText(a, r);
        return;
      }
      var i = 0;
      (function step() {
        if (my !== token) return;
        draw(a, r, i, false);
        if (out) out.textContent = explain(a, r, i);
        if (i >= a.length - 1) {
          window.CP.sleep(1100).then(function () {
            if (my !== token) return;
            draw(a, r, i, true);
            if (out) out.textContent = finalText(a, r);
          });
          return;
        }
        i++;
        window.CP.sleep(1100).then(step);
      })();
    }

    if (btnRun) btnRun.addEventListener('click', function () { run(true); });
    if (btnAll) btnAll.addEventListener('click', function () { run(false); });
    if (modeSel) modeSel.addEventListener('change', function () { run(false); });
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); run(false); }
    });

    run(false);
  });
})();
