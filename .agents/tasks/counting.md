# 3.1 Quy tắc đếm & nguyên lý bù trừ

- **slug:** `counting` · **chuyên đề:** CĐ3 · Tổ hợp & đếm
- **file:** `topics/counting.html` (+ tùy chọn `assets/js/viz/counting.js`)
- **giáo án:** Chuyên đề 3
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=counting`.

## Phạm vi nội dung

quy tắc cộng (trường hợp rời nhau) và nhân (các bước nối tiếp); hoán vị n!; chỉnh hợp A(n, k) = n!/(n−k)!; tổ hợp C(n, k) = n!/(k!(n−k)!) và vì sao chia k!; ví dụ lớp 30 bạn: 870 vs 435; hoán vị lặp; đếm phần bù; bù trừ 2 tập, 3 tập, tổng quát qua duyệt tập con (nâng cao); nguyên lý Dirichlet ngắn gọn; số lớn → modulo (liên kết modular-power, binomial); kiểm tra công thức bằng duyệt trâu n nhỏ.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Bit Strings (1617), Two Knights (1072), Creating Strings II (1715), Prime Multiples (2185, nâng cao); bài đếm số chia hết cho a hoặc b, đếm cách chọn, đếm hoán vị tiếng Việt trên LQDOJ/VNOJ/MarisaOJ.

## Gợi ý minh họa

stepper liệt kê chỉnh hợp chập 2 của {A,B,C,D} rồi gộp thành tổ hợp (thấy chia 2!); SVG cây lựa chọn; SVG Venn 2–3 tập; widget nhập n, k → tính và liệt kê (khi nhỏ).

## Ghi chú

Liên kết: binomial, backtracking, modular-power, dp-intro.
