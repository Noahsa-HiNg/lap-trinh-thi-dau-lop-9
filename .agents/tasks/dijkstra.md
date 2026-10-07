# 10.2 Đường đi ngắn nhất có trọng số

- **slug:** `dijkstra` · **chuyên đề:** CĐ10 · Nâng cao hướng chuyên Tin
- **file:** `topics/dijkstra.html` (+ tùy chọn `assets/js/viz/dijkstra.js`)
- **giáo án:** Chuyên đề 8 (BFS cho đường đi ngắn nhất khi cạnh bằng nhau)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=dijkstra`.

## Phạm vi nội dung

đồ thị có trọng số (bản đồ có độ dài đường), vì sao BFS sai (phản ví dụ nhỏ); Dijkstra: dist = ∞, chọn đỉnh chưa chốt có dist nhỏ nhất, chốt, nới lỏng; vì sao đúng khi trọng số không âm (nói đơn giản); bản O(n²) mảng (đồ thị dày) và O((n + m) log n) priority_queue (pair (dist, đỉnh), greater<>, bỏ phần tử lỗi thời if d > dist[u] continue); truy vết par[]; sai khi cạnh âm (phản ví dụ, nhắc Bellman–Ford); Floyd–Warshall O(n³) mọi cặp (n ≤ 400–500), ý nghĩa vòng k ngoài cùng; bảng chọn thuật toán theo giới hạn (BFS / Dijkstra / Floyd); mở rộng: đếm số đường ngắn nhất, Dijkstra nhiều nguồn, đồ thị trạng thái (Flight Discount). Độ dài 4 000–7 000 từ.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Shortest Routes I (1671), Shortest Routes II (1672), Flight Discount (1195, nâng cao); VNOJ QBSCHOOL https://oj.vnoi.info/problem/qbschool; các bài Dijkstra/Floyd tiếng Việt khác trên VNOJ/LQDOJ/MarisaOJ; Codeforces 20C Dijkstra?.

## Gợi ý minh họa

stepper ≥ 6 khung trên SVG đồ thị 6 đỉnh có trọng số (đỉnh vừa chốt is-ok, cạnh đang nới lỏng is-active) kèm bảng dist (td.hl ô thay đổi); bảng ma trận Floyd qua từng k; widget nhập cạnh có trọng số, chọn nguồn, Dijkstra từng bước với dist và hàng đợi ưu tiên.

## Ghi chú

Liên kết: bfs, graph-dfs, stl, greedy, complexity. Người đọc: học sinh lớp 9 giỏi chuẩn bị thi chuyên.
