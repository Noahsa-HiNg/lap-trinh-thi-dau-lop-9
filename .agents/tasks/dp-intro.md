# 7.1 Nhập môn quy hoạch động

- **slug:** `dp-intro` · **chuyên đề:** CĐ7 · Quy hoạch động
- **file:** `topics/dp-intro.html` (+ tùy chọn `assets/js/viz/dp-intro.js`)
- **giáo án:** Chuyên đề 7 (quy trình 4 bước, Buổi 1, ý 1–3 và 5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=dp-intro`.

## Phạm vi nội dung

Fibonacci đệ quy thường (đếm số lời gọi n = 30, 40, 45 — chạy C++ lấy số thật), bài con gối nhau; đệ quy có nhớ (top-down) và bảng phương án (bottom-up); hai điều kiện: bài con gối nhau, cấu trúc con tối ưu; QUY TRÌNH 4 BƯỚC (trạng thái, công thức, cơ sở, đáp án); cách nghĩ trạng thái; leo cầu thang 1/2 bậc, mở rộng 1..k bậc, bậc hỏng; Frog 1 (min); thứ tự tính; tiết kiệm bộ nhớ; các dạng QHĐ ở THCS (đếm cách, tối ưu, dãy con — liên kết dp-grid, lis, knapsack, lcs do agent khác viết); QHĐ vs tham lam vs quay lui.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Dice Combinations (1633), AtCoder DP A Frog 1 https://atcoder.jp/contests/dp/tasks/dp_a, B Frog 2, C Vacation; bài leo cầu thang / Fibonacci mod / đếm số cách tiếng Việt trên LQDOJ/VNOJ/MarisaOJ.

## Gợi ý minh họa

stepper ≥ 6 khung điền dp leo cầu thang (hai ô trước is-cmp, ô đang tính is-active); SVG cây fib(6) tô nút tính lặp và cây sau khi nhớ; stepper Frog 1; widget đếm số lời gọi fib thường vs có nhớ, hoặc bảng leo cầu thang với tập bước tùy chọn.

## Ghi chú

Liên kết: recursion, backtracking, greedy, dp-grid, lis, knapsack, lcs.
