import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR } from "core_constants";
import { SURFACE_SETTINGS_1, SURFACE_SETTINGS_2 } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "box",
        position: { x: 0, y: 10, z: 0 },
        size: { w: SURFACE_SETTINGS_1.w, h: SURFACE_SETTINGS_1.h, d: SURFACE_SETTINGS_1.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "box",
        position: { x: -22.5, y: 10, z: 0 },
        size: { w: SURFACE_SETTINGS_2.w, h: SURFACE_SETTINGS_2.h, d: SURFACE_SETTINGS_2.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
];
