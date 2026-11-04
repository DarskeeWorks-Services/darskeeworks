"""Generate optimized, web-ready image derivatives.

Originals are never modified. Run from the repo root:

    python -I tools/optimize-images.py

Outputs:
  assets/opt/<name>-<width>.webp   responsive project images
  assets/brand/*                   logo mark, favicons, Open Graph image
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OPT = SRC / "opt"
BRAND = SRC / "brand"
OPT.mkdir(exist_ok=True)
BRAND.mkdir(exist_ok=True)

NAVY = (10, 15, 25)
NAVY_2 = (13, 24, 42)
BLUE = (20, 110, 245)
MUTED = (160, 174, 192)


def save_webp(im, path, quality=80):
    im.save(path, "WEBP", quality=quality, method=6)
    print(f"  {path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB")


def project_images():
    print("Project images")
    # PNG only: assets/website.jpg is unused and shares a stem with website.png.
    for src in sorted(SRC.glob("*.png")):
        im = Image.open(src)
        im = im.convert("RGBA" if im.mode == "RGBA" else "RGB")
        for width in (480, 960):
            if im.width < width and width != 480:
                continue
            copy = im.copy()
            copy.thumbnail((width, width * 2))
            save_webp(copy, OPT / f"{src.stem}-{width}.webp")


def founder_photo():
    print("Founder photo")
    im = Image.open(ROOT / "daril.jpg").convert("RGB")
    im.thumbnail((640, 640))
    save_webp(im, OPT / "daril-640.webp", quality=82)


def logo_mark():
    """Cut the circular DW mark out of icon.png (its background is baked in)."""
    print("Logo mark")
    icon = Image.open(ROOT / "icon.png").convert("RGBA")
    cx, cy, r = 514, 490, 262
    box = (cx - r, cy - r, cx + r, cy + r)
    crop = icon.crop(box)
    mask = Image.new("L", crop.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, crop.width - 1, crop.height - 1), fill=255)
    crop.putalpha(mask)
    for size in (64, 128, 256):
        out = crop.resize((size, size), Image.LANCZOS)
        out.save(BRAND / f"dw-mark-{size}.png", optimize=True)
        save_webp(out, BRAND / f"dw-mark-{size}.webp", quality=88)
    crop.resize((32, 32), Image.LANCZOS).save(BRAND / "favicon-32.png", optimize=True)
    touch = Image.new("RGBA", (180, 180), NAVY + (255,))
    touch.alpha_composite(crop.resize((168, 168), Image.LANCZOS), (6, 6))
    touch.convert("RGB").save(BRAND / "apple-touch-icon.png", optimize=True)
    return crop


def og_image(mark):
    print("Open Graph image")
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(im)
    draw.rectangle((0, H - 8, W, H), fill=BLUE)
    draw.rectangle((640, 0, W, H - 8), fill=NAVY_2)
    fonts = Path("C:/Windows/Fonts")
    bold = ImageFont.truetype(str(fonts / "segoeuib.ttf"), 68)
    semi = ImageFont.truetype(str(fonts / "seguisb.ttf"), 34)
    reg = ImageFont.truetype(str(fonts / "segoeui.ttf"), 28)
    draw.text((72, 150), "DarskeeWorks", font=bold, fill=(255, 255, 255))
    draw.text((72, 240), "Digital Studio & Marketplace", font=semi, fill=BLUE)
    draw.text((72, 320), "Websites · Mobile apps · Business software", font=reg, fill=MUTED)
    draw.text((72, 362), "Ready-made digital products", font=reg, fill=MUTED)
    draw.text((72, 500), "darskeeworks.online", font=semi, fill=(255, 255, 255))
    rgba = im.convert("RGBA")
    rgba.alpha_composite(mark.resize((380, 380), Image.LANCZOS), (730, 120))
    out = rgba.convert("RGB")
    out.save(BRAND / "og-image.jpg", quality=86, optimize=True)
    print(f"  assets/brand/og-image.jpg  {(BRAND / 'og-image.jpg').stat().st_size // 1024} KB")


if __name__ == "__main__":
    project_images()
    founder_photo()
    og_image(logo_mark())
