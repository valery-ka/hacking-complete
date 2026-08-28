import { WallConfig } from "types/static/Wall.types";

export const walls: WallConfig[] = [
    {
        type: "cylinder-base",
        position: { x: 0, y: 0, z: 0 },
        size: { w: 21.25, h: 1.5, d: 21.25 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 999, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
];
