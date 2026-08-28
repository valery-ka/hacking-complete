import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    {
        trigger_id: 0,
        target: { x: 0, y: 2, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 1.1, lower: 0, upper: 2 * Math.PI },
        radius: 10,
        fov: 1,
    },
    {
        trigger_id: 0,
        target: { x: 0, y: 2, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 1.1, lower: 0, upper: 2 * Math.PI },
        radius: 10,
        fov: 1,
    },
];
