# 4.1 Mảng cộng dồn

- **slug:** `prefix-sum` · **chuyên đề:** CĐ4 · Cộng dồn, sắp xếp, hai con trỏ
- **file:** `topics/prefix-sum.html` (+ tùy chọn `assets/js/viz/prefix-sum.js`)
- **giáo án:** Chuyên đề 4 (Buổi 1, ý 1)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=prefix-sum`.

## Phạm vi nội dung

q truy vấn tổng đoạn, ngây thơ O(n·q); S[i], S[0] = 0, tổng = S[r] − S[l−1] (chứng minh triệt tiêu), ý tưởng trả trước; chỉ số từ 1 vs 0; long long; đếm phần tử thỏa điều kiện trong đoạn (mảng 0/1, kết hợp sàng); cộng dồn 2D S[i][j] = a + S[i−1][j] + S[i][j−1] − S[i−1][j−1] và tổng hình chữ nhật bằng bao hàm – loại trừ; đoạn con tổng bằng k (map đếm S), đoạn con tổng chia hết cho k (đếm số dư, số dư âm); đoạn con tổng lớn nhất qua min tiền tố; quan hệ ngược với mảng hiệu.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Static Range Sum Queries (1646), Forest Queries (1652), Subarray Sums II (1661), Subarray Divisibility (1662); bài cộng dồn tiếng Việt mà VNOI Wiki "Mảng cộng dồn và mảng hiệu" liệt kê; LQDOJ/MarisaOJ bài tổng đoạn.

## Gợi ý minh họa

stepper hai hàng .arr (a và S) xây S từng bước rồi trả lời truy vấn; .grid-viz/SVG cộng dồn 2D với 4 hình chữ nhật; widget nhập mảng, chọn l, r → tô đoạn, tô S[r], S[l−1], hiện phép trừ.

## Ghi chú

Liên kết: complexity, difference-array, two-pointers, sieve, stl.
