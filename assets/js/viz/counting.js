/* Widget chủ đề "Quy tắc đếm & nguyên lý bù trừ" (counting).
   Phần 1: tính n!, A(n,k), C(n,k), n^k bằng BigInt và liệt kê khi n nhỏ.
   Phần 2: đếm số x <= N chia hết cho ít nhất một a_i bằng nguyên lý bù trừ. */
(function () {
  'use strict';
  if (typeof CP === 'undefined' || typeof BigInt === 'undefined') return;

  var LETTERS = 'ABCDEFGHIJKL';
  var MAX_LIST = 400; // số dòng liệt kê tối đa

  function mk(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  function fact(n) { var r = 1n; for (var i = 2; i <= n; i++) r *= BigInt(i); return r; }
  function arr(n, k) { if (k > n) return 0n; var r = 1n; for (var i = 0; i < k; i++) r *= BigInt(n - i); return r; }
  function comb(n, k) {
    if (k > n) return 0n;
    if (k > n - k) k = n - k;
    var r = 1n;
    for (var i = 1; i <= k; i++) r = r * BigInt(n - k + i) / BigInt(i);
    return r;
  }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function fmt(x) { // nhóm 3 chữ số cho dễ đọc
    var s = x.toString();
    if (s.length > 60) return s.slice(0, 20) + '…' + s.slice(-10) + ' (' + s.length + ' chữ số)';
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function readInt(input, lo, hi) {
    var v = String(input.value).trim();
    if (!/^\d+$/.test(v)) return null;
    var n = Number(v);
    if (n < lo || n > hi) return null;
    return n;
  }

  // Liệt kê chỉnh hợp chập k (có thứ tự) hoặc tổ hợp chập k (tăng dần) của n chữ cái đầu
  function listing(n, k, ordered) {
    var out = [], cur = [], used = [];
    (function go(start) {
      if (out.length >= MAX_LIST) return;
      if (cur.length === k) { out.push(cur.join('')); return; }
      for (var i = ordered ? 0 : start; i < n; i++) {
        if (used[i]) continue;
        used[i] = true; cur.push(LETTERS[i]);
        go(i + 1);
        cur.pop(); used[i] = false;
        if (out.length >= MAX_LIST) return;
      }
    })(0);
    return out;
  }

  function partOne(body) {
    var box = mk('div');
    box.appendChild(mk('p', null, 'Phần 1. Hoán vị, chỉnh hợp, tổ hợp'));
    var ctr = mk('div', { 'class': 'controls' });
    var ln = mk('label', null, 'n '); var inN = mk('input', { type: 'number', min: '0', max: '1000', value: '4', 'aria-label': 'n' }); ln.appendChild(inN);
    var lk = mk('label', null, 'k '); var inK = mk('input', { type: 'number', min: '0', max: '1000', value: '2', 'aria-label': 'k' }); lk.appendChild(inK);
    var bCalc = mk('button', { type: 'button' }, 'Tính');
    var bList = mk('button', { type: 'button', 'class': 'ghost' }, 'Liệt kê');
    [ln, lk, bCalc, bList].forEach(function (x) { ctr.appendChild(x); });
    var out = mk('div', { 'class': 'out', 'aria-live': 'polite' }, 'Bấm “Tính”.');
    box.appendChild(ctr); box.appendChild(out);
    body.appendChild(box);

    function read() {
      var n = readInt(inN, 0, 1000), k = readInt(inK, 0, 1000);
      if (n === null || k === null) { out.textContent = 'Hãy nhập n, k là số nguyên trong đoạn [0, 1000].'; return null; }
      return { n: n, k: k };
    }
    function calc() {
      var v = read(); if (!v) return;
      var n = v.n, k = v.k, lines = [];
      lines.push('n! = ' + n + '! = ' + fmt(fact(n)));
      if (k > n) {
        lines.push('k > n nên A(n, k) = C(n, k) = 0 (không đủ người để chọn).');
      } else {
        var a = arr(n, k), c = comb(n, k);
        lines.push('A(' + n + ', ' + k + ') = ' + fmt(a) + '   (có thứ tự)');
        lines.push('C(' + n + ', ' + k + ') = ' + fmt(c) + '   (không thứ tự)');
        lines.push('Kiểm tra: A / C = ' + fmt(c === 0n ? 0n : a / c) + ' = ' + k + '! = ' + fmt(fact(k)));
      }
      lines.push(n + '^' + k + ' = ' + fmt(BigInt(n) ** BigInt(k)) + '   (có thứ tự, được lặp)');
      out.textContent = lines.join('\n');
    }
    function list() {
      var v = read(); if (!v) return;
      var n = v.n, k = v.k;
      if (n > 8) { out.textContent = 'Chỉ liệt kê khi n ≤ 8 (với n lớn, danh sách quá dài).'; return; }
      if (k > n) { out.textContent = 'k > n: không có cách nào.'; return; }
      var A = listing(n, k, true), C = listing(n, k, false);
      var total = arr(n, k);
      var s = 'Chỉnh hợp chập ' + k + ' của ' + LETTERS.slice(0, n).split('').join(', ') + ': ' + fmt(total) + ' cách';
      s += (total > BigInt(A.length) ? ' (hiện ' + A.length + ' cách đầu)' : '') + '\n' + (k === 0 ? '(dãy rỗng)' : A.join(' ')) + '\n\n';
      s += 'Tổ hợp chập ' + k + ': ' + fmt(comb(n, k)) + ' cách' + '\n' + (k === 0 ? '(nhóm rỗng)' : C.map(function (x) { return '{' + x.split('').join(',') + '}'; }).join(' '));
      s += '\n\nMỗi nhóm trong tổ hợp xuất hiện ' + fmt(fact(k)) + ' lần trong danh sách chỉnh hợp (đổi thứ tự).';
      out.textContent = s;
    }
    bCalc.addEventListener('click', calc);
    bList.addEventListener('click', list);
    calc();
  }

  function partTwo(body) {
    var box = mk('div');
    box.appendChild(mk('p', null, 'Phần 2. Nguyên lý bù trừ'));
    var ctr = mk('div', { 'class': 'controls' });
    var ln = mk('label', null, 'N '); var inN = mk('input', { type: 'text', value: '100', size: '20', 'aria-label': 'N' }); ln.appendChild(inN);
    var la = mk('label', null, 'các số a '); var inA = mk('input', { type: 'text', value: '2 3 5', 'aria-label': 'các số a' }); la.appendChild(inA);
    var bRun = mk('button', { type: 'button' }, 'Đếm');
    [ln, la, bRun].forEach(function (x) { ctr.appendChild(x); });
    var out = mk('div', { 'class': 'out', 'aria-live': 'polite' });
    box.appendChild(ctr); box.appendChild(out);
    body.appendChild(box);

    function run() {
      var sN = String(inN.value).trim();
      if (!/^\d{1,19}$/.test(sN) || BigInt(sN) < 1n || BigInt(sN) > 1000000000000000000n) { out.textContent = 'N phải là số nguyên dương, tối đa 10^18.'; return; }
      var N = BigInt(sN);
      var parts = String(inA.value).trim().split(/[\s,;]+/).filter(Boolean);
      if (!parts.length || parts.length > 12 || parts.some(function (p) { return !/^\d{1,18}$/.test(p) || BigInt(p) < 1n; })) {
        out.textContent = 'Nhập từ 1 đến 12 số nguyên dương a, cách nhau bởi dấu cách.'; return;
      }
      var a = parts.map(function (p) { return BigInt(p); });
      var k = a.length, total = 0n, lines = [], shown = 0;
      for (var mask = 1; mask < (1 << k); mask++) {
        var l = 1n, picked = [], bits = 0;
        for (var i = 0; i < k; i++) {
          if (mask >> i & 1) {
            picked.push(a[i].toString()); bits++;
            if (l <= N) l = l / gcd(l, a[i]) * a[i]; // BigInt không tràn; vượt N thì giữ nguyên
          }
        }
        var q = l > N ? 0n : N / l;
        var sign = bits % 2 === 1 ? 1n : -1n;
        total += sign * q;
        if (shown < 40) {
          lines.push((sign > 0n ? '+ ' : '− ') + '⌊N / BCNN(' + picked.join(', ') + ')⌋ = ' + (l > N ? '0 (BCNN > N)' : fmt(q)));
          shown++;
        }
      }
      if ((1 << k) - 1 > shown) lines.push('… (' + ((1 << k) - 1) + ' số hạng, chỉ hiện ' + shown + ')');
      lines.push('');
      lines.push('Số x ≤ N chia hết cho ít nhất một a_i: ' + fmt(total));
      lines.push('Phần bù (không chia hết cho số nào): ' + fmt(N - total));
      if (N <= 1000000n) {
        var n = Number(N), an = a.map(Number), cnt = 0;
        for (var x = 1; x <= n; x++) {
          for (var j = 0; j < an.length; j++) { if (x % an[j] === 0) { cnt++; break; } }
        }
        lines.push('Đếm trâu để đối chiếu: ' + fmt(BigInt(cnt)) + (BigInt(cnt) === total ? '  (khớp)' : '  (KHÔNG khớp!)'));
      }
      out.textContent = lines.join('\n');
    }
    bRun.addEventListener('click', run);
    inA.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
    run();
  }

  CP.mount('#viz-counting', function (root) {
    var body = root.querySelector('.playground-body') || root;
    partOne(body);
    partTwo(body);
  });
})();
