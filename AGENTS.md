# AGENTS.md — Quy trình làm việc cho agent

Tài liệu này dành cho **mọi agent** (Claude Code, subagent, hoặc người) sửa kho này.
Đọc hết trước khi ghi bất kỳ file nào. Mục tiêu: nhiều agent làm song song mà không ghi đè lên nhau.

## 1. Dự án là gì

Trang web tĩnh (HTML/CSS/JS thuần, không cần build) dạy lập trình thi đấu C++ cho học sinh lớp 9.
Trang chủ `index.html` hiển thị lộ trình 10 chuyên đề / 32 chủ đề; mỗi chủ đề là một trang `topics/<slug>.html`.
Lộ trình bám theo giáo án 16 tuần trong file `Giáo án Toán & Thuật toán cho học sinh THCS thi Lập trình thi đấu.md`.

Nguồn dữ liệu duy nhất của lộ trình: `data/roadmap.js` (slug, tiêu đề, mức độ, thời lượng, kiến thức cần trước).

## 2. Vai trò

| Vai trò | Ai | Được làm |
| --- | --- | --- |
| **Điều phối (orchestrator)** | Phiên chính | Sửa file dùng chung (có khóa), giao việc, chạy `validate.py --write-status`, sinh `WORKLOG.md`, **là người duy nhất chạy git commit**. |
| **Agent chủ đề** | Mỗi subagent một chủ đề | Chỉ ghi các file mình sở hữu (mục 3). |
| **Agent rà soát** | Tùy chọn | Đọc mọi file, ghi đề xuất vào `.agents/inbox/`, chỉ sửa file khi giữ khóa của file đó. |

## 3. Quyền sở hữu file

| File / thư mục | Chủ sở hữu | Ghi chú |
| --- | --- | --- |
| `topics/<slug>.html` | Agent chủ đề `<slug>` | Phải giữ khóa `topics/<slug>.html` khi ghi. |
| `assets/js/viz/<slug>.js` | Agent chủ đề `<slug>` | Widget tương tác riêng (tùy chọn). |
| `assets/img/<slug>/*` | Agent chủ đề `<slug>` | Ảnh riêng (tùy chọn, ưu tiên SVG nội tuyến). |
| `index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/js/home.js`, `data/roadmap.js`, `templates/*`, `scripts/*`, `AGENTS.md`, `README.md` | **Dùng chung** | Phải giữ khóa đúng đường dẫn; mặc định chỉ điều phối sửa. |
| `data/status.js`, `WORKLOG.md` | **Sinh tự động** | Không sửa tay. `validate.py --write-status` và `agentctl.py worklog render` tự khóa khi ghi. |
| `.agents/sessions/<id>.json` | Chủ phiên | Chỉ ghi qua `agentctl.py session …`. |
| `.agents/worklog/*.jsonl` | Mọi agent (chỉ nối thêm) | Chỉ ghi qua `agentctl.py log …`. |
| `.agents/locks/*.lock` | Chủ khóa | Chỉ ghi qua `agentctl.py lock …`. Không commit. |
| `.agents/inbox/*.md` | Người gửi | Mỗi yêu cầu một file mới, tên `<UTC>-<agent>.md`. |

Cần sửa file dùng chung mà không phải điều phối? **Đừng sửa.** Ghi yêu cầu vào `.agents/inbox/` (mô tả thay đổi, lý do, đoạn CSS/JS đề xuất) và ghi nhật ký `--kind handoff`.

## 4. Quy trình của agent chủ đề

```bash
A=topic-<slug>                                    # tên agent, ví dụ topic-sieve
SID=$(python3 scripts/agentctl.py session start --agent $A --task "Soạn chủ đề <slug>" --topic <slug>)
python3 scripts/agentctl.py lock acquire topics/<slug>.html --agent $A --session $SID
#   mã thoát 2 = agent khác đang giữ → KHÔNG ghi; báo lại cho điều phối và dừng.
python3 scripts/agentctl.py lock acquire assets/js/viz/<slug>.js --agent $A --session $SID   # nếu làm widget

python3 scripts/agentctl.py log --agent $A --session $SID --topic <slug> --kind progress "Đã tìm xong 7 bài tập"
# … soạn nội dung, ghi nhật ký ở các mốc quan trọng …

python3 scripts/validate.py topics/<slug>.html      # sửa đến khi không còn ✗
python3 scripts/agentctl.py session end $SID --status done --summary "8 bài tập (5 VI), 2 stepper, 1 widget"
#   session end tự nhả mọi khóa của phiên.
```

