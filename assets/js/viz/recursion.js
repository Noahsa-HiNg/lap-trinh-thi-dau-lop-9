/* Widget: tháp Hà Nội n đĩa (1–7), chạy từng bước hoặc tự chạy, hiện ngăn xếp lời gọi.
   Gắn vào #viz-recursion trong topics/recursion.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP) return;

  var CP = window.CP;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var PEG = ['A', 'B', 'C'];
  var PEG_X = [70, 200, 330];
  var BASE_Y = 160;
  var MIN_N = 1, MAX_N = 7;

  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  // Sinh danh sách bước bằng đúng thuật toán đệ quy, kèm ngăn xếp lời gọi tại mỗi bước
  function genMoves(n) {
    var moves = [];
    var stack = [];
    function hanoi(k, from, to, via) {
      if (k === 0) return;
      stack.push('hanoi(' + k + ', ' + PEG[from] + ', ' + PEG[to] + ', ' + PEG[via] + ')');
      hanoi(k - 1, from, via, to);
      moves.push({ disk: k, from: from, to: to, stack: stack.slice() });
      hanoi(k - 1, via, to, from);
      stack.pop();
    }
    hanoi(n, 0, 2, 1);
    return moves;
  }

  CP.mount('#viz-recursion', function (root) {
    var inN = root.querySelector('#rec-n');
    var stage = root.querySelector('[data-role="stage"]');
    var out = root.querySelector('[data-role="out"]');
    var btnPlay = root.querySelector('button[data-act="play"]');
    if (!inN || !stage || !out || !btnPlay) return;

    var n = 3, moves = [], step = 0, pegs = [[], [], []], lastDisk = 0;
    var playing = false, runId = 0, note = '';

    function readN() {
      var v = parseInt(String(inN.value).trim(), 10);
      if (!isFinite(v)) return null;
      return v;
    }

    function setPlaying(on) {
      playing = on;
      runId++;
      btnPlay.textContent = on ? 'Dừng' : 'Tự chạy';
    }

    function draw() {
      stage.textContent = '';
      var svg = svgEl('svg', {
        viewBox: '0 0 400 190', width: '400', role: 'img',
        'aria-label': 'Tháp Hà Nội ' + n + ' đĩa, đã đi ' + step + ' trên ' + moves.length + ' bước'
      });
      svg.style.display = 'block';
      svg.style.margin = '0.5rem auto';
      svg.style.maxWidth = '100%';
      svg.style.height = 'auto';
      svg.appendChild(svgEl('line', { 'class': 'edge', x1: 10, y1: BASE_Y, x2: 390, y2: BASE_Y }));
      var dh = Math.min(18, Math.floor(118 / n));
      var done = step === moves.length;
      for (var p = 0; p < 3; p++) {
        var px = PEG_X[p];
        svg.appendChild(svgEl('line', { 'class': 'edge', x1: px, y1: BASE_Y, x2: px, y2: BASE_Y - 132 }));
        svg.appendChild(svgEl('text', { 'class': 'label-sm', x: px, y: BASE_Y + 18, 'text-anchor': 'middle' }, PEG[p]));
        for (var h = 0; h < pegs[p].length; h++) {
          var d = pegs[p][h];
          var w = 22 + d * (90 / n);
          var cls = 'node';
          if (done) cls += ' is-ok';
          else if (d === lastDisk && h === pegs[p].length - 1) cls += ' is-active';
          var y = BASE_Y - (h + 1) * dh;
          svg.appendChild(svgEl('rect', { 'class': cls, x: (px - w / 2).toFixed(1), y: y, width: w.toFixed(1), height: dh - 2, rx: 4 }));
          if (dh >= 14) svg.appendChild(svgEl('text', { 'class': 'label-sm', x: px, y: y + dh / 2 + 3, 'text-anchor': 'middle' }, String(d)));
        }
      }
      stage.appendChild(svg);
    }

    function report() {
      var total = moves.length;
      var lines = [];
      if (note) { lines.push(note); note = ''; }
      lines.push('n = ' + n + ' đĩa: cần ' + total + ' = 2^' + n + ' − 1 bước.');
      if (step === 0) {
        lines.push('Bước 0 / ' + total + ': mọi đĩa đang ở cọc A.');
      } else {
        var m = moves[step - 1];
        lines.push('Bước ' + step + ' / ' + total + ': chuyển đĩa ' + m.disk + ' từ ' + PEG[m.from] + ' sang ' + PEG[m.to] + '.');
        lines.push('Ngăn xếp lời gọi lúc này (' + m.stack.length + ' tầng, dòng cuối là đỉnh):');
        m.stack.forEach(function (s, i) { lines.push(new Array(i + 1).join('  ') + s); });
      }
      if (step === total) lines.push('Xong! Cả chồng đã ở cọc C sau ' + total + ' bước.');
      out.textContent = lines.join('\n');
    }

    function reset() {
      setPlaying(false);
      var v = readN();
      if (v === null) {
        note = 'Số đĩa phải là số nguyên từ ' + MIN_N + ' đến ' + MAX_N + '. Giữ n = ' + n + '.';
        inN.value = String(n);
        v = n;
      } else if (v < MIN_N || v > MAX_N) {
        note = 'Số đĩa chỉ từ ' + MIN_N + ' đến ' + MAX_N + ', đã chỉnh về ' + Math.max(MIN_N, Math.min(MAX_N, v)) + '.';
        v = Math.max(MIN_N, Math.min(MAX_N, v));
        inN.value = String(v);
      }
      n = v;
      moves = genMoves(n);
      step = 0;
      lastDisk = 0;
      pegs = [[], [], []];
      for (var d = n; d >= 1; d--) pegs[0].push(d);
      draw();
      report();
    }

    function next() {
      if (step >= moves.length) return false;
      var m = moves[step];
      var disk = pegs[m.from].pop();
      if (disk !== m.disk) { reset(); return false; }   // không bao giờ xảy ra nếu sinh đúng
      pegs[m.to].push(disk);
      lastDisk = disk;
      step++;
      draw();
      report();
      return step < moves.length;
    }

    function play() {
      if (playing) { setPlaying(false); return; }
      if (step >= moves.length) reset();
      if (CP.reduceMotion) {            // không hoạt hình: nhảy thẳng tới kết quả
        while (next()) { /* tiếp */ }
        return;
      }
      setPlaying(true);
      var my = runId;
      var delay = n >= 6 ? 160 : 520;
      (function tick() {
        if (my !== runId) return;
        if (!next()) { setPlaying(false); return; }
        CP.sleep(delay).then(tick);
      })();
    }

    root.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-act');
      if (act === 'reset') reset();
      else if (act === 'step') { setPlaying(false); next(); }
      else if (act === 'play') play();
    });
    inN.addEventListener('change', reset);
    inN.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });

    reset();
  });
})();
