# 4.4 Hai con trỏ & cửa sổ trượt

- **slug:** `two-pointers` · **chuyên đề:** CĐ4 · Cộng dồn, sắp xếp, hai con trỏ
- **file:** `topics/two-pointers.html` (+ tùy chọn `assets/js/viz/two-pointers.js`)
- **giáo án:** Chuyên đề 4 (Buổi 2, ý 4, bảng bài tập)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=two-pointers`.

## Phạm vi nội dung

tìm cặp a[i] + a[j] = x trên mảng đã sắp, ngây thơ O(n²); hai con trỏ ngược chiều và chứng minh không bỏ sót; vì sao O(n); đếm số cặp (cả khi trùng); cùng chiều: trộn hai dãy, ghép cặp hai dãy (Apartments); cửa sổ trượt độ dài thay đổi: dài nhất tổng ≤ k (số không âm), ngắn nhất tổng ≥ s, đếm đoạn thỏa điều kiện, dài nhất ≤ k giá trị phân biệt (mảng đếm); cửa sổ độ dài cố định; dấu hiệu nhận biết (tính đơn điệu); khi có số âm → cộng dồn + map.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

LQDOJ FINDPAIR https://lqdoj.edu.vn/problem/findpair, VNOJ TWOSUM https://oj.vnoi.info/problem/twosum, LQDOJ CNTPAIR02 https://lqdoj.edu.vn/problem/cntpair02, VNOJ NKSGAME https://oj.vnoi.info/problem/nksgame, CSES Sum of Two Values (1640), Apartments (1084), Subarray Sums I (1660), Playlist (1141).

## Gợi ý minh họa

≥ 2 stepper .arr với data-ptr i/j (tìm cặp tổng x; cửa sổ trượt tô vùng is-active); bảng ma trận cặp (i, j) cho thấy mỗi bước loại cả hàng/cột; widget nhập dãy và x, bước tiếp xem i, j di chuyển.

## Ghi chú

Liên kết: sorting, prefix-sum, binary-search, stack-queue.
