/*
 * assets/js/main.js — runtime dùng chung cho mọi trang.
 * TÀI NGUYÊN DÙNG CHUNG: phải giữ khóa "assets/js/main.js" trước khi sửa.
 *
 * Trang chủ:   <body data-page="home">
 * Trang bài:   <body data-page="topic" data-topic="<slug>">  +  <main id="lesson" class="lesson">…</main>
 *
 * Tự dựng: thanh trên cùng, đầu bài (lấy từ data/roadmap.js), mục lục, nút "đã học",
 * chuyển bài trước/sau, chân trang. Tự kích hoạt: tô màu code, nút sao chép,
 * .stepper (trình chiếu từng bước), .quiz, bọc bảng tràn ngang.
 * API cho widget riêng (assets/js/viz/<slug>.js): window.CP (xem cuối file).
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');

  /* ---------- Lưu trữ cục bộ (luôn bọc try/catch) ---------- */
  var PREFIX = 'cp9:';
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PREFIX + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ }
    }
  };

  /* ---------- Chủ đề sáng / tối ---------- */
  var savedTheme = store.get('theme', null);
  if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('theme', next);
    syncThemeButtons();
  }
  function syncThemeButtons() {
    var dark = effectiveTheme() === 'dark';
    doc.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.innerHTML = dark ? ICON.sun : ICON.moon;
      b.setAttribute('aria-label', dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối');
      b.title = b.getAttribute('aria-label');
    });
  }

  var ICON = {
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5l5 5L19.5 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5v14l12-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    first: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M17 5v14L6 12z"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5v14l11-7z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
  };

  /* ---------- Chỉ mục lộ trình ---------- */
  var R = window.ROADMAP || { stages: [] };
  var order = [];
  var bySlug = {};
  R.stages.forEach(function (st, si) {
    st.index = si;
    st.lineVar = 'var(--l' + (st.color || si + 1) + ')';
    st.topics.forEach(function (t, ti) {
      t.stage = st;
      t.no = (si + 1) + '.' + (ti + 1);
      t.idx = order.length;
      order.push(t);
      bySlug[t.slug] = t;
    });
  });
  var LEVEL = { 1: 'Cơ bản', 2: 'Vận dụng', 3: 'Nâng cao' };

  var page = doc.body.getAttribute('data-page') || 'topic';
  var base = page === 'home' ? '' : '../';
  function topicHref(slug) { return (page === 'home' ? 'topics/' : '') + slug + '.html'; }
  function isDone(slug) { return !!store.get('done:' + slug, false); }
  function setDone(slug, v) { store.set('done:' + slug, !!v); }

  /* ---------- Tiện ích DOM ---------- */
  function el(tag, attrs, html) {
    var n = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function slugify(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'muc';
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Thanh trên cùng & chân trang ---------- */
  function buildTopbar(crumbsHtml, navHtml) {
    var bar = el('header', { class: 'topbar' });
    bar.innerHTML =
      '<div class="topbar-inner">' +
        '<a class="brand" href="' + base + 'index.html" aria-label="Về trang chủ lộ trình">' +
          '<span class="brand-mark">9</span>' +
          '<span class="brand-name">Thi đấu lớp 9<small>Lộ trình C++</small></span>' +
        '</a>' +
        (crumbsHtml ? '<nav class="crumbs" aria-label="Vị trí">' + crumbsHtml + '</nav>' : '') +
        '<nav class="topnav" aria-label="Điều hướng">' + (navHtml || '') +
          '<button type="button" class="icon-btn" data-theme-toggle></button>' +
        '</nav>' +
      '</div>' +
      '<div class="read-progress" aria-hidden="true"></div>';
    doc.body.insertBefore(bar, doc.body.firstChild);
    var skip = el('a', { class: 'skip-link', href: page === 'home' ? '#lo-trinh' : '#lesson' }, 'Bỏ qua, tới nội dung');
    doc.body.insertBefore(skip, doc.body.firstChild);
    bar.querySelector('[data-theme-toggle]').addEventListener('click', toggleTheme);
    return bar;
  }
  function buildFooter() {
    var f = el('footer', { class: 'site-footer' });
    f.innerHTML = '<div class="site-footer-inner">' +
      '<span>Lộ trình Lập trình Thi đấu lớp 9 · Ngôn ngữ C++ · Dựa trên giáo án 16 tuần</span>' +
      '<span><a href="' + base + 'index.html#lo-trinh">Bản đồ lộ trình</a> · <a href="' + base + 'index.html#luyen-bai">Nơi luyện bài</a></span>' +
      '</div>';
    doc.body.appendChild(f);
  }
  function readProgress(bar) {
    var p = bar.querySelector('.read-progress');
    var tick = false;
    function upd() {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      p.style.setProperty('--p', h > 0 ? Math.min(1, window.scrollY / h) : 0);
      tick = false;
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- Trang bài học ---------- */
  function buildTopicPage() {
    var slug = doc.body.getAttribute('data-topic');
    var t = bySlug[slug];
    var lesson = doc.getElementById('lesson');
    if (!lesson) return;
    if (!t) { console.warn('[CP9] Không tìm thấy chủ đề "' + slug + '" trong data/roadmap.js'); t = { title: doc.title, short: '', level: 1, hours: 2, prereq: [], no: '', stage: { code: '', name: '', lineVar: 'var(--accent)', id: '' }, idx: -1 }; }
    doc.body.style.setProperty('--stage', t.stage.lineVar);

    var crumbs = '<a href="../index.html#lo-trinh">Lộ trình</a><span class="sep">/</span>' +
      '<a href="../index.html#' + esc(t.stage.id) + '">' + esc(t.stage.code) + '</a><span class="sep">/</span>' +
      '<span class="here">' + esc(t.title) + '</span>';
    var bar = buildTopbar(crumbs, '');
    readProgress(bar);

    // Đầu bài
    var prereq = (t.prereq || []).map(function (s) {
      var p = bySlug[s]; return p ? '<a href="' + s + '.html">' + esc(p.title) + '</a>' : esc(s);
    }).join(', ') || 'Không cần';
    var nEx = lesson.querySelectorAll('#bai-tap .exercise').length;
    var hero = el('header', { class: 'lesson-hero oli' });
    hero.innerHTML = '<div class="lesson-hero-inner">' +
      '<a class="stage-chip" href="../index.html#' + esc(t.stage.id) + '">' + esc(t.stage.code) + ' · ' + esc(t.stage.name) + '</a>' +
      '<h1 class="lesson-title"><span class="no">' + esc(t.no) + '</span>' + esc(t.title) + '</h1>' +
      '<p class="lesson-summary">' + esc(t.short) + '</p>' +
      '<div class="meta-row">' +
        '<div class="meta"><span class="meta-k">Mức độ</span><span class="meta-v"><span class="chip level level-' + t.level + '">' + LEVEL[t.level] + '</span></span></div>' +
        '<div class="meta"><span class="meta-k">Thời lượng</span><span class="meta-v">khoảng ' + t.hours + ' giờ</span></div>' +
        '<div class="meta"><span class="meta-k">Bài tập</span><span class="meta-v">' + nEx + ' bài</span></div>' +
        '<div class="meta"><span class="meta-k">Nên học trước</span><span class="meta-v">' + prereq + '</span></div>' +
      '</div></div>';

    // Bố cục 2 cột: mục lục + bài
    var wrap = el('div', { class: 'page' });
    var toc = el('aside', { class: 'toc', 'aria-label': 'Mục lục' });
    lesson.parentNode.insertBefore(hero, lesson);
    lesson.parentNode.insertBefore(wrap, lesson);
    wrap.appendChild(toc);
    wrap.appendChild(lesson);
    buildToc(lesson, toc);

    // Cuối bài
    var end = el('div', { class: 'lesson-end' });
    var done = el('button', { type: 'button', class: 'done-toggle', 'aria-pressed': String(isDone(slug)) });
    function paintDone() { var d = done.getAttribute('aria-pressed') === 'true'; done.innerHTML = ICON.check + (d ? 'Đã học xong bài này' : 'Đánh dấu đã học xong'); }
    done.addEventListener('click', function () {
      var v = done.getAttribute('aria-pressed') !== 'true';
      done.setAttribute('aria-pressed', String(v)); setDone(slug, v); paintDone();
    });
    paintDone();
    end.appendChild(done);
    var prev = order[t.idx - 1], next = order[t.idx + 1];
    var pager = el('nav', { class: 'pager', 'aria-label': 'Chuyển bài' });
    pager.innerHTML =
      (prev ? '<a class="prev" href="' + prev.slug + '.html"><span class="k">← Bài trước · ' + prev.no + '</span><span class="t">' + esc(prev.title) + '</span></a>' : '<span></span>') +
      (next ? '<a class="next" href="' + next.slug + '.html"><span class="k">Bài tiếp · ' + next.no + ' →</span><span class="t">' + esc(next.title) + '</span></a>' : '<a class="next" href="../index.html#lo-trinh"><span class="k">Hoàn thành lộ trình →</span><span class="t">Về bản đồ lộ trình</span></a>');
    end.appendChild(pager);
    lesson.appendChild(end);
    buildFooter();
  }

  function buildToc(lesson, toc) {
    var sections = Array.prototype.slice.call(lesson.querySelectorAll(':scope > section[id]'));
    var det = el('details');
    var mq = window.matchMedia ? window.matchMedia('(min-width: 1001px)') : { matches: true };
    if (mq.matches) det.open = true;
    det.appendChild(el('summary', null, 'Mục lục'));
    var ol = el('ol');
    var links = [];
    var n = 0;
    sections.forEach(function (sec) {
      var h2 = sec.querySelector(':scope > h2');
      if (!h2 || sec.classList.contains('objectives')) return;
      n++;
      var li = el('li');
      var a = el('a', { href: '#' + sec.id }, '<span class="n">' + (n < 10 ? '0' + n : n) + '</span><span>' + esc(h2.textContent) + '</span>');
      li.appendChild(a);
      links.push({ a: a, target: sec });
      var h3s = sec.querySelectorAll('h3');
      if (h3s.length && h3s.length <= 8) {
        var sub = el('ol');
        h3s.forEach(function (h3) {
          if (!h3.id) h3.id = sec.id + '-' + slugify(h3.textContent);
          var sa = el('a', { href: '#' + h3.id }, '<span>' + esc(h3.textContent) + '</span>');
          var sli = el('li'); sli.appendChild(sa); sub.appendChild(sli);
        });
        li.appendChild(sub);
      }
      ol.appendChild(li);
    });
    det.appendChild(ol);
    toc.appendChild(det);
    toc.addEventListener('click', function (e) {
      if (e.target.closest('a') && !mq.matches) det.open = false;
    });
    if (!('IntersectionObserver' in window) || !links.length) return;
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var hit = links.filter(function (l) { return l.target === en.target; })[0];
          if (hit && hit !== current) {
            if (current) current.a.classList.remove('active');
            hit.a.classList.add('active'); current = hit;
          }
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    links.forEach(function (l) { io.observe(l.target); });
  }

  /* ---------- Code: tô màu + sao chép ---------- */
  function enhanceCode(scope) {
    (scope || doc).querySelectorAll('pre > code').forEach(function (code) {
      if (code.dataset.cpReady) return;
      code.dataset.cpReady = '1';
      if (!/\blanguage-/.test(code.className) && !code.closest('.io')) code.classList.add('language-cpp');
      if (window.hljs && !/\blanguage-(text|plaintext|none)\b/.test(code.className)) {
        try { window.hljs.highlightElement(code); } catch (e) { /* bỏ qua */ }
      }
      if (code.closest('.io')) return;
      var pre = code.parentNode;
      var fig = pre.closest('figure.code');
      var host = fig ? fig.querySelector('figcaption') : null;
      var btn = el('button', { type: 'button', class: 'copy-btn' }, 'Sao chép');
      btn.addEventListener('click', function () {
        var text = code.innerText;
        function ok() { btn.textContent = 'Đã chép'; btn.classList.add('done'); setTimeout(function () { btn.textContent = 'Sao chép'; btn.classList.remove('done'); }, 1600); }
        function fallback() {
          var r = doc.createRange(); r.selectNodeContents(code);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          btn.textContent = 'Nhấn Ctrl+C';
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
        else fallback();
      });
      if (host) host.appendChild(btn);
      else { pre.style.position = 'relative'; pre.appendChild(btn); }
    });
  }

  /* ---------- Bọc bảng tràn ngang ---------- */
  function wrapTables(scope) {
    (scope || doc).querySelectorAll('table').forEach(function (t) {
      if (t.closest('.table-wrap') || t.closest('.stepper .frame .arr')) return;
      var w = el('div', { class: 'table-wrap' });
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }

  /* ---------- Trình chiếu từng bước ----------
     <div class="stepper" data-title="Tiêu đề">
       <div class="frame" data-caption="Mô tả bước (cho phép HTML đơn giản)"> …minh họa… </div>
       …
     </div>                                                              */
  function initStepper(s) {
    if (s.dataset.cpReady) return;
    s.dataset.cpReady = '1';
    var frames = Array.prototype.slice.call(s.querySelectorAll(':scope > .frame'));
    if (!frames.length) return;
    var title = s.getAttribute('data-title') || 'Minh họa từng bước';
    var head = el('div', { class: 'stepper-head' }, '<p class="viz-title">' + esc(title) + '</p><span class="stepper-count"></span>');
    var stage = el('div', { class: 'stepper-stage' });
    frames.forEach(function (f) { stage.appendChild(f); });
    var cap = el('div', { class: 'stepper-caption', 'aria-live': 'polite' });
    var ctr = el('div', { class: 'stepper-controls' });
    var bFirst = el('button', { type: 'button', 'aria-label': 'Về bước đầu', title: 'Về bước đầu' }, ICON.first);
    var bPrev = el('button', { type: 'button' }, ICON.prev + ' Trước');
    var bNext = el('button', { type: 'button', class: 'primary' }, 'Sau ' + ICON.next);
    var bPlay = el('button', { type: 'button' }, ICON.play + ' Tự chạy');
    var dots = el('div', { class: 'stepper-dots' });
    frames.forEach(function (_, i) {
      var d = el('button', { type: 'button', 'aria-label': 'Bước ' + (i + 1) });
      d.addEventListener('click', function () { stop(); go(i); });
      dots.appendChild(d);
    });
    [bFirst, bPrev, bNext, bPlay, dots].forEach(function (b) { ctr.appendChild(b); });
    s.innerHTML = '';
    s.appendChild(head); s.appendChild(stage); s.appendChild(cap); s.appendChild(ctr);
    s.tabIndex = 0;
    var i = 0, timer = null;
    var speed = parseInt(s.getAttribute('data-speed') || '1700', 10);
    function go(k) {
      i = Math.max(0, Math.min(frames.length - 1, k));
      frames.forEach(function (f, j) { f.classList.toggle('on', j === i); });
      Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle('on', j === i); });
      var c = frames[i].getAttribute('data-caption');
      var inner = frames[i].querySelector('.frame-caption');
      cap.innerHTML = c != null ? c : (inner ? inner.innerHTML : '');
      head.querySelector('.stepper-count').textContent = 'Bước ' + (i + 1) + '/' + frames.length;
      bFirst.disabled = bPrev.disabled = i === 0;
      bNext.disabled = i === frames.length - 1;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.innerHTML = ICON.play + ' Tự chạy'; } }
    function play() {
      if (timer) { stop(); return; }
      if (i === frames.length - 1) go(0);
      bPlay.innerHTML = ICON.pause + ' Dừng';
      timer = setInterval(function () { if (i >= frames.length - 1) stop(); else go(i + 1); }, reduceMotion ? Math.max(speed, 2500) : speed);
    }
    bFirst.addEventListener('click', function () { stop(); go(0); });
    bPrev.addEventListener('click', function () { stop(); go(i - 1); });
    bNext.addEventListener('click', function () { stop(); go(i + 1); });
    bPlay.addEventListener('click', play);
    s.addEventListener('keydown', function (e) {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); go(i - 1); }
    });
    go(0);
  }

  /* ---------- Câu hỏi trắc nghiệm ---------- */
  function initQuiz(q) {
    if (q.dataset.cpReady) return;
    q.dataset.cpReady = '1';
    var opts = q.querySelectorAll('.quiz-opt');
    opts.forEach(function (o) {
      if (o.tagName !== 'BUTTON') o.setAttribute('role', 'button');
      o.addEventListener('click', function () {
        if (q.classList.contains('answered')) return;
        q.classList.add('answered');
        opts.forEach(function (x) {
          if (x.hasAttribute('data-correct')) x.classList.add('right');
          x.disabled = true;
        });
        if (!o.hasAttribute('data-correct')) o.classList.add('wrong');
      });
    });
  }

  function enhance(scope) {
    var s = scope || doc;
    wrapTables(s);
    enhanceCode(s);
    s.querySelectorAll('.stepper').forEach(initStepper);
    s.querySelectorAll('.quiz').forEach(initQuiz);
    s.querySelectorAll('.exercise a.ex-title, .refs a, a[href^="http"]').forEach(function (a) {
      if (/^https?:/.test(a.getAttribute('href') || '')) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }

  /* ---------- Khởi động ---------- */
  function boot() {
    if (page === 'topic') buildTopicPage();
    else if (page === 'home') {
      var bar = buildTopbar('',
        '<a href="#lo-trinh">Lộ trình</a>' +
        '<a class="hide-sm" href="#tuan">16 tuần</a>' +
        '<a class="hide-sm" href="#phong-thi">Phòng thi</a>' +
        '<a class="hide-sm" href="#luyen-bai">Luyện bài</a>');
      readProgress(bar);
      buildFooter();
    }
    syncThemeButtons();
    enhance(doc);
    if (window.matchMedia) {
      var m = window.matchMedia('(prefers-color-scheme: dark)');
      if (m.addEventListener) m.addEventListener('change', syncThemeButtons);
    }
    doc.dispatchEvent(new CustomEvent('cp:ready'));
  }

  /* ---------- API công khai ---------- */
  window.CP = {
    roadmap: R,
    order: order,
    bySlug: bySlug,
    LEVEL: LEVEL,
    store: store,
    isDone: isDone,
    setDone: setDone,
    topicHref: topicHref,
    el: el,
    esc: esc,
    slugify: slugify,
    icon: ICON,
    reduceMotion: reduceMotion,
    enhance: enhance,
    /* Chờ ms mili-giây (dùng trong hoạt hình của widget). */
    sleep: function (ms) { return new Promise(function (r) { setTimeout(r, reduceMotion ? Math.min(ms, 60) : ms); }); },
    /* Gắn widget khi trang sẵn sàng: CP.mount('#viz-sieve', function (root) { … }) */
    mount: function (sel, fn) {
      function run() { doc.querySelectorAll(sel).forEach(function (n) { try { fn(n); } catch (e) { console.error('[CP9] widget lỗi:', e); } }); }
      if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', run); else run();
    }
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
