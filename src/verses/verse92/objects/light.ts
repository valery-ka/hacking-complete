import { LightConfig } from "types/engine/Light.types";

export const light: LightConfig[] = [
    {
        type: "directional",
        name: "main",
        intensity: 0.3,
        position: { x: 0, y: 20, z: -20 },
        target: { x: 0, y: -20, z: 20 },
        castShadow: false,
        shadowType: "static",
        parentName: "arc-rotate-camera",
    },
];
