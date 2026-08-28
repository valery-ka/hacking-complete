import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";

function generateWallBorderGrid({
    gridSize = 24,
    y = 500.75,
    wallSize = 1.5,
    gap = 0.25,
}: {
    gridSize?: number;
    wallSize?: number;
    gap?: number;
    y?: number;
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
                    pool: 0,
                    spawn: { on_start: true, on_update: false },
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
                is_lava: true,
                disable_physics: true,
            });
        }
    }

    return walls;
}

export const walls: WallConfig[] = [
    ...generateWallBorderGrid({ gridSize: 24, y: 5.75 }),

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: -23.35, y: 5.45, z: 0 },
        size: { w: 5, h: 1, d: 50 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 23.35, y: 5.45, z: 0 },
        size: { w: 5, h: 1, d: 50 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: 23.35 },
        size: { w: 50, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.45, z: -23.35 },
        size: { w: 50, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    },

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 20.25, y: 5.45, z: 0 },
        size: { w: 1.5, h: 1.5, d: 41.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: -20.25, y: 5.45, z: 0 },
        size: { w: 1.5, h: 1.5, d: 41.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 0, y: 5.45, z: 20.25 },
        size: { w: 41.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box-invisible",
        position: { x: 0, y: 5.45, z: -20.25 },
        size: { w: 41.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
];
