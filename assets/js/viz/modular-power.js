/* Widget: lũy thừa nhanh a^n mod m theo bit của số mũ (dùng BigInt).
   Gắn vào #viz-modular-power trong topics/modular-power.html. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.CP || typeof BigInt === 'undefined') return;

  var CP = window.CP;
  var MAX_DIGITS = 60;          // giới hạn số chữ số mỗi ô nhập để bảng không quá dài
  var ANIM_ROWS = 24;           // chỉ hiện từng dòng khi bảng ngắn

  function parseBig(text, allowNeg) {
    var s = String(text == null ? '' : text).replace(/[\s_.,]/g, '');
    var re = allowNeg ? /^-?\d+$/ : /^\d+$/;
    if (!re.test(s)) return null;
    if (s.replace('-', '').length > MAX_DIGITS) return 'long';
    return BigInt(s);
  }

  function modPos(x, m) {
    var r = x % m;
    return r < 0n ? r + m : r;
  }

  function bitLength(n) { return n === 0n ? 0 : n.toString(2).length; }

  function fmtCount(x) {
    // x là BigInt: viết gọn dạng 1,2·10^k nếu quá dài
    var s = x.toString();
    if (s.length <= 9) return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s[0] + (s.length > 1 ? ',' + s.slice(1, 3) : '') + '·10^' + (s.length - 1);
  }

  function naiveTime(n) {
    // ước lượng thời gian với 10^9 phép nhân mỗi giây
    var sec = Number(n) / 1e9;
    if (!isFinite(sec)) return 'lâu hơn tuổi vũ trụ';
    if (sec < 1e-3) return 'dưới 1 mili giây';
    if (sec < 1) return 'khoảng ' + Math.round(sec * 1000) + ' mili giây';
    if (sec < 120) return 'khoảng ' + Math.round(sec) + ' giây';
    if (sec < 7200) return 'khoảng ' + Math.round(sec / 60) + ' phút';
    if (sec < 172800) return 'khoảng ' + Math.round(sec / 3600) + ' giờ';
    if (sec < 3.15e7 * 2) return 'khoảng ' + Math.round(sec / 86400) + ' ngày';
    var years = sec / 3.15e7;
    return years < 1e6 ? 'khoảng ' + Math.round(years) + ' năm' : 'hơn ' + fmtCount(BigInt(Math.floor(years))) + ' năm';
  }

  function cell(tag, text) {
    var c = document.createElement(tag);
    c.textContent = text;
    return c;
  }

  CP.mount('#viz-modular-power', function (root) {
    var inA = root.querySelector('#mp-a');
    var inN = root.querySelector('#mp-n');
    var inM = root.querySelector('#mp-m');
    var out = root.querySelector('[data-role="out"]');
    var box = root.querySelector('[data-role="table"]');
    if (!inA || !inN || !inM || !out || !box) return;
    var runId = 0;

    function fail(msg) {
      runId++;
      out.textContent = msg;
      box.textContent = '';
    }

    function run() {
      var a0 = parseBig(inA.value, true);
      var n0 = parseBig(inN.value, false);
      var m = parseBig(inM.value, false);
      if (a0 === 'long' || n0 === 'long' || m === 'long') return fail('Mỗi số tối đa ' + MAX_DIGITS + ' chữ số.');
      if (a0 === null) return fail('a phải là số nguyên (có thể âm), ví dụ 3 hoặc -7.');
      if (n0 === null) return fail('n phải là số nguyên không âm, ví dụ 13.');
      if (m === null || m < 1n) return fail('m phải là số nguyên dương (m ≥ 1), ví dụ 7.');

      var r = 1n % m;
      var a = modPos(a0, m);
      var n = n0;
      var rows = [];
      var mulR = 0, sq = 0, k = 0;
      while (n > 0n) {
        var bit = n & 1n;
        var aStart = a;
        if (bit === 1n) { r = r * a % m; mulR++; }
        a = a * a % m; sq++;
        n >>= 1n;
        rows.push([String(k), String(bit), aStart.toString(), r.toString(), n.toString()]);
        k++;
      }

      var bits = bitLength(n0);
      var lines = [];
      lines.push(a0.toString() + '^' + n0.toString() + ' mod ' + m.toString() + ' = ' + r.toString());
      lines.push('n viết ở hệ nhị phân: ' + (n0 === 0n ? '0' : n0.toString(2)) + ' (' + bits + ' bit)');
      lines.push('Lũy thừa nhanh: ' + rows.length + ' vòng lặp, ' + (mulR + sq) + ' phép nhân (' + mulR + ' lần nhân vào r + ' + sq + ' lần bình phương).');
      lines.push('Cách ngây thơ: ' + fmtCount(n0) + ' phép nhân, ' + naiveTime(n0) + ' nếu máy làm 10^9 phép nhân mỗi giây.');
      if (n0 <= 100000n) {
        var chk = 1n % m, base = modPos(a0, m);
        for (var i = 0n; i < n0; i++) chk = chk * base % m;
        lines.push('Kiểm tra bằng cách ngây thơ: ' + chk.toString() + (chk === r ? ' (khớp).' : ' (KHÔNG khớp!).'));
      }
      if (rows.length) lines.push('Trong bảng: dòng tô đậm là vòng có bit 1 (nhân a vào r).');
      out.textContent = lines.join('\n');

      box.textContent = '';
      if (!rows.length) return;
      var table = document.createElement('table');
      table.className = 'trace';
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      ['Vòng k', 'bit k', 'a đầu vòng (a^(2^k))', 'r sau vòng', 'n sau vòng'].forEach(function (h) { hr.appendChild(cell('th', h)); });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      table.appendChild(tbody);
      box.appendChild(table);

      var trs = rows.map(function (row) {
        var tr = document.createElement('tr');
        row.forEach(function (v) { tr.appendChild(cell('td', v)); });
        if (row[1] === '1') tr.className = 'hl';
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
        CP.sleep(160).then(function () { step(i + 1); });
      })(0);
    }

    root.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      if (btn.getAttribute('data-act') === 'big') {
        inA.value = '2';
        inN.value = '1000000000000000000';
        inM.value = '1000000007';
      }
      run();
    });
    [inA, inN, inM].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    });

    run();
  });
})();
