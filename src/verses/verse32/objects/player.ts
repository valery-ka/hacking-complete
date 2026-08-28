import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 0,
        type: "light",
        start_position: { x: -5.25, y: 3, z: -60 },
        camera: { id: 0, type: "follow" },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        hover_factor: 3.33,
        controls: { hand: "left", inverted_xy: [false, false], inverted_rot: false },
        shooter_bullets: "light",
    },
];
