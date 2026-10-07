#!/usr/bin/env python3
"""agentctl — điều phối nhiều agent cùng làm việc trên một kho mã.

Ba cơ chế chống va chạm:

  session   Mỗi agent mở một phiên (.agents/sessions/<id>.json) để mọi người biết
            ai đang làm gì. Chỉ chủ phiên được ghi file phiên của mình.
  lock      Khóa theo tài nguyên (đường dẫn file). Tạo nguyên tử bằng O_CREAT|O_EXCL,
            có thời hạn (TTL); khóa hết hạn có thể bị chiếm lại an toàn.
  log       Nhật ký công việc dạng JSONL, chỉ nối thêm (O_APPEND), mỗi dòng ghi
            bằng một lệnh write() nên nhiều agent ghi song song không xen lẫn.
            `worklog render` gộp thành WORKLOG.md cho người đọc.

Ví dụ:
  SID=$(python3 scripts/agentctl.py session start --agent topic-sieve --task "Soạn chủ đề sieve" --topic sieve)
  python3 scripts/agentctl.py lock acquire topics/sieve.html --agent topic-sieve --session "$SID"
  python3 scripts/agentctl.py log --agent topic-sieve --session "$SID" --kind progress "Đã viết phần mô tả"
  python3 scripts/agentctl.py lock release topics/sieve.html --agent topic-sieve
  python3 scripts/agentctl.py session end "$SID" --status done --summary "Hoàn thành, 8 bài tập"

Mã thoát: 0 thành công · 2 tài nguyên đang bị khóa bởi agent khác · 3 không phải chủ khóa/phiên · 1 lỗi khác.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import secrets
import socket
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AGENTS_DIR = ROOT / ".agents"
LOCK_DIR = AGENTS_DIR / "locks"
SESSION_DIR = AGENTS_DIR / "sessions"
WORKLOG_DIR = AGENTS_DIR / "worklog"
DEFAULT_TTL = 2 * 60 * 60  # 2 giờ

KINDS = ("start", "progress", "done", "blocked", "note", "handoff", "error", "commit")


# ---------------------------------------------------------------- tiện ích
def now() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime | None = None) -> str:
    return (dt or now()).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_iso(s: str) -> datetime:
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)


def die(msg: str, code: int = 1) -> None:
    print(f"agentctl: {msg}", file=sys.stderr)
    sys.exit(code)


def norm_resource(res: str) -> str:
    """Chuẩn hóa tên tài nguyên về đường dẫn tương đối kiểu posix tính từ gốc repo."""
    p = Path(res)
    if p.is_absolute():
        try:
            p = p.resolve().relative_to(ROOT)
        except ValueError:
            die(f"tài nguyên nằm ngoài repo: {res}")
    s = os.path.normpath(p.as_posix()).replace(os.sep, "/")
    if s == ".." or s.startswith("../"):
        die(f"tài nguyên nằm ngoài repo: {res}")
    return s


def lock_path(resource: str) -> Path:
    safe = re.sub(r"[^A-Za-z0-9._-]", "__", resource.replace("/", "__"))
    return LOCK_DIR / f"{safe}.lock"


def write_atomic(path: Path, data: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.{secrets.token_hex(3)}.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def read_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return None


# ---------------------------------------------------------------- nhật ký
def append_log(agent: str, kind: str, message: str, session: str | None = None,
               topic: str | None = None, files: list[str] | None = None) -> dict:
    WORKLOG_DIR.mkdir(parents=True, exist_ok=True)
    entry = {"ts": iso(), "agent": agent, "kind": kind, "msg": message}
    if session:
        entry["session"] = session
    if topic:
        entry["topic"] = topic
    if files:
        entry["files"] = files
    line = (json.dumps(entry, ensure_ascii=False) + "\n").encode("utf-8")
    path = WORKLOG_DIR / f"{now():%Y-%m-%d}.jsonl"
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
    try:
        os.write(fd, line)  # một lần write() → không xen lẫn giữa các tiến trình
    finally:
        os.close(fd)
    return entry


def read_all_logs() -> list[dict]:
    out: list[dict] = []
    for p in sorted(WORKLOG_DIR.glob("*.jsonl")):
        for ln in p.read_text(encoding="utf-8").splitlines():
            ln = ln.strip()
            if not ln:
                continue
            try:
                out.append(json.loads(ln))
            except json.JSONDecodeError:
                continue
    out.sort(key=lambda e: e.get("ts", ""))
    return out


# ---------------------------------------------------------------- khóa
def lock_info(resource: str) -> dict | None:
    return read_json(lock_path(resource))


def is_expired(info: dict) -> bool:
    try:
        return parse_iso(info["expires_at"]) <= now()
    except (KeyError, ValueError):
        return True


def acquire(resource: str, agent: str, session: str | None, ttl: int, wait: int, note: str | None) -> tuple[bool, dict | None]:
    LOCK_DIR.mkdir(parents=True, exist_ok=True)
    path = lock_path(resource)
    deadline = time.monotonic() + max(0, wait)
    while True:
        info = {
            "resource": resource,
            "agent": agent,
            "session": session,
            "host": socket.gethostname(),
            "pid": os.getppid(),
            "acquired_at": iso(),
            "expires_at": iso(datetime.fromtimestamp(time.time() + ttl, timezone.utc)),
            "note": note,
        }
        try:
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o644)
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(info, f, ensure_ascii=False, indent=2)
            return True, info
        except FileExistsError:
            cur = read_json(path)
            if cur is None:
                time.sleep(0.2)  # file đang được ghi dở; thử lại
                continue
            if cur.get("agent") == agent:
                # vào lại khóa của chính mình → gia hạn
                cur["expires_at"] = info["expires_at"]
                if session:
                    cur["session"] = session
                write_atomic(path, json.dumps(cur, ensure_ascii=False, indent=2))
                return True, cur
            if is_expired(cur):
                stale = path.with_name(f"{path.name}.stale.{os.getpid()}.{secrets.token_hex(3)}")
                try:
                    os.rename(path, stale)  # chỉ một tiến trình đổi tên thành công
                    stale.unlink(missing_ok=True)
                    append_log(agent, "note", f"Chiếm lại khóa hết hạn '{resource}' của {cur.get('agent')}", session)
                except FileNotFoundError:
                    pass
                continue
            if time.monotonic() >= deadline:
                return False, cur
            time.sleep(2)


def release(resource: str, agent: str, force: bool = False) -> int:
    path = lock_path(resource)
    cur = read_json(path)
    if cur is None:
        print(f"khóa '{resource}' không tồn tại (đã nhả)")
        return 0
    if cur.get("agent") != agent and not force:
        print(f"không thể nhả: '{resource}' đang thuộc {cur.get('agent')}", file=sys.stderr)
        return 3
    path.unlink(missing_ok=True)
    print(f"đã nhả khóa '{resource}'")
    return 0


def all_locks() -> list[dict]:
    out = []
    for p in sorted(LOCK_DIR.glob("*.lock")):
        info = read_json(p)
        if info:
            info["_expired"] = is_expired(info)
            out.append(info)
    return out


# ---------------------------------------------------------------- phiên
def session_path(sid: str) -> Path:
    if not re.fullmatch(r"[A-Za-z0-9._-]+", sid):
        die(f"mã phiên không hợp lệ: {sid}")
    return SESSION_DIR / f"{sid}.json"


def new_session(agent: str, task: str, topic: str | None) -> dict:
    SESSION_DIR.mkdir(parents=True, exist_ok=True)
    safe_agent = re.sub(r"[^A-Za-z0-9-]", "-", agent)[:40]
    sid = f"{now():%Y%m%dT%H%M%SZ}-{safe_agent}-{secrets.token_hex(2)}"
    data = {
        "id": sid,
        "agent": agent,
        "task": task,
        "topic": topic,
        "status": "active",
        "host": socket.gethostname(),
        "started_at": iso(),
        "heartbeat_at": iso(),
        "ended_at": None,
        "summary": None,
    }
    write_atomic(session_path(sid), json.dumps(data, ensure_ascii=False, indent=2))
    append_log(agent, "start", f"Mở phiên: {task}", sid, topic)
    return data


# ---------------------------------------------------------------- lệnh
def cmd_session(a: argparse.Namespace) -> int:
    if a.action == "start":
        s = new_session(a.agent, a.task, a.topic)
        print(s["id"])
        return 0
    if a.action in ("end", "heartbeat", "show"):
        p = session_path(a.sid)
        s = read_json(p)
        if not s:
            die(f"không tìm thấy phiên {a.sid}")
        if a.action == "show":
            print(json.dumps(s, ensure_ascii=False, indent=2))
            return 0
        if a.action == "heartbeat":
            s["heartbeat_at"] = iso()
            write_atomic(p, json.dumps(s, ensure_ascii=False, indent=2))
            return 0
        s["status"] = a.status
        s["ended_at"] = iso()
        s["summary"] = a.summary
        write_atomic(p, json.dumps(s, ensure_ascii=False, indent=2))
        # tự nhả các khóa còn giữ của phiên này
        for info in all_locks():
            if info.get("session") == s["id"] and info.get("agent") == s["agent"]:
                release(info["resource"], s["agent"])
        append_log(s["agent"], "done" if a.status == "done" else "note",
                   f"Đóng phiên ({a.status})" + (f": {a.summary}" if a.summary else ""), s["id"], s.get("topic"))
        print(f"đã đóng phiên {s['id']} ({a.status})")
        return 0
    if a.action == "reap":
        logs = read_all_logs()
        last = {}
        for e in logs:
            if e.get("session"):
                last[e["session"]] = max(last.get(e["session"], ""), e["ts"])
        limit = now().timestamp() - a.idle * 60
        n = 0
        for p in sorted(SESSION_DIR.glob("*.json")):
            s = read_json(p)
            if not s or s.get("status") != "active" or s["id"] == a.keep:
                continue
            seen = max(s.get("heartbeat_at") or s["started_at"], last.get(s["id"], ""))
            if parse_iso(seen).timestamp() > limit:
                continue
            s["status"] = "aborted"
            s["ended_at"] = iso()
            s["summary"] = f"Tự động đóng bởi {a.agent}: không có tín hiệu từ {seen}" + (f" ({a.reason})" if a.reason else "")
            write_atomic(p, json.dumps(s, ensure_ascii=False, indent=2))
            for info in all_locks():
                if info.get("session") == s["id"]:
                    lock_path(info["resource"]).unlink(missing_ok=True)
            append_log(a.agent, "note", f"Thu hồi phiên {s['id']} của {s['agent']}: {s['summary']}", s["id"], s.get("topic"))
            print(f"đã thu hồi {s['id']} ({s['agent']}, lần cuối {seen})")
            n += 1
        print(f"thu hồi {n} phiên")
        return 0
    if a.action == "list":
        rows = []
        for p in sorted(SESSION_DIR.glob("*.json")):
            s = read_json(p)
            if not s or (a.active and s.get("status") != "active"):
                continue
            rows.append(s)
        if a.json:
            print(json.dumps(rows, ensure_ascii=False, indent=2))
        else:
            for s in rows:
                print(f"{s['status']:<8} {s['id']:<52} {s.get('topic') or '-':<22} {s['task']}")
            if not rows:
                print("(không có phiên nào)")
        return 0
    return 1


def cmd_lock(a: argparse.Namespace) -> int:
    if a.action == "list":
        locks = all_locks()
        if a.json:
            print(json.dumps(locks, ensure_ascii=False, indent=2))
        else:
            for l in locks:
                flag = "HẾT HẠN" if l["_expired"] else "đang giữ"
                print(f"{flag:<9} {l['resource']:<40} {l['agent']:<26} đến {l['expires_at']}")
            if not locks:
                print("(không có khóa nào)")
        return 0
    if a.action == "gc":
        n = 0
        for l in all_locks():
            if l["_expired"]:
                lock_path(l["resource"]).unlink(missing_ok=True)
                n += 1
        print(f"đã dọn {n} khóa hết hạn")
        return 0
    res = norm_resource(a.resource)
    if a.action == "acquire":
        ok, info = acquire(res, a.agent, a.session, a.ttl, a.wait, a.note)
        if ok:
            print(f"đã giữ khóa '{res}' đến {info['expires_at']}")
            return 0
        print(f"BẬN: '{res}' đang thuộc {info.get('agent')} (phiên {info.get('session')}) đến {info.get('expires_at')}", file=sys.stderr)
        return 2
    if a.action == "release":
        return release(res, a.agent, a.force)
    if a.action == "check":
        info = lock_info(res)
        if info and info.get("agent") == a.agent and not is_expired(info):
            print(f"OK: {a.agent} đang giữ '{res}'")
            return 0
        holder = info.get("agent") if info else None
        print(f"KHÔNG: '{res}' " + (f"thuộc {holder}" if holder else "chưa ai khóa"), file=sys.stderr)
        return 3
    if a.action == "renew":
        info = lock_info(res)
        if not info or info.get("agent") != a.agent:
            die(f"'{res}' không thuộc {a.agent}", 3)
        info["expires_at"] = iso(datetime.fromtimestamp(time.time() + a.ttl, timezone.utc))
        write_atomic(lock_path(res), json.dumps(info, ensure_ascii=False, indent=2))
        print(f"đã gia hạn '{res}' đến {info['expires_at']}")
        return 0
    return 1


def cmd_log(a: argparse.Namespace) -> int:
    files = [f.strip() for f in a.files.split(",") if f.strip()] if a.files else None
    e = append_log(a.agent, a.kind, " ".join(a.message), a.session, a.topic, files)
    if a.session:  # mỗi dòng nhật ký cũng là một nhịp sống (heartbeat) của phiên
        sp = session_path(a.session)
        s = read_json(sp)
        if s and s.get("agent") == a.agent and s.get("status") == "active":
            s["heartbeat_at"] = e["ts"]
            write_atomic(sp, json.dumps(s, ensure_ascii=False, indent=2))
    if not a.quiet:
        print(f"[{e['ts']}] {e['agent']} {e['kind']}: {e['msg']}")
    return 0


KIND_LABEL = {
    "start": "bắt đầu", "progress": "tiến độ", "done": "hoàn thành", "blocked": "vướng",
    "note": "ghi chú", "handoff": "bàn giao", "error": "lỗi", "commit": "commit",
}


def cmd_worklog(a: argparse.Namespace) -> int:
    logs = read_all_logs()
    if a.action == "tail":
        for e in logs[-a.n:]:
            print(f"[{e['ts']}] {e['agent']:<26} {e['kind']:<9} {e['msg']}")
        return 0
    # render
    ok, info = acquire("WORKLOG.md", a.agent, None, 300, 60, "worklog render")
    if not ok:
        die(f"WORKLOG.md đang bị khóa bởi {info.get('agent')}", 2)
    try:
        sessions = {}
        for p in SESSION_DIR.glob("*.json"):
            s = read_json(p)
            if s:
                sessions[s["id"]] = s
        lines = [
            "# Nhật ký công việc (WORKLOG)",
            "",
            "> File này được **sinh tự động** bởi `python3 scripts/agentctl.py worklog render` từ",
            "> `.agents/worklog/*.jsonl`. Đừng sửa tay; hãy ghi nhật ký bằng `agentctl.py log`.",
            "",
            "## Tổng quan phiên làm việc",
            "",
            "| Phiên | Agent | Chủ đề | Trạng thái | Bắt đầu | Kết thúc | Tóm tắt |",
            "| --- | --- | --- | --- | --- | --- | --- |",
        ]
        for s in sorted(sessions.values(), key=lambda s: s["started_at"]):
            summ = (s.get("summary") or "").replace("|", "\\|").replace("\n", " ")
            lines.append(f"| `{s['id']}` | {s['agent']} | {s.get('topic') or '—'} | {s['status']} | {s['started_at']} | {s.get('ended_at') or '—'} | {summ} |")
        lines += ["", "## Dòng thời gian", ""]
        day = None
        for e in logs:
            d = e["ts"][:10]
            if d != day:
                day = d
                lines += ["", f"### {d}", ""]
            topic = f" · `{e['topic']}`" if e.get("topic") else ""
            files = f" — {', '.join(e['files'])}" if e.get("files") else ""
            msg = e["msg"].replace("\n", " ")
            lines.append(f"- `{e['ts'][11:19]}` **{e['agent']}**{topic} · _{KIND_LABEL.get(e['kind'], e['kind'])}_: {msg}{files}")
        write_atomic(ROOT / "WORKLOG.md", "\n".join(lines) + "\n")
        print(f"đã ghi WORKLOG.md ({len(logs)} mục, {len(sessions)} phiên)")
    finally:
        release("WORKLOG.md", a.agent)
    return 0


def load_roadmap() -> dict:
    txt = (ROOT / "data" / "roadmap.js").read_text(encoding="utf-8")
    start = txt.index("{", txt.index("window.ROADMAP"))
    end = txt.rindex("}")
    return json.loads(txt[start:end + 1])


def cmd_status(a: argparse.Namespace) -> int:
    rm = load_roadmap()
    locks = {l["resource"]: l for l in all_locks()}
    active = [s for s in (read_json(p) for p in SESSION_DIR.glob("*.json")) if s and s.get("status") == "active"]
    print(f"Phiên đang mở: {len(active)} · Khóa: {len(locks)}")
    print()
    print(f"{'Mã':<6}{'Slug':<24}{'File':<8}{'Khóa bởi':<28}Tiêu đề")
    for si, st in enumerate(rm["stages"], 1):
        for ti, t in enumerate(st["topics"], 1):
            f = ROOT / "topics" / f"{t['slug']}.html"
            l = locks.get(f"topics/{t['slug']}.html")
            holder = (l["agent"] + (" (hết hạn)" if l["_expired"] else "")) if l else "—"
            print(f"{si}.{ti:<4}{t['slug']:<24}{'có' if f.exists() else 'chưa':<8}{holder:<28}{t['title']}")
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="agentctl", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("session", help="mở / đóng / liệt kê phiên làm việc")
    ss = s.add_subparsers(dest="action", required=True)
    x = ss.add_parser("start"); x.add_argument("--agent", required=True); x.add_argument("--task", required=True); x.add_argument("--topic")
    x = ss.add_parser("end"); x.add_argument("sid"); x.add_argument("--status", default="done", choices=["done", "failed", "aborted"]); x.add_argument("--summary")
    x = ss.add_parser("heartbeat"); x.add_argument("sid")
    x = ss.add_parser("show"); x.add_argument("sid")
    x = ss.add_parser("list"); x.add_argument("--active", action="store_true"); x.add_argument("--json", action="store_true")
    x = ss.add_parser("reap", help="đóng các phiên active không có tín hiệu quá --idle phút, nhả khóa của chúng")
    x.add_argument("--idle", type=int, default=60); x.add_argument("--agent", default="orchestrator")
    x.add_argument("--keep", help="mã phiên không được thu hồi"); x.add_argument("--reason")

    l = sub.add_parser("lock", help="giữ / nhả / kiểm tra khóa tài nguyên")
    ls = l.add_subparsers(dest="action", required=True)
    x = ls.add_parser("acquire"); x.add_argument("resource"); x.add_argument("--agent", required=True); x.add_argument("--session")
    x.add_argument("--ttl", type=int, default=DEFAULT_TTL, help="giây (mặc định 7200)"); x.add_argument("--wait", type=int, default=0, help="chờ tối đa (giây)"); x.add_argument("--note")
    x = ls.add_parser("release"); x.add_argument("resource"); x.add_argument("--agent", required=True); x.add_argument("--force", action="store_true")
    x = ls.add_parser("check"); x.add_argument("resource"); x.add_argument("--agent", required=True)
    x = ls.add_parser("renew"); x.add_argument("resource"); x.add_argument("--agent", required=True); x.add_argument("--ttl", type=int, default=DEFAULT_TTL)
    x = ls.add_parser("list"); x.add_argument("--json", action="store_true")
    ls.add_parser("gc")

    g = sub.add_parser("log", help="ghi một dòng nhật ký")
    g.add_argument("--agent", required=True); g.add_argument("--session"); g.add_argument("--topic")
    g.add_argument("--kind", default="progress", choices=KINDS); g.add_argument("--files", help="các file liên quan, ngăn cách bằng dấu phẩy")
    g.add_argument("--quiet", action="store_true"); g.add_argument("message", nargs="+")

    w = sub.add_parser("worklog", help="xem / sinh WORKLOG.md")
    ws = w.add_subparsers(dest="action", required=True)
    x = ws.add_parser("render"); x.add_argument("--agent", default="orchestrator")
    x = ws.add_parser("tail"); x.add_argument("-n", type=int, default=30)

    sub.add_parser("status", help="tổng quan chủ đề, khóa, phiên")

    a = ap.parse_args(argv)
    return {"session": cmd_session, "lock": cmd_lock, "log": cmd_log, "worklog": cmd_worklog, "status": cmd_status}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
