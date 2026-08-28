import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    {
        trigger_id: 0,
        target: { x: 0, y: 8, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0.4336, lower: 0, upper: 2 * Math.PI },
        radius: 23.171,
        fov: 1,
    },
    {
        trigger_id: 10,
        target: { x: 0, y: 5.25, z: 115 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0, lower: 0, upper: 2 * Math.PI },
        radius: 75,
        fov: 1,
        no_follow: true,
    },
    {
        trigger_id: 20,
        target: { x: 0, y: 3, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 1.5, lower: 0, upper: 2 * Math.PI },
        radius: 12.5,
        fov: 1,
    },
    // {
    //     trigger_id: 20,
    //     target: { x: 0, y: 5.25, z: 0 },
    //     alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
    //     beta: { value: 0, lower: 0, upper: 2 * Math.PI },
    //     radius: 75,
    //     fov: 1,
    // },
];
