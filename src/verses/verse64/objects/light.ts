import { LightConfig } from "types/engine/Light.types";

export const light: LightConfig[] = [
    {
        type: "directional",
        name: "aboveground",
        intensity: 0.4,
        position: { x: 0, y: 10, z: 0 },
        target: { x: 0, y: -1, z: 0 },
        castShadow: true,
        shadowType: "static",
    },
    {
        type: "directional",
        name: "aboveground-for-dynamic-objects",
        intensity: 0.001,
        position: { x: 0, y: 105, z: 0 },
        target: { x: 0, y: -1, z: 0 },
        castShadow: true,
        shadowType: "dynamic",
    },
];
