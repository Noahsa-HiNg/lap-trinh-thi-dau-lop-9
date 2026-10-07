# 8.2 BFS & đường đi ngắn nhất

- **slug:** `bfs` · **chuyên đề:** CĐ8 · Đồ thị nhập môn
- **file:** `topics/bfs.html` (+ tùy chọn `assets/js/viz/bfs.js`)
- **giáo án:** Chuyên đề 8 (Buổi 2, ý 3 và 5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=bfs`.

## Phạm vi nội dung

hàng đợi FIFO; duyệt theo lớp; dist = −1, đánh dấu khi ĐẨY vào hàng đợi và vì sao; chứng minh BFS cho đường ngắn nhất khi cạnh bằng nhau; truy vết par[v]; O(n + m); BFS trên không gian trạng thái (Two Buttons x → 2x / x − 1; quân mã; đổ nước hai bình); BFS trên lưới chỉ giới thiệu (flood-fill là bài riêng); vì sao sai khi cạnh có trọng số (liên kết dijkstra); nâng cao: 0-1 BFS bằng deque, đếm số đường đi ngắn nhất; so sánh DFS và BFS.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Message Route (1667), Labyrinth (1193); Codeforces 520B Two Buttons; bài quân mã ít bước nhất, biến đổi số, đường đi ngắn nhất không trọng số tiếng Việt trên VNOJ/LQDOJ/MarisaOJ; VNOI Wiki BFS https://wiki.vnoi.info/algo/graph-theory/breadth-first-search.

## Gợi ý minh họa

stepper ≥ 6 khung trên SVG đồ thị 8 đỉnh (đỉnh đang lấy ra is-active, đã thăm is-ok, dist ghi bằng .label-sm) kèm .arr hàng đợi và dist; SVG các lớp khoảng cách đồng tâm; widget nhập cạnh, chọn nguồn, BFS từng bước với hàng đợi hiện trực tiếp.

## Ghi chú

Liên kết: graph-dfs, flood-fill, dijkstra, stack-queue, stl.
