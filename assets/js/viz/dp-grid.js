/* Widget đếm đường đi trên lưới có ô cấm cho topics/dp-grid.html
 * Chỉ đi sang phải hoặc xuống dưới, từ ô (1, 1) tới ô (m, n).
 * dp[i][j] = 0 nếu ô cấm; dp[1][1] = 1; còn lại dp[i][j] = dp[i−1][j] + dp[i][j−1].
 * Bấm ô để đặt / bỏ ô cấm (bảng cập nhật ngay) hoặc để xem công thức của ô.
 */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX = 9;

  CP.mount('#viz-dp-grid', function (root) {
    var inM = root.querySelector('#dp-grid-m');
    var inN = root.querySelector('#dp-grid-n');
    var selMode = root.querySelector('#dp-grid-mode');
    var gridBox = root.querySelector('[data-out="grid"]');
    var msg = root.querySelector('[data-out="msg"]');
    if (!inM || !inN || !gridBox || !msg) return;

    var m = 4, n = 5;
    var wall = [];      // wall[i][j] (0-based) = true nếu ô cấm
    var dp = [];        // dp[i][j] = số đường đi từ (1, 1) tới ô (i+1, j+1)
    var cells = [];     // cells[i][j] = phần tử ô
    var runId = 0;      // tăng mỗi khi vẽ lại để dừng hoạt hình cũ
    var animating = false;

    function readInt(input, lo, hi, def) {
      var s = String(input.value).trim();
      var v = Number(s);
      if (s === '' || !isFinite(v)) return { v: def, fixed: true };
      var r = Math.round(v), fixed = r !== v;
      if (r < lo) { r = lo; fixed = true; }
      if (r > hi) { r = hi; fixed = true; }
      return { v: r, fixed: fixed };
    }

    function binom(a, b) {
      if (b < 0 || b > a) return 0;
      var r = 1;
      for (var k = 1; k <= b; k++) r = r * (a - b + k) / k;
      return Math.round(r);
    }

    function emptyWalls() {
      wall = [];
      for (var i = 0; i < m; i++) {
        wall.push([]);
        for (var j = 0; j < n; j++) wall[i].push(false);
      }
    }

    function compute() {
      dp = [];
      for (var i = 0; i < m; i++) {
        dp.push([]);
        for (var j = 0; j < n; j++) {
          var v;
          if (wall[i][j]) v = 0;
          else if (i === 0 && j === 0) v = 1;
          else v = (i > 0 ? dp[i - 1][j] : 0) + (j > 0 ? dp[i][j - 1] : 0);
          dp[i].push(v);
        }
      }
    }

    function name(i, j) { return '(' + (i + 1) + ', ' + (j + 1) + ')'; }

    function baseClass(i, j) {
      if (wall[i][j]) return 'g is-wall';
      if (i === 0 && j === 0) return 'g is-start';
      if (i === m - 1 && j === n - 1) return 'g is-end';
      if (dp[i][j] === 0) return 'g is-dim';
      return 'g';
    }

    function paintCell(i, j, shown) {
      var c = cells[i][j];
      c.className = baseClass(i, j);
      c.textContent = wall[i][j] ? '#' : (shown ? String(dp[i][j]) : '');
      c.setAttribute('aria-label', 'Ô ' + name(i, j) + (wall[i][j] ? ', ô cấm' : ', ' + dp[i][j] + ' đường đi'));
    }

    function paintAll() {
      for (var i = 0; i < m; i++)
        for (var j = 0; j < n; j++) paintCell(i, j, true);
    }

    function headCell(text) {
      var h = document.createElement('span');
      h.className = 'g h';
      h.textContent = text;
      h.setAttribute('aria-hidden', 'true');
      return h;
    }

    function buildGrid() {
      gridBox.textContent = '';
      cells = [];
      var g = document.createElement('div');
      g.className = 'grid-viz';
      g.style.setProperty('--cols', String(n + 1));
      g.setAttribute('role', 'group');
      g.setAttribute('aria-label', 'Bảng số đường đi ' + m + ' hàng, ' + n + ' cột');
      g.appendChild(headCell(''));
      for (var j = 0; j < n; j++) g.appendChild(headCell(String(j + 1)));
      for (var i = 0; i < m; i++) {
        g.appendChild(headCell(String(i + 1)));
        var row = [];
        for (j = 0; j < n; j++) {
          var c = document.createElement('span');
          c.setAttribute('role', 'button');
          c.setAttribute('tabindex', '0');
          c.setAttribute('data-r', String(i));
          c.setAttribute('data-c', String(j));
          g.appendChild(c);
          row.push(c);
        }
        cells.push(row);
      }
      gridBox.appendChild(g);
      var legend = document.createElement('div');
      legend.className = 'viz-legend';
      legend.innerHTML = '<span><i class="is-wall"></i>ô cấm (#)</span>' +
        '<span><i class="is-active"></i>ô đang xét</span>' +
        '<span><i class="is-cmp"></i>ô trên và ô trái</span>' +
        '<span><i class="is-dim"></i>không tới được (0)</span>';
      gridBox.appendChild(legend);
    }

    function countWalls() {
      var k = 0;
      for (var i = 0; i < m; i++)
        for (var j = 0; j < n; j++) if (wall[i][j]) k++;
      return k;
    }

    function summary() {
      var ans = dp[m - 1][n - 1];
      var free = binom(m + n - 2, m - 1);
      var k = countWalls();
      var s = 'Lưới ' + m + ' × ' + n + ', ' + k + ' ô cấm. Số đường đi tới góc dưới phải ' + name(m - 1, n - 1) + ': ' + ans + '.';
      if (k === 0) s += ' Không có ô cấm nên đúng bằng C(' + (m + n - 2) + ', ' + (m - 1) + ') = ' + free + '.';
      else s += ' Nếu không có ô cấm sẽ là C(' + (m + n - 2) + ', ' + (m - 1) + ') = ' + free + ', các ô cấm đã chặn ' + (free - ans) + ' đường.';
      if (wall[0][0]) s += ' Ô xuất phát đang bị cấm nên mọi ô đều bằng 0.';
      return s;
    }

    function explainText(i, j) {
      var s = 'Ô ' + name(i, j) + ': ';
      if (wall[i][j]) return s + 'ô cấm, không đứng được nên dp = 0.';
      if (i === 0 && j === 0) return s + 'ô xuất phát, dp = 1 (đường đi rỗng).';
      var up = i > 0 ? dp[i - 1][j] : 0, left = j > 0 ? dp[i][j - 1] : 0;
      var upT = i > 0 ? 'trên ' + name(i - 1, j) + ' = ' + up : 'trên: ngoài lưới = 0';
      var leftT = j > 0 ? 'trái ' + name(i, j - 1) + ' = ' + left : 'trái: ngoài lưới = 0';
      return s + 'dp = ô ' + upT + ' cộng ô ' + leftT + ', được ' + up + ' + ' + left + ' = ' + dp[i][j] + '.';
    }

    function highlight(i, j) {
      paintAll();
      if (!wall[i][j]) {
        if (i > 0) cells[i - 1][j].className = 'g is-cmp';
        if (j > 0) cells[i][j - 1].className = 'g is-cmp';
      }
      cells[i][j].className = 'g is-active';
    }

    function fresh(note) {
      runId++;
      animating = false;
      compute();
      buildGrid();
      paintAll();
      msg.textContent = (note || '') + summary() + ' Bấm một ô để thử.';
    }

    function newGrid() {
      var rm = readInt(inM, 1, MAX, 4), rn = readInt(inN, 1, MAX, 5);
      inM.value = rm.v; inN.value = rn.v;
      m = rm.v; n = rn.v;
      emptyWalls();
      fresh((rm.fixed || rn.fixed) ? 'Đã chỉnh số hàng, số cột về số nguyên từ 1 đến ' + MAX + '. ' : '');
    }

    function randomWalls() {
      emptyWalls();
      for (var i = 0; i < m; i++)
        for (var j = 0; j < n; j++) {
          var corner = (i === 0 && j === 0) || (i === m - 1 && j === n - 1);
          if (!corner && Math.random() < 0.22) wall[i][j] = true;
        }
      fresh('');
    }

    function clearWalls() {
      emptyWalls();
      fresh('');
    }

    function animate() {
      var my = ++runId;
      animating = true;
      compute();
      buildGrid();
      for (var i = 0; i < m; i++)
        for (var j = 0; j < n; j++) paintCell(i, j, false);
      var k = 0, total = m * n;
      (function step() {
        if (my !== runId) return;
        // Vẽ lại: các ô đã tính (thứ tự hàng < k) hiện số, các ô sau để trống
        for (var a = 0; a < m; a++)
          for (var b = 0; b < n; b++) paintCell(a, b, a * n + b < k);
        if (k >= total) {
          animating = false;
          paintAll();
          msg.textContent = 'Đã điền xong theo thứ tự từng hàng, trái sang phải. ' + summary();
          return;
        }
        var i2 = Math.floor(k / n), j2 = k % n;
        paintCell(i2, j2, true);
        if (!wall[i2][j2]) {
          if (i2 > 0) cells[i2 - 1][j2].className = 'g is-cmp';
          if (j2 > 0) cells[i2][j2 - 1].className = 'g is-cmp';
        }
        cells[i2][j2].className = 'g is-active';
        msg.textContent = explainText(i2, j2);
        k++;
        CP.sleep(total > 40 ? 260 : 420).then(step);
      })();
    }

    function onCell(i, j) {
      if (!(i >= 0 && i < m && j >= 0 && j < n)) return;
      if (animating) { runId++; animating = false; }
      var mode = selMode ? selMode.value : 'wall';
      if (mode === 'explain') {
        compute();
        highlight(i, j);
        msg.textContent = explainText(i, j);
        return;
      }
      var before = dp[m - 1][n - 1];
      wall[i][j] = !wall[i][j];
      compute();
      paintAll();
      cells[i][j].className = wall[i][j] ? 'g is-wall' : 'g is-active';
      var after = dp[m - 1][n - 1];
      var s = (wall[i][j] ? 'Đặt ô cấm tại ' : 'Bỏ ô cấm tại ') + name(i, j) + '. ';
      if (after !== before) s += 'Số đường đi thay đổi từ ' + before + ' thành ' + after + '. ';
      else s += 'Số đường đi không đổi (' + after + '). ';
      msg.textContent = s + summary();
    }

    function cellFrom(t) {
      while (t && t !== gridBox) {
        if (t.getAttribute && t.getAttribute('data-r') !== null) return t;
        t = t.parentNode;
      }
      return null;
    }

    gridBox.addEventListener('click', function (e) {
      var c = cellFrom(e.target);
      if (c) onCell(Number(c.getAttribute('data-r')), Number(c.getAttribute('data-c')));
    });
    gridBox.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var c = cellFrom(e.target);
      if (!c) return;
      e.preventDefault();
      var i = Number(c.getAttribute('data-r')), j = Number(c.getAttribute('data-c'));
      onCell(i, j);
      if (cells[i] && cells[i][j]) cells[i][j].focus();
    });

    var acts = { 'new': newGrid, random: randomWalls, clear: clearWalls, anim: animate };
    root.addEventListener('click', function (e) {
      var t = e.target;
      var act = t && t.closest ? t.closest('[data-act]') : null;
      if (act && root.contains(act) && acts[act.getAttribute('data-act')]) acts[act.getAttribute('data-act')]();
    });
    [inM, inN].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); newGrid(); } });
    });
    if (selMode) selMode.addEventListener('change', function () {
      runId++; animating = false;
      paintAll();
      msg.textContent = selMode.value === 'explain'
        ? 'Chế độ xem công thức: bấm một ô để thấy nó được cộng từ ô trên và ô trái.'
        : 'Chế độ đặt / bỏ ô cấm: bấm một ô, bảng tính lại ngay. ' + summary();
    });

    // Lưới ban đầu: giống ví dụ trong bài (ô cấm tại (2, 2) và (3, 4)) nếu kích thước khớp.
    var r0 = readInt(inM, 1, MAX, 4), c0 = readInt(inN, 1, MAX, 5);
    inM.value = r0.v; inN.value = c0.v;
    m = r0.v; n = c0.v;
    emptyWalls();
    if (m >= 3 && n >= 4) { wall[1][1] = true; wall[2][3] = true; }
    fresh('');
  });
})();
