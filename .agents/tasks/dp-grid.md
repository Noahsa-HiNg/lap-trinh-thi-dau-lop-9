# 7.2 QHĐ trên lưới

- **slug:** `dp-grid` · **chuyên đề:** CĐ7 · Quy hoạch động
- **file:** `topics/dp-grid.html` (+ tùy chọn `assets/js/viz/dp-grid.js`)
- **giáo án:** Chuyên đề 7 (Buổi 1 — đường đi trên lưới có ô cấm)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=dp-grid`.

## Phạm vi nội dung

đếm đường đi góc trên trái → dưới phải chỉ đi phải/xuống; C(m+n, m) đường vs QHĐ O(m·n); dp[i][j] = dp[i−1][j] + dp[i][j−1], ô cấm = 0, cơ sở; modulo; liên hệ tổ hợp khi không có ô cấm; đường đi tổng lớn nhất / chi phí nhỏ nhất (−∞ cho ô không tới được); truy vết; 3 hướng như QBMAX (thứ tự tính theo cột); tiết kiệm bộ nhớ một hàng; nâng cao: hai người cùng đi (trạng thái theo đường chéo, giới thiệu), đường qua ô bắt buộc.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Grid Paths I (1638), AtCoder DP H Grid 1 https://atcoder.jp/contests/dp/tasks/dp_h, VNOJ QBMAX https://oj.vnoi.info/problem/qbmax; bài đường đi tổng lớn nhất / đếm đường đi có ô cấm tiếng Việt trên LQDOJ/MarisaOJ/VNOJ.

## Gợi ý minh họa

stepper ≥ 6 khung điền dp trên .grid-viz 4×5 có ô cấm (is-wall), ô trên/trái is-cmp, ô đang tính is-active; stepper truy vết đường tổng lớn nhất (is-path); widget bấm ô đặt/bỏ ô cấm, bảng số đường đi cập nhật ngay.

## Ghi chú

Liên kết: dp-intro, binomial, lcs, flood-fill, bfs.
