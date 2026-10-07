/* Widget chủ đề "Ước số & số nguyên tố": nhập n → ước, thừa số, số phép chia. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAXN = 1e12;          // d * d ≤ 10^12 vẫn chính xác với số thực double
  var MAX_SHOW = 60;        // số ước tối đa vẽ thành ô
  var PER_ROW = 10;
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

  function sup(k) { return String(k).split('').map(function (c) { return SUP[c] || c; }).join(''); }
  function fmt(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  // Liệt kê ước theo cặp, trả về nửa nhỏ, nửa lớn và số lần lặp
  function divisors(n) {
    var small = [], big = [], steps = 0;
    for (var d = 1; d * d <= n; d++) {
      steps++;
      if (n % d === 0) {
        small.push(d);
        if (d !== n / d) big.push(n / d);
      }
    }
    return { small: small, big: big.reverse(), steps: steps };
  }

  // Chia thử, đếm số lần thử p
  function factorize(n) {
    var f = [], steps = 0;
    for (var p = 2; p * p <= n; p++) {
      steps++;
      if (n % p === 0) {
        var c = 0;
        while (n % p === 0) { n /= p; c++; }
        f.push([p, c]);
      }
    }
    if (n > 1) f.push([n, 1]);
    return { f: f, steps: steps };
  }

  // Kiểm tra nguyên tố bằng 6k ± 1, đếm số phép chia
  function isPrime(n) {
    if (n < 2) return { ok: false, steps: 0 };
    if (n < 4) return { ok: true, steps: 0 };
    if (n % 2 === 0) return { ok: false, steps: 1 };
    if (n % 3 === 0) return { ok: false, steps: 2 };
    var steps = 2;
    for (var d = 5; d * d <= n; d += 6) {
      steps += 2;
      if (n % d === 0 || n % (d + 2) === 0) return { ok: false, steps: steps };
    }
    return { ok: true, steps: steps };
  }

  function parse(raw) {
    var s = String(raw || '').replace(/[\s.,_']/g, '');
    if (!/^\d{1,13}$/.test(s)) return null;
    var n = Number(s);
    if (!isFinite(n) || n < 1 || n > MAXN || Math.floor(n) !== n) return null;
    return n;
  }

  CP.mount('#viz-divisors-primes', function (root) {
    var input = root.querySelector('input');
    var runBtn = root.querySelector('[data-act="run"]');
    var randBtn = root.querySelector('[data-act="rand"]');
    var cells = root.querySelector('.dp-cells');
    var out = root.querySelector('.out');
    if (!input || !out || !cells) return;

    function cell(v, cls) {
      var s = document.createElement('span');
      s.className = 'cell' + (cls ? ' ' + cls : '');
      s.textContent = fmt(v);
      return s;
    }

    function drawCells(small, big) {
      cells.textContent = '';
      var all = [], i;
      var sq = small.length && big.length < small.length; // n chính phương: ước √n là phần tử cuối của nửa nhỏ
      for (i = 0; i < small.length; i++) all.push([small[i], (sq && i === small.length - 1) ? 'is-active' : 'is-ok']);
      for (i = 0; i < big.length; i++) all.push([big[i], 'is-cmp']);
      var shown = all.slice(0, MAX_SHOW);
      for (i = 0; i < shown.length; i += PER_ROW) {
        var row = document.createElement('div');
        row.className = 'arr';
        shown.slice(i, i + PER_ROW).forEach(function (x) { row.appendChild(cell(x[0], x[1])); });
        cells.appendChild(row);
      }
      var legend = document.createElement('div');
      legend.className = 'viz-legend';
      legend.innerHTML = '<span><i class="is-ok"></i>ước ≤ √n (vòng lặp tìm)</span>' +
        '<span><i class="is-cmp"></i>ước &gt; √n (n / d)</span>' +
        (sq ? '<span><i class="is-active"></i>√n (chỉ đếm một lần)</span>' : '') +
        (all.length > MAX_SHOW ? '<span>… còn ' + fmt(all.length - MAX_SHOW) + ' ước không vẽ</span>' : '');
      cells.appendChild(legend);
    }

    function run() {
      var n = parse(input.value);
      if (n === null) {
        cells.textContent = '';
        out.textContent = 'Dữ liệu không hợp lệ. Hãy nhập một số nguyên từ 1 đến 1 000 000 000 000 (10¹²).';
        return;
      }
      var dv = divisors(n), fz = factorize(n), pr = isPrime(n);
      var cnt = 1, sum = 1, allEven = true;
      var parts = fz.f.map(function (pa) {
        var p = pa[0], a = pa[1], term = 1, pw = 1;
        for (var j = 0; j < a; j++) { pw *= p; term += pw; }
        cnt *= (a + 1); sum *= term;
        if (a % 2) allEven = false;
        return fmt(p) + (a > 1 ? sup(a) : '');
      });
      var tau = dv.small.length + dv.big.length;
      var formula = fz.f.length ? fz.f.map(function (pa) { return '(' + pa[1] + '+1)'; }).join('') : '1';
      var lines = [
        'n = ' + fmt(n),
        'Số nguyên tố?   ' + (pr.ok ? 'CÓ' : 'KHÔNG'),
        'Phân tích:      ' + (parts.length ? parts.join(' · ') : '1 (không có thừa số nguyên tố)'),
        'Số ước:         ' + fmt(cnt) + ' = ' + formula + (cnt === tau ? '' : '  (lệch với liệt kê: ' + tau + ')'),
        'Tổng ước:       ' + fmt(sum) + (sum === 2 * n ? '  → số hoàn hảo' : ''),
        'Số chính phương? ' + (allEven ? 'CÓ (mọi số mũ chẵn, số ước lẻ)' : 'KHÔNG'),
        '',
        'Số phép chia cần làm:',
        '  thử mọi d từ 1 đến n (ngây thơ):  ' + fmt(n),
        '  liệt kê ước với d·d ≤ n:          ' + fmt(dv.steps),
        '  kiểm tra nguyên tố 6k ± 1:        ' + fmt(pr.steps),
        '  chia thử để phân tích:            ' + fmt(fz.steps) + ' lượt thử p'
      ];
      if (dv.steps > 0 && n >= 1000) lines.push('  → duyệt √n nhanh hơn khoảng ' + fmt(Math.round(n / dv.steps)) + ' lần');
      out.textContent = lines.join('\n');
      drawCells(dv.small, dv.big);
    }

    var samples = [36, 97, 360, 496, 1001, 8128, 720720, 1000000007, 999999999989, 963761198400, 600851475143];
    if (runBtn) runBtn.addEventListener('click', run);
    if (randBtn) randBtn.addEventListener('click', function () {
      var n = Math.random() < 0.5
        ? samples[Math.floor(Math.random() * samples.length)]
        : 1 + Math.floor(Math.random() * 1e6);
      input.value = String(n);
      run();
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    run();
  });
})();
