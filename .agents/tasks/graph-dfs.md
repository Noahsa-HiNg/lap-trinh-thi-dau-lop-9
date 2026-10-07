# 8.1 Đồ thị & DFS

- **slug:** `graph-dfs` · **chuyên đề:** CĐ8 · Đồ thị nhập môn
- **file:** `topics/graph-dfs.html` (+ tùy chọn `assets/js/viz/graph-dfs.js`)
- **giáo án:** Chuyên đề 8 (Buổi 1, ý 1–2 và 5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=graph-dfs`.

## Phạm vi nội dung

đồ thị (đỉnh, cạnh, vô/có hướng, trọng số, bậc, đường đi, chu trình, liên thông) qua bản đồ thành phố, mạng bạn bè; mô hình hóa 'đỉnh là gì? cạnh là gì?'; ma trận kề, danh sách kề, danh sách cạnh — bảng so sánh; DFS đệ quy (visited), vì sao thăm hết thành phần, O(n + m); DFS bằng ngăn xếp tự quản; đếm thành phần liên thông; kiểm tra u, v thông nhau; tô hai màu; phát hiện chu trình vô hướng; cây DFS; nâng cao: kích thước thành phần, DFS trên cây (độ sâu, kích thước cây con). BFS và loang lưới là bài riêng (agent khác) — chỉ nhắc và liên kết.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Building Roads (1666), Building Teams (1668), Round Trip (1669, nâng cao); bài đếm thành phần liên thông / đường đi giữa hai đỉnh / tô hai màu tiếng Việt trên VNOJ/LQDOJ/MarisaOJ; Codeforces 580C Kefa and Park.

## Gợi ý minh họa

stepper ≥ 6 khung trên SVG đồ thị 7–8 đỉnh, 2 thành phần (node is-active/is-ok, edge is-active) kèm .arr ngăn xếp và visited; SVG + bảng ma trận kề / danh sách kề cùng đồ thị; widget nhập danh sách cạnh, chọn đỉnh, chạy DFS từng bước.

## Ghi chú

Liên kết: recursion, bfs, flood-fill, dsu-mst, stack-queue.
