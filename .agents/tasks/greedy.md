# 6.3 Tham lam

- **slug:** `greedy` · **chuyên đề:** CĐ6 · Đệ quy, quay lui, tham lam
- **file:** `topics/greedy.html` (+ tùy chọn `assets/js/viz/greedy.js`)
- **giáo án:** Chuyên đề 6 (Buổi 2, ý 3)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=greedy`.

## Phạm vi nội dung

chọn tốt nhất trước mắt, không xét lại; tính chất lựa chọn tham lam; chọn nhiều hoạt động nhất: sắp theo thời điểm kết thúc, chứng minh hoán đổi từng bước; phản ví dụ cho tiêu chí khác (bắt đầu sớm nhất, ngắn nhất); đổi tiền: đúng với mệnh giá tiền Việt Nam, sai với {1, 3, 4} và 6 đồng → QHĐ; xếp lịch giảm tổng thời gian chờ (sắp theo thời gian xử lý, hoán đổi hai việc kề nhau); Tasks and Deadlines; cái túi phân số vs 0/1; Missing Coin Sum; tìm phản ví dụ bằng lời giải trâu + test ngẫu nhiên; dấu hiệu nhận biết.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Movie Festival (1629), Tasks and Deadlines (1630), Missing Coin Sum (2183), Stick Lengths (1074); các bài tham lam tiếng Việt VNOI Wiki "Tham lam" gợi ý; bài xếp lịch, đổi tiền tiếng Việt trên LQDOJ/VNOJ/MarisaOJ.

## Gợi ý minh họa

stepper SVG dòng thời gian hoạt động (thanh ngang) chọn/loại (is-ok/is-bad); bảng phản ví dụ {1,3,4}; SVG minh họa hoán đổi; widget nhập mệnh giá và số tiền → so tham lam với tối ưu (QHĐ nhỏ trong JS).

## Ghi chú

Liên kết: sorting, knapsack, binary-search-answer, dp-intro, brute-force-formula.
