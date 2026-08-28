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
        type: "box",
        position: { x: 0, y: 5.45, z: -65 },
        size: { w: SURFACE_SETTINGS.w, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: 165 },
        size: { w: SURFACE_SETTINGS.w, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -14.65, y: 5.45, z: 50 },
        size: { w: 15, h: 1, d: 210.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 14.65, y: 5.45, z: 50 },
        size: { w: 15, h: 1, d: 210.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },

    //

    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 1 },
        pools: [10],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 2 },
        pools: [20],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 3 },
        pools: [30],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 4 },
        pools: [40],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 5 },
        pools: [50],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 6 },
        pools: [60],
    }),
    ...generateWallFromPattern({
        pattern: ["********"],
        center: { x: 0, y: 5.75, z: -55 + 26.25 * 7 },
        pools: [70],
    }),
];
