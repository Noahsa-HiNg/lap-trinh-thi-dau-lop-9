# 1.2 Khung bài thi C++

- **slug:** `cpp-contest-basics` · **chuyên đề:** CĐ1 · Độ phức tạp & kỹ thuật cơ bản
- **file:** `topics/cpp-contest-basics.html` (+ tùy chọn `assets/js/viz/cpp-contest-basics.js`)
- **giáo án:** Chuyên đề 1 và mục "Chiến thuật phòng thi"
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=cpp-contest-basics`.

## Phạm vi nội dung

khung bài thi chuẩn (#include <bits/stdc++.h>, using ll = long long, main); kiểu dữ liệu và giới hạn (int, long long, unsigned long long, double, long double, char, bool); tràn số (quay vòng bù 2, vì sao im lặng, 1LL*a*b, ước lượng đáp án lớn nhất trước khi chọn kiểu); chia nguyên/chia dư với số âm, làm tròn lên (a+b-1)/b; số thực: sai số, so sánh eps, setprecision/fixed; nhập xuất nhanh (sync_with_stdio, cin.tie, '\n' thay endl, vì sao nhanh); freopen file .INP/.OUT (chấm Themis); đọc đến hết dữ liệu; getline và lỗi trộn cin với getline; mảng toàn cục vs cục bộ (stack, tự khởi tạo 0); memset/fill; danh sách kiểm tra trước khi nộp; giới thiệu đối chiếu chéo (stress test).

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

CSES Weird Algorithm (1068); Codeforces 4A Watermelon, 1A Theatre Square (tràn số, làm tròn lên); bài nhập xuất/tràn số tiếng Việt trên LQDOJ, MarisaOJ, VNOJ.

## Gợi ý minh họa

SVG 'đồng hồ' int 32 bit quay vòng 2147483647 → −2147483648; stepper phép nhân 100000×100000 trong int vs long long; widget 'máy kiểm tra tràn số' (BigInt + Math.imul/BigInt.asIntN): nhập a, b, phép tính → kết quả đúng, kết quả nếu lưu int, có tràn không.

## Ghi chú

Liên kết: complexity, brute-force-formula, stl.
