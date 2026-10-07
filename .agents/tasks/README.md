# .agents/tasks — bảng việc

Mỗi chủ đề một file `<slug>.md` mô tả phạm vi nội dung, bài tập gợi ý và ý tưởng minh họa.
Quy trình chung cho mọi agent soạn chủ đề: [`_common.md`](_common.md).

Giao việc cho một agent chỉ cần một câu:

> Bạn là agent chủ đề của dự án tại /home/hieu/personal/thidaulaptrinh. SLUG=`<slug>`.
> Đọc `.agents/tasks/_common.md` và `.agents/tasks/<slug>.md` rồi làm đúng theo đó.

Trạng thái thực tế (đã có file chưa, ai đang khóa) xem bằng `python3 scripts/agentctl.py status`;
kết quả kiểm tra xem bằng `python3 scripts/validate.py`.
