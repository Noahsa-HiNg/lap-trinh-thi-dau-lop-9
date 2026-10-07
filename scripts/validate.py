#!/usr/bin/env python3
"""validate — kiểm tra trang chủ đề topics/<slug>.html có đúng chuẩn của dự án.

  python3 scripts/validate.py topics/sieve.html     # kiểm tra một file
  python3 scripts/validate.py                       # kiểm tra mọi chủ đề trong roadmap
  python3 scripts/validate.py --write-status        # + sinh data/status.js cho trang chủ (cần khóa)
  python3 scripts/validate.py --check-links         # + gửi request kiểm tra link bài tập (chậm)

Mã thoát 0 nếu không có LỖI (cảnh báo không làm hỏng).
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

REQUIRED_SECTIONS = [
    ("gioi-thieu", "Mô tả"),
    ("y-nghia", "Ý nghĩa và ứng dụng"),
    ("tai-sao", "Vì sao cần thuật toán này"),
    ("thuat-toan", "Các bước thuật toán"),
    ("hoat-dong", "Cách hoạt động"),
    ("truc-quan", "Minh họa trực quan"),
    ("cai-dat", "Cài đặt C++"),
    ("do-phuc-tap", "Độ phức tạp"),
    ("bien-the", "Biến thể và mở rộng"),
    ("loi-thuong-gap", "Lỗi thường gặp"),
    ("kiem-tra", "Tự kiểm tra"),
    ("bai-tap", "Bài tập luyện tập"),
    ("tham-khao", "Tài liệu tham khảo"),
    ("tom-tat", "Tóm tắt"),
]
MIN_EXERCISES = 5
MIN_QUIZ = 3
MIN_WORDS = 1800
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
        "path", "circle", "line", "rect", "ellipse", "polyline", "polygon", "stop", "use"}
OPTIONAL_CLOSE = {"p", "li", "td", "th", "tr", "thead", "tbody", "tfoot", "option", "dt", "dd"}
PRE_ALLOWED = {"code", "span", "b", "i", "em", "strong", "mark", "br", "a", "u", "sub", "sup", "s"}
SCRIPT_OK = re.compile(r"^(\.\./(data/roadmap\.js|assets/vendor/highlight\.min\.js|assets/js/main\.js|assets/js/viz/[a-z0-9-]+\.js)"
                       r"|https://(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/npm/|unpkg\.com)/)")


def load_roadmap() -> dict:
    txt = (ROOT / "data" / "roadmap.js").read_text(encoding="utf-8")
    start = txt.index("{", txt.index("window.ROADMAP"))
    return json.loads(txt[start:txt.rindex("}") + 1])


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, set[str], dict]] = []
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.body_topic: str | None = None
        self.title = ""
        self._in_title = False
        self.in_main = False
        self.sections: dict[str, dict] = {}
        self.cur_section: str | None = None
        self.section_depth = 0
        self.exercises: list[dict] = []
        self.cur_ex: dict | None = None
        self.quiz = 0
        self.solutions = 0
        self.cpp_blocks = 0
        self.pre_depth = 0
        self.visuals = {"stepper": 0, "frame": 0, "svg": 0, "viz": 0, "playground": 0, "arr": 0, "grid": 0, "bars": 0}
        self.scripts: list[str] = []
        self.words = 0
        self.ids: dict[str, int] = {}
        self.has_h2_in = set()

    # -- helpers
    def pos(self) -> str:
        return f"dòng {self.getpos()[0]}"

    def classes(self, attrs: dict) -> set[str]:
        return set((attrs.get("class") or "").split())

    def handle_starttag(self, tag, attrs_list):
        attrs = {k: (v or "") for k, v in attrs_list}
        cls = self.classes(attrs)
        if tag == "body":
            self.body_topic = attrs.get("data-topic")
        if tag == "title":
            self._in_title = True
        if "id" in attrs:
            i = attrs["id"]
            self.ids[i] = self.ids.get(i, 0) + 1
            if self.ids[i] == 2:
                self.errors.append(f"id trùng lặp '{i}' ({self.pos()})")
        if tag == "script" and attrs.get("src"):
            self.scripts.append(attrs["src"])
            if not SCRIPT_OK.match(attrs["src"]):
                self.errors.append(f"script ngoài danh sách cho phép: {attrs['src']} ({self.pos()})")
        if tag == "link" and attrs.get("rel") == "stylesheet":
            href = attrs.get("href", "")
            if not (href.startswith("https://fonts.googleapis.com") or href == "../assets/css/style.css"):
                self.errors.append(f"stylesheet ngoài danh sách cho phép: {href}")
        if tag == "main" and attrs.get("id") == "lesson":
            self.in_main = True
        if self.pre_depth and tag not in PRE_ALLOWED:
            self.errors.append(f"thẻ <{tag}> nằm trong <pre> ({self.pos()}): có thể quên thoát '<' thành '&lt;' trong code")
        if tag == "pre":
            self.pre_depth += 1
        if tag == "code" and self.pre_depth and "language-cpp" in cls:
            self.cpp_blocks += 1
        if self.in_main and tag == "section" and attrs.get("id"):
            if self.cur_section is None:
                self.cur_section = attrs["id"]
                self.section_depth = len(self.stack)
                self.sections[self.cur_section] = {"h2": None, "line": self.getpos()[0]}
        if tag == "h2" and self.cur_section:
            self._h2_target = self.cur_section
            self._h2_buf = []
        if self.cur_section == "bai-tap" and tag == "li" and "exercise" in cls:
            self.cur_ex = {"href": None, "judge": False, "level": False, "lang": attrs.get("data-lang"), "vi": False,
                           "title": "", "line": self.getpos()[0], "depth": len(self.stack)}
            self.exercises.append(self.cur_ex)
        if self.cur_ex is not None:
            if tag == "a" and "ex-title" in cls:
                self.cur_ex["href"] = attrs.get("href")
                self._in_ex_title = True
            if "judge" in cls:
                self.cur_ex["judge"] = True
            if "level" in cls:
                self.cur_ex["level"] = True
            if "lang-tag" in cls and "vi" in cls:
                self.cur_ex["vi"] = True
        if self.in_main:
            if "quiz" in cls:
                self.quiz += 1
            if tag == "details" and "solution" in cls and self.cur_section == "kiem-tra":
                self.solutions += 1
            if "stepper" in cls:
                self.visuals["stepper"] += 1
            if "frame" in cls:
                self.visuals["frame"] += 1
            if tag == "svg":
                self.visuals["svg"] += 1
            if "viz" in cls:
                self.visuals["viz"] += 1
            if "playground" in cls:
                self.visuals["playground"] += 1
            if "arr" in cls:
                self.visuals["arr"] += 1
            if "grid-viz" in cls:
                self.visuals["grid"] += 1
            if "bars" in cls:
                self.visuals["bars"] += 1
        if tag not in VOID and not tag.endswith("/"):
            self.stack.append((tag, cls, attrs))

    def handle_startendtag(self, tag, attrs):
        # <x /> — không đẩy vào ngăn xếp
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1][0] == tag and tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "pre" and self.pre_depth:
            self.pre_depth -= 1
        if tag == "h2" and getattr(self, "_h2_target", None):
            sec = self.sections.get(self._h2_target)
            if sec is not None and sec["h2"] is None:
                sec["h2"] = "".join(self._h2_buf).strip()
            self._h2_target = None
        if tag == "a":
            self._in_ex_title = False
        if tag in VOID:
            return
        names = [t for t, _, _ in self.stack]
        if tag not in names:
            if tag not in OPTIONAL_CLOSE:
                self.errors.append(f"thẻ đóng </{tag}> thừa ({self.pos()})")
            return
        while self.stack:
            t, _, _ = self.stack.pop()
            if t == tag:
                break
            if t not in OPTIONAL_CLOSE:
                self.errors.append(f"thẻ <{t}> chưa đóng trước </{tag}> ({self.pos()})")
        if self.cur_ex is not None and len(self.stack) < self.cur_ex["depth"] + 1 and tag == "li":
            self.cur_ex = None
        if tag == "section" and self.cur_section and len(self.stack) <= self.section_depth:
            self.cur_section = None
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if getattr(self, "_h2_target", None):
            self._h2_buf.append(data)
        if self.cur_ex is not None and getattr(self, "_in_ex_title", False):
            self.cur_ex["title"] += data
        if self.in_main and not self.pre_depth:
            self.words += len(re.findall(r"\w+", data))


def check_file(path: Path, roadmap: dict, node: bool) -> dict:
    slugs = {t["slug"]: t for st in roadmap["stages"] for t in st["topics"]}
    try:
        rel = str(path.relative_to(ROOT))
    except ValueError:
        rel = str(path)
    res = {"file": rel, "errors": [], "warnings": []}
    try:
        html = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        res["errors"].append("không tìm thấy file")
        return res
    p = Page()
    p.feed(html)
    p.close()
    E, W = res["errors"], res["warnings"]
    E.extend(p.errors)
    W.extend(p.warnings)
    slug = path.stem
    if p.body_topic != slug:
        E.append(f"<body data-topic=\"{p.body_topic}\"> phải trùng tên file '{slug}'")
    if slug not in slugs:
        E.append(f"slug '{slug}' không có trong data/roadmap.js")
    if not p.title.strip() or "TÊN CHỦ ĐỀ" in p.title:
        E.append("thiếu <title> hoặc còn chữ mẫu")
    if "SLUG" in html.replace("data-topic=\"SLUG\"", ""):
        W.append("còn chữ mẫu 'SLUG' trong file")
    for need in ("../data/roadmap.js", "../assets/js/main.js"):
        if need not in p.scripts:
            E.append(f"thiếu <script src=\"{need}\">")
    for sid, label in REQUIRED_SECTIONS:
        sec = p.sections.get(sid)
        if not sec:
            E.append(f"thiếu <section id=\"{sid}\"> ({label})")
        elif not sec["h2"]:
            E.append(f"section #{sid} thiếu <h2>")
    order = [s for s in p.sections if s in dict(REQUIRED_SECTIONS)]
    expected = [s for s, _ in REQUIRED_SECTIONS if s in p.sections]
    if order != expected:
        W.append("thứ tự các section bắt buộc khác chuẩn: " + " → ".join(order))
    ex = p.exercises
    if len(ex) < MIN_EXERCISES:
        E.append(f"chỉ có {len(ex)} bài tập (cần ≥ {MIN_EXERCISES})")
    seen = set()
    for i, e in enumerate(ex, 1):
        href = e["href"] or ""
        if not href.startswith("http"):
            E.append(f"bài tập #{i} (dòng {e['line']}) thiếu link http(s) ở a.ex-title")
        if "MA_BAI" in href or "/task/0000" in href:
            E.append(f"bài tập #{i} còn link mẫu")
        if href in seen:
            W.append(f"bài tập #{i} trùng link {href}")
        seen.add(href)
        if not e["judge"]:
            W.append(f"bài tập #{i} thiếu .judge")
        if not e["level"]:
            W.append(f"bài tập #{i} thiếu .level")
    vi = sum(1 for e in ex if e["vi"])
    if ex and vi == 0:
        W.append("không có bài tập tiếng Việt nào (ưu tiên VNOJ, LQDOJ, MarisaOJ…)")
    if p.cpp_blocks < 1:
        E.append("cần ít nhất 1 khối <pre><code class=\"language-cpp\">")
    if p.quiz + p.solutions < MIN_QUIZ:
        E.append(f"phần Tự kiểm tra cần ≥ {MIN_QUIZ} câu (.quiz hoặc details.solution), đang có {p.quiz + p.solutions}")
    vis = p.visuals
    if vis["stepper"] < 1:
        E.append("cần ít nhất 1 .stepper (minh họa từng bước) trong phần Minh họa trực quan")
    elif vis["frame"] < 4:
        W.append(f"stepper chỉ có {vis['frame']} khung hình (nên ≥ 4)")
    if p.words < MIN_WORDS:
        W.append(f"nội dung hơi ngắn: {p.words} từ (nên ≥ {MIN_WORDS})")
    for s in p.scripts:
        m = re.match(r"\.\./assets/js/viz/([a-z0-9-]+)\.js", s)
        if m:
            f = ROOT / "assets" / "js" / "viz" / f"{m.group(1)}.js"
            if not f.exists():
                E.append(f"script {s} không tồn tại")
            elif node and shutil.which("node"):
                r = subprocess.run(["node", "--check", str(f)], capture_output=True, text=True)
                if r.returncode != 0:
                    E.append(f"lỗi cú pháp JS trong {f.name}: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else ''}")
    for m in re.finditer(r'href="([a-z0-9-]+)\.html', html):
        if m.group(1) not in slugs and m.group(1) != "index":
            W.append(f"liên kết tới chủ đề không tồn tại: {m.group(1)}.html")
    res["stats"] = {
        "exercises": len(ex),
        "vi": vi,
        "words": p.words,
        "cpp": p.cpp_blocks,
        "quiz": p.quiz + p.solutions,
        "frames": vis["frame"],
        "svg": vis["svg"],
        "playground": vis["playground"],
    }
    res["links"] = [(e["href"], e["title"].strip()) for e in ex if e["href"]]
    return res


def check_links(results: list[dict]) -> None:
    jobs = [(r, href) for r in results for href, _ in r.get("links", [])]

    def probe(href: str) -> str | None:
        req = urllib.request.Request(href, method="GET", headers={"User-Agent": "Mozilla/5.0 (cp9-validate)"})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return None if resp.status < 400 else f"HTTP {resp.status}"
        except urllib.error.HTTPError as e:  # type: ignore[attr-defined]
            return None if e.code in (401, 403, 429) else f"HTTP {e.code}"
        except Exception as e:  # noqa: BLE001
            return type(e).__name__

    with ThreadPoolExecutor(max_workers=8) as pool:
        outs = list(pool.map(lambda j: probe(j[1]), jobs))
    for (r, href), err in zip(jobs, outs):
        if err:
            r["warnings"].append(f"link bài tập có thể hỏng ({err}): {href}")


def write_status(results: list[dict], roadmap: dict) -> None:
    from agentctl import acquire, release, write_atomic  # dùng chung cơ chế khóa
    ok, info = acquire("data/status.js", "validate", None, 300, 60, "write status")
    if not ok:
        print(f"data/status.js đang bị khóa bởi {info.get('agent')}", file=sys.stderr)
        sys.exit(2)
    try:
        by = {Path(r["file"]).stem: r for r in results}
        data = {}
        for st in roadmap["stages"]:
            for t in st["topics"]:
                r = by.get(t["slug"])
                if not r or not (ROOT / "topics" / f"{t['slug']}.html").exists():
                    data[t["slug"]] = {"ok": False}
                    continue
                s = r.get("stats", {})
                data[t["slug"]] = {"ok": not r["errors"], "exercises": s.get("exercises", 0), "vi": s.get("vi", 0),
                                   "words": s.get("words", 0), "frames": s.get("frames", 0), "interactive": s.get("playground", 0) > 0}
        stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        body = ("/* data/status.js — SINH TỰ ĐỘNG bởi scripts/validate.py --write-status. Đừng sửa tay. */\n"
                f"/* {stamp} */\nwindow.TOPIC_STATUS = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
        write_atomic(ROOT / "data" / "status.js", body)
        print(f"đã ghi data/status.js ({sum(1 for v in data.values() if v.get('ok'))}/{len(data)} chủ đề đạt)")
    finally:
        release("data/status.js", "validate")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*")
    ap.add_argument("--write-status", action="store_true")
    ap.add_argument("--check-links", action="store_true")
    ap.add_argument("--no-node", action="store_true", help="không chạy node --check cho widget")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("-q", "--quiet", action="store_true", help="chỉ in lỗi")
    a = ap.parse_args()
    roadmap = load_roadmap()
    if a.files:
        paths = [Path(f).resolve() for f in a.files]
    else:
        paths = [ROOT / "topics" / f"{t['slug']}.html" for st in roadmap["stages"] for t in st["topics"]]
        paths = [p for p in paths if p.exists()]
    results = [check_file(p, roadmap, not a.no_node) for p in paths]
    if a.check_links:
        check_links(results)
    if a.json:
        print(json.dumps([{k: v for k, v in r.items() if k != "links"} for r in results], ensure_ascii=False, indent=2))
    else:
        for r in results:
            s = r.get("stats", {})
            head = "LỖI" if r["errors"] else "OK "
            print(f"{head} {r['file']}  ·  {s.get('exercises', 0)} bài tập ({s.get('vi', 0)} VI) · {s.get('words', 0)} từ · "
                  f"{s.get('frames', 0)} khung hình · {s.get('quiz', 0)} câu hỏi")
            for e in r["errors"]:
                print(f"    ✗ {e}")
            if not a.quiet:
                for w in r["warnings"]:
                    print(f"    ! {w}")
        bad = sum(1 for r in results if r["errors"])
        print(f"\n{len(results) - bad}/{len(results)} file đạt chuẩn.")
    if a.write_status:
        write_status(results, roadmap)
    return 1 if any(r["errors"] for r in results) else 0


if __name__ == "__main__":
    sys.exit(main())
