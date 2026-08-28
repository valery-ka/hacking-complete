import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

const DEFAULT_BOX_SIZE = 1.5;

export function generateWallFromPattern({
    pattern,
    center,
    type = "box",
    step = 1.75,
    rotationY = Math.PI,
    boxSize = { w: DEFAULT_BOX_SIZE, h: DEFAULT_BOX_SIZE, d: DEFAULT_BOX_SIZE },
    baseConfig = {
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: true,
    },
    disablePhysics = true,
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
    disablePhysics?: boolean;
}) {
    const result: any[] = [];

    const rows = pattern.length;
    const cols = Math.max(...pattern.map((r) => r.length));

    const offsetX = (cols - 1) * step * 0.5;
    const offsetZ = (rows - 1) * step * 0.5;

    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] !== "*") continue;

            const localX = col * step - offsetX;
            const localZ = row * step - offsetZ;

            const rotatedX = localX * cos - localZ * sin;
            const rotatedZ = localX * sin + localZ * cos;

            result.push({
                ...baseConfig,
                type: type,
                position: {
                    x: center.x + rotatedX,
                    y: center.y,
                    z: center.z + rotatedZ,
                },
                rotation: {
                    ...(baseConfig.rotation ?? { x: 0, y: 0, z: 0 }),
                },
                size: boxSize,
                disable_physics: disablePhysics,
            });
        }
    }

    return result;
}

export const walls: WallConfig[] = [
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 13.625, y: 5.75, z: 60.85 },
        size: { w: 31.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 3.9, y: 5.75, z: 43.2 },
        size: { w: 12, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 25, y: 5.75, z: 43.2 },
        size: { w: 12, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: -1.35, y: 5.75, z: 52 },
        size: { w: 1.5, h: 1.5, d: 16.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 28.6, y: 5.75, z: 52 },
        size: { w: 1.5, h: 1.5, d: 16.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -8.8, y: 5.45, z: -25 },
        size: { w: 80.4, h: 1, d: 7 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: 8.5 },
        size: { w: 50, h: 1, d: 8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -41.06, y: 5.45, z: 8.5 },
        size: { w: 15.86, h: 1, d: 8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 18.15, y: 5.45, z: -14.55 },
        size: { w: 26.3, h: 1, d: 14 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -29, y: 5.45, z: -14.55 },
        size: { w: 40, h: 1, d: 14 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 25.2, y: 5.45, z: 16.7 },
        size: { w: 12.3, h: 1, d: 51.4 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -46.5, y: 5.45, z: 28.89 },
        size: { w: 5, h: 1, d: 75.72 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -7.4, y: 5.45, z: 14.9 },
        size: { w: 25.2, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -7.4, y: 5.45, z: 24.9 },
        size: { w: 25.2, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -5, y: 5.45, z: 29.9 },
        size: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -17.5, y: 5.45, z: 39.9 },
        size: { w: 55, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    ...generateWallFromPattern({
        pattern: [
            "******************",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "*                *",
            "******     *******",
        ],
        center: { x: 13.6, y: 5.75, z: 52 },
    }),

    ...generateWallFromPattern({
        pattern: ["****************"],
        center: { x: -4, y: 5.75, z: 36.6 },
    }),
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: -4, y: 5.75, z: 36.7 },
        size: { w: 27.75, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    ...generateWallFromPattern({
        pattern: ["****************"],
        center: { x: -4, y: 5.75, z: 33.2 },
    }),
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: -4, y: 5.75, z: 33.1 },
        size: { w: 27.75, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 38, y: 5.45, z: 19.16 },
        size: { w: 17.6, h: 1, d: 95.17 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -7.5, y: 5.45, z: 64.25 },
        size: { w: 75, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -23.61, y: 5.45, z: 52.17 },
        size: { w: 42.78, h: 1, d: 20.64 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    ///
    {
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        type: "box",
        position: { x: 14.5, y: 5.75, z: 38.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        effective: true,
    },
    {
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        type: "box",
        position: { x: 14.5 - 3.5, y: 5.75, z: 38.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        effective: true,
    },
    {
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        type: "box",
        position: { x: 14.5 + 3.5, y: 5.75, z: 38.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        effective: true,
    },
    {
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        type: "box",
        position: { x: 14.5 - 1.75, y: 5.75, z: 38.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        effective: true,
    },
    {
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        type: "box",
        position: { x: 14.5 + 1.75, y: 5.75, z: 38.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        effective: true,
    },
];
