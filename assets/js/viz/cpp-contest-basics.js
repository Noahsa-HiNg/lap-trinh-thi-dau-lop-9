/* Máy kiểm tra tràn số – chủ đề cpp-contest-basics.
 * Tính kết quả đúng bằng BigInt, rồi mô phỏng C++ lưu kết quả vào int / unsigned / long long.
 * JS thuần, không biến toàn cục. */
(function () {
  'use strict';
  if (!window.CP || typeof CP.mount !== 'function') return;

  CP.mount('#viz-cpp-contest-basics', function (root) {
    var $ = function (sel) { return root.querySelector(sel); };
    var inA = $('#ccb-a'), inB = $('#ccb-b'), selOp = $('#ccb-op'), selType = $('#ccb-type');
    var btn = $('#ccb-run'), out = $('#ccb-out');
    if (!inA || !inB || !selOp || !selType || !btn || !out) return;

    if (typeof BigInt !== 'function') {
      out.textContent = 'Trình duyệt này chưa hỗ trợ BigInt nên không chạy được máy kiểm tra.';
      return;
    }

    var TYPES = {
      i32: { name: 'int', bits: 32, signed: true },
      u32: { name: 'unsigned int', bits: 32, signed: false },
      i64: { name: 'long long', bits: 64, signed: true },
      u64: { name: 'unsigned long long', bits: 64, signed: false }
    };
    var OPS = { '+': '+', '-': '−', '*': '×', '/': '/', '%': '%' };
    var ZERO = BigInt(0), ONE = BigInt(1);

    function range(t) {
      var b = BigInt(t.bits);
      if (t.signed) return { lo: -(ONE << (b - ONE)), hi: (ONE << (b - ONE)) - ONE };
      return { lo: ZERO, hi: (ONE << b) - ONE };
    }
    function wrap(v, t) {
      return t.signed ? BigInt.asIntN(t.bits, v) : BigInt.asUintN(t.bits, v);
    }
    /* Viết số có dấu cách mỗi 3 chữ số cho dễ đọc. */
    function fmt(v) {
      var s = v.toString(), neg = s.charAt(0) === '-';
      if (neg) s = s.slice(1);
      s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return (neg ? '−' : '') + s;
    }
    function parse(str) {
      var s = String(str || '').replace(/[\s_.,]/g, '').replace(/−/g, '-');
      if (!/^[+-]?\d{1,60}$/.test(s)) return null;
      return BigInt(s);
    }
    /* Phép chia kiểu Toán: làm tròn xuống, số dư không âm (khi b > 0) hoặc cùng dấu b. */
    function floorDiv(a, b) {
      var q = a / b;
      if (a % b !== ZERO && ((a < ZERO) !== (b < ZERO))) q -= ONE;
      return q;
    }
    function line(label, value, cls) {
      var row = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = label + ' ';
      row.appendChild(b);
      var span = document.createElement('span');
      span.textContent = value;
      if (cls) span.className = cls;
      row.appendChild(span);
      out.appendChild(row);
      return row;
    }

    function run() {
      out.textContent = '';
      var t = TYPES[selType.value] || TYPES.i32;
      var op = OPS[selOp.value] ? selOp.value : '*';
      var a = parse(inA.value), b = parse(inB.value);
      if (a === null || b === null) {
        line('Lỗi:', 'hãy nhập a và b là số nguyên (có thể âm, tối đa 60 chữ số).');
        return;
      }
      var r = range(t);
      line('Kiểu ' + t.name + ':', 'chứa từ ' + fmt(r.lo) + ' đến ' + fmt(r.hi) + '.');

      /* Đầu vào có vừa kiểu không? */
      var badIn = [];
      if (a < r.lo || a > r.hi) badIn.push('a');
      if (b < r.lo || b > r.hi) badIn.push('b');
      var wa = wrap(a, t), wb = wrap(b, t);
      if (badIn.length) {
        line('Chú ý:', badIn.join(' và ') + ' không vừa kiểu ' + t.name +
          '. Đọc bằng cin thì việc đọc thất bại; ở đây máy giả sử số bị cắt bớt bit, còn a = ' + fmt(wa) + ', b = ' + fmt(wb) + '.', 'is-bad');
      }

      if ((op === '/' || op === '%') && wb === ZERO) {
        line('Kết quả:', 'chia cho 0! Trong C++ chương trình sẽ bị lỗi khi chạy (RTE).', 'is-bad');
        return;
      }

      var exact, cpp;
      if (op === '+') exact = a + b;
      else if (op === '-') exact = a - b;
      else if (op === '*') exact = a * b;
      else if (op === '/') exact = a / b;   /* BigInt chia làm tròn về 0, giống C++ */
      else exact = a % b;                   /* dấu theo số bị chia, giống C++ */

      if (op === '+') cpp = wrap(wa + wb, t);
      else if (op === '-') cpp = wrap(wa - wb, t);
      else if (op === '*') cpp = wrap(wa * wb, t);
      else if (op === '/') cpp = wrap(wa / wb, t);
      else cpp = wrap(wa % wb, t);

      var expr = fmt(a) + ' ' + OPS[op] + ' ' + fmt(b);
      line('Kết quả đúng:', expr + ' = ' + fmt(exact));
      line('C++ lưu trong ' + t.name + ':', fmt(cpp), cpp === exact ? 'is-ok' : 'is-bad');

      if ((op === '/' || op === '%') && t.signed && wa === r.lo && wb === -ONE) {
        line('Chú ý:', 'INT_MIN chia cho −1 là trường hợp đặc biệt: trên máy x86, chương trình C++ thường bị lỗi khi chạy (RTE) chứ không chỉ sai số.', 'is-bad');
      }
      if (cpp === exact) {
        line('Kết luận:', 'không tràn số, kết quả đúng.', 'is-ok');
      } else {
        var mod = ONE << BigInt(t.bits);
        var diff = exact - cpp, k = diff / mod;
        var msg = (diff % mod === ZERO)
          ? 'TRÀN SỐ! Kết quả lưu được lệch so với kết quả đúng ' + fmt(k < ZERO ? -k : k) + ' lần 2^' + t.bits + ' = ' + fmt(mod) + '. Chương trình không báo lỗi gì.'
          : 'SAI! Đầu vào đã bị cắt khi đọc nên kết quả lệch hẳn. Chương trình không báo lỗi gì.';
        if (!t.signed && exact < ZERO) msg += ' Kiểu không dấu không chứa được số âm.';
        line('Kết luận:', msg, 'is-bad');
        if (t.name === 'int' && op === '*') {
          var big = wrap(a * b, TYPES.i64);
          line('Gợi ý:', big === exact
            ? 'viết 1LL * a * b để nhân trong long long, sẽ được ' + fmt(exact) + '.'
            : 'kết quả vượt cả long long; cần __int128 hoặc số lớn.');
        }
      }

      if (op === '/' || op === '%') {
        var q = floorDiv(a, b), rr = a - q * b;
        line('So với Toán học:', 'phần nguyên ⌊a/b⌋ = ' + fmt(q) + ', số dư = ' + fmt(rr) +
          (b > ZERO ? ' (luôn trong 0 … b−1).' : '.'));
        if (q !== a / b) {
          line('Chú ý:', 'C++ làm tròn về phía 0 nên khác Toán học khi a, b trái dấu và chia không hết.', 'is-cmp');
        }
      }
    }

    btn.addEventListener('click', run);
    [inA, inB].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
    });
    selOp.addEventListener('change', run);
    selType.addEventListener('change', run);

    /* Nút ví dụ nhanh: data-ex="a op b" */
    Array.prototype.forEach.call(root.querySelectorAll('button[data-ex]'), function (bt) {
      bt.addEventListener('click', function () {
        var m = /^\s*(-?\d+)\s*([-+*\/%])\s*(-?\d+)\s*$/.exec(bt.getAttribute('data-ex') || '');
        if (!m) return;
        inA.value = m[1]; selOp.value = m[2]; inB.value = m[3];
        selType.value = 'i32';
        run();
      });
    });

    run();
  });
})();
