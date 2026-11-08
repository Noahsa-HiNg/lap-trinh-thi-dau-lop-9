/* Widget: chạy BFS từng bước trên đồ thị vô hướng tự nhập (đỉnh 1..12). */
(function () {
  'use strict';
  if (!window.CP) return;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var MAXV = 12;

  CP.mount('#viz-bfs', function (root) {
    var inEdges = root.querySelector('#bfs-edges');
    var inSrc = root.querySelector('#bfs-src');
    var inDst = root.querySelector('#bfs-dst');
    var board = root.querySelector('.bfs-board');
    var arrays = root.querySelector('.bfs-arrays');
    var out = root.querySelector('.out');
    var btnReset = root.querySelector('[data-act="reset"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnAll = root.querySelector('[data-act="all"]');
    if (!inEdges || !board || !arrays || !out || !btnStep) return;

    var st = null;
    var runId = 0;

    function key(a, b) { return a < b ? a + '-' + b : b + '-' + a; }

    function readInt(input, def) {
      var v = parseInt(String(input && input.value || '').trim(), 10);
      return isNaN(v) ? def : v;
    }

    /* Đọc các cạnh: lấy mọi số nguyên trong ô nhập, ghép từng cặp. */
    function parse() {
      var notes = [];
      var nums = (String(inEdges.value || '').match(/-?\d+/g) || []).map(Number);
      // "1-2" bị tách thành 1 và -2: lấy trị tuyệt đối
      nums = nums.map(function (x) { return Math.abs(x); });
      if (nums.length % 2 === 1) { nums.pop(); notes.push('Số cuối bị lẻ cặp, đã bỏ.'); }
      var edges = [], seen = {}, bad = 0;
      for (var i = 0; i + 1 < nums.length; i += 2) {
        var a = nums[i], b = nums[i + 1];
        if (a < 1 || b < 1 || a > MAXV || b > MAXV || a === b) { bad++; continue; }
        var k = key(a, b);
        if (seen[k]) continue;
        seen[k] = true;
        edges.push([a, b]);
      }
      if (bad) notes.push('Bỏ ' + bad + ' cạnh không hợp lệ (đỉnh phải từ 1 đến ' + MAXV + ', không nối đỉnh với chính nó).');
      if (edges.length > 40) { edges = edges.slice(0, 40); notes.push('Chỉ dùng 40 cạnh đầu.'); }
      var n = 1;
      edges.forEach(function (e) { n = Math.max(n, e[0], e[1]); });
      var s = readInt(inSrc, 1), t = readInt(inDst, n);
      if (s < 1 || s > n) { notes.push('Nguồn không hợp lệ, dùng 1.'); s = 1; }
      if (t < 1 || t > n) { notes.push('Đích không hợp lệ, dùng ' + n + '.'); t = n; }
      if (inSrc) inSrc.value = s;
      if (inDst) inDst.value = t;
      if (!edges.length) notes.push('Chưa có cạnh nào.');
      return { n: n, edges: edges, s: s, t: t, note: notes.join(' ') };
    }

    function reset() {
      runId++;
      var g = parse();
      var adj = [];
      for (var v = 0; v <= g.n; v++) adj.push([]);
      g.edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
      adj.forEach(function (l) { l.sort(function (a, b) { return a - b; }); });
      var dist = [], par = [];
      for (v = 0; v <= g.n; v++) { dist.push(-1); par.push(0); }
      dist[g.s] = 0;
      st = {
        n: g.n, edges: g.edges, adj: adj, s: g.s, t: g.t,
        dist: dist, par: par, queue: [g.s], done: {}, cur: 0,
        hot: {}, skip: {}, path: {}, finished: false, steps: 0
      };
      build();
      render();
      out.textContent = (g.note ? g.note + ' ' : '') + 'Khởi tạo: dist[' + g.s + '] = 0, hàng đợi = [' + g.s + ']. Bấm “Bước tiếp”.';
    }

    function el(name, attrs, text) {
      var e = document.createElementNS(SVGNS, name);
      for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
      if (text !== undefined) e.textContent = text;
      return e;
    }

    function build() {
      board.textContent = '';
      var W = 330, H = 330, cx = 165, cy = 165, R = st.n <= 2 ? 70 : 115;
      var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, role: 'img', 'aria-label': 'Đồ thị đang chạy BFS' });
      st.pos = [null];
      for (var v = 1; v <= st.n; v++) {
        var ang = -Math.PI / 2 + 2 * Math.PI * (v - 1) / st.n;
        st.pos.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang), ang]);
      }
      st.lineEls = {};
      st.edges.forEach(function (e) {
        var p = st.pos[e[0]], q = st.pos[e[1]];
        var ln = el('line', { 'class': 'edge', x1: p[0].toFixed(1), y1: p[1].toFixed(1), x2: q[0].toFixed(1), y2: q[1].toFixed(1) });
        svg.appendChild(ln);
        st.lineEls[key(e[0], e[1])] = ln;
      });
      st.nodeEls = [null];
      st.labelEls = [null];
      for (v = 1; v <= st.n; v++) {
        var p = st.pos[v];
        var c = el('circle', { 'class': 'node', cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 15 });
        svg.appendChild(c);
        svg.appendChild(el('text', { x: p[0].toFixed(1), y: (p[1] + 5).toFixed(1), 'text-anchor': 'middle' }, String(v)));
        var lx = cx + (R + 30) * Math.cos(p[2]), ly = cy + (R + 30) * Math.sin(p[2]) + 4;
        var lb = el('text', { 'class': 'label-sm', x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor': 'middle' }, '');
        svg.appendChild(lb);
        st.nodeEls.push(c);
        st.labelEls.push(lb);
      }
      board.appendChild(svg);
    }

    function cellRow(label, items) {
      var row = document.createElement('div');
      row.className = 'arr';
      var lab = document.createElement('span');
      lab.className = 'arr-label';
      lab.textContent = label;
      row.appendChild(lab);
      items.forEach(function (it) {
        var c = document.createElement('span');
        c.className = 'cell' + (it.cls ? ' ' + it.cls : '');
        if (it.i !== undefined) c.setAttribute('data-i', String(it.i));
        c.textContent = it.text;
        row.appendChild(c);
      });
      return row;
    }

    function render() {
      var v;
      for (v = 1; v <= st.n; v++) {
        var cls = 'node';
        var inPath = st.finished && st.path[v];
        if (st.finished && Object.keys(st.path).length) cls += inPath ? ' is-ok' : ' is-dim';
        else if (v === st.cur) cls += ' is-active';
        else if (st.done[v]) cls += ' is-ok';
        else if (st.dist[v] !== -1) cls += ' is-cmp';
        st.nodeEls[v].setAttribute('class', cls);
        st.labelEls[v].textContent = 'd=' + (st.dist[v] === -1 ? '−1' : st.dist[v]);
      }
      Object.keys(st.lineEls).forEach(function (k) {
        var c = 'edge';
        if (st.finished && Object.keys(st.path).length) c += st.path[k] ? ' is-ok' : ' is-dim';
        else if (st.hot[k]) c += ' is-active';
        else if (st.skip[k]) c += ' is-bad';
        st.lineEls[k].setAttribute('class', c);
      });
      arrays.textContent = '';
      var qItems = st.queue.map(function (x, i) { return { text: String(x), cls: 'is-cmp', i: i }; });
      if (!qItems.length) qItems = [{ text: 'rỗng', cls: 'is-dim' }];
      arrays.appendChild(cellRow('hàng đợi', qItems));
      var dItems = [];
      for (v = 1; v <= st.n; v++) {
        dItems.push({ text: st.dist[v] === -1 ? '−1' : String(st.dist[v]), i: v,
          cls: v === st.cur ? 'is-active' : (st.dist[v] !== -1 ? 'is-ok' : '') });
      }
      arrays.appendChild(cellRow('dist', dItems));
      var pItems = [];
      for (v = 1; v <= st.n; v++) pItems.push({ text: st.par[v] ? String(st.par[v]) : '–', i: v });
      arrays.appendChild(cellRow('par', pItems));
    }

    function finish() {
      st.finished = true;
      st.cur = 0;
      st.hot = {};
      st.skip = {};
      var t = st.t, s = st.s, msg = 'Hàng đợi rỗng, BFS dừng sau ' + st.steps + ' lần lấy ra. ';
      if (st.dist[t] === -1) {
        msg += 'Không có đường từ ' + s + ' tới ' + t + ' (dist[' + t + '] = −1).';
      } else {
        var path = [], v = t, guard = 0;
        while (v !== s && guard++ <= st.n) { path.push(v); v = st.par[v]; }
        path.push(s);
        path.reverse();
        st.path = {};
        for (var i = 0; i < path.length; i++) {
          st.path[path[i]] = true;
          if (i) st.path[key(path[i - 1], path[i])] = true;
        }
        msg += 'Truy vết theo par: đường ngắn nhất ' + path.join(' → ') + ', dài ' + st.dist[t] + ' cạnh.';
      }
      render();
      out.textContent = msg;
    }

    function step() {
      if (!st) reset();
      if (st.finished) return false;
      if (st.cur) st.done[st.cur] = true;
      st.hot = {};
      st.skip = {};
      if (!st.queue.length) { finish(); return false; }
      var u = st.queue.shift();
      st.cur = u;
      st.steps++;
      var pushed = [], skipped = [];
      st.adj[u].forEach(function (v) {
        if (st.dist[v] !== -1) {
          skipped.push(v);
          if (st.par[u] !== v) st.skip[key(u, v)] = true;
          return;
        }
        st.dist[v] = st.dist[u] + 1;
        st.par[v] = u;
        st.queue.push(v);
        st.hot[key(u, v)] = true;
        pushed.push(v + ' (dist ' + st.dist[v] + ')');
      });
      render();
      var msg = 'Lấy ' + u + ' ra (dist = ' + st.dist[u] + '). ';
      msg += pushed.length ? 'Đẩy vào: ' + pushed.join(', ') + '. ' : 'Không đẩy thêm đỉnh nào. ';
      if (skipped.length) msg += 'Bỏ qua vì đã có dist: ' + skipped.join(', ') + '.';
      out.textContent = msg;
      return true;
    }

    function runAll() {
      if (!st || st.finished) reset();
      var my = ++runId;
      (function loop() {
        if (my !== runId) return;
        var more = step();
        if (!more) return;
        if (CP.reduceMotion) { loop(); return; }
        CP.sleep(600).then(loop);
      })();
    }

    if (btnReset) btnReset.addEventListener('click', reset);
    btnStep.addEventListener('click', function () { runId++; step(); });
    if (btnAll) btnAll.addEventListener('click', runAll);
    [inEdges, inSrc, inDst].forEach(function (inp) {
      if (inp) inp.addEventListener('change', reset);
    });
    reset();
  });
})();
