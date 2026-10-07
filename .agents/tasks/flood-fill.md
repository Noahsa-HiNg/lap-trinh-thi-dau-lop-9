# 8.3 Loang trên lưới & BFS đa nguồn

- **slug:** `flood-fill` · **chuyên đề:** CĐ8 · Đồ thị nhập môn
- **file:** `topics/flood-fill.html` (+ tùy chọn `assets/js/viz/flood-fill.js`)
- **giáo án:** Chuyên đề 8 (Buổi 2 — code BFS lưới, hoạt động trên lớp, ý 4–5)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=flood-fill`.

## Phạm vi nội dung

lưới là đồ thị (ô = đỉnh, ô kề = cạnh) không cần dựng danh sách kề; dx/dy 4 và 8 hướng; kiểm tra biên, ô cấm; loang DFS và BFS (đánh dấu khi đẩy); đếm vùng (số đảo), diện tích từng vùng, vùng lớn nhất; mê cung: BFS + truy vết in đường (L/R/U/D như Labyrinth); BFS đa nguồn (lửa lan, nước tràn, khoảng cách tới ô gần nhất) và vì sao đúng; Monsters (BFS quái vật rồi BFS người); loang từ biên tìm vùng bị bao; tràn stack khi DFS đệ quy lưới 1000×1000 → BFS; đánh số ô i·m + j; O(R·C).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Counting Rooms (1192), Labyrinth (1193), Monsters (1194); Codeforces 377A Maze; bài đếm số đảo / số vùng / mê cung / lửa lan tiếng Việt trên VNOJ/LQDOJ/MarisaOJ.

## Gợi ý minh họa

≥ 2 stepper trên .grid-viz: (1) BFS mê cung ghi số bước vào từng ô theo lớp (như hoạt động bút chì trong giáo án); (2) BFS đa nguồn lửa lan từ 2–3 ô; widget bấm ô vẽ tường, đặt xuất phát/đích, BFS có hoạt hình và tô đường đi.

## Ghi chú

Liên kết: graph-dfs, bfs, dp-grid, stack-queue.
