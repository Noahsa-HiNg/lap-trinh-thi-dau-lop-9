/* Widget: sân chơi container STL (set, multiset, map, priority_queue lớn / nhỏ). */
(function () {
  'use strict';
  if (!window.CP) return;

  CP.mount('#viz-stl', function (root) {
    var body = root.querySelector('.playground-body') || root;
    body.innerHTML = '';

    function mk(tag, attrs, text) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      return e;
    }

    var MAXN = 20;      // số phần tử tối đa để hiển thị gọn
    var MAXV = 999;     // giới hạn giá trị nhập

    var TYPES = [
      { id: 'set', name: 'set<int>' },
      { id: 'multiset', name: 'multiset<int>' },
      { id: 'map', name: 'map<int,int> (đếm)' },
      { id: 'pqmax', name: 'priority_queue<int> (lớn nhất)' },
      { id: 'pqmin', name: 'priority_queue<int, …, greater> (nhỏ nhất)' }
    ];

    /* ---------- Giao diện ---------- */
    var ctr = mk('div', { 'class': 'controls' });
    var lbT = mk('label', { 'for': 'stl-type' }, 'Container ');
    var sel = mk('select', { id: 'stl-type' });
    TYPES.forEach(function (t) { sel.appendChild(mk('option', { value: t.id }, t.name)); });
    lbT.appendChild(sel);
    var lbX = mk('label', { 'for': 'stl-x' }, 'x = ');
    var inp = mk('input', { type: 'text', id: 'stl-x', value: '5', size: '5', autocomplete: 'off', spellcheck: 'false', inputmode: 'numeric' });
    lbX.appendChild(inp);
    var bReset = mk('button', { type: 'button', 'class': 'ghost' }, 'Làm rỗng');
    var bSample = mk('button', { type: 'button', 'class': 'ghost' }, 'Nạp mẫu');
    ctr.appendChild(lbT); ctr.appendChild(lbX); ctr.appendChild(bSample); ctr.appendChild(bReset);

    var ops = mk('div', { 'class': 'controls' });
    var view = mk('div', { 'class': 'arr', role: 'img', 'aria-label': 'Nội dung container' });
    var legend = mk('div', { 'class': 'viz-legend' });
    [['is-active', 'vừa thêm / vừa thay đổi'], ['is-ok', 'kết quả tìm / đỉnh heap'], ['is-dim', 'không liên quan']].forEach(function (p) {
      var s = mk('span'); s.appendChild(mk('i', { 'class': p[0] })); s.appendChild(document.createTextNode(p[1])); legend.appendChild(s);
    });
    var out = mk('div', { 'class': 'out', 'aria-live': 'polite' });
    body.appendChild(ctr); body.appendChild(ops); body.appendChild(view); body.appendChild(legend); body.appendChild(out);

    /* ---------- Trạng thái ---------- */
    var type = 'set';
    var data = [];      // set/multiset: mảng tăng dần; map: [[khóa, số đếm]] tăng theo khóa; heap: mảng heap
    var hl = {};        // chỉ số -> class tô màu

    function readX() {
      var raw = String(inp.value || '').trim();
      if (!/^-?\d+$/.test(raw)) { say('x phải là một số nguyên, ví dụ 5 hoặc -3.'); return null; }
      var v = parseInt(raw, 10);
      if (Math.abs(v) > MAXV) { say('Để dễ nhìn, hãy nhập x trong khoảng từ -' + MAXV + ' đến ' + MAXV + '.'); return null; }
      return v;
    }
    function say(msg) { out.textContent = msg; }
    function log2(n) { return n <= 1 ? 1 : Math.ceil(Math.log(n + 1) / Math.LN2); }
    function cost(n) { return ' (cây/heap có ' + n + ' phần tử, chỉ khoảng ' + log2(n) + ' bước)'; }
    function isPQ() { return type === 'pqmax' || type === 'pqmin'; }
    function better(a, b) { return type === 'pqmax' ? a > b : a < b; }   // a ưu tiên hơn b?
    function full() { if (data.length >= MAXN) { say('Sân chơi giới hạn ' + MAXN + ' phần tử. Hãy xóa bớt hoặc bấm “Làm rỗng”.'); return true; } return false; }

    // vị trí đầu tiên có giá trị >= x (strict=false) hoặc > x (strict=true) trong mảng tăng dần
    function bound(arr, x, strict, key) {
      var lo = 0, hi = arr.length;
      while (lo < hi) {
        var mid = (lo + hi) >> 1, v = key ? arr[mid][0] : arr[mid];
        if (strict ? v <= x : v < x) lo = mid + 1; else hi = mid;
      }
      return lo;
    }

    /* ---------- Thao tác set / multiset ---------- */
    function sInsert() {
      var x = readX(); if (x === null) return;
      var p = bound(data, x, false);
      hl = {};
      if (type === 'set' && p < data.length && data[p] === x) {
        hl[p] = 'is-ok';
        say('s.insert(' + x + '): ' + x + ' đã có trong set nên không thêm. s.size() vẫn là ' + data.length + '.');
      } else {
        if (full()) return;
        p = bound(data, x, true);       // multiset chèn sau các bản bằng x
        data.splice(p, 0, x);
        hl[p] = 'is-active';
        say('insert(' + x + '): ' + x + ' tự đứng đúng chỗ, dãy vẫn tăng dần' + cost(data.length) + '.');
      }
      render();
    }
    function sEraseAll() {
      var x = readX(); if (x === null) return;
      var l = bound(data, x, false), r = bound(data, x, true);
      data.splice(l, r - l);
      hl = {};
      if (r - l === 0) say('erase(' + x + '): không có ' + x + ', không có gì thay đổi.');
      else if (type === 'multiset' && r - l > 1) say('ms.erase(' + x + ') xóa HẾT ' + (r - l) + ' bản của ' + x + '! Muốn xóa một bản, dùng ms.erase(ms.find(' + x + ')).');
      else say('erase(' + x + '): đã xóa ' + (r - l) + ' phần tử.');
      render();
    }
    function sEraseOne() {
      var x = readX(); if (x === null) return;
      var l = bound(data, x, false);
      hl = {};
      if (l < data.length && data[l] === x) {
        data.splice(l, 1);
        say('ms.erase(ms.find(' + x + ')): chỉ xóa đúng một bản. ms.count(' + x + ') còn ' + (bound(data, x, true) - bound(data, x, false)) + '.');
      } else say('ms.find(' + x + ') trả về end(): không có ' + x + '. Đừng gọi erase(end()), sẽ lỗi.');
      render();
    }
    function sCount() {
      var x = readX(); if (x === null) return;
      var l = bound(data, x, false), r = bound(data, x, true);
      hl = {};
      for (var i = 0; i < data.length; i++) hl[i] = (i >= l && i < r) ? 'is-ok' : 'is-dim';
      say('count(' + x + ') = ' + (r - l) + '.');
      render();
    }
    function sBound(strict) {
      var x = readX(); if (x === null) return;
      var p = bound(data, x, strict);
      var name = strict ? 'upper_bound' : 'lower_bound';
      hl = {};
      for (var i = 0; i < data.length; i++) hl[i] = i === p ? 'is-ok' : 'is-dim';
      if (p === data.length) say(name + '(' + x + ') = end(): không có số nào ' + (strict ? '> ' : '≥ ') + x + '.');
      else say(name + '(' + x + ') trỏ vào ' + data[p] + ': số đầu tiên ' + (strict ? '> ' : '≥ ') + x + '.' +
        (p > 0 ? ' Phần tử ngay trước nó là ' + data[p - 1] + '.' : ' Nó là begin(), không có phần tử trước.'));
      render();
    }

    /* ---------- Thao tác map ---------- */
    function mFind(x) { var p = bound(data, x, false, true); return (p < data.length && data[p][0] === x) ? p : -1; }
    function mInc() {
      var x = readX(); if (x === null) return;
      var p = mFind(x);
      hl = {};
      if (p < 0) {
        if (full()) return;
        p = bound(data, x, false, true);
        data.splice(p, 0, [x, 1]);
        say('m[' + x + ']++: khóa ' + x + ' chưa có nên được tạo với giá trị 0, rồi tăng lên 1.');
      } else {
        data[p][1]++;
        say('m[' + x + ']++: khóa ' + x + ' đã có, số đếm tăng lên ' + data[p][1] + '.');
      }
      hl[p] = 'is-active';
      render();
    }
    function mRead() {
      var x = readX(); if (x === null) return;
      var p = mFind(x);
      hl = {};
      if (p < 0) {
        if (full()) return;
        p = bound(data, x, false, true);
        data.splice(p, 0, [x, 0]);
        hl[p] = 'is-active';
        say('Chỉ đọc m[' + x + '] thôi mà map đã TẠO khóa ' + x + ' với giá trị 0! m.size() thành ' + data.length + '. Muốn hỏi, hãy dùng m.count(' + x + ').');
      } else {
        hl[p] = 'is-ok';
        say('m[' + x + '] = ' + data[p][1] + '.');
      }
      render();
    }
    function mCount() {
      var x = readX(); if (x === null) return;
      var p = mFind(x);
      hl = {};
      if (p >= 0) hl[p] = 'is-ok';
      say('m.count(' + x + ') = ' + (p >= 0 ? 1 : 0) + '. Hỏi bằng count không tạo thêm khóa.');
      render();
    }
    function mErase() {
      var x = readX(); if (x === null) return;
      var p = mFind(x);
      hl = {};
      if (p >= 0) { data.splice(p, 1); say('m.erase(' + x + '): xóa khóa ' + x + '.'); }
      else say('m.erase(' + x + '): không có khóa ' + x + '.');
      render();
    }

    /* ---------- Thao tác heap ---------- */
    function hPush() {
      var x = readX(); if (x === null) return;
      if (full()) return;
      data.push(x);
      var i = data.length - 1, swaps = 0;
      while (i > 0) {
        var par = (i - 1) >> 1;
        if (!better(data[i], data[par])) break;
        var t = data[i]; data[i] = data[par]; data[par] = t;
        i = par; swaps++;
      }
      hl = {}; hl[i] = 'is-active'; if (i !== 0) hl[0] = 'is-ok';
      say('push(' + x + '): đặt ở cuối rồi nổi lên ' + swaps + ' lần, dừng ở chỉ số ' + i + '. top() = ' + data[0] + '.');
      render();
    }
    function hTop() {
      hl = {};
      if (!data.length) { say('Heap rỗng: gọi top() lúc này là lỗi! Luôn kiểm tra !pq.empty() trước.'); render(); return; }
      hl[0] = 'is-ok';
      say('top() = ' + data[0] + ', luôn nằm ở chỉ số 0, lấy ngay trong O(1).');
      render();
    }
    function hPop() {
      hl = {};
      if (!data.length) { say('Heap rỗng: gọi pop() lúc này là lỗi! Luôn kiểm tra !pq.empty() trước.'); render(); return; }
      var old = data[0], last = data.pop(), swaps = 0, i = 0;
      if (data.length) {
        data[0] = last;
        for (;;) {
          var l = 2 * i + 1, r = l + 1, c = i;
          if (l < data.length && better(data[l], data[c])) c = l;
          if (r < data.length && better(data[r], data[c])) c = r;
          if (c === i) break;
          var t = data[i]; data[i] = data[c]; data[c] = t;
          i = c; swaps++;
        }
        hl[i] = 'is-active'; if (i !== 0) hl[0] = 'is-ok';
      }
      say('pop(): bỏ ' + old + '. ' + (data.length ? 'Phần tử cuối (' + last + ') lên gốc rồi chìm xuống ' + swaps + ' lần. top() mới = ' + data[0] + '.' : 'Heap đã rỗng.'));
      render();
    }

    /* ---------- Vẽ ---------- */
    function render() {
      view.textContent = '';
      var label = type === 'map' ? 'm' : (isPQ() ? 'heap' : 's');
      view.appendChild(mk('span', { 'class': 'arr-label' }, label));
      if (!data.length) {
        view.appendChild(mk('span', { 'class': 'cell is-dim' }, 'rỗng'));
      } else {
        data.forEach(function (v, i) {
          var cls = 'cell' + (hl[i] ? ' ' + hl[i] : '');
          var attrs = { 'class': cls };
          if (isPQ()) attrs['data-i'] = String(i);
          view.appendChild(mk('span', attrs, type === 'map' ? v[0] + ':' + v[1] : String(v)));
        });
      }
      var desc = isPQ() ? 'Mảng heap (chỉ số ở trên): con của i là 2i+1 và 2i+2.' :
        (type === 'map' ? 'Mỗi ô là khóa:số đếm, khóa luôn tăng dần.' : 'Các phần tử luôn được giữ tăng dần.');
      view.setAttribute('aria-label', desc + ' Nội dung: ' + (data.length ? data.map(function (v) { return type === 'map' ? v[0] + ':' + v[1] : v; }).join(', ') : 'rỗng'));
    }

    function addBtn(text, fn, ghost) {
      var b = mk('button', ghost ? { type: 'button', 'class': 'ghost' } : { type: 'button' }, text);
      b.addEventListener('click', fn);
      ops.appendChild(b);
    }

    function buildOps() {
      ops.textContent = '';
      if (type === 'set' || type === 'multiset') {
        addBtn('insert(x)', sInsert);
        addBtn(type === 'multiset' ? 'erase(x): xóa mọi bản' : 'erase(x)', sEraseAll);
        if (type === 'multiset') addBtn('erase(find(x)): xóa một bản', sEraseOne);
        addBtn('count(x)', sCount, true);
        addBtn('lower_bound(x)', function () { sBound(false); }, true);
        addBtn('upper_bound(x)', function () { sBound(true); }, true);
      } else if (type === 'map') {
        addBtn('m[x]++', mInc);
        addBtn('erase(x)', mErase);
        addBtn('count(x)', mCount, true);
        addBtn('đọc m[x]', mRead, true);
      } else {
        addBtn('push(x)', hPush);
        addBtn('pop()', hPop);
        addBtn('top()', hTop, true);
      }
    }

    var SAMPLE = [5, 2, 8, 2, 6, 1];
    function loadSample() {
      data = []; hl = {};
      if (type === 'set') data = [1, 2, 5, 6, 8];
      else if (type === 'multiset') data = [1, 2, 2, 5, 6, 8];
      else if (type === 'map') data = [[1, 1], [2, 2], [5, 1], [6, 1], [8, 1]];
      else {
        SAMPLE.forEach(function (x) {
          data.push(x);
          var i = data.length - 1;
          while (i > 0 && better(data[i], data[(i - 1) >> 1])) {
            var p = (i - 1) >> 1, t = data[i]; data[i] = data[p]; data[p] = t; i = p;
          }
        });
        hl[0] = 'is-ok';
      }
      say('Đã nạp dãy mẫu 5 2 8 2 6 1 vào ' + sel.options[sel.selectedIndex].text + '.');
      render();
    }

    function changeType() {
      type = sel.value;
      if (!TYPES.some(function (t) { return t.id === type; })) type = 'set';
      buildOps();
      loadSample();
    }

    sel.addEventListener('change', changeType);
    bSample.addEventListener('click', loadSample);
    bReset.addEventListener('click', function () { data = []; hl = {}; say('Container đã rỗng.'); render(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); var b = ops.querySelector('button'); if (b) b.click(); }
    });

    changeType();
  });
})();
