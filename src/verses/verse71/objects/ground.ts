import { GroundConfig } from "types/static/Ground.types";

import { GROUND_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

export const ground: GroundConfig[] = [
    {
        type: "dodecagon",
        position: { x: 0, y: 0, z: 0 },
        size: { h: SURFACE_SETTINGS.h, d: SURFACE_SETTINGS.d },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },

    {
        type: "dodecagon",
        position: { x: 0, y: 0, z: 25 },
        size: { h: 0.5, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "dodecagon",
        position: { z: 7.725, y: 0, x: 23.775 },
        size: { h: 0.5, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "dodecagon",
        position: { z: -20.225, y: 0, x: 14.695 },
        size: { h: 0.5, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "dodecagon",
        position: { z: -20.225, y: 0, x: -14.695 },
        size: { h: 0.5, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
    {
        type: "dodecagon",
        position: { z: 7.725, y: 0, x: -23.775 },
        size: { h: 0.5, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: GROUND_COLOR,
    },
];
