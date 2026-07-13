from PIL import Image, ImageDraw
import math

# Same corrected, centered heart path used for the Android adaptive icon fix.
# Bounding box is exactly centered at (54,54) in a 108x108 viewBox.
SEGMENTS = [
    ((54, 81.2), (40.4, 67.6), (26.8, 57.4), (26.8, 43.8)),
    ((26.8, 43.8), (26.8, 33.6), (34.45, 26.8), (42.95, 29.35)),
    ((42.95, 29.35), (48.05, 31.05), (51.45, 34.45), (54, 39.55)),
    ((54, 39.55), (56.55, 34.45), (59.95, 31.05), (65.05, 29.35)),
    ((65.05, 29.35), (73.55, 26.8), (81.2, 33.6), (81.2, 43.8)),
    ((81.2, 43.8), (81.2, 57.4), (67.6, 67.6), (54, 81.2)),
]

def cubic_bezier(p0, p1, p2, p3, steps=40):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = (mt**3) * p0[0] + 3 * (mt**2) * t * p1[0] + 3 * mt * (t**2) * p2[0] + (t**3) * p3[0]
        y = (mt**3) * p0[1] + 3 * (mt**2) * t * p1[1] + 3 * mt * (t**2) * p2[1] + (t**3) * p3[1]
        pts.append((x, y))
    return pts

def heart_polygon():
    poly = []
    for p0, p1, p2, p3 in SEGMENTS:
        poly.extend(cubic_bezier(p0, p1, p2, p3))
    return poly

def hex_color(h, alpha=255):
    h = h.lstrip('#')
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (r, g, b, alpha)

def make_icon(size, path, rounded=False, padding_frac=0.0):
    scale = size / 108.0
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Background: soft blush -> rose vertical gradient
    top = hex_color('#FDF1EA')
    bottom = hex_color('#F7DED1')
    for y in range(size):
        t = y / max(1, size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    if rounded:
        mask = Image.new('L', (size, size), 0)
        mdraw = ImageDraw.Draw(mask)
        radius = int(size * 0.22)
        mdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        canvas.putalpha(mask)

    heart_pts = heart_polygon()
    scaled = [(x * scale, y * scale) for x, y in heart_pts]
    draw.polygon(scaled, fill=hex_color('#B23A55'))

    canvas.save(path, 'PNG')
    print(f'wrote {path} ({size}x{size})')

sizes = {
    'icons/icon-512.png': 512,
    'icons/icon-192.png': 192,
    'icons/apple-touch-icon-180.png': 180,
    'icons/apple-touch-icon-167.png': 167,
    'icons/apple-touch-icon-152.png': 152,
    'icons/favicon-32.png': 32,
    'icons/favicon-16.png': 16,
}

for path, size in sizes.items():
    make_icon(size, path)

print('done')
