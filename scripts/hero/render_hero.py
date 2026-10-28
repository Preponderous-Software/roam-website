"""Render the home page's 2D / 3D hero: one Roam world, drawn by Roam's own 2D room
renderer and, from roam-usd's export of it, by Strata in 3D.

    python scripts/hero/render_hero.py --roam ROAM --stage out/seed_1.usda --save out/seed_1_save -o out/hero

Make the world first with roam-usd (https://github.com/Preponderous-Software/roam-usd)::

    SDL_VIDEODRIVER=dummy SDL_AUDIODRIVER=dummy \\
      roam-usd generate --roam ROAM --seed 1 --radius 1 --cave-depth 0 --keep-saves -o out/

- **2D** (``2d.png``): the saved rooms are loaded with Roam's own ``RoomJsonReaderWriter``
  and drawn with Roam's own ``Room.drawWithOffset`` through its ``PygameRenderer``, under
  SDL's dummy video driver. It is the game's room renderer, without the HUD or the
  player.
- **3D** (``3d-NNNN.png``): roam-usd's stage is read with ``usd-core``. Every tile and
  structure becomes a Strata cube with its prototype's extent and display colour, each
  room's ground a thin slab, and each creature an upright card textured with Roam's own
  sprite. Strata's sun runs one Roam-style day (sunrise, noon, dusk, night lit by the
  home's torches, dawn), and the frames are written as PNGs to encode into a loop.

Needs Linux x86-64, ``libEGL.so.1`` with a Mesa driver (``LIBGL_ALWAYS_SOFTWARE=1
GALLIUM_DRIVER=llvmpipe`` without a GPU), Roam's Python requirements (pygame), usd-core,
NumPy, Pillow and Strata's official Python binding at the v0.6.0 tag::

    pip install usd-core numpy pillow "pygame>=2.6.1" structlog jsonschema \\
      "strata-engine @ git+https://github.com/Preponderous-Software/strata@v0.6.0#subdirectory=bindings/python"
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from pathlib import Path

STRATA_VERSION = "0.6.0"
STRATA_SHA256 = "3815068f90afa67b42177359a7ea918a5de321d7f7bad8706fa5275c4906af2a"  # libstrata-0.6.0-linux-x64.so, from the release's SHA256SUMS
GRID = 17
NIGHT = (0.04, 0.06, 0.14)


# ------------------------------------------------------------------------- 2D


def render_2d(roam: Path, save: Path, out: Path, cell: int) -> None:
    """Roam's own room renderer, over every surface room in the save."""
    os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
    os.environ.setdefault("SDL_AUDIODRIVER", "dummy")
    sys.path.insert(0, str(roam / "src"))
    out = out.resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    here = os.getcwd()
    os.chdir(roam)  # Roam opens its schemas and sprites relative to the checkout
    try:
        import pygame
        from lib.graphik.src.graphik import Graphik
        from rendering.pygameRenderer import PygameRenderer
        from world.roomJsonReaderWriter import RoomJsonReaderWriter

        class Ticks:
            def getTick(self):  # noqa: N802 - Roam's method name
                return 0

        class Config:
            pathToSaveDirectory = str(save)
            gridSize = GRID

            def getRoomsDirectory(self):  # noqa: N802
                return str(save / "rooms")

        rooms = []
        for f in sorted((save / "rooms").glob("room_*.json")):
            x, y, *z = (int(v) for v in f.stem.split("_")[1:])
            if (z[0] if z else 0) == 0:
                rooms.append((x, y, f))
        xs, ys = [r[0] for r in rooms], [r[1] for r in rooms]
        w, h = (max(xs) - min(xs) + 1) * GRID * cell, (max(ys) - min(ys) + 1) * GRID * cell
        pygame.init()
        display = pygame.display.set_mode((w, h))
        renderer = PygameRenderer(Graphik(display))
        reader = RoomJsonReaderWriter(GRID, renderer, Ticks(), Config())
        for x, y, f in rooms:
            room = reader.loadRoom(str(f))
            room.drawWithOffset(cell, cell, (x - min(xs)) * GRID * cell, (y - min(ys)) * GRID * cell)
        pygame.image.save(display, str(out))
        pygame.quit()
    finally:
        os.chdir(here)


