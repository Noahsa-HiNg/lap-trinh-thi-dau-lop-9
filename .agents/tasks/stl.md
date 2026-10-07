# 9.1 Thư viện STL

- **slug:** `stl` · **chuyên đề:** CĐ9 · Cấu trúc dữ liệu & xâu
- **file:** `topics/stl.html` (+ tùy chọn `assets/js/viz/stl.js`)
- **giáo án:** (không có trong giáo án — phần mở rộng tự học song song; tự thiết kế)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=stl`.

## Phạm vi nội dung

STL là gì, vì sao dùng; vector (push_back, pop_back, size, resize, 2 chiều, so với mảng tĩnh); pair/tuple (so sánh từ điển), auto, for theo phạm vi; thuật toán: sort, reverse, max_element, accumulate, unique + erase, lower_bound/upper_bound, next_permutation; set/multiset (insert/erase/find/count/lower_bound O(log n), xóa một phần tử trong multiset) — ý tưởng cây cân bằng mức trực quan; map (đếm tần suất) và unordered_map (trung bình O(1), không thứ tự, có thể bị hack chậm); priority_queue (max, min với greater, ý tưởng heap); stack/queue/deque tóm tắt (chi tiết ở stack-queue); iterator cơ bản; BẢNG độ phức tạp; chọn cấu trúc theo câu hỏi của đề; lỗi: [] của map tạo phần tử, xóa khi đang duyệt, multiset::erase(value) xóa hết, size() − 1 với unsigned.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Distinct Numbers (1621), Concert Tickets (1091), Sum of Two Values (1640), Room Allocation (1164, nâng cao), Traffic Lights (1163, nâng cao); bài đếm tần suất bằng map, phần tử xuất hiện nhiều nhất, k số lớn nhất tiếng Việt trên VNOJ/LQDOJ/MarisaOJ.

## Gợi ý minh họa

stepper ≥ 5 khung chèn lần lượt vào set (dãy luôn sắp xếp) hoặc priority_queue dạng cây heap SVG khi push/pop; SVG cây nhị phân tìm kiếm minh họa set; bảng độ phức tạp; widget sân chơi container (lệnh insert/erase/top cho set, map, priority_queue).

## Ghi chú

Liên kết: sorting, binary-search, stack-queue, strings, dijkstra. Trong HTML nhớ thoát vector&lt;int&gt;.
