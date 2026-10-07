# 4.3 Sắp xếp & so sánh tùy biến

- **slug:** `sorting` · **chuyên đề:** CĐ4 · Cộng dồn, sắp xếp, hai con trỏ
- **file:** `topics/sorting.html` (+ tùy chọn `assets/js/viz/sorting.js`)
- **giáo án:** Chuyên đề 4 (Buổi 2, ý 3)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=sorting`.

## Phạm vi nội dung

vì sao sắp xếp là nền (hai con trỏ, chặt nhị phân, tham lam); chọn, nổi bọt, chèn O(n²) từng bước + bất biến; trộn (merge sort) chia để trị O(n log n), vì sao log n tầng; giới thiệu quick sort và trường hợp xấu; đếm (counting sort) O(n + k); ổn định; std::sort, greater<>(), lambda so sánh, strict weak ordering (không dùng <=), sắp theo khóa chính rồi phụ (điểm giảm, bằng điểm thì tên tăng), stable_sort; sort + unique, nén tọa độ (giới thiệu), đếm nghịch thế bằng merge sort (nâng cao); bảng so sánh. Độ dài có thể 4 000–7 000 từ.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Distinct Numbers (1621), Stick Lengths (1074), Restaurant Customers (1619); một bài Codeforces sắp xếp theo nhiều khóa; bài sắp xếp danh sách học sinh theo điểm rồi tên, đếm nghịch thế (VNOJ NKINV nếu đúng) tiếng Việt.

## Gợi ý minh họa

≥ 2 stepper bằng .bars (sắp xếp chèn và trộn trên cùng dãy 8 số); SVG cây chia để trị merge sort; widget chọn thuật toán, nhập/sinh dãy, hoạt hình .bars, đếm so sánh/đổi chỗ.

## Ghi chú

Liên kết: two-pointers, binary-search, greedy, recursion, stl.
