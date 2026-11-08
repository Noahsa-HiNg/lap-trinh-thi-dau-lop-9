/* Widget: nhập đồ thị vô hướng (n ≤ 12, danh sách cạnh), chạy DFS đệ quy từng bước,
   hiện ngăn xếp lời gọi, visited, thứ tự thăm, cạnh cây / cạnh ngược và các thành phần.
   Gắn vào #viz-graph-dfs trong topics/graph-dfs.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP) return;

  var CP = window.CP;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var MAX_N = 12, MAX_M = 40;
  var W = 520, H = 260, CX = 260, CY = 130, R = 100;

  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function ekey(a, b) { return a < b ? a + '-' + b : b + '-' + a; }

  // Đọc danh sách cạnh "u v, u v, ..." → { edges, notes }
  function parseEdges(text, n) {
    var notes = [], edges = [], seen = {};
    var parts = String(text || '').split(/[,;\n]+/);
    parts.forEach(function (raw) {
      var p = raw.trim();
      if (!p) return;
      var nums = p.split(/[\s\-–]+/).filter(function (x) { return x !== ''; });
      if (nums.length !== 2 || !/^\d+$/.test(nums[0]) || !/^\d+$/.test(nums[1])) {
        notes.push('Bỏ qua “' + p + '”: mỗi cạnh phải là hai số u v.');
        return;
      }
      var u = parseInt(nums[0], 10), v = parseInt(nums[1], 10);
      if (u < 1 || u > n || v < 1 || v > n) { notes.push('Bỏ qua cạnh ' + u + ' ' + v + ': đỉnh phải từ 1 đến ' + n + '.'); return; }
      if (u === v) { notes.push('Bỏ qua khuyên ' + u + ' ' + v + '.'); return; }
      var k = ekey(u, v);
      if (seen[k]) { notes.push('Bỏ qua cạnh lặp ' + u + ' ' + v + '.'); return; }
      if (edges.length >= MAX_M) { notes.push('Chỉ dùng tối đa ' + MAX_M + ' cạnh.'); return; }
      seen[k] = true;
      edges.push([u, v]);
    });
    return { edges: edges, notes: notes };
  }

  // Mô phỏng DFS đệ quy, ghi lại ảnh chụp trạng thái sau mỗi sự kiện
  function simulate(n, edges, s) {
    var adj = [], i;
    for (i = 0; i <= n; i++) adj.push([]);
    edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    var status = [], parent = [], estate = {}, stack = [], order = [], comps = [], frames = [];
    for (i = 0; i <= n; i++) { status.push(0); parent.push(0); }

    function snap(cur, msg) {
      frames.push({
        status: status.slice(), estate: JSON.parse(JSON.stringify(estate)),
        stack: stack.slice(), order: order.slice(),
        comps: comps.map(function (c) { return c.slice(); }), cur: cur, msg: msg
      });
    }
    function clearActive() {
      Object.keys(estate).forEach(function (k) { if (estate[k] === 'is-active') estate[k] = 'is-ok'; });
    }
    function dfs(u, p) {
      status[u] = 1; parent[u] = p;
      stack.push(u); order.push(u); comps[comps.length - 1].push(u);
      snap(u, p ? 'Từ ' + p + ' đi sâu vào ' + u + ', đánh dấu visited[' + u + '] = 1. adj[' + u + '] = ' + (adj[u].join(', ') || 'rỗng') + '.'
                : 'Gọi dfs(' + u + '), đánh dấu visited[' + u + '] = 1. adj[' + u + '] = ' + (adj[u].join(', ') || 'rỗng') + '.');
      clearActive();
      for (var j = 0; j < adj[u].length; j++) {
        var v = adj[u][j];
        if (status[v] === 0) {
          estate[ekey(u, v)] = 'is-active';
          dfs(v, u);
          clearActive();
          snap(u, 'Quay lui về ' + u + ' sau khi dfs(' + v + ') xong.');
        } else if (v === p) {
          snap(u, 'Ở ' + u + ': đỉnh kề ' + v + ' là cha, bỏ qua.');
        } else if (status[v] === 1) {
          estate[ekey(u, v)] = 'is-bad';
          snap(u, 'Ở ' + u + ': đỉnh kề ' + v + ' đã thăm và không phải cha. Cạnh ' + u + '–' + v + ' là cạnh ngược, có chu trình!');
        } else {
          snap(u, 'Ở ' + u + ': đỉnh kề ' + v + ' đã thăm xong, bỏ qua.');
        }
      }
      status[u] = 2;
      stack.pop();
      snap(u, 'dfs(' + u + ') hết đỉnh kề, kết thúc.');
    }

    snap(0, 'Bắt đầu: mọi đỉnh chưa thăm, ngăn xếp trống.');
    var starts = [s];
    for (i = 1; i <= n; i++) if (i !== s) starts.push(i);
    starts.forEach(function (u) {
      if (status[u] !== 0) return;
      comps.push([]);
      dfs(u, 0);
    });
    snap(0, 'Xong: có ' + comps.length + ' thành phần liên thông.');
    return frames;
  }

  CP.mount('#viz-graph-dfs', function (root) {
    var inN = root.querySelector('#gdfs-n');
    var inE = root.querySelector('#gdfs-edges');
    var inS = root.querySelector('#gdfs-s');
    var stage = root.querySelector('[data-role="stage"]');
    var out = root.querySelector('[data-role="out"]');
    var btnPlay = root.querySelector('button[data-act="play"]');
    if (!inN || !inE || !inS || !stage || !out || !btnPlay) return;

    var n = 8, edges = [], frames = [], step = 0, notes = [], pos = [];
    var playing = false, runId = 0;

    function readInt(el, lo, hi, def, name) {
      var v = parseInt(String(el.value).trim(), 10);
      if (!isFinite(v)) { notes.push(name + ' không hợp lệ, dùng ' + def + '.'); el.value = String(def); return def; }
      if (v < lo || v > hi) {
        var c = Math.max(lo, Math.min(hi, v));
        notes.push(name + ' phải từ ' + lo + ' đến ' + hi + ', đã chỉnh về ' + c + '.');
        el.value = String(c);
        return c;
      }
      return v;
    }

    function setPlaying(on) {
      playing = on;
      runId++;
      btnPlay.textContent = on ? 'Dừng' : 'Tự chạy';
    }

    function draw() {
      var f = frames[step];
      stage.textContent = '';
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: String(W), role: 'img',
        'aria-label': 'Đồ thị ' + n + ' đỉnh, bước ' + step + ' trên ' + (frames.length - 1) });
      svg.setAttribute('class', 'gd-svg');
      svg.style.display = 'block';
      svg.style.maxWidth = '100%';
      svg.style.height = 'auto';
      svg.style.margin = '0.5rem auto';
      edges.forEach(function (e) {
        var c = f.estate[ekey(e[0], e[1])];
        svg.appendChild(svgEl('line', { 'class': 'edge' + (c ? ' ' + c : ''),
          x1: pos[e[0]][0], y1: pos[e[0]][1], x2: pos[e[1]][0], y2: pos[e[1]][1] }));
      });
      for (var u = 1; u <= n; u++) {
        var cls = 'node';
        if (u === f.cur && f.status[u] !== 2) cls += ' is-active';
        else if (f.status[u] === 1) cls += ' is-cmp';
        else if (f.status[u] === 2) cls += ' is-ok';
        svg.appendChild(svgEl('circle', { 'class': cls, cx: pos[u][0], cy: pos[u][1], r: 17 }));
        svg.appendChild(svgEl('text', { x: pos[u][0], y: pos[u][1] + 5, 'text-anchor': 'middle' }, String(u)));
      }
      stage.appendChild(svg);
    }

    function report() {
      var f = frames[step], lines = [];
      if (notes.length) { lines = lines.concat(notes); notes = []; }
      lines.push('Bước ' + step + ' / ' + (frames.length - 1) + ': ' + f.msg);
      var vis = [];
      for (var u = 1; u <= n; u++) vis.push(f.status[u] ? 1 : 0);
      lines.push('visited[1..' + n + '] = ' + vis.join(' '));
      lines.push('Ngăn xếp lời gọi: ' + (f.stack.length ? '[' + f.stack.join(', ') + ']' : 'trống'));
      lines.push('Thứ tự thăm: ' + (f.order.join(' ') || '—'));
      if (f.comps.length) {
        lines.push('Thành phần (' + f.comps.length + '): ' + f.comps.map(function (c) { return '{' + c.join(', ') + '}'; }).join('  '));
      }
      out.textContent = lines.join('\n');
    }

    function reset() {
      setPlaying(false);
      n = readInt(inN, 1, MAX_N, n, 'Số đỉnh n');
      inS.max = String(n);
      var s = readInt(inS, 1, n, Math.min(1, n), 'Đỉnh bắt đầu');
      var parsed = parseEdges(inE.value, n);
      notes = notes.concat(parsed.notes);
      edges = parsed.edges;
      pos = [null];
      for (var u = 1; u <= n; u++) {
        var a = -Math.PI / 2 + 2 * Math.PI * (u - 1) / n;
        pos.push([Math.round(CX + R * Math.cos(a)), Math.round(CY + R * Math.sin(a))]);
      }
      frames = simulate(n, edges, s);
      step = 0;
      draw();
      report();
    }

    function next() {
      if (step >= frames.length - 1) return false;
      step++;
      draw();
      report();
      return step < frames.length - 1;
    }

    function play() {
      if (playing) { setPlaying(false); return; }
      if (step >= frames.length - 1) reset();
      if (CP.reduceMotion) {            // không hoạt hình: nhảy thẳng tới cuối
        step = frames.length - 1;
        draw();
        report();
        return;
      }
      setPlaying(true);
      var my = runId;
      (function tick() {
        if (my !== runId) return;
        if (!next()) { setPlaying(false); return; }
        CP.sleep(700).then(tick);
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
    [inN, inE, inS].forEach(function (el) {
      el.addEventListener('change', reset);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });
    });

    reset();
  });
})();
