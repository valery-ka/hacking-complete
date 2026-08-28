import { WallConfig } from "types/static/Wall.types";

import { SURFACE_SETTINGS } from "./settings";

export const walls: WallConfig[] = [
    {
        type: "box-invisible",
        position: { x: 0, y: 0, z: 0 },
        size: { w: SURFACE_SETTINGS.w, h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
        disable_physics: true,
        not_mergeable: true,
    },
    //
    {
        type: "box",
        position: { x: 0, y: 1, z: SURFACE_SETTINGS.d / 2 + 0.5 },
        size: { w: SURFACE_SETTINGS.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box",
        position: { x: 0, y: 1, z: -SURFACE_SETTINGS.d / 2 - 0.5 },
        size: { w: SURFACE_SETTINGS.w + 2, h: 2, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box",
        position: { x: SURFACE_SETTINGS.w / 2 + 0.5, y: 1, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box",
        position: { x: -SURFACE_SETTINGS.w / 2 - 0.5, y: 1, z: 0 },
        size: { w: 1, h: 2, d: SURFACE_SETTINGS.d + 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
];
