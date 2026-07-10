"""Generate app icons from public/images/brand/tab-icon-source.png (run: npm run favicon)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "brand" / "tab-icon-source.png"
OUT_APP = ROOT / "src" / "app"

CANVAS = 512
SCALE = 0.88


def build_icon() -> Image.Image:
    img = Image.open(SRC).convert("RGBA")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    square = img.crop((left, top, left + side, top + side))

    mask = Image.new("L", (side, side), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, side - 1, side - 1), fill=255)
    circle = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    circle.paste(square, (0, 0), mask)

    target = int(CANVAS * SCALE)
    resized = circle.resize((target, target), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    ox = (CANVAS - target) // 2
    oy = (CANVAS - target) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing {SRC}")

    out = build_icon()
    OUT_APP.mkdir(parents=True, exist_ok=True)

    out.resize((32, 32), Image.Resampling.LANCZOS).save(OUT_APP / "icon.png")
    out.resize((180, 180), Image.Resampling.LANCZOS).save(OUT_APP / "apple-icon.png")
    out.resize((32, 32), Image.Resampling.LANCZOS).save(
        OUT_APP / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)]
    )

    for stale in (OUT_APP / "icon.svg",):
        if stale.exists():
            stale.unlink()

    print("Icons written to src/app/ (icon.png, apple-icon.png, favicon.ico)")


if __name__ == "__main__":
    main()
