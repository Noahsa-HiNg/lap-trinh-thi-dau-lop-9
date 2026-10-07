# 1.1 Độ phức tạp thuật toán

- **slug:** `complexity` · **chuyên đề:** CĐ1 · Độ phức tạp & kỹ thuật cơ bản
- **file:** `topics/complexity.html` (+ tùy chọn `assets/js/viz/complexity.js`)
- **giáo án:** Chuyên đề 1
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=complexity`.

## Phạm vi nội dung

Big-O (đếm số phép tính theo n, bỏ hằng số và bậc thấp: 3n²+5n+7 = O(n²)); cách đếm: vòng lặp đơn, lồng nhau, vòng chia đôi → log n, vòng j += i → n log n (tổng điều hòa), đệ quy hai nhánh → 2ⁿ; các lớp O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ), O(n!) kèm bảng giá trị; quy tắc ~10⁸ phép/giây; BẢNG TRA giới hạn n → độ phức tạp → thuật toán (lấy từ giáo án); độ phức tạp bộ nhớ (256 MB ≈ 6·10⁷ int; mảng 2 chiều); tốt nhất/xấu nhất/trung bình; đọc subtask để chọn thuật toán; ví dụ tổng 1..n với n = 10¹² (O(n) → O(1)).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Weird Algorithm (1068), Missing Number (1083), Increasing Array (1094), Number Spiral (1071), Trailing Zeros (1618); thêm bài tiếng Việt luyện ước lượng độ phức tạp / thay vòng lặp bằng công thức.

## Gợi ý minh họa

stepper đếm số lần lặp của 3 đoạn code (1 vòng, 2 vòng lồng, vòng chia đôi) với n = 8; SVG đồ thị tăng trưởng các hàm; widget 'máy đếm phép tính': nhập n, chọn đoạn code mẫu, đếm số lần lặp và ước lượng thời gian (khác thanh trượt trang chủ).

## Ghi chú

Liên kết: prefix-sum, binary-search, backtracking, brute-force-formula.
