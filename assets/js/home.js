/*
 * assets/js/home.js — tương tác của trang chủ.
 * TÀI NGUYÊN DÙNG CHUNG: phải giữ khóa "assets/js/home.js" trước khi sửa.
 * Phụ thuộc: data/roadmap.js, data/status.js (sinh bởi scripts/validate.py), assets/js/main.js.
 */
(function () {
  'use strict';
  var CP = window.CP;
  if (!CP) return;
  var STATUS = window.TOPIC_STATUS || {};
  var doc = document;
  var $ = function (id) { return doc.getElementById(id); };

  /* ---------- Số mũ dạng chỉ số trên ---------- */
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(n) { return String(n).split('').map(function (c) { return SUP[c] || c; }).join(''); }
  function fmtPow(L) {
    if (L < 6) return Math.round(Math.pow(10, L)).toLocaleString('vi-VN');
    if (L > 20) return '> 10²⁰';
    var e = Math.floor(L), m = Math.pow(10, L - e);
    if (m >= 9.95) { m = 1; e += 1; }
    var ms = m.toFixed(1).replace('.', ',');
    return (ms === '1,0' ? '' : ms + '·') + '10' + sup(e);
  }

  /* ---------- Phòng thí nghiệm giới hạn ---------- */
  var NS = [1, Math.log10(20), 2, Math.log10(500), Math.log10(5000), 5, 6, 7, 8, 9, 12, 15, 18]; // log10(n)
  var LOG2_10 = Math.log2(10);
  function log10Log2(Ln) { return Math.log10(Ln * LOG2_10); }               // log10(log2 n)
  function log10Fact(Ln) {                                                   // Stirling: log10(n!)
    var n = Math.pow(10, Ln);
    if (n > 1e7) return Infinity;
    return n * Math.log10(n / Math.E) + 0.5 * Math.log10(2 * Math.PI * n);
  }
  var CLASSES = [
    { k: 'O(1)', f: function () { return 0; }, use: 'Công thức toán', topics: ['brute-force-formula'] },
    { k: 'O(log n)', f: log10Log2, use: 'Lũy thừa nhanh, Euclid', topics: ['modular-power', 'gcd-lcm'] },
    { k: 'O(√n)', f: function (L) { return L / 2; }, use: 'Duyệt ước đến √n', topics: ['divisors-primes'] },
    { k: 'O(n)', f: function (L) { return L; }, use: 'Một vòng lặp, cộng dồn, hai con trỏ', topics: ['prefix-sum', 'two-pointers'] },
    { k: 'O(n log n)', f: function (L) { return L + log10Log2(L); }, use: 'Sắp xếp, chặt nhị phân', topics: ['sorting', 'binary-search'] },
    { k: 'O(n²)', f: function (L) { return 2 * L; }, use: 'Hai vòng lặp, QHĐ hai chiều', topics: ['dp-intro', 'lis'] },
    { k: 'O(n³)', f: function (L) { return 3 * L; }, use: 'Ba vòng lặp lồng nhau, Floyd', topics: ['dijkstra'] },
    { k: 'O(2ⁿ)', f: function (L) { return Math.pow(10, L) * Math.log10(2); }, use: 'Duyệt tập con, quay lui', topics: ['backtracking'] },
    { k: 'O(n!)', f: log10Fact, use: 'Sinh hoán vị', topics: ['backtracking'] }
  ];
  var SCALE = 20, LIMIT = 8, PASS = Math.log10(1.3e8);

  function initLab() {
    var range = $('lab-range');
    if (!range) return;
    var rows = $('lab-rows'), out = $('lab-out'), verdict = $('lab-verdict'), scale = $('lab-scale');
    var rowEls = CLASSES.map(function (c) {
      var r = CP.el('div', { class: 'lab-row' });
      r.innerHTML = '<span class="k">' + c.k + '</span><span class="lab-track"><span class="lab-fill"></span><span class="lab-limit" style="left:' + (LIMIT / SCALE * 100) + '%"></span></span><span class="ops"></span>';
      rows.appendChild(r);
      return r;
    });
    [0, 4, 8, 12, 16, 20].forEach(function (p) {
      var s = CP.el('span', { class: p === LIMIT ? 'limit' : '' }, '10' + sup(p));
      s.style.left = (p / SCALE * 100) + '%';
      scale.appendChild(s);
    });
    function render() {
      var Ln = NS[+range.value];
      out.textContent = 'n = ' + (Ln <= 4 ? Math.round(Math.pow(10, Ln)).toLocaleString('vi-VN') : fmtPow(Ln));
      var best = null;
      CLASSES.forEach(function (c, i) {
        var L = c.f(Ln);
        var r = rowEls[i];
        r.classList.toggle('sat', L > LIMIT && L <= 9);
        r.classList.toggle('over', L > 9);
        r.querySelector('.lab-fill').style.width = Math.max(0.8, Math.min(L, SCALE) / SCALE * 100) + '%';
        r.querySelector('.ops').textContent = fmtPow(L);
        if (L <= PASS) best = c;
      });
      if (best) {
        var links = best.topics.map(function (s) { var t = CP.bySlug[s]; return t ? '<a href="' + CP.topicHref(s) + '">' + t.no + ' ' + CP.esc(t.title) + '</a>' : ''; }).filter(Boolean).join(', ');
        verdict.innerHTML = 'Thuật toán chậm nhất vẫn kịp 1 giây: <b>' + best.k + '</b>, ví dụ ' + best.use.toLowerCase() + '. Đọc thêm: ' + links + '.';
      }
    }
    range.addEventListener('input', render);
    render();
  }

  /* ---------- Bản đồ lộ trình ---------- */
  var state = { q: '', level: +CP.store.get('rm-level', 0) || 0, hide: !!CP.store.get('rm-hide', false) };
  // Bỏ dấu tiếng Việt, chữ thường, chỉ giữ chữ số và khoảng trắng (không cắt độ dài như slugify).
  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function exCount(slug) { var s = STATUS[slug]; return s && s.exercises ? s.exercises : 0; }

  function renderRoadmap() {
    var metro = $('metro'), strip = $('line-strip');
    if (!metro) return;
    metro.innerHTML = ''; strip.innerHTML = '';
    CP.roadmap.stages.forEach(function (st) {
      var a = CP.el('a', { href: '#' + st.id });
      a.style.setProperty('--line', st.lineVar);
      a.innerHTML = '<span class="c">' + st.code + '</span><span class="n">' + CP.esc(st.name) + '</span><span class="pbar"><i></i></span>';
      strip.appendChild(a);
      st._strip = a;

      var li = CP.el('li', { class: 'metro-stage', id: st.id });
      li.style.setProperty('--line', st.lineVar);
      li.innerHTML = '<div class="metro-head"><span class="metro-badge" aria-hidden="true">' + st.code + '</span>' +
        '<span class="weeks">' + st.code + ' · ' + CP.esc(st.weeks) + '</span>' +
        '<h3>' + CP.esc(st.name) + '</h3><p>' + CP.esc(st.goal) + '</p></div>';
      var ol = CP.el('ol', { class: 'stops' });
      st.topics.forEach(function (t) {
        var stop = CP.el('li', { class: 'stop' });
        stop.dataset.slug = t.slug;
        stop.dataset.level = t.level;
        stop.dataset.text = norm([t.title, t.short, t.slug, (t.tags || []).join(' '), st.name, st.code].join(' '));
        var n = exCount(t.slug);
        var ready = STATUS[t.slug] && STATUS[t.slug].ok;
        stop.innerHTML =
          '<a class="stop-card" href="' + CP.topicHref(t.slug) + '">' +
            '<span class="stop-no">' + t.no + '</span>' +
            '<span class="stop-title">' + CP.esc(t.title) + '</span>' +
            '<span class="stop-meta"><span class="chip level level-' + t.level + '">' + CP.LEVEL[t.level] + '</span>' +
              '<span>' + t.hours + ' giờ · ' + (ready ? '<span class="xc">' + n + ' bài tập</span>' : '<span class="pending">đang soạn</span>') + '</span></span>' +
            '<span class="stop-short">' + CP.esc(t.short) + '</span>' +
          '</a>' +
          '<button type="button" class="stop-check" aria-label="Đánh dấu đã học: ' + CP.esc(t.title) + '"></button>';
        var btn = stop.querySelector('.stop-check');
        btn.innerHTML = CP.icon.check;
        btn.addEventListener('click', function () {
          CP.setDone(t.slug, !CP.isDone(t.slug));
          paint(); applyFilter();
        });
        ol.appendChild(stop);
      });
      li.appendChild(ol);
      metro.appendChild(li);
    });
    paint();
    applyFilter();
  }

  function paint() {
    var total = 0, done = 0, firstTodo = null;
    CP.roadmap.stages.forEach(function (st) {
      var d = 0;
      st.topics.forEach(function (t) {
        var v = CP.isDone(t.slug);
        if (v) d++; else if (!firstTodo) firstTodo = t;
        var stop = doc.querySelector('.stop[data-slug="' + t.slug + '"]');
        if (stop) {
          stop.classList.toggle('done', v);
          var b = stop.querySelector('.stop-check');
          b.setAttribute('aria-pressed', String(v));
          b.title = v ? 'Đã học. Bấm để bỏ đánh dấu' : 'Bấm để đánh dấu đã học';
        }
      });
      total += st.topics.length; done += d;
      if (st._strip) st._strip.querySelector('i').style.setProperty('--w', (d / st.topics.length * 100) + '%');
      if (st._strip) st._strip.title = st.code + ': đã học ' + d + '/' + st.topics.length;
    });
    $('st-done').textContent = done;
    $('st-topics').textContent = total;
    $('st-stages').textContent = CP.roadmap.stages.length;
    var cta = $('cta-start');
    if (cta && done > 0 && firstTodo) {
      cta.href = CP.topicHref(firstTodo.slug);
      cta.textContent = 'Học tiếp: ' + firstTodo.no + ' ' + firstTodo.title;
    } else if (cta && done > 0 && !firstTodo) {
      cta.href = '#lo-trinh';
      cta.textContent = 'Bạn đã đi hết lộ trình';
    }
  }

  function applyFilter() {
    var q = norm(state.q.trim());
    var any = false;
    doc.querySelectorAll('.metro-stage').forEach(function (li) {
      var vis = 0;
      li.querySelectorAll('.stop').forEach(function (s) {
        var ok = (!q || s.dataset.text.indexOf(q) !== -1) &&
          (!state.level || +s.dataset.level === state.level) &&
          (!state.hide || !s.classList.contains('done'));
        s.hidden = !ok;
        if (ok) vis++;
      });
      li.hidden = vis === 0;
      if (vis) any = true;
    });
    $('metro-empty').hidden = any;
  }

  function initTools() {
    var q = $('rm-q'), seg = $('rm-level'), hide = $('rm-hide');
    q.addEventListener('input', function () { state.q = q.value; applyFilter(); });
    seg.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(+b.dataset.level === state.level));
      b.addEventListener('click', function () {
        state.level = +b.dataset.level;
        CP.store.set('rm-level', state.level);
        seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        applyFilter();
      });
    });
    hide.checked = state.hide;
    hide.addEventListener('change', function () { state.hide = hide.checked; CP.store.set('rm-hide', state.hide); applyFilter(); });
  }

  function initStats() {
    var sum = 0, has = false;
    Object.keys(STATUS).forEach(function (k) { if (STATUS[k] && STATUS[k].exercises) { sum += STATUS[k].exercises; has = true; } });
    $('st-ex').textContent = has ? sum : '—';
  }

  function boot() { initLab(); initTools(); renderRoadmap(); initStats(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
