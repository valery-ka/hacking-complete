import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 0,
        type: "light",
        start_position: { x: -2, y: 0, z: -6 },
        camera: { id: 0, type: "follow" },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        hover_factor: 0.25,
        controls: { hand: "left", inverted_xy: [false, false], inverted_rot: false },
        shooter_bullets: "light",
    },
    {
        id: 1,
        type: "dark",
        start_position: { x: 2, y: 0, z: -6 },
        camera: { id: 1, type: "follow" },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        hover_factor: 0.25,
        controls: { hand: "right", inverted_xy: [false, false], inverted_rot: false },
        shooter_bullets: "dark",
    },
];
