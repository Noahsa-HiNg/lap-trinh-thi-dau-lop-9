/* Widget: Dijkstra từng bước với hàng đợi ưu tiên trên đồ thị vô hướng nhỏ (n <= 10). */
(function () {
  'use strict';
  if (!window.CP) return;

  CP.mount('#viz-dijkstra', function (root) {
    var inEdges = root.querySelector('#dij-edges');
    var inSrc = root.querySelector('#dij-src');
    var svgBox = root.querySelector('.dij-svg');
    var tableBox = root.querySelector('.dij-table');
    var pqBox = root.querySelector('.dij-pq');
    var out = root.querySelector('.out');
    var btnReset = root.querySelector('[data-act="reset"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnAll = root.querySelector('[data-act="all"]');
    var btnSample = root.querySelector('[data-act="sample"]');
    if (!inEdges || !inSrc || !svgBox || !tableBox || !out || !btnStep) return;

    var SAMPLE = '1 2 7, 1 3 2, 2 3 3, 2 4 4, 3 5 9, 4 5 1, 4 6 5, 5 6 3';
    var MAXN = 10, MAXW = 1000000, MAXM = 30;
    var NS = 'http://www.w3.org/2000/svg';
    var st = null;
    var runId = 0;

    /* Đọc cạnh: lấy mọi số nguyên trong ô nhập, gom thành bộ ba (u, v, w). */
    function parse() {
      var raw = String(inEdges.value || '');
      var notes = [];
      if (/(^|[\s,;(])-\s*\d/.test(raw)) {
        return { edges: [], n: 0, notes: ['Có trọng số âm: Dijkstra cho kết quả sai khi có cạnh âm, nên widget không chạy (xem mục Biến thể).'] };
      }
      var nums = (raw.match(/\d+/g) || []).map(function (x) { return parseInt(x, 10); });
      if (nums.length % 3 !== 0) notes.push('Bỏ ' + (nums.length % 3) + ' số lẻ ở cuối (mỗi cạnh cần 3 số).');
      var edges = [], n = 0;
      for (var i = 0; i + 2 < nums.length; i += 3) {
        var u = nums[i], v = nums[i + 1], w = nums[i + 2];
        if (u < 1 || v < 1 || u > MAXN || v > MAXN) { notes.push('Bỏ cạnh ' + u + ' ' + v + ': đỉnh phải từ 1 tới ' + MAXN + '.'); continue; }
        if (u === v) { notes.push('Bỏ khuyên ' + u + ' ' + v + '.'); continue; }
        if (w > MAXW) { notes.push('Bỏ cạnh ' + u + ' ' + v + ': trọng số tối đa ' + MAXW + '.'); continue; }
        if (edges.length >= MAXM) { notes.push('Chỉ dùng ' + MAXM + ' cạnh đầu.'); break; }
        edges.push({ u: u, v: v, w: w });
        n = Math.max(n, u, v);
      }
      return { edges: edges, n: n, notes: notes };
    }

    function reset() {
      runId++;
      var p = parse();
      if (!p.edges.length) {
        st = null;
        svgBox.textContent = ''; tableBox.textContent = '';
        if (pqBox) pqBox.textContent = '';
        out.textContent = p.notes.join(' ') + ' Chưa có cạnh hợp lệ. Nhập dạng “1 2 7, 1 3 2, …” hoặc bấm “Đồ thị mẫu”.';
        return;
      }
      var s = parseInt(inSrc.value, 10);
      if (isNaN(s) || s < 1 || s > p.n) { p.notes.push('Nguồn không hợp lệ, dùng đỉnh 1.'); s = 1; }
      inSrc.value = s;
      var adj = [], dist = [], par = [], done = [];
      for (var v = 0; v <= p.n; v++) { adj.push([]); dist.push(Infinity); par.push(0); done.push(false); }
      p.edges.forEach(function (e, idx) {
        adj[e.u].push({ v: e.v, w: e.w, id: idx });
        adj[e.v].push({ v: e.u, w: e.w, id: idx });
      });
      dist[s] = 0;
      st = {
        n: p.n, edges: p.edges, adj: adj, s: s,
        dist: dist, par: par, done: done,
        pq: [[0, s]],
        cur: 0, edgeCls: {}, changed: {}, pops: 0, stale: 0, finished: false
      };
      layout();
      render();
      out.textContent = (p.notes.length ? p.notes.join(' ') + ' ' : '') +
        'Khởi tạo: dist[' + s + '] = 0, các đỉnh khác ∞. Hàng đợi: (0, ' + s + '). Bấm “Bước tiếp”.';
    }

    function isSample() {
      var key = st.edges.map(function (e) { return e.u + ' ' + e.v + ' ' + e.w; }).join(', ');
      return key === SAMPLE;
    }

    function layout() {
      var n = st.n, cx = 200, cy = 130, r = n <= 2 ? 90 : 100;
      st.pos = [null];
      if (isSample()) {   /* đồ thị mẫu: vẽ giống hình trong bài, không cạnh cắt nhau */
        st.pos = [null, { x: 62, y: 130 }, { x: 145, y: 55 }, { x: 145, y: 205 }, { x: 255, y: 55 }, { x: 255, y: 205 }, { x: 338, y: 130 }];
        return;
      }
      for (var i = 1; i <= n; i++) {
        var a = -Math.PI / 2 + 2 * Math.PI * (i - 1) / n;
        st.pos.push({ x: Math.round(cx + r * Math.cos(a)), y: Math.round(cy + r * Math.sin(a)) });
      }
    }

    function mk(tag, attrs, text) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
      if (text !== undefined) e.textContent = text;
      return e;
    }

    function fmt(x) { return x === Infinity ? '∞' : String(x); }

    function render() {
      var svg = mk('svg', { viewBox: '0 0 400 265', width: '400', role: 'img', 'aria-label': 'Đồ thị đang chạy Dijkstra' });
      var pos = st.pos;
      st.edges.forEach(function (e, idx) {
        var a = pos[e.u], b = pos[e.v];
        var cls = 'edge' + (st.edgeCls[idx] ? ' ' + st.edgeCls[idx] : '');
        svg.appendChild(mk('line', { 'class': cls, x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
      });
      st.edges.forEach(function (e) {
        var a = pos[e.u], b = pos[e.v];
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        var dx = b.y - a.y, dy = a.x - b.x, len = Math.sqrt(dx * dx + dy * dy) || 1;
        svg.appendChild(mk('rect', { 'class': 'fill-paper', x: mx + dx / len * 8 - 11, y: my + dy / len * 8 - 9, width: 22, height: 14, rx: 3 }));
        svg.appendChild(mk('text', { 'class': 'label-sm', x: mx + dx / len * 8, y: my + dy / len * 8 + 2, 'text-anchor': 'middle' }, String(e.w)));
      });
      for (var v = 1; v <= st.n; v++) {
        var p = pos[v];
        var used = st.adj[v].length > 0;
        var cls = 'node' + (v === st.cur ? ' is-active' : st.done[v] ? ' is-ok' : used ? '' : ' is-dim');
        svg.appendChild(mk('circle', { 'class': cls, cx: p.x, cy: p.y, r: 15 }));
        svg.appendChild(mk('text', { x: p.x, y: p.y + 5, 'text-anchor': 'middle' }, String(v)));
        var ox = p.x - 200, oy = p.y - 130, ol = Math.sqrt(ox * ox + oy * oy) || 1;
        var lx = Math.max(22, Math.min(378, p.x + ox / ol * 26));
        var ly = p.y + oy / ol * 26 + (oy >= 0 ? 8 : 0);
        svg.appendChild(mk('text', { 'class': st.changed[v] ? 'label-pen' : 'label-sm', x: Math.round(lx), y: Math.round(ly), 'text-anchor': 'middle' }, 'd=' + fmt(st.dist[v])));
      }
      svgBox.textContent = '';
      svgBox.appendChild(svg);

      var t = document.createElement('table');
      t.className = 'trace';
      var rows = [['Đỉnh'], ['dist'], ['par'], ['chốt']];
      for (var i = 1; i <= st.n; i++) {
        rows[0].push(String(i));
        rows[1].push(fmt(st.dist[i]));
        rows[2].push(st.par[i] ? String(st.par[i]) : '–');
        rows[3].push(st.done[i] ? '✓' : '');
      }
      rows.forEach(function (r, ri) {
        var tr = document.createElement('tr');
        r.forEach(function (c, ci) {
          var cell = document.createElement(ri === 0 || ci === 0 ? 'th' : 'td');
          cell.textContent = c;
          if (ci > 0 && (ri === 1 || ri === 2) && st.changed[ci]) cell.className = 'hl';
          tr.appendChild(cell);
        });
        t.appendChild(tr);
      });
      tableBox.textContent = '';
      tableBox.appendChild(t);
      if (pqBox) {
        var items = st.pq.slice().sort(cmp).map(function (x) { return '(' + x[0] + ', ' + x[1] + ')'; });
        pqBox.textContent = 'Hàng đợi ưu tiên: ' + (items.length ? items.join(' ') : 'rỗng');
      }
    }

    function cmp(a, b) { return a[0] - b[0] || a[1] - b[1]; }

    /* Lấy phần tử nhỏ nhất (n nhỏ nên tìm tuyến tính là đủ, kết quả như priority_queue). */
    function popMin() {
      var bi = 0;
      for (var i = 1; i < st.pq.length; i++) if (cmp(st.pq[i], st.pq[bi]) < 0) bi = i;
      return st.pq.splice(bi, 1)[0];
    }

    function pathTo(v) {
      var p = [], guard = 0;
      while (v && guard++ <= st.n) { p.push(v); if (v === st.s) break; v = st.par[v]; }
      return p.reverse();
    }

    function finish() {
      st.finished = true; st.cur = 0; st.changed = {}; st.edgeCls = {};
      for (var v = 1; v <= st.n; v++) {
        if (v !== st.s && st.par[v]) {
          var pu = st.par[v];
          for (var k = 0; k < st.adj[v].length; k++) {
            var e = st.adj[v][k];
            if (e.v === pu && st.dist[pu] + e.w === st.dist[v]) { st.edgeCls[e.id] = 'is-ok'; break; }
          }
        }
      }
      render();
      var parts = [];
      for (var x = 1; x <= st.n; x++) {
        if (x === st.s || !st.adj[x].length) continue;
        parts.push(x + ': ' + (st.dist[x] === Infinity ? 'không tới được' : st.dist[x] + ' (' + pathTo(x).join('→') + ')'));
      }
      out.textContent = 'Hàng đợi rỗng, xong sau ' + st.pops + ' lần lấy ra (' + st.stale + ' phần tử lỗi thời). ' +
        'Cây đường đi ngắn nhất tô xanh. ' + parts.join('; ') + '.';
    }

    /* Một bước = lấy một phần tử ra khỏi hàng đợi. Trả về false khi đã xong. */
    function step() {
      if (!st) return false;
      if (st.finished) return false;
      if (!st.pq.length) { finish(); return false; }
      var top = popMin(), d = top[0], u = top[1];
      st.pops++;
      st.changed = {}; st.edgeCls = {};
      if (d > st.dist[u]) {
        st.stale++;
        st.cur = 0;
        render();
        out.textContent = 'Lấy (' + d + ', ' + u + '): ' + d + ' > dist[' + u + '] = ' + st.dist[u] + ', phần tử lỗi thời, bỏ qua.';
        return true;
      }
      st.done[u] = true;
      st.cur = u;
      var msg = [];
      st.adj[u].forEach(function (e) {
        var nd = d + e.w;
        if (nd < st.dist[e.v]) {
          msg.push(u + '–' + e.v + ': ' + d + ' + ' + e.w + ' = ' + nd + ' < ' + fmt(st.dist[e.v]) + ', sửa');
          st.dist[e.v] = nd; st.par[e.v] = u; st.changed[e.v] = true;
          st.edgeCls[e.id] = 'is-active';
          st.pq.push([nd, e.v]);
        } else {
          if (st.edgeCls[e.id] !== 'is-active') st.edgeCls[e.id] = 'is-bad';
          msg.push(u + '–' + e.v + ': ' + d + ' + ' + e.w + ' = ' + nd + ' ≥ ' + fmt(st.dist[e.v]) + ', giữ');
        }
      });
      render();
      out.textContent = 'Lấy (' + d + ', ' + u + '): chốt đỉnh ' + u + ', dist = ' + d + '. ' +
        (msg.length ? 'Nới lỏng ' + msg.join('; ') + '.' : 'Không có cạnh nào.');
      return true;
    }

    function runAll() {
      if (!st || st.finished) reset();
      if (!st) return;
      var my = ++runId;
      if (CP.reduceMotion) { while (step()) { /* chạy ngay */ } return; }
      (function loop() {
        if (my !== runId) return;
        if (step()) CP.sleep(800).then(loop);
      })();
    }

    if (btnReset) btnReset.addEventListener('click', reset);
    btnStep.addEventListener('click', function () {
      runId++;
      if (!st || st.finished) { reset(); return; }
      step();
    });
    if (btnAll) btnAll.addEventListener('click', runAll);
    if (btnSample) btnSample.addEventListener('click', function () { inEdges.value = SAMPLE; inSrc.value = 1; reset(); });
    inEdges.addEventListener('change', reset);
    inSrc.addEventListener('change', reset);
    [inEdges, inSrc].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });
    });

    reset();
  });
})();
