import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";
import { WALLS_COLOR } from "core_constants";

type Vec3 = { x: number; y: number; z: number };

export function generateWallBoxGrid(center: Vec3, count: number, pool: number): WallConfig[] {
    const half = (count - 1) / 2;

    const offsets = Array.from({ length: count }, (_, i) => (i - half) * 1.75);

    return offsets.flatMap((dx) =>
        offsets.map((dz) => ({
            type: "box",
            size: { w: 1.5, h: 1.5, d: 1.5 },
            position: {
                x: center.x + dx,
                y: center.y,
                z: center.z + dz,
            },
            rotation: { x: 0, y: 0, z: 0 },
            color: WALLS_COLOR,
            trigger: { pool: pool, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: false,
        })),
    );
}

const OFFSET = 5;

export const walls: WallConfig[] = [
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: 15.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -15.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: 15.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -15.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    //

    ...generateWallBoxGrid({ x: OFFSET, y: 11, z: -OFFSET }, 2, 5),
    ...generateWallBoxGrid({ x: -OFFSET, y: 11, z: OFFSET }, 2, 15),
    ...generateWallBoxGrid({ x: OFFSET, y: 11, z: OFFSET }, 2, 25),
    ...generateWallBoxGrid({ x: -OFFSET, y: 11, z: -OFFSET }, 2, 35),
];
