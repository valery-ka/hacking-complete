import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR, WALLS_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "box",
        position: { x: 0, y: 0, z: 0 },
        size: { w: SURFACE_SETTINGS.w, h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "box",
        position: { x: 0, y: 5.5, z: 39.75 },
        size: { w: 72, h: 2, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        color: WALLS_COLOR,
    },
];
