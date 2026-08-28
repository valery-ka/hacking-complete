import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    // {
    //     trigger_id: 0,
    //     target: { x: 0, y: 6, z: 0 },
    //     alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
    //     beta: { value: 0.65, lower: 0, upper: 2 * Math.PI },
    //     radius: 20,
    //     fov: 1,
    // },
    {
        trigger_id: 0,
        target: { x: 0, y: 0, z: 10 },
        alpha: { value: 0, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0.6, lower: 0, upper: 2 * Math.PI },
        radius: 25,
        fov: 1,
    },
];
