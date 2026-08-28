import { WallConfig } from "types/static/Wall.types";
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
        effective: false,
    },
    isLava = false,
    pools = [0],
    state = { on_start: true, on_update: false },
    disablePhysics = false,
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
    isLava?: boolean;
    disablePhysics?: boolean;
    pools?: number[];
    state?: { on_start: boolean; on_update: boolean };
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
                disable_physics: disablePhysics,
            });
        }
    }

    return result;
}

export const walls: WallConfig[] = [
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: 11.25 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -11.25 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: 14, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -14, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    ...generateWallFromPattern({
        pattern: [
            "*****************",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*               *",
            "*****************",
        ],
        center: { x: 0, y: 10.7, z: 0 },
        isLava: true,
        disablePhysics: true,
    }),
    ...generateWallFromPattern({
        pattern: ["****", "*  *", "*  *", "****"],
        center: { x: 0, y: 10.7, z: 0 },
        isLava: true,
        pools: [100],
    }),
];
