# 4.2 Mảng hiệu

- **slug:** `difference-array` · **chuyên đề:** CĐ4 · Cộng dồn, sắp xếp, hai con trỏ
- **file:** `topics/difference-array.html` (+ tùy chọn `assets/js/viz/difference-array.js`)
- **giáo án:** Chuyên đề 4 (Buổi 1, ý 2)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=difference-array`.

## Phạm vi nội dung

nhiều thao tác cộng x vào [l, r] rồi hỏi mảng cuối, ngây thơ O(n·q); D[i] = a[i] − a[i−1]; D[l] += x, D[r+1] −= x; khôi phục bằng cộng dồn; vì sao đúng; quan hệ ngược với cộng dồn; đếm số đoạn phủ mỗi điểm, điểm phủ nhiều nhất, độ dài phủ ≥ k lần; tọa độ lớn: quét sự kiện / nén tọa độ (giới thiệu); mảng hiệu 2D (4 góc) rồi cộng dồn 2D; cập nhật rồi truy vấn tổng đoạn bằng cộng dồn lần hai; khi cập nhật và truy vấn xen kẽ cần cấu trúc khác (nhắc Fenwick).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

Codeforces 295A Greg and Array, 816B Karen and Coffee; bài mảng hiệu tiếng Việt mà VNOI Wiki liệt kê; LQDOJ/MarisaOJ bài cập nhật đoạn.

## Gợi ý minh họa

stepper áp dụng 3 cập nhật lên D (hai ô đổi màu) rồi cộng dồn ra mảng cuối; SVG các đoạn chồng trên trục số và số lớp phủ; .grid-viz mảng hiệu 2D với 4 góc; widget thêm thao tác (l, r, x) xem D và mảng kết quả.

## Ghi chú

Liên kết: prefix-sum, sorting, two-pointers.
