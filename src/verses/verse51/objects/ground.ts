import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "box",
        position: { x: 0, y: 0, z: 25 },
        size: { w: SURFACE_SETTINGS.w, h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
];
