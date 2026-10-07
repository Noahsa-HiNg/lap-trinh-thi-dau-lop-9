# 10.3 DSU & cây khung nhỏ nhất

- **slug:** `dsu-mst` · **chuyên đề:** CĐ10 · Nâng cao hướng chuyên Tin
- **file:** `topics/dsu-mst.html` (+ tùy chọn `assets/js/viz/dsu-mst.js`)
- **giáo án:** (không có trong giáo án — phần nâng cao; tự thiết kế)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=dsu-mst`.

## Phạm vi nội dung

'hai người có cùng nhóm không?' với gộp nhóm xen kẽ truy vấn; ngây thơ (gán nhãn lại O(n) / DFS lại); DSU: mỗi nhóm một cây, gốc là đại diện, parent[]; find lên gốc; union nối gốc; nén đường + hợp theo kích thước/hạng (vì sao cây thấp); gần như O(1) mỗi thao tác (nhắc α(n)); cài đệ quy và lặp; ứng dụng: đếm thành phần khi thêm cạnh dần, phát hiện chu trình, nhóm lớn nhất; cây khung, cây khung nhỏ nhất (nối điện/đường giữa các làng); Kruskal: sắp cạnh tăng, lấy cạnh nếu không tạo chu trình (DSU); vì sao đúng (lát cắt/hoán đổi cạnh, liên hệ tham lam); O(m log m); nhắc Prim; đồ thị không liên thông → IMPOSSIBLE.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Road Reparation (1675), Road Construction (1676); VNOJ QBMST https://oj.vnoi.info/problem/qbmst, VNOJ IOIBIN https://oj.vnoi.info/problem/ioibin; bài DSU/Kruskal tiếng Việt khác trên VNOJ/LQDOJ/MarisaOJ; một bài Codeforces DSU đơn giản.

## Gợi ý minh họa

≥ 2 stepper: (1) SVG rừng DSU qua các lệnh union/find kèm .arr parent (ô đổi is-active), khung nén đường; (2) Kruskal trên SVG đồ thị 6–7 đỉnh có trọng số (cạnh chọn is-ok, bỏ vì chu trình is-bad) + bảng cạnh đã sắp; widget nhập union a b / find a, xem rừng và parent thay đổi.

## Ghi chú

Liên kết: graph-dfs, sorting, greedy, dijkstra. Người đọc: học sinh lớp 9 giỏi chuẩn bị thi chuyên.