Quy tắc bắt buộc:

1. **Không chạy lệnh git** (`add`, `commit`, `checkout`, `stash`, `reset`, `pull`…). Chỉ điều phối commit.
2. **Không sửa file dùng chung**, không xóa file của agent khác.
3. Phiên dài hơn 2 giờ: gia hạn khóa bằng `lock renew`.
4. Gặp lỗi không tự xử lý được: `log --kind blocked "…"`, `session end --status failed --summary "…"`.
5. Bắt đầu lại sau khi bị ngắt: mở phiên mới, `lock acquire` lại (khóa của chính tên agent sẽ được gia hạn).

## 5. Chuẩn nội dung một trang chủ đề

Bắt đầu từ `templates/topic-template.html`; file mẫu minh họa **mọi thành phần giao diện** có sẵn.

**Người đọc:** học sinh lớp 9 (14–15 tuổi) đã biết biến, rẽ nhánh, vòng lặp, mảng, hàm trong C++. Viết tiếng Việt chuẩn, câu ngắn, xưng “em”, giải thích như một thầy cô kiên nhẫn. Thuật ngữ tiếng Anh để trong ngoặc ở lần đầu, ví dụ “mảng cộng dồn (prefix sum)”.

**Các section bắt buộc, đúng thứ tự** (validate.py kiểm tra id):

| id | Tiêu đề h2 | Nội dung tối thiểu |
| --- | --- | --- |
| `gioi-thieu` | Mô tả | Thuật toán là gì, ví dụ đời thường (`.analogy`), định nghĩa (`.definition`). |
| `y-nghia` | Ý nghĩa và ứng dụng | Giải quyết loại bài nào; dấu hiệu nhận biết trong đề. |
| `tai-sao` | Vì sao cần thuật toán này | Bài toán mở đầu; cách ngây thơ và số phép tính cụ thể; so sánh `.versus`. |
| `thuat-toan` | Các bước thuật toán | `.algo-steps` + mã giả `.pseudo`. |
| `hoat-dong` | Cách hoạt động | Giải thích chi tiết từng bước; **vì sao đúng**, **vì sao nhanh**. |
| `truc-quan` | Minh họa trực quan | ≥ 1 `.stepper` với ≥ 4 khung hình, chạy tay trên ví dụ nhỏ; nên có thêm sơ đồ SVG hoặc widget. |
| `cai-dat` | Cài đặt C++ | Code hoàn chỉnh biên dịch được (C++17), chú thích tiếng Việt, kèm ví dụ Input/Output `.io`. |
| `do-phuc-tap` | Độ phức tạp | Thời gian, bộ nhớ, giới hạn n phù hợp, ví dụ số phép tính. |
| `bien-the` | Biến thể và mở rộng | Các dạng mở rộng, phần nâng cao (có code ngắn nếu cần). |
| `loi-thuong-gap` | Lỗi thường gặp | Lỗi cụ thể + cách sửa (`.callout.danger/.warn/.tip`). |
| `kiem-tra` | Tự kiểm tra | ≥ 3 câu (`.quiz` trắc nghiệm và/hoặc `details.solution`). |
| `bai-tap` | Bài tập luyện tập | ≥ 5 bài **có link thật**, xếp dễ → khó (mục 6). |
| `tham-khao` | Tài liệu tham khảo | Ưu tiên VNOI Wiki, sách tiếng Việt; link đã kiểm tra. |
| `tom-tat` | Tóm tắt | `.cheatsheet`, 4–8 gạch đầu dòng để ôn nhanh. |

