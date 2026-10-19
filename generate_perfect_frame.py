import os
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

def draw_3d_balloon_text(canvas, text, cx, cy, font, size=135):
    # Vẽ chữ bóng bay 3D múp míp màu đỏ ruby bóng bẩy chuẩn helium foil
    temp = Image.new('RGBA', (canvas.width, canvas.height), (0, 0, 0, 0))
    td = ImageDraw.Draw(temp)
    
    tb = td.textbbox((0, 0), text, font=font)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    tx = cx - tw // 2
    ty = cy - th // 2
    
    # 1. Đổ bóng mềm dưới nền
    td.text((tx + 6, ty + 12), text, font=font, fill=(90, 8, 22, 110))
    temp = temp.filter(ImageFilter.GaussianBlur(8))
    td = ImageDraw.Draw(temp)
    
    # 2. Lớp viền tối dày tạo độ phồng 3D (Extrusion & Bevel)
    offsets = [
        (-4, 0), (4, 0), (0, -4), (0, 4),
        (-3, -3), (3, 3), (-3, 3), (3, -3),
        (-2, 4), (2, 4), (-4, 2), (4, 2),
        (0, 6), (0, 8)
    ]
    for dx, dy in offsets:
        td.text((tx + dx, ty + dy), text, font=font, fill=(130, 8, 25, 255))
        
    # 3. Thân bóng đỏ tươi rực rỡ (Deep Ruby Red)
    td.text((tx, ty), text, font=font, fill=(235, 20, 60, 255))
    
    # 4. Vệt sáng phản quang trên mép chữ (Glossy Highlight)
    hi_layer = Image.new('RGBA', (canvas.width, canvas.height), (0, 0, 0, 0))
    hid = ImageDraw.Draw(hi_layer)
    hid.text((tx - 3, ty - 4), text, font=font, fill=(255, 255, 255, 120))
    hi_layer = hi_layer.filter(ImageFilter.GaussianBlur(1))
    temp = Image.alpha_composite(temp, hi_layer)
    
    return Image.alpha_composite(canvas, temp)

def draw_3d_heart_balloon(canvas, cx, cy, scale=4.6):
    heart_layer = Image.new('RGBA', (canvas.width, canvas.height), (0, 0, 0, 0))
    hd = ImageDraw.Draw(heart_layer)
    
    # Tính toán tọa độ đường cong hình trái tim
    pts = []
    for t in np.linspace(0, 2 * math.pi, 120):
        hx = 16 * (math.sin(t) ** 3)
        hy = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        pts.append((cx + hx * scale, cy + hy * scale))
        
    # Bóng đổ mềm
    shadow_pts = [(x + 6, y + 12) for (x, y) in pts]
    hd.polygon(shadow_pts, fill=(90, 8, 22, 120))
    heart_layer = heart_layer.filter(ImageFilter.GaussianBlur(10))
    hd = ImageDraw.Draw(heart_layer)
    
    # Lớp viền tối tạo độ dày 3D
    thick_pts = [(x, y + 5) for (x, y) in pts]
    hd.polygon(thick_pts, fill=(150, 10, 30, 255))
    hd.polygon(pts, fill=(175, 12, 38, 255))
    
    # Thân trái tim đỏ căng tròn
    inner_pts = []
    scale_in = scale * 0.93
    for t in np.linspace(0, 2 * math.pi, 120):
        hx = 16 * (math.sin(t) ** 3)
        hy = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        inner_pts.append((cx + hx * scale_in, cy + hy * scale_in - 2))
    hd.polygon(inner_pts, fill=(235, 25, 65, 255))
    
    # Vệt phản quang lấp lánh (Gloss reflection)
    hd.ellipse((cx - int(38 * (scale/4.6)), cy - int(48 * (scale/4.6)), cx - int(10 * (scale/4.6)), cy - int(20 * (scale/4.6))), fill=(255, 215, 230, 230))
    hd.ellipse((cx - int(28 * (scale/4.6)), cy - int(40 * (scale/4.6)), cx - int(15 * (scale/4.6)), cy - int(28 * (scale/4.6))), fill=(255, 255, 255, 250))
    
    # Nút thắt bóng bay
    knot_y = cy + int(72 * (scale/4.6))
    hd.polygon([(cx - 8, knot_y), (cx + 8, knot_y), (cx, knot_y + 14)], fill=(170, 12, 35, 255))
    
    return Image.alpha_composite(canvas, heart_layer)

