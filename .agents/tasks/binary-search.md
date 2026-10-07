# 5.1 Tìm kiếm nhị phân trên mảng

- **slug:** `binary-search` · **chuyên đề:** CĐ5 · Tìm kiếm nhị phân
- **file:** `topics/binary-search.html` (+ tùy chọn `assets/js/viz/binary-search.js`)
- **giáo án:** Chuyên đề 5
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=binary-search`.

## Phạm vi nội dung

đoán số 1..100 (≤ 7 lần); tuần tự O(n) vs nhị phân O(log n) (20 bước cho 10⁶, 60 cho 10¹⁸); điều kiện mảng đã sắp; lo, hi, mid, bất biến; mẫu an toàn có biến ans (đầu tiên ≥ x); mid = lo + (hi − lo)/2; lặp vô hạn, lệch một; lower_bound, upper_bound, số lần xuất hiện, đếm trong [a, b], vị trí cuối ≤ x; binary_search; nhiều truy vấn; dãy giảm/hàm so sánh; cầu nối 'vị trí đổi từ sai sang đúng' sang chặt nhị phân trên kết quả (bài 5.2 do agent khác viết, chỉ giới thiệu và liên kết).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

Codeforces 706B Interesting drink; CSES Sum of Two Values (1640); bài tìm kiếm nhị phân tiếng Việt trên LQDOJ/MarisaOJ/VNOJ (tìm vị trí, đếm số ≤ x).

## Gợi ý minh họa

stepper .arr 12–16 phần tử với data-ptr lo/mid/hi, phần loại is-dim; bảng/SVG số bước tuần tự vs nhị phân theo n; widget đoán số hoặc nhập mảng + x chạy lower_bound từng bước.

## Ghi chú

Liên kết: sorting, binary-search-answer, lis, two-pointers, complexity.
