/* Widget: so sánh lời giải trâu và công thức (chủ đề brute-force-formula). */
(function () {
  'use strict';

  var LIMIT = 10n ** 18n;         // giới hạn mỗi tham số
  var RUN_MAX = 20000000;         // chỉ chạy thật lời giải trâu khi số bước <= 2·10^7
  var OPS_PER_SEC = 1e8;          // ước lượng tốc độ C++: khoảng 10^8 phép tính/giây

  var KINDS = {
    sum: { hint: 'n', def: '1000000', count: 1 },
    div: { hint: 'a b k', def: '10 50 7', count: 3 },
    zero: { hint: 'n', def: '100', count: 1 },
    spiral: { hint: 'y x', def: '4 2', count: 2 }
  };

  function fmt(b) {
    var s = (typeof b === 'bigint' ? b : BigInt(Math.round(b))).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function fmtTime(sec) {
    if (sec < 1e-3) return 'dưới 1 mili giây';
    if (sec < 1) return (sec * 1000).toFixed(0) + ' mili giây';
    if (sec < 120) return sec.toFixed(1) + ' giây';
    if (sec < 7200) return (sec / 60).toFixed(0) + ' phút';
    if (sec < 2 * 86400) return (sec / 3600).toFixed(0) + ' giờ';
    if (sec < 2 * 31557600) return (sec / 86400).toFixed(0) + ' ngày';
    var y = sec / 31557600;
    return (y < 1e6 ? fmt(Math.round(y)) : y.toExponential(1).replace('e+', ' · 10^')) + ' năm';
  }

  /* Đọc dãy số nguyên dương, trả về mảng BigInt hoặc chuỗi lỗi. */
  function parse(text, count) {
    var parts = String(text).trim().split(/[\s,;]+/).filter(Boolean);
    if (parts.length !== count) return 'Cần nhập đúng ' + count + ' số nguyên dương, cách nhau bởi dấu cách.';
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\d{1,19}$/.test(parts[i])) return 'Giá trị "' + parts[i].slice(0, 20) + '" không phải số nguyên dương hợp lệ.';
      var v = BigInt(parts[i]);
      if (v < 1n) return 'Các số phải từ 1 trở lên.';
      if (v > LIMIT) return 'Mỗi số tối đa 10^18.';
      out.push(v);
    }
    return out;
  }

  /* ----- Công thức (BigInt, chính xác) ----- */
  function formula(kind, v) {
    if (kind === 'sum') return v[0] * (v[0] + 1n) / 2n;
    if (kind === 'div') return v[1] / v[2] - (v[0] - 1n) / v[2];
    if (kind === 'zero') { var n = v[0], c = 0n; while (n > 0n) { n /= 5n; c += n; } return c; }
    var y = v[0], x = v[1], k = y > x ? y : x, lo = (k - 1n) * (k - 1n);
    if (k % 2n === 0n) return x === k ? lo + y : k * k - x + 1n;
    return y === k ? lo + x : k * k - y + 1n;
  }

  /* Số bước lời giải trâu cần (BigInt). */
  function bruteOps(kind, v) {
    if (kind === 'sum') return v[0];
    if (kind === 'div') return v[1] >= v[0] ? v[1] - v[0] + 1n : 0n;
    if (kind === 'zero') return v[0];
    var k = v[0] > v[1] ? v[0] : v[1];
    return k * k;                       // tô lần lượt tới hết tầng k
  }

  /* ----- Lời giải trâu thật (Number, chỉ gọi khi số bước nhỏ) ----- */
  function brute(kind, v) {
    var i, c = 0;
    if (kind === 'sum') { var n = Number(v[0]); for (i = 1; i <= n; i++) c += i; return BigInt(c); }
    if (kind === 'div') {
      var a = Number(v[0]), b = Number(v[1]), k = Number(v[2]);
      for (i = a; i <= b; i++) if (i % k === 0) c++;
      return BigInt(c);
    }
    if (kind === 'zero') {
      var m = Number(v[0]);
      for (i = 1; i <= m; i++) { var t = i; while (t % 5 === 0) { c++; t /= 5; } }
      return BigInt(c);
    }
    // Xoắn ốc: đi từng ô theo đúng thứ tự điền cho tới khi gặp (y, x)
    var y = Number(v[0]), x = Number(v[1]), val = 0, L, j;
    for (L = 1; ; L++) {
      if (L % 2 === 0) {
        for (j = 1; j <= L; j++) { val++; if (j === y && L === x) return BigInt(val); }
        for (j = L - 1; j >= 1; j--) { val++; if (L === y && j === x) return BigInt(val); }
      } else {
        for (j = 1; j <= L; j++) { val++; if (L === y && j === x) return BigInt(val); }
        for (j = L - 1; j >= 1; j--) { val++; if (j === y && L === x) return BigInt(val); }
      }
    }
  }

  /* Số bước của lời giải bằng công thức: vài phép tính, riêng số 0 tận cùng là số lần chia cho 5. */
  function formulaOps(kind, v) {
    if (kind !== 'zero') return 5;
    var n = v[0], c = 0;
    while (n > 0n) { n /= 5n; c++; }
    return c;
  }

  /* Chỉ chạy thật khi số bước nhỏ và mọi giá trị vẫn chính xác với kiểu Number. */
  function runnable(kind, v, ops) {
    var safe = BigInt(Number.MAX_SAFE_INTEGER);
    for (var i = 0; i < v.length; i++) if (v[i] > safe) return false;
    return ops <= BigInt(RUN_MAX);
  }

  function formulaText(kind, v) {
    if (kind === 'sum') return 'n(n + 1)/2 với n = ' + fmt(v[0]);
    if (kind === 'div') return '⌊b/k⌋ − ⌊(a − 1)/k⌋ = ' + fmt(v[1] / v[2]) + ' − ' + fmt((v[0] - 1n) / v[2]);
    if (kind === 'zero') {
      var n = v[0], parts = [];
      while (n > 0n && parts.length < 30) { n /= 5n; if (n > 0n) parts.push(fmt(n)); }
      return parts.length ? parts.join(' + ') : '0';
    }
    var k = v[0] > v[1] ? v[0] : v[1];
    return 'tầng k = ' + fmt(k) + (k % 2n === 0n ? ' (chẵn)' : ' (lẻ)') + ', số nhỏ nhất của tầng = ' + fmt((k - 1n) * (k - 1n) + 1n);
  }

  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  CP.mount('#viz-brute-force-formula', function (root) {
    var sel = root.querySelector('select');
    var inp = root.querySelector('input');
    var hint = root.querySelector('.bff-hint');
    var btn = root.querySelector('button');
    var out = root.querySelector('.out');
    if (!sel || !inp || !btn || !out) return;

    function line(label, text) {
      var p = document.createElement('div');
      var b = document.createElement('strong');
      b.textContent = label + ': ';
      p.appendChild(b);
      p.appendChild(document.createTextNode(text));
      return p;
    }

    function bars(opsF, opsB) {
      // Biểu đồ cột theo thang log10 số phép tính
      var lf = Math.max(0.3, Math.log10(Math.max(1, opsF)));
      var lb = Math.max(0.3, Math.log10(Math.max(1, opsB)));
      var wrap = document.createElement('div');
      wrap.className = 'bars';
      wrap.style.setProperty('--max', String(Math.max(lf, lb, 1).toFixed(2)));
      [['Công thức', lf, 'is-ok'], ['Trâu', lb, 'is-bad']].forEach(function (r) {
        var s = document.createElement('span');
        s.className = 'bar ' + r[2];
        s.style.setProperty('--v', r[1].toFixed(2));
        s.setAttribute('data-v', r[0]);
        s.title = r[0] + ': khoảng 10^' + r[1].toFixed(1) + ' phép tính';
        wrap.appendChild(s);
      });
      return wrap;
    }

    function onKind() {
      var k = KINDS[sel.value] || KINDS.sum;
      if (hint) hint.textContent = k.hint;
      inp.value = k.def;
      out.textContent = 'Nhập ' + k.hint + ' rồi bấm “So sánh”.';
    }

    function run() {
      var kind = KINDS[sel.value] ? sel.value : 'sum';
      var v = parse(inp.value, KINDS[kind].count);
      out.textContent = '';
      if (typeof v === 'string') { out.textContent = v; return; }
      if (kind === 'div' && v[0] > v[1]) { out.textContent = 'Cần a ≤ b.'; return; }

      var t0 = now();
      var ans = formula(kind, v);
      var tf = now() - t0;
      var ops = bruteOps(kind, v);
      var opsNum = Number(ops);

      out.appendChild(line('Công thức', formulaText(kind, v)));
      out.appendChild(line('Đáp án', fmt(ans) + '  (tính trong ' + (tf < 1 ? 'dưới 1' : tf.toFixed(1)) + ' ms)'));
      out.appendChild(line('Trâu cần khoảng', fmt(ops) + ' bước lặp'));

      if (runnable(kind, v, ops)) {
        var t1 = now();
        var b = brute(kind, v);
        var tb = now() - t1;
        var same = b === ans;
        out.appendChild(line('Chạy thật lời giải trâu', fmt(b) + ' trong ' + tb.toFixed(1) + ' ms, ' +
          (same ? 'khớp với công thức.' : 'KHÔNG khớp, hãy báo thầy cô!')));
      } else {
        out.appendChild(line('Không chạy thật lời giải trâu', opsNum > RUN_MAX ?
          'quá ' + fmt(RUN_MAX) + ' bước, trình duyệt sẽ treo.' : 'số quá lớn so với kiểu số của trình duyệt.'));
      }
      out.appendChild(line('Ước tính trâu bằng C++ (10^8 phép/giây)', fmtTime(opsNum / OPS_PER_SEC)));
      out.appendChild(line('Biểu đồ', 'chiều cao cột theo số chữ số của số phép tính (thang log)'));
      out.appendChild(bars(formulaOps(kind, v), opsNum));
    }

    sel.addEventListener('change', onKind);
    btn.addEventListener('click', run);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    onKind();
  });
})();
