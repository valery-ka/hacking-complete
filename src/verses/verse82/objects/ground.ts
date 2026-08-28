import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "box",
        position: { x: 0, y: 0, z: 50 },
        size: { w: SURFACE_SETTINGS.w, h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.71, g: 0.67, b: 0.53, a: 0 },
    },
    {
        type: "dodecagon",
        position: { x: 0, y: -0.002, z: 88.25 },
        size: { h: 1, d: 50 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
        disable_receive_shadows: true,
    },
];
