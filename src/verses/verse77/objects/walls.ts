import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";
import { WALLS_COLOR } from "core_constants";

function generateWallBorderGrid({
    gridSize = 21,
    y = 500.75,
    wallSize = 1.5,
    gap = 0.25,
    dispose_pool = 0,
    pool = 0,
    spawn = [true, false],
}: {
    gridSize?: number;
    wallSize?: number;
    gap?: number;
    y?: number;
    pool?: number;
    dispose_pool?: number;
    spawn?: [boolean, boolean];
} = {}): WallConfig[] {
    const step = wallSize + gap;
    const half = (gridSize - 1) / 2;

    const walls: WallConfig[] = [];

    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            const isBorder = x === 0 || x === gridSize - 1 || z === 0 || z === gridSize - 1;

            if (!isBorder) continue;

            walls.push({
                trigger: {
                    pool: pool,
                    spawn: { on_start: spawn[0], on_update: spawn[1] },
                    dispose_pool: dispose_pool,
                },
                type: "box",
                position: {
                    x: (x - half) * step,
                    y,
                    z: (z - half) * step,
                },
                size: {
                    w: wallSize,
                    h: wallSize,
                    d: wallSize,
                },
                rotation: { x: 0, y: 0, z: 0 },
                color: WALLS_COLOR,
                solid: true,
                is_lava: false,
            });
        }
    }

    return walls;
}

export const walls: WallConfig[] = [
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: 15.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -15.5 },
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

    ...generateWallBorderGrid({ gridSize: 17, y: 11, pool: 0, spawn: [true, false] }),
];
