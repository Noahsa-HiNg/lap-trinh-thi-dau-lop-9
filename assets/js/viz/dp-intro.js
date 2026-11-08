/* Widget "Nhập môn QHĐ":
   (1) điền bảng leo cầu thang với tập bước tùy chọn và bậc hỏng, có chạy từng bước;
   (2) đếm số lời gọi Fibonacci: đệ quy thường 2F(n+1) - 1, có nhớ 2n - 1. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 40;
  var MAX_STEPS = 10;
  var MAX_FIB = 90;
  var CALLS_PER_SEC = 7.6e8; // đo trên máy thử: fib(45) gọi 3,67 tỉ lần trong khoảng 4,8 giây

  function parseList(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên dương.' };
      a.push(parseInt(parts[i], 10));
    }
    return { a: a };
  }

  function uniqSorted(a) {
    var seen = {}, r = [];
    a.forEach(function (x) { if (!seen[x]) { seen[x] = true; r.push(x); } });
    return r.sort(function (x, y) { return x - y; });
  }

  // nhóm chữ số: 3672623805 -> "3 672 623 805"
  function group(s) {
    s = String(s);
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function cell(text, idx, cls, ptr) {
    var s = document.createElement('span');
    s.className = 'cell' + (cls ? ' ' + cls : '');
    s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    s.textContent = text;
    return s;
  }

  function humanTime(sec) {
    if (sec < 0.001) return 'chưa tới 1 mili giây';
    if (sec < 1) return 'khoảng ' + (sec * 1000).toFixed(0) + ' mili giây';
    if (sec < 120) return 'khoảng ' + sec.toFixed(1).replace('.', ',') + ' giây';
    if (sec < 7200) return 'khoảng ' + Math.round(sec / 60) + ' phút';
    if (sec < 172800) return 'khoảng ' + Math.round(sec / 3600) + ' giờ';
    if (sec < 3.156e7 * 2) return 'khoảng ' + Math.round(sec / 86400) + ' ngày';
    return 'khoảng ' + group(Math.round(sec / 3.156e7)) + ' năm';
  }

  window.CP.mount('#viz-dp-intro', function (root) {
    var inN = root.querySelector('#dpi-n');
    var inSteps = root.querySelector('#dpi-steps');
    var inBroken = root.querySelector('#dpi-broken');
    var view = root.querySelector('.dpi-view');
    var outs = root.querySelectorAll('.out');
    var out = outs[0];
    var btnRun = root.querySelector('[data-act="run"]');
    var btnAll = root.querySelector('[data-act="all"]');
    var inFib = root.querySelector('#dpi-fib');
    var fibOut = root.querySelector('.dpi-fib-out');
    var btnFib = root.querySelector('[data-act="fib"]');

    var token = 0; // huỷ hoạt hình cũ khi bấm lại

    function readInput() {
      var n = parseInt(String(inN && inN.value).trim(), 10);
      if (!isFinite(n) || n < 1 || n > MAX_N) return { err: 'Số bậc n phải là số nguyên từ 1 đến ' + MAX_N + '.' };
      var ps = parseList(inSteps ? inSteps.value : '');
      if (ps.err) return { err: 'Các bước: ' + ps.err };
      var steps = uniqSorted(ps.a);
      if (steps.length === 0) return { err: 'Cần ít nhất một bước được phép, ví dụ "1 2".' };
      if (steps.length > MAX_STEPS) return { err: 'Tối đa ' + MAX_STEPS + ' loại bước khác nhau.' };
      for (var i = 0; i < steps.length; i++) {
        if (steps[i] < 1 || steps[i] > n) return { err: 'Mỗi bước phải từ 1 đến n = ' + n + '.' };
      }
      var pb = parseList(inBroken ? inBroken.value : '');
      if (pb.err) return { err: 'Bậc hỏng: ' + pb.err };
      var broken = {};
      for (var j = 0; j < pb.a.length; j++) {
        if (pb.a[j] < 1 || pb.a[j] > n) return { err: 'Bậc hỏng phải nằm trong khoảng 1 đến ' + n + ' (bậc 0 là mặt đất).' };
        broken[pb.a[j]] = true;
      }
      return { n: n, steps: steps, broken: broken };
    }

    function compute(d) {
      var dp = [1];
      for (var i = 1; i <= d.n; i++) {
        var v = 0;
        if (!d.broken[i]) {
          d.steps.forEach(function (s) { if (s <= i) v += dp[i - s]; });
        }
        dp.push(v);
      }
      return dp;
    }

    function draw(d, dp, upto) {
      if (!view) return;
      view.textContent = '';
      var row = document.createElement('div');
      row.className = 'arr';
      var lb = document.createElement('span');
      lb.className = 'arr-label';
      lb.textContent = 'dp';
      row.appendChild(lb);
      var from = {};
      if (upto >= 1 && upto <= d.n && !d.broken[upto]) {
        d.steps.forEach(function (s) { if (s <= upto) from[upto - s] = true; });
      }
      for (var j = 0; j <= d.n; j++) {
        var cls = '', ptr = '', txt = j <= upto ? String(dp[j]) : '?';
        if (d.broken[j]) { cls = 'is-bad'; ptr = 'hỏng'; }
        if (j > upto) cls = d.broken[j] ? 'is-bad' : 'is-dim';
        else if (j === upto) { cls = upto === d.n ? 'is-ok' : 'is-active'; ptr = 'i'; }
        else if (from[j]) cls = 'is-cmp';
        row.appendChild(cell(txt, j, cls, ptr));
      }
      view.appendChild(row);
    }

    function explain(d, dp, i) {
      if (i === 0) return 'Cơ sở: dp[0] = 1 (đứng ở mặt đất).';
      if (d.broken[i]) return 'Bậc ' + i + ' hỏng nên dp[' + i + '] = 0.';
      var terms = [], vals = [];
      d.steps.forEach(function (s) { if (s <= i) { terms.push('dp[' + (i - s) + ']'); vals.push(String(dp[i - s])); } });
      return 'dp[' + i + '] = ' + terms.join(' + ') + ' = ' + vals.join(' + ') + ' = ' + dp[i] + '.';
    }

    function finalText(d, dp) {
      return 'Bước được phép: ' + d.steps.join(', ') + '. ' +
        'dp = (' + dp.join(', ') + ').\nCó ' + group(dp[d.n]) + ' cách lên đúng bậc ' + d.n + '.';
    }

    function run(animate) {
      var my = ++token;
      var d = readInput();
      if (d.err) { if (view) view.textContent = ''; if (out) out.textContent = d.err; return; }
      var dp = compute(d);
      if (!animate || window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        draw(d, dp, d.n);
        if (out) out.textContent = finalText(d, dp);
        return;
      }
      var i = 0;
      (function step() {
        if (my !== token) return;
        draw(d, dp, i);
        if (out) out.textContent = explain(d, dp, i);
        if (i >= d.n) {
          window.CP.sleep(700).then(function () { if (my === token && out) out.textContent = explain(d, dp, i) + '\n' + finalText(d, dp); });
          return;
        }
        i++;
        window.CP.sleep(650).then(step);
      })();
    }

    function fibCount() {
      if (!fibOut) return;
      var n = parseInt(String(inFib && inFib.value).trim(), 10);
      if (!isFinite(n) || n < 0 || n > MAX_FIB) { fibOut.textContent = 'Hãy nhập n là số nguyên từ 0 đến ' + MAX_FIB + '.'; return; }
      if (typeof BigInt !== 'function') { fibOut.textContent = 'Trình duyệt này chưa hỗ trợ số nguyên lớn (BigInt).'; return; }
      var a = BigInt(0), b = BigInt(1); // F(0), F(1)
      for (var i = 0; i < n; i++) { var c = a + b; a = b; b = c; } // sau vòng: a = F(n), b = F(n+1)
      var naive = BigInt(2) * b - BigInt(1);
      var memo = n === 0 ? 1 : 2 * n - 1;
      var adds = n >= 2 ? n - 1 : 0;
      var ratio = Number(naive) / memo;
      fibOut.textContent =
        'F(' + n + ') = ' + group(a.toString()) + '\n' +
        'Đệ quy thường: 2·F(' + (n + 1) + ') − 1 = ' + group(naive.toString()) + ' lời gọi, ' +
        humanTime(Number(naive) / CALLS_PER_SEC) + ' trên máy thử.\n' +
        'Đệ quy có nhớ: ' + memo + ' lời gọi. Bảng phương án: ' + adds + ' phép cộng.\n' +
        'Đệ quy thường gọi nhiều gấp khoảng ' + group(Math.round(ratio)) + ' lần.';
    }

    if (btnRun) btnRun.addEventListener('click', function () { run(true); });
    if (btnAll) btnAll.addEventListener('click', function () { run(false); });
    if (btnFib) btnFib.addEventListener('click', fibCount);
    [inN, inSteps, inBroken].forEach(function (el) {
      if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(false); } });
    });
    if (inFib) inFib.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); fibCount(); } });

    run(false);
    fibCount();
  });
})();
