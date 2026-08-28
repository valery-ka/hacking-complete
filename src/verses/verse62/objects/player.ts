import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS_1 } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 0,
        type: "light",
        start_position: { x: 0, y: 0, z: 0 },
        start_rotation: -Math.PI / 2,
        camera: { id: 0, type: "fixed" },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS_1.h },
        is_inside_ground: false,
        hover_factor: 10.35,
        controls: {
            hand: "left",
            inverted_xy: [false, false],
            inverted_rot: false,
            lock_rotation: true,
        },
        shooter_bullets: "light",
    },
];
