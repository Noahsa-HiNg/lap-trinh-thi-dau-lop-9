# 2.2 Sàng Eratosthenes

- **slug:** `sieve` · **chuyên đề:** CĐ2 · Số học
- **file:** `topics/sieve.html` (+ tùy chọn `assets/js/viz/sieve.js`)
- **giáo án:** Chuyên đề 2 (Buổi 2, ý 3)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=sieve`.

## Phạm vi nội dung

sàng Eratosthenes (đánh dấu bội), vì sao bắt đầu từ i·i và chỉ cần i ≤ √N, vì sao đúng, O(N log log N) giải thích qua tổng N/p, bộ nhớ (vector<bool>/bitset, N = 10⁷); truy vấn O(1); kết hợp cộng dồn đếm số nguyên tố trong đoạn; sàng ước nguyên tố nhỏ nhất (SPF) và phân tích thừa số O(log n); sàng trên đoạn [L, R] với R ≤ 10¹², R − L ≤ 10⁶ (nâng cao); sàng ước/tổng ước kiểu điều hòa O(N log N); giới thiệu sàng tuyến tính.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

VNOJ PNUMBER https://oj.vnoi.info/problem/pnumber, VNOJ FPRIME https://oj.vnoi.info/problem/fc075_fprime, CSES Counting Divisors (1713), SPOJ PRIME1 (sàng đoạn); bài siêu nguyên tố / đếm nguyên tố trong đoạn tiếng Việt.

## Gợi ý minh họa

stepper sàng trên .grid-viz 1..50 gạch bội của 2, 3, 5, 7; bảng SPF; widget nhập N ≤ 200, xem từng số nguyên tố gạch bội, đếm số lần gạch.

## Ghi chú

Liên kết: divisors-primes, prefix-sum, complexity.
