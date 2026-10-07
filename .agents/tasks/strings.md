# 9.3 Xử lý xâu ký tự

- **slug:** `strings` · **chuyên đề:** CĐ9 · Cấu trúc dữ liệu & xâu
- **file:** `topics/strings.html` (+ tùy chọn `assets/js/viz/strings.js`)
- **giáo án:** (không có trong giáo án — phần mở rộng; tự thiết kế)
- **trạng thái:** xem `python3 scripts/agentctl.py status`

Làm theo [`_common.md`](_common.md) với `SLUG=strings`.

## Phạm vi nội dung

ký tự và ASCII ('a' = 97, 'A' = 65, '0' = 48), hoa/thường bằng phép trừ và toupper/tolower, isdigit/isalpha/isspace; std::string: độ dài, s[i], nối, so sánh từ điển, substr, find, erase, insert, reverse; getline và lỗi trộn cin >> với getline (cin.ignore / ws); tần suất cnt[26]/cnt[256]; xâu đối xứng bằng hai con trỏ; đảo xâu, đảo từng từ; tách từ bằng stringstream; chuẩn hóa xâu (xóa dấu cách thừa, viết hoa chữ đầu — chuẩn hóa họ tên, dùng tên không dấu và giải thích UTF-8 nhiều byte); xâu ↔ số (stoi, stoll, to_string, tự cài); anagram; đếm xâu con ngây thơ O(n·m) (nhắc KMP/hash nâng cao); s = s + c chậm vs s += c.

## Bài tập gợi ý (vẫn phải kiểm chứng từng link)

Codeforces 71A Way Too Long Words, 112A Petya and Strings, 59A Word; CSES Palindrome Reorder (1755), Repetitions (1069); bài chuẩn hóa xâu/họ tên, đếm từ, xâu đối xứng, tần suất ký tự tiếng Việt trên LQDOJ/VNOJ/MarisaOJ.

## Gợi ý minh họa

stepper .arr từng ký tự có data-i, hai con trỏ kiểm tra đối xứng; stepper chuẩn hóa '  nguyen   van  AN ' từng bước; bảng ASCII thu gọn; widget nhập xâu → mảng ký tự + mã, tần suất, đối xứng, bản chuẩn hóa.

## Ghi chú

Liên kết: big-numbers, lcs, two-pointers, stl, cpp-contest-basics.
