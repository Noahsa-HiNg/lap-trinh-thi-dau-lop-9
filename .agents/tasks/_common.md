# Quy trình chung cho agent soạn một chủ đề

Áp dụng cho mọi file `.agents/tasks/<slug>.md`. Đọc file này, rồi đọc đề bài riêng của chủ đề, rồi làm đúng thứ tự.

- Thư mục làm việc: `/home/hieu/personal/thidaulaptrinh` (mọi lệnh chạy tại đây).
- `SLUG` = slug chủ đề, tên agent `A=topic-SLUG`.
- Thư mục tạm: `SP=/tmp/claude-1000/-home-hieu-personal-thidaulaptrinh/8f86a420-1f5a-4c8e-8a9a-b9bc6edbc592/scratchpad`, dùng `$SP/SLUG/`.
- Shell không giữ biến giữa các lần gọi Bash: luôn viết đường dẫn đầy đủ hoặc đọc lại từ file.

## 0. Đọc (tiết kiệm token)

1. `AGENTS.md` (quy trình, chuẩn nội dung, quyền sở hữu file).
2. `templates/topic-template.html` (khung trang + mọi thành phần giao diện; chừng này là đủ).
3. Mục của chủ đề trong `data/roadmap.js`: `grep -n -A8 '"slug": "SLUG"' data/roadmap.js`.
4. Nếu đề bài nêu phần giáo án: tìm bằng `grep -n "Chuyên đề N" "Giáo án Toán & Thuật toán cho học sinh THCS thi Lập trình thi đấu.md"` rồi `sed -n 'a,bp'` đúng đoạn đó.

**Không** đọc `assets/css/style.css`, `assets/js/main.js`, `assets/js/home.js`, `index.html`: không cần, rất tốn token.

## 1. Mở phiên và khóa

```bash
mkdir -p $SP/SLUG
python3 scripts/agentctl.py session start --agent topic-SLUG --task "Soạn chủ đề SLUG" --topic SLUG > $SP/SLUG/sid
python3 scripts/agentctl.py lock acquire topics/SLUG.html --agent topic-SLUG --session $(cat $SP/SLUG/sid)
# làm widget thì khóa thêm:
python3 scripts/agentctl.py lock acquire assets/js/viz/SLUG.js --agent topic-SLUG --session $(cat $SP/SLUG/sid)
```

- Mã thoát 2 (agent khác đang giữ): không ghi gì, `session end … --status aborted`, báo lại và dừng.
- Ghi nhật ký ở mỗi mốc (mỗi lần ghi log cũng là heartbeat của phiên):
  `python3 scripts/agentctl.py log --agent topic-SLUG --session $(cat $SP/SLUG/sid) --topic SLUG --kind progress "…"`
- **Không chạy git.** Chỉ ghi `topics/SLUG.html`, `assets/js/viz/SLUG.js`, `$SP/SLUG/`.

## 2. Làm tiếp nếu lần trước bị ngắt

Nếu `topics/SLUG.html` hoặc `$SP/SLUG/exercises.md` đã tồn tại: **đọc và viết tiếp**, không làm lại phần đã xong.

## 3. Tìm bài tập (nạp công cụ: ToolSearch `select:WebSearch,WebFetch`)

- ≥ 5 bài, nên 7–10, xếp Cơ bản → Vận dụng → Nâng cao.
- **Ưu tiên đề tiếng Việt**: VNOJ `oj.vnoi.info/problem/<mã>`, LQDOJ `lqdoj.edu.vn/problem/<mã>`, MarisaOJ `marisaoj.com/problem/<số>`, LTOJ `ltoj.edu.vn`, bài VNOI Wiki gợi ý. Bổ sung CSES / Codeforces / AtCoder / SPOJ.
- Kiểm chứng **từng** link (WebFetch, hoặc kết quả WebSearch thấy đúng URL + tên bài + đúng chủ đề). Không bịa mã bài; không chắc thì bỏ.
- Ngân sách: khoảng 12 lượt WebSearch/WebFetch là đủ; ưu tiên trang danh sách bài của VNOI Wiki (mỗi bài viết có mục “Bài tập luyện tập”).
- **Ngay khi tìm xong**, ghi danh sách đã kiểm chứng vào `$SP/SLUG/exercises.md` (tên, URL, trang chấm, VI/EN, mức, tóm tắt 1 câu, gợi ý) và ghi log.

