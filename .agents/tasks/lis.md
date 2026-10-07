# 7.3 Dãy con tăng dài nhất

- **slug:** `lis` · **chuyên đề:** CĐ7 · Quy hoạch động
- **file:** `topics/lis.html` (+ tùy chọn `assets/js/viz/lis.js`)
- **giáo án:** Chuyên đề 7 (Buổi 2 — LIS) và Chuyên đề 5 (bài LIS bản khó)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=lis`.

## Phạm vi nội dung

dãy con (giữ thứ tự, không cần liên tiếp), 2ⁿ dãy con; QHĐ O(n²): dp[i] = 1 + max dp[j] (j < i, a[j] < a[i]) — vì sao trạng thái 'kết thúc tại i'; đáp án max dp; truy vết; tăng chặt vs không giảm; O(n log n): mảng tails + lower_bound, chứng minh tails tăng và vì sao thay thế không sai, tails không phải dãy đáp án; truy vết trong O(n log n); không giảm dùng upper_bound; dãy giảm dài nhất; đếm số LIS (nâng cao); ứng dụng: xếp hộp/búp bê (sắp một chiều rồi LIS chiều kia).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

VNOJ LIQ https://oj.vnoi.info/problem/liq, VNOJ LIS https://oj.vnoi.info/problem/lis, CSES Increasing Subsequence (1145), CSES Towers (1073); biến thể dãy con tăng tiếng Việt trên VNOJ/LQDOJ (chỉ đưa nếu kiểm chứng đúng chủ đề).

## Gợi ý minh họa

≥ 2 stepper: (1) hai hàng .arr a[] và dp[] với j đang xét is-cmp; (2) tails cập nhật bằng lower_bound từng phần tử (liên hệ xếp bài thành chồng); SVG nối các phần tử của dãy tìm được; widget nhập dãy → dp, tails từng bước, tô LIS.

## Ghi chú

Liên kết: dp-intro, binary-search, sorting, lcs.
