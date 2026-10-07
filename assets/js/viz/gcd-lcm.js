/* Widget Euclid từng bước cho topics/gcd-lcm.html
 * Nhập a, b (số nguyên không âm, tối đa 18 chữ số) -> bảng các bước a = q*b + r,
 * gcd, lcm, hệ số Bézout, và so sánh số bước với cách thử từng số / Euclid dạng trừ.
 * Dùng BigInt để tính đúng với số tới 10^18. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;
  var CP = window.CP;

  function fmt(v) {
    var s = v.toString(), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var out = '';
    while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
    return (neg ? '−' : '') + s + out;
  }

  function parse(str) {
    var t = String(str == null ? '' : str).replace(/[\s.,_]/g, '');
    if (!/^\d{1,18}$/.test(t)) return null;
    return BigInt(t);
  }

  function solve(a, b) {
    var steps = [], x = a, y = b;
    while (y !== 0n) {
      var q = x / y, r = x % y;
      steps.push({ a: x, b: y, q: q, r: r });
      x = y; y = r;
    }
    var g = x;
    // Euclid mở rộng: đi ngược các thương q để dựng (s, t) với a*s + b*t = g
    var s = 1n, t = 0n;
    for (var i = steps.length - 1; i >= 0; i--) {
      var ns = t, nt = s - steps[i].q * t;
      s = ns; t = nt;
    }
    var lo = a < b ? a : b;
    var naive = lo === 0n ? 0n : lo - g + 1n;      // thử d từ min(a,b) giảm về g
    var sub = null;                                // số phép trừ của Euclid dạng trừ
    if (a > 0n && b > 0n) {
      sub = 0n;
      for (var j = 0; j < steps.length; j++) sub += steps[j].q;
      sub -= 1n;
    }
    var lcm = (a === 0n || b === 0n) ? 0n : a / g * b;
    return { steps: steps, g: g, s: s, t: t, naive: naive, sub: sub, lcm: lcm };
  }

  function fib(n) {
    var p = 0n, c = 1n;
    for (var i = 0; i < n; i++) { var nx = p + c; p = c; c = nx; }
    return p;
  }

  CP.mount('#viz-gcd-lcm', function (root) {
    var inA = root.querySelector('#gcd-lcm-a');
    var inB = root.querySelector('#gcd-lcm-b');
    var out = root.querySelector('.out');
    var body = root.querySelector('.playground-body') || root;
    if (!inA || !inB || !out) return;

    var wrap = document.createElement('div');
    wrap.setAttribute('aria-live', 'polite');
    body.appendChild(wrap);
    var token = 0;

    function cell(tr, tag, text) {
      var c = document.createElement(tag);
      c.textContent = text;
      tr.appendChild(c);
      return c;
    }

    function run() {
      var my = ++token;
      wrap.textContent = '';
      var a = parse(inA.value), b = parse(inB.value);
      if (a === null || b === null) {
        out.textContent = 'Dữ liệu chưa hợp lệ: a và b phải là số nguyên không âm, tối đa 18 chữ số.';
        return;
      }
      if (a === 0n && b === 0n) {
        out.textContent = 'gcd(0, 0) không có ước chung lớn nhất (quy ước bằng 0). Hãy nhập ít nhất một số khác 0.';
        return;
      }
      var res = solve(a, b);

      var table = document.createElement('table');
      table.className = 'trace';
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      ['Bước', 'a', 'b', 'q = a div b', 'r = a mod b'].forEach(function (h) { cell(hr, 'th', h); });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      table.appendChild(tbody);
      wrap.appendChild(table);

      var lines = [];
      lines.push('gcd(' + fmt(a) + ', ' + fmt(b) + ') = ' + fmt(res.g) + '   sau ' + res.steps.length + ' bước chia dư.');
      lines.push('lcm = ' + (res.lcm === 0n ? '0 (có một số bằng 0)' : fmt(a) + ' / ' + fmt(res.g) + ' · ' + fmt(b) + ' = ' + fmt(res.lcm)));
      lines.push('Euclid mở rộng: ' + fmt(a) + ' · (' + fmt(res.s) + ') + ' + fmt(b) + ' · (' + fmt(res.t) + ') = ' + fmt(res.g));
      lines.push('So sánh: thử từng số cần ' + fmt(res.naive) + ' lần thử; Euclid dạng trừ cần ' +
        (res.sub === null ? 'lặp mãi (có số 0)' : fmt(res.sub) + ' phép trừ') + '; Euclid chia dư cần ' + res.steps.length + ' bước.');
      if (res.steps.length > 0 && res.steps.every(function (st, k) { return st.q === 1n || k === res.steps.length - 1; }) && res.steps.length >= 5) {
        lines.push('Mọi thương q đều bằng 1 (trừ bước cuối): đây là cặp Fibonacci, trường hợp xấu nhất.');
      }
      out.textContent = 'Đang chạy…';

      var rows = res.steps.map(function (st, k) {
        var tr = document.createElement('tr');
        cell(tr, 'td', String(k + 1));
        cell(tr, 'td', fmt(st.a));
        cell(tr, 'td', fmt(st.b));
        cell(tr, 'td', fmt(st.q));
        cell(tr, 'td', fmt(st.r));
        return tr;
      });
      var last = document.createElement('tr');
      last.className = 'hl';
      cell(last, 'td', String(res.steps.length + 1));
      cell(last, 'td', fmt(res.g));
      cell(last, 'td', '0');
      var end = cell(last, 'td', 'b = 0, dừng');
      end.colSpan = 2;
      rows.push(last);

      var delay = rows.length > 30 ? 60 : 280;
      (function show(i) {
        if (my !== token) return;
        if (i >= rows.length) { out.textContent = lines.join('\n'); return; }
        tbody.appendChild(rows[i]);
        if (CP.reduceMotion) { show(i + 1); return; }
        CP.sleep(delay).then(function () { show(i + 1); });
      })(0);
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-act');
      if (act === 'fib') {
        var n = 10 + Math.floor(Math.random() * 35);   // F(10) .. F(44)
        inA.value = fib(n + 1).toString();
        inB.value = fib(n).toString();
      } else if (act === 'rand') {
        inA.value = String(1 + Math.floor(Math.random() * 1e9));
        inB.value = String(1 + Math.floor(Math.random() * 1e9));
      }
      run();
    });
    [inA, inB].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    });
    run();
  });
})();
