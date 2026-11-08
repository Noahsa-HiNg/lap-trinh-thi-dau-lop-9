/* Widget "Mảng hiệu": nhập mảng, thêm thao tác (l, r, x) -> sửa D[l], D[r+1], cộng dồn ra mảng cuối. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 12;
  var MAX_ABS = 1e9;
  var MAX_OPS = 30;

  function cell(text, idx, cls, ptr) {
    var s = document.createElement('span');
    s.className = 'cell' + (cls ? ' ' + cls : '');
    s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    s.textContent = text;
    return s;
  }

  function row(label) {
    var d = document.createElement('div');
    d.className = 'arr';
    var lb = document.createElement('span');
    lb.className = 'arr-label';
    lb.textContent = label;
    d.appendChild(lb);
    return d;
  }

  function parseArray(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Mảng đang trống. Hãy nhập vài số nguyên, cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Mảng dài quá: tối đa ' + MAX_N + ' số để hình vẽ vừa màn hình.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^[+-]?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên.' };
      var v = parseInt(parts[i], 10);
      if (Math.abs(v) > MAX_ABS) return { err: 'Mỗi số cần có trị tuyệt đối không quá 10^9.' };
      a.push(v);
    }
    return { a: a };
  }

  function parseIntStrict(str) {
    var t = String(str == null ? '' : str).trim();
    if (!/^[+-]?\d+$/.test(t)) return null;
    var v = parseInt(t, 10);
    return isFinite(v) ? v : null;
  }

  function fmt(v) { return v < 0 ? '(' + v + ')' : String(v); }

  window.CP.mount('#viz-difference-array', function (root) {
    var inp = root.querySelector('#da-init');
    var inL = root.querySelector('#da-l');
    var inR = root.querySelector('#da-r');
    var inX = root.querySelector('#da-x');
    var view = root.querySelector('.da-view');
    var out = root.querySelector('.out');
    var btnReset = root.querySelector('[data-act="reset"]');
    var btnAdd = root.querySelector('[data-act="add"]');
    var btnRand = root.querySelector('[data-act="rand"]');
    if (!inp || !inL || !inR || !inX || !view || !out || !btnAdd) return;

    // Trạng thái: mảng ban đầu a0 (chỉ số 1..n), mảng hiệu D (0..n+1), danh sách thao tác
    var st = null;
    var token = 0;

    function prefix(D, n) {
      var a = [0], s = 0;
      for (var i = 1; i <= n; i++) { s += D[i]; a.push(s); }
      return a;
    }

    function draw(last, upto) {
      view.textContent = '';
      if (!st) return;
      var n = st.n;
      var a = prefix(st.D, n);
      if (typeof upto !== 'number') upto = n;

      // Nhãn cùng độ rộng (font mono) và ô trống cuối để ba hàng thẳng cột với D[0..n+1]
      var r0 = row('gốc');
      r0.appendChild(cell('·', 0, 'is-dim'));
      for (var i = 1; i <= n; i++) r0.appendChild(cell(String(st.a0[i]), i, 'is-dim'));
      r0.appendChild(cell('', '', 'is-dim'));

      var rd = row('\u00a0\u00a0D');
      for (var j = 0; j <= n + 1; j++) {
        var cls = '', ptr = '';
        if (j === 0) cls = 'is-dim';
        if (last) {
          if (j === last.l) { cls = 'is-ok'; }
          else if (j === last.r + 1) { cls = 'is-bad'; }
        }
        if (j === n + 1 && !cls) cls = 'is-dim';
        if (upto < n && j >= 1 && j <= n && j === upto) cls = cls || 'is-cmp';
        rd.appendChild(cell(j === 0 ? '·' : String(st.D[j]), j, cls, ptr));
      }

      var ra = row('\u00a0\u00a0a');
      ra.appendChild(cell('·', 0, 'is-dim'));
      for (var k = 1; k <= n; k++) {
        var c2 = '';
        var txt = k <= upto ? String(a[k]) : '?';
        if (k > upto) c2 = 'is-dim';
        else if (upto < n && k === upto) c2 = 'is-active';
        else if (last && k >= last.l && k <= last.r) c2 = 'is-active';
        ra.appendChild(cell(txt, k, c2));
      }
      ra.appendChild(cell('', '', 'is-dim'));
      view.appendChild(r0);
      view.appendChild(rd);
      view.appendChild(ra);
    }

    function summary() {
      var n = st.n;
      var a = prefix(st.D, n);
      var lines = [];
      if (st.ops.length === 0) {
        lines.push('Chưa có thao tác. D[i] = a[i] − a[i−1], cộng dồn D trả lại đúng mảng ban đầu.');
      } else {
        lines.push('Đã làm ' + st.ops.length + ' thao tác: ' + st.ops.map(function (o) {
          return '(' + o.l + ', ' + o.r + ', ' + o.x + ')';
        }).join(' '));
      }
      lines.push('D[1..' + (n + 1) + '] = (' + st.D.slice(1, n + 2).join(', ') + ')');
      lines.push('Mảng cuối a = (' + a.slice(1).join(', ') + ')');
      return lines;
    }

    function reset(quiet) {
      ++token;
      var p = parseArray(inp.value);
      if (p.err) { st = null; view.textContent = ''; out.textContent = p.err; return false; }
      var n = p.a.length;
      var a0 = [0].concat(p.a);
      var D = [];
      for (var i = 0; i <= n + 1; i++) D.push(0);
      for (var j = 1; j <= n; j++) D[j] = a0[j] - a0[j - 1];
      st = { src: inp.value, n: n, a0: a0, D: D, ops: [] };
      inL.max = String(n); inR.max = String(n);
      draw(null);
      if (!quiet) out.textContent = summary().join('\n');
      return true;
    }

    function apply(l, r, x) {
      var my = ++token;
      var n = st.n;
      st.D[l] += x;
      st.D[r + 1] -= x;
      st.ops.push({ l: l, r: r, x: x });
      var last = { l: l, r: r, x: x };
      var head = 'Thao tác (' + l + ', ' + r + ', ' + x + '): D[' + l + '] += ' + x +
        ', D[' + (r + 1) + '] −= ' + x + (r === n ? '  (r = n nên dùng ô phụ D[n+1])' : '') +
        '. Chỉ sửa 2 ô thay vì ' + (r - l + 1) + ' ô.';
      var fin = function () {
        if (my !== token) return;
        draw(last);
        out.textContent = [head].concat(summary()).join('\n');
      };
      if (window.CP.reduceMotion || typeof window.CP.sleep !== 'function') { fin(); return; }
      // Hoạt hình: cộng dồn D từng ô để thấy mảng a hiện ra
      var k = 0;
      draw(last, 0);
      out.textContent = head + '\nĐang cộng dồn D để khôi phục a...';
      (function step() {
        if (my !== token) return;
        if (k >= n) { fin(); return; }
        k++;
        draw(last, k);
        var a = prefix(st.D, n);
        out.textContent = head + '\nCộng dồn: a[' + k + '] = a[' + (k - 1) + '] + D[' + k + '] = ' +
          a[k - 1] + ' + ' + fmt(st.D[k]) + ' = ' + a[k];
        window.CP.sleep(320).then(step);
      })();
    }

    function add() {
      if (!st || inp.value !== st.src) {
        if (!reset(true)) return;
      }
      var n = st.n;
      var l = parseIntStrict(inL.value), r = parseIntStrict(inR.value), x = parseIntStrict(inX.value);
      if (l === null || r === null || x === null) { out.textContent = 'Hãy nhập l, r, x là số nguyên.'; return; }
      if (l < 1 || r > n || l > r) {
        out.textContent = 'Cần 1 ≤ l ≤ r ≤ ' + n + ' (mảng có ' + n + ' phần tử).';
        return;
      }
      if (Math.abs(x) > MAX_ABS) { out.textContent = 'Hãy chọn |x| không quá 10^9.'; return; }
      if (st.ops.length >= MAX_OPS) {
        out.textContent = 'Đã đủ ' + MAX_OPS + ' thao tác. Bấm "Đặt lại" để bắt đầu lại.';
        return;
      }
      apply(l, r, x);
    }

    function randomOp() {
      if (!st || inp.value !== st.src) {
        if (!reset(true)) return;
      }
      var n = st.n;
      var l = 1 + Math.floor(Math.random() * n);
      var r = l + Math.floor(Math.random() * (n - l + 1));
      var x = Math.floor(Math.random() * 11) - 5;
      if (x === 0) x = 2;
      inL.value = l; inR.value = r; inX.value = x;
      add();
    }

    if (btnReset) btnReset.addEventListener('click', function () { reset(false); });
    btnAdd.addEventListener('click', add);
    if (btnRand) btnRand.addEventListener('click', randomOp);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); reset(false); }
    });
    [inL, inR, inX].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    });

    // Vẽ sẵn trạng thái ban đầu (chưa có thao tác)
    reset(false);
  });
})();
