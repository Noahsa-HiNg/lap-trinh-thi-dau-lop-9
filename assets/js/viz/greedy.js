/* Widget đổi tiền cho topics/greedy.html
 * Nhập các mệnh giá và số tiền S -> so cách trả tham lam (tờ lớn trước) với cách trả
 * ít tờ nhất bằng quy hoạch động; nút "Tìm phản ví dụ nhỏ nhất" duyệt S từ 1 trở lên.
 * Theo định lý Kozen–Zaks (1994): với hệ có tờ 1, nếu tham lam sai thì phản ví dụ nhỏ nhất
 * nhỏ hơn tổng hai mệnh giá lớn nhất, nên chỉ cần duyệt tới đó. */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;
  var CP = window.CP;
  var MAX_COIN = 1000, MAX_K = 10, MAX_S = 100000, MAX_CELLS = 40;

  function parseCoins(str) {
    var parts = String(str == null ? '' : str).split(/[\s,;]+/).filter(Boolean);
    if (!parts.length) return { err: 'Chưa nhập mệnh giá nào.' };
    var set = {};
    for (var i = 0; i < parts.length; i++) {
      if (!/^\d+$/.test(parts[i])) return { err: '“' + parts[i] + '” không phải số nguyên dương.' };
      var v = parseInt(parts[i], 10);
      if (v < 1 || v > MAX_COIN) return { err: 'Mỗi mệnh giá phải từ 1 đến ' + MAX_COIN + '.' };
      set[v] = true;
    }
    var c = Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
    if (c.length > MAX_K) return { err: 'Tối đa ' + MAX_K + ' mệnh giá khác nhau.' };
    return { coins: c };
  }

  function parseS(str) {
    var t = String(str == null ? '' : str).trim();
    if (!/^\d+$/.test(t)) return null;
    var v = parseInt(t, 10);
    return v >= 1 && v <= MAX_S ? v : null;
  }

  // Tham lam: trả về danh sách tờ (lớn trước) và phần còn thiếu (khác 0 nếu không trả nổi)
  function greedy(c, S) {
    var used = [], rest = S;
    for (var i = c.length - 1; i >= 0; i--) {
      var q = Math.floor(rest / c[i]);
      for (var j = 0; j < q; j++) used.push(c[i]);
      rest -= q * c[i];
    }
    return { used: used, rest: rest };
  }

  // QHĐ: f[s] = số tờ ít nhất, from[s] = tờ cuối cùng dùng; Infinity nếu không trả được
  function dpTable(c, S) {
    var f = new Array(S + 1), from = new Array(S + 1);
    f[0] = 0;
    for (var s = 1; s <= S; s++) {
      f[s] = Infinity; from[s] = 0;
      for (var i = 0; i < c.length; i++) {
        if (c[i] <= s && f[s - c[i]] + 1 < f[s]) { f[s] = f[s - c[i]] + 1; from[s] = c[i]; }
      }
    }
    return { f: f, from: from };
  }

  function rebuild(t, S) {
    var used = [];
    if (t.f[S] === Infinity) return null;
    for (var s = S; s > 0; s -= t.from[s]) used.push(t.from[s]);
    return used.sort(function (a, b) { return b - a; });
  }

  function summary(used) {
    var cnt = {}, order = [];
    used.forEach(function (v) { if (!cnt[v]) { cnt[v] = 0; order.push(v); } cnt[v]++; });
    return order.map(function (v) { return cnt[v] > 1 ? v + '×' + cnt[v] : String(v); }).join(' + ');
  }

  CP.mount('#viz-greedy', function (root) {
    var inC = root.querySelector('#greedy-coins');
    var inS = root.querySelector('#greedy-s');
    var out = root.querySelector('.out');
    var body = root.querySelector('.playground-body') || root;
    if (!inC || !inS || !out) return;

    var wrap = document.createElement('div');
    wrap.setAttribute('aria-live', 'polite');
    body.appendChild(wrap);

    function row(label, used, cls) {
      var arr = document.createElement('div');
      arr.className = 'arr';
      var lb = document.createElement('span');
      lb.className = 'arr-label';
      lb.textContent = label;
      arr.appendChild(lb);
      var n = Math.min(used.length, MAX_CELLS);
      for (var i = 0; i < n; i++) {
        var cell = document.createElement('span');
        cell.className = 'cell' + (cls ? ' ' + cls : '');
        cell.textContent = used[i];
        arr.appendChild(cell);
      }
      if (used.length > MAX_CELLS) {
        var more = document.createElement('span');
        more.className = 'cell is-dim';
        more.textContent = '…';
        arr.appendChild(more);
      }
      wrap.appendChild(arr);
    }

    function line(text) {
      var p = document.createElement('p');
      p.textContent = text;
      wrap.appendChild(p);
    }

    function compare(c, S) {
      wrap.textContent = '';
      var g = greedy(c, S);
      var opt = rebuild(dpTable(c, S), S);
      var msg = 'Mệnh giá {' + c.join(', ') + '}, S = ' + S + '. ';
      if (!opt) {
        out.textContent = msg + 'Không có cách nào trả đúng S bằng các mệnh giá này (thử thêm tờ 1).';
        return;
      }
      var okG = g.rest === 0;
      if (!okG) {
        msg += 'Tham lam bị kẹt: còn thiếu ' + g.rest + ' mà không tờ nào vừa. ';
      } else {
        msg += 'Tham lam: ' + g.used.length + ' tờ (' + summary(g.used) + '). ';
      }
      msg += 'Tối ưu (QHĐ): ' + opt.length + ' tờ (' + summary(opt) + '). ';
      if (okG && g.used.length === opt.length) msg += 'Tham lam đúng với số tiền này.';
      else msg += 'Tham lam SAI với số tiền này.';
      out.textContent = msg;
      var good = okG && g.used.length === opt.length;
      if (g.used.length) row('TL', g.used, good ? 'is-ok' : 'is-bad');
      row('QHĐ', opt, 'is-ok');
    }

    function readCoins() {
      var r = parseCoins(inC.value);
      if (r.err) { wrap.textContent = ''; out.textContent = 'Dữ liệu chưa hợp lệ: ' + r.err; return null; }
      return r.coins;
    }

    function run() {
      var c = readCoins();
      if (!c) return;
      var S = parseS(inS.value);
      if (S === null) { wrap.textContent = ''; out.textContent = 'Dữ liệu chưa hợp lệ: S phải là số nguyên từ 1 đến ' + MAX_S + '.'; return; }
      compare(c, S);
    }

    function find() {
      var c = readCoins();
      if (!c) return;
      wrap.textContent = '';
      if (c[0] !== 1) {
        out.textContent = 'Hãy thêm mệnh giá 1 để mọi số tiền đều trả được, rồi tìm lại.';
        return;
      }
      if (c.length === 1) { out.textContent = 'Chỉ có tờ 1 thì tham lam luôn đúng.'; return; }
      var limit = c[c.length - 1] + c[c.length - 2];   // chặn trên Kozen–Zaks
      var t = dpTable(c, limit);
      for (var S = 1; S < limit; S++) {
        if (greedy(c, S).used.length !== t.f[S]) {
          inS.value = S;
          compare(c, S);
          out.textContent = 'Phản ví dụ nhỏ nhất: S = ' + S + '. ' + out.textContent;
          return;
        }
      }
      out.textContent = 'Đã thử mọi S từ 1 đến ' + (limit - 1) + ' mà không có phản ví dụ. Theo định lý Kozen–Zaks, '
        + 'như vậy tham lam đúng với MỌI số tiền khi dùng hệ {' + c.join(', ') + '}.';
    }

    root.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', b.getAttribute('data-act') === 'find' ? find : run);
    });
    [inC, inS].forEach(function (el) {
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    });
    run();
  });
})();
