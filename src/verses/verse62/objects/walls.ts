import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS_1, SURFACE_SETTINGS_2 } from "./settings";

const generateZPositions = (count: number, spacing: number = 1.6): number[] => {
    if (count % 2 === 0) {
        const half = count / 2;
        return Array.from({ length: count }, (_, i) => {
            return (i - half + 0.5) * spacing;
        });
    } else {
        const half = Math.floor(count / 2);
        return Array.from({ length: count }, (_, i) => {
            return (i - half) * spacing;
        });
    }
};

const createBoxLine = (
    x: number,
    zOffset: number = 0,
    count: number = 3,
    pool: number,
    spacing: number = 1.6,
): WallConfig[] => {
    const zPositions = generateZPositions(count, spacing);

    return zPositions.map((z) => ({
        type: "box",
        position: { x, y: 11, z: z + zOffset },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: pool, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    }));
};

export const walls: WallConfig[] = [
    // {
    //     type: "box",
    //     position: { x: 0, y: 10.85, z: 0 },
    //     size: { w: 1.5, h: 1.5, d: 1.5 },
    //     rotation: { x: 0, y: 0, z: 0 },
    //     color: { r: 0, g: 0, b: 0, a: 0 },
    //     trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
    //     solid: true,
    //     is_lava: true,
    //     animation: {
    //         name: "bob",
    //         axes: {
    //             x: {
    //                 amplitude: 1.9,
    //                 speed: 75,
    //             },
    //             z: {
    //                 amplitude: 19.5,
    //                 speed: 5,
    //             },
    //         },
    //         frames: 100,
    //         is_linear: true,
    //     },
    //     not_cast_shadow: true,
    // },

    //
    ...createBoxLine(-18.75, 0, 25, 1),
    ...createBoxLine(-25.75, 0, 25, 2),
    ...createBoxLine(-33.25, 0, 25, 3),

    //
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: SURFACE_SETTINGS_1.d / 2 + 0.5 },
        size: { w: SURFACE_SETTINGS_1.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -SURFACE_SETTINGS_1.d / 2 - 0.5 },
        size: { w: SURFACE_SETTINGS_1.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: SURFACE_SETTINGS_1.w / 2 + 0.5, y: 10, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS_1.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -SURFACE_SETTINGS_1.w / 2 - 0.5, y: 10, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS_1.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: -22.5, y: 10, z: SURFACE_SETTINGS_2.d / 2 + 0.5 },
        size: { w: SURFACE_SETTINGS_2.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -22.5, y: 10, z: -SURFACE_SETTINGS_2.d / 2 - 0.5 },
        size: { w: SURFACE_SETTINGS_2.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: SURFACE_SETTINGS_2.w / 2 + 0.5 - 22.5, y: 10, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS_2.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -SURFACE_SETTINGS_2.w / 2 - 0.5 - 22.5, y: 10, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS_2.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
];
