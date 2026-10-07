# Giáo án Toán & Thuật toán cho học sinh THCS thi Lập trình thi đấu

Oct 7, 2026 · @hieu

## Tổng quan

Khóa học 16 tuần, mỗi tuần 1 buổi 3 tiết (135 phút), đưa học sinh THCS từ mức biết lập trình cơ bản đến giải được bài cấp tỉnh/thành phố môn Tin học. Ngôn ngữ dùng xuyên suốt là C++.

**Đối tượng.** Học sinh lớp 7–9 đã biết biến, câu lệnh rẽ nhánh, vòng lặp, mảng một chiều và hàm trong C++.

**Mục tiêu sau khóa học.**

- Ước lượng được độ phức tạp và chọn thuật toán phù hợp với giới hạn dữ liệu đề bài.
- Nắm chắc các công cụ toán thường gặp: số học, đồng dư, tổ hợp.
- Cài đặt thành thạo các kỹ thuật nền: mảng cộng dồn, hai con trỏ, chặt nhị phân, đệ quy, quay lui, tham lam, quy hoạch động, BFS/DFS.
- Có thói quen thi: đọc kỹ giới hạn, tự sinh test, kiểm tra tràn số, lấy điểm từng subtask.

**Cấu trúc một buổi học (135 phút).**

| Hoạt động | Thời gian | Nội dung |
| --- | --- | --- |
| Khởi động | 10 phút | Chữa nhanh bài về nhà, câu hỏi gợi mở |
| Lý thuyết | 35 phút | Giảng khái niệm, chứng minh trực quan, ví dụ tay |
| Cài đặt mẫu | 25 phút | Giáo viên code trực tiếp, học sinh gõ theo |
| Luyện tập | 50 phút | Học sinh tự giải 3–4 bài từ dễ đến khó |
| Tổng kết | 15 phút | Chữa bài, chốt kiến thức, giao bài về nhà |

**Cách dùng giáo án.** Mỗi chuyên đề gồm mục tiêu, kiến thức trọng tâm, code mẫu, bài tập phân tầng (Cơ bản – Vận dụng – Nâng cao) và lỗi thường gặp. Giáo viên có thể co giãn số buổi tùy trình độ lớp.

## Phân phối chương trình

16 buổi chia thành 8 chuyên đề, xen 2 buổi thi thử để kiểm tra giữa kỳ và cuối kỳ.

| Tuần | Chuyên đề | Nội dung chính |
| --- | --- | --- |
| 1 | CĐ1. Độ phức tạp | Big-O, ước lượng 10^8 phép/giây, kiểu dữ liệu, tràn số, nhập xuất nhanh |
| 2 | CĐ2. Số học (1) | Chia hết, đếm ước, kiểm tra nguyên tố O(√n), phân tích thừa số |
| 3 | CĐ2. Số học (2) | Sàng Eratosthenes, GCD/LCM, Euclid |
| 4 | CĐ2. Số học (3) | Đồng dư, phép toán modulo, lũy thừa nhanh |
| 5 | CĐ3. Tổ hợp | Quy tắc cộng/nhân, hoán vị, chỉnh hợp, tổ hợp, tam giác Pascal |
| 6 | CĐ4. Mảng cộng dồn | Prefix sum 1D/2D, mảng hiệu |
| 7 | CĐ4. Sắp xếp, hai con trỏ | sort, so sánh tùy biến, two pointers, cửa sổ trượt |
| 8 | Thi thử giữa kỳ | 4 bài trong 150 phút, chữa đề |
| 9 | CĐ5. Tìm kiếm nhị phân | Chặt nhị phân trên mảng và trên kết quả |
| 10 | CĐ6. Đệ quy, quay lui | Đệ quy, sinh nhị phân, sinh hoán vị, tổ hợp |
| 11 | CĐ6. Tham lam | Chọn hoạt động, đổi tiền, chứng minh bằng hoán đổi |
| 12 | CĐ7. QHĐ (1) | Fibonacci, leo cầu thang, đếm đường đi trên lưới |
| 13 | CĐ7. QHĐ (2) | Dãy con tăng dài nhất, cái túi 0/1 |
| 14 | CĐ8. Đồ thị (1) | Biểu diễn đồ thị, DFS, đếm thành phần liên thông |
| 15 | CĐ8. Đồ thị (2) | BFS, đường đi ngắn nhất trên lưới, loang |
| 16 | Thi thử cuối kỳ | 5 bài trong 180 phút, tổng kết khóa |

## Chuyên đề 1. Độ phức tạp thuật toán và kỹ thuật cơ bản (tuần 1)

Học sinh phải biết nhìn giới hạn n để đoán thuật toán cần dùng, trước khi viết dòng code nào.

**Mục tiêu.** Hiểu Big-O; dùng quy tắc máy chấm chạy khoảng 10^8 phép tính mỗi giây; chọn đúng kiểu dữ liệu; nhập xuất nhanh.

**Kiến thức trọng tâm.**

1. Big-O đếm số phép tính theo n, bỏ hằng số và bậc thấp. Ví dụ 3n² + 5n + 7 là O(n²).
2. Bảng tra giới hạn (giao cho học sinh chép vào vở):

| Giới hạn n | Độ phức tạp chấp nhận | Thuật toán điển hình |
| --- | --- | --- |
| n ≤ 10 | O(n!) | Sinh hoán vị |
| n ≤ 20 | O(2^n) | Duyệt tập con, quay lui |
| n ≤ 500 | O(n³) | Ba vòng lặp lồng |
| n ≤ 5 000 | O(n²) | Hai vòng lặp, QHĐ hai chiều |
| n ≤ 10^6 | O(n log n) | Sắp xếp, chặt nhị phân |
| n ≤ 10^8 | O(n) | Một vòng lặp, cộng dồn |
| n ≤ 10^18 | O(log n) hoặc O(√n) | Công thức, lũy thừa nhanh, Euclid |

3. Kiểu dữ liệu: `int` chứa tới khoảng 2,1 × 10^9; `long long` tới khoảng 9,2 × 10^18. Tích hai số 10^5 đã vượt `int`.
4. Nhập xuất nhanh: `ios::sync_with_stdio(false); cin.tie(nullptr);` và dùng `'\n'` thay `endl`.

