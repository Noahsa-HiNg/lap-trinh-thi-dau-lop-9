/* Widget "Ngăn xếp từng bước": (1) kiểm tra dãy ngoặc nhiều loại, báo sai tại vị trí nào;
   (2) ngăn xếp đơn điệu tìm phần tử lớn hơn gần nhất bên phải. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_LEN = 30;   // độ dài xâu ngoặc tối đa
  var MAX_N = 12;     // số phần tử dãy tối đa
  var MAX_V = 99;     // giá trị tối đa (để vẽ cột)
  var OPEN = { '(': ')', '[': ']', '{': '}' };
  var CLOSE = { ')': '(', ']': '[', '}': '{' };
  var DEFAULTS = { br: '([]{()})', ng: '2 7 3 5 4 6 1' };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function row(label) {
    var d = el('div', 'arr');
    d.appendChild(el('span', 'arr-label', label));
    return d;
  }

  function cell(text, idx, cls, ptr) {
    var s = el('span', 'cell' + (cls ? ' ' + cls : ''), text);
    if (idx != null) s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    return s;
  }

  /* ---------- Bài 1: dãy ngoặc ---------- */
  function parseBrackets(str) {
    var s = String(str || '').replace(/\s+/g, '');
    if (!s.length) return { err: 'Xâu đang trống. Hãy nhập các ký tự ( ) [ ] { }.' };
    if (s.length > MAX_LEN) return { err: 'Xâu dài quá: tối đa ' + MAX_LEN + ' ký tự để hình vẽ vừa màn hình.' };
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (!OPEN[c] && !CLOSE[c]) return { err: 'Ký tự "' + c + '" ở vị trí ' + (i + 1) + ' không phải dấu ngoặc. Chỉ dùng ( ) [ ] { }.' };
    }
    return { s: s };
  }

  function bracketSteps(s) {
    var steps = [];
    var st = [];
    var matched = {};
    function snap(i, msg, extra) {
      var o = { i: i, st: st.slice(), matched: Object.assign({}, matched), msg: msg };
      if (extra) { for (var k in extra) o[k] = extra[k]; }
      steps.push(o);
    }
    snap(-1, 'Bắt đầu: ngăn xếp rỗng. Bấm "Bước tiếp" để đọc ký tự đầu tiên.');
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (OPEN[c]) {
        st.push(i);
        snap(i, 'Vị trí ' + (i + 1) + ': "' + c + '" là ngoặc mở, đẩy vào ngăn xếp (' + st.length + ' phần tử).');
      } else if (!st.length) {
        snap(i, 'Vị trí ' + (i + 1) + ': gặp "' + c + '" nhưng ngăn xếp rỗng, không có ngoặc mở nào để ghép.\nKết luận: SAI tại vị trí ' + (i + 1) + ' (thừa ngoặc đóng).', { bad: i, end: true });
        return steps;
      } else if (s.charAt(st[st.length - 1]) !== CLOSE[c]) {
        var t = st[st.length - 1];
        snap(i, 'Vị trí ' + (i + 1) + ': gặp "' + c + '" nhưng đỉnh là "' + s.charAt(t) + '" (vị trí ' + (t + 1) + '), khác loại.\nKết luận: SAI tại vị trí ' + (i + 1) + ' (ngoặc bắt chéo hoặc sai loại).', { bad: i, badTop: true, end: true });
        return steps;
      } else {
        var j = st.pop();
        matched[i] = true; matched[j] = true;
        snap(i, 'Vị trí ' + (i + 1) + ': "' + c + '" khớp với "' + s.charAt(j) + '" ở đỉnh (vị trí ' + (j + 1) + '). Bỏ đỉnh, ghép cặp (' + (j + 1) + ', ' + (i + 1) + ').');
      }
    }
    if (st.length) {
      var top = st[st.length - 1];
      snap(s.length, 'Hết xâu nhưng ngăn xếp còn ' + st.length + ' ngoặc mở chưa được đóng.\nKết luận: SAI, ngoặc mở ở vị trí ' + (top + 1) + ' thiếu ngoặc đóng.', { bad: top, end: true });
    } else {
      snap(s.length, 'Hết xâu và ngăn xếp rỗng: mọi ngoặc đều có cặp.\nKết luận: ĐÚNG, đây là dãy ngoặc đúng.', { ok: true, end: true });
    }
    return steps;
  }

  function drawBrackets(view, s, step) {
    var r1 = row('s');
    for (var i = 0; i < s.length; i++) {
      var cls = '';
      var ptr = null;
      if (step.bad === i) { cls = 'is-bad'; ptr = 'lỗi'; }
      else if (step.matched[i]) cls = 'is-ok';
      else if (i === step.i) cls = 'is-active';
      else if (i > step.i) cls = 'is-dim';
      if (i === step.i && !ptr) ptr = 'i';
      r1.appendChild(cell(s.charAt(i), i + 1, cls, ptr));
    }
    var r2 = row('Ngăn xếp');
    if (!step.st.length) r2.appendChild(cell('rỗng', null, 'is-dim'));
    for (var k = 0; k < step.st.length; k++) {
      var last = k === step.st.length - 1;
      var c2 = '';
      if (last && step.badTop) c2 = 'is-bad';
      else if (last && step.bad === step.st[k]) c2 = 'is-bad';
      else if (last) c2 = 'is-cmp';
      r2.appendChild(cell(s.charAt(step.st[k]), step.st[k] + 1, c2, last ? 'đỉnh' : null));
    }
    view.appendChild(r1);
    view.appendChild(r2);
  }

  /* ---------- Bài 2: lớn hơn gần nhất bên phải ---------- */
  function parseNumbers(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (!parts.length) return { err: 'Dãy đang trống. Hãy nhập vài số nguyên từ 0 đến ' + MAX_V + ', cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Dãy dài quá: tối đa ' + MAX_N + ' số.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên không âm.' };
      var v = parseInt(parts[i], 10);
      if (v > MAX_V) return { err: 'Mỗi số cần nằm trong khoảng 0 đến ' + MAX_V + ' để vẽ cột.' };
      a.push(v);
    }
    return { a: a };
  }

  function greaterSteps(a) {
    var n = a.length;
    var steps = [];
    var st = [];
    var ans = [];
    for (var z = 0; z < n; z++) ans.push(null);
    var pops = 0;
    steps.push({ i: -1, st: [], ans: ans.slice(), popped: [], msg: 'Bắt đầu: ngăn xếp rỗng, chưa ai có đáp án.' });
    for (var i = 0; i < n; i++) {
      var popped = [];
      while (st.length && a[st[st.length - 1]] < a[i]) {
        var j = st.pop();
        ans[j] = a[i];
        popped.push(j);
        pops++;
      }
      st.push(i);
      var msg = 'i = ' + i + ', a[i] = ' + a[i] + ': ';
      if (popped.length) {
        msg += popped.map(function (j) { return 'a[' + j + '] = ' + a[j] + ' < ' + a[i] + ' nên ans[' + j + '] = ' + a[i]; }).join('; ');
        msg += '. ';
      } else {
        msg += 'không ai được bỏ ra. ';
      }
      msg += (st.length > 1 ? 'Dừng vì đỉnh ' + a[st[st.length - 2]] + ' ≥ ' + a[i] + '. ' : 'Ngăn xếp trống trước khi đẩy. ') + 'Đẩy ' + a[i] + ' vào.';
      steps.push({ i: i, st: st.slice(), ans: ans.slice(), popped: popped, msg: msg });
    }
    var fin = ans.map(function (x) { return x === null ? -1 : x; });
    steps.push({
      i: n, st: st.slice(), ans: fin, popped: [], end: true,
      msg: 'Hết dãy. ' + (st.length ? 'Các phần tử còn trong ngăn xếp (' + st.map(function (j) { return a[j]; }).join(', ') + ') không có ai lớn hơn bên phải: ans = -1.\n' : '') +
        'Kết quả: ' + fin.join(' ') + '\nTổng: ' + n + ' lần đẩy vào, ' + pops + ' lần lấy ra (luôn ≤ n).'
    });
    return steps;
  }

  function drawGreater(view, a, step) {
    var maxV = 1;
    for (var t = 0; t < a.length; t++) if (a[t] > maxV) maxV = a[t];
    var bars = el('div', 'bars');
    bars.style.setProperty('--max', String(maxV));
    var inSt = {};
    step.st.forEach(function (j) { inSt[j] = true; });
    var pop = {};
    step.popped.forEach(function (j) { pop[j] = true; });
    for (var i = 0; i < a.length; i++) {
      var cls = 'bar';
      if (i === step.i) cls += ' is-active';
      else if (pop[i]) cls += ' is-ok';
      else if (inSt[i]) cls += ' is-cmp';
      else if (i < step.i) cls += ' is-dim';
      var b = el('span', cls);
      b.style.setProperty('--v', String(a[i]));
      b.setAttribute('data-v', String(a[i]));
      bars.appendChild(b);
    }
    var r2 = row('Ngăn xếp');
    if (!step.st.length) r2.appendChild(cell('rỗng', null, 'is-dim'));
    step.st.forEach(function (j, k) {
      var last = k === step.st.length - 1;
      r2.appendChild(cell(String(a[j]), j, 'is-cmp', last ? 'đỉnh' : null));
    });
    var r3 = row('ans');
    step.ans.forEach(function (x, j) {
      r3.appendChild(cell(x === null ? '?' : String(x), j, x === null ? 'is-dim' : (pop[j] ? 'is-ok' : '')));
    });
    view.appendChild(bars);
    view.appendChild(r2);
    view.appendChild(r3);
  }

  /* ---------- Ví dụ ngẫu nhiên ---------- */
  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

  function randomBrackets() {
    var pairs = ['()', '[]', '{}'];
    var len = randInt(3, 6);
    var s = '';
    var st = [];
    for (var i = 0; i < len * 2; i++) {
      if (st.length && (Math.random() < 0.5 || st.length + i >= len * 2)) s += pairs[st.pop()].charAt(1);
      else if (i < len * 2) { var k = randInt(0, 2); st.push(k); s += pairs[k].charAt(0); }
    }
    while (st.length) s += pairs[st.pop()].charAt(1);
    // một nửa số lần: làm hỏng xâu để thấy báo lỗi
    if (Math.random() < 0.5 && s.length > 1) {
      var p = randInt(0, s.length - 1);
      var all = '()[]{}';
      var c;
      do { c = all.charAt(randInt(0, 5)); } while (c === s.charAt(p));
      s = s.slice(0, p) + c + s.slice(p + 1);
    }
    return s;
  }

  function randomNumbers() {
    var n = randInt(6, 9);
    var a = [];
    for (var i = 0; i < n; i++) a.push(randInt(1, 9));
    return a.join(' ');
  }

  window.CP.mount('#viz-stack-queue', function (root) {
    var mode = root.querySelector('#sq-mode');
    var inp = root.querySelector('#sq-input');
    var view = root.querySelector('.sq-view');
    var out = root.querySelector('.out');
    var bStart = root.querySelector('[data-act="start"]');
    var bNext = root.querySelector('[data-act="next"]');
    var bAll = root.querySelector('[data-act="all"]');
    var bRand = root.querySelector('[data-act="rand"]');
    if (!mode || !inp || !view || !out || !bNext) return;

    var st = null;   // { mode, src, data, steps, pos }
    var token = 0;

    function render() {
      view.textContent = '';
      if (!st) return;
      var step = st.steps[st.pos];
      if (st.mode === 'br') drawBrackets(view, st.data, step);
      else drawGreater(view, st.data, step);
      out.textContent = 'Bước ' + st.pos + '/' + (st.steps.length - 1) + '. ' + step.msg;
    }

    function build() {
      token++;
      var m = mode.value === 'ng' ? 'ng' : 'br';
      var p = m === 'br' ? parseBrackets(inp.value) : parseNumbers(inp.value);
      if (p.err) {
        st = null;
        view.textContent = '';
        out.textContent = p.err;
        return false;
      }
      var data = m === 'br' ? p.s : p.a;
      st = { mode: m, src: inp.value, data: data, steps: m === 'br' ? bracketSteps(data) : greaterSteps(data), pos: 0 };
      render();
      return true;
    }

    function ensure() {
      var m = mode.value === 'ng' ? 'ng' : 'br';
      if (!st || st.src !== inp.value || st.mode !== m) return build();
      return true;
    }

    function next() {
      token++;
      if (!ensure()) return;
      if (st.pos < st.steps.length - 1) st.pos++;
      render();
    }

    function runAll() {
      token++;
      if (!ensure()) return;
      var my = token;
      if (window.CP.reduceMotion || typeof window.CP.sleep !== 'function') {
        st.pos = st.steps.length - 1;
        render();
        return;
      }
      (function step() {
        if (my !== token || !st) return;
        if (st.pos >= st.steps.length - 1) { render(); return; }
        st.pos++;
        render();
        window.CP.sleep(450).then(step);
      })();
    }

    mode.addEventListener('change', function () {
      inp.value = DEFAULTS[mode.value === 'ng' ? 'ng' : 'br'];
      build();
    });
    if (bStart) bStart.addEventListener('click', build);
    bNext.addEventListener('click', next);
    if (bAll) bAll.addEventListener('click', runAll);
    if (bRand) bRand.addEventListener('click', function () {
      inp.value = mode.value === 'ng' ? randomNumbers() : randomBrackets();
      build();
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); build(); }
    });

    build();
  });
})();
