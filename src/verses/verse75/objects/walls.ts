import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

const DEFAULT_BOX_SIZE = 1.75;

export function generateWallFromPattern({
    pattern,
    center,
    type = "box",
    step = 2.0,
    rotationY = Math.PI,
    boxSize = { w: DEFAULT_BOX_SIZE, h: DEFAULT_BOX_SIZE, d: DEFAULT_BOX_SIZE },
    baseConfig = {
        rotation: { x: 0, y: 0, z: 0 },
        solid: true,
    },
    isLava = false,
    pools = [0],
    state = { on_start: true, on_update: false },
    effective = false,
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
    state?: { on_start: boolean; on_update: boolean };
    effective?: boolean;
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
                    spawn: state,
                    dispose_pool: pools[1],
                },
                size: boxSize,
                is_lava: isLava,
                disable_physics: false,
                effective: effective,
            });
        }
    }

    return result;
}

export const walls: WallConfig[] = [
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 0, y: 0.5, z: -10 },
        size: { w: SURFACE_SETTINGS.w, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 0, y: 0.5, z: 110 },
        size: { w: SURFACE_SETTINGS.w, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: -12.75, y: 0.5, z: 50 },
        size: { w: 15, h: 1, d: 120 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 12.75, y: 0.5, z: 50 },
        size: { w: 15, h: 1, d: 120 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    //

    ...generateWallFromPattern({
        pattern: [" *   "],
        center: { x: 0, y: 1.125, z: 10 },
    }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 12 },
    }),
    ...generateWallFromPattern({
        pattern: ["    *"],
        center: { x: 0, y: 1.125, z: 14 },
    }),
    ...generateWallFromPattern({
        pattern: ["* *  "],
        center: { x: 0, y: 1.125, z: 16 },
    }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 18 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  "],
        center: { x: 0, y: 1.125, z: 20 },
    }),
    ...generateWallFromPattern({
        pattern: [" *   "],
        center: { x: 0, y: 1.125, z: 22 },
    }),
    //
    // ...generateWallFromPattern({
    //     pattern: [" *   "],
    //     center: { x: 0, y: 1.125, z: 28 },
    // }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 30 },
    }),
    ...generateWallFromPattern({
        pattern: [" *   "],
        center: { x: 0, y: 1.125, z: 32 },
    }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 34 },
    }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 36 },
    }),
    //
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 42 },
        isLava: true,
    }),
    ...generateWallFromPattern({
        pattern: ["    *"],
        center: { x: 0, y: 1.125, z: 44 },
    }),
    ...generateWallFromPattern({
        pattern: ["* *  "],
        center: { x: 0, y: 1.125, z: 46 },
    }),
    // ...generateWallFromPattern({
    //     pattern: ["     "],
    //     center: { x: 0, y: 1.125, z: 48 },
    // }),
    ...generateWallFromPattern({
        pattern: ["  *  "],
        center: { x: 0, y: 1.125, z: 50 },
    }),
    ...generateWallFromPattern({
        pattern: ["    *"],
        center: { x: 0, y: 1.125, z: 50 },
        isLava: true,
    }),
    //
    ...generateWallFromPattern({
        pattern: ["**   "],
        center: { x: 0, y: 1.125, z: 56 },
        isLava: true,
    }),
    ...generateWallFromPattern({
        pattern: ["  *  "],
        center: { x: 0, y: 1.125, z: 56 },
    }),
    //             ...generateWallFromPattern({
    //     pattern: ["  *  "],
    //     center: { x: 0, y: 1.125, z: 58 },
    // }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 60 },
    }),
    ...generateWallFromPattern({
        pattern: [" **  "],
        center: { x: 0, y: 1.125, z: 62 },
    }),
    ...generateWallFromPattern({
        pattern: [" *   "],
        center: { x: 0, y: 1.125, z: 64 },
    }),
    ...generateWallFromPattern({
        pattern: ["   * "],
        center: { x: 0, y: 1.125, z: 66 },
    }),
    ...generateWallFromPattern({
        pattern: ["    *"],
        center: { x: 0, y: 1.125, z: 66 },
        isLava: true,
    }),
    ...generateWallFromPattern({
        pattern: ["**  *"],
        center: { x: 0, y: 1.125, z: 68 },
    }),

    ...generateWallFromPattern({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 70 },
        pools: [40],
        state: { on_start: false, on_update: true },
        effective: true,
    }),

    ...generateWallFromPattern({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 90 },
        pools: [999],
        state: { on_start: true, on_update: false },
        effective: true,
    }),
];
