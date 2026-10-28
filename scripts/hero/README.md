# Hero: one world in 2D and 3D

`render_hero.py` makes the home page's 2D / 3D pair in `public/hero/`. Everything it draws
comes from Preponderous projects:

| File | What it is | Made with |
| --- | --- | --- |
| `hero/roam-2d.png` | The world from above, 408 × 408 (8 px a tile) | [Roam](https://github.com/Preponderous-Software/roam)'s own `RoomJsonReaderWriter` and `Room.drawWithOffset` through its `PygameRenderer` (SDL dummy driver), no HUD or player |
| `hero/roam-3d.jpg`, `hero/roam-3d.gif` | The same world in 3D at noon (640 × 640), and one day as a 36-frame loop (420 × 420) | [roam-usd](https://github.com/Preponderous-Software/roam-usd)'s USD export, read with `usd-core` and rendered headless by [Strata](https://github.com/Preponderous-Software/strata) 0.6.0 through its Python binding (the release library, SHA-256 checked) |

The world is roam-usd's seed 6, radius 1 (3 × 3 rooms), no caves, generated with Roam's own
generator at Roam `224c35a` and roam-usd `17fceba` on Python 3.12. roam-usd seeds Python's
`random` module, so it is a world as roam-usd generates it, not one the game can recreate by seed.

The 3D frames draw each tile and structure as a cube with its prototype's extent and display
colour from the stage, each room's ground as a slab, and each creature as an upright card with
Roam's own sprite. The sun follows a Roam-style day (sunrise, noon, dusk, a night lit by the
home's torch, dawn); the sky colours are decoration.

## Reproducing

```bash
pip install usd-core numpy pillow "pygame>=2.6.1" structlog jsonschema \
  "git+https://github.com/Preponderous-Software/roam-usd@17fcebaa012a5bfd5d5c5962eb4112f6d6990b93" \
  "strata-engine @ git+https://github.com/Preponderous-Software/strata@v0.6.0#subdirectory=bindings/python"
git clone https://github.com/Preponderous-Software/roam && git -C roam checkout 224c35a
export SDL_VIDEODRIVER=dummy SDL_AUDIODRIVER=dummy
export LIBGL_ALWAYS_SOFTWARE=1 GALLIUM_DRIVER=llvmpipe   # without a GPU
roam-usd generate --roam roam --seed 6 --radius 1 --cave-depth 0 --keep-saves -o out/
python scripts/hero/render_hero.py --roam roam --stage out/seed_6.usda --save out/seed_6_save \
  -o out/hero --public public
```

Two runs on the same inputs wrote byte-identical files. About 25 s on a 20-thread machine with
Mesa llvmpipe.
