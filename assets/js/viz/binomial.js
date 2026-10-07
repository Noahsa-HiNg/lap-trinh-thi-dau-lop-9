/* Widget tam giác Pascal cho topics/binomial.html
 * Nhập n (0–15) và số chia m (0 = không lấy dư), vẽ tam giác Pascal.
 * Bấm vào một ô: tô ô đó và hai ô "cha" C(n−1, k−1), C(n−1, k).
 */
(function () {
  'use strict';
  if (!window.CP || typeof window.CP.mount !== 'function') return;

  var MAX_N = 15;
  var MAX_MOD = 1000;

  CP.mount('#viz-binomial', function (root) {
    var inN = root.querySelector('#binomial-n');
    var inMod = root.querySelector('#binomial-mod');
    var btnDraw = root.querySelector('[data-act="draw"]');
    var triBox = root.querySelector('[data-out="tri"]');
    var msg = root.querySelector('[data-out="msg"]');
    if (!inN || !inMod || !triBox || !msg) return;

    // Thêm nút "Dựng từng hàng" (có hoạt hình, tôn trọng CP.reduceMotion qua CP.sleep)
    var btnAnim = document.createElement('button');
    btnAnim.type = 'button';
    btnAnim.textContent = 'Dựng từng hàng';
    if (btnDraw && btnDraw.parentNode) btnDraw.parentNode.appendChild(btnAnim);

    var table = [];   // table[i][j] = C(i, j) (đã lấy dư nếu m ≥ 2)
    var cells = [];   // cells[i][j] = phần tử nút tương ứng
    var curN = 0, curMod = 0, runId = 0;

    function readInt(input, lo, hi, def) {
      var v = Number(String(input.value).trim());
      if (!isFinite(v) || String(input.value).trim() === '') return { v: def, fixed: true };
      var r = Math.round(v), fixed = r !== v;
      if (r < lo) { r = lo; fixed = true; }
      if (r > hi) { r = hi; fixed = true; }
      return { v: r, fixed: fixed };
    }

    function build(n, m) {
      table = [];
      for (var i = 0; i <= n; i++) {
        table.push([]);
        for (var j = 0; j <= i; j++) {
          var val = (j === 0 || j === i) ? 1 : table[i - 1][j - 1] + table[i - 1][j];
          if (m >= 2) val %= m;
          table[i].push(val);
        }
      }
    }

    function baseClass(i, j) {
      if (curMod >= 2) return table[i][j] === 0 ? 'cell is-dim' : 'cell is-ok';
      return 'cell';
    }

    function clearMarks() {
      for (var i = 0; i < cells.length; i++)
        for (var j = 0; j < cells[i].length; j++) cells[i][j].className = baseClass(i, j);
    }

    function rowSumText(i) {
      var s = Math.pow(2, i);
      if (curMod >= 2) return 'Tổng hàng ' + i + ' là 2^' + i + ' = ' + s + ', lấy dư cho ' + curMod + ' được ' + (s % curMod) + '.';
      return 'Tổng hàng ' + i + ' là 2^' + i + ' = ' + s + '.';
    }

    function pick(i, j) {
      clearMarks();
      cells[i][j].className = 'cell is-active';
      var name = 'C(' + i + ', ' + j + ')';
      var text;
      if (j === 0 || j === i) {
        text = name + ' = 1: ô ở mép tam giác (chọn 0 thứ hoặc chọn tất cả chỉ có một cách).';
      } else {
        var a = table[i - 1][j - 1], b = table[i - 1][j];
        cells[i - 1][j - 1].className = 'cell is-cmp';
        cells[i - 1][j].className = 'cell is-cmp';
        text = name + ' = C(' + (i - 1) + ', ' + (j - 1) + ') + C(' + (i - 1) + ', ' + j + ') = ';
        text += curMod >= 2
          ? '(' + a + ' + ' + b + ') mod ' + curMod + ' = ' + table[i][j]
          : a + ' + ' + b + ' = ' + table[i][j];
        text += '. Ô đối xứng C(' + i + ', ' + (i - j) + ') cũng bằng ' + table[i][i - j] + '.';
      }
      msg.textContent = text + ' ' + rowSumText(i);
    }

    function makeRow(i) {
      var row = document.createElement('div');
      row.className = 'arr';
      var rc = [];
      for (var j = 0; j <= i; j++) {
        var c = document.createElement('button');
        c.type = 'button';
        c.className = baseClass(i, j);
        c.textContent = String(table[i][j]);
        c.setAttribute('aria-label', 'C(' + i + ', ' + j + ') = ' + table[i][j]);
        c.setAttribute('data-r', String(i));
        c.setAttribute('data-c', String(j));
        row.appendChild(c);
        rc.push(c);
      }
      cells.push(rc);
      triBox.appendChild(row);
    }

    function prepare() {
      var rn = readInt(inN, 0, MAX_N, 7);
      var rm = readInt(inMod, 0, MAX_MOD, 0);
      if (rm.v === 1) { rm.v = 0; rm.fixed = true; }   // lấy dư cho 1 luôn ra 0, không có ích
      inN.value = rn.v; inMod.value = rm.v;
      curN = rn.v; curMod = rm.v;
      build(curN, curMod);
      triBox.textContent = '';
      cells = [];
      var note = (rn.fixed || rm.fixed) ? 'Đã chỉnh dữ liệu về giới hạn hợp lệ (n từ 0 đến 15, số chia 0 hoặc từ 2 đến 1000). ' : '';
      return note;
    }

    function finishMsg(note) {
      var s = note + 'Đã vẽ ' + (curN + 1) + ' hàng. ';
      if (curMod >= 2) s += 'Ô xanh: số dư khác 0; ô mờ: chia hết cho ' + curMod + '. ';
      msg.textContent = s + rowSumText(curN) + ' Bấm vào một ô để xem hai ô cha.';
    }

    function draw() {
      runId++;
      var note = prepare();
      for (var i = 0; i <= curN; i++) makeRow(i);
      finishMsg(note);
    }

    function animate() {
      var my = ++runId;
      var note = prepare();
      var i = 0;
      (function step() {
        if (my !== runId) return;               // đã có lần vẽ mới, dừng hoạt hình cũ
        if (i > curN) { finishMsg(note); return; }
        makeRow(i);
        if (i >= 2) pick(i, 1);
        else msg.textContent = 'Hàng ' + i + ': hai mép bằng 1.';
        i++;
        CP.sleep(450).then(step);
      })();
    }

    triBox.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute || t.getAttribute('data-r') === null) return;
      var i = Number(t.getAttribute('data-r')), j = Number(t.getAttribute('data-c'));
      if (cells[i] && cells[i][j]) pick(i, j);
    });
    if (btnDraw) btnDraw.addEventListener('click', draw);
    btnAnim.addEventListener('click', animate);
    [inN, inMod].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); draw(); } });
    });

    draw();
  });
})();
