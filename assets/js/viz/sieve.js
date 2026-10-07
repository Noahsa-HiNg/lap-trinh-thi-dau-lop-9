/* Widget: sàng Eratosthenes từng lượt trên bảng 1..N (N <= 200). */
(function () {
  'use strict';
  if (!window.CP) return;

  CP.mount('#viz-sieve', function (root) {
    var inputN = root.querySelector('#sieve-n');
    var chkSq = root.querySelector('#sieve-sq');
    var board = root.querySelector('.sieve-board');
    var out = root.querySelector('.out');
    var btnReset = root.querySelector('[data-act="reset"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnAll = root.querySelector('[data-act="all"]');
    if (!inputN || !board || !out || !btnStep) return;

    var MAXN = 200;
    var st = null;          // trạng thái hiện tại
    var runId = 0;          // dùng để hủy lượt "Chạy hết" đang chạy

    function readN() {
      var raw = String(inputN.value || '').trim();
      var v = parseInt(raw, 10);
      var note = '';
      if (!/^\d+$/.test(raw) || isNaN(v)) { v = 60; note = 'N không hợp lệ, dùng N = 60. '; }
      if (v < 2) { v = 2; note = 'N nhỏ nhất là 2. '; }
      if (v > MAXN) { v = MAXN; note = 'N lớn nhất là ' + MAXN + '. '; }
      inputN.value = v;
      return { n: v, note: note };
    }

    function reset() {
      runId++;
      var r = readN();
      st = {
        n: r.n,
        fromSq: !chkSq || chkSq.checked,
        i: 2,
        marked: new Array(r.n + 1).fill(false),
        primes: [],          // số nguyên tố đã đi gạch
        cur: 0,              // số nguyên tố của lượt vừa rồi
        pass: {},            // các ô bị gạch ở lượt vừa rồi
        total: 0,
        dup: 0,
        done: false
      };
      buildBoard();
      render();
      out.textContent = r.note + 'Bảng 1..' + st.n + '. Bấm “Lượt tiếp” để bắt đầu.';
    }

    function buildBoard() {
      board.textContent = '';
      var grid = document.createElement('div');
      grid.className = 'grid-viz';
      grid.style.setProperty('--cols', '10');
      for (var x = 1; x <= st.n; x++) {
        var c = document.createElement('span');
        c.className = 'g';
        c.textContent = String(x);
        grid.appendChild(c);
      }
      board.appendChild(grid);
      st.cells = grid.children;
    }

    function render() {
      for (var x = 1; x <= st.n; x++) {
        var cls = 'g';
        if (x === 1) cls += ' is-dim';
        else if (x === st.cur && !st.done) cls += ' is-active';
        else if (st.pass[x]) cls += ' is-bad';
        else if (st.marked[x]) cls += ' is-dim';
        else if (st.done || st.primes.indexOf(x) >= 0) cls += ' is-ok';
        st.cells[x - 1].className = cls;
      }
    }

    function canGo(i) {
      return st.fromSq ? i * i <= st.n : 2 * i <= st.n;
    }

    /* Thực hiện một lượt: tìm số nguyên tố tiếp theo và gạch bội của nó. Trả về false nếu đã xong. */
    function step() {
      if (!st || st.done) return false;
      var skipped = [];
      while (canGo(st.i) && st.marked[st.i]) { skipped.push(st.i); st.i++; }
      var skipMsg = skipped.length ? 'Bỏ qua ' + skipped.join(', ') + ' vì đã bị gạch. ' : '';
      if (!canGo(st.i)) {
        st.done = true; st.pass = {}; st.cur = 0;
        render();
        var cnt = 0;
        for (var x = 2; x <= st.n; x++) if (!st.marked[x]) cnt++;
        var stopMsg = st.fromSq
          ? 'i = ' + st.i + ' có ' + st.i + '·' + st.i + ' = ' + (st.i * st.i) + ' > ' + st.n + ' nên dừng. '
          : 'i = ' + st.i + ' có 2·' + st.i + ' > ' + st.n + ' nên dừng. ';
        out.textContent = skipMsg + stopMsg + 'Còn lại ' + cnt + ' số nguyên tố. Tổng ' + st.total +
          ' lần gạch, trong đó ' + st.dup + ' lần gạch trùng, cho ' + (st.n - 1 - cnt) + ' hợp số.';
        return false;
      }
      var p = st.i;
      var start = st.fromSq ? p * p : 2 * p;
      var k = 0, d = 0;
      st.pass = {};
      for (var j = start; j <= st.n; j += p) {
        if (st.marked[j]) d++;
        st.marked[j] = true;
        st.pass[j] = true;
        k++;
      }
      st.total += k; st.dup += d;
      st.primes.push(p);
      st.cur = p;
      st.i = p + 1;
      render();
      out.textContent = skipMsg + 'Lượt i = ' + p + ' (số nguyên tố): gạch ' + k + ' số từ ' + start +
        (k ? ' đến ' + (start + (k - 1) * p) : '') + ', trong đó ' + d + ' số đã bị gạch trước. ' +
        'Tổng đến giờ: ' + st.total + ' lần gạch, ' + st.dup + ' lần trùng.';
      return true;
    }

    function runAll() {
      if (!st || st.done) reset();
      var my = ++runId;
      if (CP.reduceMotion) { while (step()) { /* chạy ngay */ } return; }
      (function loop() {
        if (my !== runId) return;
        if (step()) CP.sleep(700).then(loop);
      })();
    }

    btnReset.addEventListener('click', reset);
    btnStep.addEventListener('click', function () { runId++; if (!st || st.done) reset(); else step(); });
    if (btnAll) btnAll.addEventListener('click', runAll);
    inputN.addEventListener('change', reset);
    inputN.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });
    if (chkSq) chkSq.addEventListener('change', reset);

    reset();
  });
})();
