/* Widget "Tìm kiếm nhị phân": nhập mảng + x, chạy lower_bound / upper_bound từng bước
   theo mẫu an toàn có biến ans; tô vùng đã loại, mid, ans và ghi bảng vết. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 20;
  var MAX_ABS = 1e9;

  function parseArray(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Mảng đang trống. Hãy nhập vài số nguyên, cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Mảng dài quá: tối đa ' + MAX_N + ' số để hình vẽ vừa màn hình.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^[+-]?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên.' };
      var v = parseInt(parts[i], 10);
      if (!isFinite(v) || Math.abs(v) > MAX_ABS) return { err: 'Mỗi số cần có trị tuyệt đối không quá 10^9.' };
      a.push(v);
    }
    return { a: a };
  }

  function cell(text, idx, cls, ptr) {
    var s = document.createElement('span');
    s.className = 'cell' + (cls ? ' ' + cls : '');
    s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    s.textContent = text;
    return s;
  }

  window.CP.mount('#viz-binary-search', function (root) {
    var inp = root.querySelector('#bs-input');
    var inX = root.querySelector('#bs-x');
    var sel = root.querySelector('#bs-mode');
    var view = root.querySelector('.bs-view');
    var out = root.querySelector('.out');
    var logBox = root.querySelector('.bs-log');
    var btnStart = root.querySelector('[data-act="start"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnRun = root.querySelector('[data-act="run"]');
    var btnRand = root.querySelector('[data-act="rand"]');
    if (!inp || !inX || !sel || !view || !out || !logBox || !btnStart || !btnStep) return;

    var st = null;   // trạng thái phiên chạy hiện tại
    var token = 0;   // huỷ hoạt hình cũ khi bấm lại

    function cond(v) { return st.mode === 'upper' ? v > st.x : v >= st.x; }
    function condText() { return st.mode === 'upper' ? 'a[mid] > ' + st.x : 'a[mid] ≥ ' + st.x; }

    function draw() {
      view.textContent = '';
      if (!st) return;
      var row = document.createElement('div');
      row.className = 'arr';
      var lab = document.createElement('span');
      lab.className = 'arr-label';
      lab.textContent = 'a';
      row.appendChild(lab);
      for (var i = 0; i < st.a.length; i++) {
        var cls = [];
        var ptr = [];
        var inside = i >= st.lo && i <= st.hi;
        if (!inside) cls.push('is-dim');
        if (i === st.lastMid) cls = ['is-active'];
        if (i === st.ans) cls = ['is-ok'];
        if (!st.done) {
          if (i === st.lo) ptr.push('lo');
          if (i === st.hi) ptr.push('hi');
        }
        if (i === st.lastMid && !st.done) ptr.push('mid');
        if (i === st.ans) ptr.push('ans');
        row.appendChild(cell(String(st.a[i]), i, cls.join(' '), ptr.join('/')));
      }
      view.appendChild(row);
    }

    function drawLog() {
      logBox.textContent = '';
      if (!st || st.rows.length === 0) return;
      var t = document.createElement('table');
      t.className = 'trace';
      var head = document.createElement('thead');
      var hr = document.createElement('tr');
      ['Bước', 'lo', 'hi', 'mid', 'a[mid]', condText().replace('a[mid]', 'thỏa'), 'ans'].forEach(function (h) {
        var th = document.createElement('th');
        th.textContent = h;
        hr.appendChild(th);
      });
      head.appendChild(hr);
      t.appendChild(head);
      var body = document.createElement('tbody');
      st.rows.forEach(function (r, k) {
        var tr = document.createElement('tr');
        if (k === st.rows.length - 1) tr.className = 'hl';
        r.forEach(function (v) {
          var td = document.createElement('td');
          td.textContent = String(v);
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      t.appendChild(body);
      logBox.appendChild(t);
    }

    function finishText() {
      var name = st.mode === 'upper' ? 'upper_bound(' + st.x + ')' : 'lower_bound(' + st.x + ')';
      var n = st.a.length;
      if (st.ans === n) {
        return 'Xong sau ' + st.rows.length + ' bước: lo = ' + st.lo + ' > hi = ' + st.hi + '. ' + name + ' = ' + n +
          ' = n, nghĩa là không có phần tử nào ' + (st.mode === 'upper' ? '> ' : '≥ ') + st.x + '.';
      }
      return 'Xong sau ' + st.rows.length + ' bước: lo = ' + st.lo + ' > hi = ' + st.hi + '. ' + name + ' = ' + st.ans +
        ' (a[' + st.ans + '] = ' + st.a[st.ans] + '). Có ' + st.ans + ' phần tử ' +
        (st.mode === 'upper' ? '≤ ' : '< ') + st.x + ' đứng trước nó.';
    }

    function start() {
      token++;
      var p = parseArray(inp.value);
      if (p.err) { st = null; draw(); drawLog(); out.textContent = p.err; return false; }
      var x = Number(inX.value);
      if (inX.value === '' || !isFinite(x) || Math.floor(x) !== x || Math.abs(x) > MAX_ABS) {
        st = null; draw(); drawLog();
        out.textContent = 'Hãy nhập x là số nguyên có trị tuyệt đối không quá 10^9.';
        return false;
      }
      var a = p.a.slice().sort(function (u, v) { return u - v; });
      var changed = a.some(function (v, i) { return v !== p.a[i]; });
      if (changed) inp.value = a.join(' ');
      st = {
        a: a, x: x, mode: sel.value === 'upper' ? 'upper' : 'lower',
        lo: 0, hi: a.length - 1, ans: a.length, lastMid: -1, done: false, rows: []
      };
      draw();
      drawLog();
      out.textContent = (changed ? 'Mảng chưa sắp xếp nên máy đã sắp lại. ' : '') +
        'Khởi tạo: lo = 0, hi = ' + st.hi + ', ans = ' + st.ans + ' (chưa thấy). Bấm Bước tiếp.';
      return true;
    }

    function step() {
      if (!st) { if (!start()) return; }
      if (st.done) { out.textContent = finishText(); return; }
      var lo = st.lo, hi = st.hi;
      var mid = lo + Math.floor((hi - lo) / 2);
      var ok = cond(st.a[mid]);
      var msg = 'mid = ' + lo + ' + (' + hi + ' − ' + lo + ')/2 = ' + mid + '. a[' + mid + '] = ' + st.a[mid] + ': ' +
        condText().replace('a[mid]', String(st.a[mid])) + ' là ' + (ok ? 'đúng' : 'sai') + '. ';
      if (ok) {
        st.ans = mid; st.hi = mid - 1;
        msg += 'Ghi ans = ' + mid + ', tìm tiếp bên trái: hi = ' + st.hi + '.';
      } else {
        st.lo = mid + 1;
        msg += 'Bỏ nửa trái cùng mid: lo = ' + st.lo + '.';
      }
      st.lastMid = mid;
      st.rows.push([st.rows.length + 1, lo, hi, mid, st.a[mid], ok ? 'đúng' : 'sai', st.ans]);
      if (st.lo > st.hi) st.done = true;
      draw();
      drawLog();
      out.textContent = st.done ? msg + ' ' + finishText() : msg;
    }

    function runAll() {
      if (!st || st.done) { if (!start()) return; }
      var my = ++token;
      if (window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        while (st && !st.done) step();
        return;
      }
      (function loop() {
        if (my !== token || !st) return;
        step();
        if (!st.done) window.CP.sleep(700).then(loop);
      })();
    }

    function randomize() {
      token++;
      var n = 10 + Math.floor(Math.random() * 7);
      var a = [], v = Math.floor(Math.random() * 5);
      for (var i = 0; i < n; i++) {
        v += Math.floor(Math.random() * 4);   // có thể lặp giá trị
        a.push(v);
      }
      inp.value = a.join(' ');
      inX.value = String(a[Math.floor(Math.random() * n)] + (Math.random() < 0.3 ? 1 : 0));
      start();
    }

    btnStart.addEventListener('click', function () { start(); });
    btnStep.addEventListener('click', function () { token++; step(); });
    if (btnRun) btnRun.addEventListener('click', runAll);
    if (btnRand) btnRand.addEventListener('click', randomize);
    sel.addEventListener('change', function () { start(); });
    start();
  });
})();
