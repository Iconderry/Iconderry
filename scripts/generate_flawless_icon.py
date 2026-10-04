from PIL import Image, ImageDraw, ImageFilter
import numpy as np

def generate_flawless_icon():
    w, h = 1024, 1024
    
    # 1. 45-degree gradient background squircle
    Y, X = np.meshgrid(np.arange(h, dtype=np.float32), np.arange(w, dtype=np.float32), indexing='ij')
    t = (X + Y) / (w + h)
    
    r = np.where(t < 0.45, 26 + (76 - 26) * (t / 0.45), 76 + (168 - 76) * ((t - 0.45) / 0.55))
    g = np.where(t < 0.45, 22 + (29 - 22) * (t / 0.45), 29 + (85 - 29) * ((t - 0.45) / 0.55))
    b = np.where(t < 0.45, 72 + (149 - 72) * (t / 0.45), 149 + (247 - 149) * ((t - 0.45) / 0.55))
    
    bg_arr = np.stack([r, g, b, np.full_like(r, 255)], axis=-1).astype(np.uint8)
    bg_img = Image.fromarray(bg_arr)
    
    # 2. Extract and clean the central glass diamond badge from original_icon.png
    orig = Image.open('original_icon.png').convert('RGBA').resize((1024, 1024), Image.Resampling.LANCZOS)
    orig_arr = np.array(orig)
    
    # Mirror the pristine left corner (X: 230..320, Y: 460..560) rotated to clean the bottom corner
    # Or simply: fill the tiny 50x50 region below (512, 738) with the surrounding magenta
    # and clean glass rim
    bad_bottom = (X >= 480) & (X <= 544) & (Y >= 720) & (Y <= 780)
    dot_dist = np.hypot(X - 512, Y - 738)
    
    # In bad_bottom, outside the white dot:
    fill_magenta = bad_bottom & (dot_dist > 13) & (Y < 755)
    orig_arr[fill_magenta, 0] = 232  # R
    orig_arr[fill_magenta, 1] = 48   # G
    orig_arr[fill_magenta, 2] = 168  # B
    orig_arr[fill_magenta, 3] = 255
    
    # Below Y=755 is the glass border: semi-transparent violet rim
    fill_glass = bad_bottom & (Y >= 755) & (dot_dist < 45)
    orig_arr[fill_glass, 0] = 215
    orig_arr[fill_glass, 1] = 175
    orig_arr[fill_glass, 2] = 245
    orig_arr[fill_glass, 3] = 180
    
    # Beyond dot_dist 45, make transparent/background
    fill_bg = bad_bottom & (dot_dist >= 45)
    orig_arr[fill_bg, 3] = 0
    
    orig_clean = Image.fromarray(orig_arr)
    
    # Crisp white bottom dot
    draw_orig = ImageDraw.Draw(orig_clean)
    draw_orig.ellipse([512 - 13, 738 - 13, 512 + 13, 738 + 13], fill=(255, 255, 255, 255))
    
    # Create rotated rounded rectangle mask for the diamond badge
    scale = 4
    mask_diamond_hi = Image.new('L', (w * scale, h * scale), 0)
    
    cx_s, cy_s = 512 * scale, 512 * scale
    side_s = int(480 * scale)
    rad_s = int(140 * scale)
    
    temp_rect = Image.new('L', (side_s, side_s), 0)
    temp_draw = ImageDraw.Draw(temp_rect)
    temp_draw.rounded_rectangle([0, 0, side_s, side_s], radius=rad_s, fill=255)
    
    temp_rot = temp_rect.rotate(45, resample=Image.Resampling.BICUBIC, expand=True)
    rw, rh = temp_rot.size
    mask_diamond_hi.paste(temp_rot, (cx_s - rw // 2, cy_s - rh // 2))
    
    badge_mask = mask_diamond_hi.resize((w, h), Image.Resampling.LANCZOS)
    
    # Paste badge onto background
    composite = bg_img.copy()
    composite.paste(orig_clean, (0, 0), badge_mask)
    
    # 3. Apply 4x supersampled golden squircle mask (corner radius 224px)
    mask_hi = Image.new('L', (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask_hi)
    radius_hi = int(224 * scale)
    margin_hi = int(3 * scale)
    draw.rounded_rectangle(
        [margin_hi, margin_hi, w * scale - margin_hi, h * scale - margin_hi],
        radius=radius_hi,
        fill=255
    )
    final_mask = mask_hi.resize((w, h), Image.Resampling.LANCZOS)
    composite.putalpha(final_mask)
    
    return composite

if __name__ == '__main__':
    icon = generate_flawless_icon()
    icon.save('flawless_icon_final.png')
    print('Generated flawless_icon_final.png successfully')
