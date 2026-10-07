/*
 * data/roadmap.js — nguồn dữ liệu duy nhất của lộ trình.
 * TÀI NGUYÊN DÙNG CHUNG: phải giữ khóa (lock) "data/roadmap.js" trước khi sửa.
 * Nội dung bên trong dấu "=" phải là JSON hợp lệ (scripts/validate.py đọc bằng json.loads).
 * level: 1 = Cơ bản, 2 = Vận dụng, 3 = Nâng cao. color: số tuyến màu (--l1 … --l10).
 */
window.ROADMAP = {
  "title": "Lộ trình Lập trình Thi đấu lớp 9",
  "version": "1.0.0",
  "language": "C++",
  "stages": [
    {
      "id": "cd1",
      "code": "CĐ1",
      "name": "Độ phức tạp & kỹ thuật cơ bản",
      "weeks": "Tuần 1",
      "color": 1,
      "goal": "Nhìn giới hạn n để đoán thuật toán trước khi viết dòng code nào; chọn đúng kiểu dữ liệu, tránh tràn số.",
      "topics": [
        {
          "slug": "complexity",
          "title": "Độ phức tạp thuật toán",
          "short": "Big-O, quy tắc 10⁸ phép tính mỗi giây và bảng tra giới hạn n → thuật toán.",
          "level": 1,
          "hours": 3,
          "prereq": [],
          "tags": ["big-o", "độ phức tạp", "giới hạn", "thời gian chạy"]
        },
        {
          "slug": "cpp-contest-basics",
          "title": "Khung bài thi C++",
          "short": "Kiểu dữ liệu, tràn số, nhập xuất nhanh, freopen và thói quen kiểm tra trước khi nộp.",
          "level": 1,
          "hours": 2,
          "prereq": [],
          "tags": ["c++", "long long", "tràn số", "freopen", "nhập xuất nhanh"]
        },
        {
          "slug": "brute-force-formula",
          "title": "Duyệt trâu, mô phỏng & công thức",
          "short": "Viết lời giải trâu đúng trước, rồi dùng toán để tăng tốc: tổng 1..n, số 0 tận cùng của n!, xoắn ốc số.",
          "level": 1,
          "hours": 3,
          "prereq": ["complexity"],
          "tags": ["duyệt", "mô phỏng", "công thức", "subtask"]
        }
      ]
    },
    {
      "id": "cd2",
      "code": "CĐ2",
      "name": "Số học",
      "weeks": "Tuần 2–4",
      "color": 2,
      "goal": "Kiểm tra nguyên tố, đếm ước trong O(√n); sàng tới 10⁷; tính ƯCLN/BCNN; làm việc với số dư và lũy thừa lớn.",
      "topics": [
        {
          "slug": "divisors-primes",
          "title": "Ước số & số nguyên tố",
          "short": "Duyệt ước đến √n, kiểm tra nguyên tố, phân tích thừa số và công thức đếm ước.",
          "level": 1,
          "hours": 3,
          "prereq": ["complexity"],
          "tags": ["ước", "nguyên tố", "phân tích thừa số", "căn n"]
        },
        {
          "slug": "sieve",
          "title": "Sàng Eratosthenes",
          "short": "Sàng nguyên tố O(n log log n), sàng ước nguyên tố nhỏ nhất, sàng trên đoạn [L, R].",
          "level": 2,
          "hours": 3,
          "prereq": ["divisors-primes"],
          "tags": ["sàng", "eratosthenes", "nguyên tố", "spf"]
        },
        {
          "slug": "gcd-lcm",
          "title": "ƯCLN, BCNN & thuật toán Euclid",
          "short": "Euclid O(log), rút gọn phân số, BCNN không tràn số và Euclid mở rộng.",
          "level": 1,
          "hours": 2,
          "prereq": ["divisors-primes"],
          "tags": ["gcd", "lcm", "euclid", "ưcln", "bcnn"]
        },
        {
          "slug": "modular-power",
          "title": "Đồng dư & lũy thừa nhanh",
          "short": "Phép toán modulo, lũy thừa nhị phân O(log n) và nghịch đảo modulo qua định lý Fermat nhỏ.",
          "level": 2,
          "hours": 3,
          "prereq": ["gcd-lcm"],
          "tags": ["modulo", "đồng dư", "lũy thừa nhanh", "fermat"]
        }
      ]
    },
    {
      "id": "cd3",
      "code": "CĐ3",
      "name": "Tổ hợp & đếm",
      "weeks": "Tuần 5",
      "color": 3,
      "goal": "Nhận ra dạng bài đếm để dùng công thức thay vì duyệt trâu; tính C(n, k) theo modulo.",
      "topics": [
        {
          "slug": "counting",
          "title": "Quy tắc đếm & nguyên lý bù trừ",
          "short": "Quy tắc cộng, quy tắc nhân, hoán vị, chỉnh hợp, tổ hợp, đếm phần bù và bù trừ.",
          "level": 1,
          "hours": 3,
          "prereq": [],
          "tags": ["tổ hợp", "hoán vị", "chỉnh hợp", "bù trừ", "đếm"]
        },
        {
          "slug": "binomial",
          "title": "Tính C(n, k) & tam giác Pascal",
          "short": "Pascal O(n²), giai thừa kèm nghịch đảo modulo O(n), chia kẹo Euler, đếm đường đi trên lưới.",
          "level": 2,
          "hours": 3,
          "prereq": ["counting", "modular-power"],
          "tags": ["pascal", "nck", "tổ hợp", "nghịch đảo modulo"]
        }
      ]
    },
    {
      "id": "cd4",
      "code": "CĐ4",
      "name": "Cộng dồn, sắp xếp, hai con trỏ",
      "weeks": "Tuần 6–7",
      "color": 4,
      "goal": "Biến lời giải O(n²) thành O(n) hoặc O(n log n) bằng cộng dồn, mảng hiệu, sắp xếp và hai con trỏ.",
      "topics": [
        {
          "slug": "prefix-sum",
          "title": "Mảng cộng dồn",
          "short": "Tổng đoạn trong O(1), cộng dồn 2 chiều, đếm đoạn con có tổng k bằng map.",
          "level": 1,
          "hours": 3,
          "prereq": ["complexity"],
          "tags": ["prefix sum", "cộng dồn", "tổng đoạn", "2d"]
        },
        {
          "slug": "difference-array",
          "title": "Mảng hiệu",
          "short": "Cộng x vào cả đoạn trong O(1), mảng hiệu 2 chiều, đếm số đoạn phủ mỗi điểm.",
          "level": 2,
          "hours": 2,
          "prereq": ["prefix-sum"],
          "tags": ["difference array", "mảng hiệu", "cập nhật đoạn"]
        },
        {
          "slug": "sorting",
          "title": "Sắp xếp & so sánh tùy biến",
          "short": "Sắp xếp chọn, chèn, trộn, đếm; std::sort với hàm so sánh và sắp xếp theo nhiều khóa.",
          "level": 1,
          "hours": 3,
          "prereq": ["complexity"],
          "tags": ["sort", "sắp xếp", "merge sort", "counting sort", "comparator"]
        },
        {
          "slug": "two-pointers",
          "title": "Hai con trỏ & cửa sổ trượt",
          "short": "Tìm cặp có tổng cho trước, trộn hai dãy, đoạn con dài nhất hoặc ngắn nhất thỏa điều kiện trong O(n).",
          "level": 2,
          "hours": 3,
          "prereq": ["sorting", "prefix-sum"],
          "tags": ["two pointers", "hai con trỏ", "sliding window", "cửa sổ trượt"]
        }
      ]
    },
    {
      "id": "cd5",
      "code": "CĐ5",
      "name": "Tìm kiếm nhị phân",
      "weeks": "Tuần 9",
      "color": 5,
      "goal": "Cài chặt nhị phân không lặp vô hạn; dùng lower_bound, upper_bound; chặt nhị phân trên kết quả.",
      "topics": [
        {
          "slug": "binary-search",
          "title": "Tìm kiếm nhị phân trên mảng",
          "short": "Chia đôi vùng tìm kiếm, lower_bound và upper_bound, đếm phần tử trong đoạn giá trị.",
          "level": 1,
          "hours": 2,
          "prereq": ["sorting"],
          "tags": ["binary search", "nhị phân", "lower_bound", "upper_bound"]
        },
        {
          "slug": "binary-search-answer",
          "title": "Chặt nhị phân trên kết quả",
          "short": "Tính đơn điệu, hàm check, dạng “lớn nhất nhỏ nhất / nhỏ nhất lớn nhất”, chặt trên số thực.",
          "level": 2,
          "hours": 3,
          "prereq": ["binary-search"],
          "tags": ["chặt nhị phân", "đơn điệu", "check", "tối ưu"]
        }
      ]
    },
    {
      "id": "cd6",
      "code": "CĐ6",
      "name": "Đệ quy, quay lui, tham lam",
      "weeks": "Tuần 10–11",
      "color": 6,
      "goal": "Dùng quay lui để lấy chắc điểm subtask nhỏ; dùng tham lam kèm chứng minh hoặc phản ví dụ.",
      "topics": [
        {
          "slug": "recursion",
          "title": "Đệ quy & chia để trị",
          "short": "Điều kiện dừng, cây đệ quy, tháp Hà Nội, chia để trị và ngăn xếp lời gọi.",
          "level": 1,
          "hours": 3,
          "prereq": ["cpp-contest-basics"],
          "tags": ["đệ quy", "recursion", "chia để trị", "tháp hà nội"]
        },
        {
          "slug": "backtracking",
          "title": "Quay lui & nhánh cận",
          "short": "Sinh dãy nhị phân, hoán vị, tổ hợp; bài 8 quân hậu; cắt nhánh khi biết chắc không tốt hơn.",
          "level": 2,
          "hours": 3,
          "prereq": ["recursion"],
          "tags": ["quay lui", "backtracking", "nhánh cận", "sinh hoán vị"]
        },
        {
          "slug": "greedy",
          "title": "Tham lam",
          "short": "Chọn hoạt động, đổi tiền, lập luận hoán đổi và cách tìm phản ví dụ.",
          "level": 2,
          "hours": 3,
          "prereq": ["sorting"],
          "tags": ["tham lam", "greedy", "hoán đổi", "phản ví dụ"]
        }
      ]
    },
    {
      "id": "cd7",
      "code": "CĐ7",
      "name": "Quy hoạch động",
      "weeks": "Tuần 12–13",
      "color": 7,
      "goal": "Xây dựng QHĐ theo 4 bước: trạng thái, công thức chuyển, cơ sở, đáp án; giải các bài kinh điển.",
      "topics": [
        {
          "slug": "dp-intro",
          "title": "Nhập môn quy hoạch động",
          "short": "Từ đệ quy có nhớ đến bảng phương án; quy trình 4 bước; bài leo cầu thang.",
          "level": 2,
          "hours": 3,
          "prereq": ["recursion"],
          "tags": ["quy hoạch động", "dp", "memoization", "fibonacci"]
        },
        {
          "slug": "dp-grid",
          "title": "QHĐ trên lưới",
          "short": "Đếm đường đi có ô cấm, tổng lớn nhất trên lưới và truy vết đường đi.",
          "level": 2,
          "hours": 2,
          "prereq": ["dp-intro"],
          "tags": ["quy hoạch động", "lưới", "đường đi", "truy vết"]
        },
        {
          "slug": "lis",
          "title": "Dãy con tăng dài nhất",
          "short": "QHĐ O(n²), cải tiến O(n log n) bằng chặt nhị phân và truy vết dãy con.",
          "level": 2,
          "hours": 3,
          "prereq": ["dp-intro", "binary-search"],
          "tags": ["lis", "dãy con tăng", "quy hoạch động"]
        },
        {
          "slug": "knapsack",
          "title": "Cái túi & đổi tiền",
          "short": "Cái túi 0/1, cái túi không giới hạn, đổi tiền ít tờ nhất và đếm số cách đổi.",
          "level": 2,
          "hours": 3,
          "prereq": ["dp-intro"],
          "tags": ["knapsack", "cái túi", "đổi tiền", "quy hoạch động"]
        }
      ]
    },
    {
      "id": "cd8",
      "code": "CĐ8",
      "name": "Đồ thị nhập môn",
      "weeks": "Tuần 14–15",
      "color": 8,
      "goal": "Biểu diễn đồ thị bằng danh sách kề; cài DFS, BFS; đếm thành phần liên thông; tìm đường đi ngắn nhất không trọng số.",
      "topics": [
        {
          "slug": "graph-dfs",
          "title": "Đồ thị & DFS",
          "short": "Mô hình hóa bài toán, ma trận kề, danh sách kề, DFS, thành phần liên thông, tô hai màu.",
          "level": 2,
          "hours": 3,
          "prereq": ["recursion"],
          "tags": ["đồ thị", "dfs", "danh sách kề", "liên thông"]
        },
        {
          "slug": "bfs",
          "title": "BFS & đường đi ngắn nhất",
          "short": "Duyệt theo từng lớp, khoảng cách ngắn nhất trên đồ thị không trọng số, truy vết đường đi.",
          "level": 2,
          "hours": 3,
          "prereq": ["graph-dfs"],
          "tags": ["bfs", "hàng đợi", "đường đi ngắn nhất", "truy vết"]
        },
        {
          "slug": "flood-fill",
          "title": "Loang trên lưới & BFS đa nguồn",
          "short": "Đếm vùng, mê cung, lửa lan, quái vật đuổi: biến bảng lưới thành đồ thị.",
          "level": 2,
          "hours": 3,
          "prereq": ["bfs"],
          "tags": ["loang", "flood fill", "lưới", "đa nguồn"]
        }
      ]
    },
    {
      "id": "cd9",
      "code": "CĐ9",
      "name": "Cấu trúc dữ liệu & xâu",
      "weeks": "Tự học song song",
      "color": 9,
      "goal": "Dùng thành thạo STL, ngăn xếp, hàng đợi; xử lý xâu và số lớn, hai dạng bài rất hay gặp trong đề THCS.",
      "topics": [
        {
          "slug": "stl",
          "title": "Thư viện STL",
          "short": "vector, pair, set, map, priority_queue và độ phức tạp của từng thao tác.",
          "level": 1,
          "hours": 3,
          "prereq": ["cpp-contest-basics"],
          "tags": ["stl", "vector", "set", "map", "priority_queue"]
        },
        {
          "slug": "stack-queue",
          "title": "Ngăn xếp, hàng đợi & ngăn xếp đơn điệu",
          "short": "Dãy ngoặc đúng, phần tử lớn hơn gần nhất, giá trị nhỏ nhất trên cửa sổ trượt.",
          "level": 2,
          "hours": 3,
          "prereq": ["stl"],
          "tags": ["stack", "queue", "deque", "đơn điệu", "ngoặc"]
        },
        {
          "slug": "strings",
          "title": "Xử lý xâu ký tự",
          "short": "Duyệt ký tự, đếm tần suất, xâu đối xứng, tách từ, chuẩn hóa xâu.",
          "level": 1,
          "hours": 3,
          "prereq": ["cpp-contest-basics"],
          "tags": ["xâu", "string", "palindrome", "chuẩn hóa"]
        },
        {
          "slug": "big-numbers",
          "title": "Số lớn",
          "short": "Cộng, trừ, nhân hai số lớn bằng xâu; nhân và chia số lớn cho số nhỏ.",
          "level": 2,
          "hours": 3,
          "prereq": ["strings"],
          "tags": ["số lớn", "bignum", "xâu", "phép tính"]
        }
      ]
    },
    {
      "id": "cd10",
      "code": "CĐ10",
      "name": "Nâng cao hướng chuyên Tin",
      "weeks": "Sau khóa 16 tuần",
      "color": 10,
      "goal": "Chuẩn bị cho kỳ thi vào lớp 10 chuyên Tin: QHĐ trên xâu, đồ thị có trọng số, DSU và cây khung.",
      "topics": [
        {
          "slug": "lcs",
          "title": "QHĐ trên xâu: LCS & khoảng cách sửa",
          "short": "Dãy con chung dài nhất, khoảng cách sửa xâu (edit distance), xâu con đối xứng dài nhất.",
          "level": 3,
          "hours": 3,
          "prereq": ["dp-grid", "strings"],
          "tags": ["lcs", "edit distance", "quy hoạch động", "xâu"]
        },
        {
          "slug": "dijkstra",
          "title": "Đường đi ngắn nhất có trọng số",
          "short": "Dijkstra với priority_queue, Floyd–Warshall và cách chọn thuật toán theo giới hạn.",
          "level": 3,
          "hours": 4,
          "prereq": ["bfs", "stl"],
          "tags": ["dijkstra", "floyd", "đường đi ngắn nhất", "trọng số"]
        },
        {
          "slug": "dsu-mst",
          "title": "DSU & cây khung nhỏ nhất",
          "short": "Disjoint Set Union với nén đường và hợp theo kích thước; thuật toán Kruskal.",
          "level": 3,
          "hours": 3,
          "prereq": ["graph-dfs", "sorting"],
          "tags": ["dsu", "union find", "kruskal", "cây khung"]
        }
      ]
    }
  ]
};
