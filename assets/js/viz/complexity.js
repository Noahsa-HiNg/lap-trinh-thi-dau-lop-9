/* Máy đếm phép tính cho trang topics/complexity.html
   Nhập n, chọn đoạn code mẫu: tính số lần thân vòng lặp chạy (chính xác bằng BigInt khi được,
   xấp xỉ khi quá lớn), ước lượng thời gian với mốc 10^8 phép/giây và so sánh mọi lớp độ phức tạp. */
(function () {
  'use strict';
  if (typeof CP === 'undefined' || typeof BigInt === 'undefined') return;

  var OPS_PER_SEC = 1e8;
  var MAX_N = BigInt('1000000000000000000'); // 10^18
  var LOG10_2 = Math.log10(2);
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };

  function sup(k) { return String(k).split('').map(function (c) { return SUP[c] || c; }).join(''); }

  /* Căn bậc hai nguyên của BigInt (Newton). */
  function isqrt(n) {
    if (n < 2n) return n;
    var x = BigInt(Math.floor(Math.sqrt(Number(n))));
    while (x * x > n) x -= 1n;
    while ((x + 1n) * (x + 1n) <= n) x += 1n;
    return x;
  }

  /* log10 của một BigInt dương. */
  function log10Big(b) {
    var s = b.toString();
    if (s.length <= 15) return Math.log10(Number(s));
    return Math.log10(Number(s.slice(0, 15))) + (s.length - 15);
  }

  /* Kết quả đếm: { big: BigInt chính xác hoặc null, lg: log10 của số phép, approx: true nếu xấp xỉ } */
  function exact(b) { return { big: b, lg: log10Big(b), approx: false }; }
  function approx(lg) { return { big: null, lg: lg, approx: true }; }

  function harmonic(n) {
    /* Tổng ⌊n/i⌋ với i = 1..n, tính theo khối có cùng thương: O(√n) bước. Chính xác khi n ≤ 10^12. */
    if (n <= 1000000000000n) {
      var m = Number(n), s = 0, i = 1;
      while (i <= m) {
        var q = Math.floor(m / i), j = Math.floor(m / q);
        s += q * (j - i + 1);
        i = j + 1;
      }
      return exact(BigInt(s));
    }
    var x = Number(n);
    return approx(Math.log10(x * (Math.log(x) + 2 * 0.5772156649 - 1)));
  }

  function factorial(n) {
    if (n <= 2000n) {
      var p = 1n;
      for (var i = 2n; i <= n; i++) p *= i;
      return exact(p);
    }
    var x = Number(n); // Stirling: log10 n! ≈ n log10 n − n log10 e + ½ log10(2πn)
    return approx(x * Math.log10(x) - x * Math.LOG10E + 0.5 * Math.log10(2 * Math.PI * x));
  }

  var SNIPPETS = [
    { id: 'o1', big: 'O(1)', name: 'Công thức', code: 'S = n * (n + 1) / 2;   // 1 lần', count: function () { return exact(1n); } },
    { id: 'log', big: 'O(log n)', name: 'Chia đôi', code: 'for (i = n; i >= 1; i /= 2) dem++;', count: function (n) { return exact(BigInt(n.toString(2).length)); } },
    { id: 'sqrt', big: 'O(√n)', name: 'Duyệt đến căn', code: 'for (i = 1; i * i <= n; i++) dem++;', count: function (n) { return exact(isqrt(n)); } },
    { id: 'n', big: 'O(n)', name: 'Một vòng lặp', code: 'for (i = 1; i <= n; i++) dem++;', count: function (n) { return exact(n); } },
    { id: 'nlogn', big: 'O(n log n)', name: 'Bước nhảy j += i', code: 'for (i = 1; i <= n; i++)\n    for (j = i; j <= n; j += i) dem++;', count: harmonic },
    { id: 'pairs', big: 'O(n²)', name: 'Mọi cặp i < j', code: 'for (i = 1; i <= n; i++)\n    for (j = i + 1; j <= n; j++) dem++;', count: function (n) { return exact(n * (n - 1n) / 2n); } },
    { id: 'n2', big: 'O(n²)', name: 'Hai vòng lồng', code: 'for (i = 1; i <= n; i++)\n    for (j = 1; j <= n; j++) dem++;', count: function (n) { return exact(n * n); } },
    { id: 'n3', big: 'O(n³)', name: 'Ba vòng lồng', code: 'for (i = 1; i <= n; i++)\n  for (j = 1; j <= n; j++)\n    for (k = 1; k <= n; k++) dem++;', count: function (n) { return exact(n * n * n); } },
    { id: 'exp', big: 'O(2ⁿ)', name: 'Duyệt tập con', code: 'void thu(int i) {          // đếm số lá\n    if (i == n) { dem++; return; }\n    thu(i + 1); thu(i + 1);\n}', count: function (n) { return n <= 4000n ? exact(1n << n) : approx(Number(n) * LOG10_2); } },
    { id: 'fact', big: 'O(n!)', name: 'Duyệt hoán vị', code: 'do { dem++; }\nwhile (next_permutation(p, p + n));', count: factorial }
  ];

  function group(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* Viết số dạng khoa học từ log10: 1,23·10¹⁵ */
  function sci(lg) {
    var k = Math.floor(lg + 1e-12), m = Math.pow(10, lg - k);
    if (m >= 9.995) { m = 1; k += 1; }
    var ms = m.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return (ms === '1' ? '' : ms + '·') + '10' + sup(k);
  }

  function fmtCount(r) {
    if (r.big !== null) {
      var s = r.big.toString();
      if (s.length <= 16) return group(s);
      return '≈ ' + sci(r.lg) + ' (' + s.length + ' chữ số)';
    }
    return '≈ ' + sci(r.lg);
  }

  /* Thời gian ước lượng từ log10 số phép. */
  function fmtTime(lg) {
    var t = lg - Math.log10(OPS_PER_SEC); // log10 giây
    if (t < -3) return 'dưới 1 mili giây';
    var sec = Math.pow(10, t);
    function f(x) { return (x < 10 ? x.toFixed(1) : Math.round(x).toString()).replace('.', ','); }
    if (sec < 1) return f(sec * 1000) + ' mili giây';
    if (sec < 60) return f(sec) + ' giây';
    if (sec < 3600) return f(sec / 60) + ' phút';
    if (sec < 86400) return f(sec / 3600) + ' giờ';
    if (sec < 365.25 * 86400) return f(sec / 86400) + ' ngày';
    var ylg = t - Math.log10(365.25 * 86400);
    var y = ylg < 6 ? group(Math.round(Math.pow(10, ylg)).toString()) : sci(ylg);
    return y + ' năm' + (ylg > Math.log10(1.38e10) ? ' (lâu hơn tuổi vũ trụ)' : '');
  }

  function verdict(lg) {
    if (lg <= 8 + 1e-9) return { text: 'Kịp 1 giây', color: 'var(--ok)' };
    if (lg <= 9 + 1e-9) return { text: 'Rủi ro', color: 'var(--warn)' };
    return { text: 'Quá thời gian', color: 'var(--bad)' };
  }

  /* Đọc n: chấp nhận 1000000, 1 000 000, 10^6, 10**6, 1e6, 2*10^5, 2e5. */
  function parseN(raw) {
    var s = String(raw || '').trim().replace(/[\s.,_']/g, '').replace(/[×x·]/gi, '*');
    if (!s) return { err: 'Hãy nhập n.' };
    var m, v;
    try {
      if (/^\d+$/.test(s)) v = BigInt(s);
      else if ((m = s.match(/^(\d+)\*10(?:\^|\*\*)(\d+)$/))) v = BigInt(m[1]) * (10n ** BigInt(Math.min(+m[2], 40)));
      else if ((m = s.match(/^(\d+)(?:\^|\*\*)(\d+)$/))) {
        if (+m[2] > 200) return { err: 'Số mũ quá lớn.' };
        v = BigInt(m[1]) ** BigInt(m[2]);
      } else if ((m = s.match(/^(\d+)e(\d+)$/i))) v = BigInt(m[1]) * (10n ** BigInt(Math.min(+m[2], 40)));
      else return { err: 'Không đọc được “' + raw + '”. Ví dụ hợp lệ: 100000, 10^5, 2*10^5, 1e6.' };
    } catch (e) { return { err: 'Không đọc được số này.' }; }
    if (v < 1n) return { err: 'n phải ít nhất là 1.' };
    if (v > MAX_N) return { err: 'Máy đếm chỉ nhận n ≤ 10¹⁸.' };
    return { n: v };
  }

  CP.mount('#viz-complexity', function (root) {
    var body = root.querySelector('.playground-body') || root;
    body.innerHTML = '';
    var el = function (tag, attrs, text) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      return e;
    };

    var controls = el('div', { 'class': 'controls' });
    var lbN = el('label', { 'for': 'complexity-n' }, 'n = ');
    var inN = el('input', { type: 'text', id: 'complexity-n', value: '100000', inputmode: 'numeric', autocomplete: 'off', spellcheck: 'false' });
    lbN.appendChild(inN);
    var lbS = el('label', { 'for': 'complexity-code' }, 'Đoạn code ');
    var sel = el('select', { id: 'complexity-code' });
    SNIPPETS.forEach(function (sn) { sel.appendChild(el('option', { value: sn.id }, sn.big + ' – ' + sn.name)); });
    sel.value = 'n2';
    lbS.appendChild(sel);
    var btn = el('button', { type: 'button' }, 'Đếm');
    controls.appendChild(lbN); controls.appendChild(lbS); controls.appendChild(btn);

    var presets = el('div', { 'class': 'controls' });
    presets.appendChild(el('span', { 'class': 'muted' }, 'Thử nhanh:'));
    ['8', '20', '500', '5000', '10^5', '10^6', '10^12', '10^18'].forEach(function (p) {
      var b = el('button', { type: 'button', 'class': 'ghost' }, 'n = ' + p);
      b.addEventListener('click', function () { inN.value = p; run(); });
      presets.appendChild(b);
    });

    var out = el('div', { 'class': 'out', 'aria-live': 'polite' });
    var tableWrap = el('div', { 'class': 'table-wrap' });

    body.appendChild(controls);
    body.appendChild(presets);
    body.appendChild(out);
    body.appendChild(tableWrap);

    function run() {
      var p = parseN(inN.value);
      out.innerHTML = '';
      tableWrap.innerHTML = '';
      if (p.err) { out.appendChild(el('span', null, p.err)); out.style.color = 'var(--bad)'; return; }
      out.style.color = '';
      var n = p.n;
      var cur = SNIPPETS.filter(function (s) { return s.id === sel.value; })[0] || SNIPPETS[0];
      var r = cur.count(n);
      var v = verdict(r.lg);

      out.appendChild(el('div', null, cur.code));
      out.appendChild(el('div', null, ' '));
      out.appendChild(el('div', null, 'n = ' + (n.toString().length <= 16 ? group(n.toString()) : n.toString())));
      out.appendChild(el('div', null, 'Số lần thân vòng lặp chạy: ' + fmtCount(r) + (r.approx ? '  (xấp xỉ)' : '')));
      out.appendChild(el('div', null, 'Thời gian ước lượng (10⁸ phép/giây): ' + fmtTime(r.lg)));
      var vd = el('div', null, 'Kết luận với giới hạn 1 giây: ' + v.text);
      vd.style.color = v.color; vd.style.fontWeight = '700';
      out.appendChild(vd);

      var tb = el('table', { 'class': 'trace' });
      var th = el('thead'); var hr = el('tr');
      ['Độ phức tạp', 'Đoạn code', 'Số phép với n này', 'Thời gian', 'Kết luận'].forEach(function (h) { hr.appendChild(el('th', null, h)); });
      th.appendChild(hr); tb.appendChild(th);
      var tbody = el('tbody');
      SNIPPETS.forEach(function (sn) {
        var rr = sn.count(n), vv = verdict(rr.lg);
        var tr = el('tr', sn.id === cur.id ? { 'class': 'hl' } : null);
        tr.appendChild(el('td', null, sn.big));
        tr.appendChild(el('td', null, sn.name));
        tr.appendChild(el('td', null, fmtCount(rr)));
        tr.appendChild(el('td', null, fmtTime(rr.lg)));
        var tdv = el('td', null, vv.text); tdv.style.color = vv.color; tdv.style.fontWeight = '600';
        tr.appendChild(tdv);
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', function () { sel.value = sn.id; run(); });
        tbody.appendChild(tr);
      });
      tb.appendChild(tbody);
      tableWrap.appendChild(tb);
      if (!CP.reduceMotion && out.animate) {
        try { out.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 220 }); } catch (e) { /* bỏ qua */ }
      }
    }

    btn.addEventListener('click', run);
    sel.addEventListener('change', run);
    inN.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    run();
  });
})();
