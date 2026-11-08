/* Widget "Loang trên lưới": vẽ tường, đặt một hay nhiều nguồn S và đích T,
   chạy BFS (đa nguồn) có hoạt hình theo lớp, tô đường đi ngắn nhất. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var DX = [-1, 1, 0, 0, -1, -1, 1, 1];
  var DY = [0, 0, -1, 1, -1, 1, -1, 1];
  var CH = ['U', 'D', 'L', 'R'];
  var LIM = { rMin: 3, rMax: 14, cMin: 3, cMax: 18 };

  function toInt(v) {
    var s = String(v == null ? '' : v).trim();
    if (!/^\d{1,3}$/.test(s)) return NaN;
    return parseInt(s, 10);
  }

  window.CP.mount('#viz-flood-fill', function (root) {
    var gridEl = root.querySelector('.ff-grid');
    var out = root.querySelector('.out');
    var selTool = root.querySelector('#ff-tool');
    var selDir = root.querySelector('#ff-dir');
    var inR = root.querySelector('#ff-rows');
    var inC = root.querySelector('#ff-cols');
    if (!gridEl || !out || !selTool || !selDir || !inR || !inC) return;

    var R = 8, C = 12;
    var wall = [], src = [], endIdx = -1;
    var cells = [];
    var res = null;        // kết quả BFS: { dist, par, maxD, nSrc }
    var shown = -1;        // đang hiện tới lớp nào (-1 = chưa chạy)
    var token = 0;         // huỷ hoạt hình cũ
    var painting = false, paintVal = false, lastPainted = -1;

    function idx(x, y) { return x * C + y; }

    function defaultLayout() {
      wall = []; src = []; endIdx = -1;
      for (var i = 0; i < R * C; i++) { wall.push(false); src.push(false); }
      src[idx(0, 0)] = true;
      endIdx = idx(R - 1, C - 1);
    }

    function build() {
      gridEl.textContent = '';
      gridEl.style.setProperty('--cols', String(C));
      cells = [];
      for (var i = 0; i < R * C; i++) {
        var s = document.createElement('span');
        s.className = 'g';
        s.setAttribute('role', 'button');
        s.setAttribute('tabindex', '0');
        s.setAttribute('data-k', String(i));
        gridEl.appendChild(s);
        cells.push(s);
      }
    }

    function bfs() {
      var n = R * C, nd = selDir.value === '8' ? 8 : 4;
      var dist = new Array(n), par = new Array(n), q = [], head = 0, nSrc = 0, maxD = 0;
      for (var i = 0; i < n; i++) { dist[i] = -1; par[i] = -1; }
      for (i = 0; i < n; i++) {
        if (src[i] && !wall[i]) { dist[i] = 0; q.push(i); nSrc++; }   // đa nguồn: mọi S có d = 0
      }
      while (head < q.length) {
        var u = q[head++], x = Math.floor(u / C), y = u % C;
        for (var k = 0; k < nd; k++) {
          var nx = x + DX[k], ny = y + DY[k];
          if (nx < 0 || ny < 0 || nx >= R || ny >= C) continue;
          var v = idx(nx, ny);
          if (wall[v] || dist[v] !== -1) continue;
          dist[v] = dist[u] + 1;
          par[v] = k;
          if (dist[v] > maxD) maxD = dist[v];
          q.push(v);
        }
      }
      return { dist: dist, par: par, maxD: maxD, nSrc: nSrc, visited: q.length, nd: nd };
    }

    function tracePath() {
      if (!res || endIdx < 0 || res.dist[endIdx] < 0) return null;
      var set = {}, letters = '', v = endIdx;
      while (res.dist[v] > 0) {
        set[v] = true;
        var k = res.par[v];
        if (k < 4) letters += CH[k]; else letters += '*';
        var x = Math.floor(v / C) - DX[k], y = (v % C) - DY[k];
        v = idx(x, y);
      }
      set[v] = true;
      return { set: set, letters: letters.split('').reverse().join(''), from: v };
    }

    function render() {
      var done = res && shown >= res.maxD;
      var path = done ? tracePath() : null;
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i], cls = 'g', txt = '', label;
        var x = Math.floor(i / C), y = i % C;
        var d = res ? res.dist[i] : -1;
        var vis = d >= 0 && d <= shown;
        if (wall[i]) { cls += ' is-wall'; label = 'tường'; }
        else if (src[i]) { cls += ' is-start'; txt = 'S'; label = 'nguồn S'; }
        else if (i === endIdx) { cls += ' is-end'; txt = vis ? String(d) : 'T'; label = 'đích T'; }
        else if (vis) {
          if (path && path.set[i]) cls += ' is-path';
          else cls += (d === shown && !done) ? ' is-active' : ' is-ok';
          txt = String(d); label = 'cách nguồn ' + d + ' bước';
        } else label = 'ô trống';
        c.className = cls;
        c.textContent = txt;
        c.setAttribute('aria-label', 'Ô (' + x + ', ' + y + '): ' + label);
      }
    }

    function report() {
      if (!res) return;
      var lines = [];
      if (res.nSrc === 0) { out.textContent = 'Chưa có nguồn. Chọn “đặt / bỏ nguồn S” rồi bấm vào một ô.'; return; }
      var done = shown >= res.maxD;
      lines.push((res.nSrc > 1 ? 'BFS đa nguồn từ ' + res.nSrc + ' ô S' : 'BFS từ 1 ô S') + ', đi ' + res.nd + ' hướng.');
      if (!done) {
        var cnt = 0;
        for (var i = 0; i < res.dist.length; i++) if (res.dist[i] === shown) cnt++;
        lines.push('Lớp ' + shown + ': ' + cnt + ' ô cách nguồn gần nhất đúng ' + shown + ' bước.');
      } else {
        lines.push('Xong: thăm ' + res.visited + ' ô, xa nhất cách nguồn gần nhất ' + res.maxD + ' bước.');
        if (endIdx < 0) lines.push('Chưa đặt đích T.');
        else if (res.dist[endIdx] < 0) lines.push('Không tới được T: T bị tường bao kín.');
        else {
          var p = tracePath();
          var fx = Math.floor(p.from / C), fy = p.from % C;
          lines.push('Tới T ít nhất ' + res.dist[endIdx] + ' bước, xuất phát từ S = (' + fx + ', ' + fy + ').');
          if (res.nd === 4) lines.push('Đường đi: ' + (p.letters || '(T trùng S)'));
        }
      }
      out.textContent = lines.join('\n');
    }

    function invalidate() { token++; res = null; shown = -1; render(); }

    function run(animate) {
      var my = ++token;
      res = bfs();
      if (res.nSrc === 0) { shown = -1; render(); report(); return; }
      if (!animate || window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        shown = res.maxD; render(); report(); return;
      }
      shown = 0;
      var delay = Math.max(70, Math.min(260, Math.round(2600 / (res.maxD + 1))));
      (function tick() {
        if (my !== token) return;
        render(); report();
        if (shown >= res.maxD) return;
        window.CP.sleep(delay).then(function () { if (my !== token) return; shown++; tick(); });
      })();
    }

    function step() {
      token++;
      if (!res) { res = bfs(); shown = res.nSrc ? 0 : -1; }
      else if (shown < res.maxD) shown++;
      render(); report();
    }

    function apply(k, isDrag) {
      if (!(k >= 0 && k < R * C)) return;
      var tool = selTool.value;
      if (tool === 'wall') {
        if (!isDrag) paintVal = !wall[k];
        if (src[k] || k === endIdx) return;      // không xây tường lên S, T
        wall[k] = paintVal;
      } else if (tool === 'src') {
        if (isDrag) return;
        if (k === endIdx) endIdx = -1;
        wall[k] = false; src[k] = !src[k];
      } else {
        if (isDrag) return;
        wall[k] = false; src[k] = false; endIdx = k;
      }
      invalidate();
      out.textContent = 'Đã sửa lưới. Bấm “Chạy BFS” hoặc “Thêm một lớp”.';
    }

    function cellFromEvent(e) {
      var t = e.target && e.target.closest ? e.target.closest('.g') : null;
      if (e.pointerType && e.pointerType !== 'mouse' && typeof document.elementFromPoint === 'function') {
        var el = document.elementFromPoint(e.clientX, e.clientY);
        t = el && el.closest ? el.closest('.g') : null;
      }
      if (!t || !gridEl.contains(t)) return -1;
      return parseInt(t.getAttribute('data-k'), 10);
    }

    gridEl.addEventListener('pointerdown', function (e) {
      var k = cellFromEvent(e);
      if (k < 0) return;
      e.preventDefault();
      painting = true; lastPainted = k;
      apply(k, false);
    });
    gridEl.addEventListener('pointermove', function (e) {
      if (!painting || selTool.value !== 'wall') return;
      var k = cellFromEvent(e);
      if (k < 0 || k === lastPainted) return;
      lastPainted = k;
      apply(k, true);
    });
    function stopPaint() { painting = false; lastPainted = -1; }
    document.addEventListener('pointerup', stopPaint);
    document.addEventListener('pointercancel', stopPaint);
    gridEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target && e.target.closest ? e.target.closest('.g') : null;
      if (!t) return;
      e.preventDefault();
      apply(parseInt(t.getAttribute('data-k'), 10), false);
      var again = cells[parseInt(t.getAttribute('data-k'), 10)];
      if (again) again.focus();
    });

    function readSize() {
      var r = toInt(inR.value), c = toInt(inC.value);
      if (!(r >= LIM.rMin && r <= LIM.rMax) || !(c >= LIM.cMin && c <= LIM.cMax)) {
        out.textContent = 'Số hàng cần từ ' + LIM.rMin + ' đến ' + LIM.rMax + ', số cột từ ' + LIM.cMin + ' đến ' + LIM.cMax + '.';
        return false;
      }
      R = r; C = c;
      return true;
    }

    function resetGrid() {
      if (!readSize()) return;
      token++;
      defaultLayout(); build(); invalidate();
      out.textContent = 'Lưới mới ' + R + ' × ' + C + '. Bấm ô để vẽ tường, rồi “Chạy BFS”.';
    }

    function randomMaze() {
      if (!readSize()) return;
      token++;
      if (cells.length !== R * C) { defaultLayout(); build(); }
      var keepSrc = src.slice(), keepEnd = endIdx;
      var anySrc = keepSrc.some(function (b) { return b; });
      for (var i = 0; i < R * C; i++) wall[i] = Math.random() < 0.3;
      if (!anySrc) keepSrc[idx(0, 0)] = true;
      if (keepEnd < 0) keepEnd = idx(R - 1, C - 1);
      src = keepSrc; endIdx = keepEnd;
      for (i = 0; i < R * C; i++) if (src[i]) wall[i] = false;
      wall[endIdx] = false;
      invalidate();
      run(true);
    }

    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!b || !root.contains(b)) return;
      var act = b.getAttribute('data-act');
      if (act === 'run') run(true);
      else if (act === 'step') step();
      else if (act === 'clear') { invalidate(); out.textContent = 'Đã xoá số. Tường và nguồn vẫn giữ nguyên.'; }
      else if (act === 'random') randomMaze();
      else if (act === 'reset') resetGrid();
    });
    selDir.addEventListener('change', function () { if (res) run(false); });
    [inR, inC].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); resetGrid(); } });
    });

    // Mê cung mặc định (8 × 12) để trang mở ra đã có cái để xem
    defaultLayout();
    var preset = [
      '..#.........',
      '..#.####.##.',
      '..#....#..#.',
      '.###.#.##.#.',
      '.....#....#.',
      '####.####.#.',
      '...#....#.#.',
      '.#...##.....'
    ];
    for (var x = 0; x < R; x++) for (var y = 0; y < C; y++) wall[idx(x, y)] = preset[x].charAt(y) === '#';
    build();
    run(false);
  });
})();