**Code mẫu — khung bài thi chuẩn.**

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // freopen("BAI.INP", "r", stdin);
    // freopen("BAI.OUT", "w", stdout);
    int n; cin >> n;
    ll s = 0;
    for (int i = 1; i <= n; i++) s += i;
    cout << s << '\n';
}
```

**Hoạt động trên lớp.** Cho bài “Tính tổng 1 + 2 + … + n”. Học sinh viết vòng lặp O(n), rồi thử n = 10^12 để thấy chạy quá thời gian. Giáo viên dẫn tới công thức n(n+1)/2 với O(1). Đây là bài học đầu tiên: toán giúp tăng tốc thuật toán.

**Hiểu sâu lý thuyết.** Bốn ý dưới đây quyết định học sinh có chọn đúng hướng ngay khi đọc đề hay không.

1. **Big-O.**
   - Vì sao cần: máy chấm giới hạn thời gian (thường 1 giây), nên điều quan trọng là số phép tính tăng nhanh thế nào khi n tăng, không phải code chạy nhanh trên test nhỏ. Hằng số được bỏ qua vì với n = 10^6, chênh lệch giữa n² và n log n (10^12 so với 2·10^7) lớn hơn mọi hằng số.
   - Ý nghĩa: Big-O là ngôn ngữ chung để so sánh hai lời giải trước khi viết code.
   - Dùng cho: mọi bài có giới hạn dữ liệu, đặc biệt bài chia subtask (n ≤ 1000 chấp nhận O(n²), n ≤ 10^6 cần O(n log n)).
   - Cách dùng: đếm số vòng lặp lồng nhau; vòng lặp chia đôi cho log n; đệ quy hai nhánh mỗi tầng cho 2^n.
2. **Quy tắc khoảng 10^8 phép tính mỗi giây.**
   - Vì sao: máy chấm làm được cỡ 10^8–10^9 phép đơn giản mỗi giây; lấy 10^8 làm mốc an toàn.
   - Cách dùng: thay n lớn nhất vào độ phức tạp. Với n = 10^5, O(n²) là 10^10 phép, chắc chắn quá thời gian; O(n log n) chỉ khoảng 1,7·10^6 phép, rất an toàn.
   - Dùng cho: đoán thuật toán từ giới hạn. “n ≤ 20” gợi ý duyệt tập con; “n ≤ 10^18” gợi ý công thức hoặc O(log n).
3. **Tràn số.**
   - Vì sao xảy ra: `int` có 32 bit, lớn nhất khoảng 2,1·10^9; vượt quá thì giá trị quay vòng thành số âm mà chương trình không báo lỗi.
   - Ý nghĩa: đây là lỗi mất điểm “im lặng” phổ biến nhất ở học sinh THCS.
   - Dùng cho: bài tính tổng, tích, đếm cặp (n = 10^5 cho khoảng 5·10^9 cặp).
   - Cách dùng: ước lượng đáp án lớn nhất trước khi chọn kiểu; viết `1LL * a * b` khi nhân hai số `int`.
4. **Toán giúp giảm độ phức tạp.** Nhiều bài có công thức đóng: tổng 1..n, số chữ số 0 tận cùng của n! (đếm thừa số 5), giá trị trên xoắn ốc số. Thói quen hỏi “có công thức không?” trước khi viết vòng lặp sẽ theo học sinh qua mọi chuyên đề sau.

Đọc thêm (tiếng Việt): [VNOI Wiki – Độ phức tạp thời gian](https://wiki.vnoi.info/algo/basic/computational-complexity).

**Bài tập.**

Các bài sau luyện đọc giới hạn và thay vòng lặp bằng công thức. Đề CSES viết bằng tiếng Anh, giáo viên nên tóm tắt đề bằng tiếng Việt khi giao.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Weird Algorithm](https://cses.fi/problemset/task/1068) | CSES | Mô phỏng; giá trị trung gian vượt `int` nên phải dùng `long long` |
| Cơ bản | [Missing Number](https://cses.fi/problemset/task/1083) | CSES | Dùng tổng n(n+1)/2 để tìm số bị thiếu trong O(n) |
| Cơ bản | [Increasing Array](https://cses.fi/problemset/task/1094) | CSES | Một vòng lặp O(n); đáp án cần `long long` |
| Vận dụng | [Number Spiral](https://cses.fi/problemset/task/1071) | CSES | Tìm công thức O(1) với tọa độ tới 10^9 |
| Nâng cao | [Trailing Zeros](https://cses.fi/problemset/task/1618) | CSES | Đếm thừa số 5 trong n!, chạy O(log n) |

**Lỗi thường gặp.** Quên `long long`; dùng `endl` khi in nhiều dòng; quên đổi tên file theo đề.

## Chuyên đề 2. Số học (tuần 2–4)

Số học chiếm phần lớn bài 1–2 trong đề THCS; ba buổi này là nền móng quan trọng nhất của khóa.

**Mục tiêu.** Kiểm tra nguyên tố, đếm ước trong O(√n); sàng nguyên tố tới 10^7; tính GCD/LCM; làm việc với số dư và lũy thừa lớn.

### Buổi 1 — Ước và số nguyên tố

Ý chính: nếu d là ước của n thì n/d cũng là ước, và một trong hai không vượt √n. Vì vậy chỉ cần duyệt d từ 1 đến √n.

```cpp
bool isPrime(ll n) {
    if (n < 2) return false;
    for (ll d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}

// Phân tích thừa số nguyên tố, ví dụ 360 = 2^3 * 3^2 * 5
vector<pair<ll,int>> factorize(ll n) {
    vector<pair<ll,int>> f;
    for (ll p = 2; p * p <= n; p++)
        if (n % p == 0) {
            int c = 0;
            while (n % p == 0) n /= p, c++;
            f.push_back({p, c});
        }
    if (n > 1) f.push_back({n, 1});
    return f;
}
```

Công thức cần nhớ: nếu n = p1^a1 · p2^a2 · … · pk^ak thì số ước của n là (a1+1)(a2+1)…(ak+1). Ví dụ 360 có 4·3·2 = 24 ước.

### Buổi 2 — Sàng Eratosthenes, GCD và LCM

Sàng đánh dấu bội của từng số nguyên tố, chạy trong O(n log log n). Cho học sinh làm tay với n = 30 trên bảng trước khi code.

```cpp
const int N = 10000000;
vector<bool> isComposite(N + 1);
void sieve() {
    isComposite[0] = isComposite[1] = true;
    for (int i = 2; (ll)i * i <= N; i++)
        if (!isComposite[i])
            for (int j = i * i; j <= N; j += i) isComposite[j] = true;
}
```

Thuật toán Euclid dựa trên gcd(a, b) = gcd(b, a mod b). Dùng `__gcd(a, b)` hoặc `gcd(a, b)` (C++17). LCM tính bằng a / gcd(a, b) \* b — chia trước để tránh tràn số.

### Buổi 3 — Đồng dư và lũy thừa nhanh

Quy tắc modulo: (a + b) mod m, (a − b + m) mod m, (a · b) mod m đều lấy mod từng bước được. Phép chia thì không.

Lũy thừa nhanh dùng ý tưởng a^n = (a^(n/2))², đưa O(n) xuống O(log n).

```cpp
ll power(ll a, ll n, ll m) {
    ll r = 1; a %= m;
    while (n > 0) {
        if (n & 1) r = r * a % m;
        a = a * a % m;
        n >>= 1;
    }
    return r;
}
```

**Hiểu sâu lý thuyết.**

1. **Duyệt ước đến √n.**
   - Vì sao đúng: nếu d · e = n và cả d, e đều lớn hơn √n thì d · e > n, vô lý. Vậy mỗi cặp ước luôn có một số không vượt √n.
   - Ý nghĩa: giảm từ O(n) xuống O(√n); với n = 10^12 là từ 10^12 xuống 10^6 phép tính.
   - Dùng cho: kiểm tra nguyên tố một số, liệt kê hoặc đếm ước, phân tích thừa số.
   - Cách dùng: viết điều kiện `d * d <= n` thay cho `d <= sqrt(n)` để tránh sai số số thực.
2. **Công thức số ước (a1+1)(a2+1)…(ak+1).**
   - Vì sao: mỗi ước chọn số mũ của p1 từ 0 đến a1 (có a1+1 cách), tương tự với các thừa số khác; theo quy tắc nhân ta được tích trên.
   - Ý nghĩa: đây là cầu nối đầu tiên giữa số học và tổ hợp (chuyên đề 3).
   - Dùng cho: bài đếm ước, tìm số có nhiều ước nhất, số chính phương (mọi số mũ chẵn).
3. **Sàng Eratosthenes.**
   - Vì sao đúng: mọi hợp số đều có ước nguyên tố nhỏ hơn nó, nên sẽ bị gạch khi xét ước đó. Bắt đầu gạch từ i·i vì các bội nhỏ hơn đã bị gạch bởi ước nhỏ hơn.
   - Ý nghĩa: trả lời “x có nguyên tố không?” trong O(1) cho mọi x ≤ N sau một lần sàng O(N log log N).
   - Dùng cho: nhiều truy vấn nguyên tố, đếm số nguyên tố trong đoạn (kết hợp cộng dồn), bài “siêu nguyên tố”.
   - Dấu hiệu: đề có nhiều số cần kiểm tra và giá trị lớn nhất ≤ 10^7.
4. **Thuật toán Euclid.**
   - Vì sao đúng: mọi ước chung của a và b cũng chia hết a − b, và lặp lại phép trừ chính là phép chia lấy dư. Số chữ số giảm rất nhanh nên chạy O(log).
   - Dùng cho: rút gọn phân số, LCM, bài chia đều (chia n đồ vật thành nhiều nhóm bằng nhau), chu kỳ gặp lại nhau.
5. **Đồng dư và lũy thừa nhanh.**
   - Vì sao lấy mod từng bước được: (a + b) mod m chỉ phụ thuộc vào a mod m và b mod m; phép nhân cũng vậy. Phép chia thì không, nên cần nghịch đảo modulo.
   - Ý nghĩa: đề yêu cầu “in đáp án mod 10^9+7” để đáp án không vượt `long long`.
   - Lũy thừa nhanh: viết số mũ dưới dạng nhị phân, chỉ cần khoảng 60 phép nhân cho mũ 10^18.
   - Dùng cho: chữ số tận cùng, đếm số cách rất lớn, tính C(n, k) mod p ở chuyên đề 3.

Đọc thêm (tiếng Việt): [VNOI Wiki – Sàng nguyên tố](https://wiki.vnoi.info/algo/algebra/prime_sieve), [VNOI Wiki – Nghịch đảo modulo](https://wiki.vnoi.info/algo/math/modular-inverse).

**Bài tập.**

Ba bài đầu có đề tiếng Việt, nên dùng làm bài trên lớp; các bài CSES dùng làm bài về nhà.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Kiểm tra số nguyên tố](https://ltoj.edu.vn/problem/for4) | LTOJ (tiếng Việt) | Duyệt ước đến √N với N ≤ 10^9 |
| Cơ bản | [PNUMBER – Tìm số nguyên tố](https://oj.vnoi.info/problem/pnumber) | VNOJ (tiếng Việt) | Liệt kê số nguyên tố trong \[A, B\], B ≤ 200 000, bằng sàng |
| Vận dụng | [Free Contest 75 – FPRIME](https://oj.vnoi.info/problem/fc075_fprime) | VNOJ (tiếng Việt) | Nhiều truy vấn nguyên tố: kiểm tra từng số sẽ quá thời gian, phải sàng |
| Vận dụng | [Counting Divisors](https://cses.fi/problemset/task/1713) | CSES | Đếm ước cho nhiều số, dùng công thức số ước hoặc sàng ước |
| Vận dụng | [Exponentiation](https://cses.fi/problemset/task/1095) | CSES | Lũy thừa nhanh a^b mod 10^9+7 |
| Nâng cao | [Common Divisors](https://cses.fi/problemset/task/1081) | CSES | GCD lớn nhất của một cặp; đếm bội cho từng ước thay vì xét từng cặp |
| Nâng cao | [Exponentiation II](https://cses.fi/problemset/task/1712) | CSES | Tính a^(b^c) mod p bằng định lý Fermat nhỏ |

**Lỗi thường gặp.** Viết `i * i <= n` với `i` kiểu `int` gây tràn; quên trường hợp n = 1; trừ modulo ra số âm.

## Chuyên đề 3. Tổ hợp và đếm (tuần 5)

Nhiều bài “đếm số cách” có đáp án bằng một công thức, nên học sinh cần nhận ra dạng bài thay vì duyệt trâu.

**Mục tiêu.** Vận dụng quy tắc cộng, quy tắc nhân; phân biệt hoán vị, chỉnh hợp, tổ hợp; tính C(n, k) bằng tam giác Pascal.

**Kiến thức trọng tâm.**

1. Quy tắc cộng: các trường hợp rời nhau thì cộng số cách. Quy tắc nhân: các bước nối tiếp thì nhân số cách.
2. Hoán vị n phần tử: n!. Chỉnh hợp chập k (có thứ tự): n!/(n−k)!. Tổ hợp chập k (không thứ tự): C(n, k) = n!/(k!(n−k)!).
3. Tam giác Pascal: C(n, k) = C(n−1, k−1) + C(n−1, k). Cách này chỉ dùng phép cộng nên lấy modulo dễ dàng.
4. Nguyên lý bù trừ hai tập: |A ∪ B| = |A| + |B| − |A ∩ B|.

```cpp
const int MOD = 1e9 + 7;
ll C[1005][1005];
void buildPascal(int n) {
    for (int i = 0; i <= n; i++) {
        C[i][0] = 1;
        for (int k = 1; k <= i; k++)
            C[i][k] = (C[i-1][k-1] + C[i-1][k]) % MOD;
    }
}
```

**Hoạt động trên lớp.** Đặt câu hỏi: “Lớp 30 bạn, chọn 1 lớp trưởng và 1 lớp phó có bao nhiêu cách? Chọn 2 bạn trực nhật có bao nhiêu cách?” Học sinh thảo luận vì sao đáp án là 870 và 435.

**Hiểu sâu lý thuyết.**

1. **Quy tắc cộng và quy tắc nhân.**
   - Vì sao: nếu các trường hợp không trùng nhau thì đếm riêng rồi cộng; nếu một cách làm gồm nhiều bước nối tiếp, mỗi lựa chọn ở bước trước kết hợp được với mọi lựa chọn ở bước sau nên nhân.
   - Ý nghĩa: hai quy tắc này là nền của mọi công thức đếm và của quy hoạch động đếm số cách (chuyên đề 7).
   - Cách dùng: hỏi học sinh “ta đang chia trường hợp (cộng) hay đang làm từng bước (nhân)?”.
2. **Có thứ tự hay không có thứ tự.**
   - Chỉnh hợp đếm cách xếp có thứ tự (lớp trưởng khác lớp phó); tổ hợp đếm cách chọn không thứ tự (hai bạn trực nhật như nhau).
   - Vì sao C(n, k) = n!/(k!(n−k)!): đếm các cách chọn có thứ tự rồi chia cho k! cách xếp lại cùng một nhóm.
   - Dùng cho: chọn nhóm, đếm đường đi trên lưới (chọn vị trí các bước “sang phải” trong m + n bước), đếm tam giác, đếm bắt tay.
3. **Tam giác Pascal.**
   - Vì sao C(n, k) = C(n−1, k−1) + C(n−1, k): xét phần tử cuối cùng, hoặc chọn nó (còn chọn k−1 trong n−1), hoặc không chọn (chọn k trong n−1).
   - Ý nghĩa: đây là quy hoạch động đầu tiên học sinh gặp, và chỉ dùng phép cộng nên lấy modulo không gặp vấn đề phép chia.
   - Dùng cho: n ≤ 5000 và cần nhiều giá trị C(n, k).
4. **Giai thừa kết hợp nghịch đảo modulo.**
   - Vì sao cần: n tới 10^6 thì bảng Pascal quá lớn; công thức giai thừa lại có phép chia, mà phép chia không lấy mod được.
   - Cách làm: với p nguyên tố, chia cho x tương đương nhân với x^(p−2) mod p (định lý Fermat nhỏ), tính bằng lũy thừa nhanh ở chuyên đề 2.
5. **Nguyên lý bù trừ.**
   - Vì sao: khi cộng |A| + |B|, các phần tử thuộc cả hai bị đếm hai lần nên phải trừ |A ∩ B| một lần.
   - Dùng cho: đếm số chia hết cho a hoặc b, đếm số không chia hết cho bất kỳ số nào trong danh sách.
   - Mẹo: thường dễ hơn khi đếm phần bù, tức “tổng số cách trừ số cách xấu”.

Đọc thêm (tiếng Việt): [VNOI Wiki – Tổ hợp và cách tính C(n, k)](https://wiki.vnoi.info/algo/algebra/nCk).

**Bài tập.**

Bộ bài đi từ quy tắc nhân đơn giản đến C(n, k) modulo và bù trừ.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Bit Strings](https://cses.fi/problemset/task/1617) | CSES | Quy tắc nhân: số xâu nhị phân độ dài n là 2^n, lấy mod |
| Cơ bản | [Two Knights](https://cses.fi/problemset/task/1072) | CSES | Đếm phần bù: tổng số cặp trừ số cặp tấn công nhau |
| Vận dụng | [Binomial Coefficients](https://cses.fi/problemset/task/1079) | CSES | C(a, b) mod 10^9+7 bằng giai thừa và nghịch đảo modulo |
| Vận dụng | [Distributing Apples](https://cses.fi/problemset/task/1716) | CSES | Chia kẹo Euler (bài toán chia vật vào hộp) quy về C(n, k) |
| Vận dụng | [Creating Strings II](https://cses.fi/problemset/task/1715) | CSES | Hoán vị lặp: n! chia cho tích giai thừa số lần lặp |
| Nâng cao | [Prime Multiples](https://cses.fi/problemset/task/2185) | CSES | Nguyên lý bù trừ trên tập các số nguyên tố, duyệt tập con |

**Lỗi thường gặp.** Nhầm chỉnh hợp với tổ hợp; tính giai thừa trực tiếp bị tràn; chia khi đang lấy modulo.

## Chuyên đề 4. Mảng cộng dồn, sắp xếp, hai con trỏ (tuần 6–7)

Ba kỹ thuật này biến lời giải O(n²) thành O(n) hoặc O(n log n), và xuất hiện trong hầu hết đề thi.

### Buổi 1 — Mảng cộng dồn và mảng hiệu

Định nghĩa S\[i\] = a\[1\] + … + a\[i\], S\[0\] = 0. Khi đó tổng đoạn \[l, r\] = S\[r\] − S\[l−1\], trả lời mỗi truy vấn trong O(1).

```cpp
for (int i = 1; i <= n; i++) S[i] = S[i-1] + a[i];
// tổng đoạn [l, r]
ll sum = S[r] - S[l-1];
```

Mảng hiệu là phép ngược: muốn cộng x vào cả đoạn \[l, r\] thì làm D\[l\] += x, D\[r+1\] −= x, cuối cùng cộng dồn D. Mở rộng 2D: S\[i\]\[j\] = a\[i\]\[j\] + S\[i−1\]\[j\] + S\[i\]\[j−1\] − S\[i−1\]\[j−1\]; vẽ hình chữ nhật trên bảng để học sinh thấy vì sao phải trừ phần giao.

### Buổi 2 — Sắp xếp và hai con trỏ

Dùng `sort(a.begin(), a.end())` với O(n log n). Sắp xếp theo tiêu chí riêng bằng hàm so sánh, ví dụ sắp theo điểm giảm dần, bằng điểm thì theo tên tăng dần.

Hai con trỏ: trên mảng đã sắp xếp, đặt i ở đầu, j ở cuối; tổng lớn quá thì lùi j, nhỏ quá thì tiến i. Mỗi con trỏ chỉ đi một chiều nên tổng cộng O(n).

```cpp
// Đếm cặp i < j có a[i] + a[j] = k, mảng a đã sắp xếp, các phần tử phân biệt
int i = 0, j = n - 1, cnt = 0;
while (i < j) {
    if (a[i] + a[j] == k) { cnt++; i++; j--; }
    else if (a[i] + a[j] < k) i++;
    else j--;
}
```

Cửa sổ trượt: tìm đoạn con dài nhất có tổng ≤ k (các số không âm) bằng cách mở rộng phải, co trái khi vượt.

**Hiểu sâu lý thuyết.**

1. **Mảng cộng dồn.**
   - Vì sao S\[r\] − S\[l−1\] đúng: S\[r\] là tổng từ 1 đến r, S\[l−1\] là tổng từ 1 đến l−1; trừ đi thì phần đầu triệt tiêu, còn lại đúng đoạn \[l, r\]. Đặt S\[0\] = 0 để công thức đúng cả khi l = 1.
   - Ý nghĩa: “trả trước” O(n) một lần để mỗi truy vấn sau chỉ O(1). Với q = 10^5 truy vấn trên n = 10^5 phần tử, ta đi từ 10^10 xuống 2·10^5 phép tính.
   - Dùng cho: nhiều truy vấn tổng đoạn; đếm số phần tử thỏa điều kiện trong đoạn (đánh dấu 0/1 rồi cộng dồn); đoạn con có tổng bằng k hoặc chia hết cho k (đếm các S bằng nhau theo số dư).
   - Dấu hiệu: đề nói “q truy vấn, mỗi truy vấn hỏi về đoạn \[l, r\]” và mảng không thay đổi.
2. **Mảng hiệu.**
   - Vì sao: cộng x vào D\[l\] làm mọi phần tử từ l trở đi tăng x khi cộng dồn; trừ x ở D\[r+1\] để dừng tác dụng sau r.
   - Ý nghĩa: mảng hiệu là phép ngược của cộng dồn, giống đạo hàm và tích phân.
   - Dùng cho: nhiều thao tác “tăng cả đoạn” rồi hỏi kết quả cuối cùng; đếm mỗi điểm bị bao nhiêu đoạn phủ.
3. **Sắp xếp làm nền.**
   - Vì sao quan trọng: sau khi sắp xếp, dữ liệu có thứ tự nên mở được hai con trỏ, chặt nhị phân và tham lam. O(n log n) gần như luôn đủ.
   - Cách dùng: viết hàm so sánh tùy biến, hoặc sắp `pair` theo khóa chính rồi khóa phụ.
4. **Hai con trỏ.**
   - Vì sao đúng (bài tổng hai số): mảng tăng dần, nếu a\[i\] + a\[j\] < x thì a\[i\] cộng với mọi phần tử còn lại đều nhỏ hơn x, nên bỏ a\[i\] mà không mất đáp án; tương tự khi lớn hơn x thì bỏ a\[j\].
   - Vì sao O(n): mỗi con trỏ chỉ đi một chiều, tổng số bước không quá n.
   - Dùng cho: tìm cặp có tổng hoặc hiệu cho trước; trộn hai dãy đã sắp; cửa sổ trượt (đoạn con dài nhất hoặc ngắn nhất thỏa điều kiện khi các số không âm).
   - Dấu hiệu: dãy đã sắp xếp hoặc sắp xếp được, và khi một đầu dịch đi thì đầu kia không bao giờ phải lùi lại.

Đọc thêm (tiếng Việt): [VNOI Wiki – Mảng cộng dồn và mảng hiệu](https://wiki.vnoi.info/algo/data-structures/prefix-sum-and-difference-array), [VNOI Wiki – Kĩ thuật hai con trỏ](https://wiki.vnoi.info/algo/basic/two-pointers).

**Bài tập.**

Các bài VNOJ và LQDOJ về hai con trỏ là những bài VNOI Wiki đề xuất trong phần luyện tập của bài viết hai con trỏ.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Static Range Sum Queries](https://cses.fi/problemset/task/1646) | CSES | Cộng dồn 1 chiều, truy vấn tổng đoạn O(1) |
| Cơ bản | [FINDPAIR](https://lqdoj.edu.vn/problem/findpair) | LQDOJ (tiếng Việt) | Hai con trỏ tìm cặp có tổng cho trước |
| Cơ bản | [TWOSUM](https://oj.vnoi.info/problem/twosum) | VNOJ (tiếng Việt) | Hai con trỏ trên dãy đã sắp xếp |
| Vận dụng | [CNTPAIR02](https://lqdoj.edu.vn/problem/cntpair02) | LQDOJ (tiếng Việt) | Đếm cặp bằng hai con trỏ |
| Vận dụng | [NKSGAME](https://oj.vnoi.info/problem/nksgame) | VNOJ (tiếng Việt) | Sắp xếp hai dãy rồi dùng hai con trỏ |
| Vận dụng | [Forest Queries](https://cses.fi/problemset/task/1652) | CSES | Cộng dồn 2 chiều, đếm cây trong hình chữ nhật |
| Vận dụng | [Apartments](https://cses.fi/problemset/task/1084) | CSES | Sắp xếp hai dãy rồi ghép bằng hai con trỏ |
| Nâng cao | [Subarray Sums II](https://cses.fi/problemset/task/1661) | CSES | Đếm đoạn con có tổng x: cộng dồn kết hợp đếm (map) |
| Nâng cao | [Subarray Divisibility](https://cses.fi/problemset/task/1662) | CSES | Đoạn con có tổng chia hết cho n: đếm cộng dồn theo số dư |

**Lỗi thường gặp.** Lệch chỉ số khi dùng S\[l−1\] với mảng bắt đầu từ 0; quên sắp xếp trước khi dùng hai con trỏ; tổng cộng dồn tràn `int`.

## Chuyên đề 5. Tìm kiếm nhị phân (tuần 9)

Chặt nhị phân tìm được đáp án trong 60 bước kể cả khi miền giá trị lên tới 10^18, miễn là điều kiện có tính đơn điệu.

**Mục tiêu.** Cài đặt chặt nhị phân không lỗi vòng lặp vô hạn; dùng `lower_bound`, `upper_bound`; chặt nhị phân trên kết quả.

**Hoạt động mở đầu.** Trò chơi “đoán số từ 1 đến 100, chỉ được trả lời lớn hơn/nhỏ hơn”. Học sinh phát hiện luôn đoán ở giữa thì tối đa 7 lần.

**Kiến thức trọng tâm.**

1. Trên mảng đã sắp xếp: `lower_bound` trả vị trí đầu tiên ≥ x, `upper_bound` trả vị trí đầu tiên > x. Số lần xuất hiện của x = upper − lower.
2. Chặt nhị phân trên kết quả: nếu hàm kiểm tra check(x) có dạng sai, sai, …, đúng, đúng thì tìm được x nhỏ nhất làm check đúng.
3. Mẫu cài đặt an toàn, dùng chung cho mọi bài:

```cpp
// tìm x nhỏ nhất trong [lo, hi] mà check(x) đúng
ll lo = 0, hi = 2e18, ans = -1;
while (lo <= hi) {
    ll mid = lo + (hi - lo) / 2;
    if (check(mid)) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
}
```

**Ví dụ minh họa — Cắt gỗ.** Có n khúc gỗ, cần cắt được ít nhất m mét bằng cách đặt lưỡi cưa ở độ cao h. Tìm h lớn nhất. Hàm check(h) tính tổng phần gỗ cao hơn h; h càng tăng thì tổng càng giảm, nên chặt nhị phân được.

**Hiểu sâu lý thuyết.**

1. **Vì sao chỉ cần log n bước.** Mỗi lần so sánh với phần tử giữa, ta loại được một nửa vùng tìm kiếm. Sau k bước còn n/2^k phần tử, nên khoảng 20 bước cho 10^6 phần tử và khoảng 60 bước cho 10^18.
2. **Điều kiện bắt buộc: tính đơn điệu.**
   - Chặt nhị phân chỉ đúng khi hàm kiểm tra check(x) có dạng “sai, sai, …, sai, đúng, đúng, …, đúng” (hoặc ngược lại) khi x tăng.
   - Ý nghĩa: không cần mảng đã sắp xếp; chỉ cần câu trả lời “có/không” đổi chiều đúng một lần.
   - Học sinh phải tự chứng minh tính đơn điệu bằng một câu, ví dụ: “hạ lưỡi cưa xuống thì gỗ thu được không giảm”.
3. **Chặt nhị phân trên mảng.**
   - Dùng cho: tìm x trong mảng đã sắp; đếm số phần tử trong đoạn giá trị \[a, b\] bằng `upper_bound(b) − lower_bound(a)`.
   - Dấu hiệu: nhiều truy vấn “có bao nhiêu số ≤ x / ≥ x”.
4. **Chặt nhị phân trên kết quả.**
   - Ý tưởng: thay vì hỏi “đáp án là bao nhiêu?”, ta hỏi “đáp án ≤ x có được không?”, vì câu hỏi có/không thường dễ hơn nhiều.
   - Dấu hiệu trong đề: “lớn nhất có thể / nhỏ nhất có thể”, đặc biệt dạng “làm cho giá trị lớn nhất là nhỏ nhất” hoặc “làm cho khoảng cách nhỏ nhất là lớn nhất”.
   - Cách dùng: (1) xác định miền đáp án \[lo, hi\]; (2) viết check(x) thường bằng tham lam O(n); (3) chứng minh check đơn điệu; (4) dùng mẫu code chung. Tổng độ phức tạp O(n log(hi − lo)).
5. **Lỗi biên.** Dùng một mẫu duy nhất có biến `ans` (như code mẫu ở trên) giúp tránh vòng lặp vô hạn và lệch một đơn vị, hai lỗi phổ biến nhất của chặt nhị phân.

Đọc thêm (tiếng Việt): [VNOI Wiki – Tìm kiếm nhị phân](https://wiki.vnoi.info/algo/basic/Binary-Search).

**Bài tập.**

EKO chính là bài “Cắt gỗ” ở ví dụ minh họa, và AGGRCOW là bài “Aggressive Cows” ở phần nâng cao.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [EKO – Eko](https://www.spoj.com/problems/EKO/) | SPOJ | Chặt nhị phân độ cao lưỡi cưa, check bằng một vòng lặp |
| Vận dụng | [Factory Machines](https://cses.fi/problemset/task/1620) | CSES | Chặt nhị phân thời gian nhỏ nhất để làm đủ t sản phẩm; cẩn thận tràn số |
| Vận dụng | [Array Division](https://cses.fi/problemset/task/1085) | CSES | Chia mảng thành k đoạn sao cho tổng lớn nhất là nhỏ nhất |
| Vận dụng | [AGGRCOW – Aggressive cows](https://www.spoj.com/problems/AGGRCOW/) | SPOJ | Khoảng cách nhỏ nhất lớn nhất; check bằng tham lam |
| Nâng cao | [LIS – Dãy con tăng dài nhất (bản khó)](https://oj.vnoi.info/problem/lis) | VNOJ (tiếng Việt) | Dãy con tăng dài nhất O(n log n) bằng chặt nhị phân, nối với chuyên đề 7 |
| Nâng cao | [Multiplication Table](https://cses.fi/problemset/task/2422) | CSES | Tìm phần tử trung vị của bảng cửu chương n×n bằng chặt nhị phân trên giá trị |

**Lỗi thường gặp.** Tính (lo + hi) / 2 bị tràn; chọn sai cận hi; hàm check không đơn điệu.

## Chuyên đề 6. Đệ quy, quay lui, tham lam (tuần 10–11)

Quay lui giúp lấy chắc điểm các subtask n nhỏ; tham lam cho lời giải nhanh nhưng phải biết chứng minh hoặc phản ví dụ.

### Buổi 1 — Đệ quy và quay lui

Đệ quy gồm hai phần: điều kiện dừng và lời gọi với bài toán nhỏ hơn. Minh họa bằng giai thừa, Fibonacci, tháp Hà Nội; vẽ cây đệ quy trên bảng.

Quay lui thử lần lượt từng lựa chọn ở mỗi vị trí, đi sâu, rồi “trả lại” trạng thái để thử lựa chọn khác.

```cpp
int n, x[20];
bool used[20];
void backtrack(int i) {           // sinh mọi hoán vị của 1..n
    if (i > n) {
        for (int k = 1; k <= n; k++) cout << x[k] << ' ';
        cout << '\n';
        return;
    }
    for (int v = 1; v <= n; v++)
        if (!used[v]) {
            used[v] = true; x[i] = v;
            backtrack(i + 1);
            used[v] = false;    // quay lui
        }
}
```

Biến thể cần dạy: sinh dãy nhị phân độ dài n (2^n), sinh tổ hợp chập k, bài 8 quân hậu. Giới thiệu nhánh cận: cắt nhánh khi biết chắc không tốt hơn đáp án hiện có.

### Buổi 2 — Tham lam

Tham lam chọn phương án tốt nhất tại mỗi bước. Thường đi kèm sắp xếp theo tiêu chí phù hợp.

Ví dụ kinh điển — chọn nhiều hoạt động không giao nhau nhất: sắp theo thời điểm kết thúc tăng dần, lấy hoạt động nào bắt đầu sau hoạt động vừa chọn. Chứng minh bằng hoán đổi: thay hoạt động đầu của lời giải tối ưu bằng hoạt động kết thúc sớm nhất thì không tệ hơn.

Hoạt động phản ví dụ: đổi tiền với mệnh giá {1, 3, 4}, cần 6 đồng. Tham lam chọn 4+1+1 (3 tờ) nhưng tối ưu là 3+3 (2 tờ). Học sinh rút ra: tham lam phải kiểm chứng, nếu không chắc thì dùng QHĐ (chuyên đề 7).

**Hiểu sâu lý thuyết.**

1. **Đệ quy.**
   - Vì sao hoạt động: mỗi lời gọi giải một bài nhỏ hơn cùng dạng, và điều kiện dừng bảo đảm quá trình kết thúc. Giống chứng minh quy nạp: đúng với trường hợp nhỏ nhất, và đúng với n nếu đúng với n−1.
   - Ý nghĩa: đệ quy là cách viết tự nhiên cho bài có cấu trúc lồng nhau (tháp Hà Nội, cây, chia đôi) và là bước đệm sang quy hoạch động.
   - Lưu ý: đệ quy sâu quá khoảng 10^5–10^6 tầng có thể tràn stack.
2. **Quay lui.**
   - Vì sao cần “trả lại trạng thái”: các nhánh dùng chung mảng `used` và `x`; nếu không trả lại, nhánh sau sẽ thấy dấu vết của nhánh trước và cho kết quả sai.
   - Ý nghĩa: quay lui duyệt có hệ thống mọi cấu hình nên luôn đúng, đổi lại chậm (2^n hoặc n!).
   - Dùng cho: n nhỏ (n ≤ 20 với tập con, n ≤ 10 với hoán vị); lấy điểm subtask nhỏ của bài khó; viết lời giải trâu để đối chiếu.
   - Nhánh cận: cắt nhánh khi chắc chắn không thể tốt hơn đáp án đang có, giúp chạy nhanh hơn nhiều trên thực tế.
3. **Tham lam.**
   - Ý tưởng: ở mỗi bước chọn phương án tốt nhất trước mắt và không bao giờ xét lại.
   - Vì sao có lúc đúng: bài có “tính chất lựa chọn tham lam”, tức luôn tồn tại lời giải tối ưu bắt đầu bằng lựa chọn tham lam.
   - Cách chứng minh cho học sinh THCS (lập luận hoán đổi): lấy một lời giải tối ưu bất kỳ; thay lựa chọn đầu tiên của nó bằng lựa chọn tham lam; chỉ ra kết quả không tệ hơn; lặp lại cho các bước sau.
   - Dấu hiệu: bài tối ưu sau khi sắp xếp theo một tiêu chí (thời điểm kết thúc, thời gian xử lý, tỉ lệ giá trị/khối lượng).
   - Cảnh báo: luôn thử tìm phản ví dụ nhỏ trước khi nộp; nếu tìm được thì chuyển sang quy hoạch động.

Đọc thêm (tiếng Việt): [VNOI Wiki – Tham lam](https://wiki.vnoi.info/algo/greedy-new).

**Bài tập.**

Ba bài đầu luyện quay lui, ba bài sau luyện tham lam kèm chứng minh.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Creating Strings](https://cses.fi/problemset/task/1622) | CSES | Quay lui sinh hoán vị của xâu, bỏ trùng lặp |
| Cơ bản | [Apple Division](https://cses.fi/problemset/task/1623) | CSES | Duyệt mọi tập con (n ≤ 20) để chia hai nhóm chênh lệch nhỏ nhất |
| Vận dụng | [Chessboard and Queens](https://cses.fi/problemset/task/1624) | CSES | Quay lui 8 quân hậu có ô cấm, đánh dấu cột và đường chéo |
| Cơ bản | [Movie Festival](https://cses.fi/problemset/task/1629) | CSES | Chọn nhiều hoạt động không giao nhau: sắp theo thời điểm kết thúc |
| Vận dụng | [Tasks and Deadlines](https://cses.fi/problemset/task/1630) | CSES | Tham lam theo thời gian xử lý, chứng minh bằng hoán đổi |
| Nâng cao | [Missing Coin Sum](https://cses.fi/problemset/task/2183) | CSES | Tham lam sau sắp xếp, cần một nhận xét toán học khéo |
| Nâng cao | [Tower of Hanoi](https://cses.fi/problemset/task/2165) | CSES | Đệ quy kinh điển, in ra 2^n − 1 bước di chuyển |

**Lỗi thường gặp.** Quên trả lại trạng thái khi quay lui; đệ quy quá sâu gây tràn stack; dùng tham lam khi chưa kiểm chứng.

## Chuyên đề 7. Quy hoạch động cơ bản (tuần 12–13)

Quy hoạch động (QHĐ) lưu lại kết quả bài toán con để không tính lặp, thường là bài phân loại học sinh giỏi trong đề THCS.

**Mục tiêu.** Xây dựng QHĐ theo 4 bước; giải các bài kinh điển: đếm đường đi, dãy con tăng dài nhất, cái túi.

**Quy trình 4 bước (học sinh phải viết ra giấy trước khi code).**

1. Trạng thái: dp\[i\] (hoặc dp\[i\]\[j\]) nghĩa là gì, nói bằng một câu.
2. Công thức chuyển: dp\[i\] tính từ những trạng thái nhỏ hơn nào.
3. Cơ sở: giá trị ban đầu, ví dụ dp\[0\].
4. Đáp án: nằm ở ô nào, hoặc là max/min của những ô nào.

### Buổi 1 — Từ đệ quy đến QHĐ

Mở đầu bằng Fibonacci đệ quy thường với n = 45 (rất chậm), rồi lưu mảng (rất nhanh). Học sinh đếm số lời gọi để thấy sự khác biệt.

Bài leo cầu thang: mỗi bước leo 1 hoặc 2 bậc, có bao nhiêu cách lên bậc n? Trạng thái dp\[i\] = số cách lên bậc i; dp\[i\] = dp\[i−1\] + dp\[i−2\]; dp\[0\] = 1.

Bài đường đi trên lưới có ô cấm: dp\[i\]\[j\] = dp\[i−1\]\[j\] + dp\[i\]\[j−1\] nếu ô (i, j) đi được, ngược lại bằng 0.

### Buổi 2 — Dãy con tăng và cái túi

Dãy con tăng dài nhất (LIS): dp\[i\] = độ dài dãy con tăng dài nhất kết thúc tại a\[i\] = 1 + max dp\[j\] với j < i và a\[j\] < a\[i\]. Độ phức tạp O(n²), đủ cho n ≤ 5000.

Cái túi 0/1: n đồ vật, vật i nặng w\[i\], giá trị v\[i\]; túi chịu tối đa W. Trạng thái dp\[j\] = giá trị lớn nhất với tổng khối lượng không quá j.

```cpp
vector<ll> dp(W + 1, 0);
for (int i = 1; i <= n; i++)
    for (int j = W; j >= w[i]; j--)   // duyệt ngược để mỗi vật dùng 1 lần
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
cout << dp[W] << '\n';
```

Gợi ý dạy: điền bảng dp bằng tay với 3 đồ vật, W = 5, rồi hỏi “nếu duyệt j tăng dần thì sai ở đâu?”.

**Hiểu sâu lý thuyết.**

1. **Vì sao QHĐ nhanh.**
   - Đệ quy Fibonacci thường gọi lại cùng một bài con rất nhiều lần (fib(3) được tính hàng triệu lần khi n = 40), nên chạy theo hàm mũ.
   - QHĐ tính mỗi bài con đúng một lần và lưu lại, nên độ phức tạp bằng số trạng thái × chi phí mỗi lần chuyển.
2. **Hai điều kiện để dùng QHĐ.**
   - Bài con gối nhau: nhiều cách đi khác nhau dẫn tới cùng một bài con.
   - Cấu trúc con tối ưu: lời giải tốt nhất của bài lớn được ghép từ lời giải tốt nhất của các bài con.
   - Ý nghĩa: hai điều kiện này giải thích vì sao QHĐ đúng ở bài đổi tiền, trong khi tham lam thì sai.
3. **Cách nghĩ ra trạng thái.**
   - Hỏi: “để quyết định bước cuối cùng, ta cần biết gì về phần trước?”. Thông tin đó chính là trạng thái.
   - Leo cầu thang: bước cuối là 1 hoặc 2 bậc, nên chỉ cần biết số cách lên bậc i−1 và i−2.
   - LIS: phần tử kế tiếp phải lớn hơn phần tử cuối, nên trạng thái phải ghi nhớ “dãy kết thúc tại i”.
   - Cái túi: thêm vật mới cần biết còn bao nhiêu sức chứa, nên trạng thái gồm khối lượng j.
4. **Thứ tự tính.** Phải tính bài con trước bài lớn. Ở cái túi 0/1 dùng mảng một chiều, duyệt j giảm dần để dp\[j − w\[i\]\] vẫn là giá trị cũ (chưa dùng vật i); duyệt tăng dần sẽ cho phép dùng một vật nhiều lần (bài cái túi không giới hạn).
5. **Các dạng bài QHĐ thường gặp ở THCS.**
   - Đếm số cách (cộng các trạng thái trước): leo cầu thang, đường đi trên lưới, đổi tiền đếm số cách.
   - Tối ưu (lấy max/min các trạng thái trước): tổng lớn nhất trên lưới, đổi tiền ít tờ nhất, cái túi.
   - Dãy con: dãy con tăng dài nhất, dãy con chung dài nhất.
   - Dấu hiệu: “có bao nhiêu cách”, “lớn nhất/nhỏ nhất” mà tham lam có phản ví dụ, và n cỡ 10^3–10^5.

Đọc thêm (tiếng Việt): [VNOI Wiki – Một số bài QHĐ điển hình](https://wiki.vnoi.info/algo/dp/basic-problems).

**Bài tập.**

Mỗi bài ứng với một dạng ở trên; LIQ là bài tiếng Việt kinh điển trên VNOJ.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Dice Combinations](https://cses.fi/problemset/task/1633) | CSES | Đếm số cách, mở rộng bài leo cầu thang (mỗi bước 1–6) |
| Cơ bản | [Grid Paths I](https://cses.fi/problemset/task/1638) | CSES | Đếm đường đi trên lưới có ô cấm |
| Cơ bản | [LIQ – Dãy con tăng dài nhất (bản dễ)](https://oj.vnoi.info/problem/LIQ) | VNOJ (tiếng Việt) | LIS O(n²) với N ≤ 1000 |
| Vận dụng | [Minimizing Coins](https://cses.fi/problemset/task/1634) | CSES | Đổi tiền ít tờ nhất, bài mà tham lam thất bại ở chuyên đề 6 |
| Vận dụng | [Book Shop](https://cses.fi/problemset/task/1158) | CSES | Cái túi 0/1 kinh điển |
| Nâng cao | [Money Sums](https://cses.fi/problemset/task/1745) | CSES | QHĐ trên tập tổng có thể tạo được |
| Nâng cao | [Coin Combinations II](https://cses.fi/problemset/task/1636) | CSES | Đếm số cách đổi tiền không phân biệt thứ tự; thứ tự vòng lặp quyết định đáp án |

**Lỗi thường gặp.** Định nghĩa trạng thái mơ hồ; sai thứ tự duyệt; khởi tạo sai giá trị cơ sở; mảng dp quá lớn vượt bộ nhớ.

## Chuyên đề 8. Đồ thị nhập môn (tuần 14–15)

Với học sinh THCS, đồ thị chủ yếu xuất hiện dưới dạng bảng lưới (mê cung, loang vùng), nên dạy DFS/BFS trên lưới song song với danh sách kề.

**Mục tiêu.** Biểu diễn đồ thị bằng danh sách kề; cài đặt DFS, BFS; đếm thành phần liên thông; tìm đường đi ngắn nhất trên đồ thị không trọng số.

### Buổi 1 — Biểu diễn và DFS

Đồ thị gồm đỉnh và cạnh. Minh họa bằng bản đồ các thành phố nối bởi đường. Lưu bằng `vector<int> adj[N]`, mỗi cạnh (u, v) vô hướng thì thêm cả hai chiều.

```cpp
vector<int> adj[100005];
bool visited[100005];
void dfs(int u) {
    visited[u] = true;
    for (int v : adj[u])
        if (!visited[v]) dfs(v);
}
// đếm thành phần liên thông
int comp = 0;
for (int u = 1; u <= n; u++)
    if (!visited[u]) { comp++; dfs(u); }
```

### Buổi 2 — BFS và loang trên lưới

BFS đi theo từng “lớp”: các đỉnh cách nguồn 1 bước, rồi 2 bước… Vì vậy BFS cho đường đi ngắn nhất khi mọi cạnh dài bằng nhau.

```cpp
int dx[] = {-1, 1, 0, 0}, dy[] = {0, 0, -1, 1};
queue<pair<int,int>> q;
fill(&d[0][0], &d[0][0] + MAXR * MAXC, -1);
d[sx][sy] = 0; q.push({sx, sy});
while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int k = 0; k < 4; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (nx < 0 || ny < 0 || nx >= R || ny >= C) continue;
        if (g[nx][ny] == '#' || d[nx][ny] != -1) continue;
        d[nx][ny] = d[x][y] + 1;
        q.push({nx, ny});
    }
}
```

Hoạt động trên lớp: phát giấy kẻ ô có mê cung, học sinh ghi số bước vào từng ô theo thứ tự BFS bằng bút chì trước khi code.

**Hiểu sâu lý thuyết.**

1. **Mô hình hóa thành đồ thị.**
   - Ý nghĩa: rất nhiều bài không nhắc tới “đồ thị” nhưng thực chất là đồ thị: ô trên bảng là đỉnh, hai ô kề nhau có cạnh; trạng thái trò chơi là đỉnh, một nước đi là cạnh.
   - Cách dùng: luôn trả lời hai câu “đỉnh là gì? cạnh là gì?” trước khi code.
   - Danh sách kề tốn bộ nhớ O(n + m), phù hợp n tới 10^5; ma trận kề tốn O(n²), chỉ dùng khi n ≤ vài nghìn.
2. **DFS (duyệt theo chiều sâu).**
   - Vì sao thăm hết thành phần liên thông: từ một đỉnh, DFS đi tới mọi đỉnh kề chưa thăm rồi tiếp tục từ đó, nên mọi đỉnh nối được với điểm xuất phát đều được thăm; mảng `visited` bảo đảm mỗi đỉnh chỉ thăm một lần.
   - Độ phức tạp: O(n + m).
   - Dùng cho: đếm thành phần liên thông, đếm vùng/đảo, kiểm tra hai đỉnh có thông nhau không, tô màu hai phía.
3. **BFS (duyệt theo chiều rộng).**
   - Vì sao cho đường đi ngắn nhất: hàng đợi lấy ra các đỉnh theo đúng thứ tự khoảng cách 0, 1, 2, …; khi một đỉnh được thăm lần đầu, nó đã được tới bằng số bước ít nhất. Điều này chỉ đúng khi mọi cạnh dài bằng nhau.
   - Dùng cho: số bước ít nhất trong mê cung, quân mã, các bài biến đổi trạng thái với mỗi thao tác tốn 1 bước.
   - Truy vết: lưu đỉnh cha `par[v]` khi thăm v, rồi đi ngược từ đích về nguồn để in đường đi.
4. **Loang đa nguồn.** Đẩy tất cả điểm xuất phát vào hàng đợi cùng lúc với khoảng cách 0. Kết quả là khoảng cách tới điểm xuất phát gần nhất. Dùng cho bài lửa lan, nước tràn, quái vật đuổi.
5. **Chọn DFS hay BFS.** Cần khoảng cách ngắn nhất thì dùng BFS. Chỉ cần biết “thăm được những đâu” thì dùng cái nào cũng được; trên lưới lớn nên dùng BFS hoặc DFS bằng ngăn xếp để tránh tràn stack.

Đọc thêm (tiếng Việt): [VNOI Wiki – BFS](https://wiki.vnoi.info/algo/graph-theory/breadth-first-search).

**Bài tập.**

Bộ bài CSES về đồ thị đi đúng thứ tự từ loang vùng đến BFS đa nguồn, rất hợp với hai buổi của chuyên đề này.

| Mức | Bài | Nguồn | Luyện kỹ năng |
| --- | --- | --- | --- |
| Cơ bản | [Counting Rooms](https://cses.fi/problemset/task/1192) | CSES | Đếm số vùng trên lưới bằng DFS/BFS (loang) |
| Cơ bản | [Building Roads](https://cses.fi/problemset/task/1666) | CSES | Đếm thành phần liên thông và nối chúng lại |
| Vận dụng | [Labyrinth](https://cses.fi/problemset/task/1193) | CSES | BFS trên lưới, truy vết và in đường đi ngắn nhất |
| Vận dụng | [Message Route](https://cses.fi/problemset/task/1667) | CSES | BFS trên đồ thị danh sách kề, in đường đi |
| Vận dụng | [Building Teams](https://cses.fi/problemset/task/1668) | CSES | Tô hai màu bằng DFS/BFS (đồ thị hai phía) |
| Nâng cao | [Monsters](https://cses.fi/problemset/task/1194) | CSES | BFS đa nguồn cho quái vật rồi BFS cho người, giống bài lửa lan |

**Lỗi thường gặp.** Quên đánh dấu đã thăm gây lặp vô hạn; truy cập ra ngoài bảng; DFS đệ quy quá sâu trên lưới 1000×1000 (nên dùng BFS).

## Đánh giá, chiến thuật phòng thi và tài liệu

Điểm tổng kết gồm 30% bài về nhà, 30% thi thử giữa kỳ, 40% thi thử cuối kỳ; chấm tự động bằng Themis hoặc nền tảng chấm trực tuyến.

**Hình thức kiểm tra.**

| Hình thức | Thời điểm | Nội dung | Trọng số |
| --- | --- | --- | --- |
| Bài về nhà | Hằng tuần | 2–3 bài theo chuyên đề vừa học | 30% |
| Thi thử giữa kỳ | Tuần 8 | 4 bài, 150 phút, chuyên đề 1–4 | 30% |
| Thi thử cuối kỳ | Tuần 16 | 5 bài, 180 phút, toàn khóa | 40% |

**Chiến thuật phòng thi (dạy trong buổi thi thử).**

1. Đọc hết đề trong 10–15 phút đầu, xếp bài từ dễ đến khó.
2. Nhìn giới hạn n và bảng tra ở chuyên đề 1 để chọn thuật toán.
3. Chưa nghĩ ra lời giải đầy đủ thì viết thuật toán trâu để lấy điểm subtask nhỏ.
4. Tự sinh test biên: n = 1, n lớn nhất, mọi phần tử bằng nhau, số âm.
5. So sánh lời giải chính với lời giải trâu trên test ngẫu nhiên (đối chiếu chéo) nếu còn thời gian.
6. Trước khi nộp: kiểm tra tên file, `freopen`, `long long`, xóa dòng in gỡ lỗi.

**Nền tảng luyện tập.**

- [VNOJ](https://oj.vnoi.info) — kho bài tiếng Việt, có nhiều đề thi học sinh giỏi các tỉnh.
- [Codeforces](https://codeforces.com) — kỳ thi định kỳ, bắt đầu từ Div. 3 và Div. 4.
- [CSES Problem Set](https://cses.fi/problemset/) — bộ bài kinh điển xếp theo chủ đề.
- [Free Contest](https://freecontest.net) — kỳ thi tiếng Việt cho học sinh.
- [VNOI Wiki](https://vnoi.info/wiki) — bài viết thuật toán tiếng Việt.

**Sách tham khảo.** “Tài liệu giáo khoa chuyên Tin” (Hồ Sĩ Đàm chủ biên); “Giải thuật và lập trình” (Lê Minh Hoàng); “Competitive Programmer’s Handbook” (Antti Laaksonen, miễn phí).
