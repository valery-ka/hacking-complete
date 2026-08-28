import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";

const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export function generateWallFromPattern({
    pattern,
    center,
    type = "box",
    step = 1.75,
    rotationY = 0,
    boxSize = { w: 1.5, h: 1.5, d: 1.5 },
    baseConfig = {
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: true,
    },
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
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
            });
        }
    }

    return result;
}

const correction = 2.5;

export const walls: WallConfig[] = [
    ...generateWallFromPattern({
        pattern: ["*     ", " *    ", "  *   ", "   *  ", "    * ", "     *"],
        center: { x: -9.8, y: 11.0, z: 9.8 - correction },
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: true,
            disable_physics: true,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["     *", "    * ", "   *  ", "  *   ", " *    ", "*     "],
        center: { x: 9.8, y: 11.0, z: 9.8 - correction },
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: true,
            disable_physics: true,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["*     ", " *    ", "  *   ", "   *  ", "    * ", "     *"],
        center: { x: 9.8, y: 11.0, z: -9.8 + correction },
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: true,
            disable_physics: true,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["     *", "    * ", "   *  ", "  *   ", " *    ", "*     "],
        center: { x: -9.8, y: 11.0, z: -9.8 + correction },
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: true,
            disable_physics: true,
        },
    }),

    ...generateWallFromPattern({
        pattern: ["*     ", " *    ", "  *   ", "   *  ", "    * ", "     *"],
        center: { x: -9.85, y: 11.0, z: 9.85 - correction },
        type: "box-invisible",
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: false,
            disable_physics: false,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["     *", "    * ", "   *  ", "  *   ", " *    ", "*     "],
        center: { x: 9.85, y: 11.0, z: 9.85 - correction },
        type: "box-invisible",
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: false,
            disable_physics: false,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["*     ", " *    ", "  *   ", "   *  ", "    * ", "     *"],
        center: { x: 9.85, y: 11.0, z: -9.85 + correction },
        type: "box-invisible",
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: false,
            disable_physics: false,
        },
    }),
    ...generateWallFromPattern({
        pattern: ["     *", "    * ", "   *  ", "  *   ", " *    ", "*     "],
        center: { x: -9.85, y: 11.0, z: -9.85 + correction },
        type: "box-invisible",
        baseConfig: {
            rotation: { x: 0, y: 0, z: 0 },
            trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
            solid: true,
            is_lava: false,
            disable_physics: false,
        },
    }),

    {
        type: "box-light",
        position: { x: -correction, y: 10.85, z: -correction },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-light",
        position: { x: correction, y: 10.85, z: correction },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: 13 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -13 },
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
];
