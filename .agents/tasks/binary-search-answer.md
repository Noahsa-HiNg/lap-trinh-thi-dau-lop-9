# 5.2 Chặt nhị phân trên kết quả

- **slug:** `binary-search-answer` · **chuyên đề:** CĐ5 · Tìm kiếm nhị phân
- **file:** `topics/binary-search-answer.html` (+ tùy chọn `assets/js/viz/binary-search-answer.js`)
- **giáo án:** Chuyên đề 5 (ví dụ Cắt gỗ, ý 2, 4, 5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=binary-search-answer`.

## Phạm vi nội dung

đổi 'đáp án là bao nhiêu?' thành 'đáp án ≤ x được không?'; tính đơn điệu của check, tự chứng minh bằng một câu; quy trình 4 bước (miền [lo, hi], check thường tham lam O(n), chứng minh đơn điệu, mẫu có ans); O(n log(hi−lo)); Cắt gỗ (EKO); 'lớn nhất nhỏ nhất' (Array Division); 'nhỏ nhất lớn nhất' (Aggressive Cows); Factory Machines (tràn số trong check, dừng sớm); chặt số thực (lặp 60–100 lần: căn bậc hai, chia bánh); chọn cận hi; lỗi thường gặp. Bài 5.1 (nhị phân trên mảng) do agent khác viết.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

SPOJ EKO https://www.spoj.com/problems/EKO/, SPOJ AGGRCOW https://www.spoj.com/problems/AGGRCOW/, CSES Factory Machines (1620), Array Division (1085), Multiplication Table (2422); bài chặt nhị phân trên kết quả tiếng Việt trên VNOJ/LQDOJ/MarisaOJ.

## Gợi ý minh họa

stepper Cắt gỗ: SVG các khúc gỗ với đường cắt ở độ cao mid, phần gỗ thu được tô màu, kèm lo/hi; dải sai…sai đúng…đúng (.arr is-bad/is-ok); widget nhập chiều cao cây và m, kéo thanh độ cao xem lượng gỗ, rồi chạy nhị phân từng bước.

## Ghi chú

Liên kết: binary-search, greedy, prefix-sum, complexity.
