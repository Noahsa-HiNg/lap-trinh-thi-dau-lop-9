# .agents — trạng thái điều phối nhiều agent

| Thư mục | Nội dung | Commit vào git? |
| --- | --- | --- |
| `sessions/` | Mỗi phiên làm việc một file `<UTC>-<agent>-<hex>.json` (ai, việc gì, trạng thái, tóm tắt). | Có, làm lịch sử. |
| `worklog/` | Nhật ký chỉ-nối-thêm, mỗi ngày một file `YYYY-MM-DD.jsonl`, mỗi dòng một sự kiện. | Có. |
| `locks/` | Khóa đang giữ, mỗi tài nguyên một file `<đường_dẫn>.lock`. | Không (trạng thái tạm). |
| `inbox/` | Yêu cầu sửa file dùng chung, gửi cho điều phối. | Có. |

Mọi thao tác đi qua `python3 scripts/agentctl.py`; không sửa tay các file ở đây.
Quy trình đầy đủ: xem [`AGENTS.md`](../AGENTS.md).

Định dạng một dòng nhật ký:

```json
{"ts": "2026-10-07T11:25:24Z", "agent": "topic-sieve", "kind": "progress", "msg": "Đã tìm xong 7 bài tập", "session": "20261007T112522Z-topic-sieve-f712", "topic": "sieve"}
```

Định dạng một file khóa:

```json
{"resource": "topics/sieve.html", "agent": "topic-sieve", "session": "…", "host": "…", "pid": 123,
 "acquired_at": "2026-10-07T11:25:22Z", "expires_at": "2026-10-07T13:25:22Z", "note": null}
```
