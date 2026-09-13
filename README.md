# TÍNH TUỔI THAI // VÒNG XOAY QUANG HỌC & HUẤN LUYỆN VIÊN LÂM SÀNG SẢN KHOA
> Tác giả: © Việt Thanh - Y23C - 17
> Hệ thống tính tuổi thai tương tác & Động cơ suy luận lâm sàng thực hành Sản khoa.

---

## 🎯 CÁCH SỬ DỤNG TRONG IDE (CURSOR, WINDSURF, VSCODE, ANTIGRAVITY)

Khi mở thư mục này trong IDE, bạn chỉ cần gọi thư mục `prompt` hoặc file `prompt/MASTER_PROMPT.md`:

```text
@prompt/MASTER_PROMPT.md Hãy đọc kỹ toàn bộ thư mục prompt và code hoàn chỉnh file index.html cho tôi
```
hoặc:
```text
@prompt Build the complete application in a single production-ready index.html file
```

---

## 📂 CẤU TRÚC THƯ MỤC PROMPT

Thư mục `prompt/` được thiết kế theo tiêu chuẩn tách rời mô-đun để AI Coder dễ dàng tiếp thu mà không bị quá tải ngữ cảnh:

1. **`prompt/MASTER_PROMPT.md`**: Master Command duy nhất, tích hợp toàn bộ kiến trúc, state machine, hướng dẫn thực thi và cam kết chất lượng.
2. **`prompt/DESIGN_SYSTEM.md`**: Hệ thống Design Tokens 3 tầng (Google Stitch Architecture) theo phong cách **Frutiger Aero / Bio-Luminescent Clinical**, loại bỏ hoàn toàn giao diện khuôn mẫu AI.
3. **`prompt/ANTI_SLOP_RULES.md`**: Các nguyên tắc khắt khe của `gu-tham-my-frontend` (cấm tuyệt đối gạch ngang dài em-dash `—`, cấm thẻ 3 cột generic, cấm màu đen tuyền, cấm font Inter mặc định, cấm từ ngữ sáo rỗng).
4. **`prompt/CLINICAL_LOGIC.md`**: Toàn bộ thuật toán, công thức y khoa, tiêu chuẩn phân định và bẫy thi lâm sàng của Thầy Âu Nhứt Luân & Thầy Trần Nhật Thăng (ĐHYD TP.HCM).
5. **`prompt/CONTENT_SPEC.md`**: Toàn văn nội dung giao diện tiếng Việt có dấu, cấu trúc form nhập liệu, danh mục 42 tuần thai, các mốc sàng lọc và rubric trạm 1 OSCE.
6. **`.cursorrules`**: Tự động kích hoạt khi mở bằng Cursor / Windsurf để ép AI luôn tuân thủ các nguyên tắc thiết kế và y khoa này.