Có thể thêm section khác (ví dụ `chung-minh`, `vi-du-mau`) xen giữa. Chủ đề gồm nhiều thuật toán thì dùng `<h3>` cho từng thuật toán **trong mỗi section** để đủ mô tả, ý nghĩa, các bước, cách hoạt động cho từng cái.

**Độ sâu:** một trang tốt dài 3 000–6 000 từ (âm tiết), có ít nhất 2 ví dụ chạy tay, 1 code hoàn chỉnh, 1 bảng độ phức tạp.

**Code:** C++17, `#include <bits/stdc++.h>`, `ios::sync_with_stdio(false); cin.tie(nullptr);`, dùng `long long` khi có thể tràn. Trong HTML **phải thoát** `<` `>` `&` thành `&lt;` `&gt;` `&amp;` bên trong `<pre><code>`.

**Kiểm chứng:** code mẫu nên được biên dịch và chạy thử với ví dụ trong bài (`g++ -std=c++17`) nếu máy có `g++`. Mọi khẳng định toán học phải đúng; số liệu trong ví dụ phải tự tính lại.

## 6. Bài tập

- Ít nhất **5 bài**, khuyến khích 6–10, xếp từ Cơ bản (`level-1`) → Vận dụng (`level-2`) → Nâng cao (`level-3`).
- **Ưu tiên đề tiếng Việt**: VNOJ (`oj.vnoi.info/problem/<mã>`), LQDOJ (`lqdoj.edu.vn/problem/<mã>`), MarisaOJ (`marisaoj.com/problem/<số>`), các bài được VNOI Wiki gợi ý. Bổ sung CSES, Codeforces, AtCoder, SPOJ khi cần.
- **Mọi link phải được kiểm chứng** bằng WebSearch/WebFetch: đúng bài, đúng chủ đề, trang tồn tại. Không bịa mã bài. Không chắc thì bỏ.
- Mỗi bài: tên + link (`a.ex-title`), trang chấm (`.judge`), ngôn ngữ đề (`.lang-tag.vi` hoặc `.lang-tag`), mức độ (`.level`), tóm tắt đề tiếng Việt (`.ex-desc`), kỹ năng luyện (`.ex-skill`), gợi ý (`details.hint`, không đưa code đầy đủ).

## 7. Giao diện

- Dùng class có sẵn trong `assets/css/style.css` (xem `templates/topic-template.html`). Không thêm thư viện CSS.
- CSS riêng (nếu thật cần): một khối `<style>` ngắn trong `<head>`, **chỉ dùng token** `var(--…)`, không mã màu cứng, để nền sáng/tối đều đúng.
- SVG: dùng các class `.node`, `.edge`, `.label-sm`, `.label-pen`, `.fill-soft`… để màu theo theme. Luôn có `viewBox`, `role="img"`, `aria-label`.
- Script: chỉ `../data/roadmap.js`, `../assets/vendor/highlight.min.js`, `../assets/js/main.js`, `../assets/js/viz/<slug>.js`. CDN ngoài chỉ từ cdnjs / jsdelivr / unpkg nếu thật cần.
- Widget tương tác (`assets/js/viz/<slug>.js`): JS thuần, bọc trong IIFE, gắn bằng `CP.mount('#viz-<slug>', fn)`, không biến toàn cục, chịu được dữ liệu nhập sai, tôn trọng `CP.reduceMotion`, qua được `node --check`.
- Không dùng emoji làm tiêu đề mục. Không chèn iframe.

## 8. Nhật ký và phiên

- `log --kind` gồm: `start`, `progress`, `done`, `blocked`, `note`, `handoff`, `error`, `commit`.
- Ghi nhật ký ở mỗi mốc: tìm xong bài tập, viết xong lý thuyết, qua validate, gặp vướng mắc.
- Điều phối chạy `python3 scripts/agentctl.py worklog render` để cập nhật `WORKLOG.md` trước mỗi commit.
- Xem nhanh tình hình: `python3 scripts/agentctl.py status`, `lock list`, `session list --active`, `worklog tail`.
