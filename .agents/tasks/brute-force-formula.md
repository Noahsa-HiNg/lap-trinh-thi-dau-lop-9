# 1.3 Duyệt trâu, mô phỏng & công thức

- **slug:** `brute-force-formula` · **chuyên đề:** CĐ1 · Độ phức tạp & kỹ thuật cơ bản
- **file:** `topics/brute-force-formula.html` (+ tùy chọn `assets/js/viz/brute-force-formula.js`)
- **giáo án:** Chuyên đề 1 (ý 4 "Toán giúp giảm độ phức tạp") và "Chiến thuật phòng thi"
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=brute-force-formula`.

## Phạm vi nội dung

duyệt toàn bộ (liệt kê mọi ứng viên rồi kiểm tra), khi nào trâu là đủ; mô phỏng (làm đúng theo đề, mô phỏng có chu kỳ); chiến lược subtask: viết trâu đúng trước, dùng làm bộ đối chiếu; đối chiếu chéo (stress test) có script mẫu bash + C++; tăng tốc bằng toán: tổng 1..n = n(n+1)/2 (ghép cặp Gauss), cấp số cộng, đếm số chia hết cho k trong [a, b] = b/k − (a−1)/k, số chữ số 0 tận cùng của n! (Legendre), ô trên xoắn ốc số O(1), bớt một vòng lặp lồng nhờ nhận xét (vòng thứ ba suy ra từ hai vòng đầu).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Number Spiral (1071), Trailing Zeros (1618), Missing Number (1083), Two Knights (1072); bài mô phỏng tiếng Việt trên LQDOJ/VNOJ/MarisaOJ; bài đếm số chia hết cho k trong đoạn.

## Gợi ý minh họa

SVG hai hàng 1..10 và 10..1 ghép cặp (Gauss); stepper xoắn ốc số trên .grid-viz; stepper đếm thừa số 5 trong 100!; widget so sánh trâu vs công thức (số phép tính, thời gian).

## Ghi chú

Liên kết: complexity, divisors-primes, prefix-sum, backtracking.
