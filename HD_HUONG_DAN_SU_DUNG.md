# Hướng Dẫn Sử Dụng Trang Web Chúc 20-10 & Làm Trend Quét Mã QR 🌹✨

Chúc mừng bạn đã sở hữu một trang web hiệu ứng động 20-10 cực kỳ lãng mạn, chuẩn xu hướng (trend) TikTok & mạng xã hội với đầy đủ âm thanh, pháo hoa trái tim, vườn hoa nở rộ, phong thư bay và trình tạo mã QR cá nhân hóa!

---

## 🌟 1. Các Tính Năng Nổi Bật

1. **Hiệu ứng Khởi đầu Bí ẩn & Tò mò (Mystery Screen)**:
   - Hộp quà 3D phát sáng nhấp nháy, đom đóm dạ quang, sao băng và cánh hoa hồng rơi 3D.
   - Dòng chữ mời gọi chạm màn hình: *"Chạm vào đây để mở món quà 20/10 💖"*.
2. **Đại tiệc Thị giác & Cảm xúc (Grand Opening Reveal)**:
   - Khi chạm vào màn hình: Âm thanh piano lãng mạn vang lên, pháo hoa trái tim bùng nổ rực rỡ từ tâm điểm.
   - Hộp quà chuyển hóa thành khóm hoa hồng nở rộ, phong thư hồng bay lên và hé nắp thiệp.
3. **Tấm Thiệp Tình Yêu & Gõ Chữ Nghệ Thuật (Love Card & Typewriter)**:
   - Hiệu ứng máy gõ chữ từng ký tự êm ái, nhẹ nhàng và lãng mạn hòa cùng tiếng đàn piano.
   - Khung ảnh kỷ niệm dạng Polaroid kèm 3 ảnh chất lượng cao (Bó hoa hồng, Hộp quà lấp lánh, Đóa hồng nhung nghệ thuật).
   - Thanh công cụ tương tác: **Bắn Tim bay**, **Tặng Đóa Hồng**, **Mưa Ảnh Kỷ Niệm**, **Đọc Lại Lời Chúc**.
4. **Bộ Điều Khiển Nhạc Phong Phú**:
   - Tích hợp sẵn 3 bản nhạc: *Piano Lãng Mạn*, *Acoustic Ngọt Ngào*, *Lo-Fi Chill Piano*.
   - Đĩa than xoay tròn góc phải trên để bật/tắt hoặc đổi bài bất kỳ lúc nào.
5. **Trình Tạo Mã QR Cá Nhân Hóa (Trend Quét Mã QR)**:
   - Nút nổi **"✨ Tạo Mã QR 20-10"** ở góc trên bên trái.
   - Nhập tên người nhận (Người yêu, Mẹ yêu, Crush, Bạn bè...).
   - Có sẵn 4 bộ lời chúc mẫu chuẩn mực hoặc tự viết lời chúc riêng.
   - **Tải ảnh mã QR chất lượng cao (PNG HD)**: Tự động vẽ một tấm thiệp poster sang trọng có mã QR, hoa văn vàng kim và tên người nhận để bạn gửi qua Zalo/Facebook hoặc in ra giấy.
   - **Sao chép liên kết**: Tạo link kèm thông điệp để gửi trực tiếp.

---

## 🚀 2. Cách Xem Ngay Trên Máy Tính

Bạn có thể mở trực tiếp:
- Cách 1: Click đúp vào tệp `index.html` trong thư mục `20-10` để mở trên trình duyệt bất kỳ (Chrome, Cốc Cốc, Edge).
- Cách 2: Mở qua máy chủ nội bộ tại địa chỉ: `http://localhost:8080/index.html`

---

## 📱 3. Cách Đưa Trang Web Lên Mạng Để Quét Mã QR Bằng Điện Thoại

Để người khác quét mã QR bằng Camera điện thoại hoặc Zalo từ xa, trang web cần được đưa lên internet (hoàn toàn **miễn phí 100%**). Bạn có thể chọn 1 trong các cách sau:

### Cách 1: Đưa lên GitHub Pages (Phổ biến & Ổn định nhất)
1. Đăng ký/Đăng nhập [GitHub](https://github.com/).
2. Tạo một Repository mới (ví dụ: `chuc-20-10`).
3. Tải toàn bộ các tệp trong thư mục `20-10` lên (bao gồm `index.html`, thư mục `css`, `js`, `assets`).
4. Vào mục **Settings** -> **Pages** -> Tại nhánh chọn `main` hoặc `master`, thư mục `/ (root)` rồi bấm **Save**.
5. Sau 1 phút, bạn sẽ có đường link dạng: `https://ten-ban.github.io/chuc-20-10/`.
6. Truy cập link trên điện thoại hoặc máy tính, bấm nút **"✨ Tạo Mã QR 20-10"** để tải ảnh mã QR gửi cho người ấy!

### Cách 2: Kéo thả lên Vercel / Netlify (Nhanh nhất - Chỉ mất 30 giây)
1. Truy cập [Netlify Drop](https://app.netlify.com/drop) hoặc [Vercel](https://vercel.com).
2. Kéo thả cả thư mục `20-10` vào trang web.
3. Sau 5 giây bạn nhận ngay một đường link công khai hoàn chỉnh.

---

## 💌 4. Cấu Trúc Thư Mục Dự Án

```
20-10/
├── index.html                 # Trang chủ hiển thị thiệp & hiệu ứng
├── css/
│   └── style.css              # Giao diện Glassmorphism, animations, responsive
├── js/
│   └── app.js                 # Xử lý hạt sao, pháo hoa, audio, gõ chữ, tạo poster QR
├── assets/
│   ├── bouquet.jpg            # Ảnh bó hoa hồng sang trọng
│   ├── giftbox.jpg            # Ảnh hộp quà phát sáng 3D
│   ├── rose_close.jpg         # Ảnh đóa hoa hồng nhung nghệ thuật
│   └── qrcode.min.js          # Thư viện tạo mã QR offline tốc độ cao
└── HD_HUONG_DAN_SU_DUNG.md    # Tài liệu hướng dẫn này
```

*Chúc bạn có một ngày 20-10 thật ý nghĩa và tạo nên khoảnh khắc bất ngờ khó quên cho người phụ nữ thân yêu! 🌹💕*
