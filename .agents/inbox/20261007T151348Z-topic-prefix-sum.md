# Đề xuất: `.objectives li` làm vỡ dòng khi có thẻ inline

Trong `.objectives`, mỗi `<li>` có thẻ inline (`<span class="math">`, `<span class="bigo">`, `<code>`) bị tách thành nhiều dòng: có vẻ `li` dùng `display:flex` (để đặt dấu tích), nên mỗi đoạn chữ và mỗi thẻ con trở thành một flex item riêng.

Cách tạm ở topics/prefix-sum.html: bọc nội dung mỗi mục trong `<li><span>…</span></li>`.

Đề xuất sửa style.css (một trong hai): bỏ flex, đặt dấu tích bằng `::before` có `position:absolute` + `padding-left`; hoặc ghi chú trong templates/topic-template.html rằng phải bọc nội dung `li` trong một `<span>`.
