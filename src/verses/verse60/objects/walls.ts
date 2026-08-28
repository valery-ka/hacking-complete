import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";

type Vec3 = { x: number; y: number; z: number };

export function generateWallBoxGrid(center: Vec3): WallConfig[] {
    const STEP = 1.75;
    const SIZE = { w: 1.5, h: 1.5, d: 1.5 };

    const offsets = [-STEP, 0, STEP];

    const base: WallConfig = {
        type: "box",
        size: SIZE,
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
        disable_physics: true,
        position: { x: 0, y: 0, z: 0 },
    };

    const result: WallConfig[] = [];

    for (const dx of offsets) {
        for (const dz of offsets) {
            result.push({
                ...base,
                position: {
                    x: center.x + dx,
                    y: center.y,
                    z: center.z + dz,
                },
            });
        }
    }

    return result;
}

const OFFSET = 6.5;

export const walls: WallConfig[] = [
    {
        type: "box",
        position: { x: -2.5, y: 11, z: 0 },
        size: { w: SURFACE_SETTINGS.w - 5, h: 1.5, d: 2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box",
        position: { x: 17.5, y: 11, z: 0 },
        size: { w: 5, h: 1.5, d: 2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 21, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    ...generateWallBoxGrid({ x: -15, y: 11, z: -10 }),
    {
        type: "box-invisible",
        position: { x: -15, y: 11, z: -10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    ...generateWallBoxGrid({ x: 0, y: 11, z: -10 }),
    {
        type: "box-invisible",
        position: { x: 0, y: 11, z: -10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    ...generateWallBoxGrid({ x: 15, y: 11, z: -10 }),
    {
        type: "box-invisible",
        position: { x: 15, y: 11, z: -10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    ...generateWallBoxGrid({ x: -15, y: 11, z: 10 }),
    {
        type: "box-invisible",
        position: { x: -15, y: 11, z: 10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    ...generateWallBoxGrid({ x: 0, y: 11, z: 10 }),
    {
        type: "box-invisible",
        position: { x: 0, y: 11, z: 10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    ...generateWallBoxGrid({ x: 15, y: 11, z: 10 }),
    {
        type: "box-invisible",
        position: { x: 15, y: 11, z: 10 },
        size: { w: 5, h: 1.5, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: SURFACE_SETTINGS.d / 2 + 0.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -SURFACE_SETTINGS.d / 2 - 0.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: SURFACE_SETTINGS.w / 2 + 0.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -SURFACE_SETTINGS.w / 2 - 0.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
];
