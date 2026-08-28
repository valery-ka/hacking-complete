import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";

export const walls: WallConfig[] = [
    {
        type: "cylinder-invisible",
        position: { x: 0, y: 0, z: 0 },
        size: { w: SURFACE_SETTINGS.w + 0.5, h: 20, d: SURFACE_SETTINGS.w + 0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
];
