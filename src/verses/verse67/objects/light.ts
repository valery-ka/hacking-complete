import { LightConfig } from "types/engine/Light.types";

export const light: LightConfig[] = [
    {
        type: "directional",
        name: "player-1",
        intensity: 0.3,
        position: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 20 },
        castShadow: false,
        shadowType: "static",
        parentName: "arc-rotate-camera-0",
    },
    {
        type: "directional",
        name: "player-2",
        intensity: 0.3,
        position: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: -20 },
        castShadow: false,
        shadowType: "static",
        parentName: "arc-rotate-camera-1",
    },
];
