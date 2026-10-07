# 6.2 Quay lui & nhánh cận

- **slug:** `backtracking` · **chuyên đề:** CĐ6 · Đệ quy, quay lui, tham lam
- **file:** `topics/backtracking.html` (+ tùy chọn `assets/js/viz/backtracking.js`)
- **giáo án:** Chuyên đề 6 (Buổi 1, ý 2)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=backtracking`.

## Phạm vi nội dung

thử từng lựa chọn, đi sâu, trả lại trạng thái; mô hình Try(i); sinh dãy nhị phân (2ⁿ), tập con, hoán vị với used (n!), tổ hợp chập k tăng dần; vì sao phải trả lại trạng thái; 8 quân hậu (cột, đường chéo i+j và i−j+n); nhánh cận (tổng tập con, người du lịch nhỏ, chia táo), cắt theo ràng buộc khả thi; ước lượng số trạng thái và giới hạn n (≤ 20 tập con, ≤ 10 hoán vị); dùng quay lui lấy điểm subtask và làm lời giải trâu; next_permutation; giới thiệu duyệt tập con bằng bitmask.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Creating Strings (1622), Apple Division (1623), Chessboard and Queens (1624), Grid Paths (1625, nâng cao); bài liệt kê dãy nhị phân, hoán vị, tổ hợp, xâu không có hai bit 1 liền nhau, tổng tập con tiếng Việt trên LQDOJ/VNOJ/MarisaOJ.

## Gợi ý minh họa

stepper ≥ 6 khung 4 quân hậu trên .grid-viz 4×4 đặt/nhấc quân (ô bị tấn công is-bad); SVG cây quay lui sinh hoán vị {1,2,3}; stepper mảng x[] và used[]; widget N hậu (4–8) từng bước, đếm số nút đã thử.

## Ghi chú

Liên kết: recursion, counting, complexity, brute-force-formula, dp-intro.
