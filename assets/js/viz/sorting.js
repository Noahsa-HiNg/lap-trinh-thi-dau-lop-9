/* Máy sắp xếp cho trang topics/sorting.html
   Chọn thuật toán (chọn, nổi bọt, chèn, trộn, nhanh), nhập hoặc sinh dãy,
   xem hoạt hình bằng biểu đồ cột .bars và bộ đếm số phép so sánh / đổi chỗ (ghi). */
(function () {
  'use strict';
  if (typeof window.CP === 'undefined') return;

  var MAXN = 16, MAXV = 99;
  var ALGOS = [
    { id: 'chon', name: 'Sắp xếp chọn', move: 'Đổi chỗ' },
    { id: 'noibot', name: 'Nổi bọt', move: 'Đổi chỗ' },
    { id: 'chen', name: 'Sắp xếp chèn', move: 'Dịch' },
    { id: 'tron', name: 'Sắp xếp trộn', move: 'Ghi' },
    { id: 'nhanh', name: 'Sắp xếp nhanh (chốt cuối)', move: 'Đổi chỗ' }
  ];

  /* Đọc dãy: lấy các số nguyên hợp lệ, kẹp vào [1, MAXV], tối đa MAXN số. */
  function parseList(raw) {
    var toks = String(raw || '').split(/[\s,;]+/).filter(function (t) { return t !== ''; });
    var vals = [], bad = 0;
    toks.forEach(function (t) {
      if (!/^-?\d+$/.test(t)) { bad++; return; }
      var v = parseInt(t, 10);
      if (v < 1 || v > MAXV) { bad++; v = Math.max(1, Math.min(MAXV, v)); }
      vals.push(v);
    });
    var note = '';
    if (bad) note += 'Đã bỏ qua hoặc chỉnh ' + bad + ' giá trị không hợp lệ (chỉ nhận số nguyên 1–' + MAXV + '). ';
    if (vals.length > MAXN) { vals = vals.slice(0, MAXN); note += 'Chỉ lấy ' + MAXN + ' số đầu. '; }
    if (vals.length < 2) { vals = [6, 3, 8, 2, 7, 1, 5, 4]; note += 'Cần ít nhất 2 số, dùng dãy mẫu. '; }
    return { vals: vals, note: note };
  }

  function randomList() {
    var n = 8 + Math.floor(Math.random() * 5), out = [];
    for (var i = 0; i < n; i++) out.push(1 + Math.floor(Math.random() * 30));
    return out;
  }

  /* Ghi lại toàn bộ quá trình thành danh sách khung hình. */
  function trace(algo, input) {
    var a = input.slice(), n = a.length, frames = [], cmp = 0, mv = 0, done = {};
    function snap(arr, hl, msg) {
      var cls = {};
      Object.keys(done).forEach(function (k) { cls[k] = 'is-ok'; });
      Object.keys(hl || {}).forEach(function (k) { cls[k] = hl[k]; });
      frames.push({ a: arr.slice(), cls: cls, msg: msg, cmp: cmp, mv: mv });
    }
    function sw(i, j) { var t = a[i]; a[i] = a[j]; a[j] = t; mv++; }
    function hl2(i, j, c) { var o = {}; o[i] = c; o[j] = c; return o; }

    snap(a, {}, 'Dãy ban đầu. Bấm “Bước” hoặc “Chạy”.');

    if (algo === 'chon') {
      for (var i = 0; i < n - 1; i++) {
        var p = i;
        for (var j = i + 1; j < n; j++) {
          cmp++;
          var h = hl2(j, p, 'is-cmp');
          if (a[j] < a[p]) { p = j; h[p] = 'is-active'; snap(a, h, 'a[' + j + '] = ' + a[j] + ' nhỏ hơn, nhớ vị trí nhỏ nhất p = ' + j + '.'); }
          else snap(a, h, 'So a[' + j + '] = ' + a[j] + ' với nhỏ nhất hiện tại ' + a[p] + '.');
        }
        if (p !== i) { sw(i, p); snap(a, hl2(i, p, 'is-active'), 'Đổi a[' + i + '] với a[' + p + ']: ' + a[i] + ' về đúng chỗ.'); }
        done[i] = 1;
        snap(a, {}, 'Lượt ' + i + ' xong: ô 0..' + i + ' đã đúng vị trí cuối cùng.');
      }
      done[n - 1] = 1;
    } else if (algo === 'noibot') {
      for (var k = 1; k < n; k++) {
        var doi = false;
        for (var j2 = 0; j2 < n - k; j2++) {
          cmp++;
          if (a[j2] > a[j2 + 1]) {
            snap(a, hl2(j2, j2 + 1, 'is-cmp'), a[j2] + ' > ' + a[j2 + 1] + ': sai thứ tự.');
            sw(j2, j2 + 1); doi = true;
            snap(a, hl2(j2, j2 + 1, 'is-active'), 'Đổi chỗ hai số kề nhau.');
          } else snap(a, hl2(j2, j2 + 1, 'is-cmp'), a[j2] + ' ≤ ' + a[j2 + 1] + ': giữ nguyên.');
        }
        done[n - k] = 1;
        if (!doi) {
          for (var q = 0; q < n; q++) done[q] = 1;
          snap(a, {}, 'Lượt ' + k + ' không đổi chỗ lần nào: dãy đã sắp, dừng sớm.');
          break;
        }
        snap(a, {}, 'Hết lượt ' + k + ': số lớn nhất còn lại đã nổi về ô ' + (n - k) + '.');
      }
      for (var q2 = 0; q2 < n; q2++) done[q2] = 1;
    } else if (algo === 'chen') {
      done[0] = 1;
      for (var i3 = 1; i3 < n; i3++) {
        var j3 = i3;
        snap(a, hl2(i3, i3, 'is-active'), 'Lượt i = ' + i3 + ': rút key = ' + a[i3] + '.');
        while (j3 > 0) {
          cmp++;
          if (a[j3 - 1] > a[j3]) {
            var hh = {}; hh[j3 - 1] = 'is-cmp'; hh[j3] = 'is-active';
            snap(a, hh, a[j3 - 1] + ' > ' + a[j3] + ': dịch ' + a[j3 - 1] + ' sang phải.');
            sw(j3 - 1, j3); j3--;
          } else {
            var hk = {}; hk[j3 - 1] = 'is-cmp'; hk[j3] = 'is-active';
            snap(a, hk, a[j3 - 1] + ' ≤ ' + a[j3] + ': dừng, key đã vào chỗ.');
            break;
          }
        }
        for (var q3 = 0; q3 <= i3; q3++) done[q3] = 1;
        snap(a, hl2(j3, j3, 'is-active'), 'Đoạn 0..' + i3 + ' đã sắp.');
      }
    } else if (algo === 'tron') {
      var ms = function (l, r) {
        if (l >= r) return;
        var m = Math.floor((l + r) / 2);
        ms(l, m); ms(m + 1, r);
        var L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1), out = [], i4 = 0, j4 = 0;
        var view = function () { return a.slice(0, l).concat(out, L.slice(i4), R.slice(j4), a.slice(r + 1)); };
        while (i4 < L.length && j4 < R.length) {
          cmp++;
          var pi = l + out.length, pj = l + out.length + (L.length - i4), hm = {};
          for (var t = l; t < l + out.length; t++) hm[t] = 'is-ok';
          hm[pi] = 'is-cmp'; hm[pj] = 'is-cmp';
          snap(view(), hm, 'Trộn [' + l + '..' + m + '] với [' + (m + 1) + '..' + r + ']: so ' + L[i4] + ' với ' + R[j4] + '.');
          if (L[i4] <= R[j4]) out.push(L[i4++]); else out.push(R[j4++]);
          mv++;
        }
        while (i4 < L.length) { out.push(L[i4++]); mv++; }
        while (j4 < R.length) { out.push(R[j4++]); mv++; }
        for (var t2 = 0; t2 < out.length; t2++) a[l + t2] = out[t2];
        var hd = {};
        for (var t3 = l; t3 <= r; t3++) hd[t3] = 'is-active';
        snap(a, hd, 'Đoạn [' + l + '..' + r + '] đã trộn xong.');
      };
      ms(0, n - 1);
      for (var q4 = 0; q4 < n; q4++) done[q4] = 1;
    } else if (algo === 'nhanh') {
      var qs = function (l, r) {
        if (l > r) return;
        if (l === r) { done[l] = 1; return; }
        var x = a[r], s = l;
        for (var j5 = l; j5 < r; j5++) {
          cmp++;
          var hq = {}; hq[r] = 'is-active'; hq[j5] = 'is-cmp';
          if (a[j5] < x) {
            snap(a, hq, a[j5] + ' < chốt ' + x + ': đưa sang trái.');
            if (s !== j5) sw(s, j5);
            s++;
          } else snap(a, hq, a[j5] + ' ≥ chốt ' + x + ': để bên phải.');
        }
        if (s !== r) sw(s, r);
        done[s] = 1;
        snap(a, {}, 'Chốt ' + x + ' về đúng vị trí ' + s + '; trái nhỏ hơn, phải không nhỏ hơn.');
        qs(l, s - 1); qs(s + 1, r);
      };
      qs(0, n - 1);
      for (var q5 = 0; q5 < n; q5++) done[q5] = 1;
    }
    snap(a, {}, 'Xong! Dãy đã sắp tăng dần.');
    return frames;
  }

  CP.mount('#viz-sorting', function (root) {
    var body = root.querySelector('.playground-body') || root;
    body.innerHTML = '';
    function mk(tag, attrs, text) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      return e;
    }

    var ctr = mk('div', { 'class': 'controls' });
    var lbA = mk('label', { 'for': 'sorting-algo' }, 'Thuật toán ');
    var sel = mk('select', { id: 'sorting-algo' });
    ALGOS.forEach(function (al) { sel.appendChild(mk('option', { value: al.id }, al.name)); });
    sel.value = 'chen';
    lbA.appendChild(sel);
    var lbI = mk('label', { 'for': 'sorting-input' }, 'Dãy ');
    var inp = mk('input', { type: 'text', id: 'sorting-input', value: '6 3 8 2 7 1 5 4', autocomplete: 'off', spellcheck: 'false' });
    lbI.appendChild(inp);
    var bRand = mk('button', { type: 'button', 'class': 'ghost' }, 'Sinh ngẫu nhiên');
    var bLoad = mk('button', { type: 'button', 'class': 'ghost' }, 'Nạp dãy');
    ctr.appendChild(lbA); ctr.appendChild(lbI); ctr.appendChild(bLoad); ctr.appendChild(bRand);

    var ctr2 = mk('div', { 'class': 'controls' });
    var bStep = mk('button', { type: 'button' }, 'Bước');
    var bRun = mk('button', { type: 'button' }, 'Chạy');
    var bEnd = mk('button', { type: 'button', 'class': 'ghost' }, 'Đến cuối');
    var bReset = mk('button', { type: 'button', 'class': 'ghost' }, 'Về đầu');
    ctr2.appendChild(bStep); ctr2.appendChild(bRun); ctr2.appendChild(bEnd); ctr2.appendChild(bReset);

    var barsBox = mk('div', { 'class': 'bars', role: 'img', 'aria-label': 'Biểu đồ cột của dãy đang sắp' });
    var legend = mk('div', { 'class': 'viz-legend' });
    [['is-cmp', 'đang so sánh'], ['is-active', 'vừa di chuyển / chốt / key'], ['is-ok', 'đã đúng chỗ']].forEach(function (p) {
      var s = mk('span'); s.appendChild(mk('i', { 'class': p[0] })); s.appendChild(document.createTextNode(p[1])); legend.appendChild(s);
    });
    var out = mk('div', { 'class': 'out', 'aria-live': 'polite' });

    body.appendChild(ctr); body.appendChild(ctr2); body.appendChild(barsBox); body.appendChild(legend); body.appendChild(out);

    var frames = [], pos = 0, runId = 0, running = false, note = '';

    function moveLabel() {
      for (var i = 0; i < ALGOS.length; i++) if (ALGOS[i].id === sel.value) return ALGOS[i].move;
      return 'Đổi chỗ';
    }

    function render() {
      var f = frames[pos];
      if (!f) return;
      var mx = Math.max.apply(null, f.a);
      barsBox.style.setProperty('--max', String(mx));
      while (barsBox.children.length > f.a.length) barsBox.removeChild(barsBox.lastChild);
      while (barsBox.children.length < f.a.length) barsBox.appendChild(mk('span', { 'class': 'bar' }));
      for (var i = 0; i < f.a.length; i++) {
        var b = barsBox.children[i];
        b.className = 'bar' + (f.cls[i] ? ' ' + f.cls[i] : '');
        b.style.setProperty('--v', String(f.a[i]));
        b.setAttribute('data-v', String(f.a[i]));
      }
      out.textContent = '';
      var line1 = mk('div');
      line1.appendChild(mk('strong', null, 'Bước ' + pos + '/' + (frames.length - 1) + '. '));
      line1.appendChild(document.createTextNode(f.msg));
      var line2 = mk('div', null, 'So sánh: ' + f.cmp + ' · ' + moveLabel() + ': ' + f.mv + ' · n = ' + f.a.length);
      out.appendChild(line1); out.appendChild(line2);
      if (note) out.appendChild(mk('div', null, note));
      bStep.disabled = pos >= frames.length - 1;
      bEnd.disabled = pos >= frames.length - 1;
    }

    function stop() { runId++; running = false; bRun.textContent = 'Chạy'; }

    function load() {
      stop();
      var r = parseList(inp.value);
      note = r.note;
      inp.value = r.vals.join(' ');
      frames = trace(sel.value, r.vals);
      pos = 0;
      render();
    }

    function run() {
      if (running) { stop(); return; }
      if (pos >= frames.length - 1) pos = 0;
      if (CP.reduceMotion || typeof CP.sleep !== 'function') { pos = frames.length - 1; render(); return; }
      running = true; bRun.textContent = 'Dừng';
      var my = ++runId;
      var delay = frames.length > 150 ? 120 : 320;
      (function tick() {
        if (my !== runId) return;
        if (pos >= frames.length - 1) { stop(); render(); return; }
        pos++; render();
        CP.sleep(delay).then(tick);
      })();
    }

    bStep.addEventListener('click', function () { stop(); if (pos < frames.length - 1) { pos++; render(); } });
    bRun.addEventListener('click', run);
    bEnd.addEventListener('click', function () { stop(); pos = frames.length - 1; render(); });
    bReset.addEventListener('click', function () { stop(); pos = 0; render(); });
    bLoad.addEventListener('click', load);
    bRand.addEventListener('click', function () { inp.value = randomList().join(' '); load(); });
    sel.addEventListener('change', load);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); load(); } });

    load();
  });
})();
