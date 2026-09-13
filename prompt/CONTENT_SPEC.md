# CONTENT SPECIFICATION & VIETNAMESE COPY (CHRONO-OBSTETRIX)
> Standard text and UI copy for the University of Medicine and Pharmacy at Ho Chi Minh City (UMP HCMC) Obstetrics suite. Zero em-dashes. Preserves all authentic Vietnamese medical diacritics.

---

## 1. HEADER & BRANDING
- App Title: `CHRONO-OBSTETRIX`
- Academic Subtitle: `Bộ môn Phụ Sản - Đại học Y Dược TP.HCM`
- Module Badge: `Y4 CLINICAL & OSCE SUITE`
- Tagline: `Vòng xoay tuổi thai quang học và động cơ suy luận lâm sàng từng bước`

---

## 2. CLINICAL INPUT CONTROLS

### Mode Switcher Tabs:
1. `Kỳ kinh cuối (LMP)` - Tính từ ngày đầu kỳ kinh chót.
2. `Siêu âm quý 1 (CRL)` - Tính từ chiều dài đầu mông 10-84 mm.
3. `Thụ tinh ống nghiệm (IVF)` - Chuẩn tuyệt đối theo ngày chuyển phôi.
4. `Tính ngược từ ngày dự sinh` - Tìm lại LMP quy ước và tuổi thai hiện tại.

### Input Labels & Fields:
- `Ngày khảo sát / Khám thai:` (Mặc định: Hôm nay)
- `Ngày đầu kỳ kinh cuối (LMP):` [Date Picker]
- `Bộ thẩm định 4 tiêu chuẩn LMP tin cậy:`
  - `[x] Chu kỳ kinh đều 28-30 ngày trong tối thiểu 3 chu kỳ liên tiếp.`
  - `[x] Nhớ chính xác ngày đầu tiên ra máu của kỳ kinh chót.`
  - `[x] Không sử dụng thuốc tránh thai nội tiết trong 3 tháng gần nhất.`
  - `[x] Không trong giai đoạn cho con bú gây vô kinh tiết sữa.`
- `Cảnh báo khi không thỏa tiêu chuẩn:`
  `LMP không tin cậy! Bắt buộc dùng siêu âm quý 1 (CRL) làm thước đo vàng để định tuổi thai.`
- `Chiều dài đầu mông (CRL):` [Number Input: 10 - 84 mm]
- `Ngày thực hiện siêu âm quý 1:` [Date Picker]
- `Loại phôi chuyển IVF:`
  - `Phôi ngày 3 (Cleavage Stage - giai đoạn phân chia)`
  - `Phôi ngày 5 (Blastocyst - phôi nang)`
- `Ngày chuyển phôi:` [Date Picker]
- `Ngày dự sinh đã biết (EDD):` [Date Picker]

---

## 3. DUAL-RING VECTOR WHEEL LABELS
- Outer Calendar Ring:
  - 12 tháng: `THÁNG 1`, `THÁNG 2`, `THÁNG 3`, `THÁNG 4`, `THÁNG 5`, `THÁNG 6`, `THÁNG 7`, `THÁNG 8`, `THÁNG 9`, `THÁNG 10`, `THÁNG 11`, `THÁNG 12`.
  - Vạch ngày: 365 vạch phân bố đều.
- Inner Gestational Disc:
  - Mũi tên đỏ: `KỲ KINH CUỐI (LMP)`
  - Mũi tên vàng: `THỤ TINH QUY ƯỚC (+14 NGÀY)`
  - Vạch đỏ neon: `DỰ SINH (EDD - 40 TUẦN)`
  - Phân vùng tam cá nguyệt:
    - `Quý 1: 1 - 13+6 tuần`
    - `Quý 2: 14 - 27+6 tuần`
    - `Quý 3: 28 - 40+6 tuần`
  - Các mốc sàng lọc chu sinh:
    - `Tuần 11 - 13+6: Đo NT, Combined Test / NIPT`
    - `Tuần 20 - 22: Siêu âm hình thái học chi tiết`
    - `Tuần 24 - 28: Nghiệm pháp dung nạp 75g Glucose (OGTT)`
    - `Tuần 28: Tiêm VAT uốn ván mũi 1 / Anti-D`
    - `Tuần 32: Đánh giá tăng trưởng thai và bánh nhau`
    - `Tuần 35 - 37: Phết âm đạo - hậu môn cấy GBS`
    - `Tuần 37 - 41+6: Thai đủ tháng`
    - `Tuần >= 42: Thai già tháng`

