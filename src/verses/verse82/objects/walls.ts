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
        solid: true,
    },
    isLava = false,
    pools = [0],
    state = { on_start: true, on_update: false },
    disablePhysics = false,
    effective = false,
    not_cast_shadow = false,
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
    disablePhysics?: boolean;
    effective?: boolean;
    not_cast_shadow?: boolean;
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
                not_mergeable: true,
                effective: effective,
                not_cast_shadow: not_cast_shadow,
            });
        }
    }

    return result;
}

const wall = (
    p: { x: number; y: number; z: number },
    s: { w: number; h: number; d: number },
): WallConfig => ({
    trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
    type: "box-base",
    position: p,
    size: s,
    rotation: { x: 0, y: 0, z: 0 },
    color: WALLS_COLOR,
    solid: true,
    is_lava: false,
    disable_physics: true,
    // not_mergeable: true,
    not_cast_shadow: true,
});

const physicsWall = (
    p: { x: number; y: number; z: number },
    s: { w: number; h: number; d: number },
): WallConfig => ({
    trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
    type: "box-invisible",
    position: p,
    size: s,
    rotation: { x: 0, y: 0, z: 0 },
    color: WALLS_COLOR,
    solid: true,
    is_lava: false,
    // disable_physics: true,
    // not_mergeable: true,
});

