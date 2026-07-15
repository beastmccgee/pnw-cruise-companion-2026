# Extracts a per-day accent color from each day photo -> paste output into js/data.js
# Run after changing any day photo:  python generate_palettes.py
from PIL import Image
import colorsys

def accent(path):
    im = Image.open(path).convert("RGB").resize((64, 48))
    best, score = (178, 58, 85), -1.0
    for count, (r, g, b) in im.getcolors(64 * 48 * 2):
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        sc = count * (s ** 1.5) * max(0.0, 1 - abs(l - 0.45) * 1.4)
        if sc > score:
            score, best = sc, (r, g, b)
    h, l, s = colorsys.rgb_to_hls(*[c / 255 for c in best])
    l = min(max(l, 0.66), 0.78)      # bright enough to read on the midnight-rose glass
    s = min(max(s, 0.42), 0.85)
    r, g, b = [round(c * 255) for c in colorsys.hls_to_rgb(h, l, s)]
    return "#%02X%02X%02X" % (r, g, b)

ORDER = ["day1_seattle", "day2_lapush", "day3_rialto", "day4_cruiseship",
         "day5_insidepassage", "day6_juneauwhale", "day7_whitepass",
         "day8_glacierbay", "day9_ketchikan", "day10_victoria", "day11_airplane"]

print("const DAY_ACCENTS = {")
for i, name in enumerate(ORDER, 1):
    print(f'  {i}: "{accent("images/" + name + ".jpg")}",')
print("};")