---

## 4. HERO METRICS CARD READOUTS
- `Tuổi thai hiện tại:` [e.g., `12 tuần 3 ngày (12+3 tuần)`]
- `Ngày dự sinh chính thức (EDD):` [e.g., `28/10/2026`]
- `Giai đoạn thai kỳ:` [e.g., `Tam cá nguyệt 1 (12+3 tuần)`]
- `Căn cứ pháp lý tuổi thai:` [e.g., `Chuẩn siêu âm CRL quý 1` / `LMP tin cậy` / `Chuẩn tuyệt đối IVF phôi ngày 5`]
- `Bề cao tử cung ước tính:` [e.g., `BCTC dự kiến: 8 cm`]

---

## 5. STEP-BY-STEP OSCE CLINICAL COACHING

### Bước 1: Thẩm định giá trị pháp lý kỳ kinh cuối
- Kiểm tra 4 tiêu chuẩn kinh nguyệt.
- Phân tích cơ chế: Nếu kinh không đều, thời điểm rụng trứng biến động khó lường, mốc zero của Naegele bị sai lệch từ 2 đến 4 tuần.

### Bước 2: Tính nhẩm Naegele và đếm ngón tay
- Công thức: `Ngày + 7; Tháng - 3; Năm + 1` (hoặc `Tháng + 9; Năm + 0` nếu tháng 1, 2, 3).
- Hướng dẫn nhẩm số ngày lẻ theo tháng 30 vs 31 ngày để sinh viên tự tin đếm tay trong phòng thi OSCE không cần máy tính.

### Bước 3: Trọng tài siêu âm CRL quý 1 (ACOG / ISUOG)
- Công thức nhẩm Thầy Luân: `Tuổi thai (ngày) = 42 + CRL (mm)`.
- Luật đối chiếu chênh lệch:
  - Dưới 9 tuần (CRL < 23 mm): lệch > 5 ngày -> hiệu chỉnh theo siêu âm CRL.
  - Từ 9 đến 13+6 tuần (CRL 24-84 mm): lệch > 7 ngày -> hiệu chỉnh theo siêu âm CRL.
  - Lệch trong ngưỡng cho phép -> giữ nguyên LMP.

### Bước 4: Thụ tinh trong ống nghiệm (IVF) - Chuẩn tuyệt đối
- Phôi ngày 3: `Tuổi thai = (Ngày khám - Ngày chuyển) + 17 ngày`.
- Phôi ngày 5: `Tuổi thai = (Ngày khám - Ngày chuyển) + 19 ngày`.
- Bẫy thi OSCE: Tuyệt đối CẤM lùi tuổi thai IVF theo siêu âm. Thai nhỏ là dấu hiệu bệnh lý (thai chậm tăng trưởng sớm FGR hoặc bất thường nhiễm sắc thể).

### Bước 5: Luật khóa tuổi thai bất biến
- Một khi tuổi thai 3 tháng đầu đã được xác lập, ngày dự sinh đó là bất biến. CẤM dùng siêu âm 3 tháng giữa hoặc 3 tháng cuối để sửa ngày dự sinh.

---

## 6. RUBRIC CHẤM ĐIỂM TRẠM 1 OSCE (10 ĐIỂM)
- `[1.0 điểm]` Chào hỏi, giới thiệu bản thân, bảo đảm tính riêng tư và tạo tâm lý an tâm cho thai phụ.
- `[3.0 điểm]` Khai thác PARA 4 số và ghi nhận tiền sử các lần sinh nở trước đây.
- `[2.0 điểm]` Thẩm định 4 điều kiện chu kỳ kinh nguyệt tin cậy.
- `[3.0 điểm]` Tính chính xác ngày dự sinh theo Naegele và biện luận tuổi thai hiện tại.
- `[1.0 điểm]` Giao tiếp giải thích rõ ràng, dặn dò các mốc khám thai quan trọng tiếp theo.