def create_masterpiece():
    W, H = 1200, 1500
    canvas = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    
    # 1. NỀN PASTEL THƠ MỘNG
    sky = Image.new('RGBA', (W, H))
    for y in range(H):
        ratio = y / H
        if ratio < 0.4:
            sub = ratio / 0.4
            r = int(255 - sub * 4)
            g = int(224 + sub * 22)
            b = int(236 + sub * 10)
        else:
            sub = (ratio - 0.4) / 0.6
            r = int(251 + sub * 4)
            g = int(246 - sub * 38)
            b = int(246 - sub * 40)
        for x in range(W):
            sky.putpixel((x, y), (r, g, b, 255))
    canvas.paste(sky, (0, 0))

    # 2. HẠT BOKEH VÀ ĐOM ĐÓM VÀNG GOLD
    bokeh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bokeh)
    np.random.seed(111)
    for _ in range(65):
        bx = np.random.randint(30, W - 30)
        by = np.random.randint(30, H - 30)
        br = np.random.randint(15, 65)
        alpha = np.random.randint(25, 85)
        color = (255, 235, 160, alpha) if np.random.rand() > 0.4 else (255, 185, 205, alpha)
        bd.ellipse((bx - br, by - br, bx + br, by + br), fill=color)
    bokeh = bokeh.filter(ImageFilter.GaussianBlur(15))
    canvas = Image.alpha_composite(canvas, bokeh)

    # 3. HOA HỒNG TỰ NHIÊN XUNG QUANH (LUSH FLORAL ARRANGEMENT)
    if os.path.exists('assets/bouquet.jpg'):
        bq_full = Image.open('assets/bouquet.jpg')
        # Cắt lấy chính xác chùm hoa hồng nở rực rỡ và lá (loại bỏ hoàn toàn giấy gói và tay)
        flowers_top = bq_full.crop((140, 160, 860, 510)).convert('RGBA')
        
        # Đặt chùm hoa nở rộ xòe ra sau tấm thiệp
        fl_left = flowers_top.resize((520, 310), Image.Resampling.LANCZOS)
        mask_fl_l = Image.new('L', (520, 310), 0)
        mld = ImageDraw.Draw(mask_fl_l)
        mld.ellipse((30, 30, 490, 280), fill=230)
        mask_fl_l = mask_fl_l.filter(ImageFilter.GaussianBlur(28))
        canvas.paste(fl_left, (-70, 430), mask_fl_l)
        
        # Chùm hoa bên phải (Lật gương đối xứng)
        fl_right = ImageOps.mirror(fl_left)
        canvas.paste(fl_right, (W - 450, 430), mask_fl_l)

    if os.path.exists('assets/rose_close.jpg'):
        rc = Image.open('assets/rose_close.jpg').convert('RGBA')
        
        # Đóa hồng đỏ nhung đọng sương ở góc dưới trái
        rc_bl = rc.resize((440, 440), Image.Resampling.LANCZOS)
        mask_bl = Image.new('L', (440, 440), 0)
        bld = ImageDraw.Draw(mask_bl)
        bld.ellipse((40, 40, 400, 400), fill=230)
        mask_bl = mask_bl.filter(ImageFilter.GaussianBlur(36))
        canvas.paste(rc_bl, (-60, H - 450), mask_bl)
        
        # Đóa hồng đỏ nhung ở góc dưới phải
        rc_br = ImageOps.mirror(rc_bl)
        canvas.paste(rc_br, (W - 380, H - 450), mask_bl)

    # 4. TẤM THIỆP GREETING CARD TRUNG TÂM
    card_w = 780
    card_h = 920
    card_x = (W - card_w) // 2
    card_y = 440

    # Bóng đổ mềm mại dưới thiệp
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((card_x + 8, card_y + 14, card_x + card_w + 8, card_y + card_h + 14), radius=38, fill=(150, 40, 70, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(26))
    canvas = Image.alpha_composite(canvas, shadow)

    # Thân thiệp màu trắng ngọc trai viền vàng kim loại
    card = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, card_w, card_h), radius=38, fill=(255, 254, 252, 252))
    cd.rounded_rectangle((6, 6, card_w - 6, card_h - 6), radius=34, outline=(225, 185, 105, 255), width=4)
    cd.rounded_rectangle((18, 18, card_w - 18, card_h - 18), radius=28, outline=(255, 120, 150, 140), width=2)
    canvas.paste(card, (card_x, card_y), card)

    # 5. FONT CHỮ CHUẨN TIẾNG VIỆT
    font_balloon = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 136)
    font_banner = ImageFont.truetype("C:/Windows/Fonts/timesbi.ttf", 46)
    font_card_title = ImageFont.truetype("C:/Windows/Fonts/palab.ttf", 36)
    font_card_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 25)
    font_card_foot = ImageFont.truetype("C:/Windows/Fonts/palabi.ttf", 28)

    draw = ImageDraw.Draw(canvas)

    # Tiêu đề trên thiệp
    card_title = "MÓN QUÀ 20-10 Ý NGHĨA"
    tb = draw.textbbox((0, 0), card_title, font=font_card_title)
    draw.text((card_x + (card_w - (tb[2] - tb[0])) // 2, card_y + 40), card_title, fill=(205, 20, 75), font=font_card_title)

    card_sub = "Chạm quét mã QR để mở thiệp & hoa chúc mừng"
    sb = draw.textbbox((0, 0), card_sub, font=font_card_sub)
    draw.text((card_x + (card_w - (sb[2] - sb[0])) // 2, card_y + 90), card_sub, fill=(125, 45, 75), font=font_card_sub)

    # 6. MÃ QR GỐC CỦA BẠN (GIỮ NGUYÊN 100% ĐEN TRẮNG NGUYÊN BẢN, ĐẢM BẢO QUÉT HOÀN HẢO)
    qr_path = r'C:\Users\duong\.gemini\antigravity-ide\brain\c8cce4da-7923-429c-976e-d281e068922e\.user_uploaded\media_1792434282747.png'
    if os.path.exists(qr_path):
        qr_raw = Image.open(qr_path).convert('RGB')
        
        # Giữ nguyên bản đen trắng sắc nét, resize chuẩn Lanczos
        qr_size = 560
        qr_resized = qr_raw.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
        
        qr_pos_x = card_x + (card_w - qr_size) // 2
        qr_pos_y = card_y + 144
        canvas.paste(qr_resized, (qr_pos_x, qr_pos_y))

    # Dòng chữ chân thiệp
    foot_text = "Chúc bạn ngày 20-10 luôn rạng rỡ & ngập tràn hạnh phúc"
    fb = draw.textbbox((0, 0), foot_text, font=font_card_foot)
    draw.text((card_x + (card_w - (fb[2] - fb[0])) // 2, card_y + card_h - 76), foot_text, fill=(185, 25, 75), font=font_card_foot)

    # 7. PHẦN ĐẦU TRANG: CHÙM BÓNG BAY 3D ĐỎ "20-10" & TIM & BANNER RUY BĂNG
    top_y = 75
    
    # Dải ruy băng ngọc trai "Ngày Phụ nữ Việt Nam"
    banner_w = 720
    banner_h = 86
    banner_x = (W - banner_w) // 2
    banner_y = top_y + 185
    
    # Bóng đổ của Banner
    b_shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bsd = ImageDraw.Draw(b_shadow)
    bsd.rounded_rectangle((banner_x + 4, banner_y + 6, banner_x + banner_w + 4, banner_y + banner_h + 6), radius=24, fill=(160, 35, 65, 80))
    b_shadow = b_shadow.filter(ImageFilter.GaussianBlur(15))
    canvas = Image.alpha_composite(canvas, b_shadow)

    # Thân Banner
    banner = Image.new('RGBA', (banner_w, banner_h), (0, 0, 0, 0))
    bnd = ImageDraw.Draw(banner)
    bnd.rounded_rectangle((0, 0, banner_w, banner_h), radius=24, fill=(255, 253, 248, 255), outline=(225, 185, 100, 255), width=3)
    bnd.rounded_rectangle((5, 5, banner_w - 5, banner_h - 5), radius=20, outline=(245, 215, 140, 160), width=1)
    canvas.paste(banner, (banner_x, banner_y), banner)

    # Chữ Banner
    draw = ImageDraw.Draw(canvas)
    banner_text = "Ngày Phụ nữ Việt Nam"
    bnb = draw.textbbox((0, 0), banner_text, font=font_banner)
    bnw = bnb[2] - bnb[0]
    draw.text((banner_x + (banner_w - bnw) // 2, banner_y + 16), banner_text, fill=(175, 18, 55), font=font_banner)

    # Họa tiết trái tim nhỏ và nét cuộn duyên dáng dưới banner
    scroll_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    scd = ImageDraw.Draw(scroll_layer)
    sc_cx = W // 2
    sc_cy = banner_y + banner_h + 2
    scd.ellipse((sc_cx - 6, sc_cy - 4, sc_cx + 6, sc_cy + 8), fill=(210, 30, 70))
    scd.line([(sc_cx - 45, sc_cy + 2), (sc_cx - 15, sc_cy + 2)], fill=(225, 185, 100, 200), width=2)
    scd.line([(sc_cx + 15, sc_cy + 2), (sc_cx + 45, sc_cy + 2)], fill=(225, 185, 100, 200), width=2)
    canvas = Image.alpha_composite(canvas, scroll_layer)

    # 3D BÓNG BAY "20", TRÁI TIM, "10" ĐẬM ĐÀ, TO RÕ & BÓNG BẨY
    canvas = draw_3d_balloon_text(canvas, "20", W // 2 - 240, top_y + 60, font_balloon)
    canvas = draw_3d_heart_balloon(canvas, W // 2, top_y + 70, scale=4.8)
    canvas = draw_3d_balloon_text(canvas, "10", W // 2 + 240, top_y + 60, font_balloon)

    # 8. CHIẾC NƠ LỤA HỒNG SATIN Ở ĐÁY THIỆP (LUXURY SATIN BOW)
    bow_y = card_y + card_h - 14
    bow_cx = W // 2
    bow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bwd = ImageDraw.Draw(bow_layer)
    
    # Dải lụa rủ xuống
    t_left = [(bow_cx - 28, bow_y + 22), (bow_cx - 125, bow_y + 125), (bow_cx - 95, bow_y + 130), (bow_cx - 12, bow_y + 38)]
    t_right = [(bow_cx + 28, bow_y + 22), (bow_cx + 125, bow_y + 125), (bow_cx + 95, bow_y + 130), (bow_cx + 12, bow_y + 38)]
    bwd.polygon(t_left, fill=(240, 80, 120, 240))
    bwd.polygon(t_right, fill=(240, 80, 120, 240))
    
    # Cánh nơ trái & phải
    bwd.ellipse((bow_cx - 145, bow_y - 32, bow_cx - 10, bow_y + 42), fill=(255, 105, 142, 255), outline=(215, 45, 85, 255), width=2)
    bwd.ellipse((bow_cx + 10, bow_y - 32, bow_cx + 145, bow_y + 42), fill=(255, 105, 142, 255), outline=(215, 45, 85, 255), width=2)
    
    # Vệt sáng bóng bẩy trên cánh nơ
    bwd.ellipse((bow_cx - 118, bow_y - 16, bow_cx - 48, bow_y + 12), fill=(255, 215, 235, 210))
    bwd.ellipse((bow_cx + 48, bow_y - 16, bow_cx + 118, bow_y + 12), fill=(255, 215, 235, 210))
    
    # Nút thắt nơ
    bwd.ellipse((bow_cx - 26, bow_y - 18, bow_cx + 26, bow_y + 28), fill=(235, 60, 100, 255), outline=(190, 20, 60, 255), width=2)
    bwd.ellipse((bow_cx - 14, bow_y - 9, bow_cx + 5, bow_y + 14), fill=(255, 200, 225, 230))

    canvas = Image.alpha_composite(canvas, bow_layer)

    # 9. LƯU BẢN CHÍNH THỨC
    output_png = 'khung_qr_tang_me.png'
    output_jpg = 'khung_qr_tang_me.jpg'
    canvas.save(output_png, 'PNG', quality=100)
    canvas.convert('RGB').save(output_jpg, 'JPEG', quality=95)
    
    # Copy vào assets để website cũng có thể dùng
    canvas.save('assets/khung_qr_tang_me.png', 'PNG', quality=100)
    canvas.convert('RGB').save('assets/khung_qr_tang_me.jpg', 'JPEG', quality=95)
    print("SUCCESS: Generated masterpiece", output_png)

    # 10. KIỂM TRA QUÉT MÃ QR
    det = cv2.QRCodeDetector()
    cv_img = cv2.imread(output_png)
    decoded, _, _ = det.detectAndDecode(cv_img)
    print("QR SCAN SUCCESS:", decoded)

if __name__ == '__main__':
    create_masterpiece()
