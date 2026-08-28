import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "cylinder",
        position: { x: 0, y: 0, z: 0 },
        size: { d: SURFACE_SETTINGS.d, h: SURFACE_SETTINGS.h },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.71, g: 0.67, b: 0.53, a: 0.3 },
    },
];
