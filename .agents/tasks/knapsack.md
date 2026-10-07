# 7.4 Cái túi & đổi tiền

- **slug:** `knapsack` · **chuyên đề:** CĐ7 · Quy hoạch động
- **file:** `topics/knapsack.html` (+ tùy chọn `assets/js/viz/knapsack.js`)
- **giáo án:** Chuyên đề 7 (Buổi 2 — cái túi, ý 4–5, bảng bài tập)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=knapsack`.

## Phạm vi nội dung

cái túi 0/1, 2ⁿ tập con vs O(n·W); bảng dp[i][j] chọn/không chọn; truy vết vật được chọn; mảng 1 chiều duyệt j GIẢM (vì sao, duyệt tăng dùng lặp vật); không giới hạn (j tăng); đổi tiền ít tờ nhất (∞, so với tham lam sai {1,3,4}); đếm số cách có thứ tự (Coin Combinations I, vòng ngoài là tổng) vs không thứ tự (II, vòng ngoài là đồng xu) — giải thích bằng ví dụ nhỏ; tập tổng tạo được (Money Sums, bool); giả đa thức O(n·W); W lớn giá trị nhỏ → đổi vai trò (Knapsack 2, nâng cao).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Book Shop (1158), Minimizing Coins (1634), Coin Combinations I (1635), Coin Combinations II (1636), Money Sums (1745); AtCoder DP D Knapsack 1 https://atcoder.jp/contests/dp/tasks/dp_d, E Knapsack 2; bài cái túi / đổi tiền tiếng Việt trên VNOJ/LQDOJ/MarisaOJ.

## Gợi ý minh họa

stepper ≥ 6 khung điền table.dp-table cho 3 đồ vật, W = 5 (ô không chọn/chọn is-cmp, ô đang tính is-active); stepper j tăng vs giảm trên mảng 1 chiều; widget nhập (w, v) và W → bảng dp + vật được chọn.

## Ghi chú

Liên kết: dp-intro, greedy, backtracking, dp-grid.
