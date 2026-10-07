# 3.2 Tính C(n, k) & tam giác Pascal

- **slug:** `binomial` · **chuyên đề:** CĐ3 · Tổ hợp & đếm
- **file:** `topics/binomial.html` (+ tùy chọn `assets/js/viz/binomial.js`)
- **giáo án:** Chuyên đề 3 (ý 3–4)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=binomial`.

## Phạm vi nội dung

vì sao không tính trực tiếp n!/(k!(n−k)!) (tràn số; chia khi lấy mod); Pascal C(n, k) = C(n−1, k−1) + C(n−1, k) chứng minh bằng phần tử cuối, bảng O(n²), n ≤ 5000; đối xứng, tổng hàng = 2ⁿ; tính C(n, k) vừa long long bằng nhân/chia xen kẽ; n ≤ 10⁶: fact[], inv_fact[] (Fermat, tính ngược inv_fact[i] = inv_fact[i+1]·(i+1)), truy vấn O(1); ứng dụng: đường đi trên lưới C(m+n, m), chia kẹo Euler C(n+k−1, k−1), hoán vị lặp, nhị thức Newton; giới thiệu định lý Lucas.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Binomial Coefficients (1079), Distributing Apples (1716), Creating Strings II (1715); bài tam giác Pascal / C(n,k) mod 10⁹+7 tiếng Việt trên LQDOJ/VNOJ/MarisaOJ; một bài AtCoder đếm đường đi trên lưới (kiểm chứng).

## Gợi ý minh họa

stepper dựng tam giác Pascal từng hàng (hai ô trên is-cmp cộng xuống ô is-active); .grid-viz đếm đường đi; SVG sao và vạch cho chia kẹo; widget nhập n ≤ 15 → tam giác Pascal, bấm ô thấy hai ô cha.

## Ghi chú

Liên kết: counting, modular-power, dp-grid, dp-intro.
