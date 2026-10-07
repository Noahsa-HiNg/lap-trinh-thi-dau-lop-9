# 9.4 Số lớn

- **slug:** `big-numbers` · **chuyên đề:** CĐ9 · Cấu trúc dữ liệu & xâu
- **file:** `topics/big-numbers.html` (+ tùy chọn `assets/js/viz/big-numbers.js`)
- **giáo án:** (không có trong giáo án — phần mở rộng; tự thiết kế)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=big-numbers`.

## Phạm vi nội dung

vì sao cần (long long ≈ 9,2·10¹⁸; 50! hay số 1000 chữ số); biểu diễn bằng xâu/vector chữ số lưu ngược và vì sao; so sánh (độ dài trước); cộng có nhớ (đặt tính rồi tính); trừ có mượn (a ≥ b, số 0 thừa, kết quả âm); nhân với số nhỏ; nhân hai số lớn O(n·m) (cộng vào vị trí i + j rồi xử lý nhớ); chia cho số nhỏ và lấy dư (trái sang phải); ứng dụng: n! với n ≤ 1000, 2ⁿ, Fibonacci lớn, kiểm tra chia hết số rất dài; cơ số 10⁹ (nâng cao); __int128 khi chỉ vượt long long một chút (in bằng tay).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

SPOJ FCTRL2 (Small factorials), SPOJ ADDREV; bài cộng/trừ/nhân số lớn, giai thừa lớn, chia số lớn cho số nhỏ, Fibonacci lớn tiếng Việt trên VNOJ/LQDOJ/MarisaOJ; một bài Codeforces so sánh hai số rất dài.

## Gợi ý minh họa

≥ 2 stepper: (1) cộng 9 876 + 2 345 theo cột (.arr căn phải, ô nhớ data-ptr đỏ); (2) nhân 123 × 45 theo vị trí i + j; widget nhập hai số dài, chọn +, −, × → từng cột và kết quả (đối chiếu BigInt). Kiểm tra kết quả ví dụ bằng python3.

## Ghi chú

Liên kết: strings, cpp-contest-basics, modular-power.
