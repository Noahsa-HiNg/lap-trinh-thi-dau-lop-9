/* Widget: mổ xẻ một xâu: ký tự + mã ASCII, tần suất chữ cái, bản chuẩn hóa, hai con trỏ kiểm tra đối xứng. */
(function () {
  'use strict';
  if (!window.CP) return;

  CP.mount('#viz-strings', function (root) {
    var input = root.querySelector('#strings-input');
    var chkLoose = root.querySelector('#strings-loose');
    var view = root.querySelector('.str-view');
    var out = root.querySelector('.out');
    var btnRun = root.querySelector('[data-act="run"]');
    var btnStep = root.querySelector('[data-act="step"]');
    var btnPlay = root.querySelector('[data-act="play"]');
    var btnSample = root.querySelector('[data-act="sample"]');
    if (!input || !view || !out || !btnRun || !btnStep) return;

    var MAXLEN = 40;
    var SAMPLES = ['  nguyen   van  AN ', 'racecar', 'Never odd or even', 'abcdba', 'banana', 'TRAN thi   bich ngoc'];
    var sampleIdx = 0;
    var st = null;      // trạng thái hiện tại
    var runId = 0;      // hủy lượt "Tự chạy" đang chạy

    function make(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }
    function isUpper(c) { return c >= 'A' && c <= 'Z'; }
    function isLower(c) { return c >= 'a' && c <= 'z'; }
    function isAlnum(c) { return isUpper(c) || isLower(c) || (c >= '0' && c <= '9'); }
    function show(c) { return c === ' ' ? '␣' : c; }

    /* Đọc xâu: chỉ giữ ký tự ASCII in được, tối đa MAXLEN ký tự. */
    function readInput() {
      var raw = String(input.value == null ? '' : input.value);
      var s = '', dropped = 0;
      for (var k = 0; k < raw.length; k++) {
        var code = raw.charCodeAt(k);
        if (code === 9) { s += ' '; continue; }          // tab coi như dấu cách
        if (code >= 32 && code <= 126) s += raw[k]; else dropped++;
      }
      var note = '';
      if (dropped > 0) note += 'Đã bỏ ' + dropped + ' ký tự ngoài bảng ASCII (chữ có dấu?). ';
      if (s.length > MAXLEN) { s = s.slice(0, MAXLEN); note += 'Chỉ lấy ' + MAXLEN + ' ký tự đầu. '; }
      return { s: s, note: note };
    }

    function normalizeName(s) {
      var words = s.split(' ').filter(function (w) { return w.length > 0; });
      return words.map(function (w) {
        var low = w.toLowerCase();
        return low.charAt(0).toUpperCase() + low.slice(1);
      }).join(' ');
    }

    function arrRow(label, items) {
      var row = make('div', 'arr str-tight');
      row.appendChild(make('span', 'arr-label', label));
      var cells = [];
      items.forEach(function (txt, k) {
        var c = make('span', 'cell', txt);
        c.setAttribute('data-i', String(k));
        row.appendChild(c);
        cells.push(c);
      });
      return { row: row, cells: cells };
    }

    function reset() {
      runId++;
      var r = readInput();
      var s = r.s;
      var loose = !!(chkLoose && chkLoose.checked);
      var t = '';
      if (loose) {
        for (var k = 0; k < s.length; k++) if (isAlnum(s[k])) t += s[k].toLowerCase();
      } else t = s;
      st = { s: s, t: t, loose: loose, i: 0, j: t.length - 1, ok: {}, bad: {}, done: false, steps: 0 };
      render();
      if (s.length === 0) {
        out.textContent = r.note + 'Xâu rỗng. Hãy nhập ít nhất một ký tự.';
        st.done = true;
        return;
      }
      out.textContent = r.note + 'Độ dài s.size() = ' + s.length + '. Bấm “Bước đối xứng” để chạy hai con trỏ trên ' +
        (loose ? 'xâu đã lọc (chỉ chữ và số, về chữ thường).' : 'chính xâu này.');
    }

    function render() {
      view.textContent = '';
      var s = st.s;
      if (s.length === 0) return;

      var chars = [], codes = [];
      for (var k = 0; k < s.length; k++) { chars.push(show(s[k])); codes.push(String(s.charCodeAt(k))); }
      var r1 = arrRow('s', chars);
      var r2 = arrRow('mã', codes);
      for (var a = 0; a < s.length; a++) {
        if (s[a] === ' ') { r1.cells[a].className = 'cell is-dim'; r2.cells[a].className = 'cell is-dim'; }
      }
      view.appendChild(make('p', '', 'Ký tự và mã ASCII:'));
      view.appendChild(r1.row);
      view.appendChild(r2.row);

      /* Tần suất chữ cái (không phân biệt hoa thường) */
      var cnt = new Array(26).fill(0), letters = 0, digits = 0, spaces = 0, others = 0;
      for (var b = 0; b < s.length; b++) {
        var c = s[b];
        if (isUpper(c) || isLower(c)) { cnt[c.toLowerCase().charCodeAt(0) - 97]++; letters++; }
        else if (c >= '0' && c <= '9') digits++;
        else if (c === ' ') spaces++;
        else others++;
      }
      view.appendChild(make('p', '', 'Chữ cái: ' + letters + ', chữ số: ' + digits + ', dấu cách: ' + spaces + ', ký tự khác: ' + others + '.'));
      if (letters > 0) {
        var tbl = make('table', 'trace');
        var trH = make('tr'), trV = make('tr');
        trH.appendChild(make('th', '', 'chữ'));
        trV.appendChild(make('th', '', 'cnt'));
        for (var k2 = 0; k2 < 26; k2++) {
          if (cnt[k2] === 0) continue;
          trH.appendChild(make('td', '', String.fromCharCode(97 + k2)));
          trV.appendChild(make('td', '', String(cnt[k2])));
        }
        var thead = make('thead'), tbody = make('tbody');
        thead.appendChild(trH); tbody.appendChild(trV);
        tbl.appendChild(thead); tbl.appendChild(tbody);
        view.appendChild(tbl);
      }

      var norm = normalizeName(s);
      view.appendChild(make('p', '', 'Chuẩn hóa họ tên: “' + norm + '” (dài ' + norm.length + ').'));

      /* Hai con trỏ */
      var t = st.t;
      view.appendChild(make('p', '', st.loose ? 'Xâu đem kiểm tra đối xứng (đã lọc):' : 'Kiểm tra đối xứng trên s:'));
      if (t.length === 0) { view.appendChild(make('p', '', '(rỗng, coi là đối xứng)')); return; }
      var tc = [];
      for (var q = 0; q < t.length; q++) tc.push(show(t[q]));
      var r3 = arrRow(st.loose ? 't' : 's', tc);
      for (var x = 0; x < t.length; x++) {
        var cls = 'cell';
        if (st.bad[x]) cls += ' is-bad';
        else if (st.ok[x]) cls += ' is-ok';
        else if (!st.done && (x === st.i || x === st.j)) cls += ' is-cmp';
        if (st.done && st.i === st.j && x === st.i && !st.bad[x]) cls = 'cell is-active';
        r3.cells[x].className = cls;
      }
      if (st.i >= 0 && st.i < t.length && st.j >= 0 && st.j < t.length && st.i <= st.j) {
        if (st.i === st.j) r3.cells[st.i].setAttribute('data-ptr', 'i=j');
        else { r3.cells[st.i].setAttribute('data-ptr', 'i'); r3.cells[st.j].setAttribute('data-ptr', 'j'); }
      }
      view.appendChild(r3.row);
    }

    /* Một bước hai con trỏ. Trả về false khi đã xong. */
    function step() {
      if (!st) reset();
      if (st.done) return false;
      var t = st.t;
      if (st.i >= st.j) {
        st.done = true;
        render();
        out.textContent = 'i = ' + Math.max(st.i, 0) + ', j = ' + Math.max(st.j, 0) + ': hết cặp cần so. Kết luận: ĐỐI XỨNG sau ' +
          st.steps + ' phép so sánh (⌊' + t.length + '/2⌋ = ' + Math.floor(t.length / 2) + ').';
        return false;
      }
      st.steps++;
      var nm = st.loose ? 't' : 's';
      var a = t[st.i], b = t[st.j];
      if (a !== b) {
        st.bad[st.i] = true; st.bad[st.j] = true;
        st.done = true;
        render();
        out.textContent = 'So ' + nm + '[' + st.i + '] = \'' + a + '\' với ' + nm + '[' + st.j + '] = \'' + b + '\': khác nhau. Dừng ngay, kết luận: KHÔNG đối xứng.';
        return false;
      }
      var msg = 'So ' + nm + '[' + st.i + '] = \'' + a + '\' với ' + nm + '[' + st.j + '] = \'' + b + '\': bằng nhau. Tăng i, giảm j.';
      st.ok[st.i] = true; st.ok[st.j] = true;
      st.i++; st.j--;
      render();
      out.textContent = msg;
      return true;
    }

    function play() {
      if (!st || st.done) reset();
      var my = ++runId;
      (function loop() {
        if (my !== runId) return;
        var more = step();
        if (!more || !st || st.done) return;
        CP.sleep(CP.reduceMotion ? 60 : 700).then(loop);
      })();
    }

    btnRun.addEventListener('click', reset);
    btnStep.addEventListener('click', function () { runId++; step(); });
    if (btnPlay) btnPlay.addEventListener('click', play);
    if (btnSample) btnSample.addEventListener('click', function () {
      sampleIdx = (sampleIdx + 1) % SAMPLES.length;
      input.value = SAMPLES[sampleIdx];
      if (chkLoose) chkLoose.checked = SAMPLES[sampleIdx] === 'Never odd or even';
      reset();
    });
    if (chkLoose) chkLoose.addEventListener('change', reset);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); reset(); } });

    reset();
  });
})();
