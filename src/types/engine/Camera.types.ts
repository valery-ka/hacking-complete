export type CameraLockAxis = "x" | "y" | "z";

export interface ArcCameraConfig {
    trigger_id?: number;
    fov?: number;
    target: { x: number; y: number; z: number };
    alpha: { value: number; lower: number; upper: number };
    beta: { value: number; lower: number; upper: number };
    radius: number;
    is_orthographic?: boolean;
    orthbounds_increment?: number;
    no_follow?: boolean;
    fix_player_view?: boolean;
    /** Axes of cameraTarget that stay at the player's initial position instead of following. */
    lock_axes?: CameraLockAxis[];
}

export type CameraConfig = ArcCameraConfig;