export const walls: WallConfig[] = [
    // POOLED
    ...generateWallFromPattern({
        pattern: ["*******"],
        center: { x: 0, y: 1.25, z: -4 },
        pools: [10],
    }),
    ...generateWallFromPattern({
        pattern: ["*******"],
        center: { x: 0, y: 1.25, z: 36 },
        pools: [20],
    }),

    ...generateWallFromPattern({
        pattern: ["*******"],
        center: { x: 0, y: 1.25, z: 64 },
        pools: [905],
        state: { on_start: false, on_update: true },
        effective: true,
        not_cast_shadow: true,
    }),
    {
        type: "cylinder-invisible",
        position: { x: 0, y: 0, z: 88.25 },
        size: { w: 50.5, h: 20, d: 50.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 905, spawn: { on_start: false, on_update: true } },
        solid: false,
        is_lava: false,
        effective: false,
    },

    // STATIC
    wall({ x: 0, y: 0, z: -30 }, { w: 12.5, h: 1, d: 30 }),
    wall({ x: 0, y: 0, z: 50 }, { w: 12.5, h: 1, d: 30 }),
    wall({ x: -20, y: 0, z: 30 }, { w: 30, h: 1, d: 9 }),
    wall({ x: 0, y: 0, z: 30 }, { w: 11, h: 1, d: 10 }),
    wall({ x: 20, y: 0, z: 30 }, { w: 30, h: 1, d: 9 }),
    wall({ x: 0, y: 0, z: 10 }, { w: 12.5, h: 1, d: 30 }),
    wall({ x: 0, y: 0, z: -10 }, { w: 11, h: 1, d: 10 }),
    wall({ x: 20, y: 0, z: -10 }, { w: 30, h: 1, d: 9 }),
    wall({ x: -20, y: 0, z: -10 }, { w: 30, h: 1, d: 9 }),

    //
    wall({ x: 23.7, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 28.6, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 33.5, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 13.9, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 9, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 18.8, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),

    //
    wall({ x: -23.7, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -28.6, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -33.5, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -13.9, y: 0, z: -5.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -9, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -18.8, y: 0, z: -14.75 }, { w: 3, h: 1, d: 0.5 }),

    //
    wall({ x: 23.7, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 28.6, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 33.5, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 13.9, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 9, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: 18.8, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),

    //
    wall({ x: -23.7, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -28.6, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -33.5, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -13.9, y: 0, z: 34.75 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -9, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),
    wall({ x: -18.8, y: 0, z: 25.25 }, { w: 3, h: 1, d: 0.5 }),

    //
    physicsWall({ x: 0, y: 0, z: -45.5 }, { w: 15, h: 5, d: 1 }),
    // physicsWall({ x: 0, y: 0, z: 65.5 }, { w: 15, h: 5, d: 1 }),

    //
    physicsWall({ x: 9.338, y: 0, z: -5 }, { w: 6.133, h: 5, d: 1 }),
    physicsWall({ x: 13.931, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 18.795, y: 0, z: -5 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 28.622, y: 0, z: -5 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 33.468, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 23.704, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),

    //
    physicsWall({ x: -9.338, y: 0, z: -5 }, { w: 6.133, h: 5, d: 1 }),
    physicsWall({ x: -13.931, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -18.795, y: 0, z: -5 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -28.622, y: 0, z: -5 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -33.468, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -23.704, y: 0, z: -15 }, { w: 6.695, h: 5, d: 1 }),

    //
    physicsWall({ x: 9.338, y: 0, z: 35 }, { w: 6.133, h: 5, d: 1 }),
    physicsWall({ x: 13.931, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 18.795, y: 0, z: 35 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 28.622, y: 0, z: 35 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 33.468, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: 23.704, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),

    //
    physicsWall({ x: -9.338, y: 0, z: 35 }, { w: 6.133, h: 5, d: 1 }),
    physicsWall({ x: -13.931, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -18.795, y: 0, z: 35 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -28.622, y: 0, z: 35 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -33.468, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),
    physicsWall({ x: -23.704, y: 0, z: 25 }, { w: 6.695, h: 5, d: 1 }),

    physicsWall({ x: 6.75, y: 0, z: 50 }, { w: 1, h: 5, d: 30 }),
    physicsWall({ x: -6.75, y: 0, z: 50 }, { w: 1, h: 5, d: 30 }),

    physicsWall({ x: 6.75, y: 0, z: 10 }, { w: 1, h: 5, d: 30 }),
    physicsWall({ x: -6.75, y: 0, z: 10 }, { w: 1, h: 5, d: 30 }),

    physicsWall({ x: 6.75, y: 0, z: -30 }, { w: 1, h: 5, d: 30 }),
    physicsWall({ x: -6.75, y: 0, z: -30 }, { w: 1, h: 5, d: 30 }),

    physicsWall({ x: 35.45, y: 0, z: 30.65 }, { w: 1, h: 5, d: 10.3 }),
    physicsWall({ x: -35.45, y: 0, z: 30.65 }, { w: 1, h: 5, d: 10.3 }),

    physicsWall({ x: 35.45, y: 0, z: -9.35 }, { w: 1, h: 5, d: 10.3 }),
    physicsWall({ x: -35.45, y: 0, z: -9.35 }, { w: 1, h: 5, d: 10.3 }),

    physicsWall({ x: -21.86, y: 0, z: 35.5 }, { w: 29.58, h: 5, d: 1 }),
    physicsWall({ x: 21.86, y: 0, z: 35.5 }, { w: 29.58, h: 5, d: 1 }),

    physicsWall({ x: -21.86, y: 0, z: 24.5 }, { w: 29.58, h: 5, d: 1 }),
    physicsWall({ x: 21.86, y: 0, z: 24.5 }, { w: 29.58, h: 5, d: 1 }),

    physicsWall({ x: -21.86, y: 0, z: -4.5 }, { w: 29.58, h: 5, d: 1 }),
    physicsWall({ x: 21.86, y: 0, z: -4.5 }, { w: 29.58, h: 5, d: 1 }),

    physicsWall({ x: -21.86, y: 0, z: -15.5 }, { w: 29.58, h: 5, d: 1 }),
    physicsWall({ x: 21.86, y: 0, z: -15.5 }, { w: 29.58, h: 5, d: 1 }),

    physicsWall({ x: -6.5, y: 0, z: -14.75 }, { w: 2, h: 5, d: 0.5 }),
    physicsWall({ x: 6.5, y: 0, z: -14.75 }, { w: 2, h: 5, d: 0.5 }),

    physicsWall({ x: -6.5, y: 0, z: -5.25 }, { w: 2, h: 5, d: 0.5 }),
    physicsWall({ x: 6.5, y: 0, z: -5.25 }, { w: 2, h: 5, d: 0.5 }),

    physicsWall({ x: -6.5, y: 0, z: 25.25 }, { w: 2, h: 5, d: 0.5 }),
    physicsWall({ x: 6.5, y: 0, z: 25.25 }, { w: 2, h: 5, d: 0.5 }),

    physicsWall({ x: -6.5, y: 0, z: 34.75 }, { w: 2, h: 5, d: 0.5 }),
    physicsWall({ x: 6.5, y: 0, z: 34.75 }, { w: 2, h: 5, d: 0.5 }),
];
