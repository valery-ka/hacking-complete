import { GroundConfig } from "types/static/Ground.types";

import { SURFACE_SETTINGS } from "./settings";
import { GROUND_COLOR } from "core_constants";

export const ground: GroundConfig[] = [
    {
        type: "box",
        position: { x: 0, y: 0, z: 0 },
        size: { w: SURFACE_SETTINGS.w, h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.2, g: 0.19, b: 0.16, a: 1.0 },
    },
    {
        type: "box",
        position: { x: 0, y: -5, z: 0 },
        size: { w: 150, h: 1.0, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "box",
        position: { x: 38.75, y: -1.5, z: 0 },
        size: { w: 62.5, h: 10, d: 125 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
];
