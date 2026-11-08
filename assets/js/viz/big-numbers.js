/* Widget: đặt tính cộng / trừ / nhân hai số lớn theo từng cột, đối chiếu bằng BigInt.
   Gắn vào #viz-big-numbers trong topics/big-numbers.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP) return;

  var CP = window.CP;
  var MAX_ADD = 60;      // số chữ số tối đa cho + và −
  var MAX_MUL = 25;      // số chữ số tối đa cho × (bảng có tới 50 dòng)
  var ANIM_ROWS = 30;    // chỉ hiện từng dòng khi bảng ngắn

  // Chuẩn hóa: bỏ khoảng trắng, dấu chấm/phẩy/gạch dưới; trả về null nếu không phải số không âm
  function clean(text) {
    var s = String(text == null ? '' : text).replace(/[\s_.,]/g, '');
    if (!/^\d+$/.test(s)) return null;
    s = s.replace(/^0+(?=\d)/, '');
    return s;
  }

  // Xâu viết xuôi → mảng chữ số lưu ngược
  function toDigits(s) {
    var a = [];
    for (var i = s.length - 1; i >= 0; i--) a.push(s.charCodeAt(i) - 48);
    return a;
  }

  function toStr(a) {
    var n = a.length;
    while (n > 1 && a[n - 1] === 0) n--;
    var s = '';
    for (var i = n - 1; i >= 0; i--) s += String(a[i]);
    return s;
  }

  function cmp(x, y) {           // x, y là xâu đã bỏ số 0 đầu
    if (x.length !== y.length) return x.length < y.length ? -1 : 1;
    return x === y ? 0 : (x < y ? -1 : 1);
  }

  function addRows(a, b) {
    var rows = [], c = [], carry = 0;
    for (var i = 0; i < Math.max(a.length, b.length) || carry; i++) {
      var x = i < a.length ? a[i] : 0, y = i < b.length ? b[i] : 0;
      var s = x + y + carry;
      c.push(s % 10);
      rows.push([i, x, y, carry, s, s % 10, Math.floor(s / 10)]);
      carry = Math.floor(s / 10);
    }
    return { rows: rows, res: toStr(c), head: ['Cột i', 'a[i]', 'b[i]', 'nhớ vào', 'tổng', 'viết', 'nhớ ra'], hlCol: 6 };
  }

  function subRows(a, b) {        // cần a ≥ b
    var rows = [], c = [], borrow = 0;
    for (var i = 0; i < a.length; i++) {
      var x = a[i], y = i < b.length ? b[i] : 0;
      var d = x - borrow - y, nb = 0;
      var shown = String(d).replace('-', '−');
      if (d < 0) { d += 10; nb = 1; }
      c.push(d);
      rows.push([i, x, y, borrow, shown, d, nb]);
      borrow = nb;
    }
    return { rows: rows, res: toStr(c), head: ['Cột i', 'a[i]', 'b[i]', 'mượn vào', 'a[i] − mượn − b[i]', 'viết', 'mượn ra'], hlCol: 6 };
  }

  function mulRows(a, b) {
    var L = a.length + b.length, c = [], parts = [], k, i, j;
    for (k = 0; k < L; k++) { c.push(0); parts.push([]); }
    for (i = 0; i < a.length; i++) {
      for (j = 0; j < b.length; j++) {
        c[i + j] += a[i] * b[j];
        parts[i + j].push(a[i] + '·' + b[j]);
      }
    }
    var rows = [], carry = 0, out = [];
    for (k = 0; k < L; k++) {
      var cur = c[k] + carry;
      out.push(cur % 10);
      var list = parts[k].length ? parts[k] : ['—'];
      if (list.length > 6) list = list.slice(0, 3).concat(['…'], list.slice(-2));
      rows.push([k, list.join(' + '), c[k], carry, cur, cur % 10, Math.floor(cur / 10)]);
      carry = Math.floor(cur / 10);
    }
    return { rows: rows, res: toStr(out), head: ['Ô k', 'các tích a[i]·b[j] với i + j = k', 'c[k]', 'nhớ vào', 'c[k] + nhớ', 'giữ', 'nhớ ra'], hlCol: 6 };
  }

  function td(tag, text) {
    var e = document.createElement(tag);
    e.textContent = String(text);
    return e;
  }

  CP.mount('#viz-big-numbers', function (root) {
    var inA = root.querySelector('#bn-a');
    var inB = root.querySelector('#bn-b');
    var sel = root.querySelector('#bn-op');
    var out = root.querySelector('[data-role="out"]');
    var box = root.querySelector('[data-role="table"]');
    if (!inA || !inB || !sel || !out || !box) return;
    var runId = 0;

    function fail(msg) {
      runId++;
      out.textContent = msg;
      box.textContent = '';
    }

    function run() {
      var op = sel.value;
      var sa = clean(inA.value), sb = clean(inB.value);
      if (sa === null || sb === null) return fail('a và b phải là số nguyên không âm, chỉ gồm chữ số 0–9 (ví dụ 9876).');
      var lim = op === '*' ? MAX_MUL : MAX_ADD;
      if (sa.length > lim || sb.length > lim) return fail('Với phép này, mỗi số tối đa ' + lim + ' chữ số để bảng không quá dài.');

      var neg = false, x = sa, y = sb, data;
      if (op === '+') data = addRows(toDigits(x), toDigits(y));
      else if (op === '-') {
        if (cmp(x, y) < 0) { neg = true; x = sb; y = sa; }
        data = subRows(toDigits(x), toDigits(y));
      } else data = mulRows(toDigits(x), toDigits(y));

      var result = (neg && data.res !== '0' ? '-' : '') + data.res;
      var sym = op === '+' ? ' + ' : (op === '-' ? ' − ' : ' × ');
      var lines = [sa + sym + sb + ' = ' + result.replace('-', '−')];
      if (neg) lines.push('Vì a < b nên tính b − a = ' + sb + ' − ' + sa + ' rồi thêm dấu trừ.');
      lines.push('Số chữ số: a có ' + sa.length + ', b có ' + sb.length + ', kết quả có ' + data.res.length + '.');
      if (op === '*') lines.push('Số phép nhân chữ số: ' + sa.length + ' × ' + sb.length + ' = ' + (sa.length * sb.length) + '.');
      else lines.push('Số cột phải xử lý: ' + data.rows.length + '.');
      if (typeof BigInt !== 'undefined') {
        var A = BigInt(sa), B = BigInt(sb);
        var chk = op === '+' ? A + B : (op === '-' ? A - B : A * B);
        lines.push('Đối chiếu BigInt: ' + (chk.toString() === result ? 'khớp.' : 'KHÔNG khớp (' + chk.toString() + ')!'));
      }
      lines.push('Dòng tô đậm: cột có ' + (op === '-' ? 'mượn' : 'nhớ') + ' sang cột kế.');
      out.textContent = lines.join('\n');

      box.textContent = '';
      var table = document.createElement('table');
      table.className = 'trace';
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      data.head.forEach(function (h) { hr.appendChild(td('th', h)); });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      table.appendChild(tbody);
      box.appendChild(table);

      var trs = data.rows.map(function (row) {
        var tr = document.createElement('tr');
        row.forEach(function (v) { tr.appendChild(td('td', v)); });
        if (row[data.hlCol] > 0) tr.className = 'hl';
        return tr;
      });

      var my = ++runId;
      if (CP.reduceMotion || trs.length > ANIM_ROWS || typeof CP.sleep !== 'function') {
        trs.forEach(function (tr) { tbody.appendChild(tr); });
        return;
      }
      (function step(i) {
        if (my !== runId || i >= trs.length) return;
        tbody.appendChild(trs[i]);
        CP.sleep(140).then(function () { step(i + 1); });
      })(0);
    }

    function randDigits(n) {
      var s = String(1 + Math.floor(Math.random() * 9));
      for (var i = 1; i < n; i++) s += String(Math.floor(Math.random() * 10));
      return s;
    }

    root.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      if (btn.getAttribute('data-act') === 'rand') {
        var n = sel.value === '*' ? 12 : 30;
        inA.value = randDigits(n);
        inB.value = randDigits(n - (sel.value === '*' ? 3 : 4));
      }
      run();
    });
    sel.addEventListener('change', run);
    [inA, inB].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    });
    run();
  });
})();
