# Lộ trình Lập trình Thi đấu lớp 9

Trang web tĩnh dạy **lập trình thi đấu bằng C++ cho học sinh lớp 9**, từ độ phức tạp thuật toán đến quy hoạch động và đồ thị.
Trang chủ là bản đồ lộ trình gồm **10 chuyên đề, 32 chủ đề**; mỗi chủ đề là một bài học đầy đủ: mô tả, ý nghĩa, lý do cần thuật toán,
các bước, cách hoạt động, minh họa trực quan từng bước, code C++, độ phức tạp, biến thể nâng cao, lỗi thường gặp, câu hỏi tự kiểm tra
và **ít nhất 5 bài tập có đường dẫn**, ưu tiên đề tiếng Việt (VNOJ, LQDOJ, MarisaOJ…).

Tám chuyên đề đầu bám theo giáo án 16 tuần trong file
[`Giáo án Toán & Thuật toán cho học sinh THCS thi Lập trình thi đấu.md`](Giáo%20án%20Toán%20&%20Thuật%20toán%20cho%20học%20sinh%20THCS%20thi%20Lập%20trình%20thi%20đấu.md);
hai chuyên đề cuối mở rộng cho học sinh ôn thi vào lớp 10 chuyên Tin.

Nội dung được soạn bởi nhiều agent chạy song song (mỗi chủ đề một agent), phối hợp qua cơ chế **phiên – khóa – nhật ký** mô tả ở [mục 6](#6-kiến-trúc-cho-nhiều-agent).

---

## Mục lục

1. [Xem trang web](#1-xem-trang-web)
2. [Lộ trình](#2-lộ-trình)
3. [Cấu trúc một bài học](#3-cấu-trúc-một-bài-học)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Thiết kế giao diện](#5-thiết-kế-giao-diện)
6. [Kiến trúc cho nhiều agent](#6-kiến-trúc-cho-nhiều-agent)
7. [Thêm hoặc sửa một chủ đề](#7-thêm-hoặc-sửa-một-chủ-đề)
8. [Kiểm tra chất lượng](#8-kiểm-tra-chất-lượng)
9. [Câu hỏi thường gặp](#9-câu-hỏi-thường-gặp)

---

## 1. Xem trang web

Không cần cài đặt hay build. Chọn một trong hai cách:

```bash
# Cách 1: mở trực tiếp
xdg-open index.html          # Linux  (macOS: open index.html · Windows: start index.html)

# Cách 2: chạy máy chủ tĩnh (khuyên dùng khi dạy trên lớp)
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Trang chạy được khi **không có mạng**: highlight.js đã được đặt sẵn trong `assets/vendor/`. Khi mất mạng chỉ phông chữ Google Fonts rơi về phông hệ thống.

Tiến độ “đã học” và lựa chọn nền sáng/tối được lưu trong `localStorage` của trình duyệt, chỉ trên máy người học.

## 2. Lộ trình

| Mã | Chuyên đề | Thời gian | Chủ đề |
| --- | --- | --- | --- |
| CĐ1 | Độ phức tạp & kỹ thuật cơ bản | Tuần 1 | 1.1 Độ phức tạp thuật toán · 1.2 Khung bài thi C++ · 1.3 Duyệt trâu, mô phỏng & công thức |
| CĐ2 | Số học | Tuần 2–4 | 2.1 Ước số & số nguyên tố · 2.2 Sàng Eratosthenes · 2.3 ƯCLN, BCNN & Euclid · 2.4 Đồng dư & lũy thừa nhanh |
| CĐ3 | Tổ hợp & đếm | Tuần 5 | 3.1 Quy tắc đếm & nguyên lý bù trừ · 3.2 Tính C(n, k) & tam giác Pascal |
| CĐ4 | Cộng dồn, sắp xếp, hai con trỏ | Tuần 6–7 | 4.1 Mảng cộng dồn · 4.2 Mảng hiệu · 4.3 Sắp xếp & so sánh tùy biến · 4.4 Hai con trỏ & cửa sổ trượt |
| — | Thi thử giữa kỳ | Tuần 8 | 4 bài, 150 phút |
| CĐ5 | Tìm kiếm nhị phân | Tuần 9 | 5.1 Tìm kiếm nhị phân trên mảng · 5.2 Chặt nhị phân trên kết quả |
| CĐ6 | Đệ quy, quay lui, tham lam | Tuần 10–11 | 6.1 Đệ quy & chia để trị · 6.2 Quay lui & nhánh cận · 6.3 Tham lam |
| CĐ7 | Quy hoạch động | Tuần 12–13 | 7.1 Nhập môn QHĐ · 7.2 QHĐ trên lưới · 7.3 Dãy con tăng dài nhất · 7.4 Cái túi & đổi tiền |
| CĐ8 | Đồ thị nhập môn | Tuần 14–15 | 8.1 Đồ thị & DFS · 8.2 BFS & đường đi ngắn nhất · 8.3 Loang trên lưới & BFS đa nguồn |
| — | Thi thử cuối kỳ | Tuần 16 | 5 bài, 180 phút |
| CĐ9 | Cấu trúc dữ liệu & xâu | Tự học song song | 9.1 STL · 9.2 Ngăn xếp, hàng đợi & ngăn xếp đơn điệu · 9.3 Xử lý xâu · 9.4 Số lớn |
| CĐ10 | Nâng cao hướng chuyên Tin | Sau 16 tuần | 10.1 LCS & khoảng cách sửa · 10.2 Dijkstra & Floyd · 10.3 DSU & cây khung nhỏ nhất |

Dữ liệu lộ trình (tiêu đề, mô tả ngắn, mức độ, số giờ, kiến thức cần trước) nằm ở **một chỗ duy nhất**: [`data/roadmap.js`](data/roadmap.js).
Trang chủ, đường dẫn “bài trước / bài sau”, breadcrumb và công cụ kiểm tra đều đọc từ file này.

## 3. Cấu trúc một bài học

Mọi trang `topics/<slug>.html` có cùng trình tự (công cụ kiểm tra bắt buộc các `id` này):

| # | id | Phần | Nội dung |
| --- | --- | --- | --- |
| 01 | `gioi-thieu` | Mô tả | Thuật toán là gì, ví dụ đời thường, định nghĩa |
| 02 | `y-nghia` | Ý nghĩa và ứng dụng | Loại bài giải được, dấu hiệu nhận biết trong đề |
| 03 | `tai-sao` | Vì sao cần | Cách ngây thơ vs cách mới, đếm số phép tính |
| 04 | `thuat-toan` | Các bước thuật toán | Tuần tự từng bước + mã giả |
| 05 | `hoat-dong` | Cách hoạt động | Vì sao đúng, vì sao nhanh |
| 06 | `truc-quan` | Minh họa trực quan | Trình chiếu từng bước (≥ 4 khung), sơ đồ SVG, widget tương tác |
| 07 | `cai-dat` | Cài đặt C++ | Code C++17 có chú thích, ví dụ Input/Output |
| 08 | `do-phuc-tap` | Độ phức tạp | Thời gian, bộ nhớ, giới hạn phù hợp |
| 09 | `bien-the` | Biến thể và mở rộng | Dạng nâng cao |
| 10 | `loi-thuong-gap` | Lỗi thường gặp | Lỗi + cách sửa |
| 11 | `kiem-tra` | Tự kiểm tra | ≥ 3 câu trắc nghiệm / tự luận có đáp án |
| 12 | `bai-tap` | Bài tập luyện tập | ≥ 5 bài có link thật, dễ → khó, gợi ý gập mở |
| 13 | `tham-khao` | Tài liệu tham khảo | VNOI Wiki, sách |
| 14 | `tom-tat` | Tóm tắt | Ghi nhớ nhanh |

Phần đầu bài (tên, chuyên đề, mức độ, thời lượng, kiến thức cần trước), mục lục bám cuộn, thanh tiến độ đọc, nút “đã học”
và chuyển bài trước/sau **không viết tay** mà do `assets/js/main.js` tự dựng từ `data/roadmap.js`. Nhờ vậy 32 trang luôn nhất quán dù do 32 agent khác nhau viết.

## 4. Cấu trúc thư mục

```
thidaulaptrinh/
├── index.html                  Trang chủ: phòng thí nghiệm giới hạn n, bản đồ tuyến, 16 tuần, chiến thuật phòng thi
├── topics/<slug>.html          32 trang chủ đề (mỗi file thuộc một agent)
├── assets/
│   ├── css/style.css           Hệ thống thiết kế: token màu sáng/tối, phông chữ, mọi thành phần
│   ├── js/main.js              Runtime chung: thanh trên, đầu bài, mục lục, stepper, quiz, sao chép code
│   ├── js/home.js              Tương tác trang chủ: thanh trượt n, lộ trình, lọc, tiến độ
│   ├── js/viz/<slug>.js        Widget tương tác riêng của từng chủ đề (tùy chọn)
│   └── vendor/highlight.min.js highlight.js 11.9.0 (tô màu C++, chạy offline)
├── data/
│   ├── roadmap.js              Nguồn dữ liệu lộ trình (JSON trong JS, dùng được khi mở file://)
│   └── status.js               SINH TỰ ĐỘNG: số bài tập, số từ, trạng thái đạt chuẩn của từng chủ đề
├── templates/topic-template.html  Mẫu trang chủ đề, minh họa mọi thành phần giao diện
├── scripts/
│   ├── agentctl.py             Phiên, khóa, nhật ký cho nhiều agent
│   └── validate.py             Kiểm tra chuẩn nội dung, sinh data/status.js, kiểm tra link
├── .agents/
│   ├── sessions/               Mỗi phiên làm việc một file JSON
│   ├── worklog/                Nhật ký chỉ-nối-thêm theo ngày (JSONL)
│   ├── locks/                  Khóa đang giữ (không commit)
│   └── inbox/                  Yêu cầu sửa file dùng chung
├── WORKLOG.md                  SINH TỰ ĐỘNG từ .agents/worklog
├── AGENTS.md                   Quy trình bắt buộc cho mọi agent
├── CLAUDE.md                   Trỏ tới AGENTS.md cho Claude Code
└── Giáo án … .md               Giáo án 16 tuần gốc
```

## 5. Thiết kế giao diện

- **Ý tưởng:** trang vở ô li của học sinh Việt Nam (ô lớn kẻ tím, ba dòng kẻ mảnh, lề đỏ), mực tím làm màu nhấn,
  nét bút đỏ của thầy cô cho lời dặn (`.callout.teacher`, phông viết tay). Lộ trình vẽ như bản đồ tuyến tàu: mỗi chuyên đề một màu tuyến `--l1 … --l10`,
  trang chủ đề lấy màu tuyến của mình làm `--stage`.
- **Phông chữ (Google Fonts, đều có bộ ký tự tiếng Việt):** Bricolage Grotesque (tiêu đề), Be Vietnam Pro (nội dung), JetBrains Mono (code, số liệu), Patrick Hand (chữ viết tay).
- **Sáng / tối:** mọi màu là token trên `:root`, định nghĩa lại trong `@media (prefers-color-scheme: dark)` và `[data-theme="dark"]`; nút chuyển nền ở góc phải thanh trên.
- **Trang chủ:** “Nhìn n, đoán thuật toán”: kéo giới hạn n để thấy số phép tính của O(1) … O(n!) so với mốc 10⁸ phép/giây và gợi ý thuật toán phù hợp.
- **Thành phần có sẵn cho bài học:** `.stepper` (trình chiếu từng bước có nút Trước/Sau/Tự chạy, phím ←/→), mảng `.arr > .cell` (chỉ số, con trỏ, trạng thái
  `is-active / is-cmp / is-ok / is-bad / is-dim`), lưới `.grid-viz`, biểu đồ cột `.bars`, sơ đồ SVG theo theme, `.quiz`, `.callout`, `.definition`, `.versus`,
  `.algo-steps`, `.pseudo`, `figure.code` (nút sao chép), `.io`, `.exercises`, `.cheatsheet`. Xem toàn bộ trong [`templates/topic-template.html`](templates/topic-template.html).
- **Khả năng truy cập:** điều hướng bằng bàn phím, `:focus-visible`, `prefers-reduced-motion`, nhãn ARIA cho sơ đồ, link “Bỏ qua, tới nội dung”.

## 6. Kiến trúc cho nhiều agent

Kho được thiết kế để nhiều agent ghi song song mà không va chạm.

### 6.1 Phân chia quyền sở hữu

- Mỗi chủ đề là **một file độc lập** `topics/<slug>.html` (+ widget `assets/js/viz/<slug>.js` nếu có) thuộc đúng một agent.
- Phần dùng chung (giao diện, runtime, dữ liệu lộ trình, script) chỉ sửa khi giữ khóa; mặc định chỉ phiên **điều phối** sửa.
- Phần khung của mọi trang do `main.js` dựng từ `roadmap.js`, nên agent chủ đề **không cần chạm** vào file dùng chung.
- File sinh tự động (`data/status.js`, `WORKLOG.md`) không ai sửa tay; công cụ sinh tự khóa khi ghi.
- **Chỉ điều phối chạy git**, tránh xung đột chỉ mục git khi nhiều tiến trình cùng `git add`.

### 6.2 Phiên (session)

```bash
SID=$(python3 scripts/agentctl.py session start --agent topic-sieve --task "Soạn chủ đề sieve" --topic sieve)
python3 scripts/agentctl.py session list --active
python3 scripts/agentctl.py session end "$SID" --status done --summary "8 bài tập, 2 stepper"
```

Mỗi phiên là một file `.agents/sessions/<UTC>-<agent>-<hex>.json` ghi ai, làm gì, trạng thái, tóm tắt. Đóng phiên tự nhả mọi khóa của phiên đó.

### 6.3 Khóa (lock)

```bash
python3 scripts/agentctl.py lock acquire topics/sieve.html --agent topic-sieve --session "$SID"   # 0 = được, 2 = đang bận
python3 scripts/agentctl.py lock check   topics/sieve.html --agent topic-sieve
python3 scripts/agentctl.py lock renew   topics/sieve.html --agent topic-sieve --ttl 7200
python3 scripts/agentctl.py lock release topics/sieve.html --agent topic-sieve
python3 scripts/agentctl.py lock list
python3 scripts/agentctl.py lock gc                                                             # dọn khóa hết hạn
```

- Tạo nguyên tử bằng `open(O_CREAT | O_EXCL)`: hai agent tranh cùng lúc thì chỉ một thắng.
- Có thời hạn (mặc định 2 giờ). Khóa hết hạn bị chiếm lại bằng `rename` nguyên tử, nên agent bị treo không giữ file mãi.
- Vào lại khóa của chính mình thì được gia hạn; chỉ chủ khóa nhả được (trừ `--force`).
- Tên tài nguyên là đường dẫn tương đối, được chuẩn hóa (`./topics/x.html` và `topics/x.html` là một).

### 6.4 Nhật ký (worklog)

```bash
python3 scripts/agentctl.py log --agent topic-sieve --session "$SID" --topic sieve --kind progress "Đã tìm xong 7 bài tập"
python3 scripts/agentctl.py worklog tail -n 20
python3 scripts/agentctl.py worklog render        # sinh WORKLOG.md
```

Nhật ký là JSONL **chỉ nối thêm** (`O_APPEND`), mỗi sự kiện ghi bằng một lệnh `write()`, nên nhiều tiến trình ghi cùng lúc không bị xen dòng.
`WORKLOG.md` là bản dễ đọc được sinh lại trước mỗi commit.

### 6.5 Hộp thư yêu cầu

Agent cần đổi file dùng chung (thêm class CSS, sửa runtime) thì tạo `.agents/inbox/<UTC>-<agent>.md` mô tả thay đổi, rồi ghi nhật ký `--kind handoff`. Điều phối xử lý và commit.

### 6.6 Tổng quan

```bash
python3 scripts/agentctl.py status
```

In bảng 32 chủ đề: đã có file chưa, đang bị agent nào khóa.

Quy trình chi tiết, chuẩn nội dung và quy tắc giao diện cho agent: [`AGENTS.md`](AGENTS.md).

## 7. Thêm hoặc sửa một chủ đề

1. Thêm mục vào `data/roadmap.js` (cần khóa `data/roadmap.js`): `slug`, `title`, `short`, `level` (1 Cơ bản, 2 Vận dụng, 3 Nâng cao), `hours`, `prereq`, `tags`.
2. Mở phiên, giữ khóa `topics/<slug>.html`.
3. Sao chép `templates/topic-template.html` thành `topics/<slug>.html`, đổi `<title>`, `data-topic`, viết nội dung.
4. `python3 scripts/validate.py topics/<slug>.html` cho tới khi không còn lỗi.
5. Điều phối chạy `python3 scripts/validate.py --write-status`, `python3 scripts/agentctl.py worklog render`, rồi commit.

## 8. Kiểm tra chất lượng

```bash
python3 scripts/validate.py                    # mọi chủ đề
python3 scripts/validate.py topics/bfs.html    # một chủ đề
python3 scripts/validate.py --write-status     # cập nhật data/status.js cho trang chủ
python3 scripts/validate.py --check-links      # gửi request tới link bài tập (chậm)
```

Các mục được kiểm tra: đủ 14 section bắt buộc và đúng thứ tự, mỗi section có `<h2>`; `data-topic` khớp tên file và roadmap;
≥ 5 bài tập có link http(s), trang chấm, mức độ; có bài tiếng Việt; ≥ 1 khối code C++; ≥ 3 câu tự kiểm tra; ≥ 1 stepper;
thẻ HTML đóng mở đúng; ký tự `<` trong code đã được thoát; script và stylesheet chỉ từ nguồn cho phép; widget JS qua `node --check`; id không trùng.

## 9. Câu hỏi thường gặp

**Vì sao không dùng framework hay bước build?** Giáo viên và học sinh mở được ngay trên máy phòng tin học, kể cả khi không có mạng hay Node.js. Mỗi chủ đề là một file HTML nên các agent không giẫm chân nhau.

**Vì sao `roadmap.js` mà không phải `roadmap.json`?** Trình duyệt chặn `fetch()` file JSON khi mở bằng `file://`. Nội dung sau dấu `=` vẫn là JSON hợp lệ để Python đọc được.

**Làm sao reset tiến độ “đã học”?** Xóa dữ liệu trang trong trình duyệt, hoặc chạy trong Console: `Object.keys(localStorage).filter(k => k.startsWith('cp9:done:')).forEach(k => localStorage.removeItem(k))`.

**Ngôn ngữ lập trình?** C++17, đúng với giáo án và kỳ thi học sinh giỏi THCS phổ biến hiện nay.