# ------------------------------------------------------------------------- 3D


def to_strata(p):
    """USD is Z-up; Strata is Y-up (x, z, -y)."""
    return (float(p[0]), float(p[2]), float(-p[1]))


def read_stage(path: Path):
    from pxr import Gf, Usd, UsdGeom

    stage = Usd.Stage.Open(str(path))
    xf = UsdGeom.XformCache()
    boxes, cards, torches = [], [], []

    def proto_box(prim):
        ext = UsdGeom.Boundable(prim).GetExtentAttr().Get()
        col = UsdGeom.Gprim(prim).GetDisplayColorAttr().Get()
        return (Gf.Vec3d(*ext[0]), Gf.Vec3d(*ext[1])), (tuple(col[0]) if col else (1.0, 0.0, 1.0))

    def add_box(m, ext, col, name):
        lo, hi = ext
        c = m.Transform((lo + hi) / 2)
        size = hi - lo
        boxes.append((to_strata(c), (float(size[0]), float(max(size[2], 0.02)), float(size[1])), col))
        if name == "Torch":
            torches.append(to_strata(m.Transform(Gf.Vec3d((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, hi[2]))))

    for prim in stage.Traverse():
        name = prim.GetName()
        path_s = str(prim.GetPath())
        if path_s.startswith("/World/Prototypes") or path_s.startswith("/World/Looks"):
            continue
        if prim.IsA(UsdGeom.PointInstancer):
            pi = UsdGeom.PointInstancer(prim)
            targets = pi.GetPrototypesRel().GetTargets()
            protos = [proto_box(stage.GetPrimAtPath(t)) + (stage.GetPrimAtPath(t).GetName(),) for t in targets]
            world = xf.GetLocalToWorldTransform(prim)
            mats = pi.ComputeInstanceTransformsAtTime(Usd.TimeCode.Default(), Usd.TimeCode.Default())
            for i, m in zip(pi.GetProtoIndicesAttr().Get(), mats):
                ext, col, pname = protos[i]
                add_box(m * world, ext, col, pname)
            continue
        if path_s.count("/Prototypes/"):
            continue  # instancer prototypes, drawn through the instancer
        if name == "Ground" and prim.IsA(UsdGeom.Mesh):
            ext, col = proto_box(prim)
            lo, hi = ext
            lo, hi = Gf.Vec3d(lo[0], lo[1], -0.2), Gf.Vec3d(hi[0], hi[1], 0.0)
            add_box(xf.GetLocalToWorldTransform(prim), (lo, hi), col, "Ground")
            continue
        roam = prim.GetCustomDataByKey("roam") or {}
        if prim.GetParent().GetName() == "Creatures" and roam.get("imagePath"):
            m = xf.GetLocalToWorldTransform(prim)
            cards.append((to_strata(m.ExtractTranslation()), roam["imagePath"]))
            continue
        if prim.GetParent().GetName() == "Structures" and prim.IsA(UsdGeom.Boundable):
            ext, col = proto_box(prim)
            add_box(xf.GetLocalToWorldTransform(prim), ext, col, prim.GetCustomDataByKey("roam").get("entityClass"))
    return boxes, cards, torches


def card_mesh(center, yaw, size=0.9):
    """An upright quad facing the camera's azimuth, standing on the ground."""
    cx, cy, cz = center
    dx, dz = math.cos(yaw) * size / 2, -math.sin(yaw) * size / 2
    y0, y1 = cy, cy + size
    pos = [cx - dx, y0, cz - dz, cx + dx, y0, cz + dz, cx + dx, y1, cz + dz, cx - dx, y1, cz - dz]
    nx, nz = math.sin(yaw), math.cos(yaw)
    return pos, [nx, 0, nz] * 4, [0, 1, 1, 1, 1, 0, 0, 0], [0, 1, 2, 0, 2, 3]


def render_3d(roam: Path, stage: Path, out_dir: Path, size, frames: int) -> dict:
    import numpy as np
    from PIL import Image

    import strata as S

    boxes, cards, torches = read_stage(stage)
    lib = S.load_release(STRATA_VERSION, sha256=STRATA_SHA256)
    w, h = size
    xs = [b[0][0] for b in boxes]
    zs = [b[0][2] for b in boxes]
    cx, cz = (min(xs) + max(xs)) / 2, (min(zs) + max(zs)) / 2
    span = max(max(xs) - min(xs), max(zs) - min(zs))
    az = math.radians(28.0)  # camera from the south, a little east
    eye = (cx + math.sin(az) * span * 0.86, span * 0.78, cz + math.cos(az) * span * 0.86)
    items = [S.RenderItem(S.PRIMITIVE_CUBE, c, s, (*col, 1.0)) for c, s, col in boxes]
    out_dir.mkdir(parents=True, exist_ok=True)
    with S.Engine(lib, w, h) as eng:
        light = lib.lighting_defaults(S.LIGHTING_SUN)
        light.cascade_count, light.shadow_map_size, light.shadow_distance, light.fog = 4, 2048, span * 2.2, 0
        eng.set_lighting(light)
        eng.set_camera(lib.look_at(eye, (cx, 0.0, cz - 1.5), (0.0, 1.0, 0.0), 42.0, w / h, 0.5, span * 6))
        textures = {}
        for pos, image in cards:
            if image not in textures:
                img = Image.open(roam / image).convert("RGBA")
                textures[image] = eng.create_texture_rgba8(img.width, img.height, img.tobytes(), S.TEXTURE_NEAREST)
            p, n, uv, idx = card_mesh(pos, az)
            eng.add_mesh(p, idx, normals=n, uvs=uv, texture=textures[image], flags=S.MESH_TRANSLUCENT)
        for f in range(frames):
            t = f / frames  # 0 sunrise, 0.25 noon, 0.5 sunset, 0.75 midnight, as in Roam and Minecraft
            a = t * 2 * math.pi
            sun = (math.cos(a) * 0.9, math.sin(a), -0.35)
            night = float(np.clip((0.12 - sun[1]) / 0.3, 0.0, 1.0))
            eng.set_sun_direction(sun if sun[1] > 0.02 else (sun[0], 0.02, -0.35))
            eng.set_point_lights([S.PointLight(p, 7.0, (1.0, 0.72, 0.36), 3.0 * night, 0) for p in torches[:32]])
            day = (0.55, 0.74, 0.93) if sun[1] > 0.25 else tuple(a2 + (b2 - a2) * max(0.0, sun[1]) / 0.25 for a2, b2 in zip((0.93, 0.62, 0.42), (0.55, 0.74, 0.93)))
            sky = tuple(d + (n2 - d) * night for d, n2 in zip(day, NIGHT))
            for _ in range(2 if f == 0 else 1):
                eng.begin_frame(clear_color=(*sky, 1.0))
                eng.submit_primitives(items)
                eng.end_frame()
            rgba, fw, fh = eng.read_pixels()
            img = Image.frombytes("RGBA", (fw, fh), rgba).convert("RGB")
            if night > 0:
                img = Image.blend(img, Image.new("RGB", img.size, (6, 10, 26)), 0.45 * night * (1.0 - 0.0))
            img.save(out_dir / f"3d-{f:04d}.png")
        gpu = eng.gpu_description()
    return {"boxes": len(boxes), "cards": len(cards), "torches": len(torches), "gpu": gpu, "strata": STRATA_VERSION}


def publish(out: Path, public: Path) -> None:
    """The site's files: the 2D still (exactly half size, crisp), and the 3D still
    (noon) and loop (every other frame, one shared palette)."""
    from PIL import Image

    frames = sorted(out.glob("3d-*.png"))
    side = 420
    (public / "hero").mkdir(parents=True, exist_ok=True)
    flat = Image.open(out / "2d.png").convert("RGB")
    flat.resize((flat.width // 2, flat.height // 2), Image.NEAREST).save(public / "hero" / "roam-2d.png", optimize=True)
    noon = Image.open(frames[len(frames) // 4]).convert("RGB")
    # The still is larger than the loop: it is the image the page is measured by, and a
    # browser counts the loop laid over it as no larger, so the loop is never a later LCP.
    noon.resize((640, 640), Image.LANCZOS).save(public / "hero" / "roam-3d.jpg", quality=80, optimize=True, progressive=True)
    loop = [Image.open(f).convert("RGB").resize((side, side), Image.LANCZOS) for f in frames[::2]]
    sheet = Image.new("RGB", (side, side * len(loop[::2])))
    for k, im in enumerate(loop[::2]):
        sheet.paste(im, (0, k * side))
    palette = sheet.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    q = [im.quantize(palette=palette, dither=Image.Dither.NONE) for im in loop]
    q[0].save(public / "hero" / "roam-3d.gif", save_all=True, append_images=q[1:], duration=166, loop=0, optimize=True)


# ----------------------------------------------------------------------- card

CARD_W, CARD_H = 1200, 630
CARD_PANEL = 470  # height of the two picture halves; the title band takes the rest
CARD_CELL = 13  # 2D pixels per tile on the card: 46 x 36 of the world's 51 x 51 tiles show
CARD_3D_TOP = 70  # rows cut off the top of the 600 x 600 noon frame, to centre the home
CARD_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
CARD_FONT_BOOK = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
CARD_ALT = (
    "The same Roam world twice, side by side: on the left in 2D, top-down pixel art of forest, "
    "meadow and a small fenced home as the game draws it; on the right in 3D, the same forest, "
    "meadow and home as blocks. Below them: the title Roam, the tagline \u201cOne world, in 2D "
    "and 3D\u201d, the address roam.preponderous.org, and \u201c3D rendered with Strata 0.6.0\u201d."
)


def _chip(draw, xy, text, font, anchor_right=False):
    """A small rounded label on a dark, translucent plate."""
    x, y = xy
    l, t, r, b = draw.textbbox((0, 0), text, font=font)
    pad_x, pad_y = 12, 7
    w, h = r - l + 2 * pad_x, b - t + 2 * pad_y
    if anchor_right:
        x -= w
    draw.rounded_rectangle((x, y, x + w, y + h), radius=8, fill=(12, 16, 14, 205))
    draw.text((x + pad_x - l, y + pad_y - t), text, font=font, fill=(240, 244, 240, 255))


def make_card(out: Path, public: Path) -> Path:
    """The link-preview card: the diptych cut to 1200 x 630.

    Two 600 x ``CARD_PANEL`` halves over a title band. Left, Roam's own 2D render at
    ``CARD_CELL`` pixels a tile (``2d-card.png``), cropped around the world's centre and
    never resampled, so the pixel art stays crisp. Right, the hero's noon Strata frame
    scaled to 600 wide and cropped so the home sits mid-panel, as it does on the left.
    Chips name each half, and the band credits Strata.
    """
    import hashlib

    from PIL import Image, ImageDraw, ImageFont

    half = CARD_W // 2
    flat = Image.open(out / "2d-card.png").convert("RGB")
    fx, fy = (flat.width - half) // 2, (flat.height - CARD_PANEL) // 2
    left = flat.crop((fx, fy, fx + half, fy + CARD_PANEL))
    frames = sorted(out.glob("3d-*.png"))
    noon = Image.open(frames[len(frames) // 4]).convert("RGB").resize((half, half), Image.LANCZOS)
    right = noon.crop((0, CARD_3D_TOP, half, CARD_3D_TOP + CARD_PANEL))

    card = Image.new("RGBA", (CARD_W, CARD_H), (15, 21, 18, 255))
    card.paste(left, (0, 0))
    card.paste(right, (half, 0))
    d = ImageDraw.Draw(card)
    d.rectangle((half - 2, 0, half + 1, CARD_PANEL), fill=(15, 21, 18, 255))  # the seam
    d.rectangle((0, CARD_PANEL, CARD_W, CARD_PANEL + 3), fill=(59, 154, 90, 255))  # Roam green rule

    chip = ImageFont.truetype(CARD_FONT, 22)
    _chip(d, (20, 20), "2D", chip)
    _chip(d, (half + 20, 20), "3D", chip)
    mid = CARD_PANEL + (CARD_H - CARD_PANEL) // 2 + 2
    title = ImageFont.truetype(CARD_FONT, 84)
    d.text((48, mid), "Roam", font=title, fill=(255, 255, 255, 255), anchor="lm")
    tx = 48 + d.textlength("Roam", font=title) + 40
    d.text((tx, mid - 6), "One world, in 2D and 3D", font=ImageFont.truetype(CARD_FONT_BOOK, 32), fill=(226, 232, 226, 255), anchor="ls")
    d.text((tx, mid + 8), "roam.preponderous.org", font=ImageFont.truetype(CARD_FONT, 26), fill=(130, 214, 150, 255), anchor="lt")
    credit = ImageFont.truetype(CARD_FONT_BOOK, 21)
    d.text((CARD_W - 48, mid - 6), "3D rendered with", font=credit, fill=(170, 180, 172, 255), anchor="rs")
    d.text((CARD_W - 48, mid + 8), f"Strata {STRATA_VERSION}", font=ImageFont.truetype(CARD_FONT, 26), fill=(240, 244, 240, 255), anchor="rt")

    dest = public / "og-roam-2d-3d.png"
    card.convert("RGB").save(dest, optimize=True)
    spec = {
        "comment": "The link-preview card; made by scripts/hero/render_hero.py --card. Components/Seo.tsx's OG_IMAGE_ALT must equal alt.",
        "png": "public/og-roam-2d-3d.png",
        "width": CARD_W,
        "height": CARD_H,
        "alt": CARD_ALT,
        "sha256": hashlib.sha256(dest.read_bytes()).hexdigest(),
    }
    (Path(__file__).resolve().parent / "og-card.json").write_text(json.dumps(spec, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return dest


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--roam", required=True, type=Path, help="a Roam checkout (sprites and room code)")
    ap.add_argument("--stage", required=True, type=Path, help="roam-usd's stage, e.g. out/seed_1.usda")
    ap.add_argument("--save", required=True, type=Path, help="the kept save of the same world (--keep-saves)")
    ap.add_argument("-o", "--out", required=True, type=Path)
    ap.add_argument("--cell", type=int, default=16, help="2D pixels per tile")
    ap.add_argument("--size", nargs=2, type=int, default=[816, 816], help="3D frame size")
    ap.add_argument("--frames", type=int, default=72)
    ap.add_argument("--public", type=Path, help="also write the site's files into this public/ directory")
    ap.add_argument("--card", action="store_true", help="also write the 1200 x 630 link-preview card (needs --public)")
    args = ap.parse_args(argv)
    if args.card and not args.public:
        ap.error("--card needs --public")
    render_2d(args.roam.resolve(), args.save.resolve(), args.out / "2d.png", args.cell)
    if args.card:
        render_2d(args.roam.resolve(), args.save.resolve(), args.out / "2d-card.png", CARD_CELL)
    stats = render_3d(args.roam.resolve(), args.stage, args.out, args.size, args.frames)
    stats["manifest"] = json.loads((args.save / "roam-usd-manifest.json").read_text(encoding="utf-8"))
    if args.public:
        publish(args.out, args.public)
    if args.card:
        make_card(args.out, args.public)
    (args.out / "stats.json").write_text(json.dumps(stats, indent=1) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in stats.items() if k != "manifest"}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
