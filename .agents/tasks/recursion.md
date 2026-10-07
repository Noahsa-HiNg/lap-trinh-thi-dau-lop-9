# 6.1 Đệ quy & chia để trị

- **slug:** `recursion` · **chuyên đề:** CĐ6 · Đệ quy, quay lui, tham lam
- **file:** `topics/recursion.html` (+ tùy chọn `assets/js/viz/recursion.js`)
- **giáo án:** Chuyên đề 6 (Buổi 1, ý 1)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=recursion`.

## Phạm vi nội dung

hàm gọi chính nó; điều kiện dừng + lời gọi nhỏ hơn; liên hệ quy nạp; ngăn xếp lời gọi (mỗi lời gọi có biến riêng, trả về ngược thứ tự); cây đệ quy; ví dụ: giai thừa, tổng chữ số, lũy thừa nhanh đệ quy, Fibonacci (bùng nổ 2ⁿ, đếm số lời gọi — mở đường QHĐ có nhớ), in nhị phân, đảo xâu; tháp Hà Nội (3 bước, chứng minh 2ⁿ − 1 là ít nhất); chia để trị: chia – trị – kết hợp (max mảng, merge sort, lũy thừa nhanh, giới thiệu đếm nghịch thế); độ sâu và tràn stack (10⁵–10⁶ tầng); đệ quy vs vòng lặp.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Tower of Hanoi (2165), CSES Gray Code (2205); bài đệ quy tiếng Việt (tổng chữ số, giai thừa, Fibonacci, tháp Hà Nội) trên LQDOJ/MarisaOJ/VNOJ; một bài Codeforces chia để trị đơn giản.

## Gợi ý minh họa

stepper ≥ 6 khung ngăn xếp lời gọi của fact(4) đi xuống rồi trả về; SVG cây đệ quy fib(5) tô nút trùng; SVG tháp Hà Nội 3 đĩa; widget tháp Hà Nội n đĩa (1–7) từng bước/tự chạy, đếm bước.

## Ghi chú

Liên kết: backtracking, dp-intro, sorting, modular-power, graph-dfs.