## 4. Viết bài theo từng phần (để không mất công nếu bị ngắt)

1. `Write` file `topics/SLUG.html` gồm: phần `<head>` (theo mẫu), `<body data-page="topic" data-topic="SLUG">`, `<main id="lesson" class="lesson">`, mục tiêu + các section 1–5, rồi một dòng `<!-- @@TIEP@@ -->`, `</main>` và các thẻ script.
2. Mỗi lần viết thêm 2–4 section: `Edit` thay `<!-- @@TIEP@@ -->` bằng nội dung mới + `<!-- @@TIEP@@ -->`. Ghi log sau mỗi lần.
3. Viết xong toàn bộ thì xóa dòng `<!-- @@TIEP@@ -->`.

### Yêu cầu nội dung

- Đủ 14 section bắt buộc đúng thứ tự (AGENTS.md mục 5).
- Với **mỗi** thuật toán/kỹ thuật chính trong chủ đề: mô tả, ý nghĩa, lý do cần (so sánh với cách ngây thơ bằng số phép tính cụ thể), tuần tự các bước (`.algo-steps` + `.pseudo`), cách hoạt động giải thích chi tiết (vì sao đúng, vì sao nhanh), ví dụ trực quan.
- Người đọc là học sinh lớp 9: tiếng Việt chuẩn có dấu, xưng “em”, câu ngắn, ví dụ đời thường, đi từ cơ bản đến nâng cao. Toán học chính xác; tự tính lại mọi con số. 3 500–6 000 từ. Không emoji.
- Trực quan: ≥ 1 `.stepper` có ≥ 5 khung hình chạy tay trọn một ví dụ nhỏ (`.arr/.cell`, `.grid-viz`, `.bars`, bảng `.trace`, SVG); thêm ≥ 1 sơ đồ SVG hoặc bảng minh họa.
- Widget tương tác `assets/js/viz/SLUG.js` (khuyến khích): JS thuần, IIFE, `CP.mount('#viz-SLUG', root => …)`, không biến toàn cục, chịu dữ liệu nhập sai, chỉ dùng class/token CSS có sẵn, tôn trọng `CP.reduceMotion`, qua `node --check`; nạp bằng `<script src="../assets/js/viz/SLUG.js"></script>` sau main.js.
- Code: chương trình C++17 hoàn chỉnh, chú thích tiếng Việt; **biên dịch và chạy thử** `g++ -std=c++17 -O2 -Wall` với ví dụ Input/Output trong bài trước khi đưa vào. Trong HTML thoát `<` `>` `&` thành `&lt;` `&gt;` `&amp;`.
- Liên kết sang chủ đề khác bằng `href="<slug>.html"`.

## 5. Kiểm tra

- `python3 scripts/validate.py topics/SLUG.html` phải hết lỗi (✗); xử lý cảnh báo hợp lý.
- Tùy chọn, tối đa 1 lần: chụp ảnh để soát giao diện
  `~/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1300,2600 --virtual-time-budget=5000 --screenshot=$SP/SLUG/shot.png "file:///home/hieu/personal/thidaulaptrinh/topics/SLUG.html#truc-quan"` rồi Read ảnh.

## 6. Đóng phiên

`python3 scripts/agentctl.py session end $(cat $SP/SLUG/sid) --status done --summary "<số bài tập (VI/EN), số từ, widget có/không>"`

## Báo cáo cuối (≤ 120 từ)

Số bài tập (bao nhiêu tiếng Việt), số từ, có widget không, vấn đề còn tồn tại, đề xuất sửa file dùng chung (nếu có).
