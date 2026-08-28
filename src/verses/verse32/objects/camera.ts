import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    {
        trigger_id: 0,
        target: { x: 0, y: 0, z: 0 },
        alpha: { value: 5.5, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0.8, lower: 0, upper: 2 * Math.PI },
        radius: 20,
        fov: 1,
        is_orthographic: true,
    },
    {
        trigger_id: 0,
        target: { x: 0, y: 0, z: 0 },
        alpha: { value: 5.5, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0.8, lower: 0, upper: 2 * Math.PI },
        radius: 20,
        fov: 1,
        is_orthographic: true,
    },
];
