/* Widget bảng QHĐ hai xâu cho topics/lcs.html
 * Ba chế độ: LCS (dãy con chung dài nhất), khoảng cách sửa (edit distance),
 * xâu con chung liên tiếp dài nhất. Nhập hai xâu (tối đa 12 ký tự), xem bảng,
 * đường truy vết và bấm vào ô để xem công thức của ô đó.
 */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAXLEN = 12;
  var SUB = '₀₁₂₃₄₅₆₇₈₉';

  function subIdx(k) {
    return String(k).split('').map(function (c) { return SUB.charAt(+c); }).join('');
  }

  CP.mount('#viz-lcs', function (root) {
    var inS = root.querySelector('#lcs-s');
    var inT = root.querySelector('#lcs-t');
    var selMode = root.querySelector('#lcs-mode');
    var box = root.querySelector('[data-out="table"]');
    var msg = root.querySelector('[data-out="msg"]');
    if (!inS || !inT || !selMode || !box || !msg) return;

    var s = '', t = '', mode = 'lcs';
    var dp = [];          // dp[i][j]
    var cells = [];       // cells[i][j] = <td>
    var trace = {};       // "i,j" -> lớp tô màu của đường truy vết
    var note = '';        // ghi chú khi dữ liệu nhập bị sửa
    var runId = 0;

    function clean(str) {
      var raw = String(str || '').replace(/\s+/g, '');
      return { v: raw.slice(0, MAXLEN), cut: raw.length > MAXLEN };
    }
    function ch(str, k) { return str.charAt(k - 1); }   // ký tự thứ k (đếm từ 1)

    function compute() {
      var n = s.length, m = t.length, i, j;
      dp = [];
      for (i = 0; i <= n; i++) {
        dp.push([]);
        for (j = 0; j <= m; j++) {
          var v;
          if (mode === 'edit') {
            if (i === 0) v = j;
            else if (j === 0) v = i;
            else if (ch(s, i) === ch(t, j)) v = dp[i - 1][j - 1];
            else v = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
          } else if (i === 0 || j === 0) {
            v = 0;
          } else if (ch(s, i) === ch(t, j)) {
            v = dp[i - 1][j - 1] + 1;
          } else {
            v = mode === 'sub' ? 0 : Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
          dp[i].push(v);
        }
      }
    }

    /* Truy vết; trả về lời mô tả kết quả. */
    function doTrace() {
      var n = s.length, m = t.length, i = n, j = m;
      trace = {};
      if (mode === 'lcs') {
        var res = '';
        while (i > 0 && j > 0) {
          if (ch(s, i) === ch(t, j)) { trace[i + ',' + j] = 'is-ok'; res = ch(s, i) + res; i--; j--; }
          else { trace[i + ',' + j] = 'is-cmp'; if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--; }
        }
        return 'Độ dài LCS = ' + dp[n][m] + (res ? '. Một LCS: ' + res + '.' : '. Hai xâu không có ký tự chung.') +
          ' Ô xanh lá là ký tự được lấy, ô màu so sánh là ô đi qua khi truy vết.';
      }
      if (mode === 'edit') {
        var ops = [];
        trace[n + ',' + m] = 'is-ok';
        while (i > 0 || j > 0) {
          if (i > 0 && j > 0 && ch(s, i) === ch(t, j) && dp[i][j] === dp[i - 1][j - 1]) { i--; j--; }
          else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) { ops.push('thay ' + ch(s, i) + ' thành ' + ch(t, j)); i--; j--; }
          else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { ops.push('xóa ' + ch(s, i)); i--; }
          else { ops.push('chèn ' + ch(t, j)); j--; }
          trace[i + ',' + j] = 'is-ok';
        }
        ops.reverse();
        return 'Khoảng cách sửa = ' + dp[n][m] + '. ' +
          (ops.length ? 'Các phép (từ trái sang phải): ' + ops.join('; ') + '.' : 'Hai xâu giống hệt nhau, không cần phép nào.');
      }
      // xâu con chung liên tiếp: tìm ô lớn nhất
      var best = 0, bi = 0, bj = 0;
      for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) if (dp[i][j] > best) { best = dp[i][j]; bi = i; bj = j; }
      for (var k = 0; k < best; k++) trace[(bi - k) + ',' + (bj - k)] = 'is-ok';
      return best > 0
        ? 'Xâu con chung liên tiếp dài nhất = ' + best + ': ' + s.substr(bi - best, best) + ' (kết thúc tại ô (' + bi + ', ' + bj + ')). Đáp án là ô lớn nhất của bảng, không phải ô cuối.'
        : 'Hai xâu không có ký tự chung nên đáp án là 0.';
    }

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }

    function build() {
      var n = s.length, m = t.length, i, j;
      box.textContent = '';
      cells = [];
      var wrap = el('div', 'table-wrap');
      var tbl = el('table', 'dp-table');
      tbl.setAttribute('aria-label', 'Bảng quy hoạch động của hai xâu');
      var thead = el('thead'), hr = el('tr');
      hr.appendChild(el('th', '', ''));
      hr.appendChild(el('th', '', '∅'));
      for (j = 1; j <= m; j++) hr.appendChild(el('th', '', ch(t, j) + subIdx(j)));
      thead.appendChild(hr);
      tbl.appendChild(thead);
      var tbody = el('tbody');
      for (i = 0; i <= n; i++) {
        var tr = el('tr');
        tr.appendChild(el('th', '', i === 0 ? '∅' : ch(s, i) + subIdx(i)));
        cells.push([]);
        for (j = 0; j <= m; j++) {
          var td = el('td', '', '');
          td.setAttribute('data-i', i);
          td.setAttribute('data-j', j);
          tr.appendChild(td);
          cells[i].push(td);
        }
        tbody.appendChild(tr);
      }
      tbl.appendChild(tbody);
      wrap.appendChild(tbl);
      box.appendChild(wrap);
    }

    function paint(showTrace, sel) {
      for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells[i].length; j++) {
          var td = cells[i][j];
          td.textContent = dp[i][j];
          td.className = showTrace && trace[i + ',' + j] ? trace[i + ',' + j] : '';
        }
      }
      if (sel) {
        sel.deps.forEach(function (p) { cells[p[0]][p[1]].className = 'is-cmp'; });
        cells[sel.i][sel.j].className = 'is-active';
      }
    }

    function explain(i, j) {
      var v = dp[i][j], deps = [], txt;
      var name = '(' + i + ', ' + j + ')';
      if (i === 0 || j === 0) {
        if (mode === 'edit') txt = 'Ô ' + name + ' là cơ sở: ' + (i === 0 ? 'chèn ' + j : 'xóa ' + i) + ' ký tự, nên bằng ' + v + '.';
        else txt = 'Ô ' + name + ' là cơ sở: một xâu rỗng nên bằng 0.';
        return { i: i, j: j, deps: deps, txt: txt };
      }
      var a = ch(s, i), b = ch(t, j), eq = a === b;
      var head = 'Ô ' + name + ': so ' + a + ' với ' + b + (eq ? ' (bằng nhau). ' : ' (khác nhau). ');
      if (mode === 'lcs') {
        if (eq) { deps = [[i - 1, j - 1]]; txt = head + 'Lấy ô chéo dp[' + (i - 1) + '][' + (j - 1) + '] = ' + dp[i - 1][j - 1] + ' cộng 1, được ' + v + '.'; }
        else { deps = [[i - 1, j], [i, j - 1]]; txt = head + 'max(ô trên = ' + dp[i - 1][j] + ', ô trái = ' + dp[i][j - 1] + ') = ' + v + '.'; }
      } else if (mode === 'edit') {
        if (eq) { deps = [[i - 1, j - 1]]; txt = head + 'Giữ nguyên, không tốn phép: bằng ô chéo = ' + v + '.'; }
        else {
          deps = [[i - 1, j - 1], [i - 1, j], [i, j - 1]];
          txt = head + '1 + min(thay: ' + dp[i - 1][j - 1] + ', xóa: ' + dp[i - 1][j] + ', chèn: ' + dp[i][j - 1] + ') = ' + v + '.';
        }
      } else {
        if (eq) { deps = [[i - 1, j - 1]]; txt = head + 'Nối dài đoạn chung kết thúc ở ô chéo: ' + dp[i - 1][j - 1] + ' + 1 = ' + v + '.'; }
        else txt = head + 'Đoạn chung bị đứt nên bằng 0.';
      }
      return { i: i, j: j, deps: deps, txt: txt };
    }

    function readInputs() {
      var a = clean(inS.value), b = clean(inT.value);
      s = a.v; t = b.v;
      mode = ['lcs', 'edit', 'sub'].indexOf(selMode.value) >= 0 ? selMode.value : 'lcs';
      note = '';
      if (a.cut || b.cut) note = ' (Mỗi xâu chỉ lấy tối đa ' + MAXLEN + ' ký tự đầu để bảng vừa màn hình.)';
      if (inS.value !== s) inS.value = s;
      if (inT.value !== t) inT.value = t;
    }

    function run() {
      runId++;
      readInputs();
      compute();
      build();
      var res = doTrace();
      paint(true, null);
      msg.textContent = res + note;
    }

    function animate() {
      runId++;
      var my = runId;
      readInputs();
      compute();
      build();
      var res = doTrace();
      var n = s.length, m = t.length, i = 0, j = 0;
      var total = (n + 1) * (m + 1);
      function show(ii, jj, active) {
        var td = cells[ii][jj];
        td.textContent = dp[ii][jj];
        td.className = active ? 'is-active' : '';
      }
      // hàng 0 và cột 0 hiện ngay
      for (i = 0; i <= n; i++) show(i, 0, false);
      for (j = 0; j <= m; j++) show(0, j, false);
      if (n === 0 || m === 0) { paint(true, null); msg.textContent = res + note; return; }
      i = 1; j = 1;
      var prev = null;
      var delay = total > 80 ? 160 : 380;
      function step() {
        if (my !== runId) return;
        if (prev) { cells[prev[0]][prev[1]].className = ''; prev[2].forEach(function (p) { cells[p[0]][p[1]].className = ''; }); }
        if (i > n) { paint(true, null); msg.textContent = res + note; return; }
        var e = explain(i, j);
        show(i, j, true);
        e.deps.forEach(function (p) { cells[p[0]][p[1]].className = 'is-cmp'; });
        msg.textContent = e.txt;
        prev = [i, j, e.deps];
        j++;
        if (j > m) { j = 1; i++; }
        CP.sleep(delay).then(step);
      }
      step();
    }

    box.addEventListener('click', function (ev) {
      var td = ev.target && ev.target.closest ? ev.target.closest('td[data-i]') : null;
      if (!td || !box.contains(td)) return;
      runId++;   // dừng hoạt hình nếu đang chạy
      var i = parseInt(td.getAttribute('data-i'), 10), j = parseInt(td.getAttribute('data-j'), 10);
      if (!(i >= 0 && i < cells.length && j >= 0 && j < cells[0].length)) return;
      var e = explain(i, j);
      paint(false, e);
      msg.textContent = e.txt + ' Bấm “Tính bảng” để xem lại đường truy vết.';
    });

    root.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('button[data-act]') : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-act');
      if (act === 'run') run();
      else if (act === 'anim') animate();
      else if (act === 'swap') { var tmp = inS.value; inS.value = inT.value; inT.value = tmp; run(); }
    });
    selMode.addEventListener('change', run);
    [inS, inT].forEach(function (inp) {
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); run(); } });
    });

    run();
  });
})();
