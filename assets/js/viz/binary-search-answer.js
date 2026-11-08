/* Widget "Chặt nhị phân trên kết quả": bài Cắt gỗ.
   Nhập chiều cao các cây và m; kéo thanh trượt để đặt lưỡi cưa ở độ cao H và xem lượng gỗ;
   chạy chặt nhị phân (dạng B: tìm H lớn nhất còn đủ gỗ) từng bước, tô dải check(H) và ghi bảng vết. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 10;
  var MAX_H = 40;
  var MAX_M = 100000;
  var SVGNS = 'http://www.w3.org/2000/svg';

  function parseHeights(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Chưa có cây nào. Hãy nhập vài chiều cao, cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Nhiều cây quá: tối đa ' + MAX_N + ' cây để hình vẽ vừa màn hình.' };
    var h = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\+?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên dương.' };
      var v = parseInt(parts[i], 10);
      if (!isFinite(v) || v < 1 || v > MAX_H) return { err: 'Mỗi chiều cao phải là số nguyên từ 1 đến ' + MAX_H + '.' };
      h.push(v);
    }
    return { h: h };
  }

  function wood(h, H) {
    var s = 0;
    for (var i = 0; i < h.length; i++) if (h[i] > H) s += h[i] - H;
    return s;
  }

  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, String(attrs[k]));
    if (text !== undefined) e.textContent = text;
    return e;
  }

  window.CP.mount('#viz-binary-search-answer', function (root) {
    var inH = root.querySelector('#bsa-h');
    var inM = root.querySelector('#bsa-m');
    var slider = root.querySelector('#bsa-slider');
    var view = root.querySelector('.bsa-view');
    var out = root.querySelector('.out');
    var btnLoad = root.querySelector('[data-act="load"]');
    var btnRand = root.querySelector('[data-act="rand"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnAll = root.querySelector('[data-act="all"]');
    var btnReset = root.querySelector('[data-act="reset"]');
    if (!inH || !inM || !slider || !view || !out) return;

    var st = null;   // dữ liệu + trạng thái chặt nhị phân
    var token = 0;   // huỷ hoạt hình cũ khi bấm nút khác

    /* ---------- vẽ ---------- */
    function drawTrees(H) {
      var W = 400, base = 196, top = 36, n = st.h.length;
      var maxH = st.maxH;
      var scale = (base - top) / maxH;
      var slot = 340 / n;
      var bw = Math.max(10, Math.min(50, slot * 0.62));
      var w = wood(st.h, H);
      var enough = w >= st.m;
      var svg = svgEl('svg', {
        viewBox: '0 0 ' + W + ' 236', width: W, role: 'img',
        'aria-label': 'Lưỡi cưa ở độ cao ' + H + ', thu được ' + w + ' mét gỗ, cần ' + st.m
      });
      svg.appendChild(svgEl('line', { 'class': 'edge', x1: 20, y1: base, x2: 380, y2: base }));
      var yCut = base - H * scale;
      for (var i = 0; i < n; i++) {
        var hi = st.h[i];
        var x = 24 + i * slot + (slot - bw) / 2;
        var yTop = base - hi * scale;
        var keep = Math.min(hi, H);
        var yKeep = base - keep * scale;
        svg.appendChild(svgEl('rect', {
          'class': 'fill-paper2', x: x.toFixed(1), y: yKeep.toFixed(1), width: bw.toFixed(1),
          height: (keep * scale).toFixed(1), stroke: 'currentColor', 'stroke-opacity': '.35'
        }));
        if (hi > H) {
          svg.appendChild(svgEl('rect', {
            'class': enough ? 'fill-ok' : 'fill-bad', x: x.toFixed(1), y: yTop.toFixed(1), width: bw.toFixed(1),
            height: ((hi - H) * scale).toFixed(1), stroke: 'currentColor', 'stroke-opacity': '.35'
          }));
          svg.appendChild(svgEl('text', { 'class': 'label-sm', x: (x + bw / 2).toFixed(1), y: (yTop - 6).toFixed(1), 'text-anchor': 'middle' }, '+' + (hi - H)));
        }
        svg.appendChild(svgEl('text', { x: (x + bw / 2).toFixed(1), y: base + 16, 'text-anchor': 'middle' }, String(hi)));
      }
      svg.appendChild(svgEl('line', {
        'class': 'stroke-pen', x1: 22, y1: yCut.toFixed(1), x2: 366, y2: yCut.toFixed(1),
        'stroke-width': '2.5', 'stroke-dasharray': '7 5'
      }));
      svg.appendChild(svgEl('text', { 'class': 'label-pen', x: 368, y: (yCut + 5).toFixed(1) }, 'H=' + H));
      var status = st.done ? 'xong · ans = ' + (st.ans < 0 ? 'không có' : st.ans)
        : 'lo = ' + st.lo + ' · hi = ' + st.hi + ' · ans = ' + (st.ans < 0 ? '—' : st.ans);
      svg.appendChild(svgEl('text', { 'class': 'label-sm', x: 20, y: 230 }, status));
      svg.appendChild(svgEl('text', { 'class': 'label-sm', x: 250, y: 230 }, 'gỗ = ' + w + (enough ? ' ≥ ' : ' < ') + st.m));
      var fig = document.createElement('figure');
      fig.className = 'diagram';
      fig.appendChild(svg);
      return fig;
    }

    function drawRow() {
      var row = document.createElement('div');
      row.className = 'arr';
      var lab = document.createElement('span');
      lab.className = 'arr-label';
      lab.textContent = 'check';
      row.appendChild(lab);
      for (var H = 0; H <= st.maxH; H++) {
        var c = document.createElement('span');
        var k = st.known[H];
        var cls = k === true ? 'is-ok' : k === false ? 'is-bad' : 'is-dim';
        var ptr = [];
        if (H === st.lastMid) { cls = 'is-active'; ptr.push('mid'); }
        if (!st.done) {
          if (H === st.lo) ptr.push('lo');
          if (H === st.hi) ptr.push('hi');
        } else if (H === st.ans) ptr.push('ans');
        c.className = 'cell ' + cls;
        c.setAttribute('data-i', String(H));
        if (ptr.length) c.setAttribute('data-ptr', ptr.join('/'));
        c.textContent = k === true ? 'Đ' : k === false ? 'S' : '?';
        row.appendChild(c);
      }
      return row;
    }

    function drawLog() {
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      var t = document.createElement('table');
      t.className = 'trace';
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      ['Lượt', 'lo', 'hi', 'mid', 'wood(mid)', 'check', 'ans'].forEach(function (s) {
        var th = document.createElement('th');
        th.textContent = s;
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      t.appendChild(thead);
      var tb = document.createElement('tbody');
      st.rows.forEach(function (r, i) {
        var tr = document.createElement('tr');
        if (i === st.rows.length - 1) tr.className = 'hl';
        r.forEach(function (v) {
          var td = document.createElement('td');
          td.textContent = String(v);
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      wrap.appendChild(t);
      return wrap;
    }

    function draw() {
      view.textContent = '';
      if (!st) return;
      var H = Number(slider.value);
      if (!isFinite(H)) H = 0;
      H = Math.max(0, Math.min(st.maxH, Math.round(H)));
      var body = document.createElement('div');
      body.className = 'viz-body';
      body.appendChild(drawTrees(H));
      body.appendChild(drawRow());
      view.appendChild(body);
      if (st.rows.length) view.appendChild(drawLog());
    }

    /* ---------- chặt nhị phân ---------- */
    function resetSearch() {
      st.lo = 0; st.hi = st.maxH; st.ans = -1; st.lastMid = -1; st.done = false; st.rows = [];
      st.known = [];
    }

    function load() {
      token++;
      var p = parseHeights(inH.value);
      if (p.err) { st = null; draw(); out.textContent = p.err; return false; }
      var m = Number(inM.value);
      if (inM.value === '' || !isFinite(m) || Math.floor(m) !== m || m < 1 || m > MAX_M) {
        st = null; draw();
        out.textContent = 'Hãy nhập m là số nguyên từ 1 đến ' + MAX_M + '.';
        return false;
      }
      var maxH = Math.max.apply(null, p.h);
      st = { h: p.h, m: m, maxH: maxH };
      resetSearch();
      slider.max = String(maxH);
      slider.min = '0';
      if (Number(slider.value) > maxH) slider.value = String(Math.floor(maxH / 2));
      draw();
      var total = wood(p.h, 0);
      out.textContent = 'Đã nạp ' + p.h.length + ' cây, cần m = ' + m + ' mét. Miền đáp án lo = 0, hi = ' + maxH +
        ' (cây cao nhất). Đặt sát đất thu được ' + total + ' mét' +
        (total < m ? ', vẫn chưa đủ: bài này không có đáp án.' : '.') +
        ' Kéo thanh trượt để thử, hoặc bấm Bước tiếp.';
      return true;
    }

    function finishText() {
      if (st.ans < 0) return 'Kết thúc: check chưa từng đúng, kể cả H = 0, nên không có cách đặt nào đủ ' + st.m + ' mét.';
      return 'Kết thúc sau ' + st.rows.length + ' lần gọi check (thay vì ' + (st.maxH + 1) + ' lần nếu thử hết). ' +
        'Đáp án H = ' + st.ans + ': thu được ' + wood(st.h, st.ans) + ' mét; nâng lên ' + (st.ans + 1) +
        ' chỉ còn ' + wood(st.h, st.ans + 1) + ' mét.';
    }

    function step() {
      if (!st) { if (!load()) return; }
      if (st.done) { out.textContent = finishText(); return; }
      var lo = st.lo, hi = st.hi;
      var mid = lo + Math.floor((hi - lo) / 2);
      var w = wood(st.h, mid);
      var ok = w >= st.m;
      var H;
      // Nhờ tính đơn điệu, một lần thử cho biết cả một dải.
      if (ok) { for (H = 0; H <= mid; H++) st.known[H] = true; st.ans = mid; st.lo = mid + 1; }
      else { for (H = mid; H <= st.maxH; H++) st.known[H] = false; st.hi = mid - 1; }
      st.lastMid = mid;
      st.rows.push([st.rows.length + 1, lo, hi, mid, w, ok ? 'đúng' : 'sai', st.ans < 0 ? '—' : st.ans]);
      if (st.lo > st.hi) st.done = true;
      slider.value = String(mid);
      draw();
      var msg = 'mid = ' + lo + ' + (' + hi + ' − ' + lo + ')/2 = ' + mid + '. wood(' + mid + ') = ' + w +
        (ok ? ' ≥ ' : ' < ') + st.m + ' nên check ' + (ok ? 'đúng' : 'sai') + '. ' +
        (ok ? 'Ghi ans = ' + mid + ', mọi H ≤ ' + mid + ' đều đủ gỗ, đặt lo = ' + st.lo + '.'
            : 'Mọi H ≥ ' + mid + ' đều thiếu gỗ, đặt hi = ' + st.hi + '.');
      out.textContent = st.done ? msg + ' ' + finishText() : msg;
    }

    function runAll() {
      if (!st) { if (!load()) return; }
      if (st.done) { resetSearch(); }
      var my = ++token;
      if (window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        var guard = 0;
        while (st && !st.done && guard++ < 64) step();
        return;
      }
      (function loop() {
        if (my !== token || !st) return;
        step();
        if (st && !st.done) window.CP.sleep(800).then(loop);
      })();
    }

    function randomize() {
      var n = 4 + Math.floor(Math.random() * 5);
      var h = [];
      for (var i = 0; i < n; i++) h.push(5 + Math.floor(Math.random() * 30));
      var total = wood(h, 0);
      inH.value = h.join(' ');
      inM.value = String(Math.max(1, Math.floor(total * (0.1 + Math.random() * 0.4))));
      load();
    }

    function onSlide() {
      if (!st) return;
      draw();
      var H = Math.max(0, Math.min(st.maxH, Math.round(Number(slider.value) || 0)));
      var w = wood(st.h, H);
      out.textContent = 'Đặt lưỡi cưa ở H = ' + H + ': thu được ' + w + ' mét gỗ, ' +
        (w >= st.m ? 'đủ ' + st.m + ' mét, check(' + H + ') đúng.' : 'chưa đủ ' + st.m + ' mét, check(' + H + ') sai.');
    }

    if (btnLoad) btnLoad.addEventListener('click', function () { load(); });
    if (btnRand) btnRand.addEventListener('click', randomize);
    if (btnStep) btnStep.addEventListener('click', function () { token++; step(); });
    if (btnAll) btnAll.addEventListener('click', runAll);
    if (btnReset) btnReset.addEventListener('click', function () {
      token++;
      if (!st) { load(); return; }
      resetSearch();
      draw();
      out.textContent = 'Đã làm lại: lo = 0, hi = ' + st.maxH + ', ans chưa có. Bấm Bước tiếp.';
    });
    slider.addEventListener('input', onSlide);
    inH.addEventListener('keydown', function (e) { if (e.key === 'Enter') load(); });
    inM.addEventListener('keydown', function (e) { if (e.key === 'Enter') load(); });
    load();
  });
})();
