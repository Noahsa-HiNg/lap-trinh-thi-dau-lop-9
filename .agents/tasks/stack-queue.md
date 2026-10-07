# 9.2 Ngăn xếp, hàng đợi & ngăn xếp đơn điệu

- **slug:** `stack-queue` · **chuyên đề:** CĐ9 · Cấu trúc dữ liệu & xâu
- **file:** `topics/stack-queue.html` (+ tùy chọn `assets/js/viz/stack-queue.js`)
- **giáo án:** (không có trong giáo án — phần mở rộng; tự thiết kế)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=stack-queue`.

## Phạm vi nội dung

ngăn xếp LIFO (chồng đĩa): push/pop/top, cài bằng mảng + đỉnh và std::stack; hàng đợi FIFO (xếp hàng mua vé): mảng vòng hoặc std::queue; deque; ứng dụng ngăn xếp: dãy ngoặc đúng nhiều loại, biểu thức hậu tố, hoàn tác, khử đệ quy; ngăn xếp đơn điệu: phần tử lớn hơn/nhỏ hơn gần nhất trái/phải O(n) — mỗi phần tử vào/ra tối đa một lần, ngây thơ O(n²); hình chữ nhật lớn nhất trong biểu đồ cột (nâng cao); deque đơn điệu: min/max cửa sổ trượt độ dài k O(n); bảng khi nào dùng cấu trúc nào.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Nearest Smaller Values (1645), CSES Sliding Window Minimum (nếu tồn tại); VNOJ KAGAIN (hình chữ nhật lớn nhất), VNOJ MINK (min đoạn tịnh tiến), bài dãy ngoặc đúng tiếng Việt; LQDOJ/MarisaOJ bài ngăn xếp, hàng đợi cơ bản; VNOI Wiki về stack/deque.

## Gợi ý minh họa

≥ 2 stepper: (1) kiểm tra '([]{()})' với ngăn xếp .arr; (2) ngăn xếp đơn điệu tìm phần tử lớn hơn gần nhất bên phải, kèm .bars; tùy chọn deque cửa sổ trượt; widget nhập dãy ngoặc → chạy từng bước, báo đúng/sai tại vị trí nào.

## Ghi chú

Liên kết: stl, bfs, recursion, two-pointers.
