# 2.3 ƯCLN, BCNN & thuật toán Euclid

- **slug:** `gcd-lcm` · **chuyên đề:** CĐ2 · Số học
- **file:** `topics/gcd-lcm.html` (+ tùy chọn `assets/js/viz/gcd-lcm.js`)
- **giáo án:** Chuyên đề 2 (Buổi 2, ý 4)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=gcd-lcm`.

## Phạm vi nội dung

ƯCLN/BCNN; cách ngây thơ O(min); Euclid dạng trừ và dạng chia dư; chứng minh gcd(a, b) = gcd(b, a mod b); vì sao O(log) (sau 2 bước giảm ít nhất một nửa, Fibonacci là xấu nhất); đệ quy và vòng lặp, std::gcd; BCNN = a / gcd * b; gcd/lcm nhiều số, gcd(0, a) = a; ứng dụng: rút gọn phân số, chia nhóm đều, chu kỳ gặp lại, ô vuông lớn nhất lát kín hình chữ nhật; nâng cao: Euclid mở rộng ax + by = gcd, phương trình ax + by = c có nghiệm khi nào, liên hệ nghịch đảo modulo.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Common Divisors (1081); bài ƯCLN/BCNN, rút gọn phân số, ƯCLN của dãy, chu kỳ gặp lại tiếng Việt trên LQDOJ/VNOJ/MarisaOJ; Codeforces 1458A Row GCD (nâng cao); bài Euclid mở rộng.

## Gợi ý minh họa

stepper Euclid trên hình chữ nhật 21×15 (SVG cắt dần hình vuông lớn nhất) kèm bảng .trace a, b, a mod b; widget nhập a, b → từng bước Euclid, số bước so với duyệt.

## Ghi chú

Liên kết: divisors-primes, modular-power.
