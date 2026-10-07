# 2.4 Đồng dư & lũy thừa nhanh

- **slug:** `modular-power` · **chuyên đề:** CĐ2 · Số học
- **file:** `topics/modular-power.html` (+ tùy chọn `assets/js/viz/modular-power.js`)
- **giáo án:** Chuyên đề 2 (Buổi 3, ý 5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=modular-power`.

## Phạm vi nội dung

phép chia có dư, đồng dư (đồng hồ 12 giờ, thứ trong tuần); cộng/trừ/nhân lấy mod từng bước (chứng minh ngắn), chia thì không; vì sao mod 10⁹+7; số âm ((a % m + m) % m); lũy thừa ngây thơ O(n); lũy thừa nhanh đệ quy a^n = (a^(n/2))² và vòng lặp theo bit của số mũ, ≈ 2·log₂n phép nhân; nhân mod tránh tràn (__int128) nâng cao; định lý Fermat nhỏ và nghịch đảo modulo a^(p−2); ứng dụng: chữ số tận cùng, đếm số cách lớn, chuẩn bị cho C(n, k) mod p; a^(b^c) mod p (giảm mũ theo p−1).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Exponentiation (1095), Exponentiation II (1712); bài chữ số tận cùng của a^b, a^b mod m tiếng Việt trên LQDOJ/VNOJ/MarisaOJ; một bài Codeforces về chữ số tận cùng (kiểm chứng).

## Gợi ý minh họa

stepper 3¹³ mod 7 theo bit của 13 = 1101₂ với bảng .trace (bit, a, r); SVG đồng hồ mod 12; widget (BigInt) nhập a, n, m → bảng từng bước, số phép nhân so với ngây thơ.

## Ghi chú

Liên kết: gcd-lcm, binomial, counting.
