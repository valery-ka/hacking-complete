import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    {
        trigger_id: 0,
        target: { x: 0, y: 500, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0, lower: 0, upper: 2 * Math.PI },
        radius: 50,
        fov: 1,
    },
    {
        trigger_id: 0,
        target: { x: 0, y: 500, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0, lower: 0, upper: 2 * Math.PI },
        radius: 50,
        fov: 1,
    },
];
