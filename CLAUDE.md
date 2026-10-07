# CLAUDE.md

Đọc và làm theo [`AGENTS.md`](AGENTS.md) trước khi sửa bất kỳ file nào. Tóm tắt:

- Mở phiên và giữ khóa bằng `python3 scripts/agentctl.py` trước khi ghi; chỉ ghi file mình sở hữu.
- Trang chủ đề: bắt đầu từ `templates/topic-template.html`, kiểm tra bằng `python3 scripts/validate.py topics/<slug>.html`.
- Chỉ phiên điều phối chạy git commit, sửa file dùng chung, sinh `data/status.js` và `WORKLOG.md`.
- Xem trang: mở `index.html` trực tiếp hoặc `python3 -m http.server 8000`.
