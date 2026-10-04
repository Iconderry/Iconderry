from PIL import Image, ImageDraw
import numpy as np

def clean_icon():
    im = Image.open('public/app-icon.png').convert('RGBA')
    w, h = im.size
    arr = np.array(im, dtype=np.float32)

    Y, X = np.meshgrid(np.arange(h), np.arange(w), indexing='ij')

    # Distance from center
    cx, cy = 512.0, 512.0
    dist = np.hypot(X - cx, Y - cy)

    # In bottom-right quadrant outside the glass rhombus (dist > 330)
    in_br = (X > 480) & (Y > 480) & (dist > 330)
    # The leak pixels have high brightness (R>170, G>170, B>170)
    is_leak = in_br & (arr[:,:,0] > 160) & (arr[:,:,1] > 160) & (arr[:,:,2] > 160)

    # Top-right corner color is around (160, 25, 195)
    # Bottom-left corner color is around (145, 18, 175)
    # Reconstruct natural purple gradient
    grad_r = 150.0 - 10.0 * ((X - cx) / 512.0)
    grad_g = 22.0 - 3.0 * ((X - cx) / 512.0)
    grad_b = 185.0 - 5.0 * ((Y - cy) / 512.0)

    arr[is_leak, 0] = grad_r[is_leak]
    arr[is_leak, 1] = grad_g[is_leak]
    arr[is_leak, 2] = grad_b[is_leak]
    arr[is_leak, 3] = 255.0

    # Also clean the tiny dark fringe at the boundary of the leak
    fringe = in_br & (dist > 340) & (arr[:,:,0] < 80) & (arr[:,:,1] < 40)
    arr[fringe, 0] = 145.0
    arr[fringe, 1] = 20.0
    arr[fringe, 2] = 185.0
    arr[fringe, 3] = 255.0

    cleaned = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    # Anti-aliased squircle mask (220px radius on 1024 canvas, 4x supersampled)
    scale = 4
    mask_hi = Image.new('L', (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask_hi)
    radius_hi = int(220 * scale)
    margin_hi = int(3 * scale)
    draw.rounded_rectangle(
        [margin_hi, margin_hi, w * scale - margin_hi, h * scale - margin_hi],
        radius=radius_hi,
        fill=255
    )
    mask = mask_hi.resize((w, h), Image.Resampling.LANCZOS)
    cleaned.putalpha(mask)

    return cleaned

if __name__ == '__main__':
    result = clean_icon()
    result.save('test_clean_icon5.png')
    print('Generated test_clean_icon5.png')
