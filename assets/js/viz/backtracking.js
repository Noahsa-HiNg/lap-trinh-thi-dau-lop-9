/* Widget: N quân hậu (4–8) bằng quay lui, chạy từng bước một ô.
   Gắn vào #viz-backtracking trong topics/backtracking.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP) return;

  var CP = window.CP;
  var MIN_N = 4, MAX_N = 8, DEF_N = 5;

  /* Máy trạng thái quay lui không đệ quy: mỗi lần step() làm đúng một việc
     (thử một ô, hoặc nhấc một quân), giống hệt thứ tự của hàm Try(i) đệ quy. */
  function Solver(n) {
    this.n = n;
    this.col = [];          // col[r] = cột của quân ở hàng r (-1 nếu chưa đặt)
    this.useC = [];         // cột đã có quân
    this.useD1 = [];        // đường chéo r + c
    this.useD2 = [];        // đường chéo r - c + n - 1
    for (var i = 0; i < n; i++) { this.col.push(-1); this.useC.push(false); }
    for (var d = 0; d < 2 * n - 1; d++) { this.useD1.push(false); this.useD2.push(false); }
    this.r = 0; this.c = 0;
    this.tries = 0; this.places = 0; this.lifts = 0; this.sols = 0;
    this.done = false;
    this.ev = null;         // sự kiện của bước vừa làm
    this.lastSol = null;
  }

  Solver.prototype.attackers = function (r, c) {
    var n = this.n, why = [];
    for (var i = 0; i < r; i++) {
      var q = this.col[i];
      if (q < 0) continue;
      if (q === c) why.push('cùng cột với quân ở hàng ' + (i + 1));
      else if (i + q === r + c) why.push('cùng đường chéo i + j với quân ở hàng ' + (i + 1));
      else if (i - q === r - c) why.push('cùng đường chéo i − j với quân ở hàng ' + (i + 1));
    }
    return why;
  };

  Solver.prototype.step = function () {
    var n = this.n;
    if (this.done) { this.ev = { type: 'done' }; return this.ev; }
    if (this.r === n || this.c === n) {
      // Hết lựa chọn ở hàng r (hoặc vừa có nghiệm): quay về hàng trên
      if (this.r === 0) { this.done = true; this.ev = { type: 'done' }; return this.ev; }
      var fromRow = this.r;
      this.r--;
      var q = this.col[this.r];
      this.col[this.r] = -1;
      this.useC[q] = false; this.useD1[this.r + q] = false; this.useD2[this.r - q + n - 1] = false;
      this.c = q + 1;
      this.lifts++;
      this.ev = { type: 'lift', r: this.r, c: q, afterSol: fromRow === n };
      return this.ev;
    }
    var r = this.r, c = this.c;
    this.tries++;
    if (!this.useC[c] && !this.useD1[r + c] && !this.useD2[r - c + n - 1]) {
      this.col[r] = c;
      this.useC[c] = true; this.useD1[r + c] = true; this.useD2[r - c + n - 1] = true;
      this.places++;
      this.r = r + 1; this.c = 0;
      if (this.r === n) {
        this.sols++;
        this.lastSol = this.col.slice();
        this.ev = { type: 'sol', r: r, c: c };
      } else {
        this.ev = { type: 'place', r: r, c: c };
      }
    } else {
      this.ev = { type: 'bad', r: r, c: c, why: this.attackers(r, c) };
      this.c = c + 1;
    }
    return this.ev;
  };

  CP.mount('#viz-backtracking', function (root) {
    var inN = root.querySelector('#bt-n');
    var board = root.querySelector('.bt-board');
    var stats = root.querySelector('.bt-stats');
    var out = root.querySelector('.out');
    var btnAuto = root.querySelector('button[data-act="auto"]');
    if (!board || !out) return;

    var S = null, timer = null, note = '';

    function readN() {
      var raw = inN ? String(inN.value).trim() : '';
      var v = raw === '' ? NaN : Number(raw);
      if (!isFinite(v) || Math.floor(v) !== v) {
        note = 'Giá trị n không hợp lệ, dùng n = ' + DEF_N + '. ';
        v = DEF_N;
      } else if (v < MIN_N || v > MAX_N) {
        var w = Math.max(MIN_N, Math.min(MAX_N, v));
        note = 'n chỉ nhận từ ' + MIN_N + ' đến ' + MAX_N + ', dùng n = ' + w + '. ';
        v = w;
      }
      if (inN) inN.value = String(v);
      return v;
    }

    function stopAuto() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (btnAuto) btnAuto.textContent = 'Tự chạy';
    }

    function draw() {
      var n = S.n, ev = S.ev;
      var showSol = S.done && S.lastSol;
      var cols = showSol ? S.lastSol : S.col;
      var grid = document.createElement('div');
      grid.className = 'grid-viz';
      grid.style.setProperty('--cols', String(n + 1));
      grid.setAttribute('role', 'img');

      // Ô bị khống chế bởi các quân đang đặt
      var placed = [];
      for (var i = 0; i < n; i++) if (cols[i] >= 0) placed.push([i, cols[i]]);
      function attacked(r, c) {
        for (var k = 0; k < placed.length; k++) {
          var pr = placed[k][0], pc = placed[k][1];
          if (pr === r && pc === c) continue;
          if (pc === c || pr === r || pr + pc === r + c || pr - pc === r - c) return true;
        }
        return false;
      }
      var full = placed.length === n;

      function cell(cls, txt) {
        var s = document.createElement('span');
        s.className = 'g' + (cls ? ' ' + cls : '');
        s.textContent = txt;
        grid.appendChild(s);
        return s;
      }
      cell('h', '');
      for (var c0 = 0; c0 < n; c0++) cell('h', String(c0 + 1));
      for (var r = 0; r < n; r++) {
        cell('h', String(r + 1));
        for (var c = 0; c < n; c++) {
          var cls = '', txt = '';
          if (cols[r] === c) { cls = full ? 'is-ok' : 'is-active'; txt = 'Q'; }
          else if (!showSol && ev && ev.type === 'bad' && ev.r === r && ev.c === c) { cls = 'is-bad'; txt = '×'; }
          else if (!showSol && ev && ev.type === 'lift' && ev.r === r && ev.c === c) { cls = 'is-sel'; txt = '↑'; }
          else if (attacked(r, c)) { cls = 'is-dim'; txt = '•'; }
          cell(cls, txt);
        }
      }
      var desc = [];
      for (var j = 0; j < n; j++) desc.push(cols[j] >= 0 ? String(cols[j] + 1) : '_');
      grid.setAttribute('aria-label', 'Bàn cờ ' + n + ' × ' + n + ', cột của quân hậu theo từng hàng: ' + desc.join(', '));
      board.textContent = '';
      board.appendChild(grid);

      if (stats) {
        // Dùng span (hợp lệ trong <p>) với các class .meta-row/.meta có sẵn
        var row = document.createElement('span');
        row.className = 'meta-row';
        [['x[1..n]', '[' + desc.join(', ') + ']'], ['Đã thử', S.tries + ' ô'], ['Đặt quân', S.places + ' lần'],
         ['Nhấc quân', S.lifts + ' lần'], ['Nghiệm', String(S.sols)]].forEach(function (kv) {
          var m = document.createElement('span'); m.className = 'meta';
          var k = document.createElement('span'); k.className = 'meta-k'; k.textContent = kv[0];
          var v = document.createElement('span'); v.className = 'meta-v'; v.textContent = kv[1];
          m.appendChild(k); m.appendChild(v); row.appendChild(m);
        });
        stats.textContent = '';
        stats.appendChild(row);
      }
    }

    function message(ev) {
      var n = S.n;
      if (!ev) return 'Bàn ' + n + ' × ' + n + ' trống. Bấm "Bước" để bắt đầu.';
      var pos = '(hàng ' + (ev.r + 1) + ', cột ' + (ev.c + 1) + ')';
      switch (ev.type) {
        case 'place': return 'Thử ' + pos + ': an toàn, đặt quân rồi sang hàng ' + (ev.r + 2) + '.';
        case 'sol': return 'Thử ' + pos + ': an toàn, đặt quân. Đủ ' + n + ' quân: nghiệm thứ ' + S.sols + '!';
        case 'bad': return 'Thử ' + pos + ': bị khống chế (' + (ev.why[0] || 'bị tấn công') + '), bỏ qua.';
        case 'lift':
          return ev.afterSol
            ? 'Đã ghi nghiệm. Nhấc quân ở ' + pos + ' để tìm nghiệm khác.'
            : 'Hàng ' + (ev.r + 2) + ' hết ô để thử. Quay lui: nhấc quân ở ' + pos + ', thử tiếp từ cột ' + (ev.c + 2) + '.';
        case 'done':
          return 'Xong! n = ' + n + ': ' + S.sols + ' nghiệm, ' + S.places + ' lần đặt quân, ' + S.tries +
            ' ô đã thử.' + (S.lastSol ? ' Bàn cờ đang hiện nghiệm cuối cùng.' : '');
      }
      return '';
    }

    function render() {
      draw();
      out.textContent = note + message(S.ev);
      note = '';
    }

    function reset() {
      stopAuto();
      S = new Solver(readN());
      render();
    }

    function toNextSol() {
      var guard = 0;
      while (!S.done && guard++ < 200000) {
        if (S.step().type === 'sol') break;
      }
      if (S.done) S.ev = { type: 'done' };
    }

    function tick() {
      timer = null;
      S.step();
      render();
      if (!S.done) timer = setTimeout(tick, 380);
      else stopAuto();
    }

    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!b || !root.contains(b)) return;
      var act = b.getAttribute('data-act');
      if (act === 'reset') { reset(); return; }
      if (act !== 'auto') stopAuto();
      if (act === 'step') { S.step(); render(); }
      else if (act === 'sol') { toNextSol(); render(); }
      else if (act === 'all') {
        var guard = 0;
        while (!S.done && guard++ < 500000) S.step();
        S.ev = { type: 'done' };
        render();
      } else if (act === 'auto') {
        if (timer) { stopAuto(); return; }
        if (S.done) { reset(); }
        if (CP.reduceMotion) {
          // Không hoạt hình: nhảy thẳng tới nghiệm tiếp theo
          toNextSol(); render();
          return;
        }
        if (btnAuto) btnAuto.textContent = 'Dừng';
        tick();
      }
    });

    if (inN) inN.addEventListener('change', reset);
    reset();
  });
})();
