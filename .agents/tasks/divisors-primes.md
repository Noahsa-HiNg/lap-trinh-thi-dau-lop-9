# 2.1 Ước số & số nguyên tố

- **slug:** `divisors-primes` · **chuyên đề:** CĐ2 · Số học
- **file:** `topics/divisors-primes.html` (+ tùy chọn `assets/js/viz/divisors-primes.js`)
- **giáo án:** Chuyên đề 2 (Buổi 1, ý 1–2 phần Hiểu sâu lý thuyết)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=divisors-primes`.

## Phạm vi nội dung

ước, bội, chia hết; liệt kê ước O(n) → O(√n) (cặp d và n/d, viết d*d <= n); kiểm tra nguyên tố O(√n), cải tiến bỏ số chẵn và dạng 6k±1; phân tích thừa số nguyên tố bằng chia thử (vì sao phần còn lại > 1 là nguyên tố); công thức số ước (a1+1)(a2+1)…(ak+1) chứng minh bằng quy tắc nhân; công thức tổng ước; số chính phương (số mũ chẵn, số ước lẻ); số hoàn hảo; liệt kê ước tăng dần; n ≤ 10¹² chạy kịp; nhiều truy vấn → chuyển sang sàng.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

LTOJ "Kiểm tra số nguyên tố" https://ltoj.edu.vn/problem/for4, CSES Counting Divisors (1713); bài đếm ước / tổng ước / số hoàn hảo / phân tích thừa số tiếng Việt trên LQDOJ, MarisaOJ, VNOJ; Codeforces 762A k-th divisor.

## Gợi ý minh họa

SVG các cặp ước của 36 đối xứng quanh √36 = 6; stepper chia thử 360 = 2³·3²·5; cây phân tích thừa số SVG; widget nhập n → ước, thừa số, số phép chia so với O(n).

## Ghi chú

Liên kết: complexity, sieve, gcd-lcm, counting.
