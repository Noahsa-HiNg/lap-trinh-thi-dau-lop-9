/* Widget: rừng DSU theo lệnh của người học (union a b / find a / same a b), n ≤ 12.
   Bật/tắt hợp theo kích thước và nén đường để so sánh chiều cao cây, số bước find.
   Gắn vào #viz-dsu-mst trong topics/dsu-mst.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP) return;

  var CP = window.CP;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var MAX_N = 12, MAX_CMD = 60, XS = 50, YS = 58, TOP = 28, R = 16;
  var CHAIN = 'union 1 2, union 1 3, union 1 4, union 1 5, union 1 6, union 1 7, union 1 8, find 1, find 2';

  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function htmlEl(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Đọc chuỗi lệnh → { cmds: [{op, a, b}], notes }
  function parseCmds(text, n) {
    var notes = [], cmds = [];
    var names = { union: 'union', u: 'union', find: 'find', f: 'find', same: 'same', s: 'same' };
    String(text || '').split(/[,;\n]+/).forEach(function (raw) {
      var p = raw.trim();
      if (!p) return;
      var t = p.toLowerCase().split(/\s+/);
      var op = names[t[0]];
      if (!op) { notes.push('Bỏ qua “' + p + '”: lệnh phải là union, find hoặc same.'); return; }
      var need = op === 'find' ? 1 : 2;
      if (t.length !== need + 1) { notes.push('Bỏ qua “' + p + '”: ' + op + ' cần ' + need + ' số.'); return; }
      var nums = [];
      for (var i = 1; i <= need; i++) {
        if (!/^\d+$/.test(t[i])) { notes.push('Bỏ qua “' + p + '”: “' + t[i] + '” không phải số nguyên dương.'); return; }
        var v = parseInt(t[i], 10);
        if (v < 1 || v > n) { notes.push('Bỏ qua “' + p + '”: phần tử phải từ 1 đến ' + n + '.'); return; }
        nums.push(v);
      }
      if (cmds.length >= MAX_CMD) { notes.push('Chỉ dùng tối đa ' + MAX_CMD + ' lệnh.'); return; }
      cmds.push({ op: op, a: nums[0], b: nums[1] || 0 });
    });
    return { cmds: cmds, notes: notes };
  }

  CP.mount('#viz-dsu-mst', function (root) {
    var inN = root.querySelector('#dsu-n');
    var inC = root.querySelector('#dsu-cmds');
    var cbSize = root.querySelector('#dsu-size');
    var cbComp = root.querySelector('#dsu-comp');
    var stage = root.querySelector('[data-role="stage"]');
    var out = root.querySelector('[data-role="out"]');
    var btnAll = root.querySelector('button[data-act="all"]');
    if (!inN || !inC || !cbSize || !cbComp || !stage || !out || !btnAll) return;

    var n = 8, cmds = [], idx = 0, notes = [];
    var parent = [], sz = [], steps = 0, msg = '';
    var hl = { active: {}, path: {}, changed: {} };
    var playing = false, runId = 0;

    function readN() {
      var v = parseInt(String(inN.value).trim(), 10);
      if (!isFinite(v)) { notes.push('Số phần tử không hợp lệ, dùng ' + n + '.'); inN.value = String(n); return n; }
      if (v < 1 || v > MAX_N) {
        var c = Math.max(1, Math.min(MAX_N, v));
        notes.push('n phải từ 1 đến ' + MAX_N + ', đã chỉnh về ' + c + '.');
        inN.value = String(c);
        return c;
      }
      return v;
    }

    function setPlaying(on) {
      playing = on;
      runId++;
      btnAll.textContent = on ? 'Dừng' : 'Chạy hết';
    }

    // find có (hoặc không) nén đường; ghi lại đường đi để tô màu
    function find(x) {
      var path = [x], r = x;
      while (parent[r] !== r) { r = parent[r]; path.push(r); }
      steps += path.length - 1;
      path.forEach(function (v) { hl.path[v] = true; });
      if (cbComp.checked) {
        for (var i = 0; i < path.length - 1; i++) {
          var v = path[i];
          if (parent[v] !== r) { parent[v] = r; hl.changed[v] = true; }
        }
      }
      return { root: r, len: path.length - 1, path: path };
    }

    function pathText(f) { return f.path.join(' → '); }

    function apply(c) {
      hl = { active: {}, path: {}, changed: {} };
      var fa, fb;
      if (c.op === 'find') {
        fa = find(c.a);
        hl.active[c.a] = true;
        msg = 'find(' + c.a + '): ' + pathText(fa) + ', gốc là ' + fa.root + ' (' + fa.len + ' bước).' +
          (cbComp.checked && Object.keys(hl.changed).length ? ' Nén đường: các nút ' + Object.keys(hl.changed).join(', ') + ' giờ trỏ thẳng vào ' + fa.root + '.' : '');
        return;
      }
      fa = find(c.a);
      fb = find(c.b);
      hl.active[c.a] = true; hl.active[c.b] = true;
      if (c.op === 'same') {
        msg = 'same(' + c.a + ', ' + c.b + '): find(' + c.a + ') = ' + fa.root + ', find(' + c.b + ') = ' + fb.root +
          (fa.root === fb.root ? ' → CÙNG nhóm.' : ' → KHÁC nhóm.');
        return;
      }
      var ra = fa.root, rb = fb.root;
      if (ra === rb) {
        msg = 'union(' + c.a + ', ' + c.b + '): cùng gốc ' + ra + ', đã cùng nhóm, không gộp (cạnh này tạo chu trình).';
        return;
      }
      if (cbSize.checked) {
        if (sz[ra] < sz[rb]) { var t = ra; ra = rb; rb = t; }
        parent[rb] = ra; sz[ra] += sz[rb];
        hl.changed[rb] = true;
        msg = 'union(' + c.a + ', ' + c.b + '): hai gốc ' + fa.root + ', ' + fb.root + '. Treo cây nhỏ (gốc ' + rb + ', ' + sz[rb] +
          ' nút) vào cây lớn (gốc ' + ra + '). parent[' + rb + '] = ' + ra + ', sz[' + ra + '] = ' + sz[ra] + '.';
      } else {
        parent[ra] = rb; sz[rb] += sz[ra];
        hl.changed[ra] = true;
        msg = 'union(' + c.a + ', ' + c.b + '): gộp bừa, treo gốc ' + ra + ' vào gốc ' + rb + '. parent[' + ra + '] = ' + rb + '.';
      }
    }

    function depthOf(v) {
      var d = 0;
      while (parent[v] !== v && d <= n) { v = parent[v]; d++; }
      return d;
    }

    function draw() {
      var ch = [], roots = [], u;
      for (u = 0; u <= n; u++) ch.push([]);
      for (u = 1; u <= n; u++) { if (parent[u] === u) roots.push(u); else ch[parent[u]].push(u); }
      var pos = {}, cur = 0, maxD = 0;
      function place(v, d) {
        if (d > maxD) maxD = d;
        if (!ch[v].length) { pos[v] = [cur, d]; cur++; return; }
        ch[v].forEach(function (c) { place(c, d + 1); });
        var xs = ch[v].map(function (c) { return pos[c][0]; });
        pos[v] = [(Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, d];
      }
      roots.forEach(function (r) { place(r, 0); });
      var W = Math.max(360, cur * XS + 20), H = TOP * 2 + maxD * YS;
      var off = (W - cur * XS) / 2 + XS / 2;
      function P(v) { return [off + pos[v][0] * XS, TOP + pos[v][1] * YS]; }

      stage.textContent = '';
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: String(W), role: 'img',
        'aria-label': 'Rừng DSU ' + n + ' phần tử, ' + roots.length + ' nhóm' });
      svg.setAttribute('class', 'dsu-svg');
      var defs = svgEl('defs', {});
      var mk = svgEl('marker', { id: 'dsu-w-arrow', viewBox: '0 0 10 10', refX: '9', refY: '5',
        markerUnits: 'userSpaceOnUse', markerWidth: '10', markerHeight: '10', orient: 'auto' });
      var tip = svgEl('path', { d: 'M0,0 L10,5 L0,10 z' });
      tip.style.fill = 'var(--ink-3)';
      mk.appendChild(tip); defs.appendChild(mk); svg.appendChild(defs);
      for (u = 1; u <= n; u++) {
        if (parent[u] === u) continue;
        var a = P(u), b = P(parent[u]);
        var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
        svg.appendChild(svgEl('line', {
          'class': 'edge' + (hl.changed[u] ? ' is-active' : ''),
          x1: (a[0] + dx / L * R).toFixed(1), y1: (a[1] + dy / L * R).toFixed(1),
          x2: (b[0] - dx / L * (R + 2)).toFixed(1), y2: (b[1] - dy / L * (R + 2)).toFixed(1),
          'marker-end': 'url(#dsu-w-arrow)' }));
      }
      for (u = 1; u <= n; u++) {
        var p = P(u), cls = 'node';
        if (hl.changed[u] || hl.active[u]) cls += ' is-active';
        else if (hl.path[u]) cls += ' is-cmp';
        else if (parent[u] === u) cls += ' is-ok';
        svg.appendChild(svgEl('circle', { 'class': cls, cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: R }));
        svg.appendChild(svgEl('text', { x: p[0].toFixed(1), y: (p[1] + 5).toFixed(1), 'text-anchor': 'middle' }, String(u)));
      }
      stage.appendChild(svg);

      var ap = htmlEl('div', 'arr'), as = htmlEl('div', 'arr');
      ap.appendChild(htmlEl('span', 'arr-label', 'parent'));
      as.appendChild(htmlEl('span', 'arr-label', 'sz'));
      for (u = 1; u <= n; u++) {
        var c1 = htmlEl('span', 'cell' + (hl.changed[u] ? ' is-active' : (parent[u] === u ? ' is-ok' : '')), String(parent[u]));
        c1.setAttribute('data-i', String(u));
        ap.appendChild(c1);
        as.appendChild(parent[u] === u ? htmlEl('span', 'cell', String(sz[u])) : htmlEl('span', 'cell is-dim', '·'));
      }
      stage.appendChild(ap);
      stage.appendChild(as);
    }

    function report() {
      var lines = [];
      if (notes.length) { lines = lines.concat(notes); notes = []; }
      lines.push('Lệnh ' + idx + ' / ' + cmds.length + ': ' + (msg || 'chưa chạy lệnh nào.'));
      var groups = 0, h = 0;
      for (var u = 1; u <= n; u++) { if (parent[u] === u) groups++; h = Math.max(h, depthOf(u)); }
      lines.push('Số nhóm: ' + groups + '   Cây cao nhất: ' + h + ' tầng   Tổng số bước find: ' + steps);
      lines.push('Chế độ: ' + (cbSize.checked ? 'hợp theo kích thước' : 'gộp bừa') + ', ' +
        (cbComp.checked ? 'có nén đường' : 'không nén đường') + '.');
      if (idx >= cmds.length && cmds.length) lines.push('Đã chạy hết các lệnh.');
      out.textContent = lines.join('\n');
    }

    function reset() {
      setPlaying(false);
      n = readN();
      var parsed = parseCmds(inC.value, n);
      notes = notes.concat(parsed.notes);
      cmds = parsed.cmds;
      parent = []; sz = [];
      for (var i = 0; i <= n; i++) { parent.push(i); sz.push(1); }
      idx = 0; steps = 0; msg = '';
      hl = { active: {}, path: {}, changed: {} };
      draw();
      report();
    }

    function next() {
      if (idx >= cmds.length) return false;
      apply(cmds[idx]);
      idx++;
      draw();
      report();
      return idx < cmds.length;
    }

    function runAll() {
      if (playing) { setPlaying(false); return; }
      if (idx >= cmds.length) reset();
      if (CP.reduceMotion) {             // không hoạt hình: chạy thẳng tới cuối
        while (next()) { /* tiếp tục */ }
        return;
      }
      setPlaying(true);
      var my = runId;
      (function tick() {
        if (my !== runId) return;
        if (!next()) { setPlaying(false); return; }
        CP.sleep(650).then(tick);
      })();
    }

    root.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-act');
      if (act === 'reset') reset();
      else if (act === 'step') { setPlaying(false); next(); }
      else if (act === 'all') runAll();
      else if (act === 'chain') {
        inN.value = '8';
        inC.value = CHAIN;
        cbSize.checked = false;
        cbComp.checked = false;
        reset();
      }
    });
    [inN, inC].forEach(function (el) {
      el.addEventListener('change', reset);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });
    });
    [cbSize, cbComp].forEach(function (el) { el.addEventListener('change', reset); });

    reset();
  });
})();
