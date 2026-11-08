/* Widget "Hai con trỏ & cửa sổ trượt": nhập dãy và x, bấm Bước tiếp để xem i, j (hoặc l, r) di chuyển.
   Ba chế độ: tìm cặp a[i] + a[j] = x (tự sắp xếp), đoạn dài nhất tổng ≤ x, đoạn ngắn nhất tổng ≥ x. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 14;
  var MAX_ABS = 1e9;
  var DEFAULTS = {
    pair: { a: '2 3 5 7 9 12', x: '16' },
    long: { a: '3 1 2 1 1 4 2', x: '5' },
    short: { a: '2 3 1 2 4 3', x: '7' }
  };

  function parseArray(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Dãy đang trống. Hãy nhập vài số nguyên, cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Dãy dài quá: tối đa ' + MAX_N + ' số để hình vẽ vừa màn hình.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^[+-]?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên.' };
      var v = parseInt(parts[i], 10);
      if (Math.abs(v) > MAX_ABS) return { err: 'Mỗi số cần có trị tuyệt đối không quá 10^9.' };
      a.push(v);
    }
    return { a: a };
  }

  function parseX(str) {
    var s = String(str || '').trim();
    if (!/^[+-]?\d+$/.test(s)) return null;
    var v = parseInt(s, 10);
    if (Math.abs(v) > 2 * MAX_ABS) return null;
    return v;
  }

  /* Một khung hình: mảng các ô {cls, ptr} và lời giải thích */
  function frame(n, msg) {
    var cells = [];
    for (var t = 0; t < n; t++) cells.push({ cls: '', ptr: '' });
    return { cells: cells, msg: msg };
  }

  function addPtr(c, name) { c.ptr = c.ptr ? c.ptr + '=' + name : name; }

  /* ---------- Chế độ 1: hai con trỏ ngược chiều ---------- */
  function buildPair(a, x) {
    var n = a.length, frames = [];
    if (n < 2) return [frame(n, 'Cần ít nhất 2 phần tử để tạo thành một cặp.')];
    function snap(i, j, kind, msg) {
      var f = frame(n, msg);
      for (var t = 0; t < n; t++) {
        if (t < i || t > j) f.cells[t].cls = 'is-dim';
      }
      if (i < n && i <= j) { f.cells[i].cls = kind; addPtr(f.cells[i], 'i'); }
      if (j >= 0 && j >= i) { f.cells[j].cls = kind; addPtr(f.cells[j], 'j'); }
      return f;
    }
    var i = 0, j = n - 1, step = 0;
    frames.push(snap(i, j, 'is-active', 'Đã sắp xếp tăng dần: ' + a.join(', ') +
      '.\nĐặt i = 0 (số nhỏ nhất), j = ' + (n - 1) + ' (số lớn nhất). Cần a[i] + a[j] = ' + x + '.'));
    while (i < j) {
      step++;
      var s = a[i] + a[j];
      var head = 'Bước ' + step + ': i = ' + i + ', j = ' + j + ', a[i] + a[j] = ' + a[i] + ' + ' + a[j] + ' = ' + s;
      if (s === x) {
        frames.push(snap(i, j, 'is-ok', head + ' = x.\nTìm thấy cặp (' + i + ', ' + j + '), đánh số từ 1 là (' +
          (i + 1) + ', ' + (j + 1) + '). Tổng cộng ' + step + ' lần so sánh, trong khi thử mọi cặp cần ' +
          (n * (n - 1) / 2) + ' lần.'));
        return frames;
      }
      if (s < x) {
        frames.push(snap(i, j, 'is-cmp', head + ' < ' + x + '.\na[' + i + '] cộng với số lớn nhất còn lại vẫn thiếu, nên bỏ a[' + i + ']: tăng i.'));
        i++;
      } else {
        frames.push(snap(i, j, 'is-bad', head + ' > ' + x + '.\na[' + j + '] cộng với số nhỏ nhất còn lại vẫn thừa, nên bỏ a[' + j + ']: giảm j.'));
        j--;
      }
    }
    frames.push(snap(i, j, 'is-dim', 'i = j = ' + i + ': vùng còn lại chỉ có một phần tử.\nKhông có cặp nào có tổng ' + x +
      ' (đã dùng ' + step + ' lần so sánh).'));
    return frames;
  }

  /* ---------- Chế độ 2, 3: cửa sổ trượt ---------- */
  function winSnap(n, l, r, kind, msg) {
    var f = frame(n, msg);
    for (var t = 0; t < n; t++) {
      if (t < l) f.cells[t].cls = 'is-dim';
      else if (t <= r) f.cells[t].cls = kind;
    }
    if (l <= r && l < n) addPtr(f.cells[l], 'l');
    if (r >= 0 && r < n) addPtr(f.cells[r], 'r');
    return f;
  }

  function finalSnap(n, bl, br, msg) {
    var f = frame(n, msg);
    for (var t = 0; t < n; t++) f.cells[t].cls = (bl >= 0 && t >= bl && t <= br) ? 'is-ok' : 'is-dim';
    return f;
  }

  function buildLong(a, k) {
    var n = a.length, frames = [], l = 0, tong = 0, best = 0, bl = -1, br = -1, moves = 0;
    frames.push(winSnap(n, 0, -1, 'is-active', 'Cửa sổ đang rỗng: l = 0, tổng = 0. Cần đoạn dài nhất có tổng ≤ ' + k + '.'));
    for (var r = 0; r < n; r++) {
      tong += a[r]; moves++;
      if (tong > k) {
        frames.push(winSnap(n, l, r, 'is-bad', 'r = ' + r + ': thêm a[' + r + '] = ' + a[r] + ', tổng = ' + tong + ' > ' + k + '.\nCửa sổ hỏng, phải co mép trái.'));
        var removed = [];
        while (l <= r && tong > k) { tong -= a[l]; removed.push(a[l]); l++; moves++; }
        var len = r - l + 1;
        if (len > best) { best = len; bl = l; br = r; }
        frames.push(winSnap(n, l, r, 'is-active', 'Co lại: bỏ ' + removed.join(', ') + ' → tổng = ' + tong + ', l = ' + l +
          '.\nĐộ dài cửa sổ = ' + len + ', best = ' + best + '.'));
      } else {
        var len2 = r - l + 1;
        if (len2 > best) { best = len2; bl = l; br = r; }
        frames.push(winSnap(n, l, r, 'is-active', 'r = ' + r + ': thêm a[' + r + '] = ' + a[r] + ', tổng = ' + tong + ' ≤ ' + k +
          '.\nCửa sổ [' + l + ', ' + r + '] dài ' + len2 + ', best = ' + best + '.'));
      }
    }
    frames.push(finalSnap(n, bl, br, best > 0
      ? 'Kết thúc. Đoạn dài nhất là [' + bl + ', ' + br + '], độ dài ' + best + '.\nl và r dịch tổng cộng ' + moves + ' lần (không quá 2n = ' + (2 * n) + ').'
      : 'Kết thúc. Không có đoạn khác rỗng nào có tổng ≤ ' + k + ' (đáp án 0).'));
    return frames;
  }

  function buildShort(a, s) {
    var n = a.length, frames = [], l = 0, tong = 0, best = Infinity, bl = -1, br = -1, moves = 0;
    frames.push(winSnap(n, 0, -1, 'is-active', 'Cửa sổ đang rỗng: l = 0, tổng = 0. Cần đoạn ngắn nhất có tổng ≥ ' + s + '.'));
    for (var r = 0; r < n; r++) {
      tong += a[r]; moves++;
      if (tong < s) {
        frames.push(winSnap(n, l, r, 'is-active', 'r = ' + r + ': thêm a[' + r + '] = ' + a[r] + ', tổng = ' + tong + ' < ' + s + '.\nChưa đạt, tiếp tục mở rộng.'));
        continue;
      }
      while (l <= r && tong >= s) {
        var len = r - l + 1;
        if (len < best) { best = len; bl = l; br = r; }
        frames.push(winSnap(n, l, r, 'is-ok', 'r = ' + r + ': cửa sổ [' + l + ', ' + r + '] có tổng = ' + tong + ' ≥ ' + s +
          ', dài ' + len + ', best = ' + best + '.\nCòn đạt thì thử bỏ a[' + l + '] = ' + a[l] + ' để ngắn hơn.'));
        tong -= a[l]; l++; moves++;
      }
      frames.push(winSnap(n, l, r, 'is-active', 'Sau khi co: l = ' + l + ', tổng = ' + tong + ' < ' + s + '. Mở rộng tiếp.'));
    }
    frames.push(finalSnap(n, bl, br, best !== Infinity
      ? 'Kết thúc. Đoạn ngắn nhất là [' + bl + ', ' + br + '], độ dài ' + best + '.\nl và r dịch tổng cộng ' + moves + ' lần (không quá 2n = ' + (2 * n) + ').'
      : 'Kết thúc. Không có đoạn nào có tổng ≥ ' + s + ' (đáp án 0).'));
    return frames;
  }

  window.CP.mount('#viz-two-pointers', function (root) {
    var selMode = root.querySelector('#tp-mode');
    var inp = root.querySelector('#tp-input');
    var inX = root.querySelector('#tp-x');
    var view = root.querySelector('.tp-view');
    var out = root.querySelector('.out');
    var btnReset = root.querySelector('[data-act="reset"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnPlay = root.querySelector('[data-act="play"]');
    var btnRand = root.querySelector('[data-act="rand"]');
    if (!selMode || !inp || !inX || !view || !out || !btnReset || !btnStep) return;

    var frames = [], arr = [], idx = 0, token = 0;

    function render() {
      view.textContent = '';
      if (!frames.length) return;
      var f = frames[idx];
      var row = document.createElement('div');
      row.className = 'arr';
      var lb = document.createElement('span');
      lb.className = 'arr-label';
      lb.textContent = 'a';
      row.appendChild(lb);
      for (var t = 0; t < arr.length; t++) {
        var c = document.createElement('span');
        c.className = 'cell' + (f.cells[t].cls ? ' ' + f.cells[t].cls : '');
        c.setAttribute('data-i', String(t));
        if (f.cells[t].ptr) c.setAttribute('data-ptr', f.cells[t].ptr);
        c.textContent = String(arr[t]);
        row.appendChild(c);
      }
      view.appendChild(row);
      out.textContent = '[' + (idx + 1) + '/' + frames.length + '] ' + f.msg;
      btnStep.disabled = idx >= frames.length - 1;
    }

    function build() {
      token++;
      frames = []; idx = 0;
      var p = parseArray(inp.value);
      if (p.err) { view.textContent = ''; out.textContent = p.err; return false; }
      var x = parseX(inX.value);
      if (x === null) { view.textContent = ''; out.textContent = 'x phải là số nguyên, trị tuyệt đối không quá 2·10^9.'; return false; }
      var mode = selMode.value;
      if (mode === 'pair') {
        arr = p.a.slice().sort(function (u, v) { return u - v; });
        frames = buildPair(arr, x);
      } else {
        for (var i = 0; i < p.a.length; i++) {
          if (p.a[i] < 0) {
            view.textContent = '';
            out.textContent = 'Cửa sổ trượt theo tổng chỉ đúng khi mọi số không âm. Số ' + p.a[i] +
              ' làm hỏng tính đơn điệu: thêm phần tử có thể làm tổng giảm. Với số âm, hãy dùng cộng dồn kết hợp map.';
            return false;
          }
        }
        arr = p.a.slice();
        frames = mode === 'long' ? buildLong(arr, x) : buildShort(arr, x);
      }
      render();
      return true;
    }

    function step() {
      if (!frames.length && !build()) return;
      if (idx < frames.length - 1) { idx++; render(); }
    }

    function play() {
      if (!frames.length || idx >= frames.length - 1) { if (!build()) return; }
      var my = ++token;
      if (window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        idx = frames.length - 1; render(); return;
      }
      (function tick() {
        if (my !== token) return;
        if (idx >= frames.length - 1) return;
        idx++; render();
        window.CP.sleep(800).then(tick);
      })();
    }

    function randomize() {
      var mode = selMode.value;
      var n = 6 + Math.floor(Math.random() * 5), a = [], i;
      if (mode === 'pair') {
        for (i = 0; i < n; i++) a.push(1 + Math.floor(Math.random() * 20));
        a.sort(function (u, v) { return u - v; });
        var p = Math.floor(Math.random() * n), q = Math.floor(Math.random() * n);
        if (p === q) q = (p + 1) % n;
        inX.value = String(Math.random() < 0.8 ? a[p] + a[q] : a[p] + a[q] + 1);
      } else {
        var sum = 0;
        for (i = 0; i < n; i++) { a.push(Math.floor(Math.random() * 7)); sum += a[i]; }
        inX.value = String(Math.max(1, Math.round(sum * (mode === 'long' ? 0.35 : 0.4))));
      }
      inp.value = a.join(' ');
      build();
    }

    selMode.addEventListener('change', function () {
      var d = DEFAULTS[selMode.value] || DEFAULTS.pair;
      inp.value = d.a; inX.value = d.x;
      build();
    });
    btnReset.addEventListener('click', build);
    btnStep.addEventListener('click', function () { token++; step(); });
    if (btnPlay) btnPlay.addEventListener('click', play);
    if (btnRand) btnRand.addEventListener('click', function () { token++; randomize(); });
    [inp, inX].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); build(); } });
    });

    build();
  });
})();
