import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";

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
        solid: true,
        // disable_physics: true,
        effective: true,
    },
    isLava = false,
    pools = [0],
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
    isLava?: boolean;
    pools?: number[];
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
                trigger: {
                    pool: pools[0],
                    spawn: { on_start: false, on_update: true },
                    dispose_pool: pools[1],
                },
                size: boxSize,
                is_lava: isLava,
            });
        }
    }

    return result;
}

export const walls: WallConfig[] = [
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: -30 },
        size: { w: 100, h: 1, d: 15 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -10.9, y: 5.45, z: 23 },
        size: { w: 12, h: 1, d: 8.8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 10.9, y: 5.45, z: 23 },
        size: { w: 12, h: 1, d: 8.8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -32, y: 5.45, z: -1.25 },
        size: { w: 36, h: 1, d: 51.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 32, y: 5.45, z: -1.25 },
        size: { w: 36, h: 1, d: 51.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -11.5, y: 5.45, z: -14.25 },
        size: { w: 12, h: 1, d: 17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 11.5, y: 5.45, z: -14.25 },
        size: { w: 12, h: 1, d: 17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    ...generateWallFromPattern({
        pattern: ["*", "*", "*", "*", "*"],
        center: { x: -16, y: 5.75, z: 32 },
        pools: [1, 200],
    }),
    ...generateWallFromPattern({
        pattern: ["*", "*", "*", "*", "*"],
        center: { x: 16, y: 5.75, z: 32 },
        pools: [2],
    }),

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: 42.5 },
        size: { w: 34, h: 1, d: 11.8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -41, y: 5.45, z: 48.5 },
        size: { w: 18, h: 1, d: 50 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 45, y: 5.45, z: 70 },
        size: { w: 10, h: 1, d: 60 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -12.06, y: 5.45, z: 56.75 },
        size: { w: 40, h: 1, d: 33.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 2.9, y: 5.45, z: 44.61 },
        size: { w: 34, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 37.62, y: 5.45, z: 44.61 },
        size: { w: 17.23, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 41, y: 5.45, z: 34.76 },
        size: { w: 18, h: 1, d: 22.52 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: 77 },
        size: { w: 150, h: 1, d: 8.8 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    ...generateWallFromPattern({
        pattern: ["*****"],
        center: { x: 24.5, y: 5.75, z: 46 },
        isLava: true,
        pools: [3],
    }),
    {
        type: "box-invisible",
        position: { x: 24.5, y: 5.75, z: 46 },
        size: { w: 10, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 3, spawn: { on_start: false, on_update: true } },
        solid: true,
        is_lava: false,
    },

    //
    {
        type: "box",
        position: { x: 10.27, y: 5.75, z: 70.15 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 10.1, y: 5.75, z: 51.15 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 15.33, y: 5.75, z: 51.78 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 19.47, y: 5.75, z: 51.5 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 23.38, y: 5.75, z: 51.23 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 27.57, y: 5.75, z: 52.61 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 32.71, y: 5.75, z: 51.56 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 37.11, y: 5.75, z: 52.64 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 34.84, y: 5.75, z: 57.64 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 33.13, y: 5.75, z: 62.08 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 32.98, y: 5.75, z: 66.88 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 28.89, y: 5.75, z: 65.74 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 22.48, y: 5.75, z: 66.97 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 16.36, y: 5.75, z: 64.03 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 12.13, y: 5.75, z: 66.33 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 13.26, y: 5.75, z: 61.12 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 12.03, y: 5.75, z: 56.45 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 16.69, y: 5.75, z: 58.57 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 20.73, y: 5.75, z: 55.07 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 20.84, y: 5.75, z: 61.6 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 25.33, y: 5.75, z: 57.09 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 30.11, y: 5.75, z: 59.04 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 26.87, y: 5.75, z: 63.09 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 26.84, y: 5.75, z: 69.62 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 36.88, y: 5.75, z: 69.69 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 36.75, y: 5.75, z: 64.58 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 19.42, y: 5.75, z: 69.44 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 14.39, y: 5.75, z: 68.97 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
    {
        type: "box",
        position: { x: 10.27, y: 5.75, z: 63.65 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 15, spawn: { on_start: true, on_update: false }, dispose_pool: 200 },
        solid: true,
        is_lava: true,
    },
];
