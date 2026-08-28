import { WallConfig } from "types/static/Wall.types";

const DEFAULT_BOX_SIZE = 1.5;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export function generateWallFromPattern({
    pattern,
    center,
    type = "box-dark",
    step = 1.75,
    rotationY = 0,
    boxSize = { w: DEFAULT_BOX_SIZE, h: DEFAULT_BOX_SIZE, d: DEFAULT_BOX_SIZE },
    baseConfig = {
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        is_lava: false,
    },
    solid = true,
    disable_physics = false,
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
    solid?: boolean;
    disable_physics?: boolean;
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
                    y: (baseConfig.rotation?.y ?? 0) + radToDeg(rotationY),
                },
                size: boxSize,
                solid: solid,
                disable_physics: disable_physics,
            });
        }
    }

    return result;
}

export const walls: WallConfig[] = [
    {
        type: "box-base",
        position: { x: 0, y: -9.5, z: 0 },
        size: { w: 100, h: 1.0, d: 200 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-invisible",
        position: { x: -8, y: 0, z: 0 },
        size: { w: 1.0, h: 20, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 8, y: 0, z: 0 },
        size: { w: 1.0, h: 20, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 0, z: -63 },
        size: { w: 20.0, h: 20, d: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 0, z: 63 },
        size: { w: 20.0, h: 20, d: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },

    //
    // {
    //     type: "box-dark",
    //     position: { x: 0, y: 3, z: 0 },
    //     size: { w: 15, h: 4, d: 125 },
    //     rotation: { x: 0, y: 0, z: 0 },
    //     color: { r: 0, g: 0, b: 0, a: 0 },
    //     trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
    //     solid: false,
    //     is_lava: false,
    //     disable_physics: true,
    // },
    {
        type: "box-dark",
        position: { x: 0, y: -2, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: 0, y: -7, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: -9, y: 3, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -9, y: -2, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -9, y: -7, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: 9, y: 3, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: 9, y: -2, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: 9, y: -7, z: 0 },
        size: { w: 0.75, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    //
    {
        type: "box-ui",
        position: { x: 25, y: 3, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 25, y: -2, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 25, y: -7, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-ui",
        position: { x: -25, y: 3, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: -25, y: -2, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: -25, y: -7, z: 0 },
        size: { w: 15, h: 4, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    //
    ...generateWallFromPattern({
        center: { x: 0, y: 5.7, z: -55 },
        pattern: ["****", "****", "****", "****"],
        type: "box",
    }),

    ...generateWallFromPattern({
        center: { x: 0, y: 5.7, z: -26.125 },
        pattern: [
            "*   ***    *      *    **",
            "*       **  *     **     ",
            "***                *  *  ",
            "*   * *    *            *",
        ],
        type: "box",
        rotationY: Math.PI / 2,
    }),

    //
    ...generateWallFromPattern({
        center: { x: 25, y: 5.7, z: -55 },
        pattern: ["****", "****", "****", "****"],
        step: 1.5,
        solid: false,
        disable_physics: true,
    }),

    ...generateWallFromPattern({
        center: { x: 25, y: 5.7, z: -29.125 },
        pattern: [
            "*                        ",
            "*  *   * **              ",
            "*  *                     ",
            "*   *  ****              ",
        ],
        rotationY: Math.PI / 2,
        step: 1.5,
        solid: false,
        disable_physics: true,
    }),

    ...generateWallFromPattern({
        center: { x: -25, y: 5.7, z: -55 },
        pattern: ["****", "****", "****", "****"],
        step: 1.5,
        solid: false,
        disable_physics: true,
    }),

    ...generateWallFromPattern({
        center: { x: -25, y: 5.7, z: -29.125 },
        pattern: [
            "*          ****      *** ",
            "*  *   * **    **     * *",
            "*  *        **        * *",
            "*   *  ****       * ***  ",
        ],
        rotationY: Math.PI / 2,
        step: 1.5,
        solid: false,
        disable_physics: true,
    }),

    //
    {
        type: "box-ui",
        position: { x: 0, y: 3, z: -75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: -75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: -75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-ui",
        position: { x: 0, y: 3, z: -80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: -80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: -80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: -3.75, y: 3, z: -67.5 },
        size: { w: 2, h: 2, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: 3.75, y: 3, z: -67.5 },
        size: { w: 2, h: 2, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    //

    {
        type: "box-ui",
        position: { x: 0, y: 3, z: 75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: 75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: 75 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-ui",
        position: { x: 0, y: 3, z: 80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: 80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: 80 },
        size: { w: 15, h: 4, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: -3.75, y: 3, z: 67.5 },
        size: { w: 2, h: 2, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: 3.75, y: 3, z: 67.5 },
        size: { w: 2, h: 2, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
];
