# 10.1 QHĐ trên xâu: LCS & khoảng cách sửa

- **slug:** `lcs` · **chuyên đề:** CĐ10 · Nâng cao hướng chuyên Tin
- **file:** `topics/lcs.html` (+ tùy chọn `assets/js/viz/lcs.js`)
- **giáo án:** Chuyên đề 7 (quy trình 4 bước; dạng dãy con chung dài nhất)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=lcs`.

## Phạm vi nội dung

LCS hai xâu (giữ thứ tự, không cần liên tiếp), khác xâu con liên tiếp; 2ⁿ dãy con không duyệt được; dp[i][j], công thức (bằng nhau: dp[i−1][j−1] + 1; khác: max hai ô), chứng minh; cơ sở hàng/cột 0; truy vết in một LCS; edit distance (chèn, xóa, thay; dp[i][0] = i, dp[0][j] = j); dãy con đối xứng dài nhất = LCS(s, đảo s), số ký tự ít nhất cần chèn để đối xứng; xâu con chung liên tiếp dài nhất (bằng 0 khi khác); 2 hàng tiết kiệm bộ nhớ (mất truy vết); O(n·m), n, m ≤ 5000; ứng dụng diff, sửa chính tả, ADN.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

VNOJ QBSTR https://oj.vnoi.info/problem/qbstr, VNOJ NKPALIN; CSES Edit Distance (1639), CSES Longest Common Subsequence (nếu tồn tại); AtCoder DP F LCS https://atcoder.jp/contests/dp/tasks/dp_f.

## Gợi ý minh họa

stepper ≥ 6 khung điền table.dp-table LCS hai xâu ngắn (ô so sánh is-cmp, đang tính is-active), khung cuối truy vết (is-ok); widget nhập hai xâu → bảng LCS hoặc edit distance, tô truy vết, in kết quả.

## Ghi chú

Liên kết: dp-intro, dp-grid, lis, strings. Người đọc: học sinh lớp 9 giỏi chuẩn bị thi chuyên.
