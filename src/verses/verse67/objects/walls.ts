import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";

const BOX_SIZE = 1.5;
const RADIUS = 17.5;

export function generateWallsOnCylinder(longitudeRad: number, pool: number): WallConfig[] {
    const longitude = longitudeRad + Math.PI / 2;
    const longitudeDeg = (longitude * 180) / Math.PI;

    const x = RADIUS * Math.cos(longitude);
    const z = RADIUS * Math.sin(longitude);

    const tangentAngle = longitudeDeg + 90;

    const yOffsets = [-3.5, -1.75, 0, 1.75, 3.5];

    return yOffsets.map((yOffset) => ({
        trigger: {
            pool: pool,
            spawn: { on_start: true, on_update: false },
        },
        type: "box",
        position: { x: x, y: yOffset, z: z },
        size: { w: BOX_SIZE, h: BOX_SIZE, d: BOX_SIZE },
        rotation: { x: 0, y: tangentAngle, z: 0 },
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    }));
}

export const walls: WallConfig[] = [
    ...generateWallsOnCylinder(Math.PI, 0),
    ...generateWallsOnCylinder((3 * Math.PI) / 2, 1),
    ...generateWallsOnCylinder(0, 2),
    ...generateWallsOnCylinder(Math.PI / 2, 3),
];
