import { LightConfig } from "types/engine/Light.types";

export const light: LightConfig[] = [
    {
        type: "directional",
        name: "aboveground-1",
        intensity: 0.5,
        position: { x: 0, y: 10, z: 0 },
        target: { x: 0, y: -1, z: 0 },
        castShadow: true,
        shadowType: "static",
    },
    {
        type: "directional",
        name: "aboveground-for-dynamic-objects-1",
        intensity: 0.001,
        position: { x: 0, y: 105, z: 0 },
        target: { x: 0, y: -1, z: 0 },
        castShadow: true,
        shadowType: "dynamic",
    },

    {
        type: "directional",
        name: "aboveground-2",
        intensity: 0.5,
        position: { x: 0, y: -10, z: 0 },
        target: { x: 0, y: 1, z: 0 },
        castShadow: true,
        shadowType: "static",
    },
    {
        type: "directional",
        name: "aboveground-for-dynamic-objects-2",
        intensity: 0.001,
        position: { x: 0, y: -105, z: 0 },
        target: { x: 0, y: 1, z: 0 },
        castShadow: true,
        shadowType: "dynamic",
    },
];
