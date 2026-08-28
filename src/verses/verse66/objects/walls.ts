import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";

const OFFSET = 18.25;
const BOX_SIZE = 1.5;

export function generateWallsOnCylinder(longitudeRad: number): WallConfig[] {
    const longitude = longitudeRad + Math.PI / 2;
    const longitudeDeg = (longitude * 180) / Math.PI;

    const x = OFFSET * Math.cos(longitude);
    const z = OFFSET * Math.sin(longitude);

    const tangentAngle = longitudeDeg + 90;

    const yOffsets = [-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8];

    return yOffsets.map((yOffset) => ({
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: x, y: yOffset, z: z },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: tangentAngle, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    }));
}

export const walls: WallConfig[] = [
    ...generateWallsOnCylinder(-Math.PI / 2),
    ...generateWallsOnCylinder(0),
    ...generateWallsOnCylinder(Math.PI / 2),

    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 0, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    //
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 1.85, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 3.7, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 5.55, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 7.4, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 9.25, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 11.1, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 12.95, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: 14.8, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    //
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -1.85, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -3.7, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -5.55, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -7.4, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -9.25, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -11.1, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -12.95, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    {
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        type: "box",
        position: { x: 0, y: -14.8, z: -OFFSET },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
];
