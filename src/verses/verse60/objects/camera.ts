import { CameraConfig } from "types/engine/Camera.types";

export const camera: CameraConfig[] = [
    {
        trigger_id: 0,
        target: { x: 0, y: 10, z: 0 },
        alpha: { value: -Math.PI / 2, lower: 0, upper: 2 * Math.PI },
        beta: { value: 0.65, lower: 0, upper: 2 * Math.PI },
        radius: 40,
        fov: 1,
        is_orthographic: true,
        orthbounds_increment: 1.5,
        fix_player_view: true,
    },
];
