/* Widget "Mảng cộng dồn": nhập dãy, chọn l, r -> tô đoạn, tô S[r], S[l-1], hiện phép trừ. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 12;
  var MAX_ABS = 1e9;

  function cell(text, idx, cls, ptr) {
    var s = document.createElement('span');
    s.className = 'cell' + (cls ? ' ' + cls : '');
    s.setAttribute('data-i', String(idx));
    if (ptr) s.setAttribute('data-ptr', ptr);
    s.textContent = text;
    return s;
  }

  function row(label) {
    var d = document.createElement('div');
    d.className = 'arr';
    var lb = document.createElement('span');
    lb.className = 'arr-label';
    lb.textContent = label;
    d.appendChild(lb);
    return d;
  }

  function parseArray(str) {
    var parts = String(str || '').trim().split(/[\s,;]+/).filter(function (t) { return t.length > 0; });
    if (parts.length === 0) return { err: 'Dãy đang trống. Hãy nhập vài số nguyên, cách nhau bởi dấu cách.' };
    if (parts.length > MAX_N) return { err: 'Dãy dài quá: tối đa ' + MAX_N + ' số để hình vẽ vừa màn hình.' };
    var a = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^[+-]?\d+$/.test(parts[i])) return { err: '"' + parts[i] + '" không phải số nguyên.' };
      var v = parseInt(parts[i], 10);
      if (Math.abs(v) > MAX_ABS) return { err: 'Mỗi số cần có trị tuyệt đối không quá 10^9.' };
      a.push(v);
    }
    return { a: a };
  }

  function fmt(v) { return v < 0 ? '(' + v + ')' : String(v); }

  window.CP.mount('#viz-prefix-sum', function (root) {
    var inp = root.querySelector('#ps-input');
    var inL = root.querySelector('#ps-l');
    var inR = root.querySelector('#ps-r');
    var view = root.querySelector('.ps-view');
    var out = root.querySelector('.out');
    var btnRun = root.querySelector('[data-act="run"]');
    var btnRand = root.querySelector('[data-act="rand"]');
    if (!inp || !inL || !inR || !view || !out || !btnRun) return;

    var token = 0; // huỷ hoạt hình cũ khi bấm lại

    function draw(a, S, upto, l, r) {
      view.textContent = '';
      var n = a.length;
      var ra = row('a');
      ra.appendChild(cell('·', 0, 'is-dim'));
      for (var i = 1; i <= n; i++) {
        var c = '';
        if (l !== null) c = (i >= l && i <= r) ? 'is-active' : 'is-dim';
        else if (i === upto) c = 'is-active';
        ra.appendChild(cell(String(a[i - 1]), i, c));
      }
      var rs = row('S');
      for (var j = 0; j <= n; j++) {
        var cls = '', ptr = '', txt = j <= upto ? String(S[j]) : '?';
        if (l !== null) {
          if (j === r) { cls = 'is-ok'; ptr = 'S[r]'; }
          else if (j === l - 1) { cls = 'is-bad'; ptr = 'S[l−1]'; }
          else cls = 'is-dim';
        } else if (j > upto) cls = 'is-dim';
        else if (j === upto) cls = 'is-active';
        else if (j === upto - 1) cls = 'is-cmp';
        rs.appendChild(cell(txt, j, cls, ptr));
      }
      view.appendChild(ra);
      view.appendChild(rs);
    }

    function run(noAnim) {
      var my = ++token;
      var p = parseArray(inp.value);
      if (p.err) { view.textContent = ''; out.textContent = p.err; return; }
      var a = p.a, n = a.length;
      var l = parseInt(inL.value, 10), r = parseInt(inR.value, 10);
      if (!isFinite(l) || !isFinite(r)) { out.textContent = 'Hãy nhập l và r là số nguyên.'; return; }
      if (l < 1 || r > n || l > r) {
        out.textContent = 'Cần 1 ≤ l ≤ r ≤ ' + n + ' (dãy có ' + n + ' phần tử).';
        return;
      }
      var S = [0];
      for (var i = 1; i <= n; i++) S.push(S[i - 1] + a[i - 1]);

      var fin = function () {
        if (my !== token) return;
        draw(a, S, n, l, r);
        var terms = a.slice(l - 1, r).map(fmt).join(' + ');
        out.textContent =
          'S = (' + S.join(', ') + ')\n' +
          'Tổng [' + l + ', ' + r + '] = S[' + r + '] − S[' + (l - 1) + '] = ' +
          S[r] + ' − ' + fmt(S[l - 1]) + ' = ' + (S[r] - S[l - 1]) + '\n' +
          'Kiểm tra: ' + terms + ' = ' + (S[r] - S[l - 1]) +
          '  (cộng tay ' + (r - l) + ' phép, cộng dồn chỉ 1 phép trừ)';
      };

      if (noAnim === true || window.CP.reduceMotion || typeof window.CP.sleep !== 'function') { fin(); return; }
      // Hoạt hình: dựng S từng ô rồi mới trả lời truy vấn
      var k = 0;
      out.textContent = 'Đang dựng S: S[0] = 0';
      draw(a, S, 0, null, null);
      (function step() {
        if (my !== token) return;
        if (k >= n) { window.CP.sleep(450).then(fin); return; }
        k++;
        draw(a, S, k, null, null);
        out.textContent = 'Đang dựng S: S[' + k + '] = S[' + (k - 1) + '] + a[' + k + '] = ' +
          S[k - 1] + ' + ' + fmt(a[k - 1]) + ' = ' + S[k];
        window.CP.sleep(380).then(step);
      })();
    }

    function randomize() {
      var n = 6 + Math.floor(Math.random() * 3);
      var a = [];
      for (var i = 0; i < n; i++) a.push(Math.floor(Math.random() * 19) - 6);
      inp.value = a.join(' ');
      var l = 1 + Math.floor(Math.random() * n);
      var r = l + Math.floor(Math.random() * (n - l + 1));
      inL.value = l; inR.value = r;
      run();
    }

    btnRun.addEventListener('click', function () { run(false); });
    if (btnRand) btnRand.addEventListener('click', randomize);
    [inp, inL, inR].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(false); } });
    });

    // Vẽ sẵn kết quả cho dữ liệu mặc định (không hoạt hình)
    run(true);
  });
})();
